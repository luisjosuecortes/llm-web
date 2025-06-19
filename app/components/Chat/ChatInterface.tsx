"use client";

import { useState } from "react";
import { Sidebar } from "../Layout/Sidebar";
import { ChatWelcome } from "./ChatWelcome";
import { MessageInput } from "./MessageInput";
import { CenteredInput } from "./CenteredInput";
import { Message } from "@/app/lib/types";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Detectar si es el primer mensaje (potencial descarga)
    if (messages.length === 0) {
      setIsDownloadingModel(true);
    }

    try {
      // Llamar a la API de BitNet
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Eres BitNet 1.58 2B, un asistente AI ultra-eficiente. Responde de manera útil y amigable en español.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content
            }
          ],
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 
        'Error: No se pudo obtener respuesta del modelo BitNet.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setIsDownloadingModel(false);

    } catch (error) {
      console.error('Error communicating with BitNet:', error);
      
      // Mensaje de error amigable
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Lo siento, hubo un error al comunicarme con BitNet. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsDownloadingModel(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-gray-950 elegant-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          // Layout inicial con input centrado
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <ChatWelcome onSuggestionClick={handleSuggestionClick} />
              <div className="pb-8">
                <CenteredInput 
                  onSend={handleSendMessage}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          // Layout con conversación activa
          <>
            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3xl p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                          : 'bg-gray-800/50 text-gray-200 border border-gray-700/50'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {isDownloadingModel ? 
                            '📥 Descargando modelo BitNet (1.18GB)... Esto puede tomar hasta 5 minutos en el primer uso.' :
                            'BitNet está pensando...'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Message Input en la parte inferior */}
            <MessageInput 
              onSend={handleSendMessage}
              disabled={isLoading}
              placeholder="Escribe tu mensaje aquí..."
            />
          </>
        )}
      </div>
    </div>
  );
} 