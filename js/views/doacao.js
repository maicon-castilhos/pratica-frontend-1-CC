/* =========================================================
   doacao.js — formulário de doação
   ========================================================= */

import { mount, qs } from '../utils/dom.js';
import { storage } from '../storage.js';
import { initForms } from '../forms/feedback.js';
import { initMasksAndValidation } from '../forms/validacao.js';

export function renderDoacao(container) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="section" aria-labelledby="doacao-title">
      <div class="container">
        <header class="section__header section__header--center">
          <h1 class="section__title" id="doacao-title">Doe agora</h1>
          <p class="section__subtitle">Escolha um valor e ajude a sustentar nossos projetos.</p>
        </header>

        <form class="form" id="form-doacao" novalidate>
          <div class="form__progress" aria-hidden="true"><div class="form__progress-fill" data-progress></div></div>

          <fieldset class="form__fieldset">
            <legend class="form__legend">1. Valor da doação</legend>
            <div class="donation-values" role="radiogroup" aria-label="Valor da doação">
              <input type="radio" id="v30" name="valor" value="30" required>
              <label for="v30">R$ 30</label>
              <input type="radio" id="v50" name="valor" value="50">
              <label for="v50">R$ 50</label>
              <input type="radio" id="v100" name="valor" value="100">
              <label for="v100">R$ 100</label>
              <input type="radio" id="v250" name="valor" value="250">
              <label for="v250">R$ 250</label>
            </div>
            <div class="form__field">
              <label class="form__label" for="valor-outro">Ou digite outro valor (R$)</label>
              <input class="form__input" type="number" id="valor-outro" name="valor_outro" min="5" step="1" inputmode="numeric" placeholder="Ex.: 75">
              <span class="form__error" data-error-for="valor-outro"></span>
            </div>
            <div class="form__field">
              <label class="form__label" for="recorrencia">Tipo de doação *</label>
              <select class="form__select" id="recorrencia" name="recorrencia" required>
                <option value="">Selecione</option>
                <option value="unica">Única</option>
                <option value="mensal">Mensal</option>
              </select>
              <span class="form__error" data-error-for="recorrencia"></span>
            </div>
          </fieldset>

          <fieldset class="form__fieldset">
            <legend class="form__legend">2. Seus dados</legend>
            <div class="form__field">
              <label class="form__label" for="doador-nome">Nome completo *</label>
              <input class="form__input" type="text" id="doador-nome" name="nome" required minlength="3" autocomplete="name">
              <span class="form__error" data-error-for="doador-nome"></span>
            </div>
            <div class="form__row">
              <div class="form__field">
                <label class="form__label" for="doador-email">E-mail *</label>
                <input class="form__input" type="email" id="doador-email" name="email" required autocomplete="email">
                <span class="form__error" data-error-for="doador-email"></span>
              </div>
              <div class="form__field">
                <label class="form__label" for="doador-cpf">CPF *</label>
                <input class="form__input" type="text" id="doador-cpf" name="cpf" required inputmode="numeric" maxlength="14" placeholder="000.000.000-00" autocomplete="off">
                <span class="form__error" data-error-for="doador-cpf"></span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form__fieldset">
            <legend class="form__legend">3. Pagamento</legend>
            <div class="form__field">
              <label class="form__label" for="cartao-numero">Número do cartão *</label>
              <input class="form__input" type="text" id="cartao-numero" name="cartao" required inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="cc-number">
              <span class="form__error" data-error-for="cartao-numero"></span>
            </div>
            <div class="form__row">
              <div class="form__field">
                <label class="form__label" for="cartao-validade">Validade *</label>
                <input class="form__input" type="text" id="cartao-validade" name="validade" required inputmode="numeric" maxlength="5" placeholder="MM/AA" autocomplete="cc-exp">
                <span class="form__error" data-error-for="cartao-validade"></span>
              </div>
              <div class="form__field">
                <label class="form__label" for="cartao-cvv">CVV *</label>
                <input class="form__input" type="text" id="cartao-cvv" name="cvv" required inputmode="numeric" maxlength="4" placeholder="123" autocomplete="cc-csc">
                <span class="form__error" data-error-for="cartao-cvv"></span>
              </div>
            </div>
          </fieldset>

          <div class="form__checkbox">
            <input type="checkbox" id="doacao-termos" name="termos" required>
            <label for="doacao-termos">Li e aceito os termos de uso e a política de privacidade. *</label>
          </div>

          <div class="form__actions">
            <button class="btn btn--primary btn--lg" type="submit">Confirmar doação</button>
            <button class="btn btn--ghost" type="reset">Limpar</button>
          </div>
        </form>
      </div>
    </section>
  `;

  mount(container, wrapper);

  const form = qs('#form-doacao', wrapper);
  initMasksAndValidation(form);
  initForms(form, {
    entity: 'doacao',
    onSave: (dados) => storage.addDoacao(dados),
  });
}