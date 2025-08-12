// ==== VARIABLES GLOBALES ====
let confirmacionesFiltradas = [];
let paginaActual = 1;
const elementosPorPagina = 5;
let confirmacionSeleccionada = null;

// ==== ELEMENTOS DEL DOM ====
const totalConfirmados = document.getElementById('totalConfirmados');
const totalPendientes = document.getElementById('totalPendientes');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const exportBtn = document.getElementById('exportBtn');
const selectAll = document.getElementById('selectAll');
const confirmationsTableBody = document.getElementById('confirmationsTableBody');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const currentPage = document.getElementById('currentPage');
const totalPages = document.getElementById('totalPages');

// Modales
const detailsModal = document.getElementById('detailsModal');
const confirmModal = document.getElementById('confirmModal');
const closeModal = document.getElementById('closeModal');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const cancelModal = document.getElementById('cancelModal');
const cancelConfirm = document.getElementById('cancelConfirm');
const confirmAction = document.getElementById('confirmAction');
const deleteConfirmation = document.getElementById('deleteConfirmation');

// ==== FUNCIONES PRINCIPALES ====

// Inicializar el panel
async function inicializarPanel() {
    try {
        await actualizarEstadisticas();
        await cargarConfirmaciones();
        actualizarPaginacion();
        configurarEventListeners();
    } catch (error) {
        console.error('Error al inicializar panel:', error);
        mostrarNotificacion('Error al cargar los datos', 'error');
    }
}

// Cargar confirmaciones desde la API
async function cargarConfirmaciones() {
    try {
        const response = await fetch('/api/confirmaciones');
        const data = await response.json();
        
        if (response.ok && data.success) {
            confirmacionesFiltradas = data.data;
            renderizarTabla();
        } else {
            throw new Error(data.error || 'Error al cargar confirmaciones');
        }
    } catch (error) {
        console.error('Error al cargar confirmaciones:', error);
        mostrarNotificacion('Error al cargar las confirmaciones', 'error');
    }
}

// Actualizar estadísticas desde la API
async function actualizarEstadisticas() {
    try {
        const response = await fetch('/api/estadisticas');
        const data = await response.json();
        
        if (response.ok && data.success) {
            const stats = data.data;
            totalConfirmados.textContent = stats.confirmados || 0;
            totalPendientes.textContent = stats.pendientes || 0;
        } else {
            throw new Error(data.error || 'Error al cargar estadísticas');
        }
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        totalConfirmados.textContent = '0';
        totalPendientes.textContent = '0';
    }
}

// Renderizar tabla
function renderizarTabla() {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const confirmacionesPagina = confirmacionesFiltradas.slice(inicio, fin);
    
    confirmationsTableBody.innerHTML = '';
    
    if (confirmacionesPagina.length === 0) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.7);">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                <p>No hay confirmaciones para mostrar</p>
            </td>
        `;
        confirmationsTableBody.appendChild(filaVacia);
        return;
    }
    
    confirmacionesPagina.forEach(confirmacion => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${confirmacion.id}">
            </td>
            <td>${confirmacion.nombre}</td>
            <td>
                <span class="status-badge status-${confirmacion.estado}">
                    ${confirmacion.estado === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                </span>
            </td>
            <td>${formatearFecha(confirmacion.fecha_confirmacion)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="verDetalles(${confirmacion.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn btn-edit" onclick="editarConfirmacion(${confirmacion.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="eliminarConfirmacion(${confirmacion.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        confirmationsTableBody.appendChild(fila);
    });
    
    // Configurar checkboxes de fila
    configurarCheckboxesFila();
}

// Actualizar paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(confirmacionesFiltradas.length / elementosPorPagina);
    
    currentPage.textContent = paginaActual;
    totalPages.textContent = totalPaginas;
    
    prevPage.disabled = paginaActual === 1;
    nextPage.disabled = paginaActual === totalPaginas;
}

// Formatear fecha
function formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Filtrar confirmaciones
async function filtrarConfirmaciones() {
    const busqueda = searchInput.value.toLowerCase();
    const filtroEstado = statusFilter.value;
    
    try {
        let url = '/api/confirmaciones?';
        const params = new URLSearchParams();
        
        if (filtroEstado !== 'all') {
            params.append('estado', filtroEstado);
        }
        
        if (busqueda) {
            params.append('busqueda', busqueda);
        }
        
        params.append('limit', '1000'); // Obtener todas para filtrar localmente
        
        const response = await fetch(url + params.toString());
        const data = await response.json();
        
        if (response.ok && data.success) {
            confirmacionesFiltradas = data.data;
            paginaActual = 1;
            renderizarTabla();
            actualizarPaginacion();
        } else {
            throw new Error(data.error || 'Error al filtrar confirmaciones');
        }
    } catch (error) {
        console.error('Error al filtrar confirmaciones:', error);
        mostrarNotificacion('Error al filtrar las confirmaciones', 'error');
    }
}

// Ver detalles
async function verDetalles(id) {
    try {
        const response = await fetch(`/api/confirmaciones/${id}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            const confirmacion = data.data;
            
            document.getElementById('modalName').textContent = confirmacion.nombre;
            document.getElementById('modalStatus').textContent = 
                confirmacion.estado === 'confirmed' ? 'Confirmado' : 'Pendiente';
            document.getElementById('modalDate').textContent = formatearFecha(confirmacion.fecha_confirmacion);
            document.getElementById('modalIP').textContent = confirmacion.ip || 'N/A';
            
            confirmacionSeleccionada = confirmacion;
            mostrarModal(detailsModal);
        } else {
            throw new Error(data.error || 'Error al cargar detalles');
        }
    } catch (error) {
        console.error('Error al ver detalles:', error);
        mostrarNotificacion('Error al cargar los detalles', 'error');
    }
}

// Editar confirmación
function editarConfirmacion(id) {
    // Por ahora solo mostrar un alert, pero podrías implementar un modal de edición
    mostrarNotificacion('Función de edición en desarrollo', 'error');
}

// Eliminar confirmación
function eliminarConfirmacion(id) {
    const confirmacion = confirmacionesFiltradas.find(c => c.id === id);
    if (!confirmacion) return;
    
    confirmacionSeleccionada = confirmacion;
    document.getElementById('confirmMessage').textContent = 
        `¿Estás seguro de que quieres eliminar la confirmación de "${confirmacion.nombre}"?`;
    
    mostrarModal(confirmModal);
}

// Confirmar eliminación
async function confirmarEliminacion() {
    if (!confirmacionSeleccionada) return;
    
    try {
        const response = await fetch(`/api/confirmaciones/${confirmacionSeleccionada.id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            cerrarModal(confirmModal);
            await cargarConfirmaciones();
            await actualizarEstadisticas();
            mostrarNotificacion('Confirmación eliminada exitosamente', 'success');
        } else {
            throw new Error(data.error || 'Error al eliminar confirmación');
        }
    } catch (error) {
        console.error('Error al eliminar confirmación:', error);
        mostrarNotificacion('Error al eliminar la confirmación', 'error');
    }
}

// Exportar datos
async function exportarDatos() {
    try {
        const response = await fetch('/api/exportar');
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'confirmaciones_recibida.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            mostrarNotificacion('Datos exportados exitosamente', 'success');
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Error al exportar datos');
        }
    } catch (error) {
        console.error('Error al exportar datos:', error);
        mostrarNotificacion('Error al exportar los datos', 'error');
    }
}

// Mostrar modal
function mostrarModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function cerrarModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    confirmacionSeleccionada = null;
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos de la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (tipo === 'success') {
        notificacion.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    } else if (tipo === 'error') {
        notificacion.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Configurar checkboxes de fila
function configurarCheckboxesFila() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarSelectAll);
    });
}

// Actualizar select all
function actualizarSelectAll() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checkboxesMarcados = document.querySelectorAll('.row-checkbox:checked');
    
    selectAll.checked = checkboxes.length > 0 && checkboxes.length === checkboxesMarcados.length;
    selectAll.indeterminate = checkboxesMarcados.length > 0 && checkboxesMarcados.length < checkboxes.length;
}

// ==== CONFIGURACIÓN DE EVENT LISTENERS ====
function configurarEventListeners() {
    // Búsqueda y filtros
    searchInput.addEventListener('input', debounce(filtrarConfirmaciones, 300));
    statusFilter.addEventListener('change', filtrarConfirmaciones);
    
    // Exportar
    exportBtn.addEventListener('click', exportarDatos);
    
    // Select all
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Paginación
    prevPage.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla();
            actualizarPaginacion();
        }
    });
    
    nextPage.addEventListener('click', () => {
        const totalPaginas = Math.ceil(confirmacionesFiltradas.length / elementosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarTabla();
            actualizarPaginacion();
        }
    });
    
    // Modales
    closeModal.addEventListener('click', () => cerrarModal(detailsModal));
    closeConfirmModal.addEventListener('click', () => cerrarModal(confirmModal));
    cancelModal.addEventListener('click', () => cerrarModal(detailsModal));
    cancelConfirm.addEventListener('click', () => cerrarModal(confirmModal));
    confirmAction.addEventListener('click', confirmarEliminacion);
    deleteConfirmation.addEventListener('click', () => {
        cerrarModal(detailsModal);
        confirmarEliminacion();
    });
    
    // Cerrar modales al hacer clic fuera
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            cerrarModal(detailsModal);
        }
    });
    
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            cerrarModal(confirmModal);
        }
    });
    
    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal(detailsModal);
            cerrarModal(confirmModal);
        }
    });
}

// Función debounce para optimizar búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==== ESTILOS CSS DINÁMICOS ====
const estilosDinamicos = document.createElement('style');
estilosDinamicos.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(estilosDinamicos);

// ==== INICIALIZACIÓN ====
document.addEventListener('DOMContentLoaded', inicializarPanel);

// ==== ACTUALIZACIÓN AUTOMÁTICA ====

// Actualizar datos cada 30 segundos
setInterval(async () => {
    try {
        await actualizarEstadisticas();
        await cargarConfirmaciones();
    } catch (error) {
        console.error('Error en actualización automática:', error);
    }
}, 30000);
