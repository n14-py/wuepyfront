// En desarrollo usa localhost. Cuando subas a Cloudflare, cambias esto por la IP o Dominio de Contabo
const API_URL = 'http://localhost:3000/api'; 

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

        // Si NO estamos enviando un archivo (FormData), le decimos que es JSON
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }

        // Si el usuario está logueado, inyectamos el Token de seguridad
        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });
            
            // Intentamos parsear el JSON de respuesta
            let data = {};
            try { data = await response.json(); } catch (e) {}

            return { 
                status: response.status, 
                ok: response.ok,
                data: data 
            };
        } catch (error) {
            console.error("WuepyAPI Fetch Error:", error);
            throw error;
        }
    }
};

window.WuepyAPI = WuepyAPI;
window.API_URL = API_URL;