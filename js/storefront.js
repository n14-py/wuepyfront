document.addEventListener('alpine:init', () => {
    Alpine.data('shop', () => ({
        site: null,
        products: [],
        product: null,
        query: '',
        cat: '',
        open: false,
        async init() {
            const host = window.location.hostname.split('.')[0];
            const params = new URLSearchParams(window.location.search);
            const subdomain = (host && host !== 'localhost' && host !== 'www' && host !== 'wuepy') ? host : (params.get('store') || 'demo');
            const id = params.get('id');
            const q = params.get('q') || '';
            this.query = q;
            const base = (window.API_URL || 'https://wuepyback.onrender.com/api') + '/store/public/' + subdomain;
            const url = id ? base + '/p/' + id : (q ? base + '/search?q=' + encodeURIComponent(q) : base);
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (!data.success) return;
                this.site = data.site;
                this.products = data.products || [];
                this.product = data.product || null;
                if (this.site && this.site.primaryColor) {
                    document.documentElement.style.setProperty('--brand', this.site.primaryColor);
                }
                document.title = (this.product && this.product.name) || (this.site && this.site.name) || 'Tienda';
            } catch (e) {}
        },
        money(n) {
            const cur = this.site && this.site.currency === 'USD' ? '$ ' : 'Gs. ';
            return cur + (Number(n) || 0).toLocaleString('es-PY');
        },
        img(p) {
            return (p && (p.imageUrl || (p.images && p.images[0]))) || '';
        },
        wa(text) {
            const phone = (this.site && this.site.contact && (this.site.contact.whatsapp || this.site.contact.phone)) || '';
            return 'https://wa.me/' + String(phone).replace(/\D/g, '') + '?text=' + encodeURIComponent(text || ('Hola, vi ' + (this.site && this.site.name)));
        },
        letter() {
            return ((this.site && this.site.name) || 'W').charAt(0).toUpperCase();
        },
        title() {
            return (this.site && this.site.content && this.site.content.heroTitle) || (this.site && this.site.name) || '';
        },
        about() {
            return (this.site && this.site.content && (this.site.content.aboutText || this.site.content.heroSubtitle)) || 'Elegí, consultá stock y coordiná el pedido por WhatsApp.';
        },
        address() {
            return (this.site && this.site.contact && this.site.contact.address) || '';
        },
        categories() {
            return [...new Set((this.products || []).map(p => p.category).filter(Boolean))];
        },
        shown() {
            return (this.products || []).filter(p => {
                const byCat = !this.cat || p.category === this.cat;
                const q = (this.query || '').toLowerCase();
                const byQ = !q || (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
                return byCat && byQ;
            });
        }
    }));
});
