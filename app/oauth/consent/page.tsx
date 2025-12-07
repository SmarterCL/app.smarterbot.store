'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthConsentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const supabase = createClient()
        
        // Get the code from URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          setStatus('error')
          setMessage(`Error de autenticación: ${error}`)
          setTimeout(() => router.push('/sign-in'), 3000)
          return
        }

        if (!code) {
          setStatus('error')
          setMessage('No se recibió código de autorización')
          setTimeout(() => router.push('/sign-in'), 3000)
          return
        }

        // Exchange code for session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (sessionError) {
          setStatus('error')
          setMessage(`Error al iniciar sesión: ${sessionError.message}`)
          setTimeout(() => router.push('/sign-in'), 3000)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Autenticación exitosa. Redirigiendo...')
          
          // Redirect to dashboard
          setTimeout(() => router.push('/dashboard'), 1500)
        }
      } catch (err) {
        console.error('OAuth error:', err)
        setStatus('error')
        setMessage('Error inesperado durante la autenticación')
        setTimeout(() => router.push('/sign-in'), 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Procesando autenticación...
            </h2>
            <p className="text-gray-600">Por favor espera un momento</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Autenticación exitosa!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Error de autenticación
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}
