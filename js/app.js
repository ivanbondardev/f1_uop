/* =====================================================
   F1 Операційна Платформа — Точка входу застосунку
   Ініціалізує маршрутизацію, рендерить оболонку та обробляє перше завантаження.
   ===================================================== */

// ─── Перемикач підказок (hero-notice / notice) ───
function toggleNotices() {
  var hidden = document.body.classList.toggle('notices-hidden');
  try { localStorage.setItem('f1_notices_hidden', hidden ? '1' : '0'); } catch(e) {}
  updateNoticesToggleTitle(hidden);
}

function updateNoticesToggleTitle(hidden) {
  var btn = document.getElementById('noticesToggle');
  if (btn) {
    btn.title = hidden ? 'Показати підказки' : 'Приховати підказки';
    btn.setAttribute('aria-label', btn.title);
  }
  var label = document.getElementById('noticesToggleLabel');
  if (label) {
    label.textContent = hidden ? 'Підказки ⛌' : 'Підказки';
  }
}

// Відновити стан підказок з localStorage
(function() {
  try {
    if (localStorage.getItem('f1_notices_hidden') === '1') {
      document.body.classList.add('notices-hidden');
      // Оновлення іконки після завантаження DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { updateNoticesToggleTitle(true); });
      } else {
        updateNoticesToggleTitle(true);
      }
    }
  } catch(e) {}
})();

// ─── Перемикач мобільної навігації ───
function toggleMobileNav() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('mobile-open');
}

function closeMobileNav() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('mobile-open');
}

// ─── Toggle інтеграційного dropdown ───
function toggleIntegrationDropdown() {
  var dd = document.getElementById('integrationDropdown');
  if (!dd) return;
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  // Закрити notification dropdown, якщо відкритий
  closeNotifDropdown();
}

// ─── Notification Dropdown (SH-07 refactored) ───
function toggleNotifDropdown(e) {
  if (e) e.stopPropagation();
  var dd = document.getElementById('notifDropdown');
  if (!dd) return;
  var isOpen = dd.classList.contains('open');
  // Закрити інтеграційний dropdown
  var ihDd = document.getElementById('integrationDropdown');
  if (ihDd) ihDd.style.display = 'none';
  if (isOpen) {
    dd.classList.remove('open');
  } else {
    // Рендеримо вміст щоразу при відкритті (свіжі дані)
    if (typeof DATA !== 'undefined' && DATA.notifications) {
      dd.innerHTML = C.notificationDropdownContent(DATA.notifications.data);
    }
    dd.classList.add('open');
  }
}

function closeNotifDropdown() {
  var dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.remove('open');
}

// Закрити dropdown при кліку за межами
document.addEventListener('click', function(e) {
  // Інтеграційний dropdown
  var wrap = document.getElementById('integrationHealthToggle');
  var dd = document.getElementById('integrationDropdown');
  if (dd && wrap && !wrap.contains(e.target)) {
    dd.style.display = 'none';
  }
  // Notification dropdown
  var notifWrap = e.target.closest('.notif-dropdown-wrap');
  if (!notifWrap) {
    closeNotifDropdown();
  }
  // Profile dropdown
  var profileWrap = e.target.closest('.profile-dropdown-wrap');
  if (!profileWrap) {
    closeProfileDropdown();
  }
});

// ─── SH-01 Auth Flow: глобальні обробники ───
// (функції доступні з onclick у рендері сторінки SH-01)

function _authRerender() {
  // Оновити CSS-клас для fullscreen mode
  _updateAuthMode();
  // Перерендерити тільки вміст сторінки auth
  if (window.location.hash === '#/shared/auth' && typeof PAGES !== 'undefined' && PAGES['#/shared/auth']) {
    var main = document.getElementById('mainContent');
    if (main) main.innerHTML = PAGES['#/shared/auth']();
  }
}

function _authDoLogin() {
  var st = window._authState;
  if (!st || st.loading) return;
  var email = (document.getElementById('authEmail') || {}).value || '';
  var password = (document.getElementById('authPassword') || {}).value || '';

  // Валідація
  if (!email.trim()) { st.error = 'Введіть адресу е-пошти.'; _authRerender(); return; }
  if (!password.trim()) { st.error = 'Введіть пароль.'; _authRerender(); return; }

  // Демо: невірні облікові дані
  if (email !== 'demo@f1ops.com' || password !== 'demo1234') {
    st.attempts++;
    if (st.attempts >= 5) {
      st.error = 'Занадто багато невдалих спроб. Обліковий запис тимчасово заблоковано. Спробуйте через 5 хвилин або зверніться до адміністратора.';
    } else {
      st.error = 'Невірна е-пошта або пароль. Спроба ' + st.attempts + ' з 5.';
    }
    _authRerender();
    return;
  }

  // Показати стан завантаження
  st.loading = true;
  st.error = null;
  _authRerender();

  // Імітація запиту до API
  setTimeout(function() {
    st.loading = false;
    // MFA тимчасово вимкнено — переходимо одразу до вибору ролі
    // st.step = 'mfa';
    st.step = 'role';
    st.error = null;
    st.mfaResent = false;
    st.selectedRole = null;
    _authRerender();
  }, 900);
}

function _authMfaAdvance(el, idx) {
  // Автоматично переходити до наступного інпуту
  if (el.value.length === 1 && idx < 5) {
    var next = document.getElementById('mfa' + (idx + 1));
    if (next) next.focus();
  }
  // Автоматичне підтвердження при заповненні всіх 6 цифр
  if (idx === 5 && el.value.length === 1) {
    var code = '';
    for (var i = 0; i < 6; i++) {
      var d = document.getElementById('mfa' + i);
      code += d ? d.value : '';
    }
    if (code.length === 6) {
      setTimeout(function() { _authVerifyMfa(); }, 200);
    }
  }
}

function _authMfaKeydown(e, idx) {
  // Backspace — перейти до попереднього інпуту
  if (e.key === 'Backspace' && idx > 0) {
    var cur = document.getElementById('mfa' + idx);
    if (cur && !cur.value) {
      var prev = document.getElementById('mfa' + (idx - 1));
      if (prev) { prev.value = ''; prev.focus(); }
    }
  }
}

function _authVerifyMfa() {
  var st = window._authState;
  if (!st || st.loading) return;
  var code = '';
  for (var i = 0; i < 6; i++) {
    var d = document.getElementById('mfa' + i);
    code += d ? d.value : '';
  }
  if (code.length < 6) {
    st.error = 'Введіть повний 6-значний код підтвердження.';
    _authRerender();
    return;
  }
  if (code !== '482901') {
    st.error = 'Невірний код підтвердження. Перевірте та спробуйте ще раз.';
    st.mfaResent = false;
    _authRerender();
    return;
  }
  st.loading = true;
  st.error = null;
  _authRerender();
  setTimeout(function() {
    st.loading = false;
    st.step = 'role';
    st.selectedRole = null;
    _authRerender();
  }, 700);
}

function _authResendMfa() {
  var st = window._authState;
  if (!st) return;
  st.mfaResent = true;
  st.error = null;
  _authRerender();
}

function _authSelectRole(key) {
  var st = window._authState;
  if (!st) return;
  st.selectedRole = key;
  _authRerender();
}

function _authEnterWorkspace() {
  var st = window._authState;
  if (!st || !st.selectedRole || st.loading) return;
  st.loading = true;
  _authRerender();
  setTimeout(function() {
    var selectedRole = st.selectedRole;

    // Зберегти сесію у localStorage
    _setSession({
      authenticated: true,
      user_id: 'DEMO-USER_ID-001',
      user_name: 'Олена Коваленко',
      user_email: 'demo@f1ops.com',
      active_role: selectedRole,
      login_at: new Date().toISOString()
    });

    // Скинути стан auth flow
    window._authState = { step: 'login', error: null, loading: false, selectedRole: null, mfaResent: false, attempts: 0 };

    // Зняти fullscreen auth mode
    _updateAuthMode();

    // Перевірити чи є збережений redirect
    var redirect = '';
    try { redirect = sessionStorage.getItem('f1_redirect_after_login') || ''; sessionStorage.removeItem('f1_redirect_after_login'); } catch(e) {}

    // Перемикаємо роль у topbar і переходимо до workspace (або redirect)
    _persistRole(selectedRole);
    if (redirect && redirect !== '#/shared/auth' && redirect !== '#' && redirect !== '') {
      navigate(redirect);
    } else {
      navigate('#/roles/' + selectedRole + '/workspace');
    }
  }, 600);
}

function _authBackToLogin() {
  window._authState = { step: 'login', error: null, loading: false, selectedRole: null, mfaResent: false, attempts: 0 };
  // Якщо хеш не на auth — навігуємо туди (для випадку logout)
  if (window.location.hash !== '#/shared/auth') {
    navigate('#/shared/auth');
  } else {
    _authRerender();
  }
}

// ─── Logout ───
function _authLogout() {
  _clearSession();
  window._authState = { step: 'login', error: null, loading: false, selectedRole: null, mfaResent: false, attempts: 0 };
  _updateAuthMode();
  navigate('#/shared/auth');
}

// ─── Profile Dropdown ───
function _updateProfileButton() {
  var wrap = document.getElementById('profileDropdownWrap');
  if (!wrap) return;
  var session = _getSession();
  if (session && session.authenticated) {
    // Показати ініціали замість іконки
    var initials = (session.user_name || 'U').split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2);
    wrap.innerHTML =
      '<button class="topbar-btn profile-btn" aria-label="Профіль користувача" title="' + (session.user_name || 'Профіль') + '" onclick="toggleProfileDropdown(event)">' +
        '<span class="profile-initials">' + initials + '</span>' +
      '</button>' +
      '<div class="profile-dropdown" id="profileDropdown">' +
        '<div class="profile-dropdown-header">' +
          '<div class="profile-dropdown-name">' + (session.user_name || 'Користувач') + '</div>' +
          '<div class="profile-dropdown-email">' + (session.user_email || '') + '</div>' +
          (session.active_role ? '<div class="profile-dropdown-role">' + _roleLabelUa(session.active_role) + '</div>' : '') +
        '</div>' +
        '<div class="profile-dropdown-body">' +
          '<button class="profile-dropdown-item" onclick="navigate(\'#/shared/auth\');closeProfileDropdown();">🔐 Доступ і сесія</button>' +
          '<div class="profile-dropdown-divider"></div>' +
          '<button class="profile-dropdown-item danger" onclick="_authLogout()">🚪 Вийти з системи</button>' +
        '</div>' +
      '</div>';
  } else {
    wrap.innerHTML =
      '<button class="topbar-btn" aria-label="Увійти" title="Увійти" onclick="navigate(\'#/shared/auth\')">&#128100;</button>';
  }
}

function toggleProfileDropdown(e) {
  if (e) e.stopPropagation();
  var dd = document.getElementById('profileDropdown');
  if (!dd) return;
  dd.classList.toggle('open');
  // Закрити інші dropdowns
  closeNotifDropdown();
  var ihDd = document.getElementById('integrationDropdown');
  if (ihDd) ihDd.style.display = 'none';
}

function closeProfileDropdown() {
  var dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('open');
}

function _roleLabelUa(key) {
  var map = {
    'sales': 'Продажі',
    'air-logistics': 'Авіалогістика',
    'broker': 'Брокер',
    'road-logistics': 'Автологістика',
    'warehouse': 'Склад',
    'accounting': 'Бухгалтерія',
    'finance': 'Фінанси',
    'expeditor': 'Експедитор (Польща)',
    'ops-admin': 'Операційний адміністратор'
  };
  return map[key] || key;
}

function _authShowForgot() {
  var st = window._authState;
  if (!st) return;
  st.error = null;
  // Для демо просто показуємо info
  alert('Демо: лист для скидання пароля надіслано на demo@f1ops.com');
}

function _authDemoScenario(scenario) {
  var st = window._authState;
  if (!st) return;
  st.loading = false;
  st.mfaResent = false;
  st.selectedRole = null;

  switch (scenario) {
    case 'happy':
      st.step = 'login';
      st.error = null;
      st.attempts = 0;
      _authRerender();
      // Автоматично запускаємо логін через секунду
      setTimeout(function() { _authDoLogin(); }, 300);
      break;
    case 'wrong_password':
      st.step = 'login';
      st.attempts = 2;
      st.error = 'Невірна е-пошта або пароль. Спроба 2 з 5.';
      _authRerender();
      break;
    case 'locked':
      st.step = 'login';
      st.attempts = 5;
      st.error = 'Занадто багато невдалих спроб. Обліковий запис тимчасово заблоковано. Спробуйте через 5 хвилин або зверніться до адміністратора.';
      _authRerender();
      break;
    case 'expired_session':
      st.step = 'session-expired';
      st.error = null;
      st.attempts = 0;
      _authRerender();
      break;
    case 'access_denied':
      st.step = 'access-denied';
      st.error = null;
      st.attempts = 0;
      _authRerender();
      break;
  }
}

// Підтримка Enter у формі логіну
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && window.location.hash === '#/shared/auth') {
    var st = window._authState;
    if (!st) return;
    if (st.step === 'login' && (document.activeElement.id === 'authEmail' || document.activeElement.id === 'authPassword')) {
      _authDoLogin();
    }
  }
});

// ─── Ініціалізація ───
document.addEventListener('DOMContentLoaded', function() {
  // Оновити auth mode класс на body
  _updateAuthMode();

  // Встановити початковий маршрут:
  // - якщо не автентифікований → auth
  // - якщо немає хешу → dashboard
  if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
    if (!_isAuthenticated()) {
      window.location.hash = '#/shared/auth';
    } else {
      window.location.hash = '#/shared/cases';
    }
  }

  // Початковий рендер
  handleRoute();

  // ─── Topbar: Integration Health Dots ───
  var ihContainer = document.getElementById('topbarIntegrationHealth');
  if (ihContainer && typeof INTEGRATION_HEALTH !== 'undefined') {
    ihContainer.innerHTML = C.topbarIntegrationDots(INTEGRATION_HEALTH) + C.integrationDropdown(INTEGRATION_HEALTH);
  }

  // Оновити бейдж сповіщень (число непрочитаних)
  var notifBadge = document.getElementById('notifBadge');
  if (notifBadge && typeof DATA !== 'undefined' && DATA.notifications) {
    var count = DATA.notifications.data.unread_count || 0;
    notifBadge.textContent = count > 0 ? count : '';
  }

  // Обробник глобального пошуку: Enter → перехід на кейси з пошуковим запитом
  var searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        // Передати пошуковий запит у стан списку кейсів
        if (!window._clState) window._clState = { search: '', view: 'all', filters: {}, sortCol: 'sla_state', sortDir: 'desc', page: 1, perPage: 10 };
        window._clState.search = q;
        window._clState.page = 1;
        navigate('#/shared/cases');
      }
    });
  }

  // Відновити збережену роль з localStorage перед першим рендером
  var roleSwitcher = document.getElementById('roleSwitcher');
  if (roleSwitcher) {
    var persisted = _getPersistedRole();
    if (persisted) {
      roleSwitcher.value = persisted;
    }
  }

  // ─── Profile dropdown: ініціалізація ───
  _updateProfileButton();
});
