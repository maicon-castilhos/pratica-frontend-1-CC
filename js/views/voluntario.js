/* =========================================================
   voluntario.js — formulário de cadastro de voluntários
   ========================================================= */

import { mount, qs } from '../utils/dom.js';
import { storage } from '../storage.js';
import { initForms } from '../forms/feedback.js';
import { initMasksAndValidation } from '../forms/validacao.js';

export function renderVoluntario(container) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <section class="section" aria-labelledby="voluntario-title">
      <div class="container">
        <header class="section__header section__header--center">
          <h1 class="section__title" id="voluntario-title">Seja voluntário</h1>
          <p class="section__subtitle">Doe um pouco do seu tempo e transforme realidades.</p>
        </header>

        <form class="form" id="form-voluntario" novalidate>
          <div class="form__progress" aria-hidden="true"><div class="form__progress-fill" data-progress></div></div>

          <fieldset class="form__fieldset">
            <legend class="form__legend">Dados pessoais</legend>
            <div class="form__field">
              <label class="form__label" for="v-nome">Nome completo *</label>
              <input class="form__input" type="text" id="v-nome" name="nome" required minlength="3" autocomplete="name">
              <span class="form__error" data-error-for="v-nome"></span>
            </div>
            <div class="form__field">
              <label class="form__label" for="v-email">E-mail *</label>
              <input class="form__input" type="email" id="v-email" name="email" required autocomplete="email">
              <span class="form__error" data-error-for="v-email"></span>
            </div>
            <div class="form__row">
              <div class="form__field">
                <label class="form__label" for="v-cpf">CPF *</label>
                <input class="form__input" type="text" id="v-cpf" name="cpf" required inputmode="numeric" maxlength="14" placeholder="000.000.000-00">
                <span class="form__error" data-error-for="v-cpf"></span>
              </div>
              <div class="form__field">
                <label class="form__label" for="v-telefone">Telefone *</label>
                <input class="form__input" type="tel" id="v-telefone" name="telefone" required inputmode="tel" maxlength="15" placeholder="(11) 91234-5678" autocomplete="tel">
                <span class="form__error" data-error-for="v-telefone"></span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form__fieldset">
            <legend class="form__legend">Endereço</legend>
            <div class="form__row">
              <div class="form__field">
                <label class="form__label" for="v-cep">CEP *</label>
                <input class="form__input" type="text" id="v-cep" name="cep" required inputmode="numeric" maxlength="9" placeholder="00000-000" autocomplete="postal-code">
                <span class="form__error" data-error-for="v-cep"></span>
              </div>
              <div class="form__field">
                <label class="form__label" for="v-cidade">Cidade *</label>
                <input class="form__input" type="text" id="v-cidade" name="cidade" required autocomplete="address-level2">
                <span class="form__error" data-error-for="v-cidade"></span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form__fieldset">
            <legend class="form__legend">Disponibilidade</legend>
            <div class="form__row">
              <div class="form__field">
                <label class="form__label" for="v-area">Área de interesse *</label>
                <select class="form__select" id="v-area" name="area" required>
                  <option value="">Selecione</option>
                  <option value="educacao">Educação</option>
                  <option value="alimentacao">Segurança alimentar</option>
                  <option value="renda">Geração de renda</option>
                  <option value="saude">Saúde</option>
                  <option value="comunicacao">Comunicação</option>
                  <option value="administrativo">Apoio administrativo</option>
                </select>
                <span class="form__error" data-error-for="v-area"></span>
              </div>
              <div class="form__field">
                <label class="form__label" for="v-turno">Disponibilidade *</label>
                <select class="form__select" id="v-turno" name="turno" required>
                  <option value="">Selecione</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                  <option value="fds">Fins de semana</option>
                  <option value="flexivel">Flexível</option>
                </select>
                <span class="form__error" data-error-for="v-turno"></span>
              </div>
            </div>
            <div class="form__field">
              <label class="form__label" for="v-mensagem">Mensagem (opcional)</label>
              <textarea class="form__textarea" id="v-mensagem" name="mensagem" rows="4" placeholder="Conte um pouco sobre você."></textarea>
            </div>
          </fieldset>

          <div class="form__checkbox">
            <input type="checkbox" id="v-termos" name="termos" required>
            <label for="v-termos">Li e aceito os termos de uso e a política de privacidade. *</label>
          </div>

          <div class="form__actions">
            <button class="btn btn--primary btn--lg" type="submit">Enviar cadastro</button>
            <button class="btn btn--ghost" type="reset">Limpar</button>
          </div>
        </form>
      </div>
    </section>
  `;

  mount(container, wrapper);

  const form = qs('#form-voluntario', wrapper);
  initMasksAndValidation(form);
  initForms(form, {
    entity: 'voluntario',
    onSave: (dados) => storage.addVoluntario(dados),
  });
}