/* =========================================================
   validacao.js — máscaras + validação customizada
   - CPF (com dígitos verificadores)
   - Telefone e CEP
   - Cartão de crédito (Luhn)
   - Barra de progresso dos formulários
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     MÁSCARAS
     --------------------------------------------------------- */
  const maskCPF = (v) =>
    v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  const maskTel = (v) => {
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

  /* ---------------------------------------------------------
     VALIDAÇÕES
     --------------------------------------------------------- */
  const validaCPF = (txt) => {
    const cpf = txt.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i);
    let r = (s * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(cpf[9])) return false;

    s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i);
    r = (s * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(cpf[10]);
  };

  const validaCartao = (num) => {
    const n = num.replace(/\D/g, '');
    if (n.length < 13 || n.length > 19) return false;
    let soma = 0, alt = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = parseInt(n[i]);
      if (alt) { d *= 2; if (d > 9) d -= 9; }
      soma += d;
      alt = !alt;
    }
    return soma % 10 === 0;
  };

  /* ---------------------------------------------------------
     APLICAÇÃO DAS MÁSCARAS
     --------------------------------------------------------- */
  const bindMask = (selector, fn) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('input', (e) => {
        e.target.value = fn(e.target.value);
      });
    });
  };

  bindMask('#doador-cpf, #v-cpf', maskCPF);
  bindMask('#v-telefone', maskTel);
  bindMask('#v-cep', maskCEP);
  bindMask('#cartao-numero', maskCartao);
  bindMask('#cartao-validade', maskValidade);

  /* ---------------------------------------------------------
     VALIDAÇÃO CUSTOMIZADA (setCustomValidity)
     --------------------------------------------------------- */
  const setError = (input, msg) => {
    input.setCustomValidity(msg);
    const errEl = document.querySelector(`[data-error-for="${input.id}"]`);
    if (errEl) errEl.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const bindValidation = (selector, fn) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('blur', () => {
        if (!el.value) { setError(el, ''); return; }
        const err = fn(el.value);
        setError(el, err);
      });
      el.addEventListener('input', () => setError(el, ''));
    });
  };

  bindValidation('#doador-cpf, #v-cpf', (v) =>
    validaCPF(v) ? '' : 'CPF inválido. Verifique os dígitos.');

  bindValidation('#v-telefone', (v) => {
    const n = v.replace(/\D/g, '');
    return n.length === 10 || n.length === 11 ? '' : 'Telefone inválido (use DDD + número).';
  });

  bindValidation('#v-cep', (v) =>
    v.replace(/\D/g, '').length === 8 ? '' : 'CEP inválido (8 dígitos).');

  bindValidation('#cartao-numero', (v) =>
    validaCartao(v) ? '' : 'Número de cartão inválido.');

  bindValidation('#cartao-validade', (v) => {
    const m = v.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return 'Use o formato MM/AA.';
    const mes = parseInt(m[1], 10);
    if (mes < 1 || mes > 12) return 'Mês inválido.';
    return '';
  });

  bindValidation('#cartao-cvv', (v) =>
    /^\d{3,4}$/.test(v) ? '' : 'CVV deve ter 3 ou 4 dígitos.');

  /* ---------------------------------------------------------
     AUTO-PREENCHIMENTO DE CEP (ViaCEP)
     --------------------------------------------------------- */
  const cep = document.querySelector('#v-cep');
  if (cep) {
    cep.addEventListener('blur', () => {
      const n = cep.value.replace(/\D/g, '');
      if (n.length !== 8) return;
      fetch(`https://viacep.com.br/ws/${n}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (data.erro) return;
          const cidade = document.querySelector('#v-cidade');
          if (cidade && !cidade.value) cidade.value = data.localidade || '';
        })
        .catch(() => {});
    });
  }

  /* ---------------------------------------------------------
     BARRA DE PROGRESSO
     --------------------------------------------------------- */
  document.querySelectorAll('form').forEach((form) => {
    const bar = form.querySelector('[data-progress]');
    if (!bar) return;

    const update = () => {
      const fields = form.querySelectorAll('input:not([type="radio"]), select, textarea');
      let filled = 0, total = 0;
      fields.forEach((f) => {
        total++;
        if (f.value.trim() !== '') filled++;
      });
      const radios = form.querySelectorAll('input[type="radio"]');
      if (radios.length) {
        total++;
        if (Array.from(radios).some((r) => r.checked)) filled++;
      }
      const pct = total ? Math.round((filled / total) * 100) : 0;
      bar.style.width = pct + '%';
    };

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  });

  /* ---------------------------------------------------------
     SUBMISSÃO
     --------------------------------------------------------- */
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulação de envio
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
        form.reset();
        document.querySelectorAll('[data-error-for]').forEach((el) => (el.textContent = ''));
        if (window.showToast) {
          window.showToast('✓ Enviado com sucesso! Entraremos em contato.');
        }
      }, 1200);
    });
  });
})();