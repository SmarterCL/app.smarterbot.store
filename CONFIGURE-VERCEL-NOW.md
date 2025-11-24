# 🚀 CONFIGURAR VERCEL AHORA - PASO A PASO

## 📍 Ve a: 
https://vercel.com/smartercl/app-smarterbot/settings/environment-variables

---

## ✅ OPCIÓN 1: CONFIGURACIÓN COMPLETA (Recomendado)

Agrega estas 6 variables una por una:

### 1. NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://rjfcmmzjlguiititkmyh.supabase.co
Environment: Production ✅
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZmNtbXpqbGd1aWl0aXRrbXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTk3MzUsImV4cCI6MjA3NzM3NTczNX0.IRj4EXZErrxcHetZNu5onhDTR3iEe5lMA--ireaR19A
Environment: Production ✅
```

### 3. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```
Key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ
Environment: Production ✅
```

### 4. CLERK_SECRET_KEY
```
Key: CLERK_SECRET_KEY
Value: sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz
Environment: Production ✅
```

### 5. NEXT_PUBLIC_APP_URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://app.smarterbot.cl
Environment: Production ✅
```

### 6. NODE_ENV
```
Key: NODE_ENV
Value: production
Environment: Production ✅
```

---

## ⚡ OPCIÓN 2: MODO DEMO (Más rápido)

Si las keys de Clerk no funcionan, agrega solo esta:

```
Key: NEXT_PUBLIC_DEMO_MODE
Value: true
Environment: Production ✅
```

---

## 📋 Después de agregar:

1. ✅ Click "Save" después de cada variable
2. ✅ Vercel rebuildeará automáticamente
3. ✅ Espera 2-3 minutos
4. ✅ Visita: https://app.smarterbot.cl
5. ✅ NO debe mostrar error de configuración

---

## 🆘 Si algo falla:

1. Verifica que todas las variables estén en "Production"
2. Trigger manual redeploy: Deployments → tres puntos → Redeploy
3. Revisa logs de build en Vercel

---

## ✅ Checklist Final:

- [ ] Variables agregadas en Vercel
- [ ] Redeploy completado
- [ ] https://app.smarterbot.cl funciona
- [ ] Login de Clerk funciona
- [ ] Dashboard se muestra correctamente

