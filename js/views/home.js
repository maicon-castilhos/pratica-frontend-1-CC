/* =========================================================
   home.js — view da página inicial
   ========================================================= */

import { renderTemplate } from "../templates.js";
import { mount, qs, formatBRL } from "../utils/dom.js";
import { storage } from "../storage.js";

const projetosDestaque = [
  {
    status: "ativo",
    title: "Educação que abre portas",
    text: "Reforço escolar e preparação para o mercado.",
    publico: "120 estudantes",
    local: "Vila Nova",
  },
  {
    status: "ativo",
    title: "Segurança alimentar",
    text: "Hortas comunitárias e distribuição de cestas.",
    publico: "300 famílias",
    local: "5 comunidades",
  },
  {
    status: "ativo",
    title: "Geração de renda",
    text: "Capacitação e acompanhamento para formalização.",
    publico: "80 mulheres",
    local: "Núcleo Central",
  },
];

const depoimentos = [
  {
    avatar: "assets/img/avatar/avatar-chandler.jpg",
    alt: "Retrato de Chandler Mascarenhas",
    quote: "“Entrei como aluno do reforço e hoje sou monitor da mesma turma.”",
    author: "— Chandler Mascarenhas, Vila Nova",
  },
  {
    avatar: "assets/img/avatar/avatar-chandler.jpg",
    alt: "Retrato de Ana Ribeiro",
    quote:
      "“A horta comunitária virou fonte de renda e orgulho para a nossa rua.”",
    author: "— Ana Ribeiro, Jardim das Flores",
  },
  {
    avatar: "assets/img/avatar/avatar-chandler.jpg",
    alt: "Retrato de João Pereira",
    quote: "“Como voluntário, aprendi mais do que ensinei.”",
    author: "— João Pereira, voluntário",
  },
];

export function renderHome(container) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero__grid">
        <div>
          <span class="hero__eyebrow">Desde 2009 • Terceiro setor</span>
          <h1 class="hero__title" id="hero-title">Transformamos <em>engajamento</em> em oportunidades reais</h1>
          <p class="hero__lead">Atuamos em comunidades vulneráveis com projetos de educação, segurança alimentar e geração de renda.</p>
          <div class="hero__actions">
            <a class="btn btn--primary btn--lg" href="/doacao" data-link>Fazer uma doação</a>
            <a class="btn btn--secondary btn--lg" href="/projetos" data-link>Ver projetos</a>
          </div>
        </div>
        <figure class="hero__figure">
          <img src="assets/img/hero/comunidade-800.jpg" alt="Grupo reunido em círculo na horta comunitária." width="800" height="600" loading="eager" fetchpriority="high" decoding="async">
          <figcaption class="hero__caption">Oficina de horta comunitária — Vila Nova, 2024.</figcaption>
        </figure>
      </div>
    </section>

    <section class="section" aria-labelledby="sobre-title">
      <div class="container">
        <header class="section__header">
          <h2 class="section__title" id="sobre-title">Quem somos</h2>
          <p class="section__subtitle">Mudança construída com método, escuta e continuidade.</p>
        </header>
        <div class="grid grid--3">
          <article class="card"><span class="card__icon" aria-hidden="true">🎯</span><h3 class="card__title">Missão</h3><p class="card__text">Ampliar o acesso a educação, alimentação digna e trabalho.</p></article>
          <article class="card"><span class="card__icon" aria-hidden="true">🌱</span><h3 class="card__title">Visão</h3><p class="card__text">Comunidades autônomas, capazes de decidir sobre o próprio futuro.</p></article>
          <article class="card"><span class="card__icon" aria-hidden="true">💚</span><h3 class="card__title">Valores</h3><p class="card__text">Transparência, protagonismo local, equidade e impacto mensurável.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="destaques-title">
      <div class="container">
        <header class="section__header section__header--center">
          <h2 class="section__title" id="destaques-title">Projetos em destaque</h2>
        </header>
        <div class="grid grid--3" data-destaques></div>
        <p class="text-center mt-6"><a class="btn btn--secondary" href="/projetos" data-link>Ver todos os projetos</a></p>
      </div>
    </section>

    <section class="section" aria-labelledby="impacto-title">
      <div class="container">
        <header class="section__header section__header--center">
          <h2 class="section__title" id="impacto-title">Nosso impacto em números</h2>
        </header>
        <dl class="stats">
          <div class="stat"><dt>Pessoas atendidas</dt><dd data-count="4820">0</dd></div>
          <div class="stat"><dt>Voluntários ativos</dt><dd data-count="312">0</dd></div>
          <div class="stat"><dt>Projetos em andamento</dt><dd data-count="7">0</dd></div>
          <div class="stat"><dt>Comunidades parceiras</dt><dd data-count="12">0</dd></div>
        </dl>
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="depoimentos-title">
      <div class="container">
        <header class="section__header section__header--center">
          <h2 class="section__title" id="depoimentos-title">Quem viveu, conta</h2>
        </header>
        <div class="carousel" data-carousel>
          <div class="carousel__viewport"><div class="carousel__track" data-track></div></div>
          <div class="carousel__controls">
            <button class="carousel__btn" type="button" data-prev aria-label="Depoimento anterior">‹</button>
            <div class="carousel__dots" data-dots></div>
            <button class="carousel__btn" type="button" data-next aria-label="Próximo depoimento">›</button>
          </div>
        </div>
      </div>
    </section>
  `;

  mount(container, wrapper);

  // Preenche projetos em destaque
  const gridDestaques = qs("[data-destaques]", wrapper);
  projetosDestaque.forEach((p) => {
    const card = renderTemplate("tpl-card-projeto", p);
    gridDestaques.append(card);
  });

  // Preenche carrossel
  const track = qs("[data-track]", wrapper);
  depoimentos.forEach((d) =>
    track.append(renderTemplate("tpl-slide-depoimento", d)),
  );

  // Inicializa comportamentos locais
  initContadores(wrapper);
  initCarrossel(wrapper);
}

/* Contadores animados */
function initContadores(root) {
  const counters = root.querySelectorAll("[data-count]");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const start = performance.now();
        const duration = 1200;
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString("pt-BR");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((c) => io.observe(c));
}

/* Carrossel simples */
function initCarrossel(root) {
  const carousel = root.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-track]");
  const slides = track.children;
  const prev = carousel.querySelector("[data-prev]");
  const next = carousel.querySelector("[data-next]");
  const dotsBox = carousel.querySelector("[data-dots]");
  let index = 0;
  track.id = "carousel-track";
  prev.setAttribute("aria-controls", "carousel-track");
  next.setAttribute("aria-controls", "carousel-track");
  Array.from(slides).forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
    dot.setAttribute("aria-current", i === 0 ? "true" : "false");
    dot.addEventListener("click", () => go(i));
    dotsBox.append(dot);
  });

  const dots = dotsBox.querySelectorAll(".carousel__dot");
  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) =>
      d.setAttribute("aria-current", String(di === index)),
    );
  };

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  carousel.tabIndex = 0;
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  });

  let timer = setInterval(() => go(index + 1), 6000);
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", () => {
    timer = setInterval(() => go(index + 1), 6000);
  });
}
