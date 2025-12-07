'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Sparkles } from 'lucide-react'

const models = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Rápido y eficiente' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Más potente' },
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', description: 'Anthropic' },
]

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.message || 'No response' }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al generar respuesta' }])
    } finally {
      setIsLoading(false)
    }
  }

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
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">AI Playground</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Prueba diferentes modelos de IA con streaming en tiempo real
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Model Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Modelo</CardTitle>
              <CardDescription>
                Elige el modelo de IA que deseas usar (via AI Gateway)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Conversación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-lg px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Mensaje</CardTitle>
              <CardDescription>
                Escribe tu prompt y presiona Enviar para obtener una respuesta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  className="min-h-[120px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading || !input.trim()} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-2 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg">Sobre el AI Gateway</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Este playground utiliza el AI Gateway de Vercel para gestionar las llamadas a diferentes 
                modelos de IA de forma segura y eficiente.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• <strong>Sin claves expuestas:</strong> La autenticación se maneja via OIDC</li>
                <li>• <strong>Streaming:</strong> Respuestas en tiempo real con el AI SDK</li>
                <li>• <strong>Multi-modelo:</strong> Cambia entre OpenAI y Claude fácilmente</li>
                <li>• <strong>Rate limiting:</strong> Control de uso automático</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

