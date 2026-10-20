// Marca Wuepy: la tienda de electrónica vive en shop, la plataforma en business.
(function () {
    function host() {
        return (window.location.hostname || '').toLowerCase();
    }

    function isLocalPreview() {
        const h = host();
        return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.pages.dev');
    }

    function kind() {
        const h = host();
        const vista = new URLSearchParams(window.location.search).get('vista');
        if (h === 'shop.wuepy.com') return 'shop';
        if (h === 'business.wuepy.com') return 'business';
        const apex = h === 'wuepy.com' || h === 'www.wuepy.com' || isLocalPreview();
        if (apex && (vista === 'shop' || vista === 'business' || vista === 'home')) return vista;
        if (apex) return 'home';
        return 'store';
    }

    function withQuery(url, key, value) {
        const join = url.indexOf('?') === -1 ? '?' : '&';
        return url + join + key + '=' + encodeURIComponent(value);
    }

    function shopUrl() {
        const h = host();
        if (h === 'wuepy.com' || h === 'www.wuepy.com') return 'https://shop.wuepy.com';
        return '/shop/';
    }

    function businessUrl() {
        const h = host();
        if (h === 'business.wuepy.com') return '/';
        if (h === 'wuepy.com' || h === 'www.wuepy.com') return 'https://business.wuepy.com';
        return '/?vista=business';
    }

    function homeUrl() {
        const h = host();
        if (h === 'wuepy.com' || h === 'www.wuepy.com') return '/';
        if (isLocalPreview()) return '/?vista=home';
        return 'https://wuepy.com';
    }

    function businessGuideUrl() {
        return withQuery(businessUrl(), 'guia', '1');
    }

    window.WuepyBrand = {
        kind: kind,
        shopUrl: shopUrl,
        businessUrl: businessUrl,
        homeUrl: homeUrl,
        businessGuideUrl: businessGuideUrl,
        isLocalPreview: isLocalPreview
    };
})();
