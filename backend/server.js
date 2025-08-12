// ==== SERVIDOR NODE.JS ====
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==== MIDDLEWARE ====
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware para obtener IP del cliente
app.use((req, res, next) => {
    req.clientIP = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.ip;
    next();
});

// ==== RUTAS API ====

// Ruta principal - servir la invitación
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Ruta del panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// ==== API ENDPOINTS ====

// POST - Crear nueva confirmación
app.post('/api/confirmaciones', async (req, res) => {
    try {
        const { nombre, email, telefono, comentarios } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ 
                error: 'El nombre es obligatorio' 
            });
        }

        const confirmacionData = {
            nombre: nombre.trim(),
            email: email ? email.trim() : null,
            telefono: telefono ? telefono.trim() : null,
            estado: 'confirmed',
            ip: req.clientIP,
            user_agent: req.headers['user-agent'],
            comentarios: comentarios ? comentarios.trim() : null
        };

        const nuevaConfirmacion = await db.createConfirmacion(confirmacionData);
        
        res.status(201).json({
            success: true,
            message: '¡Confirmación registrada exitosamente!',
            data: nuevaConfirmacion
        });

    } catch (error) {
        console.error('Error al crear confirmación:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Obtener todas las confirmaciones
app.get('/api/confirmaciones', async (req, res) => {
    try {
        const { 
            estado, 
            busqueda, 
            limit = 10, 
            offset = 0 
        } = req.query;

        const filters = {};
        if (estado) filters.estado = estado;
        if (busqueda) filters.busqueda = busqueda;
        if (limit) filters.limit = parseInt(limit);
        if (offset) filters.offset = parseInt(offset);

        const confirmaciones = await db.getConfirmaciones(filters);
        
        res.json({
            success: true,
            data: confirmaciones
        });

    } catch (error) {
        console.error('Error al obtener confirmaciones:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Obtener confirmación por ID
app.get('/api/confirmaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const confirmacion = await db.getConfirmacionById(id);
        
        if (!confirmacion) {
            return res.status(404).json({ 
                error: 'Confirmación no encontrada' 
            });
        }

        res.json({
            success: true,
            data: confirmacion
        });

    } catch (error) {
        console.error('Error al obtener confirmación:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// PUT - Actualizar confirmación
app.put('/api/confirmaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, estado, comentarios } = req.body;

        if (!nombre) {
            return res.status(400).json({ 
                error: 'El nombre es obligatorio' 
            });
        }

        const updateData = {
            nombre: nombre.trim(),
            email: email ? email.trim() : null,
            telefono: telefono ? telefono.trim() : null,
            estado: estado || 'pending',
            comentarios: comentarios ? comentarios.trim() : null
        };

        const confirmacionActualizada = await db.updateConfirmacion(id, updateData);
        
        res.json({
            success: true,
            message: 'Confirmación actualizada exitosamente',
            data: confirmacionActualizada
        });

    } catch (error) {
        console.error('Error al actualizar confirmación:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// DELETE - Eliminar confirmación
app.delete('/api/confirmaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteConfirmacion(id);
        
        res.json({
            success: true,
            message: 'Confirmación eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar confirmación:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
    try {
        const estadisticas = await db.getEstadisticas();
        
        res.json({
            success: true,
            data: estadisticas
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Obtener evento activo
app.get('/api/evento', async (req, res) => {
    try {
        const evento = await db.getEventoActivo();
        
        if (!evento) {
            return res.status(404).json({ 
                error: 'No hay evento activo' 
            });
        }

        res.json({
            success: true,
            data: evento
        });

    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// PUT - Actualizar evento
app.put('/api/evento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, fecha_evento, lugar, direccion, descripcion, activo } = req.body;

        if (!titulo || !fecha_evento || !lugar) {
            return res.status(400).json({ 
                error: 'Título, fecha y lugar son obligatorios' 
            });
        }

        const updateData = {
            titulo: titulo.trim(),
            fecha_evento: fecha_evento,
            lugar: lugar.trim(),
            direccion: direccion ? direccion.trim() : null,
            descripcion: descripcion ? descripcion.trim() : null,
            activo: activo !== undefined ? activo : true
        };

        const eventoActualizado = await db.updateEvento(id, updateData);
        
        res.json({
            success: true,
            message: 'Evento actualizado exitosamente',
            data: eventoActualizado
        });

    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Exportar confirmaciones a CSV
app.get('/api/exportar', async (req, res) => {
    try {
        const csv = await db.exportToCSV();
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="confirmaciones_recibida.csv"');
        res.send(csv);

    } catch (error) {
        console.error('Error al exportar datos:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// GET - Obtener logs
app.get('/api/logs', async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        const logs = await db.getLogs(parseInt(limit));
        
        res.json({
            success: true,
            data: logs
        });

    } catch (error) {
        console.error('Error al obtener logs:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// ==== RUTAS DE UTILIDAD ====

// GET - Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// GET - Información del servidor
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Sistema de Invitaciones',
        version: '1.0.0',
        description: 'API para gestión de confirmaciones de asistencia',
        endpoints: {
            confirmaciones: '/api/confirmaciones',
            estadisticas: '/api/estadisticas',
            evento: '/api/evento',
            exportar: '/api/exportar',
            logs: '/api/logs'
        }
    });
});

// ==== MANEJO DE ERRORES ====

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
    });
});

// ==== INICIALIZACIÓN DEL SERVIDOR ====

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Invitación: http://localhost:${PORT}`);
    console.log(`⚙️  Panel Admin: http://localhost:${PORT}/admin`);
    console.log(`🔍 API Health: http://localhost:${PORT}/api/health`);
});

// ==== MANEJO DE CIERRE GRACEFUL ====

process.on('SIGTERM', () => {
    console.log('\n🔄 Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🔄 Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});

module.exports = app;
