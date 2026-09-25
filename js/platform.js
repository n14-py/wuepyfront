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
        ['template1', 'Moderna', 'Fondo oscuro, letra geométrica y botones redondos.', '#4f46e5', '#0f172a'],
        ['template2', 'Clara', 'Fondo blanco, letra Inter y botones pastilla.', '#2563eb', '#0f172a'],
        ['template3', 'Editorial', 'Papel crema, letra serif y botones rectos.', '#1c1917', '#44403c'],
        ['template4', 'Noche', 'Fondo negro, letra Syne y botones esmeralda.', '#10b981', '#022c22'],
        ['template5', 'Arena', 'Fondo arena, letra clásica y botones ámbar.', '#b45309', '#78350f'],
        ['template6', 'Bosque', 'Fondo verde oscuro y botones suaves.', '#86efac', '#052e16'],
        ['template7', 'Papel', 'Fondo blanco, letra de diario y botones cuadrados.', '#111827', '#1f2937'],
        ['template8', 'Terminal', 'Fondo negro, letra mono y botones lima.', '#a3e635', '#111827'],
        ['template9', 'Pétalo', 'Fondo rosa claro y botones redondos.', '#be123c', '#4c0519'],
        ['template10', 'Marea', 'Fondo celeste, letra ancha y botones amplios.', '#0369a1', '#0c4a6e']
    ];

    const LOOKS = {
        template1: { page: '#0f172a', ink: '#e2e8f0', nav: 'rgba(15,23,42,.9)', btn: '999px', font: 'Space Grotesk, sans-serif' },
        template2: { page: '#ffffff', ink: '#0f172a', nav: '#ffffff', btn: '999px', font: 'Inter, sans-serif' },
        template3: { page: '#f6f1e8', ink: '#1c1917', nav: '#f6f1e8', btn: '0px', font: 'Fraunces, Georgia, serif' },
        template4: { page: '#030712', ink: '#e5e7eb', nav: '#030712', btn: '12px', font: 'Syne, sans-serif' },
        template5: { page: '#faf6f1', ink: '#44403c', nav: '#faf6f1', btn: '8px', font: 'Literata, Georgia, serif' },
        template6: { page: '#052e16', ink: '#ecfdf5', nav: '#052e16', btn: '18px', font: 'Outfit, sans-serif' },
        template7: { page: '#ffffff', ink: '#111827', nav: '#ffffff', btn: '0px', font: 'Newsreader, Georgia, serif' },
        template8: { page: '#09090b', ink: '#f4f4f5', nav: '#09090b', btn: '0px', font: 'IBM Plex Mono, monospace' },
        template9: { page: '#fff1f2', ink: '#4c0519', nav: '#fff1f2', btn: '999px', font: 'Nunito, sans-serif' },
        template10: { page: '#f0f9ff', ink: '#0c4a6e', nav: '#f0f9ff', btn: '20px', font: 'Manrope, sans-serif' }
    };

    function buildTemplates() {
        const list = BASES.map((b, i) => ({
            id: b[0],
            name: b[1],
            description: b[2],
            primary: b[3],
            secondary: b[4],
            tone: b[1],
            base: b[0],
            page: LOOKS[b[0]].page,
            ink: LOOKS[b[0]].ink,
            nav: LOOKS[b[0]].nav,
            btn: LOOKS[b[0]].btn,
            font: LOOKS[b[0]].font,
            tile: (LOOKS[b[0]].ink.charAt(1) === 'e' || LOOKS[b[0]].ink.charAt(1) === 'f') ? 'rgba(255,255,255,.08)' : '#ffffff'
        }));
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
            'Idea del dueño: ' + (b.idea || 'Tienda clara para vender por WhatsApp.') + '.',
            'La página no puede verse vacía. Incluí logo de la marca, hero con foto, texto de quiénes somos, beneficios, catálogo con el id wuepy-dynamic-products, ficha con el id wuepy-dynamic-product-detail, preguntas frecuentes, horarios, dirección, WhatsApp visible y pie con redes. Usá imágenes de https://images.unsplash.com relacionadas al rubro si no hay logo. Textos reales en español, nada de lorem ipsum ni secciones en blanco.'
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

    function accountPlanId(sites, user) {
        if (user && user.plan && PLANS[user.plan]) return user.plan;
        try {
            const saved = localStorage.getItem('wuepy_account_plan');
            if (saved && PLANS[saved]) return saved;
        } catch (e) {}
        const first = (sites || []).find(s => s && PLANS[s.plan]);
        return first ? first.plan : null;
    }

    function setAccountPlan(planId) {
        if (!PLANS[planId]) return;
        localStorage.setItem('wuepy_account_plan', planId);
    }

    function orderedSites(sites) {
        return (sites || []).slice().sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }

    function siteBlocked(site, sites, user) {
        const planId = accountPlanId(sites, user) || 'basico';
        const max = (PLANS[planId] || PLANS.basico).maxSites;
        const ordered = orderedSites(sites);
        const index = ordered.findIndex(s => (s._id || s.id) === (site._id || site.id));
        return index >= max;
    }

    window.WuepyPlatform = {
        PLANS, TEMPLATES, PALETTES,
        slugify, isValidSlug, storeHost, storeUrl,
        highestPlan, canCreateSite, canUseAi, bumpAiUsage, aiUpdatesUsed,
        buildAiPrompt, draftProductCopy, paymentAlias,
        accountPlanId, setAccountPlan, siteBlocked, orderedSites
    };
})();
