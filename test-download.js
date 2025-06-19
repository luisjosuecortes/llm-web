// Test script para verificar descarga del modelo BitNet
import { downloadModel } from './app/lib/model-downloader.ts';

console.log('🧪 Testing BitNet model download...');

// Forzar descarga
process.env.FORCE_MODEL_DOWNLOAD = 'true';

async function testDownload() {
  try {
    console.log('📥 Iniciando descarga de prueba...');
    const modelPath = await downloadModel();
    console.log('✅ Descarga exitosa:', modelPath);
  } catch (error) {
    console.error('❌ Error en descarga:', error);
  }
}

testDownload(); 