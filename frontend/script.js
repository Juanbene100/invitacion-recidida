// ==== SCRIPT PRINCIPAL DE LA INVITACIÓN ====

// Elementos del DOM
const form = document.getElementById('confirmacionForm');
const nombreInput = document.getElementById('nombre');
const submitBtn = document.getElementById('submitBtn');
const mensajeDiv = document.getElementById('mensaje');

// ==== FUNCIONALIDADES ====

// Manejar envío del formulario - PREVENIR RECARGA
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Esto es CRUCIAL para evitar recarga
    enviarFormulario();
});

// Función para enviar formulario (simulada)
function enviarFormulario() {
    const nombre = nombreInput.value.trim();
    
    if (!nombre) {
        mostrarMensaje('Por favor, ingresa tu nombre', 'error');
        return;
    }
    
    // Simular envío
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simular delay de red
    setTimeout(() => {
        // Verificar nombres especiales para mensajes únicos
        if (nombre.toLowerCase() === 'german') {
            mostrarMensaje('¡Te amo hermoso! ❤️', 'special');
        } else if (nombre.toLowerCase() === 'aylen') {
            mostrarMensaje('¡Sos el amor de mi vida! 💖', 'special');
        } else if (nombre.toLowerCase() === 'enzo fernandez' || nombre.toLowerCase() === 'juan pablo benedetti') {
            // Acceso secreto al panel de administración
            mostrarMensaje('🔐 Acceso autorizado al panel de administración', 'admin-access');
            
            // Redirigir al panel admin después de 2 segundos
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);
            
            // No guardar esta confirmación en la base de datos
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirmar Asistencia';
            return;
        } else {
            mostrarMensaje('¡Confirmación registrada exitosamente!', 'success');
        }
        
        // Guardar en la base de datos local
        const confirmacion = {
            nombre: nombre,
            email: document.getElementById('email')?.value || '',
            telefono: document.getElementById('telefono')?.value || '',
            mensaje: document.getElementById('mensaje')?.value || ''
        };
        
        // Agregar a la base de datos local
        if (typeof addConfirmacionToAdmin === 'function') {
            addConfirmacionToAdmin(confirmacion);
        }
        
        // Guardar en localStorage como respaldo
        const confirmaciones = JSON.parse(localStorage.getItem('invitacion_confirmaciones') || '[]');
        confirmaciones.unshift({
            id: Date.now(),
            ...confirmacion,
            fecha: new Date().toISOString(),
            confirmacion: 'confirmado'
        });
        localStorage.setItem('invitacion_confirmaciones', JSON.stringify(confirmaciones));
        
        crearEfectoConfeti();
        form.reset();
        nombreInput.focus();
        
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirmar Asistencia';
    }, 1000);
}

// Mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.style.display = 'block';
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

// Crear efecto de confeti
function crearEfectoConfeti() {
    const colores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confeti = document.createElement('div');
            confeti.style.position = 'fixed';
            confeti.style.left = Math.random() * 100 + 'vw';
            confeti.style.top = '-10px';
            confeti.style.width = '10px';
            confeti.style.height = '10px';
            confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            confeti.style.borderRadius = '50%';
            confeti.style.pointerEvents = 'none';
            confeti.style.zIndex = '9999';
            confeti.style.animation = 'confetiFall 3s linear forwards';
            
            document.body.appendChild(confeti);
            
            // Remover confeti después de la animación
            setTimeout(() => {
                confeti.remove();
            }, 3000);
        }, i * 100);
    }
}

// ==== ANIMACIONES AL SCROLL ====

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
document.addEventListener('DOMContentLoaded', function() {
    const elementosAnimables = document.querySelectorAll('.event-details, .hosts-names, .title-container');
    elementosAnimables.forEach(el => observer.observe(el));
});

// ==== FUNCIONALIDADES ADICIONALES ====

// Validación en tiempo real
nombreInput.addEventListener('blur', function() {
    if (this.value.trim()) {
        this.classList.add('valid');
        this.classList.remove('invalid');
    } else {
        this.classList.remove('valid');
        this.classList.add('invalid');
    }
});

// Limpiar clases al escribir
nombreInput.addEventListener('input', function() {
    this.classList.remove('valid', 'invalid');
});

// ==== INICIALIZACIÓN ====

// Enfoque automático en el input
document.addEventListener('DOMContentLoaded', function() {
    nombreInput.focus();
    
    // Agregar clase inicial para animación
    document.body.classList.add('loaded');
    
    // Verificar que el formulario existe
    if (form) {
        console.log('✅ Formulario encontrado y configurado');
    } else {
        console.error('❌ Formulario no encontrado');
    }
});
