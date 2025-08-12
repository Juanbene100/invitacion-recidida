# 🚀 Guía de Despliegue en Vercel

## 📋 Pasos para Desplegar tu Invitación

### **1. 📁 Preparar el Repositorio**

Asegúrate de que tu proyecto esté en GitHub:

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Primera versión de la invitación"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### **2. 🌐 Crear Cuenta en Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Conecta tu cuenta de GitHub
4. Autoriza a Vercel para acceder a tus repositorios

### **3. 🚀 Desplegar el Proyecto**

1. **En Vercel Dashboard:**
   - Haz clic en "New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

2. **Configuración del Proyecto:**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build` (o dejar vacío)
   - **Output Directory**: `frontend` (para archivos estáticos)

3. **Variables de Entorno:**
   - No necesarias para esta versión básica

4. **Haz clic en "Deploy"**

### **4. ✅ Verificar el Despliegue**

- Vercel te dará una URL como: `https://tu-proyecto.vercel.app`
- La invitación estará en: `https://tu-proyecto.vercel.app`
- El panel admin en: `https://tu-proyecto.vercel.app/admin`

### **5. 🔗 Personalizar la URL**

En Vercel puedes:
- Cambiar el nombre del proyecto
- Configurar un dominio personalizado
- Configurar redirecciones

## 📱 **Compartir tu Invitación**

Una vez desplegada, comparte la URL:

- **📧 Por Email**: Envía la URL a tus invitados
- **📱 Por WhatsApp**: Comparte el enlace
- **🌐 Redes Sociales**: Publica en Instagram, Facebook, etc.
- **📋 Código QR**: Genera un QR con la URL

## 🎯 **URLs Disponibles**

- **🏠 Invitación Principal**: `https://tu-proyecto.vercel.app`
- **⚙️ Panel Admin**: `https://tu-proyecto.vercel.app/admin`
- **🔍 API Health**: `https://tu-proyecto.vercel.app/api/health`

## ⚠️ **Notas Importantes**

- **Base de Datos**: Esta versión no incluye base de datos (solo frontend)
- **Funcionalidad**: Las confirmaciones se guardarán localmente en el navegador
- **Escalabilidad**: Vercel es perfecto para invitaciones con muchos visitantes

## 🆘 **Solución de Problemas**

### **Error de Build:**
- Verifica que todos los archivos estén en el repositorio
- Revisa la consola de Vercel para errores

### **Archivos no Encontrados:**
- Asegúrate de que `vercel.json` esté en la raíz
- Verifica que las rutas en `vercel.json` sean correctas

### **Problemas de CORS:**
- Vercel maneja CORS automáticamente
- Si persisten, revisa la configuración en `vercel.json`

---

**¡Tu invitación estará online en minutos! 🎉**
