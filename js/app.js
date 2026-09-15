/* =========================================================
   app.js — ponto de entrada da SPA
   ========================================================= */

import { initRouter } from './router.js';
import { initMenu }   from './utils/menu.js';

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initMenu();
});