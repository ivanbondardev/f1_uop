/* =====================================================
   F1 Операційна Платформа — Маршрутизатор за хешем
   ===================================================== */

const PAGES = {};  // заповнюється модулями сторінок: PAGES['#/шлях/екрану'] = renderFn

function registerPages(map) {
  Object.assign(PAGES, map);
}

function navigate(hash) {
  window.location.hash = hash;
}

// ─── Сесія (demo persistence через localStorage) ───
function _isAuthenticated() {
  try {
    var session = JSON.parse(localStorage.getItem('f1_session') || 'null');
    return !!(session && session.authenticated);
  } catch(e) { return false; }
}

function _getSession() {
  try { return JSON.parse(localStorage.getItem('f1_session') || 'null') || {}; } catch(e) { return {}; }
}

function _setSession(data) {
  try { localStorage.setItem('f1_session', JSON.stringify(data)); } catch(e) {}
}

function _clearSession() {
  try { localStorage.removeItem('f1_session'); } catch(e) {}
}

// ─── Auth mode: оновлення CSS-класу на body ───
function _updateAuthMode() {
  var authed = _isAuthenticated();
  var hash = window.location.hash || '';
  // Fullscreen auth mode: не автентифікований І на сторінці логіну (або буде редирект)
  if (!authed) {
    document.body.classList.add('f1-auth-mode');
  } else {
    document.body.classList.remove('f1-auth-mode');
  }
  // Оновити topbar profile
  if (typeof _updateProfileButton === 'function') _updateProfileButton();
}

// ─── Персистентність активної ролі ───
function _persistRole(role) {
  try { localStorage.setItem('f1_active_role', role); } catch(e) {}
}
function _getPersistedRole() {
  try { return localStorage.getItem('f1_active_role') || ''; } catch(e) { return ''; }
}

function switchRole(role) {
  _persistRole(role);
  // Оновити роль у сесії
  var session = _getSession();
  if (session.authenticated) {
    session.active_role = role;
    _setSession(session);
  }
  if (role) {
    navigate('#/roles/' + role + '/workspace');
  } else {
    navigate('#/shared/cases');
  }
}

function handleRoute() {
  const hash = window.location.hash || '#/shared/cases';
  const main = document.getElementById('mainContent');

  // ── Auth guard: якщо не автентифікований — редирект на логін ──
  if (!_isAuthenticated() && hash !== '#/shared/auth') {
    // Зберегти цільовий маршрут для redirect після логіну
    try { sessionStorage.setItem('f1_redirect_after_login', hash); } catch(e) {}
    window.location.hash = '#/shared/auth';
    return; // hashchange відпрацює повторно
  }

  _updateAuthMode();

  const renderer = PAGES[hash];

  if (renderer) {
    main.innerHTML = renderer();
  } else {
    main.innerHTML = `
      <div class="page-header"><h1 class="page-title">404 — Сторінку не знайдено</h1></div>
      <div class="notice"><div class="notice-title">Помилка навігації</div>
      <p>Маршрут <code>${hash}</code> не зареєстрований. Перейдіть на <a href="#/shared/cases" onclick="event.preventDefault();navigate('#/shared/cases')">Кейси</a>.</p></div>`;
  }

  main.scrollTop = 0;

  // Синхронізація перемикача ролей перед рендером бокового меню для коректної фільтрації.
  // Якщо хеш вказує на рольову сторінку — оновлюємо активну роль.
  // Інакше — зберігаємо раніше обрану роль з localStorage (не скидаємо).
  const rs = document.getElementById('roleSwitcher');
  const roleMatch = hash.match(/^#\/roles\/([^/]+)\//);
  if (rs) {
    if (roleMatch) {
      rs.value = roleMatch[1];
      _persistRole(roleMatch[1]);
    } else {
      rs.value = _getPersistedRole();
    }
  }

  renderSidebar(hash);

  // Закривати мобільне меню під час навігації
  if (typeof closeMobileNav === 'function') closeMobileNav();
}

window.addEventListener('hashchange', handleRoute);
