import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ExternalLink } from 'lucide-react'

export default function CRMPage() {
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
            <h1 className="text-4xl font-bold tracking-tight">CRM SmarterOS</h1>
            <p className="text-xl text-muted-foreground">
              Gestión integral de clientes y comunicaciones WhatsApp
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué incluye el CRM?</CardTitle>
              <CardDescription>
                Gestiona todas tus conversaciones y clientes desde un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Inbox Unificado</h3>
                    <p className="text-sm text-muted-foreground">
                      Todas las conversaciones de WhatsApp en un solo inbox compartido para tu equipo
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gestión de Tickets</h3>
                    <p className="text-sm text-muted-foreground">
                      Asigna, prioriza y resuelve conversaciones con tu equipo de soporte
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Base de Contactos</h3>
                    <p className="text-sm text-muted-foreground">
                      Almacena y gestiona información de tus clientes con campos personalizados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Estado de Integración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                El CRM se encuentra disponible en tu subdominio personalizado. En futuras versiones:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Acceso directo desde <code className="text-xs bg-secondary px-2 py-1 rounded">crm.&lt;tu-dominio&gt;.cl</code></li>
                <li>• Integración directa con tu WhatsApp Business</li>
                <li>• Sincronización automática con el ERP</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">¿Necesitas ayuda?</h3>
                  <p className="text-sm text-muted-foreground">
                    Habla con nuestro equipo para configurar tu CRM
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
                      href="https://crm.smarterbot.cl" 
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
