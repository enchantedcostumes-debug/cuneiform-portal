/**
 * load_nav.js - Shared Navigation & Footer Loader for Language Portals
 * ====================================================================
 * Loads nav_template.html at top, footer_template.html at bottom.
 * Detects active portal by subdomain and highlights it in the nav.
 * Loads nav-toggle.js for dropdown/hamburger behavior.
 *
 * ONE nav. ONE footer. ONE menu. Every portal. Consistent.
 *
 * Copyright (c) 2026 Tammy L Casey. All rights reserved.
 */
(function() {
    'use strict';

    // Detect current portal from subdomain for active highlighting
    var hostname = window.location.hostname;
    var parts = hostname.split('.');
    var subdomain = parts.length > 2 ? parts[0] : '';
    // Map subdomain to data-page value
    var pageName = subdomain || 'home';

    function markActive(container) {
        if (!container) return;
        var links = container.querySelectorAll('[data-page]');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        }
    }

    function loadScript(src) {
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.body.appendChild(s);
    }

    // Don't double-load if nav already exists (page has inline nav)
    if (document.getElementById('morgan-nav')) {
        markActive(document.getElementById('morgan-nav'));
        markActive(document.getElementById('morgan-mobile-panel'));
        markActive(document.getElementById('morgan-footer'));
        loadScript('nav-toggle.js');
        return;
    }

    // Load nav template
    fetch('nav_template.html')
        .then(function(r) {
            if (!r.ok) throw new Error('Nav not found');
            return r.text();
        })
        .then(function(html) {
            document.body.insertAdjacentHTML('afterbegin', html);
            markActive(document.getElementById('morgan-nav'));
            markActive(document.getElementById('morgan-mobile-panel'));
            // Load nav-toggle.js after nav is in DOM
            loadScript('nav-toggle.js');
        })
        .catch(function() {
            // Nav template unavailable - page works without it
        });

    // Load footer template
    if (!document.getElementById('morgan-footer')) {
        fetch('footer_template.html')
            .then(function(r) {
                if (!r.ok) throw new Error('Footer not found');
                return r.text();
            })
            .then(function(html) {
                document.body.insertAdjacentHTML('beforeend', html);
            })
            .catch(function() {
                // Footer template unavailable - page works without it
            });
    }
})();
