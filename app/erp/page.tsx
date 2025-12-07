import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ExternalLink, BarChart3, Package, Users, DollarSign } from 'lucide-react'

export default function ERPPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/dashboard">
              ← Volver al Dashboard
            </Link>
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">ERP Odoo</h1>
            <p className="text-xl text-muted-foreground">
              Sistema de gestión empresarial completo en VPS dedicado
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué incluye Odoo ERP?</CardTitle>
              <CardDescription>
                Gestión completa de tu negocio con módulos integrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gestión de Inventario</h3>
                    <p className="text-sm text-muted-foreground">
                      Control de stock, almacenes, lotes y trazabilidad completa
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ventas y Facturación</h3>
                    <p className="text-sm text-muted-foreground">
                      Cotizaciones, pedidos, facturación electrónica y seguimiento de pagos
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contabilidad</h3>
                    <p className="text-sm text-muted-foreground">
                      Libro mayor, balance, flujo de caja y reportes financieros
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">RRHH y Nóminas</h3>
                    <p className="text-sm text-muted-foreground">
                      Gestión de empleados, contratos, asistencia y liquidaciones
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-tenant Feature */}
          <Card className="border-2 border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Multi-tenant por RUT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tu ERP está completamente aislado por empresa (RUT chileno):
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• <strong>VPS dedicado</strong> con recursos garantizados</li>
                <li>• <strong>Base de datos separada</strong> por empresa</li>
                <li>• <strong>Subdominio personalizado:</strong> <code className="text-xs bg-secondary px-2 py-1 rounded">erp.&lt;tu-dominio&gt;.cl</code></li>
                <li>• <strong>SSL automático</strong> con Let&apos;s Encrypt</li>
                <li>• <strong>Backups diarios</strong> automáticos</li>
              </ul>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Integraciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Sincronización con Shopify (productos, órdenes, inventario)</li>
                <li>• Integración con CRM (contactos y oportunidades)</li>
                <li>• Webhooks hacia n8n para automatizaciones</li>
                <li>• API REST para integraciones personalizadas</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">¿Listo para implementar Odoo?</h3>
                  <p className="text-sm text-muted-foreground">
                    Solicita una demo personalizada para tu empresa
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a 
                      href="https://wa.me/56979540471" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contactar Soporte
                    </a>
                  </Button>
                  
                  <Button asChild size="lg" className="gap-2">
                    <a 
                      href="https://erp.smarterbot.cl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ver Demo
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
