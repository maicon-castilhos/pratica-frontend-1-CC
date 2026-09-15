/* =========================================================
   validacao.js — máscaras + validações específicas
   - CPF com dígitos verificadores
   - Telefone (10 ou 11 dígitos)
   - CEP (8 dígitos) + autopreenchimento via ViaCEP
   - Cartão de crédito com algoritmo de Luhn
   - Validade MM/AA
   ========================================================= */

/* ---------- Máscaras ---------- */
const maskCPF = (v) =>
  v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskTelefone = (v) => {
  v = v.replace(/\D/g, '').slice(0, 11);
  return v.length <= 10
    ? v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
    : v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const maskCEP = (v) =>
  v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

const maskCartao = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();

const maskValidade = (v) =>
  v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

/* ---------- Validações ---------- */
function validaCPF(txt) {
  const cpf = txt.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i);
  let r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i);
  r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10]);
}

function validaCartao(num) {
  const n = num.replace(/\D/g, '');
  if (n.length < 13 || n.length > 19) return false;
  let soma = 0, alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    soma += d; alt = !alt;
  }
  return soma % 10 === 0;
}

/* ---------- Aplicação de máscaras ---------- */
function bindMask(selector, fn, root) {
  root.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('input', () => { el.value = fn(el.value); });
  });
}

/* ---------- Mensagens de erro ---------- */
const mensagens = {
  cpf:      'CPF inválido. Verifique os dígitos.',
  telefone: 'Telefone inválido (use DDD + número).',
  cep:      'CEP inválido (8 dígitos).',
  cartao:   'Número de cartão inválido.',
  validade: 'Use o formato MM/AA com mês válido.',
  cvv:      'CVV deve ter 3 ou 4 dígitos.',
};

/* ---------- Aplica validação customizada em um campo ---------- */
function bindValidacao(root, seletor, fn) {
  root.querySelectorAll(seletor).forEach((el) => {
    el.addEventListener('blur', () => {
      if (!el.value) { el.setCustomValidity(''); return; }
      const msg = fn(el.value);
      el.setCustomValidity(msg);
    });
    el.addEventListener('input', () => el.setCustomValidity(''));
  });
}

/* ---------- Inicialização ---------- */
export function initMasksAndValidation(form) {
  /* Máscaras */
  bindMask('#doador-cpf, #v-cpf', maskCPF, form);
  bindMask('#v-telefone', maskTelefone, form);
  bindMask('#v-cep', maskCEP, form);
  bindMask('#cartao-numero', maskCartao, form);
  bindMask('#cartao-validade', maskValidade, form);

  /* Validações */
  bindValidacao(form, '#doador-cpf, #v-cpf', (v) => validaCPF(v) ? '' : mensagens.cpf);

  bindValidacao(form, '#v-telefone', (v) => {
    const n = v.replace(/\D/g, '');
    return (n.length === 10 || n.length === 11) ? '' : mensagens.telefone;
  });

  bindValidacao(form, '#v-cep', (v) =>
    v.replace(/\D/g, '').length === 8 ? '' : mensagens.cep);

  bindValidacao(form, '#cartao-numero', (v) =>
    validaCartao(v) ? '' : mensagens.cartao);

  bindValidacao(form, '#cartao-validade', (v) => {
    const m = v.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return mensagens.validade;
    const mes = parseInt(m[1], 10);
    if (mes < 1 || mes > 12) return mensagens.validade;
    return '';
  });

  bindValidacao(form, '#cartao-cvv', (v) =>
    /^\d{3,4}$/.test(v) ? '' : mensagens.cvv);

  /* Autopreenchimento de cidade via ViaCEP */
  const cep = form.querySelector('#v-cep');
  if (cep) {
    cep.addEventListener('blur', () => {
      const n = cep.value.replace(/\D/g, '');
      if (n.length !== 8) return;
      fetch(`https://viacep.com.br/ws/${n}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (data.erro) return;
          const cidade = form.querySelector('#v-cidade');
          if (cidade && !cidade.value) cidade.value = data.localidade || '';
        })
        .catch(() => { /* silencioso */ });
    });
  }
}

/* Exporta utilitários úteis para outros módulos */
export { validaCPF, validaCartao };