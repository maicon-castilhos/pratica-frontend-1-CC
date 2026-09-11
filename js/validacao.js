(function () {
  'use strict';

  const form = document.getElementById('form-cadastro');
  if (!form) return;

  const cpf = form.querySelector('#cpf');
  const telefone = form.querySelector('#telefone');
  const cep = form.querySelector('#cep');

  /* ---------- Máscaras ---------- */
  function mascaraCPF(valor) {
    valor = valor.replace(/\D/g, '').slice(0, 11);
    return valor
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, '').slice(0, 11);
    if (valor.length <= 10) {
      return valor
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return valor
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function mascaraCEP(valor) {
    valor = valor.replace(/\D/g, '').slice(0, 8);
    return valor.replace(/(\d{5})(\d)/, '$1-$2');
  }

  /* ---------- Validações ---------- */
  function validaCPF(cpfTexto) {
    const cpf = cpfTexto.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  function validaTelefone(telTexto) {
    const n = telTexto.replace(/\D/g, '');
    return n.length === 10 || n.length === 11;
  }

  function validaCEP(cepTexto) {
    return cepTexto.replace(/\D/g, '').length === 8;
  }

  function setCustomValidity(input, msg) {
    input.setCustomValidity(msg);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function validarCPF() {
    if (!cpf.value) {
      setCustomValidity(cpf, 'Informe o CPF.');
      return false;
    }
    if (!validaCPF(cpf.value)) {
      setCustomValidity(cpf, 'CPF inválido. Verifique os dígitos.');
      return false;
    }
    setCustomValidity(cpf, '');
    return true;
  }

  function validarTelefone() {
    if (!telefone.value) {
      setCustomValidity(telefone, 'Informe o telefone.');
      return false;
    }
    if (!validaTelefone(telefone.value)) {
      setCustomValidity(telefone, 'Telefone inválido. Use DDD + número.');
      return false;
    }
    setCustomValidity(telefone, '');
    return true;
  }

  function validarCEP() {
    if (!cep.value) {
      setCustomValidity(cep, 'Informe o CEP.');
      return false;
    }
    if (!validaCEP(cep.value)) {
      setCustomValidity(cep, 'CEP inválido. Use 8 dígitos.');
      return false;
    }
    setCustomValidity(cep, '');
    return true;
  }

  /* ---------- Eventos de máscara e validação ---------- */
  cpf.addEventListener('input', function () {
    this.value = mascaraCPF(this.value);
    setCustomValidity(this, '');
  });
  cpf.addEventListener('blur', validarCPF);

  telefone.addEventListener('input', function () {
    this.value = mascaraTelefone(this.value);
    setCustomValidity(this, '');
  });
  telefone.addEventListener('blur', validarTelefone);

  cep.addEventListener('input', function () {
    this.value = mascaraCEP(this.value);
    setCustomValidity(this, '');
  });

  cep.addEventListener('blur', function () {
    validarCEP();

    const cepLimpo = this.value.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.erro) {
            const endereco = document.getElementById('endereco');
            const cidade = document.getElementById('cidade');
            const uf = document.getElementById('uf');

            if (endereco && !endereco.value) endereco.value = data.logradouro || '';
            if (cidade && !cidade.value) cidade.value = data.localidade || '';
            if (uf && !uf.value) uf.value = data.uf || '';
          }
        })
        .catch(() => {});
    }
  });

  /* ---------- Validação no envio ---------- */
  form.addEventListener('submit', function (e) {
    const cpfOk = validarCPF();
    const telOk = validarTelefone();
    const cepOk = validarCEP();

    if (!(cpfOk && telOk && cepOk)) {
      e.preventDefault();
      form.reportValidity();
      const invalido = form.querySelector(':invalid');
      if (invalido) invalido.focus();
    }
  });
})();