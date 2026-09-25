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
        ['template1', 'Moderna', 'Oscura, geométrica, con catálogo en grilla.', '#4f46e5', '#0f172a', 'moderna'],
        ['template2', 'Clara', 'Blanca, barra de anuncios y tarjetas clásicas.', '#3b82f6', '#1e293b', 'minimal'],
        ['template3', 'Urbana', 'Amarillo y negro, bordes gruesos y sombra dura.', '#facc15', '#000000', 'brutal'],
        ['template4', 'Boutique', 'Rosa, papel crema y títulos en serif.', '#f9a8d4', '#334155', 'boutique'],
        ['template5', 'Terminal', 'Negro, letra mono y verde neón.', '#22c55e', '#0a0a0a', 'terminal'],
        ['template6', 'Glamour', 'Rosa fuerte, letra script y fichas redondas.', '#ec4899', '#1f2937', 'glam'],
        ['template7', 'Gourmet', 'Hero a pantalla completa y letra de restaurante.', '#ea580c', '#292524', 'gourmet'],
        ['template8', 'Studio', 'Mucho blanco, foto grande y botones finos.', '#a8a29e', '#1c1917', 'studio'],
        ['template9', 'Power', 'Rojo, títulos condensados y botones inclinados.', '#ef4444', '#111827', 'power'],
        ['template10', 'Feria', 'Puestos de mercado, sellos y filas, no una grilla.', '#e11d48', '#431407', 'feria']
    ];

    const LOOKS = {
        template1: { page: '#0f172a', ink: '#e2e8f0', nav: 'rgba(15,23,42,.9)', btn: '999px', font: 'Space Grotesk, sans-serif' },
        template2: { page: '#f8fafc', ink: '#1e293b', nav: '#ffffff', btn: '6px', font: 'Plus Jakarta Sans, sans-serif' },
        template3: { page: '#facc15', ink: '#000000', nav: '#ffffff', btn: '0px', font: 'Archivo, sans-serif' },
        template4: { page: '#fdfbf7', ink: '#334155', nav: '#ffffff', btn: '999px', font: 'Playfair Display, serif' },
        template5: { page: '#0a0a0a', ink: '#22c55e', nav: '#111111', btn: '0px', font: 'Space Mono, monospace' },
        template6: { page: '#fff0f5', ink: '#4a044e', nav: '#ffffff', btn: '999px', font: 'Great Vibes, cursive' },
        template7: { page: '#1c1917', ink: '#fff7ed', nav: '#292524', btn: '999px', font: 'Lora, serif' },
        template8: { page: '#ffffff', ink: '#1c1917', nav: '#ffffff', btn: '0px', font: 'Outfit, sans-serif' },
        template9: { page: '#111827', ink: '#fee2e2', nav: '#111827', btn: '0px', font: 'Oswald, sans-serif' },
        template10: { page: '#fff6e8', ink: '#431407', nav: '#fff6e8', btn: '999px', font: 'Fraunces, serif' }
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
            tile: (LOOKS[b[0]].ink.charAt(1) === 'e' || LOOKS[b[0]].ink.charAt(1) === 'f') ? 'rgba(255,255,255,.08)' : '#ffffff',
            layout: b[5]
        }));
        return list;
    }

    function templatePreview(layout, primary, secondary) {
        const p = primary;
        const s = secondary;
        const box = 'width:100%;height:188px;overflow:hidden;box-sizing:border-box;';
        if (layout === 'minimal') {
            return '<div style="' + box + 'background:#f8fafc;color:#0f172a;font-family:Plus Jakarta Sans,sans-serif">'
                + '<div style="background:' + p + ';color:#fff;font-size:8px;padding:3px 8px">Envíos a todo el país</div>'
                + '<div style="background:#fff;height:22px;display:flex;align-items:center;justify-content:space-between;padding:0 8px;border-bottom:1px solid #e2e8f0;font-size:10px;font-weight:800">Tienda <span style="color:' + p + '">Buscar</span></div>'
                + '<div style="text-align:center;padding:8px 10px 4px;font-weight:800;font-size:13px">Novedades</div>'
                + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px;padding:0 8px">'
                + [1,2,3,4].map(function () { return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:4px;overflow:hidden"><div style="height:28px;background:#e2e8f0"></div><div style="font-size:7px;padding:2px;font-weight:700;color:' + s + '">Gs.</div></div>'; }).join('')
                + '</div></div>';
        }
        if (layout === 'brutal') {
            return '<div style="' + box + 'background:#fff;color:#000;font-family:Archivo,sans-serif;border:3px solid #000">'
                + '<div style="display:flex;height:100%"><div style="width:52%;border-right:3px solid #000;padding:8px"><div style="display:inline-block;background:' + p + ';border:2px solid #000;font-size:8px;font-weight:900;padding:1px 4px">OFICIAL</div><div style="font-size:16px;font-weight:900;line-height:.9;margin-top:6px">ROMPE LAS REGLAS</div><div style="margin-top:8px;display:inline-block;background:' + p + ';border:3px solid #000;box-shadow:3px 3px 0 #000;font-size:8px;font-weight:900;padding:3px 6px">COMPRAR</div></div>'
                + '<div style="width:48%;background:' + p + '"></div></div></div>';
        }
        if (layout === 'boutique') {
            return '<div style="' + box + 'background:#fdfbf7;color:#334155;font-family:Playfair Display,serif;text-align:center;padding:10px">'
                + '<div style="font-style:italic;font-size:16px">Elegancia</div><div style="width:28px;height:2px;background:' + p + ';margin:4px auto"></div>'
                + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:8px">'
                + [1,2,3].map(function () { return '<div style="background:#fff;border-radius:12px;padding:3px"><div style="height:46px;border-radius:10px;background:' + p + '"></div><div style="font-size:8px;margin-top:3px">Pieza</div></div>'; }).join('')
                + '</div></div>';
        }
        if (layout === 'terminal') {
            return '<div style="' + box + 'background:#0a0a0a;color:' + p + ';font-family:Space Mono,monospace;padding:8px">'
                + '<div style="font-size:8px;opacity:.7">> SYS_READY</div><div style="font-size:13px;margin-top:4px;text-shadow:0 0 8px ' + p + '">INITIALIZING...</div>'
                + '<div style="margin-top:8px;border:1px solid ' + p + ';padding:4px;font-size:8px">CATALOG // 04 ITEMS<br>[OK] SEARCH<br>[OK] PRODUCT</div></div>';
        }
        if (layout === 'glam') {
            return '<div style="' + box + 'background:#fff0f5;color:#4a044e;font-family:Quicksand,sans-serif;padding:8px">'
                + '<div style="font-family:Great Vibes,cursive;font-size:22px;text-align:center;color:' + p + '">Glamour</div>'
                + '<div style="display:flex;gap:6px;margin-top:6px">'
                + [1,2,3].map(function () { return '<div style="flex:1;background:#fff;border-radius:16px;padding:4px;text-align:center"><div style="height:48px;border-radius:12px;background:linear-gradient(135deg,' + p + ',#fff)"></div><div style="font-size:8px;margin-top:3px;background:#fce7f3;color:' + p + ';border-radius:8px">ver</div></div>'; }).join('')
                + '</div></div>';
        }
        if (layout === 'gourmet') {
            return '<div style="' + box + 'background:#1c1917;color:#fff;font-family:Lora,serif">'
                + '<div style="height:112px;background:linear-gradient(160deg,#292524,' + p + ');display:flex;align-items:center;justify-content:center;flex-direction:column"><div style="font-style:italic;color:' + p + ';font-size:11px">Sabor</div><div style="font-size:18px">Gourmet</div></div>'
                + '<div style="display:flex;gap:6px;padding:8px">' + [1,2,3].map(function () { return '<div style="flex:1;height:36px;background:#292524;border-radius:8px"></div>'; }).join('') + '</div></div>';
        }
        if (layout === 'studio') {
            return '<div style="' + box + 'background:#fff;color:#1c1917;font-family:Outfit,sans-serif;display:flex">'
                + '<div style="width:58%;background:#e7e5e4"></div><div style="width:42%;padding:12px"><div style="font-size:18px;font-weight:500;line-height:1">Espacios que inspiran</div><div style="margin-top:10px;display:inline-block;border:1px solid #1c1917;font-size:8px;padding:3px 6px">Ver tienda</div></div></div>';
        }
        if (layout === 'power') {
            return '<div style="' + box + 'background:#f3f4f6;color:#111827;font-family:Oswald,sans-serif">'
                + '<div style="background:#111827;color:#fff;padding:8px 10px;font-size:18px;letter-spacing:.04em">ROMPE TUS LÍMITES</div>'
                + '<div style="padding:8px"><div style="display:inline-block;background:' + p + ';color:#fff;transform:skewX(-12deg);font-size:10px;padding:4px 8px;box-shadow:4px 4px 0 #111">ENTRENAR</div>'
                + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px"><div style="height:40px;background:#111"></div><div style="height:40px;background:' + p + '"></div></div></div></div>';
        }
        return '<div style="' + box + 'background:#fff6e8;color:#431407;font-family:Fraunces,serif;padding:8px">'
            + '<div style="display:flex;justify-content:space-between;align-items:center"><b>Feria</b><span style="border:2px dashed ' + p + ';border-radius:99px;font-size:8px;padding:2px 6px;color:' + p + '">puesto</span></div>'
            + '<div style="margin-top:8px">'
            + [1,2,3].map(function (n) { return '<div style="display:flex;gap:6px;align-items:center;margin-top:4px"><div style="width:28px;height:28px;border-radius:50%;background:' + (n === 2 ? s : p) + '"></div><div style="flex:1;border-bottom:1px dashed #d6d3d1;font-size:9px">Producto ' + n + '</div><b style="font-size:9px">Gs</b></div>'; }).join('')
            + '</div></div>';
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
        PLANS, TEMPLATES, PALETTES, templatePreview,
        slugify, isValidSlug, storeHost, storeUrl,
        highestPlan, canCreateSite, canUseAi, bumpAiUsage, aiUpdatesUsed,
        buildAiPrompt, draftProductCopy, paymentAlias,
        accountPlanId, setAccountPlan, siteBlocked, orderedSites
    };
})();
