# 📖 Sobre o projeto
O Sementes do Amanhã é uma ONG fictícia criada como cenário para o desenvolvimento de uma plataforma web completa voltada ao terceiro setor. O projeto evoluiu em três fases:

Fase 1 (EP I): site institucional multipágina com HTML5 semântico, acessibilidade e validação de formulário.

Fase 2 (EP II): plataforma interativa com design system, CSS3 avançado, filtros, carrossel e formulários de doação e voluntariado.

Fase 3 (EP III): transformação em Single Page Application (SPA) com JavaScript modular, roteamento por History API, templates nativos, persistência em localStorage e sanitização contra XSS.

## 🏗️ Arquitetura da v3
Estrutura de pastas da SPA:

pratica-frontend-1-CC-v3/
├── index.html              (único HTML, com template e main id="main")
├── css/
│   ├── base.css            (reset + design tokens)
│   ├── layout.css          (header, main, footer, grids, hero)
│   └── components.css      (botões, cards, badges, forms, carrossel, toast)
├── js/
│   ├── app.js              (ponto de entrada)
│   ├── router.js           (History API + foco + anúncio de rota)
│   ├── storage.js          (localStorage com namespace e versionamento)
│   ├── templates.js        (clonagem de template + preenchimento)
│   ├── views/
│   │   ├── home.js
│   │   ├── projetos.js
│   │   ├── doacao.js
│   │   └── voluntario.js
│   ├── forms/
│   │   ├── validacao.js    (máscaras + CPF + Luhn + ViaCEP)
│   │   └── feedback.js     (progresso + envio + rascunho + toast)
│   └── utils/
│       ├── dom.js          (helpers)
│       ├── sanitize.js     (escape contra XSS)
│       ├── toast.js        (feedback global)
│       └── menu.js         (menu hamburger)
└── assets/img/
    ├── hero/
    ├── icones/
    ├── og/
    └── avatar/

## 🔄 O que mudou em relação à v2

HTML único. As quatro páginas da v2 (index.html, projetos.html, doacao.html, voluntario.html) foram consolidadas em um único index.html com main id="main" vazio e templates nativos.

Roteamento SPA. A navegação entre views acontece via History API (/, /projetos, /doacao, /voluntario), sem recarregar a página. Botões voltar/avançar do navegador funcionam.

JavaScript modular. Toda a lógica foi dividida por responsabilidade: router, storage, templates, views, forms e utils. Cada módulo é um ES Module importado no topo.

Camada de persistência. O módulo storage.js encapsula o localStorage com namespace sementes:v1:*, versionamento de schema, tratamento de quota e operações tipadas para doações, cadastros, preferências, rascunhos e histórico unificado.

Templates nativos. Os template do HTML são clonados pelo JavaScript, com preenchimento via atributos data-*. Isso evita concatenação de strings e reduz o custo de parse.

Sanitização. Toda entrada do usuário passa por stripTags antes de ser salva ou renderizada. O toast também escapa mensagens com escapeHtml.

Feedback de formulário mais rico. Máscaras em tempo real, validação de CPF com dígitos verificadores, algoritmo de Luhn para cartão, autopreenchimento de cidade via ViaCEP, barra de progresso reativa, rascunho automático, estado "Enviando..." no botão e toast de confirmação.

Acessibilidade reforçada. Foco gerenciado a cada troca de view, anúncio de rota via role="status" com aria-live="polite", aria-invalid e aria-describedby nos campos com erro, aria-current nos links ativos.

CSS reorganizado em três folhas. base.css (tokens e reset), layout.css (estrutura macro) e components.css (peças reutilizáveis). Ordem de importação controlada para evitar conflito de especificidade.

## 🧩 Decisões técnicas
History API em vez de hash routing, por ser o padrão profissional de SPAs.

Views isoladas por módulo, cada uma exportando renderX(container).

Templates nativos template para componentes estruturais, com preenchimento via data-*.

localStorage com namespace e versionamento, tratado em uma camada única.

Sanitização de entrada antes de qualquer inserção no DOM.

Design system com tokens em :root e componentes em BEM.

Acessibilidade: skip-link, aria-current, aria-live, foco gerenciado, prefers-reduced-motion.

CSS Grid para layout macro e Flexbox para componentes internos.

## 🚀 Como rodar
A SPA usa History API, que exige um servidor local. Não funciona abrindo com duplo clique.

Com Python:

text
python -m http.server 8000
Com Node:

text
npx serve -s .
Depois acesse http://localhost:8000.

## ✅ Roteiro de teste
Navegue entre as 4 views e confirme que a URL muda sem recarregar.

Use os botões voltar/avançar do navegador.

Acesse uma URL inexistente (ex.: /xyz) e veja a view 404.

Em /projetos, teste os filtros por categoria.

Em /doacao, digite CPF 111.111.111-11 (inválido) e 111.444.777-35 (válido).

Digite CEP 01001000 e veja o preenchimento automático da cidade.

Use cartão 4111 1111 1111 1111 para passar no Luhn.

Preencha metade do formulário, recarregue a página e veja o rascunho voltar.

Envie o formulário e confira o localStorage:
JSON.parse(localStorage.getItem('sementes:v1:doacoes')).

## 🔮 Futuras atualizações
### Curto prazo:

Popular assets/img/hero/ com a imagem real e gerar variações responsivas em WebP e AVIF.

Adicionar og:image para compartilhamento em redes sociais.

Criar favicon.ico além do SVG, para navegadores antigos.

Revisar contraste de cores para conformidade WCAG AA.

### Médio prazo:

Backend real para persistir doações e cadastros (Node.js + Express ou similar).

Integração de pagamento (Pix, boleto, cartão) via gateway.

Painel administrativo da ONG para gerenciar doações e voluntários.

Painel de transparência com gráficos dinâmicos dos recursos aplicados.

Blog ou área de notícias com CMS simples.

### Longo prazo:

Modo escuro automático com prefers-color-scheme.

PWA com service worker e instalação offline.

Internacionalização (i18n) em português, inglês e espanhol.

Testes automatizados (Jest + Playwright).

CI/CD com deploy automático.

#### 👤 Autor

Maicon Amaral
Projeto desenvolvido como parte da disciplina de Desenvolvimento Front-end — Experiências Práticas I, II e III.