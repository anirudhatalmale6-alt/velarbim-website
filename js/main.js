// ============================================
// VelarBIM — Main Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation scroll effect ---
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile menu toggle ---
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Reveal on scroll ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal') && !el.classList.contains('visible'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.max(0, idx) * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stats counter animation ---
  const statNumbers = document.querySelectorAll('.stats__number[data-target]');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const counter = () => {
          current += step;
          if (current >= target) {
            el.textContent = target;
          } else {
            el.textContent = Math.floor(current);
            requestAnimationFrame(counter);
          }
        };
        requestAnimationFrame(counter);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  // --- Service accordion ---
  window.toggleService = (id) => {
    const service = document.getElementById(`service-${id}`);
    const wasOpen = service.classList.contains('open');

    document.querySelectorAll('.service.open').forEach(s => s.classList.remove('open'));

    if (!wasOpen) service.classList.add('open');
  };

  // Open first service by default
  const firstService = document.getElementById('service-1');
  if (firstService) firstService.classList.add('open');

  // --- Project filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const projectType = document.getElementById('projectType').value;
      const message = document.getElementById('message').value;

      const subject = encodeURIComponent(`Project Enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:info@velarbim.com?subject=${subject}&body=${body}`;

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Opening email client...';
      setTimeout(() => { btn.textContent = 'Send Message'; }, 3000);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#fff';
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

});

// Fade-in keyframes injected via JS
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
