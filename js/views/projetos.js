/* =========================================================
   projetos.js — listagem com filtros dinâmicos
   ========================================================= */
import { mount, qs, qsa } from "../utils/dom.js";
import { renderTemplate, applyBadge } from "../templates.js";
const projetos = [
  {
    categoria: "educacao",
    status: "ativo",
    title: "Educação que abre portas",
    text: "Reforço escolar, oficinas de leitura e preparação para o mercado.",
    publico: "120 estudantes",
    local: "Vila Nova e Jardim das Flores",
  },
  {
    categoria: "alimentacao",
    status: "ativo",
    title: "Segurança alimentar",
    text: "Hortas comunitárias e educação nutricional.",
    publico: "300 famílias",
    local: "5 comunidades",
  },
  {
    categoria: "renda",
    status: "ativo",
    title: "Geração de renda",
    text: "Capacitação em empreendedorismo e crédito solidário.",
    publico: "80 mulheres",
    local: "Núcleo Central",
  },
  {
    categoria: "saude",
    status: "planejamento",
    title: "Saúde e bem-estar",
    text: "Mutirões de saúde e rodas sobre saúde mental.",
    publico: "450/ano",
    local: "Itinerante",
  },
  {
    categoria: "educacao",
    status: "ativo",
    title: "Jovem Aprendiz",
    text: "Preparação de adolescentes para o primeiro emprego.",
    publico: "60 jovens",
    local: "Núcleo Central",
  },
  {
    categoria: "alimentacao",
    status: "ativo",
    title: "Cozinha Solidária",
    text: "Refeições diárias para pessoas em situação de rua.",
    publico: "200/dia",
    local: "Centro",
  },
];

export function renderProjetos(container) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <section class="section" aria-labelledby="projetos-title">
      <div class="container">
        <header class="section__header">
          <h1 class="section__title" id="projetos-title">Nossos projetos</h1>
          <p class="section__subtitle">Filtre por área e conheça cada iniciativa em detalhe.</p>
        </header>

        <div class="filters" role="group" aria-label="Filtrar projetos por categoria">
          <button class="filters__btn" type="button" data-filter="all" aria-pressed="true">Todos</button>
          <button class="filters__btn" type="button" data-filter="educacao" aria-pressed="false">Educação</button>
          <button class="filters__btn" type="button" data-filter="alimentacao" aria-pressed="false">Alimentação</button>
          <button class="filters__btn" type="button" data-filter="renda" aria-pressed="false">Renda</button>
          <button class="filters__btn" type="button" data-filter="saude" aria-pressed="false">Saúde</button>
        </div>

        <div class="grid grid--3" data-projects></div>
        <p class="text-center mt-4 hidden" data-empty>Nenhum projeto encontrado para esta categoria.</p>
      </div>
    </section>
  `;

  mount(container, wrapper);

  const grid = qs("[data-projects]", wrapper);
  const empty = qs("[data-empty]", wrapper);

  projetos.forEach((p) => {
    const fragment = renderTemplate("tpl-card-projeto", p);
    const card = fragment.firstElementChild; // 👈 pega o <article> real
    if (!card) return; 
    card.dataset.category = p.categoria;
    applyBadge(card, p.status);
    grid.append(card);
  });

  // Filtros
  const filterBar = qs(".filters", wrapper);
  const buttons = qsa(".filters__btn", filterBar);
  const cards = qsa("[data-category]", grid);

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filters__btn");
    if (!btn) return;
    const filter = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));

    let visiveis = 0;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
      if (match) visiveis++;
    });
    empty.classList.toggle("hidden", visiveis > 0);
  });
}
