// Guía interactiva de Wuepy Business. Pregunta, ilumina el botón y explica el paso.
(function () {
    const STATE = 'wuepy_guide_next';

    function dismissedKey(scope) {
        return 'wuepy_guide_dismissed_' + scope;
    }

    function qs(sel) {
        return document.querySelector(sel);
    }

    function wants(scope) {
        const guia = new URLSearchParams(window.location.search).get('guia');
        if (guia === '1' || guia === scope) return true;
        try {
            if (localStorage.getItem(dismissedKey(scope)) === '1') return false;
        } catch (e) {}
        return true;
    }

    function remember(scope) {
        try { localStorage.setItem(dismissedKey(scope), '1'); } catch (e) {}
    }

    function markPanel() {
        try { localStorage.setItem(STATE, 'panel'); } catch (e) {}
    }

    const css = `
      #wuepy-guide-btn{position:fixed;right:16px;bottom:16px;z-index:60;background:#0f172a;color:#fff;border:0;border-radius:999px;padding:14px 18px;font-weight:800;font-size:14px;letter-spacing:.02em;box-shadow:0 12px 30px rgba(15,23,42,.28);cursor:pointer;font-family:Inter,system-ui,sans-serif}
      #wuepy-guide-btn span{color:#60a5fa;margin-right:6px}
      #wuepy-guide{position:fixed;inset:0;z-index:80;font-family:Inter,system-ui,sans-serif}
      #wuepy-guide .shade{position:fixed;background:rgba(15,23,42,.72)}
      #wuepy-guide .ring{position:fixed;border:3px solid #2563eb;border-radius:18px;box-shadow:0 0 0 6px rgba(37,99,235,.25);pointer-events:none;z-index:82}
      #wuepy-guide .card{position:fixed;z-index:83;background:#fff;color:#0f172a;border-radius:28px;padding:22px;width:min(440px,calc(100vw - 24px));box-shadow:0 24px 60px rgba(0,0,0,.28)}
      #wuepy-guide .kicker{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#2563eb;margin:0 0 8px}
      #wuepy-guide h2{font-size:26px;line-height:1.15;margin:0 0 8px;letter-spacing:-.03em}
      #wuepy-guide p{margin:0;color:#475569;font-size:16px;line-height:1.5;font-weight:500}
      #wuepy-guide .row{display:flex;flex-direction:column;gap:10px;margin-top:18px}
      #wuepy-guide button.primary,#wuepy-guide a.primary{display:flex;align-items:center;justify-content:center;background:#2563eb;color:#fff;border:0;border-radius:16px;min-height:52px;padding:12px 16px;font-weight:800;font-size:16px;text-decoration:none;cursor:pointer}
      #wuepy-guide button.dark{background:#0f172a;color:#fff}
      #wuepy-guide button.ghost,#wuepy-guide a.ghost{background:transparent;border:0;color:#64748b;font-weight:700;min-height:40px;cursor:pointer;text-decoration:none}
      #wuepy-guide .progress{margin-top:14px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8}
      @media (max-width:640px){
        #wuepy-guide h2{font-size:22px}
        #wuepy-guide .card{left:12px!important;right:12px!important;width:auto;max-height:min(52vh,420px);overflow:auto}
      }
    `;

    function ensureCss() {
        if (document.getElementById('wuepy-guide-css')) return;
        const style = document.createElement('style');
        style.id = 'wuepy-guide-css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function Guide() {
        this.root = null;
        this.steps = [];
        this.index = 0;
        this.scope = 'landing';
        this.onDone = null;
        this._place = this.place.bind(this);
    }

    Guide.prototype.open = function (steps, scope) {
        this.steps = steps;
        this.scope = scope || 'landing';
        this.index = 0;
        ensureCss();
        if (!this.root) {
            this.root = document.createElement('div');
            this.root.id = 'wuepy-guide';
            document.body.appendChild(this.root);
        }
        window.addEventListener('resize', this._place);
        window.addEventListener('scroll', this._place, true);
        this.render();
    };

    Guide.prototype.close = function (done) {
        window.removeEventListener('resize', this._place);
        window.removeEventListener('scroll', this._place, true);
        if (this.root) this.root.remove();
        this.root = null;
        if (done) {
            remember(this.scope);
            try { if (this.scope === 'panel') localStorage.removeItem(STATE); } catch (e) {}
            if (this.onDone) this.onDone();
        }
    };

    Guide.prototype.render = function () {
        const step = this.steps[this.index];
        if (!step) { this.close(true); return; }
        if (step.type === 'ask') { this.card(step, null); return; }
        const node = qs(step.target);
        if (!node || node.getBoundingClientRect().height < 8) { this.index += 1; this.render(); return; }
        node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        const self = this;
        window.setTimeout(function () { self.card(step, node); }, 260);
    };

    Guide.prototype.card = function (step, node) {
        if (!this.root) return;
        const total = this.steps.length;
        const n = this.index + 1;
        const hole = node ? this.hole(node.getBoundingClientRect()) : null;
        let shades = '';
        if (hole) {
            shades = ''
                + '<div class="shade" style="left:0;top:0;right:0;height:' + hole.top + 'px"></div>'
                + '<div class="shade" style="left:0;top:' + hole.top + 'px;width:' + hole.left + 'px;height:' + hole.height + 'px"></div>'
                + '<div class="shade" style="left:' + hole.right + 'px;top:' + hole.top + 'px;right:0;height:' + hole.height + 'px"></div>'
                + '<div class="shade" style="left:0;top:' + hole.bottom + 'px;right:0;bottom:0"></div>'
                + '<div class="ring" style="left:' + hole.left + 'px;top:' + hole.top + 'px;width:' + hole.width + 'px;height:' + hole.height + 'px"></div>';
        } else {
            shades = '<div class="shade" style="inset:0"></div>';
        }
        const primary = step.primary || (this.index === total - 1 && !step.href ? 'Listo' : 'Siguiente');
        const secondary = step.secondary || 'Ahora no';
        this.root.innerHTML = shades + '<div class="card" role="dialog" aria-modal="true">'
            + '<p class="kicker">Wuepy Business</p>'
            + '<h2>' + step.title + '</h2>'
            + '<p>' + step.body + '</p>'
            + '<div class="row"></div>'
            + (step.type === 'ask' ? '' : '<div class="progress">Paso ' + n + ' de ' + total + '</div>')
            + '</div>';
        const row = this.root.querySelector('.row');
        const self = this;
        if (step.type === 'ask') {
            this.button(row, 'primary', step.yes || 'Sí, mostrame', function () { self.next(); });
            if (step.alt) this.button(row, 'dark', step.alt.label, step.alt.run);
            this.button(row, 'ghost', step.no || 'Ahora no', function () { self.close(true); });
        } else {
            const last = this.index === total - 1;
            if (step.href && last) {
                const a = document.createElement('a');
                a.className = 'primary';
                a.href = step.href;
                a.textContent = step.linkLabel || 'Seguir';
                if (step.beforeLeave) a.addEventListener('click', step.beforeLeave);
                row.appendChild(a);
            } else {
                this.button(row, 'primary', primary, function () { self.next(); });
                if (step.href) {
                    const a = document.createElement('a');
                    a.className = 'primary dark';
                    a.href = step.href;
                    a.textContent = step.linkLabel || 'Ir ahora';
                    if (step.beforeLeave) a.addEventListener('click', step.beforeLeave);
                    row.appendChild(a);
                }
            }
            this.button(row, 'ghost', this.index ? 'Atrás' : secondary, function () {
                if (self.index) { self.index -= 1; self.render(); }
                else self.close(true);
            });
        }
        this.positionCard(hole);
    };

    Guide.prototype.button = function (row, cls, label, run) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = cls;
        b.textContent = label;
        b.addEventListener('click', run);
        row.appendChild(b);
    };

    Guide.prototype.hole = function (rect) {
        const pad = 8;
        const left = Math.max(8, rect.left - pad);
        const top = Math.max(8, rect.top - pad);
        const right = Math.min(window.innerWidth - 8, rect.right + pad);
        const bottom = Math.min(window.innerHeight - 8, rect.bottom + pad);
        return { left: left, top: top, right: right, bottom: bottom, width: right - left, height: bottom - top };
    };

    Guide.prototype.positionCard = function (hole) {
        const card = this.root && this.root.querySelector('.card');
        if (!card) return;
        if (window.innerWidth < 720) {
            card.style.left = '12px';
            card.style.bottom = '12px';
            card.style.top = 'auto';
            return;
        }
        if (!hole) {
            card.style.left = '50%';
            card.style.top = '50%';
            card.style.transform = 'translate(-50%,-50%)';
            return;
        }
        card.style.transform = 'none';
        const cardH = card.offsetHeight || 240;
        const below = hole.bottom + 16;
        if (below + cardH < window.innerHeight - 12) {
            card.style.top = below + 'px';
        } else {
            card.style.top = Math.max(12, hole.top - cardH - 16) + 'px';
        }
        let left = hole.left;
        if (left + 440 > window.innerWidth - 12) left = window.innerWidth - 440 - 12;
        card.style.left = Math.max(12, left) + 'px';
    };

    Guide.prototype.place = function () {
        if (!this.root || this._placing) return;
        const self = this;
        this._placing = true;
        window.requestAnimationFrame(function () {
            self._placing = false;
            if (!self.root) return;
            const step = self.steps[self.index];
            if (!step || step.type === 'ask') return;
            const node = qs(step.target);
            if (!node) return;
            const hole = self.hole(node.getBoundingClientRect());
            const ring = self.root.querySelector('.ring');
            if (!ring) return;
            ring.style.left = hole.left + 'px';
            ring.style.top = hole.top + 'px';
            ring.style.width = hole.width + 'px';
            ring.style.height = hole.height + 'px';
            const shades = self.root.querySelectorAll('.shade');
            if (shades.length === 4) {
                shades[0].style.height = hole.top + 'px';
                shades[1].style.top = hole.top + 'px';
                shades[1].style.width = hole.left + 'px';
                shades[1].style.height = hole.height + 'px';
                shades[2].style.left = hole.right + 'px';
                shades[2].style.top = hole.top + 'px';
                shades[2].style.height = hole.height + 'px';
                shades[3].style.top = hole.bottom + 'px';
            }
            self.positionCard(hole);
        });
    };

    Guide.prototype.next = function () {
        this.index += 1;
        this.render();
    };

    const engine = new Guide();

    function installButton(label, run, place) {
        ensureCss();
        if (qs('#wuepy-guide-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'wuepy-guide-btn';
        btn.type = 'button';
        if (place === 'top') {
            btn.style.top = '76px';
            btn.style.bottom = 'auto';
        }
        btn.innerHTML = '<span>●</span>' + label;
        btn.addEventListener('click', function () {
            try { localStorage.removeItem(dismissedKey('landing')); localStorage.removeItem(dismissedKey('panel')); localStorage.removeItem(dismissedKey('catalogo')); } catch (e) {}
            run();
        });
        document.body.appendChild(btn);
    }

    function landingSteps() {
        const register = '/auth/register.html';
        return [
            {
                type: 'ask',
                title: '¿Querés crear tu tienda?',
                body: 'Te llevo de la mano: te muestro qué botón tocar primero y qué hace cada parte. Si lo que buscás es la electrónica de la marca, esa es la otra puerta.',
                yes: 'Sí, quiero mi tienda',
                no: 'Ahora no',
                alt: {
                    label: 'Quiero los productos Wuepy',
                    run: function () { window.location.href = window.WuepyBrand.shopUrl(); }
                }
            },
            {
                target: '[data-guide="crear-hero"]',
                title: 'Tocá este botón',
                body: 'Está iluminado. Ahí se abre el registro: nombre, correo y contraseña. Con eso ya tenés el panel de Wuepy Business.',
                href: register,
                linkLabel: 'Crear mi cuenta',
                beforeLeave: markPanel
            },
            {
                target: '#paso-cuenta',
                title: 'Primero la cuenta',
                body: 'El registro lleva un minuto. La primera tienda entra con un mes de prueba para que cargues productos y la veas publicada.'
            },
            {
                target: '#paso-diseno',
                title: 'Después el diseño',
                body: 'Elegís una plantilla o le pedís un diseño a la IA. Los colores y el texto los podés cambiar cuando quieras.'
            },
            {
                target: '#paso-vende',
                title: 'Y recién ahí, vender',
                body: 'Subís fotos, ponés precios en guaraníes y compartís el enlace. Los pedidos caen en tu WhatsApp y en la caja del panel.'
            },
            {
                target: '#planes',
                title: 'Los planes, en guaraníes',
                body: 'El básico alcanza para una tienda. Si más adelante tenés otra marca, subís de plan. No hay comisión por venta.',
                href: register,
                linkLabel: 'Empezar por el registro',
                beforeLeave: markPanel
            }
        ];
    }

    function panelSteps() {
        const steps = [
            {
                type: 'ask',
                title: '¿Seguimos con tu tienda?',
                body: 'Ya estás en el panel. Te marco, en orden, dónde se crea la tienda, dónde se carga el catálogo y dónde se abre la caja.',
                yes: 'Sí, mostrame dónde tocar',
                no: 'Ya sé usarlo'
            },
            {
                target: '[data-guide="crear-tienda"]',
                title: 'Crear la tienda',
                body: 'Este es el primer botón. Le ponés nombre y el enlace queda tipo minegocio.wuepy.com. Si ya tenés una, podés saltear y mirar el catálogo.'
            }
        ];
        if (qs('[data-guide="catalogo"]')) {
            steps.push({
                target: '[data-guide="catalogo"]',
                title: 'El catálogo',
                body: 'Acá se cargan los productos. En el celular cada uno es una ficha grande: foto, precio, stock y botones anchos para editar o borrar.',
                href: (qs('[data-guide="catalogo"]') || {}).getAttribute ? qs('[data-guide="catalogo"]').getAttribute('href') : '',
                linkLabel: 'Abrir el catálogo'
            });
            const cat = steps[steps.length - 1];
            const href = cat.href || '';
            cat.href = href + (href.indexOf('?') === -1 ? '?' : '&') + 'guia=catalogo';
        }
        if (qs('[data-guide="caja"]')) {
            steps.push({
                target: '[data-guide="caja"]',
                title: 'La caja',
                body: 'Desde acá cobrás en el local. La venta descuenta el stock del mismo catálogo que ve el cliente en la web.'
            });
        }
        if (qs('[data-guide="panel"]')) {
            steps.push({
                target: '[data-guide="panel"]',
                title: 'El panel de esa tienda',
                body: 'Adentro están los ajustes, el diseño, los envíos y la suscripción. Cuando termines, tu cliente entra por el enlace azul de arriba.'
            });
        }
        return steps;
    }

    function catalogSteps() {
        return [
            {
                type: 'ask',
                title: 'Este es tu catálogo',
                body: 'En el teléfono no es una tabla chiquita. Cada producto ocupa su ficha, con la foto grande y botones que se pueden tocar con el pulgar.',
                yes: 'Mostrame cómo agregar',
                no: 'Entendido'
            },
            {
                target: '[data-guide="agregar"]',
                title: 'Agregar producto',
                body: 'Tocá acá. Pedimos nombre, precio en guaraníes, stock y una foto. Cuando guardás, aparece en la tienda.'
            },
            {
                target: '[data-guide="fichas"]',
                title: 'Las fichas',
                body: 'Si ya hay productos, cada ficha muestra precio y stock. Editar y Eliminar están abajo, a lo ancho. En la compu sigue la tabla de siempre.'
            }
        ];
    }

    window.WuepyGuide = {
        startLanding: function (force) {
            if (!force && !wants('landing')) {
                installButton('Ver guía', function () { window.WuepyGuide.startLanding(true); });
                return;
            }
            installButton('Ver guía', function () { window.WuepyGuide.startLanding(true); });
            engine.onDone = null;
            engine.open(landingSteps(), 'landing');
        },
        startPanel: function (force) {
            const pending = (function () { try { return localStorage.getItem(STATE) === 'panel'; } catch (e) { return false; } })();
            if (!force && !pending && !wants('panel')) {
                installButton('Ver guía', function () { window.WuepyGuide.startPanel(true); });
                return;
            }
            if (!force && !pending && new URLSearchParams(window.location.search).get('guia') !== '1' && localStorage.getItem(dismissedKey('panel')) === '1') {
                installButton('Ver guía', function () { window.WuepyGuide.startPanel(true); });
                return;
            }
            installButton('Ver guía', function () { window.WuepyGuide.startPanel(true); });
            window.setTimeout(function () {
                engine.open(panelSteps(), 'panel');
            }, 350);
        },
        startCatalog: function (force) {
            const guia = new URLSearchParams(window.location.search).get('guia');
            if (!force && guia !== 'catalogo' && guia !== '1') {
                installButton('Ver guía', function () { window.WuepyGuide.startCatalog(true); }, 'top');
                return;
            }
            installButton('Ver guía', function () { window.WuepyGuide.startCatalog(true); }, 'top');
            engine.open(catalogSteps(), 'catalogo');
        }
    };
})();
