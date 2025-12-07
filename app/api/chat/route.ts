import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-4o-mini' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 })
    }

    const result = await streamText({
      model: openai(model),
      messages,
    })

    return result.toAIStreamResponse()
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
