/* =========================================================
   templates.js — clonagem e preenchimento de <template>
   - Clona templates nativos por id
   - Preenche campos via atributos data-*
   - Suporta texto seguro (escapeHtml) e imagens
   ========================================================= */

import { escapeHtml } from './utils/sanitize.js';

/* Clona o conteúdo de um <template> por id */
export function cloneTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl) {
    console.warn(`[templates] Template não encontrado: ${id}`);
    return document.createDocumentFragment();
  }
  return tpl.content.cloneNode(true);
}

/* Preenche um nó clone com um mapa de dados
   Chaves correspondem a atributos data-* (ex.: { title: 'x' } preenche [data-title]) */
export function fillNode(node, dados = {}) {
  Object.entries(dados).forEach(([chave, valor]) => {
    const target = node.querySelector(`[data-${chave}]`);
    if (!target) return;

    // Caso especial: imagem
    if (target.tagName === 'IMG') {
      if (chave === 'avatar') {
        target.src = valor || '';
        target.alt = dados.alt || '';
      } else {
        target.src = valor || '';
      }
      return;
    }

    // Caso especial: link
    if (target.tagName === 'A' && chave === 'href') {
      target.href = valor || '#';
      return;
    }

    // Padrão: texto com escape
    target.textContent = valor == null ? '' : String(valor);
  });
  return node;
}

/* Combina clone + preenchimento em uma chamada só */
export function renderTemplate(id, dados = {}) {
  const fragment = cloneTemplate(id);
  const first = fragment.firstElementChild;
  if (first) fillNode(first, dados);
  return fragment;
}

/* Aplica uma classe de badge conforme o status */
export function applyBadge(node, status) {
  const badge = node.querySelector('[data-badge]');
  if (!badge) return;

  const map = {
    ativo:        { texto: 'Ativo',           classe: 'project-card__badge--active' },
    planejamento: { texto: 'Em planejamento', classe: 'project-card__badge--planning' },
  };
  const info = map[status] || map.ativo;
  badge.textContent = info.texto;
  badge.className = `project-card__badge ${info.classe}`;
}