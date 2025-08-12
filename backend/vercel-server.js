// ==== SERVIDOR SERVERLESS PARA VERCEL ====
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ==== MIDDLEWARE ====
app.use(cors());
app.use(express.json());

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

// GET - Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: 'Vercel Serverless'
    });
});

// GET - Información del servidor
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Sistema de Invitaciones',
        version: '1.0.0',
        description: 'API para gestión de confirmaciones de asistencia (Vercel)',
        endpoints: {
            health: '/api/health',
            info: '/api/info'
        }
    });
});

// ==== MANEJO DE ERRORES ====
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: 'Algo salió mal'
    });
});

// ==== EXPORTACIÓN PARA VERCEL ====
module.exports = app;
