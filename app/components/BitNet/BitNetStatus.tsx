"use client";

import { useEffect, useState } from 'react';
import { Brain, Zap, Activity } from 'lucide-react';

interface BitNetStatusProps {
  isLoading?: boolean;
  modelLoaded?: boolean;
  onStatusChange?: (status: string) => void;
}

export function BitNetStatus({ isLoading = false, modelLoaded = false, onStatusChange }: BitNetStatusProps) {
  const [status, setStatus] = useState<'checking' | 'loading' | 'ready' | 'error'>('checking');
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    memoryUsage: '~400MB',
    modelSize: '2B params'
  });

  useEffect(() => {
    // Simular verificación de estado del modelo
    const checkModelStatus = async () => {
      try {
        const response = await fetch('/api/chat');
        if (response.ok) {
          setStatus('ready');
          onStatusChange?.('ready');
        } else {
          setStatus('error');
          onStatusChange?.('error');
        }
      } catch (error) {
        setStatus('error');
        onStatusChange?.('error');
      }
    };

    if (isLoading) {
      setStatus('loading');
    } else if (modelLoaded) {
      setStatus('ready');
    } else {
      checkModelStatus();
    }
  }, [isLoading, modelLoaded, onStatusChange]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Activity className="w-4 h-4 animate-pulse text-yellow-400" />;
      case 'loading':
        return <Brain className="w-4 h-4 animate-pulse text-blue-400" />;
      case 'ready':
        return <Zap className="w-4 h-4 text-green-400" />;
      case 'error':
        return <Brain className="w-4 h-4 text-red-400" />;
      default:
        return <Brain className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando BitNet...';
      case 'loading':
        return 'Cargando BitNet 1.58 2B...';
      case 'ready':
        return 'BitNet listo';
      case 'error':
        return 'BitNet no disponible';
      default:
        return 'Estado desconocido';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-yellow-400';
      case 'loading':
        return 'text-blue-400';
      case 'ready':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center space-x-3 text-sm">
      {/* Icono de estado */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`${getStatusColor()} font-medium`}>
          {getStatusText()}
        </span>
      </div>

      {/* Métricas solo cuando está listo */}
      {status === 'ready' && (
        <div className="hidden md:flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-1">
            <span className="text-xs">Memoria:</span>
            <span className="text-xs font-mono">{metrics.memoryUsage}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs">Modelo:</span>
            <span className="text-xs font-mono">{metrics.modelSize}</span>
          </div>
          {metrics.responseTime > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs">Respuesta:</span>
              <span className="text-xs font-mono">{metrics.responseTime}ms</span>
            </div>
          )}
        </div>
      )}

      {/* Indicador de carga para requests activos */}
      {isLoading && status === 'ready' && (
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
    </div>
  );
} 