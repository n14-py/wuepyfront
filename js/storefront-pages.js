// Datos de las tiendas plantilla. Misma carga que Moderna: catálogo, ficha y búsqueda.
(function () {
    function subdomainFromLocation() {
        const qStore = new URLSearchParams(window.location.search).get('store');
        const hostname = window.location.hostname;
        let subdomain = qStore || hostname.split('.')[0];
        if (!qStore && (!subdomain || subdomain === 'undefined' || subdomain === 'wuepy' || subdomain === 'www' || hostname === 'localhost' || hostname === '127.0.0.1')) {
            subdomain = 'demo';
        }
        return subdomain;
    }

    function apiBase() {
        return window.API_URL || 'https://wuepyback.onrender.com/api';
    }

    function paint(site) {
        if (!site) return;
        const root = document.documentElement.style;
        if (site.primaryColor) {
            ['--brand-color', '--primary-color', '--primary', '--wuepy-primary', '--neon', '--glam-primary'].forEach(function (name) {
                root.setProperty(name, site.primaryColor);
            });
        }
        if (site.secondaryColor) {
            ['--dark-color', '--secondary-color', '--secondary', '--wuepy-secondary', '--dark-bg', '--glam-secondary'].forEach(function (name) {
                root.setProperty(name, site.secondaryColor);
            });
        }
        if (site.name) document.title = site.name + ' | Tienda';
    }

    function money(site, amount) {
        const n = parseInt(amount, 10);
        const value = isNaN(n) ? '0' : n.toLocaleString('es-PY');
        return (site && site.currency === 'USD' ? '$ ' : 'Gs. ') + value;
    }

    function phoneOf(site) {
        if (!site) return '';
        return String(site.whatsappNumber || (site.contact && (site.contact.whatsapp || site.contact.phone)) || '').replace(/[^0-9]/g, '');
    }

    const shared = {
        mobileMenu: false,
        searchOpen: false,
        formatMoney(amount) {
            return money(this.site, amount);
        },
        waLink(item) {
            const phone = phoneOf(this.site);
            const product = item && item.name ? item : this.product;
            const text = product && product.name
                ? 'Hola! Me interesa *' + product.name + '* (' + this.formatMoney(product.price) + '). ¿Está disponible?'
                : 'Hola! Quiero información de ' + ((this.site && this.site.name) || 'la tienda') + '.';
            return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
        },
        photo(url) {
            return url && String(url).indexOf('placehold') === -1 ? url : '';
        }
    };

    function mix(extra) {
        return Object.assign({}, shared, extra);
    }

    document.addEventListener('alpine:init', function () {
        Alpine.data('storefrontApp', function () {
            return mix({
                site: null,
                products: [],
                async init() {
                    const subdomain = subdomainFromLocation();
                    const cacheKey = 'wuepy_cache_' + subdomain;
                    try {
                        const cached = localStorage.getItem(cacheKey);
                        if (cached) {
                            const parsed = JSON.parse(cached);
                            this.site = parsed.site;
                            this.products = parsed.products || [];
                            paint(this.site);
                        }
                    } catch (e) {}
                    try {
                        const res = await fetch(apiBase() + '/store/public/' + subdomain + '?_t=' + Date.now());
                        const data = await res.json();
                        if (data.success) {
                            this.site = data.site;
                            this.products = data.products || [];
                            paint(this.site);
                            localStorage.setItem(cacheKey, JSON.stringify(data));
                        }
                    } catch (error) {
                        console.error('Error al cargar la tienda:', error);
                    }
                }
            });
        });

        Alpine.data('searchPage', function () {
            return mix({
                site: null,
                allProducts: [],
                filteredProducts: [],
                categories: [],
                isLoading: true,
                searchQuery: '',
                currentCategory: '',
                async init() {
                    const urlParams = new URLSearchParams(window.location.search);
                    this.searchQuery = urlParams.get('q') || '';
                    this.currentCategory = urlParams.get('category') || '';
                    const subdomain = subdomainFromLocation();
                    try {
                        const res = await fetch(apiBase() + '/store/public/' + subdomain + '?_t=' + Date.now());
                        const data = await res.json();
                        if (data.success) {
                            this.site = data.site;
                            this.allProducts = data.products || [];
                            const cats = new Set(this.allProducts.map(function (p) { return p.category; }).filter(Boolean));
                            this.categories = Array.from(cats).sort();
                            this.filterProducts();
                            paint(this.site);
                        }
                    } catch (error) {
                        console.error('Error al cargar la tienda:', error);
                    }
                    this.isLoading = false;
                },
                filterProducts() {
                    let result = this.allProducts;
                    if (this.currentCategory) result = result.filter(function (p) { return p.category === this.currentCategory; }, this);
                    const q = this.searchQuery.trim().toLowerCase();
                    if (q) {
                        result = result.filter(function (p) {
                            return (p.name || '').toLowerCase().indexOf(q) !== -1 || ((p.description || '').toLowerCase().indexOf(q) !== -1);
                        });
                    }
                    this.filteredProducts = result;
                }
            });
        });

        Alpine.data('productPage', function () {
            return mix({
                site: null,
                product: null,
                relatedProducts: [],
                isLoading: true,
                async init() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const productId = urlParams.get('id');
                    if (!productId) {
                        window.location.href = 'index.html';
                        return;
                    }
                    const subdomain = subdomainFromLocation();
                    try {
                        const res = await fetch(apiBase() + '/store/public/' + subdomain + '?_t=' + Date.now());
                        const data = await res.json();
                        if (!data.success) {
                            window.location.href = 'index.html';
                            return;
                        }
                        this.site = data.site;
                        const allProducts = data.products || [];
                        this.product = allProducts.find(function (p) { return p._id === productId; }) || null;
                        if (!this.product) {
                            window.location.href = 'index.html';
                            return;
                        }
                        this.relatedProducts = allProducts.filter(function (p) {
                            return p.category === this.product.category && p._id !== productId;
                        }, this).slice(0, 4);
                        if (!this.relatedProducts.length) {
                            this.relatedProducts = allProducts.filter(function (p) { return p._id !== productId; }).slice(0, 4);
                        }
                        paint(this.site);
                        document.title = this.product.name + ' | ' + (this.site.name || 'Tienda');
                    } catch (error) {
                        console.error('Error al cargar producto:', error);
                        window.location.href = 'index.html';
                    }
                    this.isLoading = false;
                }
            });
        });
    });
})();
