/* =========================================================
   toast.js — sistema de feedback visual global
   ========================================================= */

import { escapeHtml } from './sanitize.js';

export function showToast(message, type = 'success') {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;

  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button type="button" class="toast__close" aria-label="Fechar aviso">×</button>
  `;
  toast.classList.toggle('toast--error', type === 'error');
  toast.dataset.show = 'true';

  const close = () => { toast.dataset.show = 'false'; };
  toast.querySelector('.toast__close').addEventListener('click', close);

  clearTimeout(toast._timer);
  toast._timer = setTimeout(close, 5000);
}