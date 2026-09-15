/* =========================================================
   storage.js — camada de persistência em localStorage
   - Namespace "sementes:" evita colisões com outras apps
   - Versionamento de schema permite migração futura
   - Operações específicas por entidade (doações, cadastros)
   - Tratamento de erros de quota e JSON inválido
   ========================================================= */

const NAMESPACE = 'sementes:';
const VERSION = 1;

/* ---------------------------------------------------------
   Utilitários internos
   --------------------------------------------------------- */
function key(name) {
  return `${NAMESPACE}v${VERSION}:${name}`;
}

function isAvailable() {
  try {
    const t = '__test__';
    localStorage.setItem(t, t);
    localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function read(name, fallback) {
  if (!isAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Falha ao ler "${name}":`, err);
    return fallback;
  }
}

function write(name, value) {
  if (!isAvailable()) return false;
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
    return true;
  } catch (err) {
    if (err.name === 'QuotaExceededError') {
      console.warn('[storage] Cota excedida. Considere limpar histórico antigo.');
    } else {
      console.warn(`[storage] Falha ao gravar "${name}":`, err);
    }
    return false;
  }
}

function remove(name) {
  if (!isAvailable()) return;
  localStorage.removeItem(key(name));
}

/* ---------------------------------------------------------
   Identificador único simples
   --------------------------------------------------------- */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------------------------------------------------------
   API pública
   --------------------------------------------------------- */
export const storage = {

  /* ---------- Doações ---------- */
  getDoacoes() {
    return read('doacoes', []);
  },

  addDoacao(dados) {
    const lista = this.getDoacoes();
    const registro = {
      id: uid(),
      criadoEm: new Date().toISOString(),
      ...dados,
    };
    lista.unshift(registro); // mais recentes no topo
    write('doacoes', lista);
    return registro;
  },

  removeDoacao(id) {
    const lista = this.getDoacoes().filter((d) => d.id !== id);
    write('doacoes', lista);
  },

  /* ---------- Cadastros de voluntários ---------- */
  getVoluntarios() {
    return read('voluntarios', []);
  },

  addVoluntario(dados) {
    const lista = this.getVoluntarios();
    const registro = {
      id: uid(),
      criadoEm: new Date().toISOString(),
      ...dados,
    };
    lista.unshift(registro);
    write('voluntarios', lista);
    return registro;
  },

  removeVoluntario(id) {
    const lista = this.getVoluntarios().filter((v) => v.id !== id);
    write('voluntarios', lista);
  },

  /* ---------- Preferências (ex.: última rota, tema) ---------- */
  getPref(key, fallback = null) {
    const prefs = read('prefs', {});
    return key in prefs ? prefs[key] : fallback;
  },

  setPref(key, value) {
    const prefs = read('prefs', {});
    prefs[key] = value;
    write('prefs', prefs);
  },

  /* ---------- Histórico unificado (para exibição) ---------- */
  getHistorico() {
    const doacoes = this.getDoacoes().map((d) => ({
      tipo: 'doacao',
      id: d.id,
      criadoEm: d.criadoEm,
      resumo: `Doação de R$ ${Number(d.valor || 0).toFixed(2)}`,
    }));
    const voluntarios = this.getVoluntarios().map((v) => ({
      tipo: 'voluntario',
      id: v.id,
      criadoEm: v.criadoEm,
      resumo: `Cadastro: ${v.nome || 'sem nome'}`,
    }));
    return [...doacoes, ...voluntarios].sort(
      (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
    );
  },

  /* ---------- Rascunho de formulário (evita perder dados ao trocar de view) ---------- */
  saveDraft(formName, dados) {
    write(`draft:${formName}`, dados);
  },

  loadDraft(formName) {
    return read(`draft:${formName}`, null);
  },

  clearDraft(formName) {
    remove(`draft:${formName}`);
  },

  /* ---------- Utilidades gerais ---------- */
  clearAll() {
    if (!isAvailable()) return;
    const prefix = NAMESPACE;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  },

  isAvailable,
};