import { NextRequest, NextResponse } from 'next/server'

type ContactPayload = {
  name?: string
  email?: string
  message?: string
  phone?: string | null
  source?: string | null
  company?: string | null
}

const MAILGUN_API_BASE = "https://api.mailgun.net/v3"
const MAILGUN_VALIDATION_ENDPOINT = "https://api.mailgun.net/v4/address/validate"

async function validateEmail(address: string, apiKey: string) {
  const validationResponse = await fetch(`${MAILGUN_VALIDATION_ENDPOINT}?address=${encodeURIComponent(address)}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
    },
    cache: "no-store",
  })

  if (!validationResponse.ok) {
    const errorText = await validationResponse.text()
    throw new Error(`Mailgun validation error: ${validationResponse.status} ${errorText}`)
  }

  const validation = await validationResponse.json()
  return validation?.is_valid === true
}

async function sendViaMailgun({
  name,
  email,
  company,
  message,
  apiKey,
  domain,
  fromEmail,
  toEmail,
}: {
  name: string
  email: string
  company?: string | null
  message: string
  apiKey: string
  domain: string
  fromEmail: string
  toEmail: string
}) {
  const subject = "Contacto landing Odoo + SmarterOS"
  const html = `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Empresa:</strong> ${company || "N/A"}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `

  const formData = new URLSearchParams()
  formData.append("from", fromEmail)
  formData.append("to", toEmail)
  formData.append("subject", subject)
  formData.append("text", `Nombre: ${name}\nEmail: ${email}\nEmpresa: ${company || "N/A"}\n\n${message}`)
  formData.append("html", html)

  const mailgunResponse = await fetch(`${MAILGUN_API_BASE}/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
    },
    body: formData,
  })

  if (!mailgunResponse.ok) {
    const errorText = await mailgunResponse.text()
    return NextResponse.json({ error: "Error enviando correo", details: errorText }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}

async function sendViaFastApi(url: string, payload: unknown, apiKey?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const responseText = await response.text()
  let responseJson: unknown
  try {
    responseJson = JSON.parse(responseText)
  } catch {
    responseJson = { raw: responseText }
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Error al llamar FastAPI", details: responseJson },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true, fastApi: responseJson })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload
    const name = (body.name || '').toString().trim()
    const email = (body.email || '').toString().trim().toLowerCase()
    const message = (body.message || '').toString().trim()
    const phone = body.phone ? body.phone.toString().trim() : null
    const source = body.source ? body.source.toString().trim() : null
    const company = body.company ? body.company.toString().trim() : null

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const mailgunApiKey = process.env.MAILGUN_API_KEY
    const domain = process.env.MAILGUN_DOMAIN
    const toEmail = process.env.MAILGUN_TO_EMAIL || "smarterbotcl@gmail.com"
    const fromEmail = process.env.MAILGUN_FROM_EMAIL || (domain ? `contact@${domain}` : undefined)
    const fastApiUrl = process.env.FASTAPI_CONTACT_URL
    const fastApiKey = process.env.FASTAPI_API_KEY

    // Validar email con Mailgun si está configurado
    if (mailgunApiKey) {
      try {
        const isValidEmail = await validateEmail(email, mailgunApiKey)
        if (!isValidEmail) {
          return NextResponse.json({ error: "Email inválido según Mailgun" }, { status: 400 })
        }
      } catch (err) {
        console.error("Mailgun validation failed:", err)
        return NextResponse.json(
          { error: "Error validando email en Mailgun" },
          { status: 502 }
        )
      }
    }

    // Si hay FastAPI URL, enviar por allí
    if (fastApiUrl) {
      return sendViaFastApi(fastApiUrl, { name, email, company, message }, fastApiKey)
    }

    // Fallback: enviar por Mailgun directo
    if (!mailgunApiKey || !domain || !fromEmail) {
      return NextResponse.json(
        {
          error:
            "Falta configuración: define FASTAPI_CONTACT_URL o MAILGUN_API_KEY, MAILGUN_DOMAIN y MAILGUN_FROM_EMAIL",
        },
        { status: 500 }
      )
    }

    return sendViaMailgun({ name, email, company, message, apiKey: mailgunApiKey, domain, fromEmail, toEmail })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
