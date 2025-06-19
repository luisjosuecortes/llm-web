# 🚀 Guía de Deployment: BitNet en Vercel

## Problema: Archivo GGUF de 1.18GB

Tu modelo `ggml-model-i2_s.gguf` pesa **1.18GB**, excediendo el límite de 100MB de GitHub.

## 🎯 Opciones de Deployment

### **Opción 1: Descarga Automática (Implementada) ⭐**

✅ **Ya implementado** - El modelo se descarga automáticamente desde Hugging Face

**Ventajas:**
- No necesitas subir el archivo a GitHub
- Funciona directamente en Vercel
- El modelo se cachea en `/tmp` durante la sesión

**Pasos para usar:**
```bash
# 1. Remover modelo del repositorio
git rm public/ggml-model-i2_s.gguf

# 2. Agregar al .gitignore
echo "public/*.gguf" >> .gitignore

# 3. Commit y push
git add .
git commit -m "Remove GGUF model, implement auto-download"
git push origin main

# 4. Deploy en Vercel (el modelo se descarga automáticamente)
```

### **Opción 2: Git LFS (Para proyectos grandes)**

**Pasos:**
```bash
# 1. Instalar y configurar Git LFS
git lfs install
git lfs track "*.gguf"

# 2. Agregar archivo
git add .gitattributes
git add public/ggml-model-i2_s.gguf
git commit -m "Add GGUF model with LFS"

# 3. Push (requiere GitHub Pro para almacenamiento)
git push origin main
```

**⚠️ Limitaciones:**
- Requiere GitHub Pro/Team para almacenamiento LFS
- Vercel podría tener problemas accediendo archivos LFS

### **Opción 3: CDN Externo**

**Pasos:**
```bash
# 1. Subir modelo a CDN (Cloudflare R2, AWS S3, etc.)
# 2. Obtener URL pública
# 3. Actualizar URL en model-downloader.ts
```

**Ejemplo de configuración:**
```typescript
export const BITNET_MODEL: ModelInfo = {
  url: 'https://tu-cdn.com/ggml-model-i2_s.gguf',
  // ... resto de configuración
};
```

### **Opción 4: Vercel Blob Storage**

**Pasos:**
```bash
# 1. Subir modelo a Vercel Blob
npx vercel blob put public/ggml-model-i2_s.gguf

# 2. Usar URL de Blob en la aplicación
```

## 🎯 **Recomendación: Usar Opción 1**

La **Opción 1 (Descarga Automática)** es la mejor porque:

✅ **Gratuita** - No requiere almacenamiento premium
✅ **Simple** - Ya está implementada
✅ **Confiable** - Hugging Face es estable
✅ **Actualizable** - Siempre usa la última versión del modelo

## 🚀 Pasos para Deploy Inmediato

### 1. Preparar Repositorio
```bash
# Remover archivo grande del repositorio
git rm public/ggml-model-i2_s.gguf

# Agregar a .gitignore
echo "public/*.gguf" >> .gitignore
echo "public/*.bin" >> .gitignore
echo "models/" >> .gitignore

# Commit cambios
git add .
git commit -m "🚀 Ready for Vercel: Remove large model file, implement auto-download"
git push origin main
```

### 2. Deploy en Vercel
```bash
# Opción A: Vercel CLI
npx vercel

# Opción B: GitHub Integration
# - Conectar repositorio en vercel.com
# - Deploy automático
```

### 3. Verificar Funcionamiento
```bash
# Test del endpoint
curl https://tu-app.vercel.app/api/chat

# Test de chat
curl -X POST https://tu-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola BitNet!"}]}'
```

## ⏱️ Qué Esperar en el Deploy

### Primera Carga (Cold Start)
- ⏳ **5-15 segundos** - Descarga del modelo (1.18GB)
- 🧠 **2-3 segundos** - Inicialización del modelo
- ✅ **Total: ~20 segundos** primera vez

### Cargas Subsequentes (Warm)
- ⚡ **300-500ms** - Modelo ya en memoria
- 🚀 **Respuesta inmediata**

## 🔧 Troubleshooting

### Problema: Timeout en primera carga
**Solución:** Normal, esperar 20-30 segundos

### Problema: Error de descarga
**Verificar:**
1. Conexión a internet en Vercel
2. URL de Hugging Face funcional
3. Logs de Vercel para errores específicos

### Problema: Memoria insuficiente
**Configurar en vercel.json:**
```json
{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

## 📊 Monitoreo Post-Deploy

### Métricas a Revistar
- ⏱️ **Cold start time** (~20s primera vez)
- 🧠 **Memory usage** (~400MB + overhead)
- 🚀 **Response time** (300-500ms warm)
- ❌ **Error rates** (debería ser <1%)

---

## ✅ Lista de Verificación Pre-Deploy

- [ ] Modelo removido del repositorio (`git rm public/*.gguf`)
- [ ] `.gitignore` actualizado
- [ ] Auto-descarga implementada
- [ ] `vercel.json` configurado
- [ ] Tests locales pasando
- [ ] Repositorio pushed a GitHub

**¡Tu app está lista para Vercel! El modelo se descargará automáticamente en la primera carga.** 🚀 