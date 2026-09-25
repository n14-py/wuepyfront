// Contratos de plataforma Wuepy (frontend). El backend debe respetar estos límites y campos.
(function () {
    const PLANS = {
        basico: {
            id: 'basico',
            name: 'Básico',
            price: 30000,
            maxSites: 1,
            aiSites: 1,
            aiUpdatesPerMonth: 1,
            products: 80,
            employees: 1,
            label: '1 tienda y 1 web con IA'
        },
        medio: {
            id: 'medio',
            name: 'Inteligente',
            price: 60000,
            maxSites: 3,
            aiSites: 3,
            aiUpdatesPerMonth: 5,
            products: 500,
            employees: 5,
            label: '3 tiendas y 5 actualizaciones IA al mes'
        },
        profesional: {
            id: 'profesional',
            name: 'Profesional',
            price: 150000,
            maxSites: 25,
            aiSites: 25,
            aiUpdatesPerMonth: 999,
            products: 99999,
            employees: 50,
            label: 'Tiendas y IA casi ilimitadas'
        }
    };

    const PALETTES = [
        ['#4f46e5', '#0f172a', 'Índigo'],
        ['#059669', '#064e3b', 'Esmeralda'],
        ['#e11d48', '#1f2937', 'Rosa'],
        ['#d97706', '#1c1917', 'Ámbar'],
        ['#0284c7', '#0c4a6e', 'Cielo'],
        ['#7c3aed', '#1e1b4b', 'Violeta'],
        ['#0f766e', '#134e4a', 'Teal'],
        ['#be123c', '#111827', 'Carmín'],
        ['#ea580c', '#1c1917', 'Naranja'],
        ['#2563eb', '#172554', 'Azul']
    ];

    const BASES = [
        ['template1', 'Moderna', 'Catálogo claro, ideal para ropa y retail.'],
        ['template2', 'Oscura', 'Fondo oscuro para electrónica, motor o gaming.'],
        ['template3', 'Boutique', 'Look editorial para moda y belleza.'],
        ['template4', 'Mercado', 'Grilla de ofertas para supermercado y bodega.'],
        ['template5', 'Servicios', 'Portada para consultorios, talleres y agencias.'],
        ['template6', 'Gastronomía', 'Menú visual para restaurantes y lomiterías.'],
        ['template7', 'Deportes', 'Bloques grandes para gimnasio y artículos sport.'],
        ['template8', 'Inmobiliaria', 'Fichas amplias para propiedades y vehículos.'],
        ['template9', 'Mayorista', 'Listado denso para fábrica y venta por volumen.'],
        ['template10', 'Minimal', 'Mucho aire, tipografía grande, pocas distracciones.']
    ];

    function buildTemplates() {
        const list = BASES.map((b, i) => ({
            id: b[0],
            name: b[1],
            description: b[2],
            primary: PALETTES[i][0],
            secondary: PALETTES[i][1],
            tone: PALETTES[i][2],
            base: b[0]
        }));
        // 20 variantes: dos vueltas de color sobre las 10 bases.
        for (let n = 0; n < 20; n++) {
            const base = BASES[n % 10];
            const pal = PALETTES[(n + 3) % 10];
            const id = 'template' + (11 + n);
            list.push({
                id,
                name: base[1] + ' ' + pal[2],
                description: base[2] + ' Paleta ' + pal[2].toLowerCase() + '.',
                primary: pal[0],
                secondary: pal[1],
                tone: pal[2],
                base: base[0]
            });
        }
        return list;
    }

    const TEMPLATES = buildTemplates();

    function slugify(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '')
            .slice(0, 32);
    }

    function isValidSlug(slug) {
        return /^[a-z0-9]{3,32}$/.test(slug || '') && slug !== 'undefined' && slug !== 'null' && slug !== 'www' && slug !== 'wuepy';
    }

    function storeHost(site) {
        const slug = slugify(site && (site.subdomain || site.slug || site.name));
        return isValidSlug(slug) ? slug + '.wuepy.com' : '';
    }

    function storeUrl(site) {
        const host = storeHost(site);
        return host ? 'https://' + host : '';
    }

    function highestPlan(sites) {
        const rank = { basico: 1, medio: 2, profesional: 3 };
        let best = 'basico';
        (sites || []).forEach((s) => {
            if ((rank[s.plan] || 0) > (rank[best] || 0)) best = s.plan;
        });
        return PLANS[best] || PLANS.basico;
    }

    function canCreateSite(sites, planId) {
        const plan = PLANS[planId] || highestPlan(sites);
        const count = (sites || []).length;
        return { ok: count < plan.maxSites, count, max: plan.maxSites, plan };
    }

    function aiUsageKey(siteId) {
        const month = new Date().toISOString().slice(0, 7);
        return 'wuepy_ai_' + siteId + '_' + month;
    }

    function aiUpdatesUsed(site) {
        if (!site) return 0;
        if (typeof site.aiUpdatesThisMonth === 'number') return site.aiUpdatesThisMonth;
        const raw = localStorage.getItem(aiUsageKey(site._id || 'new'));
        return raw ? parseInt(raw, 10) || 0 : 0;
    }

    function bumpAiUsage(siteId) {
        const key = aiUsageKey(siteId || 'new');
        const next = (parseInt(localStorage.getItem(key) || '0', 10) || 0) + 1;
        localStorage.setItem(key, String(next));
        return next;
    }

    function canUseAi(site, sites) {
        const plan = PLANS[(site && site.plan) || 'basico'] || PLANS.basico;
        const aiSites = (sites || []).filter((s) => s.designMode === 'ai_generated').length;
        const used = site ? aiUpdatesUsed(site) : 0;
        const creating = !site;
        if (creating && aiSites >= plan.aiSites) {
            return { ok: false, reason: 'Tu plan ' + plan.name + ' permite ' + plan.aiSites + ' web(s) con IA.' };
        }
        if (!creating && used >= plan.aiUpdatesPerMonth) {
            return { ok: false, reason: 'Este mes ya usaste las ' + plan.aiUpdatesPerMonth + ' actualizaciones de IA de tu plan.' };
        }
        return { ok: true, plan, used };
    }

    function buildAiPrompt(brief) {
        const b = brief || {};
        return [
            'Marca: ' + (b.name || 'Mi tienda') + '.',
            'Rubro: ' + (b.businessType || 'comercio') + '.',
            'Ciudad: Paraguay.',
            'Estilo: ' + (b.style || 'limpio, comercial, confiable') + '.',
            'Color principal: ' + (b.primaryColor || '#4f46e5') + '. Color secundario: ' + (b.secondaryColor || '#0f172a') + '.',
            'Páginas obligatorias: inicio, catálogo, ficha de producto, contacto.',
            'Bloques: hero con título, texto de quiénes somos, grilla de productos en #wuepy-dynamic-products, ficha en #wuepy-dynamic-product-detail, WhatsApp de ventas, pie con dirección.',
            'Tono: español de Paraguay, frases cortas, sin lorem ipsum.',
            'Idea del dueño: ' + (b.idea || 'Tienda clara para vender por WhatsApp.')
        ].join(' ');
    }

    function draftProductCopy(title, hint) {
        const name = (title || 'Producto').trim();
        const extra = (hint || '').trim();
        return name + ' disponible en nuestra tienda. ' +
            (extra ? extra.replace(/\.$/, '') + '. ' : '') +
            'Ideal para el día a día, con atención por WhatsApp y envío coordinado en Paraguay. Consultá stock, colores y tiempos de entrega antes de comprar.';
    }

    function paymentAlias() {
        return 'wuepy.com';
    }

    window.WuepyPlatform = {
        PLANS, TEMPLATES, PALETTES,
        slugify, isValidSlug, storeHost, storeUrl,
        highestPlan, canCreateSite, canUseAi, bumpAiUsage, aiUpdatesUsed,
        buildAiPrompt, draftProductCopy, paymentAlias
    };
})();
