/* ═══════════════════════════════════════════════════════════
   LA ORDEN DEL UMBRAL — SCRIPT.JS
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── HEADER: Scroll State ───────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const threshold = 60;

  function updateHeader() {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run on load
})();


/* ─── NAV: Mobile Toggle ─────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    if (spans[1]) spans[1].style.opacity   = '0';
    if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    const spans = toggle.querySelectorAll('span');
    if (spans[0]) spans[0].style.transform = '';
    if (spans[1]) spans[1].style.opacity   = '';
    if (spans[2]) spans[2].style.transform = '';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
})();


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Use IntersectionObserver for performance
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ─── SMOOTH SCROLL (Fallback for older browsers) ─────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('site-header')?.offsetHeight || 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ─── CONTACT FORM: Validation & Submission ──────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn  = document.getElementById('submit-btn');
  if (!form) return;

  /* ── Validators ── */
  const validators = {
    nombre:  value => value.trim().length >= 2
      ? null
      : 'El nombre debe tener al menos 2 caracteres.',

    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? null
      : 'La paloma mensajera necesita un destino válido (ej: tu@correo.reino).',

    mensaje: value => value.trim().length >= 20
      ? null
      : 'El pergamino debe tener al menos 20 caracteres.'
  };

  /* ── Show / Clear error ── */
  function setError(field, message) {
    field.classList.toggle('invalid', !!message);
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateField(field) {
    const name      = field.name;
    const validator = validators[name];
    if (!validator) return true; // no rule = valid

    const error = validator(field.value);
    setError(field, error);
    return !error;
  }

  /* ── Live validation on blur ── */
  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields  = form.querySelectorAll('.form-input, .form-textarea');
    let   allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Simulate async submission */
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-inner').textContent;
    submitBtn.querySelector('.btn-inner').textContent = 'Sellando…';

    setTimeout(() => {
      // Hide form, show success
      form.style.opacity = '0';
      form.style.transition = 'opacity 0.4s ease';

      setTimeout(() => {
        form.hidden = true;
        successMsg.hidden = false;
        successMsg.style.animation = 'fadeIn 0.6s ease both';

        // Scroll success into view
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }, 1200);
  });
})();


/* ─── ACTIVE NAV LINK: Highlight on scroll ───────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const headerH = () => (document.getElementById('site-header')?.offsetHeight || 70) + 20;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: `-${headerH()}px 0px -60% 0px`,
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
})();


/* ─── SKILL CARDS: Parallax tilt on hover ────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;   // degrees
      const rotY   = ((x - cx) / cx) *  4;

      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transformOrigin = 'center center';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─── RUNE CYCLING: Animate emblema runes ────────────────── */
(function initRuneAnimation() {
  const runes    = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ'];
  const spans    = document.querySelectorAll('.emblema-runes span');
  if (!spans.length) return;

  let runeIndex = 0;

  setInterval(() => {
    const span = spans[runeIndex % spans.length];
    const randomRune = runes[Math.floor(Math.random() * runes.length)];
    span.textContent = randomRune;
    runeIndex++;
  }, 800);
})();


/* ─── HERO: Subtle particle drift (CSS-only fallback is fine,
          this adds just a few drifting motes via canvas) ── */
(function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas  = document.createElement('canvas');
  const ctx     = canvas.getContext('2d');
  if (!ctx) return;

  canvas.style.cssText = `
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 1; opacity: 0.45;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  let W, H, particles;
  const COUNT = 28;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.5,
      dx:   (Math.random() - 0.5) * 0.3,
      dy:   -Math.random() * 0.4 - 0.1,
      life: Math.random(),
      gold: Math.random() > 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life += 0.003;

      if (p.y < -10 || p.life > 1) {
        p.x    = Math.random() * W;
        p.y    = H + 10;
        p.life = 0;
      }

      const alpha = Math.sin(p.life * Math.PI) * 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(200, 168, 75, ${alpha})`
        : `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
})();
