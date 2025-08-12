// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmForm');
    const nombreInput = document.getElementById('nombre');
    const confirmarCheckbox = document.getElementById('confirmar');
    const mensajeDiv = document.getElementById('mensaje');
    const submitBtn = document.querySelector('.submit-btn');

    const nombresSugeridos = [
        'Tete', 'Arturo', 'Juan Pablo', 'Jorge Ariel', 'Mirtha Gladys',
        'María', 'Carlos', 'Ana', 'Luis', 'Sofía', 'Diego', 'Valentina',
        'Javier', 'Camila', 'Roberto', 'Patricia', 'Fernando', 'Lucía'
    ];

    let sugerenciasList = null;

    // Función para mostrar sugerencias de nombres
    function mostrarSugerencias(valor) {
        if (sugerenciasList) {
            sugerenciasList.remove();
            sugerenciasList = null;
        }

        if (valor.length < 2) return;

        const sugerencias = nombresSugeridos.filter(nombre => 
            nombre.toLowerCase().includes(valor.toLowerCase())
        );

        if (sugerencias.length === 0) return;

        sugerenciasList = document.createElement('ul');
        sugerenciasList.className = 'sugerencias-lista';
        sugerenciasList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            list-style: none;
            margin: 0;
            padding: 0;
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;

        sugerencias.forEach(sugerencia => {
            const li = document.createElement('li');
            li.textContent = sugerencia;
            li.style.cssText = `
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            `;
            
            li.addEventListener('mouseenter', () => {
                li.style.background = 'rgba(59, 130, 246, 0.2)';
            });
            
            li.addEventListener('mouseleave', () => {
                li.style.background = 'transparent';
            });
            
            li.addEventListener('click', () => {
                nombreInput.value = sugerencia;
                sugerenciasList.remove();
                sugerenciasList = null;
            });
            
            sugerenciasList.appendChild(li);
        });

        nombreInput.parentNode.style.position = 'relative';
        nombreInput.parentNode.appendChild(sugerenciasList);
    }

    // Event listeners para sugerencias
    nombreInput.addEventListener('input', function() {
        mostrarSugerencias(this.value);
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (sugerenciasList && !nombreInput.parentNode.contains(e.target)) {
            sugerenciasList.remove();
            sugerenciasList = null;
        }
    });

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `message ${tipo} show`;
        
        setTimeout(() => {
            mensajeDiv.classList.remove('show');
        }, 5000);
    }

    // Función para validar el formulario
    function validarFormulario() {
        const nombre = nombreInput.value.trim();
        const confirmado = confirmarCheckbox.checked;

        if (!nombre) {
            mostrarMensaje('Por favor, ingresa tu nombre completo', 'error');
            nombreInput.focus();
            return false;
        }

        if (!confirmado) {
            mostrarMensaje('Debes confirmar tu asistencia para continuar', 'error');
            confirmarCheckbox.focus();
            return false;
        }

        return true;
    }

    // Función para enviar el formulario a la API
    async function enviarFormulario() {
        const nombre = nombreInput.value.trim();
        
        // Cambiar estado del botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const response = await fetch('/api/confirmaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    estado: 'confirmed'
                })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensaje(data.message, 'success');
                crearEfectoConfeti();
                
                // Limpiar formulario
                form.reset();
                nombreInput.focus();
            } else {
                mostrarMensaje(data.error || 'Error al enviar la confirmación', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión. Intenta nuevamente.', 'error');
        } finally {
            // Restaurar estado del botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirmar Asistencia';
        }
    }

    // Función para crear efecto de confeti
    function crearEfectoConfeti() {
        const confetiContainer = document.createElement('div');
        confetiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confetiContainer);

        const colores = ['#3b82f6', '#1d4ed8', '#fbbf24', '#22c55e', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confeti = document.createElement('div');
                confeti.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${colores[Math.floor(Math.random() * colores.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: confetiFall 3s linear forwards;
                    border-radius: 2px;
                `;
                confetiContainer.appendChild(confeti);
                
                setTimeout(() => {
                    confeti.remove();
                }, 3000);
            }, i * 50);
        }

        setTimeout(() => {
            confetiContainer.remove();
        }, 4000);
    }

    // Agregar estilos CSS para el confeti
    const confetiStyle = document.createElement('style');
    confetiStyle.textContent = `
        @keyframes confetiFall {
            0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confetiStyle);

    // Event listener para el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validarFormulario()) {
            enviarFormulario();
        }
    });

    // Efectos de focus/blur para el input
    nombreInput.addEventListener('focus', function() {
        this.parentNode.style.transform = 'scale(1.02)';
    });

    nombreInput.addEventListener('blur', function() {
        this.parentNode.style.transform = 'scale(1)';
    });

    // Animaciones de entrada con Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animaciones a elementos
    document.querySelectorAll('.event-card, .form-group, .submit-btn').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Función para obtener estadísticas en tiempo real (opcional)
    async function actualizarEstadisticas() {
        try {
            const response = await fetch('/api/estadisticas');
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Aquí podrías actualizar algún contador en la página
                console.log('Estadísticas actualizadas:', data.data);
            }
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        }
    }

    // Actualizar estadísticas cada 30 segundos (opcional)
    setInterval(actualizarEstadisticas, 30000);
});
