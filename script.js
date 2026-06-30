/* ─────────────────────────────────────────────
   FVI STUDIO — script.js
   ───────────────────────────────────────────── */

(function () {
  'use strict';

  // ── NAV SCROLL BEHAVIOUR ──
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (currentScrollY > 120) {
      if (currentScrollY > lastScrollY + 4) {
        navbar.classList.add('hidden');
      } else if (currentScrollY < lastScrollY - 4) {
        navbar.classList.remove('hidden');
      }
    } else {
      navbar.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });


  // ── MOBILE MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });


  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll(
    '.about-grid, .section-header, .project-card, .contact-grid'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.closest('.projects-grid')) {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));


  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  // ── CONTACT FORM ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.classList.add('visible');
            setTimeout(() => formSuccess.classList.remove('visible'), 6000);
          }
        } else {
          const json = await response.json();
          const msg = json.errors
            ? json.errors.map(e => e.message).join(', ')
            : 'Something went wrong. Please try again.';
          alert(msg);
        }
      } catch {
        alert('Network error — please check your connection and try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }


  // ── PROJECT CARD HOVER PARALLAX ──
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.12s ease';
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
      card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease';
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

})();