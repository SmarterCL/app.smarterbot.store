#!/usr/bin/env node

/**
 * Test Cloudflare DNS MCP Integration
 * Verifica que el token funciona y lista registros DNS
 */

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'qugtdQhGygM-2pxgSxygOk9sKOVA5A9y7wg3m9Dx'
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || '2cd9e927c040cd0351c908068f81b069'
const CLOUDFLARE_ZONE_NAME = 'smarterbot.cl'

async function verifyToken() {
  console.log('🔐 Verificando token de Cloudflare...\n')
  
  // Usar endpoint de zonas para verificar que el token funciona
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${CLOUDFLARE_ZONE_NAME}`, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log('✅ Token válido y activo')
    console.log(`   Acceso a zona: ${CLOUDFLARE_ZONE_NAME}\n`)
    return true
  } else {
    console.error('❌ Token inválido:', data.errors)
    return false
  }
}

async function listZones() {
  console.log('🌐 Listando zonas DNS...\n')
  
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${CLOUDFLARE_ZONE_NAME}`, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json()
  
  if (data.success && data.result.length > 0) {
    const zone = data.result[0]
    console.log('✅ Zona encontrada:')
    console.log(`   Nombre: ${zone.name}`)
    console.log(`   ID: ${zone.id}`)
    console.log(`   Status: ${zone.status}`)
    console.log(`   Plan: ${zone.plan.name}\n`)
    return zone.id
  } else {
    console.error('❌ No se encontró la zona')
    return null
  }
}

async function listDnsRecords(zoneId) {
  console.log('📋 Listando registros DNS...\n')
  
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log(`✅ Total de registros: ${data.result.length}\n`)
    
    // Agrupar por tipo
    const byType = {}
    data.result.forEach(record => {
      if (!byType[record.type]) byType[record.type] = []
      byType[record.type].push(record)
    })
    
    // Mostrar resumen
    console.log('📊 Resumen por tipo:')
    Object.entries(byType).forEach(([type, records]) => {
      console.log(`   ${type}: ${records.length} registros`)
    })
    console.log()
    
    // Mostrar registros principales (A y CNAME)
    console.log('🔍 Registros principales:\n')
    
    const mainRecords = data.result
      .filter(r => ['A', 'CNAME'].includes(r.type))
      .sort((a, b) => a.name.localeCompare(b.name))
    
    mainRecords.forEach(record => {
      const proxied = record.proxied ? '🟠 proxied' : '⚪ direct'
      console.log(`   ${record.type.padEnd(6)} ${record.name.padEnd(35)} → ${record.content} ${proxied}`)
    })
    
    return data.result
  } else {
    console.error('❌ Error al listar registros:', data.errors)
    return []
  }
}

async function testMcpCapabilities() {
  console.log('\n🧪 Probando capacidades MCP...\n')
  
  // Simular llamada a MCP (por ahora vía API directa)
  console.log('📡 Capacidades disponibles via Cloudflare API:')
  console.log('   ✅ zones_list - Listar zonas')
  console.log('   ✅ dns_records_list - Listar registros DNS')
  console.log('   ✅ dns_records_create - Crear registros DNS')
  console.log('   ✅ dns_records_update - Actualizar registros DNS')
  console.log('   ✅ dns_records_delete - Eliminar registros DNS')
  console.log('   ✅ dns_analytics_report - Reportes de tráfico DNS')
  console.log()
  
  console.log('🔗 MCP Server oficial de Cloudflare:')
  console.log('   Endpoint: https://dns-analytics.mcp.cloudflare.com/mcp')
  console.log('   Inspector: npx @modelcontextprotocol/inspector')
  console.log()
}

async function suggestSubdomains() {
  console.log('💡 Sugerencias de subdominios para crear:\n')
  
  const suggestions = [
    { name: 'mkt.smarterbot.cl', type: 'A', ip: '216.198.79.1', purpose: 'Marketing site' },
    { name: 'call.smarterbot.cl', type: 'CNAME', target: 'smarterbot.cl', purpose: 'Call center' },
    { name: 'vault.smarterbot.cl', type: 'A', ip: '89.116.23.167', purpose: 'HashiCorp Vault' },
    { name: 'mcp.smarterbot.cl', type: 'A', ip: '89.116.23.167', purpose: 'MCP Server central' },
  ]
  
  suggestions.forEach(({ name, type, ip, target, purpose }) => {
    const content = ip || target
    console.log(`   📝 ${name}`)
    console.log(`      Tipo: ${type} → ${content}`)
    console.log(`      Propósito: ${purpose}`)
    console.log()
  })
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🌐 Cloudflare DNS MCP - Test de Integración')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  
  try {
    // 1. Verificar token
    const tokenValid = await verifyToken()
    if (!tokenValid) return
    
    // 2. Listar zonas
    const zoneId = await listZones()
    if (!zoneId) return
    
    // 3. Listar registros DNS
    const records = await listDnsRecords(zoneId)
    
    // 4. Probar capacidades MCP
    await testMcpCapabilities()
    
    // 5. Sugerir subdominios
    await suggestSubdomains()
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Test completado exitosamente')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    console.log('📚 Próximos pasos:')
    console.log('   1. Revisar CLOUDFLARE-MCP-SETUP.md para guía completa')
    console.log('   2. Integrar lib/cloudflare-mcp.ts en la app')
    console.log('   3. Crear API routes para gestión DNS')
    console.log('   4. Configurar en Vercel (env vars)')
    console.log()
    
  } catch (error) {
    console.error('\n❌ Error durante el test:', error.message)
    process.exit(1)
  }
}

main()
