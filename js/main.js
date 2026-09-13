/* =========================================================
   main.js — interatividade geral
   - Menu hamburger responsivo
   - Filtros de projetos
   - Carrossel de depoimentos
   - Contadores animados
   - Toast de feedback
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. MENU HAMBURGER
     --------------------------------------------------------- */
  const toggle = document.querySelector('.header__toggle');
  const nav = document.getElementById('menu-principal');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.dataset.open === 'true';
      nav.dataset.open = String(!isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', !isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha ao clicar em um link
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.dataset.open = 'false';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha com Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.dataset.open === 'true') {
        nav.dataset.open = 'false';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     2. FILTROS DE PROJETOS
     --------------------------------------------------------- */
  const filterBar = document.querySelector('.filters');
  const projectsGrid = document.querySelector('[data-projects]');
  const emptyMsg = document.querySelector('[data-empty]');

  if (filterBar && projectsGrid) {
    const buttons = filterBar.querySelectorAll('.filters__btn');
    const cards = projectsGrid.querySelectorAll('[data-category]');

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filters__btn');
      if (!btn) return;

      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      let visibleCount = 0;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visibleCount++;
      });

      if (emptyMsg) emptyMsg.classList.toggle('hidden', visibleCount > 0);
    });
  }

  /* ---------------------------------------------------------
     3. CARROSSEL DE DEPOIMENTOS
     --------------------------------------------------------- */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-track]');
    const slides = track.children;
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const dotsBox = carousel.querySelector('[data-dots]');
    let index = 0;

    // Cria os pontos indicadores
    Array.from(slides).forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => go(i));
      dotsBox.appendChild(dot);
    });

    const dots = dotsBox.querySelectorAll('.carousel__dot');

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.setAttribute('aria-current', String(di === index)));
    }

    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));

    // Autoplay pausável
    let timer = setInterval(() => go(index + 1), 6000);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(() => go(index + 1), 6000);
    });

    // Navegação por teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    });
  }

  /* ---------------------------------------------------------
     4. CONTADORES ANIMADOS
     --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        // Easing ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((c) => io.observe(c));
  }

  /* ---------------------------------------------------------
     5. TOAST (feedback global)
     --------------------------------------------------------- */
  window.showToast = function (message, type = 'success') {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('toast--error', type === 'error');
    toast.dataset.show = 'true';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.dataset.show = 'false';
    }, 3500);
  };
})();