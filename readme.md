📖 Sobre o projeto
O Sementes do Amanhã é uma ONG fictícia criada como cenário para o desenvolvimento de uma plataforma web completa voltada ao terceiro setor. O projeto evoluiu em duas etapas:

Fase 1 (EP I): site institucional com HTML5 semântico, acessibilidade e validação de formulário.

Fase 2 (EP II): plataforma interativa com design system, CSS3 avançado, filtros, carrossel e formulários de doação e voluntariado.

🟢 Parte 1 — Experiência Prática I (Versão 1.0)
Objetivo
Construir um site institucional para uma ONG, aplicando HTML5 semântico, acessibilidade e validação de formulário com foco em integridade dos dados.

Estrutura entregue
text
pratica-frontend-1-CC/
├── index.html              ← Página inicial
├── projetos.html           ← Iniciativas solidárias
├── cadastro.html           ← Formulário de voluntário
├── css/
│   └── style.css
├── js/
│   └── validacao.js
└── assets/
    └── img/
        ├── icones/sementes_do_amanha_logo.svg
        ├── og/ (facebook, instagram, linkedin, youtube, whatsapp).png
        └── avatar/avatar-chandler.jpg

O que foi implementado

## HTML5 semântico
Uso de header, nav, main, section, article, aside, footer, figure, figcaption, address, blockquote, cite, dl, table

Hierarquia de títulos h1 → h2 → h3 sem saltos

Um único <h1> por página, vinculado a <section> via aria-labelledby

Acessibilidade
skip-link para pular ao conteúdo principal

aria-current="page" na navegação ativa

aria-labelledby em todas as seções

alt descritivo em todas as imagens

<address> para dados de contato

<dl> para pares termo-valor (indicadores de impacto)

Foco visível com :focus-visible

Validação em camadas
HTML nativo: required, type, maxlength, inputmode, autocomplete

## JavaScript: 

máscaras em tempo real para CPF, telefone e CEP

Algoritmo de CPF com dígitos verificadores

Validação de telefone (10 ou 11 dígitos)

Autopreenchimento de endereço via API ViaCEP

setCustomValidity para mensagens em português

## CSS
Variáveis em :root (--cor-primaria, --raio, --sombra, etc.)

Grid e Flexbox para layout

Media queries em 900px e 520px

Transições e estados de hover/focus

Identidade visual
Logotipo SVG no header das 3 páginas

Favicon SVG

Avatar no depoimento (Chandler Mascarenhas)

Ícones de redes sociais no rodapé

🔵 Parte 2 — Experiência Prática II (Versão 2.0)
Objetivo
Transformar o site institucional em uma plataforma web completa para ONGs, aplicando CSS3 avançado, design system escalável, interatividade com JavaScript puro e responsividade profissional.

O que mudou em relação à v1.0
1. Novas páginas
Página	Antes	Agora
index.html	Existia	Reestruturada com hero, sobre, projetos em destaque, impacto, carrossel e CTA
projetos.html	Estática	Ganhou filtros dinâmicos por categoria
doacao.html	❌ Não existia	Nova — formulário de captação
voluntario.html	Era cadastro.html	Renomeada e reorganizada
2. Design system implementado
Tokens em :root cobrindo:

Cores — marca, neutras, feedback (erro, sucesso, aviso, info)

Tipografia — escala fluida com clamp()

Espaçamento — escala de 8 passos (--sp-1 a --sp-8)

Raios, sombras, transições — reutilizáveis

Layout — largura máxima, altura do header

3. Metodologia BEM
Todas as classes reescritas como Block__Element--Modifier:

css
.header__inner
.nav__link--cta
.card__title
.project-card__badge--active
4. CSS3 avançado
Grid para layout macro, Flexbox para componentes

clamp() para tipografia fluida

aspect-ratio em imagens

backdrop-filter no header sticky

prefers-reduced-motion respeitado

:user-invalid e :user-valid em formulários

Transições e microanimações em botões, cards e links

5. JavaScript interativo
main.js:

Menu hamburger responsivo (com aria-expanded, fecha com Esc)

Filtros de projetos por categoria (com aria-pressed)

Carrossel de depoimentos (autoplay pausável, teclado, dots)

Contadores animados com IntersectionObserver

Sistema de toast para feedback global

validacao.js:

Máscaras: CPF, telefone, CEP, cartão, validade

Validação de CPF com dígitos verificadores

Validação de cartão com algoritmo de Luhn

Autopreenchimento de cidade via ViaCEP

Barra de progresso animada

Mensagens de erro via data-error-for

6. Acessibilidade reforçada
aria-pressed nos filtros

aria-live="polite" no toast

aria-current no carrossel

Foco visível customizado

Navegação por teclado no carrossel e menu

7. Responsividade
Três breakpoints:

Breakpoint	Mudança
860px	Menu hamburger; hero em 1 coluna
720px	Grids empilham; footer vira coluna
520px	Carrossel empilha; botões full-width
8. Interatividade em formulários
Validação em 3 camadas (HTML + setCustomValidity + JS)

Feedback visual (borda verde/vermelha)

Barra de progresso

Estado "Enviando..." no botão

Toast de confirmação

Estrutura final da v2.0
text
pratica-frontend-1-CC/
├── index.html
├── projetos.html
├── doacao.html
├── voluntario.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── validacao.js
└── assets/
    └── img/
        ├── hero/                          ← Imagem do hero
        ├── icones/sementes_do_amanha_logo.svg
        ├── og/ (5 ícones de redes sociais)
        └── avatar/avatar-chandler.jpg

## 🧩 Decisões técnicas relevantes
Grid para layout, Flex para componentes — cada um no seu melhor caso

data-* para seletores JS — separa estilo de comportamento

Toast customizado em vez de alert()

Luhn para cartão — algoritmo padrão da indústria

IntersectionObserver para contadores — economia de CPU

prefers-reduced-motion — acessibilidade

clamp() para tipografia — menos media queries

### 🔮 Futuras atualizações
Seção reservada para registrar a evolução do projeto nas próximas etapas.

### 🎯 Curto prazo
□ Popular a pasta assets/img/hero/ com a imagem real (foto da horta comunitária)
□ Gerar variações responsivas do hero (480w, 800w, 1200w) em .webp e .avif
□ Adicionar og:image para compartilhamento em redes sociais
□ Criar favicon.ico além do SVG para navegadores antigos
□ Revisar contraste de cores para conformidade WCAG AA

### 🛠️ Médio prazo
□ Backend real para persistir doações e cadastros (Node.js + Express ou similar)
□ Integração de pagamento (Pix, boleto, cartão) via gateway
□ Autenticação de usuários voluntários (login/cadastro persistente)
□ Dashboard administrativo para a ONG gerenciar doações e voluntários
□ Painel de transparência com gráficos dinâmicos dos recursos aplicados
□ Blog ou área de notícias com CMS simples
□ Formulário de contato com envio por e-mail

### 🚀 Longo prazo ###
□ Modo escuro automático com prefers-color-scheme
□ PWA (Progressive Web App) com service worker e instalação offline
□ Internacionalização (i18n) — português, inglês, espanhol
□ Acessibilidade AAA — auditoria completa com leitores de tela
□ Testes automatizados (Jest + Playwright)
□ CI/CD com deploy automático
□ Analytics respeitando privacidade (Plausible ou similar)
□ Integração com redes sociais — feed do Instagram no rodapé
□ Área logada do doador com histórico de contribuições
□ Gamificação para voluntários (badges, ranking de horas)

### 💡 Ideias em avaliação ###
Migração para um framework (Astro, Next.js) mantendo a base HTML/CSS

Uso de @container queries para responsividade baseada em componente

Adoção de @layer para organizar a cascata CSS

Testes de acessibilidade com axe-core no pipeline

Documentação do design system em Storybook ou página própria

## 🚀 Como rodar o projeto ## 
Baixe ou clone a pasta pratica-frontend-1-CC/

Abra index.html no navegador (duplo clique)

Navegue entre as páginas pelo menu

Teste:

Redimensione a janela para ver o menu hamburger

Clique nos filtros em projetos.html

Navegue no carrossel com setas do teclado

Preencha doacao.html com CPF 111.444.777-35 e cartão 4111 1111 1111 1111

Veja a barra de progresso subir conforme preenche

## 📌 Pendências conhecidas ##
Pasta assets/img/hero/ precisa ser populada com a imagem real

Integração real de pagamento (a submissão é simulada)

Backend para persistir doações e cadastros

og:image para compartilhamento em redes sociais

👤 Autor
Maicon Amaral
Projeto desenvolvido como parte da disciplina de Desenvolvimento Front-end — Experiências Práticas I e II.

Versão atual: 2.0
Data: 2025
Licença: CC BY-SA 4.0