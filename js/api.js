// ==========================================================================
// WUEPY FRONTEND - NÚCLEO DE CONEXIÓN CON LA API (Render / Contabo)
// ==========================================================================

// 1. Detección automática del entorno (Local vs Producción)
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// ATENCIÓN: Aquí pondrás la URL temporal de tu backend en Render para las pruebas.
// IMPORTANTE: Asegúrate de que termine en /api y no tenga un / extra al final.
// Cuando pases a tu servidor definitivo en Contabo, cambiarás esto por tu dominio oficial (ej: 'https://api.wuepy.com/api')
const RENDER_BACKEND_URL = 'https://wuepyback.onrender.com/api'; 

const API_URL = isLocal ? 'http://localhost:3000/api' : RENDER_BACKEND_URL; 

const WuepyAPI = {
    getUser() {
        const user = localStorage.getItem('wuepy_user');
        return user ? JSON.parse(user) : null;
    },
    
    setUser(userData) {
        localStorage.setItem('wuepy_user', JSON.stringify(userData));
    },
    
    logoutLocal() {
        localStorage.removeItem('wuepy_user');
        window.location.href = '/auth/login.html'; 
    },
    
    async fetch(endpoint, options = {}) {
        const user = this.getUser();
        
        // Configuramos los headers base
        const headers = { ...options.headers };

        // Si NO estamos enviando un archivo multipart (FormData), le decimos que es JSON
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }

        // Si el usuario está logueado, inyectamos el Token de seguridad
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        // CORRECCIÓN CRÍTICA PARA ARQUITECTURA SEPARADA: 
        // Obliga al navegador a enviar las cookies de sesión (cross-domain)
        const fetchOptions = {
            ...options,
            headers,
            credentials: 'include' 
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
            
            // Intentamos parsear el JSON de respuesta de forma segura
            let data = {};
            try { 
                data = await response.json(); 
            } catch (e) {
                console.warn("[WuepyAPI] La respuesta del servidor no es un JSON válido.");
            }

            // Sistema de autoprotección: Si la sesión expiró en el backend, limpiar el frontend
            if (response.status === 401 && !endpoint.includes('login')) {
                this.logoutLocal();
            }

            return { 
                status: response.status, 
                ok: response.ok,
                data: data 
            };
        } catch (error) {
            console.error("[WuepyAPI] Error de Fetching (Posible caída del servidor o problema de CORS):", error);
            throw error;
        }
    }
};

// Exponemos la herramienta globalmente
window.WuepyAPI = WuepyAPI;
window.API_URL = API_URL;