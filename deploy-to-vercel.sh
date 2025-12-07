#!/bin/bash
# 🚀 Script de Despliegue Rápido - SmarterOS v1.0.0
# Ejecuta este script para desplegar el proyecto en Vercel

set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║              🚀 SMARTEROS - DESPLIEGUE EN VERCEL                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
  echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto"
  exit 1
fi

echo "📦 Paso 1: Verificando dependencias..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado. Instalando..."
    npm install -g pnpm
fi

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

echo "✅ Dependencias verificadas"
echo ""

echo "📥 Paso 2: Instalando paquetes del proyecto..."
pnpm install --frozen-lockfile
echo "✅ Paquetes instalados"
echo ""

echo "🔍 Paso 3: Verificando tipos TypeScript..."
pnpm typecheck || {
  echo "⚠️  Advertencia: Hay errores de tipos. ¿Continuar de todos modos? (y/n)"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    exit 1
  fi
}
echo "✅ Verificación de tipos completada"
echo ""

echo "🏗️  Paso 4: Construyendo proyecto..."
pnpm build
echo "✅ Build completado exitosamente"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 LISTO PARA DESPLEGAR"
echo ""
echo "Opciones de despliegue:"
echo ""
echo "1️⃣  Deploy a Preview (recomendado para testing):"
echo "   $ vercel"
echo ""
echo "2️⃣  Deploy a Producción:"
echo "   $ vercel --prod"
echo ""
echo "3️⃣  Desarrollo local con entorno Vercel:"
echo "   $ vercel dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚙️  CONFIGURACIÓN REQUERIDA EN VERCEL:"
echo ""
echo "Antes de desplegar, configura estas variables de entorno en el dashboard de Vercel:"
echo ""
echo "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx"
echo "  CLERK_SECRET_KEY=sk_live_xxx"
echo "  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 DOCUMENTACIÓN:"
echo ""
echo "  - README.md               → Documentación completa"
echo "  - PROYECTO-COMPLETADO.md  → Resumen ejecutivo"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "¿Deseas desplegar ahora? (y/n)"
read -r deploy_now

if [[ "$deploy_now" =~ ^[Yy]$ ]]; then
  echo ""
  echo "🚀 Desplegando a Vercel..."
  echo ""
  echo "Selecciona el tipo de deploy:"
  echo "1) Preview (testing)"
  echo "2) Producción"
  read -r deploy_type
  
  if [[ "$deploy_type" == "2" ]]; then
    vercel --prod
  else
    vercel
  fi
else
  echo ""
  echo "✅ Build completado. Ejecuta 'vercel' o 'vercel --prod' cuando estés listo."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                     ✅ PROCESO COMPLETADO                                     ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
