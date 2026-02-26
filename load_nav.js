/**
 * load_nav.js - Shared Navigation, Footer, and Live Stats Loader
 * ================================================================
 *
 * Loads nav_template.html at top, footer_template.html at bottom.
 * Sets active page based on current filename.
 * Loads live-stats.js for dynamic numbers.
 * Loads nav-toggle.js for dropdown/hamburger behavior.
 *
 * ONE nav. ONE footer. ONE menu. Every page. Consistent.
 *
 * Copyright (c) 2026 Tammy L Casey. All rights reserved.
 */
(function() {
    'use strict';

    // Calculate base path to site root (handles subdirectory pages)
    var pathParts = window.location.pathname.split('/').filter(Boolean);
    var basePath = '';
    if (pathParts.length > 1) {
        // Subdirectory: database/search.html -> '../', evidence/research/index.html -> '../../'
        for (var i = 0; i < pathParts.length - 1; i++) basePath += '../';
    }
    // Expose globally so other scripts (site_stats_loader.js etc.) can use it
    window.__ozarkBasePath = basePath;

    // Detect current page for active state
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var pageName = filename.replace('.html', '');

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

    // Fullscreen pages (maps, 3D visualizations) get nav in OVERLAY mode
    // Nav floats over content with transparent background
    var isFullscreen = document.body.hasAttribute('data-fullscreen');

    // Don't double-load if nav already exists (page has inline nav)
    if (document.getElementById('morgan-nav')) {
        markActive(document.getElementById('morgan-nav'));
        markActive(document.getElementById('morgan-mobile-panel'));
        markActive(document.getElementById('morgan-footer'));
        loadScript(basePath + 'nav-toggle.js');
        loadScript(basePath + 'live-stats.js');
        return;
    }

    // Load nav template (basePath ensures subdirectory pages find it)
    fetch(basePath + 'nav_template.html')
        .then(function(r) {
            if (!r.ok) throw new Error('Nav not found');
            return r.text();
        })
        .then(function(html) {
            // Fix relative links in nav when loaded from subdirectory
            if (basePath) {
                html = html.replace(/href="(?!https?:\/\/|#|mailto:)([^"]*\.html)/g,
                    'href="' + basePath + '$1');
            }
            document.body.insertAdjacentHTML('afterbegin', html);
            var nav = document.getElementById('morgan-nav');
            // Fullscreen pages get overlay nav (floats over content)
            if (isFullscreen && nav) {
                nav.classList.add('nav-overlay');
            }
            markActive(nav);
            markActive(document.getElementById('morgan-mobile-panel'));

            // Load nav-toggle.js after nav is in DOM
            loadScript(basePath + 'nav-toggle.js');
        })
        .catch(function() {
            // Nav template unavailable - page works without it
        });

    // Load footer template
    if (!document.getElementById('morgan-footer')) {
        fetch(basePath + 'footer_template.html')
            .then(function(r) {
                if (!r.ok) throw new Error('Footer not found');
                return r.text();
            })
            .then(function(html) {
                // Fix relative links in footer when loaded from subdirectory
                if (basePath) {
                    html = html.replace(/href="(?!https?:\/\/|#|mailto:)([^"]*\.html)/g,
                        'href="' + basePath + '$1');
                }
                document.body.insertAdjacentHTML('beforeend', html);
                markActive(document.getElementById('morgan-footer'));
            })
            .catch(function() {
                // Footer template unavailable - page works without it
            });
    }

    // Load live stats
    loadScript(basePath + 'live-stats.js');
})();
