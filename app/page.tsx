import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, MessageCircle, Zap, Shield, BarChart3, Workflow, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo / Brand */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20">
            <Zap className="w-10 h-10 text-primary" />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Bienvenido a <span className="text-primary">SmarterOS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plataforma integral para gestionar tu negocio: CRM, ERP, Automatizaciones e IA
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/sign-in">
                Entrar a mi cuenta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Link href="/sign-up">
                Crear mi tenant
              </Link>
            </Button>
          </div>

          {/* WhatsApp CTA */}
          <div className="pt-8">
            <Button asChild variant="ghost" size="lg" className="gap-2">
              <a 
                href="https://wa.me/56979540471" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar con Soporte
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">CRM Inteligente</h3>
              <p className="text-muted-foreground">
                Gestiona conversaciones de WhatsApp, clientes y tickets en un solo lugar
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">ERP Completo</h3>
              <p className="text-muted-foreground">
                Odoo multi-tenant con gestión de inventario, ventas y contabilidad
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold">Automatizaciones</h3>
              <p className="text-muted-foreground">
                Flujos automatizados con n8n para conectar todos tus sistemas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold">AI Playground</h3>
              <p className="text-muted-foreground">
                Prueba modelos de IA como GPT-4o y Claude con streaming
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold">Métricas KPI</h3>
              <p className="text-muted-foreground">
                Dashboards personalizados con Metabase para análisis de datos
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Workflow className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold">Multi-Tenant</h3>
              <p className="text-muted-foreground">
                Aislamiento completo por empresa con subdominios personalizados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SmarterOS. Plataforma de gestión empresarial integral.</p>
        </div>
      </footer>
    </div>
  )
}
