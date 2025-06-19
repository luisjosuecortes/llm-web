"use client";

import { Brain } from "lucide-react";

interface ChatWelcomeProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  const suggestions = [
    "¿Cómo funciona BitNet?",
    "¿Los agujeros negros son reales?", 
    "¿Cuántas Rs hay en la palabra 'strawberry'?",
    "¿Cuál es el significado de la vida?"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <Brain className="w-12 h-12 text-purple-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          ¿Cómo puedo ayudarte?
        </h1>
        
        <p className="text-gray-400 text-base max-w-lg mb-8">
          Soy BitNet, un modelo de IA ultra-eficiente de 1.58-bit. 
          Puedo ayudarte con preguntas, código, creatividad y más.
        </p>
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-lg space-y-3 mb-8">        
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full p-4 text-left bg-gray-900/30 border border-gray-700/50 rounded-lg hover:bg-gray-800/50 hover:border-purple-500/30 transition-all duration-200 group"
          >
            <span className="text-gray-300 group-hover:text-white text-sm">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 