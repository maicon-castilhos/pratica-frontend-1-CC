/* =========================================================
   dom.js — helpers de manipulação de DOM
   ========================================================= */

/* Cria um elemento com atributos e filhos */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(attrs).forEach(([k, v]) => {
    if (v === false || v === null || v === undefined) return;
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else {
      node.setAttribute(k, v === true ? '' : v);
    }
  });

  const list = Array.isArray(children) ? children : [children];
  list.forEach((c) => {
    if (c == null) return;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  });

  return node;
}

/* Substitui o conteúdo de um container por novos filhos */
export function mount(container, ...children) {
  container.replaceChildren(...children);
}

/* Consulta simplificada */
export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Formata data para pt-BR */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* Formata valor em reais */
export function formatBRL(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}