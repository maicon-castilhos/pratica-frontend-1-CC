/* =========================================================
   projetos.js â€” listagem com filtros dinÃ¢micos
   ========================================================= */
import { mount, qs, qsa } from "../utils/dom.js";
import { renderTemplate, applyBadge } from "../templates.js";
const projetos = [
  {
    categoria: "educacao",
    status: "ativo",
    title: "EducaÃ§Ã£o que abre portas",
    text: "ReforÃ§o escolar, oficinas de leitura e preparaÃ§Ã£o para o mercado.",
    publico: "120 estudantes",
    local: "Vila Nova e Jardim das Flores",
  },
  {
    categoria: "alimentacao",
    status: "ativo",
    title: "SeguranÃ§a alimentar",
    text: "Hortas comunitÃ¡rias e educaÃ§Ã£o nutricional.",
    publico: "300 famÃ­lias",
    local: "5 comunidades",
  },
  {
    categoria: "renda",
    status: "ativo",
    title: "GeraÃ§Ã£o de renda",
    text: "CapacitaÃ§Ã£o em empreendedorismo e crÃ©dito solidÃ¡rio.",
    publico: "80 mulheres",
    local: "NÃºcleo Central",
  },
  {
    categoria: "saude",
    status: "planejamento",
    title: "SaÃºde e bem-estar",
    text: "MutirÃµes de saÃºde e rodas sobre saÃºde mental.",
    publico: "450/ano",
    local: "Itinerante",
  },
  {
    categoria: "educacao",
    status: "ativo",
    title: "Jovem Aprendiz",
    text: "PreparaÃ§Ã£o de adolescentes para o primeiro emprego.",
    publico: "60 jovens",
    local: "NÃºcleo Central",
  },
  {
    categoria: "alimentacao",
    status: "ativo",
    title: "Cozinha SolidÃ¡ria",
    text: "RefeiÃ§Ãµes diÃ¡rias para pessoas em situaÃ§Ã£o de rua.",
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
          <p class="section__subtitle">Filtre por Ã¡rea e conheÃ§a cada iniciativa em detalhe.</p>
        </header>

        <div class="filters" role="group" aria-label="Filtrar projetos por categoria">
          <button class="filters__btn" type="button" data-filter="all" aria-pressed="true">Todos</button>
          <button class="filters__btn" type="button" data-filter="educacao" aria-pressed="false">EducaÃ§Ã£o</button>
          <button class="filters__btn" type="button" data-filter="alimentacao" aria-pressed="false">AlimentaÃ§Ã£o</button>
          <button class="filters__btn" type="button" data-filter="renda" aria-pressed="false">Renda</button>
          <button class="filters__btn" type="button" data-filter="saude" aria-pressed="false">SaÃºde</button>
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
    const card = fragment.firstElementChild; // ðŸ‘ˆ pega o <article> real
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
