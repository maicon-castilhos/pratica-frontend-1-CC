/* =========================================================
   menu.js — comportamento do menu hamburger (global)
   ========================================================= */

export function initMenu() {
  const toggle = document.querySelector('.header__toggle');
  const nav = document.getElementById('menu-principal');

  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(nav.dataset.open !== 'true');
  });

  // Fecha ao clicar em qualquer link interno
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}