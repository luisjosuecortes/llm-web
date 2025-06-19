import { useState, useCallback } from 'react';

interface BitNetMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface BitNetResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface UseBitNetReturn {
  isLoading: boolean;
  error: string | null;
  generateResponse: (messages: BitNetMessage[]) => Promise<string>;
  checkModelStatus: () => Promise<boolean>;
}

export function useBitNet(): UseBitNetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = useCallback(async (messages: BitNetMessage[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BitNetResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No se recibió respuesta válida del modelo BitNet');
      }

      const content = data.choices[0].message.content;
      
      if (!content) {
        throw new Error('Respuesta vacía del modelo BitNet');
      }

      return content;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkModelStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking BitNet status:', error);
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    generateResponse,
    checkModelStatus,
  };
} 