// ==========================================================================
// WUEPY FRONTEND - NÚCLEO DE CONEXIÓN CON LA API Y RENDERIZADOR IA (V7)
// ==========================================================================

// 1. Detección automática del entorno (Local vs Producción)
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL del backend en Render (Asegúrate de que no termine en /)
const RENDER_BACKEND_URL = 'https://wuepyback.onrender.com/api'; 
const API_URL = isLocal ? 'http://localhost:3000/api' : RENDER_BACKEND_URL; 

// ==========================================================================
// MÓDULO 1: WUEPY API (GESTIÓN DE PETICIONES Y SESIONES)
// ==========================================================================
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
        const headers = { ...options.headers };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }

        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        const fetchOptions = {
            ...options,
            headers,
            credentials: 'include' 
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
            
            let data = {};
            try { data = await response.json(); } catch (e) {
                console.warn("[WuepyAPI] La respuesta no es JSON válido.");
            }

            if (response.status === 401 && !endpoint.includes('login')) {
                this.logoutLocal();
            }

            return { status: response.status, ok: response.ok, data: data };
        } catch (error) {
            console.error("[WuepyAPI] Error Crítico de Fetching:", error);
            throw error;
        }
    }
};

// ==========================================================================
// MÓDULO 2: WUEPY STORE ENGINE (EL MAGO INYECTOR DE LA IA V7)
// ==========================================================================
const WuepyStoreEngine = {
    formatMoney(amount) {
        return new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG' }).format(amount);
    },

    // Inyecta las dependencias del diseño de la IA si no existen en el HTML actual
    loadAiDependencies(htmlContent) {
        if (htmlContent.includes('tailwindcss') && !document.querySelector('script[src*="tailwindcss"]')) {
            const tw = document.createElement('script');
            tw.src = "https://cdn.tailwindcss.com";
            document.head.appendChild(tw);
        }
        if (htmlContent.includes('alpinejs') && !document.querySelector('script[src*="alpinejs"]')) {
            const alpine = document.createElement('script');
            alpine.defer = true;
            alpine.src = "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js";
            document.head.appendChild(alpine);
        }
        if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
            const fonts = document.createElement('link');
            fonts.rel = "stylesheet";
            fonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap";
            document.head.appendChild(fonts);
        }
    },

    // Tarjeta de Producto de Alta Conversión y Diseño Brutal
    createProductCard(product, primaryColor) {
        const price = this.formatMoney(product.price);
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600?text=Sin+Imagen';
        const cat = product.category || 'Destacado';
        
        // Manejo inteligente de colores (Soporta colores nativos de Tailwind como 'emerald-500' o códigos HEX)
        const isHex = primaryColor.startsWith('#');
        const bgClass = isHex ? `bg-[${primaryColor}]` : `bg-${primaryColor}`;

        return `
            <div class="wuepy-product-card group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer flex flex-col h-full transition-all duration-500" onclick="window.location.href='/p/${product._id}'">
                <div class="relative aspect-square overflow-hidden bg-slate-100">
                    <img src="${imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" alt="${product.name}">
                    <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-slate-800 tracking-wider uppercase shadow-sm">${cat}</div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-tight">${product.name}</h3>
                    <div class="mt-auto flex items-end justify-between pt-4">
                        <span class="text-2xl font-black text-slate-900 tracking-tight">${price}</span>
                        <button class="w-12 h-12 rounded-full bg-slate-100 text-slate-600 group-hover:${bgClass} group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                            <i class="fas fa-shopping-cart text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Inyector del Catálogo Múltiple
    injectDynamicProducts(products, primaryColor) {
        const container = document.getElementById('wuepy-dynamic-products');
        if (!container) return;

        if (!products || products.length === 0) {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <i class="fas fa-box-open text-6xl text-slate-300 mb-6"></i>
                    <h3 class="text-2xl font-black text-slate-700 mb-2">Inventario Vacío</h3>
                    <p class="text-lg text-slate-500">Pronto agregaremos nuevos productos.</p>
                </div>`;
            return;
        }

        container.innerHTML = products.map(p => this.createProductCard(p, primaryColor)).join('');
        console.log(`[Wuepy Inyector] 🛒 Renderizado brutal de ${products.length} productos.`);
    },

    // Inyector del Detalle de Producto Único
    injectProductDetail(product, site) {
        const container = document.getElementById('wuepy-dynamic-product-detail');
        if (!container) return;

        const primaryColor = site.primaryColor || 'blue-600';
        const isHex = primaryColor.startsWith('#');
        const bgClass = isHex ? `bg-[${primaryColor}]` : `bg-${primaryColor}`;
        const textClass = isHex ? `text-[${primaryColor}]` : `text-${primaryColor}`;

        const price = this.formatMoney(product.price);
        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/800?text=Sin+Imagen';
        const description = product.description || 'Producto sin descripción.';
        const category = product.category || 'General';
        
        const whatsappNumber = site.contact?.whatsapp || '';
        const mensajeWa = encodeURIComponent(`Hola! Estoy viendo su catálogo online y me interesa comprar este producto: ${product.name} a ${price}. ¿Tienen stock?`);
        const waLink = `https://wa.me/${whatsappNumber}?text=${mensajeWa}`;

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div class="aspect-square rounded-[3rem] overflow-hidden bg-slate-50 shadow-2xl border-8 border-white group">
                    <img src="${imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" alt="${product.name}">
                </div>
                
                <div class="flex flex-col justify-center py-10 lg:pr-10">
                    <span class="px-5 py-2 bg-slate-100 text-slate-600 font-bold rounded-full text-xs uppercase tracking-widest inline-block w-max mb-8">${category}</span>
                    <h1 class="text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">${product.name}</h1>
                    <p class="text-4xl font-extrabold ${textClass} mb-8">${price}</p>
                    
                    <div class="w-16 h-2 bg-slate-100 rounded-full mb-8"></div>
                    
                    <p class="text-xl text-slate-600 leading-relaxed mb-12 font-medium">${description}</p>
                    
                    <div class="flex flex-col sm:flex-row gap-6">
                        <a href="${waLink}" target="_blank" class="flex-1 ${bgClass} text-white font-black uppercase tracking-widest text-lg text-center py-6 rounded-2xl shadow-xl hover:opacity-90 hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-4">
                            <i class="fab fa-whatsapp text-3xl"></i> Comprar Ahora
                        </a>
                        <button class="px-8 py-6 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition shadow-sm hover:shadow-md border border-slate-200 group" onclick="navigator.clipboard.writeText(window.location.href); alert('¡Enlace copiado!')">
                            <i class="fas fa-share-nodes text-2xl group-hover:scale-110 transition"></i>
                        </button>
                    </div>
                    
                    <div class="mt-12 flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <i class="fas fa-shield-alt"></i> Compra segura garantizada por ${site.name}
                    </div>
                </div>
            </div>
        `;
        console.log(`[Wuepy Inyector] 📦 Vista de Super-Producto inyectada.`);
    },

    // Inyector del Muro de Pago
    injectPaymentWall(paymentAlias) {
        console.log("[Wuepy Engine] Bloqueo por falta de pago activado.");
        
        const wall = document.createElement('div');
        wall.className = "fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto";
        wall.innerHTML = `
            <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center transform transition-all relative">
                <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg absolute -top-10 left-1/2 -translate-x-1/2">
                    <i class="fas fa-lock text-3xl text-red-500"></i>
                </div>
                
                <div class="pt-10">
                    <h2 class="text-3xl font-black text-slate-900 mb-3">Sitio Suspendido</h2>
                    <p class="text-slate-500 mb-8 font-medium leading-relaxed">Esta tienda se encuentra temporalmente inactiva por falta de pago o vencimiento de la prueba gratuita.</p>
                    
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 relative overflow-hidden shadow-inner">
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Para reactivar, transfiere al Alias:</p>
                        <p class="text-2xl font-black text-slate-800 tracking-wider bg-white py-2 px-4 rounded-xl border border-slate-200 inline-block">${paymentAlias || 'WUEPY.PAGOS'}</p>
                    </div>
                    
                    <div class="text-sm text-slate-500 mb-8 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                        <i class="fas fa-info-circle mr-1"></i> Si eres el dueño, ingresa a tu <strong>Panel de Control</strong> en Wuepy para subir tu comprobante de pago.
                    </div>
                    
                    <div class="flex flex-col gap-3">
                        <a href="https://wuepy.com/auth/login.html" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors w-full shadow-lg shadow-indigo-600/30">
                            Ir al Panel de Control
                        </a>
                        <a href="https://wuepy.com" class="inline-block text-slate-500 font-bold py-3 px-6 rounded-xl transition-colors w-full hover:bg-slate-50">
                            Conocer más sobre Wuepy
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(wall);
        document.body.style.overflow = 'hidden';
        
        // Desenfoque extremo de todos los elementos hermanos
        const children = document.body.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i] !== wall && children[i].tagName !== 'SCRIPT' && children[i].tagName !== 'STYLE' && children[i].tagName !== 'LINK') {
                children[i].style.filter = 'blur(12px) grayscale(50%)';
                children[i].style.pointerEvents = 'none';
                children[i].style.userSelect = 'none';
            }
        }
    },

    // Orquestador Principal (Llamado desde index.html de los subdominios)
    processAiResponse(data) {
        if (!data.success || !data.isAiGenerated || !data.htmlContent) return false;

        console.log("[Wuepy Engine] Detectada Bóveda IA. Reemplazando DOM e inyectando dependencias...");
        
        // 1. Cargar dependencias (Tailwind/Alpine) antes de cambiar el HTML
        this.loadAiDependencies(data.htmlContent);

        // 2. Extraer SOLO el contenido del <body> para no matar nuestros scripts vitales en el <head>
        const bodyMatch = data.htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
            document.body.innerHTML = bodyMatch[1];
        } else {
            // Fallback si la regex falla
            document.body.innerHTML = data.htmlContent; 
        }

        // 3. Extraer y aplicar las clases maestras que la IA le puso al <body>
        const bodyTagMatch = data.htmlContent.match(/<body([^>]*)>/i);
        if (bodyTagMatch && bodyTagMatch[1]) {
            const classMatch = bodyTagMatch[1].match(/class=["']([^"']+)["']/i);
            if (classMatch && classMatch[1]) {
                document.body.className = classMatch[1];
            }
        }

        // 4. Inyectar Productos
        const primaryColor = data.site?.primaryColor || 'blue-600';
        
        if (data.products && data.products.length > 0) {
            this.injectDynamicProducts(data.products, primaryColor);
        }

        if (data.product) {
            this.injectProductDetail(data.product, data.site);
        }

        // 5. Reiniciar AlpineJS
        if (window.Alpine) {
            window.Alpine.initTree(document.body);
        }

        // 6. 🔥 EVALUACIÓN DE ESTADO FINANCIERO (MURO DE PAGO) 🔥
        if (data.needsPayment) {
            this.injectPaymentWall(data.paymentAlias);
        }

        return true;
    }
};

// ==========================================================================
// EXPORTACIÓN GLOBAL
// ==========================================================================
window.WuepyAPI = WuepyAPI;
window.WuepyStoreEngine = WuepyStoreEngine;
window.API_URL = API_URL;