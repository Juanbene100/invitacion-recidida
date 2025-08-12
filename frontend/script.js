// ==== SCRIPT PRINCIPAL DE LA INVITACIÓN ====

// Nombres sugeridos para autocompletado
const nombresSugeridos = [
    'María González',
    'Carlos Rodríguez',
    'Ana Martínez',
    'Luis Fernández',
    'Sofia López',
    'Diego Pérez',
    'Valentina Torres',
    'Mateo Silva',
    'Isabella Castro',
    'Nicolás Morales'
];

// Elementos del DOM
const form = document.getElementById('confirmacionForm');
const nombreInput = document.getElementById('nombre');
const submitBtn = document.getElementById('submitBtn');
const mensajeDiv = document.getElementById('mensaje');

// ==== FUNCIONALIDADES ====

// Autocompletado de nombres
nombreInput.addEventListener('input', function() {
    const valor = this.value.toLowerCase();
    const sugerencias = nombresSugeridos.filter(nombre => 
        nombre.toLowerCase().includes(valor)
    );
    
    if (sugerencias.length > 0 && valor.length > 0) {
        this.setAttribute('list', 'nombres-sugeridos');
        const datalist = document.getElementById('nombres-sugeridos') || crearDatalist();
        datalist.innerHTML = sugerencias.map(nombre => 
            `<option value="${nombre}">`
        ).join('');
    }
});

// Crear datalist si no existe
function crearDatalist() {
    const datalist = document.createElement('datalist');
    datalist.id = 'nombres-sugeridos';
    document.body.appendChild(datalist);
    return datalist;
}

// Manejar envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();
    enviarFormulario();
});

// Función para enviar formulario (simulada)
async function enviarFormulario() {
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
        // Siempre mostrar éxito
        mostrarMensaje('¡Confirmación registrada exitosamente!', 'success');
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
});
