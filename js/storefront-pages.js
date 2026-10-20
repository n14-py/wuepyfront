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

    function cachedStore(subdomain) {
        return window.WuepyPublicCache ? WuepyPublicCache.read(subdomain) : null;
    }

    function rememberStore(subdomain, data) {
        if (window.WuepyPublicCache && data && data.success) WuepyPublicCache.write(subdomain, data);
    }

    function tuneImages() {
        const images = document.querySelectorAll('img');
        images.forEach(function (img, index) {
            img.decoding = 'async';
            if (index === 0) {
                img.setAttribute('fetchpriority', 'high');
                return;
            }
            if (!img.getAttribute('loading')) img.loading = 'lazy';
        });
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
                    const cached = cachedStore(subdomain);
                    if (cached) {
                        this.site = cached.site;
                        this.products = cached.products || [];
                        paint(this.site);
                    }
                    const age = window.WuepyPublicCache ? WuepyPublicCache.age(cached) : Infinity;
                    if (age < 20000) {
                        this.$nextTick(tuneImages);
                        return;
                    }
                    try {
                        const res = await fetch(apiBase() + '/store/public/' + subdomain);
                        const data = await res.json();
                        if (data.success) {
                            this.site = data.site;
                            this.products = data.products || [];
                            paint(this.site);
                            rememberStore(subdomain, data);
                        }
                    } catch (error) {
                        console.error('Error al cargar la tienda:', error);
                    }
                    this.$nextTick(tuneImages);
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
                    const cached = cachedStore(subdomain);
                    const apply = (data) => {
                        this.site = data.site;
                        this.allProducts = data.products || [];
                        const cats = new Set(this.allProducts.map(function (p) { return p.category; }).filter(Boolean));
                        this.categories = Array.from(cats).sort();
                        this.filterProducts();
                        paint(this.site);
                    };
                    if (cached && cached.site) {
                        apply(cached);
                        this.isLoading = false;
                    }
                    const age = window.WuepyPublicCache ? WuepyPublicCache.age(cached) : Infinity;
                    if (!(cached && cached.site && age < 20000)) {
                        try {
                            const res = await fetch(apiBase() + '/store/public/' + subdomain);
                            const data = await res.json();
                            if (data.success) {
                                apply(data);
                                rememberStore(subdomain, data);
                            }
                        } catch (error) {
                            console.error('Error al cargar la tienda:', error);
                        }
                    }
                    this.isLoading = false;
                    this.$nextTick(tuneImages);
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
                    const paintProduct = (site, product, allProducts) => {
                        this.site = site;
                        this.product = product;
                        const pool = allProducts || [];
                        this.relatedProducts = pool.filter(function (p) {
                            return p.category === product.category && p._id !== productId;
                        }).slice(0, 4);
                        if (!this.relatedProducts.length) {
                            this.relatedProducts = pool.filter(function (p) { return p._id !== productId; }).slice(0, 4);
                        }
                        paint(this.site);
                        document.title = product.name + ' | ' + (site.name || 'Tienda');
                    };
                    const cached = cachedStore(subdomain);
                    const cachedProduct = cached && (cached.products || []).find(function (p) { return p._id === productId; });
                    if (cached && cachedProduct) {
                        paintProduct(cached.site, cachedProduct, cached.products || []);
                        this.isLoading = false;
                        const age = WuepyPublicCache.age(cached);
                        if (age < 20000) {
                            this.$nextTick(tuneImages);
                            return;
                        }
                    }
                    try {
                        let data = null;
                        const detail = await fetch(apiBase() + '/store/public/' + subdomain + '/p/' + encodeURIComponent(productId));
                        if (detail.ok) {
                            const parsed = await detail.json();
                            if (parsed && parsed.success && parsed.product) data = parsed;
                        }
                        if (!data) {
                            const res = await fetch(apiBase() + '/store/public/' + subdomain);
                            const parsed = await res.json();
                            if (parsed && parsed.success) data = parsed;
                        }
                        if (!data) {
                            if (!this.product) window.location.href = 'index.html';
                            return;
                        }
                        const allProducts = data.products || [];
                        const product = data.product || allProducts.find(function (p) { return p._id === productId; }) || null;
                        if (!product) {
                            if (!this.product) window.location.href = 'index.html';
                            return;
                        }
                        paintProduct(data.site, product, allProducts.length ? allProducts : [product]);
                        if (allProducts.length) rememberStore(subdomain, data);
                    } catch (error) {
                        console.error('Error al cargar producto:', error);
                        if (!this.product) window.location.href = 'index.html';
                    }
                    this.isLoading = false;
                    this.$nextTick(tuneImages);
                }
            });
        });
    });
})();
