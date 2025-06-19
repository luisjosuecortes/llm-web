// Descargador automático de modelo BitNet para Vercel
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ModelInfo {
  name: string;
  size: string;
  url: string;
  path: string;
}

export const BITNET_MODEL: ModelInfo = {
  name: 'BitNet 1.58 2B GGUF',
  size: '1.18GB',
  url: 'https://huggingface.co/Microsoft/BitNet-b1_58-2B-instruct-GGUF/resolve/main/ggml-model-i2_s.gguf',
  path: '/tmp/ggml-model-i2_s.gguf'
};

export async function downloadModel(): Promise<string> {
  console.log('🔄 Verificando modelo BitNet...');
  
  // TEMPORAL: Para testing - forzar descarga incluso en desarrollo
  const FORCE_DOWNLOAD = process.env.FORCE_MODEL_DOWNLOAD === 'true';
  
  // En desarrollo, usar archivo local si existe (a menos que se fuerce descarga)
  if (process.env.NODE_ENV === 'development' && !FORCE_DOWNLOAD) {
    const localPath = join(process.cwd(), 'public', 'ggml-model-i2_s.gguf');
    if (existsSync(localPath)) {
      console.log('✅ Modelo local encontrado:', localPath);
      return localPath;
    }
  }

  // En producción (Vercel), descargar a /tmp
  const tmpPath = BITNET_MODEL.path;
  
  // Verificar si ya está descargado en esta instancia
  if (existsSync(tmpPath)) {
    console.log('✅ Modelo ya descargado en:', tmpPath);
    return tmpPath;
  }

  try {
    console.log('📥 Descargando modelo BitNet desde Hugging Face...');
    console.log('📍 URL:', BITNET_MODEL.url);
    console.log('💾 Tamaño:', BITNET_MODEL.size);
    
    // Crear directorio si no existe
    mkdirSync('/tmp', { recursive: true });
    
    // Descargar el modelo
    const response = await fetch(BITNET_MODEL.url, {
      headers: {
        'User-Agent': 'BitNet-Web-App/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Verificar tamaño del contenido
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      console.log(`📊 Descargando ${sizeMB.toFixed(0)}MB...`);
    }
    
    // Obtener el contenido como ArrayBuffer
    const buffer = await response.arrayBuffer();
    
    // Guardar el archivo (en Vercel esto va a /tmp)
    const fs = await import('fs/promises');
    await fs.writeFile(tmpPath, Buffer.from(buffer));
    
    console.log('✅ Modelo descargado exitosamente:', tmpPath);
    return tmpPath;
    
  } catch (error) {
    console.error('❌ Error descargando modelo:', error);
    throw new Error(`No se pudo descargar el modelo BitNet: ${error}`);
  }
}

export async function getModelPath(): Promise<string> {
  try {
    return await downloadModel();
  } catch (error) {
    console.error('❌ Fallo descarga, usando simulación');
    // Retornar path vacío para activar modo simulación
    return '';
  }
}

export function getModelInfo(): ModelInfo {
  return BITNET_MODEL;
} 