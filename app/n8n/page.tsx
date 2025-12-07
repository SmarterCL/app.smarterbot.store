import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ExternalLink, Zap, Workflow, GitBranch, Database } from 'lucide-react'

const workflowExamples = [
  {
    name: 'WhatsApp → CRM',
    description: 'Envía mensajes de WhatsApp directo al CRM como tickets',
    icon: MessageCircle,
    color: 'blue',
  },
  {
    name: 'Google Forms → Sheets',
    description: 'Sincroniza respuestas de formularios automáticamente',
    icon: Database,
    color: 'green',
  },
  {
    name: 'Shopify → Odoo',
    description: 'Sincroniza órdenes, productos e inventario en tiempo real',
    icon: GitBranch,
    color: 'purple',
  },
  {
    name: 'Backup Automático',
    description: 'Respalda workflows a GitHub cada noche',
    icon: Workflow,
    color: 'orange',
  },
]

export default function N8NPage() {
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
            <h1 className="text-4xl font-bold tracking-tight">Automatizaciones n8n</h1>
            <p className="text-xl text-muted-foreground">
              Conecta tus sistemas sin código con workflows poderosos
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>¿Qué es n8n?</CardTitle>
              <CardDescription>
                Plataforma de automatización open-source para conectar tus herramientas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                n8n te permite crear flujos de trabajo automatizados entre tus aplicaciones favoritas. 
                Conecta APIs, bases de datos, webhooks y más de 300 integraciones predefinidas.
              </p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                  <Zap className="w-3 h-3" />
                  Sin código
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm">
                  <Workflow className="w-3 h-3" />
                  Visual
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm">
                  <GitBranch className="w-3 h-3" />
                  Open Source
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Examples */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ejemplos de Automatizaciones</h2>
            <div className="grid gap-4">
              {workflowExamples.map((workflow) => {
                const Icon = workflow.icon
                return (
                  <Card key={workflow.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-${workflow.color}-500/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${workflow.color}-500`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{workflow.name}</h3>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Dashboard Link */}
          <Card className="border-2 border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Ver tus Automatizaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Accede al dashboard de automatizaciones para ver el estado, ejecutar y gestionar tus workflows.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard/automatizaciones">
                  <Workflow className="w-4 h-4" />
                  Ver Dashboard de Automatizaciones
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Integration Status */}
          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Acceso a n8n</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                En futuras versiones, tendrás acceso directo a tu instancia de n8n:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Editor visual de workflows en <code className="text-xs bg-secondary px-2 py-1 rounded">n8n.&lt;tu-dominio&gt;.cl</code></li>
                <li>• Ejecuciones en tiempo real con logs detallados</li>
                <li>• Webhooks personalizados para triggers externos</li>
                <li>• Biblioteca de templates pre-configurados</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">¿Necesitas ayuda con automatizaciones?</h3>
                  <p className="text-sm text-muted-foreground">
                    Hablemos sobre cómo automatizar tu negocio
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
                      href="https://n8n.smarterbot.cl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ver Workflows
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
