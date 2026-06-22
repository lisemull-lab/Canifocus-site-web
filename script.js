/* ============================================================
   CANI'FOCUS — Script
   ============================================================ */

'use strict';

// ===== Navigation (SPA) =====

function navigate(tab) {
  // Persist tab across reloads
  try { localStorage.setItem('cf-tab', tab); } catch (e) {}

  // Show the active page, hide the others
  document.querySelectorAll('.page').forEach(function (page) {
    page.hidden = page.dataset.page !== tab;
  });

  // Update nav active indicators
  document.querySelectorAll('[data-nav]').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.nav === tab);
  });

  // Close mobile menu
  closeMobileMenu();

  // Scroll to top instantly
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Trigger reveal on newly visible elements
  requestAnimationFrame(function () {
    initReveal();
  });
}

// ===== Mobile Menu =====

var burgerBtn  = document.getElementById('burger-btn');
var burgerIcon = document.getElementById('burger-icon');
var mobileNav  = document.getElementById('mobile-nav');

function closeMobileMenu() {
  mobileNav.classList.remove('is-open');
  burgerBtn.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  burgerIcon.textContent = 'menu';
}

function openMobileMenu() {
  mobileNav.classList.add('is-open');
  burgerBtn.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');
  burgerIcon.textContent = 'close';
}

burgerBtn.addEventListener('click', function () {
  var isOpen = mobileNav.classList.contains('is-open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

// ===== Scroll Reveal (IntersectionObserver) =====

var revealObserver = null;

function initReveal() {
  var els = document.querySelectorAll('.reveal:not(.revealed)');
  if (els.length === 0) return;

  if ('IntersectionObserver' in window) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    }
    els.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback for old browsers: reveal immediately
    els.forEach(function (el) { el.classList.add('revealed'); });
  }
}

// ===== Event Delegation (single listener for all [data-nav] clicks) =====

document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-nav]');
  if (btn) navigate(btn.dataset.nav);
});

// ===== Header height CSS variable =====

function updateHeaderHeight() {
  var header = document.getElementById('site-header');
  if (header) {
    document.documentElement.style.setProperty(
      '--header-h',
      header.offsetHeight + 'px'
    );
  }
}

window.addEventListener('resize', updateHeaderHeight, { passive: true });

// ===== Init =====

document.addEventListener('DOMContentLoaded', function () {
  updateHeaderHeight();

  // Restore last visited tab, or default to accueil
  var tab = 'accueil';
  try {
    var saved = localStorage.getItem('cf-tab');
    if (saved && ['accueil', 'apropos', 'services', 'contact'].indexOf(saved) !== -1) {
      tab = saved;
    }
  } catch (e) {}

  navigate(tab);
});
