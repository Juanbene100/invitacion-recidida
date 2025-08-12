// ==== SCRIPT PARA INVITACIÓN ====

// Nombres sugeridos para autocompletado
const nombresSugeridos = [
    'María González',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis Fernández',
    'Sofia López',
    'Diego Pérez',
    'Valentina Torres',
    'Matías Silva',
    'Camila Vargas',
    'Nicolás Morales'
];

// Elementos del DOM
const form = document.getElementById('confirmacionForm');
const nombreInput = document.getElementById('nombre');
const submitBtn = document.getElementById('submitBtn');
const mensajeDiv = document.getElementById('mensaje');

// ==== FUNCIONES PRINCIPALES ====

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

// Función para crear efecto de confeti
function crearEfectoConfeti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

// Función para manejar el envío del formulario
async function enviarFormulario(e) {
    e.preventDefault();
    
    const nombre = nombreInput.value.trim();
    
    if (!nombre) {
        mostrarMensaje('Por favor, ingresa tu nombre', 'error');
        return;
    }
    
    // Deshabilitar botón durante envío
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Simular envío exitoso (para Vercel)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Guardar en localStorage
        const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '[]');
        const nuevaConfirmacion = {
            id: Date.now(),
            nombre: nombre,
            fecha: new Date().toISOString(),
            estado: 'confirmed'
        };
        
        confirmaciones.push(nuevaConfirmacion);
        localStorage.setItem('confirmaciones', JSON.stringify(confirmaciones));
        
        // Mostrar mensaje de éxito
        mostrarMensaje('¡Confirmación registrada exitosamente!', 'success');
        crearEfectoConfeti();
        
        // Limpiar formulario
        form.reset();
        nombreInput.focus();
        
        // Actualizar contador
        actualizarContador();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al enviar la confirmación', 'error');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirmar Asistencia';
    }
}

// Función para actualizar contador de confirmaciones
function actualizarContador() {
    const confirmaciones = JSON.parse(localStorage.getItem('confirmaciones') || '[]');
    const contadorElement = document.getElementById('contadorConfirmaciones');
    
    if (contadorElement) {
        contadorElement.textContent = confirmaciones.length;
    }
}

// Función para autocompletar nombres
function autocompletarNombre() {
    const valor = nombreInput.value.toLowerCase();
    const sugerencias = nombresSugeridos.filter(nombre => 
        nombre.toLowerCase().includes(valor)
    );
    
    // Aquí podrías mostrar sugerencias en un dropdown
    // Por ahora solo actualizamos el placeholder
    if (sugerencias.length > 0 && valor.length > 2) {
        nombreInput.placeholder = `Sugerencia: ${sugerencias[0]}`;
    } else {
        nombreInput.placeholder = 'Escribe tu nombre aqui';
    }
}

// ==== EVENT LISTENERS ====

// Envío del formulario
form.addEventListener('submit', enviarFormulario);

// Autocompletado en tiempo real
nombreInput.addEventListener('input', autocompletarNombre);

// ==== INICIALIZACIÓN ====

// Actualizar contador al cargar
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    
    // Agregar clase para animación de entrada
    document.body.classList.add('loaded');
});

// ==== ANIMACIONES DE SCROLL ====

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll('.event-details, .hosts-names, .confirmation-form').forEach(el => {
    observer.observe(el);
});

// ==== FUNCIONES DE UTILIDAD ====

// Función debounce para optimizar búsqueda
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

// Aplicar debounce al autocompletado
const debouncedAutocompletar = debounce(autocompletarNombre, 300);
nombreInput.addEventListener('input', debouncedAutocompletar);
