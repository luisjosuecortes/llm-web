"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Type your message here..." 
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800/50 bg-gray-950/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative bg-gray-900/50 border border-gray-700/50 rounded-xl shadow-lg backdrop-blur-sm">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent text-gray-200 placeholder-gray-500 p-4 pr-16 focus:ring-0 focus:outline-none"
            rows={1}
          />
          
          {/* Botones de acción */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              size="sm"
              className="h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            Powered by{" "}
            <span className="text-purple-400 font-medium">BitNet 1.58 2B</span>
            {" "}• Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
} 