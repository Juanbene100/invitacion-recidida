# 🎉 Sistema de Invitación con Panel de Administración

## 📋 Descripción
Sistema completo de invitación web con formulario de confirmación y panel de administración para gestionar las confirmaciones de asistencia.

## 🚀 Características

### Invitación Principal (`index.html`)
- ✨ Diseño moderno y elegante con gradientes y animaciones
- 🎯 Formulario de confirmación de asistencia
- 🎊 Efectos de confeti al confirmar
- 💝 Mensajes especiales para nombres específicos
- 📍 Enlaces a Google Maps para direcciones
- 📱 Diseño completamente responsive

### Panel de Administración (`admin.html`)
- 📊 Estadísticas en tiempo real
- 🔍 Búsqueda y filtrado de confirmaciones
- 📋 Tabla con paginación
- 👁️ Vista detallada de cada confirmación
- 📤 Exportación a CSV
- 🗑️ Eliminación de confirmaciones
- 💾 Almacenamiento local persistente

## 🛠️ Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Almacenamiento**: localStorage (base de datos local)
- **Iconos**: Font Awesome
- **Fuentes**: Google Fonts (Poppins)
- **Animaciones**: CSS3 Keyframes

## 📁 Estructura de Archivos
```
frontend/
├── index.html          # Invitación principal
├── admin.html          # Panel de administración
├── style.css           # Estilos de la invitación
├── admin.css           # Estilos del panel admin
├── script.js           # Lógica de la invitación
├── admin.js            # Lógica del panel admin
├── database.json       # Base de datos de ejemplo
└── README.md           # Este archivo
```

## 🎯 Cómo Usar

### 1. Invitación Principal
1. Abre `index.html` en tu navegador
2. Los invitados pueden llenar el formulario de confirmación
3. Al confirmar, se guarda automáticamente en la base de datos local
4. Se muestra un mensaje de éxito y cae confeti

### 2. Panel de Administración
1. Abre `admin.html` en tu navegador
2. Ve todas las confirmaciones en la tabla
3. Usa la barra de búsqueda para filtrar
4. Haz clic en "Ver" para ver detalles completos
5. Exporta los datos a CSV si es necesario

## 🔧 Funcionalidades Especiales

### Mensajes Personalizados
- **German**: "¡Te amo hermoso! ❤️"
- **Aylen**: "¡Sos el amor de mi vida! 💖"

### Enlaces de Ubicación
- **Dirección del evento**: Enlace directo a Google Maps
- **CAMPUS UNSTA**: Enlace al campus de Yerba Buena, Tucumán

## 💾 Almacenamiento de Datos
- Los datos se guardan en el navegador del usuario (localStorage)
- Se mantienen entre sesiones
- Incluye datos de ejemplo para demostración
- Formato: JSON con timestamp y estado de confirmación

## 📱 Responsive Design
- Optimizado para móviles, tablets y desktop
- Navegación táctil en dispositivos móviles
- Tabla con scroll horizontal en pantallas pequeñas

## 🎨 Personalización
- Colores y gradientes fácilmente modificables en CSS
- Fuentes personalizables
- Animaciones ajustables
- Estructura modular para cambios

## 🚀 Despliegue
- Funciona completamente offline
- No requiere servidor
- Compatible con hosting estático (Vercel, Netlify, GitHub Pages)
- Solo necesitas subir los archivos HTML, CSS y JS

## 🔒 Privacidad
- Todos los datos se almacenan localmente
- No se envían a servidores externos
- Control total sobre la información

## 📞 Soporte
Para cualquier consulta o personalización adicional, revisa el código fuente o contacta al desarrollador.

---

**¡Disfruta tu evento! 🎉**
