# 🎉 Sistema de Invitaciones - Frontend + Backend

Sistema completo de invitaciones para eventos con base de datos SQLite y panel de administración.

## 📁 Estructura del Proyecto

```
Invitacion/
├── frontend/                 # 🎨 Interfaz de usuario
│   ├── index.html           # Página principal de invitación
│   ├── admin.html           # Panel de administración
│   ├── style.css            # Estilos de la invitación
│   ├── admin.css            # Estilos del panel admin
│   ├── script.js            # JavaScript de la invitación
│   └── admin.js             # JavaScript del panel admin
├── backend/                  # ⚙️ Servidor y base de datos
│   ├── server.js            # Servidor Express.js
│   ├── database.js          # Módulo de base de datos SQLite
│   ├── package.json         # Dependencias del backend
│   └── invitaciones.db      # Base de datos SQLite
├── package.json             # Configuración principal del proyecto
└── README.md                # Este archivo
```

## 🚀 Instalación y Configuración

### 1. Instalar todas las dependencias
```bash
npm run setup
```

### 2. Inicializar la base de datos
```bash
npm run db:init
```

### 3. Iniciar el servidor
```bash
npm start
```

## 🌐 URLs Disponibles

- **📱 Invitación Principal**: http://localhost:3000
- **⚙️ Panel de Administración**: http://localhost:3000/admin
- **🔍 API Health Check**: http://localhost:3000/api/health

## 🛠️ Comandos Útiles

### **Desarrollo:**
```bash
npm run dev          # Servidor con recarga automática
```

### **Base de Datos:**
```bash
npm run db:init      # Inicializar base de datos
npm run db:backup    # Crear backup de la base de datos
```

### **Instalación:**
```bash
npm run install:all  # Instalar dependencias de frontend y backend
```

## 🔧 Tecnologías Utilizadas

### **Frontend:**
- HTML5, CSS3, JavaScript ES6+
- Font Awesome para iconos
- Google Fonts (Poppins, Dancing Script)
- Diseño responsive y moderno
- Efectos visuales y animaciones

### **Backend:**
- Node.js con Express.js
- Base de datos SQLite3
- API REST completa
- Sistema de logs
- Exportación a CSV

## 📊 Funcionalidades

### **🎯 Invitación Web:**
- Formulario de confirmación de asistencia
- Autocompletado de nombres
- Validación en tiempo real
- Efectos visuales y confeti
- Diseño responsive

### **⚙️ Panel de Administración:**
- Ver todas las confirmaciones
- Filtrar por estado y búsqueda
- Paginación de resultados
- Exportar datos a CSV
- Estadísticas en tiempo real
- Sistema de logs completo

### **🗄️ Base de Datos:**
- Tabla de confirmaciones
- Tabla de eventos
- Tabla de logs
- Evento por defecto configurado

## 🔌 API Endpoints

### **Confirmaciones:**
- `POST /api/confirmaciones` - Crear confirmación
- `GET /api/confirmaciones` - Listar confirmaciones
- `GET /api/confirmaciones/:id` - Obtener confirmación
- `PUT /api/confirmaciones/:id` - Actualizar confirmación
- `DELETE /api/confirmaciones/:id` - Eliminar confirmación

### **Estadísticas y Utilidades:**
- `GET /api/estadisticas` - Estadísticas generales
- `GET /api/evento` - Información del evento
- `GET /api/exportar` - Exportar a CSV
- `GET /api/logs` - Ver logs del sistema

## 🎨 Personalización

### **Colores:**
Los colores se pueden modificar en los archivos CSS:
- `frontend/style.css` - Colores de la invitación
- `frontend/admin.css` - Colores del panel admin

### **Contenido:**
- **Evento**: Modificar en `backend/database.js` línea 95-101
- **Nombres sugeridos**: Modificar en `frontend/script.js` línea 6-9

## 🚨 Solución de Problemas

### **Puerto ocupado:**
Cambiar el puerto en `backend/server.js` línea 7:
```javascript
const PORT = process.env.PORT || 3001; // Cambiar a 3001 u otro
```

### **Error de dependencias:**
```bash
cd backend
npm install
```

### **Base de datos corrupta:**
```bash
rm backend/invitaciones.db
npm run db:init
```

## 📝 Licencia

MIT License - Libre para uso personal y comercial.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**¡Disfruta tu sistema de invitaciones! 🎊**
