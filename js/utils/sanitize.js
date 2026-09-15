/* =========================================================
   sanitize.js — proteção contra XSS
   - Escapa caracteres perigosos para uso em innerHTML
   - Remove tags quando o texto precisa ser puro
   ========================================================= */

const MAPA = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/* Escapa uma string para ser inserida com segurança em HTML */
export function escapeHtml(valor) {
  if (valor == null) return '';
  return String(valor).replace(/[&<>"'`=/]/g, (c) => MAPA[c]);
}

/* Remove tags e devolve texto puro */
export function stripTags(valor) {
  if (valor == null) return '';
  return String(valor).replace(/<[^>]*>/g, '');
}

/* Sanitiza um objeto inteiro (útil antes de salvar no storage ou renderizar) */
export function sanitizeObject(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    out[k] = typeof v === 'string' ? stripTags(v) : v;
  }
  return out;
}