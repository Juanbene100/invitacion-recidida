// ==== BASE DE DATOS SQLITE ====
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'invitaciones.db');
        this.db = null;
        this.init();
    }

    // ==== SISTEMA DE LOGS ====

    // Registrar acción en logs
    logAction(accion, tabla, registro_id, datos_anteriores, datos_nuevos, usuario = null, ip = null) {
        const sql = `
            INSERT INTO logs (accion, tabla, registro_id, datos_anteriores, datos_nuevos, usuario, ip)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        this.db.run(sql, [accion, tabla, registro_id, datos_anteriores, datos_nuevos, usuario, ip], (err) => {
            if (err) {
                console.error('Error al registrar log:', err);
            }
        });
    }

    // Inicializar la base de datos
    init() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err.message);
            } else {
                console.log('✅ Base de datos conectada exitosamente');
                this.createTables();
            }
        });
    }

    // Crear tablas
    createTables() {
        const createConfirmacionesTable = `
            CREATE TABLE IF NOT EXISTS confirmaciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT,
                telefono TEXT,
                estado TEXT DEFAULT 'pending',
                fecha_confirmacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip TEXT,
                user_agent TEXT,
                comentarios TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createEventosTable = `
            CREATE TABLE IF NOT EXISTS eventos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                fecha_evento DATETIME NOT NULL,
                lugar TEXT NOT NULL,
                direccion TEXT,
                descripcion TEXT,
                activo BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createLogsTable = `
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                accion TEXT NOT NULL,
                tabla TEXT NOT NULL,
                registro_id INTEGER,
                datos_anteriores TEXT,
                datos_nuevos TEXT,
                usuario TEXT,
                ip TEXT,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.serialize(() => {
            this.db.run(createConfirmacionesTable);
            this.db.run(createEventosTable);
            this.db.run(createLogsTable);
            
            // Insertar evento por defecto si no existe
            this.insertDefaultEvent();
        });
    }

    // Insertar evento por defecto
    insertDefaultEvent() {
        const checkEvent = "SELECT COUNT(*) as count FROM eventos WHERE titulo = 'Recibida Enzo y Juan Pablo'";
        this.db.get(checkEvent, (err, row) => {
            if (err) {
                console.error('Error al verificar evento:', err);
                return;
            }
            
            if (row.count === 0) {
                const insertEvent = `
                    INSERT INTO eventos (titulo, fecha_evento, lugar, direccion, descripcion)
                    VALUES (?, ?, ?, ?, ?)
                `;
                
                this.db.run(insertEvent, [
                    'Recibida Enzo y Juan Pablo',
                    '2025-08-13 22:00:00',
                    'Quincho El Jakal',
                    'Tomás Godoy Cruz 1579, Tucumán',
                    'Celebración de graduación de Enzo Fernandez y Juan Pablo Benedetti'
                ], (err) => {
                    if (err) {
                        console.error('Error al insertar evento por defecto:', err);
                    } else {
                        console.log('✅ Evento por defecto creado');
                    }
                });
            }
        });
    }

    // ==== OPERACIONES CRUD PARA CONFIRMACIONES ====

    // Crear nueva confirmación
    createConfirmacion(data) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO confirmaciones 
                (nombre, email, telefono, estado, ip, user_agent, comentarios)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [
                data.nombre,
                data.email || null,
                data.telefono || null,
                data.estado || 'pending',
                data.ip || null,
                data.user_agent || null,
                data.comentarios || null
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Registrar en logs
                    this.logAction('CREATE', 'confirmaciones', this.lastID, null, JSON.stringify(data));
                    resolve({ id: this.lastID, ...data });
                }
            });
        });
    }

    // Obtener todas las confirmaciones
    getConfirmaciones(filters = {}) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM confirmaciones";
            let params = [];
            let conditions = [];

            // Aplicar filtros
            if (filters.estado) {
                conditions.push("estado = ?");
                params.push(filters.estado);
            }

            if (filters.busqueda) {
                conditions.push("(nombre LIKE ? OR email LIKE ?)");
                params.push(`%${filters.busqueda}%`, `%${filters.busqueda}%`);
            }

            if (conditions.length > 0) {
                sql += " WHERE " + conditions.join(" AND ");
            }

            sql += " ORDER BY fecha_confirmacion DESC";

            // Aplicar paginación
            if (filters.limit) {
                sql += " LIMIT ?";
                params.push(filters.limit);
                
                if (filters.offset) {
                    sql += " OFFSET ?";
                    params.push(filters.offset);
                }
            }

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Obtener confirmación por ID
    getConfirmacionById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM confirmaciones WHERE id = ?";
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Actualizar confirmación
    updateConfirmacion(id, data) {
        return new Promise((resolve, reject) => {
            // Obtener datos anteriores para el log
            this.getConfirmacionById(id).then(oldData => {
                const sql = `
                    UPDATE confirmaciones 
                    SET nombre = ?, email = ?, telefono = ?, estado = ?, 
                        comentarios = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `;
                
                this.db.run(sql, [
                    data.nombre,
                    data.email || null,
                    data.telefono || null,
                    data.estado,
                    data.comentarios || null,
                    id
                ], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Registrar en logs
                        this.logAction('UPDATE', 'confirmaciones', id, JSON.stringify(oldData), JSON.stringify(data));
                        resolve({ id, ...data });
                    }
                });
            }).catch(reject);
        });
    }

    // Eliminar confirmación
    deleteConfirmacion(id) {
        return new Promise((resolve, reject) => {
            // Obtener datos para el log
            this.getConfirmacionById(id).then(oldData => {
                const sql = "DELETE FROM confirmaciones WHERE id = ?";
                this.db.run(sql, [id], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Registrar en logs
                        this.logAction('DELETE', 'confirmaciones', id, JSON.stringify(oldData), null);
                        resolve({ id });
                    }
                });
            }).catch(reject);
        });
    }

    // Obtener estadísticas
    getEstadisticas() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN estado = 'confirmed' THEN 1 ELSE 0 END) as confirmados,
                    SUM(CASE WHEN estado = 'pending' THEN 1 ELSE 0 END) as pendientes,
                    SUM(CASE WHEN estado = 'cancelled' THEN 1 ELSE 0 END) as cancelados
                FROM confirmaciones
            `;
            
            this.db.get(sql, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // ==== OPERACIONES PARA EVENTOS ====

    // Obtener evento activo
    getEventoActivo() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM eventos WHERE activo = 1 ORDER BY created_at DESC LIMIT 1";
            this.db.get(sql, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Actualizar evento
    updateEvento(id, data) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE eventos 
                SET titulo = ?, fecha_evento = ?, lugar = ?, direccion = ?, 
                    descripcion = ?, activo = ?
                WHERE id = ?
            `;
            
            this.db.run(sql, [
                data.titulo,
                data.fecha_evento,
                data.lugar,
                data.direccion,
                data.descripcion,
                data.activo ? 1 : 0,
                id
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, ...data });
                }
            });
        });
    }

    // ==== SISTEMA DE LOGS ====

    // Obtener logs
    getLogs(limit = 100) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM logs ORDER BY fecha DESC LIMIT ?";
            this.db.all(sql, [limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // ==== EXPORTACIÓN DE DATOS ====

    // Exportar confirmaciones a CSV
    exportToCSV() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    id,
                    nombre,
                    email,
                    telefono,
                    estado,
                    fecha_confirmacion,
                    ip,
                    comentarios,
                    created_at
                FROM confirmaciones 
                ORDER BY fecha_confirmacion DESC
            `;
            
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const csv = this.convertToCSV(rows);
                    resolve(csv);
                }
            });
        });
    }

    // Convertir datos a CSV
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return `"${value || ''}"`;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    // ==== UTILIDADES ====

    // Cerrar conexión
    close() {
        return new Promise((resolve) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Error al cerrar la base de datos:', err);
                } else {
                    console.log('✅ Base de datos cerrada');
                }
                resolve();
            });
        });
    }

    // Ejecutar consulta personalizada
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Ejecutar consulta de una sola fila
    queryOne(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Ejecutar consulta de inserción/actualización
    execute(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }
}

// Crear instancia global
const db = new Database();

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
    console.log('\n🔄 Cerrando base de datos...');
    await db.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Cerrando base de datos...');
    await db.close();
    process.exit(0);
});

module.exports = db;
