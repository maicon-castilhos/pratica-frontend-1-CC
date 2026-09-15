/* =========================================================
   feedback.js — comportamento unificado dos formulários
   - Barra de progresso reativa
   - Rascunho automático no localStorage
   - Envio com estado "Enviando..." e bloqueio
   - Persistência via callback onSave
   - Toast de sucesso/erro
   - Limpeza segura no reset
   ========================================================= */

import { showToast } from '../utils/toast.js';
import { storage } from '../storage.js';
import { stripTags } from '../utils/sanitize.js';

/* Marca visualmente erro em um campo, sincronizado com mensagens */
function updateFieldState(field) {
  const errBox = field.form?.querySelector(`[data-error-for="${field.id}"]`);
  if (!errBox) return;

  const errorId = errBox.id || (errBox.id = `err-${field.id}`);

  if (field.validity.valid) {
    errBox.textContent = '';
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  } else {
    errBox.textContent = field.validationMessage || 'Campo inválido.';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  }
}

/* Calcula progresso do preenchimento */
function computeProgress(form) {
  const fields = form.querySelectorAll(
    'input:not([type="radio"]):not([type="checkbox"]), select, textarea'
  );
  const radios = form.querySelectorAll('input[type="radio"]');
  const checks = form.querySelectorAll('input[type="checkbox"][required]');

  let total = fields.length + (radios.length ? 1 : 0) + checks.length;
  let filled = 0;

  fields.forEach((f) => { if (f.value.trim() !== '') filled++; });
  if (radios.length && Array.from(radios).some((r) => r.checked)) filled++;
  checks.forEach((c) => { if (c.checked) filled++; });

  return total ? Math.round((filled / total) * 100) : 0;
}

/* Coleta e normaliza os dados do formulário */
function collectData(form) {
  const raw = Object.fromEntries(new FormData(form).entries());
  const dados = {};

  for (const [k, v] of Object.entries(raw)) {
    dados[k] = typeof v === 'string' ? stripTags(v.trim()) : v;
  }

  /* Normaliza valor quando for doação */
  if (dados.valor_outro && !dados.valor) {
    dados.valor = dados.valor_outro;
  }
  delete dados.valor_outro;
  delete dados.termos;

  if (dados.valor) dados.valor = Number(dados.valor);

  return dados;
}

/* ---------------------------------------------------------
   API principal
   --------------------------------------------------------- */
export function initForms(form, { entity, onSave } = {}) {
  const progress = form.querySelector('[data-progress]');

  /* Barra de progresso */
  const refreshProgress = () => {
    if (!progress) return;
    progress.style.width = computeProgress(form) + '%';
  };

  form.addEventListener('input', refreshProgress);
  form.addEventListener('change', refreshProgress);
  refreshProgress();

  /* Estados visuais por campo */
  form.addEventListener('blur', (e) => {
    const f = e.target;
    if (f.matches('input, select, textarea')) updateFieldState(f);
  }, true);

  form.addEventListener('input', (e) => {
    const f = e.target;
    if (f.matches('input, select, textarea') && f.validity.valid) {
      updateFieldState(f);
    }
  });

  /* Rascunho automático */
  const draftKey = entity || form.id;
  const savedDraft = storage.loadDraft(draftKey);
  if (savedDraft && typeof savedDraft === 'object') {
    Object.entries(savedDraft).forEach(([k, v]) => {
      const field = form.elements[k];
      if (!field) return;
      if (field.type === 'radio') {
        const radio = form.querySelector(`input[name="${k}"][value="${v}"]`);
        if (radio) radio.checked = true;
      } else if (field.type === 'checkbox') {
        field.checked = Boolean(v);
      } else {
        field.value = v;
      }
    });
    refreshProgress();
  }

  form.addEventListener('input', () => {
    storage.saveDraft(draftKey, collectData(form));
  });

  /* Envio */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      const primeiroInvalido = form.querySelector(':invalid');
      primeiroInvalido?.focus();
      showToast('Verifique os campos destacados.', 'error');
      return;
    }

    const dados = collectData(form);
    const button = form.querySelector('button[type="submit"]');
    const original = button?.textContent;

    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }

    /* Simula latência de rede — troque por fetch em produção */
    setTimeout(() => {
      try {
        if (typeof onSave === 'function') onSave(dados);
        storage.clearDraft(draftKey);
        form.reset();
        refreshProgress();
        form.querySelectorAll('[data-error-for]').forEach((el) => { el.textContent = ''; });
        showToast('Enviado com sucesso! Entraremos em contato.');
      } catch (err) {
        console.error('[forms] Falha ao salvar:', err);
        showToast('Não foi possível salvar. Tente novamente.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      }
    }, 900);
  });

  /* Reset limpa também o rascunho */
  form.addEventListener('reset', () => {
    storage.clearDraft(draftKey);
    requestAnimationFrame(() => {
      refreshProgress();
      form.querySelectorAll('[data-error-for]').forEach((el) => { el.textContent = ''; });
    });
  });
}