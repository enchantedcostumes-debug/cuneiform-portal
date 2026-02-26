/**
 * nav-toggle.js - Minimal interactivity for navigation.
 * Handles: ALL nav dropdowns (LANGUAGES, INVESTIGATE), hamburger menu, close-on-click-away.
 * Uses event delegation for maximum robustness.
 *
 * Copyright (c) 2026 Tammy L Casey. All rights reserved.
 */
(function() {
    'use strict';

    // Guard against double-initialization
    if (window.__navToggleInit) return;
    window.__navToggleInit = true;

    // Inject close button into mobile panel if not already present
    var panelEl = document.getElementById('morgan-mobile-panel');
    if (panelEl && !panelEl.querySelector('.mmp-close-btn')) {
        var closeBtn = document.createElement('button');
        closeBtn.className = 'mmp-close-btn';
        closeBtn.setAttribute('aria-label', 'Close navigation menu');
        closeBtn.innerHTML = '\u2715';
        panelEl.insertBefore(closeBtn, panelEl.firstChild);
    }

    function closePanel() {
        var panel = document.getElementById('morgan-mobile-panel');
        var hamburger = document.getElementById('mn-hamburger-btn');
        if (panel) panel.setAttribute('hidden', '');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            var span = hamburger.querySelector('span');
            if (span) span.textContent = '\u2630';
        }
    }

    function openPanel() {
        var panel = document.getElementById('morgan-mobile-panel');
        var hamburger = document.getElementById('mn-hamburger-btn');
        if (panel) panel.removeAttribute('hidden');
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close navigation menu');
            var span = hamburger.querySelector('span');
            if (span) span.textContent = '\u2715';
        }
    }

    function closeAllDropdowns() {
        var dropdowns = document.querySelectorAll('#morgan-nav .mn-dropdown');
        var btns = document.querySelectorAll('#morgan-nav .mn-more-btn');
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('open');
        }
        for (var j = 0; j < btns.length; j++) {
            btns[j].setAttribute('aria-expanded', 'false');
        }
    }

    document.addEventListener('click', function(e) {
        var target = e.target;

        function isInside(id) {
            var el = document.getElementById(id);
            return el && (el === target || el.contains(target));
        }

        // Hamburger button
        if (isInside('mn-hamburger-btn')) {
            var panel = document.getElementById('morgan-mobile-panel');
            if (panel && panel.hasAttribute('hidden')) {
                openPanel();
            } else {
                closePanel();
            }
            e.stopPropagation();
            return;
        }

        // Mobile panel close button
        if (target.closest && target.closest('.mmp-close-btn')) {
            closePanel();
            var hamburger = document.getElementById('mn-hamburger-btn');
            if (hamburger) hamburger.focus();
            e.stopPropagation();
            return;
        }

        // Any nav dropdown toggle button
        var toggleBtn = target.closest ? target.closest('#morgan-nav .mn-more-btn') : null;
        if (toggleBtn) {
            var parent = toggleBtn.parentElement;
            var dropdown = parent ? parent.querySelector('.mn-dropdown') : null;
            if (dropdown) {
                var wasOpen = dropdown.classList.contains('open');
                closeAllDropdowns();
                if (!wasOpen) {
                    dropdown.classList.add('open');
                    toggleBtn.setAttribute('aria-expanded', 'true');
                }
            }
            e.stopPropagation();
            return;
        }

        // Accordion toggle: desktop dropdown section headers
        var ddLabel = target.closest ? target.closest('.mn-dd-label[data-toggle]') : null;
        if (ddLabel) {
            var section = ddLabel.nextElementSibling;
            if (section && section.classList.contains('mn-dd-section')) {
                var wasSectionOpen = !section.hasAttribute('hidden');
                var allSections = document.querySelectorAll('.mn-dd-section');
                var allLabels = document.querySelectorAll('.mn-dd-label[data-toggle]');
                for (var i = 0; i < allSections.length; i++) {
                    allSections[i].setAttribute('hidden', '');
                }
                for (var j = 0; j < allLabels.length; j++) {
                    allLabels[j].classList.remove('open');
                }
                if (!wasSectionOpen) {
                    section.removeAttribute('hidden');
                    ddLabel.classList.add('open');
                }
            }
            e.stopPropagation();
            return;
        }

        // Accordion toggle: mobile panel section headers
        var mmpLabel = target.closest ? target.closest('.mmp-section[data-toggle]') : null;
        if (mmpLabel) {
            var mmpSection = mmpLabel.nextElementSibling;
            if (mmpSection && mmpSection.classList.contains('mmp-section-links')) {
                var mmpWasOpen = !mmpSection.hasAttribute('hidden');
                var allMmpSections = document.querySelectorAll('.mmp-section-links');
                var allMmpLabels = document.querySelectorAll('.mmp-section[data-toggle]');
                for (var m = 0; m < allMmpSections.length; m++) {
                    allMmpSections[m].setAttribute('hidden', '');
                }
                for (var n = 0; n < allMmpLabels.length; n++) {
                    allMmpLabels[n].classList.remove('open');
                }
                if (!mmpWasOpen) {
                    mmpSection.removeAttribute('hidden');
                    mmpLabel.classList.add('open');
                }
            }
            e.stopPropagation();
            return;
        }

        // Click inside mobile panel - don't close
        if (isInside('morgan-mobile-panel')) {
            return;
        }

        // Click inside any nav dropdown - don't close
        if (target.closest && target.closest('#morgan-nav .mn-dropdown')) {
            return;
        }

        // Click anywhere else - close everything
        closeAllDropdowns();
        closePanel();
    });

    // Keyboard: close on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var panel = document.getElementById('morgan-mobile-panel');
            if (panel && !panel.hasAttribute('hidden')) {
                closePanel();
                var hamburger = document.getElementById('mn-hamburger-btn');
                if (hamburger) hamburger.focus();
                return;
            }
            var openDropdowns = document.querySelectorAll('#morgan-nav .mn-dropdown.open');
            if (openDropdowns.length) {
                closeAllDropdowns();
            }
        }
    });
})();
