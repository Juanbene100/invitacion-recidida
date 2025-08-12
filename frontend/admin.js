// Panel de Administración - Gestión Local de Confirmaciones
class AdminPanel {
    constructor() {
        this.confirmaciones = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredConfirmaciones = [];
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        this.loadConfirmaciones();
        this.setupEventListeners();
        this.renderTable();
        this.updateStats();
    }

    setupEventListeners() {
        // Búsqueda
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterConfirmaciones();
            this.currentPage = 1;
            this.renderTable();
        });

        // Botones
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());

        // Paginación
        document.getElementById('prevBtn').addEventListener('click', () => this.previousPage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());

        // Modal
        const modal = document.getElementById('detailModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadConfirmaciones() {
        // Cargar desde localStorage o usar datos de ejemplo
        const saved = localStorage.getItem('invitacion_confirmaciones');
        if (saved) {
            this.confirmaciones = JSON.parse(saved);
        } else {
            // Datos de ejemplo para mostrar cómo funciona
            this.confirmaciones = [
                {
                    id: 1,
                    nombre: 'María González',
                    email: 'maria@email.com',
                    telefono: '+54 381 123-4567',
                    confirmacion: 'confirmado',
                    fecha: '2025-01-27T10:30:00.000Z',
                    mensaje: '¡Me encantaría asistir!'
                },
                {
                    id: 2,
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos@email.com',
                    telefono: '+54 381 987-6543',
                    confirmacion: 'pendiente',
                    fecha: '2025-01-27T11:15:00.000Z',
                    mensaje: 'Confirmo mi asistencia'
                }
            ];
            this.saveConfirmaciones();
        }
        
        this.filteredConfirmaciones = [...this.confirmaciones];
    }

    saveConfirmaciones() {
        localStorage.setItem('invitacion_confirmaciones', JSON.stringify(this.confirmaciones));
    }

    filterConfirmaciones() {
        if (!this.searchTerm) {
            this.filteredConfirmaciones = [...this.confirmaciones];
        } else {
            this.filteredConfirmaciones = this.confirmaciones.filter(conf => 
                conf.nombre.toLowerCase().includes(this.searchTerm) ||
                conf.email.toLowerCase().includes(this.searchTerm) ||
                conf.telefono.includes(this.searchTerm)
            );
        }
    }

    renderTable() {
        const tbody = document.getElementById('confirmacionesTable');
        const noData = document.getElementById('noData');
        const pagination = document.getElementById('pagination');

        if (this.filteredConfirmaciones.length === 0) {
            tbody.innerHTML = '';
            noData.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }

        noData.style.display = 'none';
        pagination.style.display = 'flex';

        // Calcular paginación
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageConfirmaciones = this.filteredConfirmaciones.slice(startIndex, endIndex);

        tbody.innerHTML = pageConfirmaciones.map(conf => `
            <tr>
                <td><strong>${conf.nombre}</strong></td>
                <td>${conf.email}</td>
                <td>${conf.telefono}</td>
                <td>
                    <span class="confirmacion-status ${conf.confirmacion}">
                        ${conf.confirmacion === 'confirmado' ? '✅ Confirmado' : '⏳ Pendiente'}
                    </span>
                </td>
                <td>${this.formatDate(conf.fecha)}</td>
                <td class="acciones">
                    <button class="btn-accion btn-ver" onclick="adminPanel.viewDetails(${conf.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-accion btn-editar" onclick="adminPanel.editConfirmacion(${conf.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-accion btn-eliminar" onclick="adminPanel.deleteConfirmacion(${conf.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredConfirmaciones.length / this.itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredConfirmaciones.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTable();
        }
    }

    updateStats() {
        const total = this.confirmaciones.length;
        const hoy = new Date().toDateString();
        const confirmacionesHoy = this.confirmaciones.filter(conf => 
            new Date(conf.fecha).toDateString() === hoy
        ).length;

        document.getElementById('totalConfirmaciones').textContent = total;
        document.getElementById('confirmacionesHoy').textContent = confirmacionesHoy;
    }

    viewDetails(id) {
        const confirmacion = this.confirmaciones.find(c => c.id === id);
        if (!confirmacion) return;

        const modal = document.getElementById('detailModal');
        const modalContent = document.getElementById('modalContent');

        modalContent.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Nombre:</label>
                    <span>${confirmacion.nombre}</span>
                </div>
                <div class="detail-item">
                    <label>Email:</label>
                    <span>${confirmacion.email}</span>
                </div>
                <div class="detail-item">
                    <label>Teléfono:</label>
                    <span>${confirmacion.telefono}</span>
                </div>
                <div class="detail-item">
                    <label>Estado:</label>
                    <span class="confirmacion-status ${confirmacion.confirmacion}">
                        ${confirmacion.confirmacion === 'confirmado' ? '✅ Confirmado' : '⏳ Pendiente'}
                    </span>
                </div>
                <div class="detail-item">
                    <label>Fecha de Confirmación:</label>
                    <span>${this.formatDate(confirmacion.fecha)}</span>
                </div>
                <div class="detail-item full-width">
                    <label>Mensaje:</label>
                    <span>${confirmacion.mensaje || 'Sin mensaje'}</span>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    editConfirmacion(id) {
        // Por ahora solo mostramos un mensaje
        alert('Función de edición en desarrollo. Por favor, elimina y crea una nueva confirmación.');
    }

    deleteConfirmacion(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta confirmación?')) {
            this.confirmaciones = this.confirmaciones.filter(c => c.id !== id);
            this.saveConfirmaciones();
            this.filterConfirmaciones();
            this.currentPage = 1;
            this.renderTable();
            this.updateStats();
        }
    }

    exportToCSV() {
        if (this.filteredConfirmaciones.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const headers = ['Nombre', 'Email', 'Teléfono', 'Estado', 'Fecha', 'Mensaje'];
        const csvContent = [
            headers.join(','),
            ...this.filteredConfirmaciones.map(conf => [
                `"${conf.nombre}"`,
                `"${conf.email}"`,
                `"${conf.telefono}"`,
                `"${conf.confirmacion}"`,
                `"${this.formatDate(conf.fecha)}"`,
                `"${conf.mensaje || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `confirmaciones_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    refreshData() {
        this.loadConfirmaciones();
        this.filterConfirmaciones();
        this.currentPage = 1;
        this.renderTable();
        this.updateStats();
        
        // Efecto visual
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.innerHTML = '<i class="fas fa-check"></i> Actualizado';
        refreshBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
            refreshBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        }, 2000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Método para agregar confirmaciones desde el formulario principal
    addConfirmacion(confirmacion) {
        const newConfirmacion = {
            id: Date.now(),
            ...confirmacion,
            fecha: new Date().toISOString(),
            confirmacion: 'confirmado'
        };
        
        this.confirmaciones.unshift(newConfirmacion);
        this.saveConfirmaciones();
        this.filterConfirmaciones();
        this.currentPage = 1;
        this.renderTable();
        this.updateStats();
    }
}

// Inicializar el panel cuando se carga la página
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

// Función global para agregar confirmaciones desde el formulario principal
function addConfirmacionToAdmin(confirmacion) {
    if (adminPanel) {
        adminPanel.addConfirmacion(confirmacion);
    }
}
