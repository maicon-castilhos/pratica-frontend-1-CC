/* =========================================================
   router.js — roteamento SPA com History API
   - Intercepta cliques em links internos (data-link)
   - Trata navegação por popstate (voltar/avançar)
   - Delega a renderização para a view correta
   - Gerencia foco e atualiza aria-current na navegação
   ========================================================= */

import { renderHome }       from './views/home.js';
import { renderProjetos }   from './views/projetos.js';
import { renderDoacao }     from './views/doacao.js';
import { renderVoluntario } from './views/voluntario.js';

/* ---------------------------------------------------------
   Mapa de rotas: cada caminho aponta para uma view
   --------------------------------------------------------- */
const routes = {
  '/':           { render: renderHome,       title: 'Sementes do Amanhã' },
  '/projetos':   { render: renderProjetos,   title: 'Projetos — Sementes do Amanhã' },
  '/doacao':     { render: renderDoacao,     title: 'Doe Agora — Sementes do Amanhã' },
  '/voluntario': { render: renderVoluntario, title: 'Seja Voluntário — Sementes do Amanhã' },
};

const NOT_FOUND = {
  render: (container) => {
    container.innerHTML = `
      <section class="section" aria-labelledby="nf-title">
        <div class="container text-center">
          <h1 class="section__title" id="nf-title">Página não encontrada</h1>
          <p class="section__subtitle">O endereço acessado não existe.</p>
          <p class="mt-6">
            <a class="btn btn--primary" href="/" data-link>Voltar para a página inicial</a>
          </p>
        </div>
      </section>
    `;
  },
  title: 'Página não encontrada — Sementes do Amanhã',
};

/* ---------------------------------------------------------
   Utilidades internas
   --------------------------------------------------------- */
const main = () => document.getElementById('main');

function normalize(path) {
  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  // Trata /index.html como raiz
  if (path === '/index.html') path = '/';
  return path;
}

function updateActiveLink(path) {
  document.querySelectorAll('a[data-link]').forEach((a) => {
    const href = normalize(new URL(a.href, location.origin).pathname);
    if (href === path) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

/* ---------------------------------------------------------
   Renderização
   --------------------------------------------------------- */
export function navigate(path, { replace = false } = {}) {
  const clean = normalize(path);
  const route = routes[clean] || NOT_FOUND;

  if (replace) {
    history.replaceState({ path: clean }, '', clean);
  } else {
    history.pushState({ path: clean }, '', clean);
  }

  const container = main();
  container.innerHTML = '';
  route.render(container);
  document.title = route.title;

  const announcer = document.querySelector('[data-route-announcer]');
  if (announcer) announcer.textContent = route.title;

  updateActiveLink(clean);
  container.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   Interceptação de cliques em links internos
   --------------------------------------------------------- */
function onDocumentClick(event) {
  // Ignora cliques com modificadores (abrir em nova aba, etc.)
  if (event.defaultPrevented) return;
  if (event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest('a[data-link]');
  if (!link) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;

  const url = new URL(link.href, location.origin);
  if (url.origin !== location.origin) return;

  event.preventDefault();
  navigate(url.pathname);
}

/* ---------------------------------------------------------
   Botão voltar/avançar do navegador
   --------------------------------------------------------- */
function onPopState() {
  const path = normalize(location.pathname);
  const route = routes[path] || NOT_FOUND;
  const container = main();
  container.innerHTML = '';
  route.render(container);
  document.title = route.title;

  const announcer = document.querySelector('[data-route-announcer]');
  if (announcer) announcer.textContent = route.title;

  updateActiveLink(path);
  container.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   Inicialização
   --------------------------------------------------------- */
export function initRouter() {
  document.addEventListener('click', onDocumentClick);
  window.addEventListener('popstate', onPopState);

  // Renderiza a rota atual ao carregar a página
  const initial = normalize(location.pathname);
  const route = routes[initial] || NOT_FOUND;
  const container = main();
  route.render(container);
  document.title = route.title;
  updateActiveLink(initial);
}