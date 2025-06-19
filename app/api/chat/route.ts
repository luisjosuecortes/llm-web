import { NextRequest, NextResponse } from 'next/server';
import { getBitNetInstance } from '@/app/lib/bitnet';

// Interfaz para los mensajes del chat
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

// Función para generar respuesta con BitNet
async function generateWithBitNet(messages: ChatMessage[]): Promise<string> {
  try {
    const bitnet = await getBitNetInstance();
    
    // Construir el prompt desde los mensajes
    const systemMessage = messages.find(m => m.role === 'system')?.content || 
      'Eres BitNet 1.58 2B, un asistente AI ultra-eficiente y amigable.';
    
    const userMessages = messages.filter(m => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    
    const prompt = `${systemMessage}

Humano: ${lastUserMessage}

Asistente:`;

    const response = await bitnet.generate(prompt);
    return response.text;
    
  } catch (error) {
    console.error('Error generando respuesta con BitNet:', error);
    return '❌ Error generando respuesta. Por favor intenta de nuevo.';
  }
}

// Manejador POST para el chat
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Mensajes requeridos' },
        { status: 400 }
      );
    }

    console.log('💬 Nueva consulta BitNet:', body.messages[body.messages.length - 1]?.content);

    // Si es streaming, configurar headers apropiados
    if (body.stream) {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await generateWithBitNet(body.messages);
            
            // Simular streaming enviando chunks
            const words = response.split(' ');
            for (let i = 0; i < words.length; i++) {
              const chunk = i === 0 ? words[i] : ' ' + words[i];
              const data = JSON.stringify({ 
                choices: [{ 
                  delta: { content: chunk } 
                }] 
              });
              
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 50)); // Delay para simular streaming
            }
            
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
            
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Respuesta normal (no streaming)
    const response = await generateWithBitNet(body.messages);
    
    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'bitnet-b1.58-2b-4t',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: response,
        },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: body.messages.join(' ').length / 4, // Estimación
        completion_tokens: response.length / 4, // Estimación  
        total_tokens: (body.messages.join(' ').length + response.length) / 4,
      },
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Manejador GET para verificar el estado
export async function GET() {
  return NextResponse.json({
    status: 'BitNet API está funcionando',
    model: 'bitnet-b1.58-2b-4t',
    timestamp: new Date().toISOString(),
  });
} 