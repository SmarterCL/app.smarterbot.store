# 🚨 FIX URGENTE: Error SSL Clerk - ERR_SSL_VERSION_OR_CIPHER_MISMATCH

## Problema Identificado

Clerk está intentando usar `clerk.smarterbot.store` como dominio, pero:
- ❌ El subdominio no existe en tu DNS
- ❌ No tiene certificado SSL configurado
- ❌ Clerk no puede hacer handshake

## ✅ SOLUCIÓN PASO A PASO

### Opción 1: Usar dominio de Clerk (RECOMENDADO PARA DEV)

1. **Ve al Dashboard de Clerk:**
   - https://dashboard.clerk.com
   - Selecciona tu aplicación

2. **En "Settings" → "Domains":**
   - Asegúrate de que esté usando el dominio por defecto de Clerk
   - Ejemplo: `your-app-name.accounts.dev`

3. **En "Settings" → "Home URLs":**
   ```
   Development: http://localhost:3000
   Production: https://login.smarterbot.store
   ```

4. **En "Settings" → "Allowed redirect URLs":**
   ```
   http://localhost:3000
   http://localhost:3000/*
   https://login.smarterbot.store
   https://login.smarterbot.store/*
   https://app.smarterbot.cl
   https://app.smarterbot.cl/*
   ```

### Opción 2: Configurar Dominio Personalizado (PRODUCCIÓN)

Si quieres usar `clerk.smarterbot.store` (requiere plan Pro de Clerk):

1. **En Dashboard de Clerk → "Settings" → "Domains":**
   - Click en "Add domain"
   - Ingresa: `clerk.smarterbot.store`

2. **Clerk te dará records DNS para configurar:**
   ```
   Tipo: CNAME
   Host: clerk
   Valor: clerk.smarterbot.store.clerk.accounts.dev
   ```

3. **Agrega el CNAME en tu proveedor DNS (Mainkey/Cloudflare):**
   ```bash
   # En Cloudflare:
   clerk    CNAME    clerk.smarterbot.store.clerk.accounts.dev
   ```

4. **Espera propagación (5-30 minutos)**

5. **En Clerk, verifica el dominio**

### Opción 3: FIX RÁPIDO - Usar app.smarterbot.cl

La forma más rápida es usar el dominio que ya tienes configurado:

1. **En tu proyecto local, actualiza `.env.local`:**
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   
   # Asegúrate de que Clerk use el dominio correcto
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

2. **En Clerk Dashboard:**
   - Home URL: `https://app.smarterbot.cl`
   - Allowed origins: `https://app.smarterbot.cl`

### Opción 4: FIX TEMPORAL - Usar login.smarterbot.store

1. **En Clerk Dashboard → "Settings" → "Domains":**
   - NO uses dominio personalizado
   - Usa el de Clerk: `xxx.accounts.dev`

2. **En "Settings" → "Paths":**
   ```
   Sign in URL: /sign-in
   Sign up URL: /sign-up
   ```

3. **Redeploy tu app en Vercel:**
   ```bash
   cd /root/app-smarterbot-store
   vercel --prod
   ```

## 🔍 VERIFICAR LA CONFIGURACIÓN ACTUAL

```bash
# Ver qué dominio está usando Clerk
cd /root/app-smarterbot-store
grep -r "CLERK" .env* 2>/dev/null
```

## ⚡ FIX INMEDIATO (5 minutos)

**Lo más rápido es NO usar dominio personalizado:**

1. Ve a: https://dashboard.clerk.com
2. Selecciona tu app
3. Settings → Domains
4. Si ves `clerk.smarterbot.store` → **BÓRRALO**
5. Deja solo el dominio default de Clerk
6. Guarda cambios
7. Espera 2 minutos
8. Prueba de nuevo: https://login.smarterbot.store

## 📝 CONFIGURACIÓN RECOMENDADA PARA PRODUCCIÓN

```env
# .env.local (desarrollo)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# No necesitas estas si usas el dominio default de Clerk:
# NEXT_PUBLIC_CLERK_DOMAIN (déjalo vacío)
# NEXT_PUBLIC_CLERK_PROXY_URL (déjalo vacío)
```

## 🎯 VERIFICAR QUE FUNCIONE

Después de hacer los cambios:

1. Abre: https://login.smarterbot.store
2. Click en "Entrar a mi cuenta"
3. Deberías ver el formulario de Clerk (no error SSL)

## 🆘 SI SIGUE FALLANDO

El problema puede ser que tu app está configurada con el dominio antiguo. Verifica:

```bash
# Ver configuración actual
cd /root/app-smarterbot-store
cat .vercel/project.json 2>/dev/null | grep domain
```

Si ves `clerk.smarterbot.store` en algún lado, elimínalo.

## 📞 CONTACTO CLERK SUPPORT

Si usas plan Pro y necesitas ayuda:
- https://clerk.com/support
- Dashboard → Get Help

---

**ACCIÓN INMEDIATA:** Ve al dashboard de Clerk y elimina el dominio personalizado `clerk.smarterbot.store`. Eso debería resolver el problema en 2 minutos.
