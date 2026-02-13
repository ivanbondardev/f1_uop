/* =====================================================
   Спільні модулі Pages: SH-01..SH-08
   ===================================================== */

registerPages({

  // ─── SH-01 Доступ і сесія (інтерактивний сценарій входу) ───
  '#/shared/auth': function() {
    // Ініціалізуємо стан автентифікації
    if (typeof window._authState === 'undefined') {
      window._authState = { step: 'login', error: null, loading: false, selectedRole: null, mfaResent: false, attempts: 0 };
    }
    var st = window._authState;

    // ── Mock payload (SH-01 contract) ──
    var MOCK = {
      meta: {
        document_path: "shared/SH-01_auth_and_session.md",
        screen_id: "SH-01_auth_and_session",
        primary_route: "/api/v1/auth/login",
        primary_event: "SessionCreated",
        updated_at: "2026-02-12T09:00:00Z"
      },
      data: {
        demo_email: "demo@f1ops.com",
        demo_password: "demo1234",
        demo_mfa: "482901",
        user_display_name: "Олена Коваленко",
        user_id: "DEMO-USER_ID-001",
        available_roles: [
          { key: "sales",          icon: "💼", label: "Продажі",        tasks: 12 },
          { key: "air-logistics",  icon: "✈",  label: "Авіалогістика",  tasks: 8 },
          { key: "broker",         icon: "🛃", label: "Брокер",         tasks: 15 },
          { key: "road-logistics", icon: "🚚", label: "Автологістика",  tasks: 6 },
          { key: "warehouse",      icon: "🏭", label: "Склад",          tasks: 4 },
          { key: "accounting",     icon: "🧾", label: "Бухгалтерія",    tasks: 9 },
          { key: "finance",        icon: "💰", label: "Фінанси",        tasks: 7 },
          { key: "expeditor",      icon: "🏗",  label: "Експедитор (Польща)", tasks: 3 }
        ]
      },
      errors: []
    };

    // ── Stepper dots ──
    var steps = ['login', 'mfa', 'role'];
    var stepIdx = steps.indexOf(st.step === 'session-expired' || st.step === 'access-denied' ? 'login' : st.step);
    if (stepIdx < 0) stepIdx = 0;
    var stepper = '<div class="auth-stepper">' +
      steps.map(function(s, i) {
        var cls = i < stepIdx ? 'done' : (i === stepIdx ? 'active' : '');
        return '<div class="auth-step-dot ' + cls + '"></div>';
      }).join('') + '</div>';

    // ── Helper: error block ──
    function errBlock(msg) { return '<div class="auth-error">' + msg + '</div>'; }
    function infoBlock(msg) { return '<div class="auth-info">' + msg + '</div>'; }
    function successBlock(msg) { return '<div class="auth-success">' + msg + '</div>'; }

    // ── Render per step ──
    var cardHtml = '';

    // ===== STEP: LOGIN =====
    if (st.step === 'login') {
      cardHtml =
        '<div class="auth-card-logo">F1 <span>Операції</span></div>' +
        '<div class="auth-card-subtitle">Увійдіть у операційну платформу</div>' +
        stepper +
        (st.error ? errBlock(st.error) : '') +
        '<div class="form-group">' +
          '<label class="form-label">Е-пошта</label>' +
          '<input class="form-input" type="email" id="authEmail" placeholder="your@company.com" value="' + (MOCK.data.demo_email) + '" autocomplete="email">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Пароль</label>' +
          '<input class="form-input" type="password" id="authPassword" placeholder="Введіть пароль" value="demo1234">' +
        '</div>' +
        '<div class="btn-group" style="flex-direction:column;gap:10px">' +
          '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="_authDoLogin()" id="authLoginBtn">' +
            (st.loading ? '<span class="auth-spinner"></span> Перевірка…' : 'Увійти') +
          '</button>' +
        '</div>' +
        '<div class="auth-footer-link"><a href="#" onclick="_authShowForgot();return false;">Забули пароль?</a></div>' +
        '<div class="auth-divider">Демо-сценарії</div>' +
        '<div class="auth-session-cards">' +
          '<div class="auth-session-card" onclick="_authDemoScenario(\'happy\')">' +
            '<div class="session-icon">✅</div>' +
            '<div class="session-info"><div class="session-label">Успішний вхід</div>' +
            '<div class="session-detail">demo@f1ops.com / demo1234</div></div></div>' +
          '<div class="auth-session-card" onclick="_authDemoScenario(\'wrong_password\')">' +
            '<div class="session-icon">❌</div>' +
            '<div class="session-info"><div class="session-label">Невірний пароль</div>' +
            '<div class="session-detail">Показати помилку автентифікації</div></div></div>' +
          '<div class="auth-session-card" onclick="_authDemoScenario(\'locked\')">' +
            '<div class="session-icon">🔒</div>' +
            '<div class="session-info"><div class="session-label">Заблокований акаунт</div>' +
            '<div class="session-detail">Перевищено ліміт спроб</div></div></div>' +
          '<div class="auth-session-card" onclick="_authDemoScenario(\'expired_session\')">' +
            '<div class="session-icon">⏰</div>' +
            '<div class="session-info"><div class="session-label">Сесію завершено</div>' +
            '<div class="session-detail">Повторна автентифікація</div></div></div>' +
          '<div class="auth-session-card" onclick="_authDemoScenario(\'access_denied\')">' +
            '<div class="session-icon">🚫</div>' +
            '<div class="session-info"><div class="session-label">Доступ заборонено</div>' +
            '<div class="session-detail">Немає необхідної ролі</div></div></div>' +
        '</div>';
    }

    // ===== STEP: MFA =====
    else if (st.step === 'mfa') {
      cardHtml =
        '<div class="auth-card-logo">F1 <span>Операції</span></div>' +
        '<div class="auth-card-subtitle">Двофакторна перевірка</div>' +
        stepper +
        (st.error ? errBlock(st.error) : '') +
        (st.mfaResent ? successBlock('Новий код надіслано на ' + MOCK.data.demo_email) : '') +
        infoBlock('Код підтвердження надіслано на <strong>' + MOCK.data.demo_email + '</strong>. Демо-код: <code>' + MOCK.data.demo_mfa + '</code>') +
        '<div class="auth-mfa-code-row">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa0" oninput="_authMfaAdvance(this,0)" onkeydown="_authMfaKeydown(event,0)">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa1" oninput="_authMfaAdvance(this,1)" onkeydown="_authMfaKeydown(event,1)">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa2" oninput="_authMfaAdvance(this,2)" onkeydown="_authMfaKeydown(event,2)">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa3" oninput="_authMfaAdvance(this,3)" onkeydown="_authMfaKeydown(event,3)">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa4" oninput="_authMfaAdvance(this,4)" onkeydown="_authMfaKeydown(event,4)">' +
          '<input class="auth-mfa-digit" type="text" maxlength="1" id="mfa5" oninput="_authMfaAdvance(this,5)" onkeydown="_authMfaKeydown(event,5)">' +
        '</div>' +
        '<div class="btn-group" style="flex-direction:column;gap:10px">' +
          '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="_authVerifyMfa()" id="authMfaBtn">' +
            (st.loading ? '<span class="auth-spinner"></span> Перевірка…' : 'Підтвердити') +
          '</button>' +
          '<button class="btn btn-ghost" style="width:100%;justify-content:center" onclick="_authResendMfa()">Надіслати код повторно</button>' +
        '</div>' +
        '<div class="auth-footer-link"><a href="#" onclick="_authBackToLogin();return false;">← Повернутись до входу</a></div>';
    }

    // ===== STEP: ROLE SELECTION =====
    else if (st.step === 'role') {
      var roles = MOCK.data.available_roles;
      cardHtml =
        '<div class="auth-card-logo">F1 <span>Операції</span></div>' +
        '<div class="auth-card-subtitle">Вітаємо, ' + MOCK.data.user_display_name + '!</div>' +
        stepper +
        successBlock('Автентифікацію пройдено. Оберіть активну роль для початку роботи.') +
        '<div class="auth-role-grid">' +
          roles.map(function(r) {
            var sel = st.selectedRole === r.key ? ' selected' : '';
            return '<div class="auth-role-option' + sel + '" onclick="_authSelectRole(\'' + r.key + '\')">' +
              '<span class="role-icon">' + r.icon + '</span>' +
              '<div class="role-name">' + r.label + '</div>' +
              '<div class="role-count">' + r.tasks + ' задач у черзі</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<button class="btn btn-primary' + (!st.selectedRole ? ' disabled' : '') + '" style="width:100%;justify-content:center" onclick="_authEnterWorkspace()" id="authEnterBtn" ' + (!st.selectedRole ? 'disabled' : '') + '>' +
          (st.loading ? '<span class="auth-spinner"></span> Завантаження…' : 'Перейти до робочого простору') +
        '</button>';
    }

    // ===== STEP: SESSION EXPIRED =====
    else if (st.step === 'session-expired') {
      cardHtml =
        '<div class="auth-card-logo">F1 <span>Операції</span></div>' +
        '<div class="auth-card-subtitle">Сесію завершено</div>' +
        stepper +
        '<div style="text-align:center;margin-bottom:20px;font-size:36px">⏰</div>' +
        errBlock('Вашу сесію завершено через неактивність (30 хвилин). Дані збережено — авторизуйтесь повторно для продовження роботи.') +
        '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="_authBackToLogin()">Увійти знову</button>' +
        '<div class="auth-footer-link" style="margin-top:12px">Остання активність: ' + new Date().toLocaleTimeString('uk-UA') + '</div>';
    }

    // ===== STEP: ACCESS DENIED =====
    else if (st.step === 'access-denied') {
      cardHtml =
        '<div class="auth-card-logo">F1 <span>Операції</span></div>' +
        '<div class="auth-card-subtitle">Доступ заборонено</div>' +
        stepper +
        '<div style="text-align:center;margin-bottom:20px;font-size:36px">🚫</div>' +
        errBlock('У вас немає ролі <strong>Фінанси</strong> для доступу до екрану <em>Шлюз видачі</em>. Зверніться до операційного адміністратора для отримання доступу.') +
        '<div class="btn-group" style="flex-direction:column;gap:10px">' +
          '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="_authBackToLogin()">Повернутись до входу</button>' +
          '<button class="btn btn-secondary" style="width:100%;justify-content:center" onclick="_authBackToLogin()">Запросити доступ</button>' +
        '</div>';
    }

    // ── After DOM render: focus first MFA input ──
    setTimeout(function() {
      if (st.step === 'mfa') {
        var el = document.getElementById('mfa0');
        if (el) el.focus();
      }
      if (st.step === 'login') {
        var el = document.getElementById('authEmail');
        if (el) el.focus();
      }
    }, 80);

    return C.pageHeader('Доступ і сесія', 'SH-01 — Безпечний вхід і керування сесіями') +
      C.heroNotice('Автентифікація та сесії',
        '<strong>Інтерактивний демо-сценарій входу.</strong> Пройдіть покроковий флоу: введення облікових даних → MFA-верифікація → вибір ролі → перехід до робочого простору.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> ви працювали з 1С, email та месенджерами окремо. Не було єдиного входу для всіх операційних інструментів.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> один вхід — одна система. Після автентифікації ви бачите свій рольовий workspace із задачами, чергами та SLA. Якщо у вас кілька ролей — можна перемикати активну роль без повторного входу.<br><br>' +
        '<strong>Демо-дані:</strong> е-пошта <code>demo@f1ops.com</code>, пароль <code>demo1234</code>, MFA-код <code>482901</code>. Або скористайтесь демо-сценаріями під формою.') +
      '<div class="auth-flow-wrap"><div class="auth-card">' + cardHtml + '</div></div>';
  },

  // ─── SH-02 Кейси (інтерактивний) ───
  '#/shared/cases': function() {
    // Ініціалізація стану (зберігається між переходами)
    if (!window._clState) {
      window._clState = { search: '', view: 'all', filters: {}, sortCol: 'sla_state', sortDir: 'desc', page: 1, perPage: 10 };
    }
    var st = window._clState;

    // Побудова Shell HTML з контейнерами для динамічного оновлення
    var html = C.pageHeader('Список і пошук кейсів', 'SH-02 — Швидкий доступ до кейсів по ролі та контексту') +

      C.heroNotice('Єдиний операційний реєстр кейсів F1',
        '<strong>Для всіх ролей.</strong> Єдиний список усіх кейсів із фільтрами за роллю, SLA, етапом і пріоритетом. Замінює email як основний спосіб навігації по роботі.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> щоб знайти кейс, ви шукали в email по номеру AWB, CMR або назві клієнта. Не було єдиного місця зі списком усіх кейсів і їх поточним станом.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> один глобальний пошук за будь-яким ідентифікатором. Saved views: «Моя черга», «SLA під ризиком», «З винятками». Швидкі дії прямо з рядка.') +

      C.notice('Інтерактивний демо-режим',
        'Пошук, фільтри, сортування, пагінація та saved views — повністю функціональні. Натисніть на рядок кейсу для переходу до картки. Зміна ролі-власника або пріоритету доступна через іконки дій і фіксується в audit trail. Кнопка «Очистити фільтри» скидає всі активні критерії.') +

      // Search
      '<div class="search-bar" id="cl-search-wrap">' +
        '<span class="search-bar-icon">🔍</span>' +
        '<input class="search-bar-input" id="cl-search" type="text" placeholder="Пошук: номер кейсу, AWB, CMR, номер рахунку, назва клієнта…" autocomplete="off" value="' + (st.search || '') + '">' +
        '<span class="search-bar-hint text-muted text-sm">case_no · AWB · CMR · invoice · клієнт · ticket_id · document_id · work_item_id</span>' +
      '</div>' +

      // Saved Views (dynamic container)
      '<div id="cl-views"></div>' +

      // Filters (dynamic container)
      '<div id="cl-filters"></div>' +

      // Sort / count info
      '<div id="cl-sort-info"></div>' +

      // Table (dynamic container)
      '<div id="cl-table"></div>' +

      // Pagination (dynamic container)
      '<div id="cl-pagination"></div>' +

      // Modals
      C.modal('assign-role', 'Призначити роль-власника',
        C.formGroup('Кейс', '<span class="font-mono" id="cl-modal-case-no"></span>') +
        C.formGroup('Нова роль', C.formSelect(['Брокер', 'Автологістика', 'Авіалогістика', 'Склад', 'Бухгалтерія', 'Фінанси', 'Операційний адміністратор'])) +
        C.formGroup('Причина', C.formInput('Вкажіть причину зміни…')) +
        '<p class="text-sm text-muted mt-8">Ця дія буде записана в audit trail з вашим ідентифікатором та причиною.</p>',
        C.btn('Підтвердити', 'btn-primary', 'onclick="_clModalConfirm(\'assign-role\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'assign-role\')"')
      ) +
      C.modal('change-priority', 'Змінити пріоритет',
        C.formGroup('Кейс', '<span class="font-mono" id="cl-modal-case-no-pri"></span>') +
        C.formGroup('Новий пріоритет', C.formSelect(['Низький', 'Звичайний', 'Середній', 'Високий'])) +
        C.formGroup('Причина', C.formInput('Вкажіть причину зміни…')) +
        '<p class="text-sm text-muted mt-8">Ця дія буде записана в audit trail з вашим ідентифікатором та причиною.</p>',
        C.btn('Підтвердити', 'btn-primary', 'onclick="_clModalConfirm(\'change-priority\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'change-priority\')"')
      );

    // Після рендеру DOM — ініціалізувати інтерактивність
    setTimeout(_clInit, 60);

    return html;
  },

  // ─── SH-03 Timeline ───
  '#/shared/timeline': function() {
    const d = DATA.caseDetail.data;
    return C.pageHeader(`Кейс ${d.case_no}`, `${d.client} — ${d.stage}`) +
      C.heroNotice('Картка кейсу та хронологія',
        '<strong>Для всіх ролей.</strong> Повна історія кейсу в одному місці: переходи статусів, задачі, документи, винятки, фінансові рішення. Єдине джерело істини.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> історію кейсу ви відновлювали з email-листування різних колег, записок у 1С та месенджерах. Хто і коли змінив стан кейсу — часто було незрозуміло. При ескалації доводилось запитувати хронологію в кількох людей.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> усі події кейсу (зміни стану, задачі, документи, рішення, handover, gate) у єдиній хронології з фільтром за типом. Кожна подія має актора, час, reason_code. Зовнішні посилання (Zammad ticket, Mayan document, Plane task) прив\'язані до кейсу.') +

      `<div class="flex gap-16 mb-16 flex-wrap">
        <div>${C.slaBadge(d.sla)}</div>
        <div>${C.currentStateBadge(d.current_state)}</div>
        <div>${C.caseStatusBadge(d.case_status)}</div>
        <div>${C.priorityBadge(d.priority)}</div>
        <div class="text-sm text-muted">AWB: <span class="font-mono">${d.awb}</span></div>
        <div class="text-sm text-muted">CMR: <span class="font-mono">${d.cmr}</span></div>
      </div>` +

      C.tabs([
        { id: 'summary', label: 'Зведення' },
        { id: 'timeline', label: 'Хронологія' },
        { id: 'flow', label: 'Сценарій' },
        { id: 'conversation', label: 'Комунікація' },
        { id: 'tasks', label: 'Завдання' },
        { id: 'docs', label: 'Документи' },
        { id: 'exceptions', label: 'Винятки' },
        { id: 'gate', label: 'Фінансовий шлюз' },
      ], 1) +

      C.tabContent('summary', `
        <div class="card-grid">
          <div class="card">
            <div class="card-title">Інформація про кейс</div>
            <div class="doc-meta-row"><span class="doc-meta-label">Походження</span><span class="doc-meta-value">${d.origin}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Призначення</span><span class="doc-meta-value">${d.destination}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.weight_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.pieces}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Створено</span><span class="doc-meta-value">${d.created_at}</span></div>
          </div>
          <div class="card">
            <div class="card-title">Контакти</div>
            <div class="doc-meta-row"><span class="doc-meta-label">Клієнт</span><span class="doc-meta-value">${d.contacts.client_contact}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Агент</span><span class="doc-meta-value">${d.contacts.agent}</span></div>
          </div>
        </div>
        <h3 class="text-sm font-bold mt-16 mb-8">Зовнішні посилання (External References)</h3>
        ${C.table(
          ['Система', 'Тип', 'Зовнішній ID', 'Прив\'язано'],
          d.external_refs.map(r => [
            C.sourceSystemBadge(r.system), r.entity_type,
            '<span class="font-mono text-sm">' + r.external_id + '</span>', r.linked_at
          ])
        )}
      `) +

      C.tabContent('timeline',
        C.filtersBar([
          { label: 'Усі', active: true }, { label: 'Зміни статусу' },
          { label: 'Завдання' }, { label: 'Документи' }, { label: 'Винятки' },
          { label: 'Рішення' },
          { label: 'Zammad' }, { label: 'Mayan' }, { label: 'Plane' },
        ]) +
        C.timeline(d.timeline.map(e => ({
          ...e,
          message: e.message + (e.source_system && e.source_system !== 'f1_core' ? ' ' + C.sourceSystemBadge(e.source_system) : '')
        }))),
        true
      ) +

      C.tabContent('flow', renderFlowTab(d.scenario_type)) +

      C.tabContent('conversation', (() => {
        // ── Inline SA-04 conversation for this case ──
        var comm = DATA.sales.data.communication.base;
        var caseNo = d.case_no;
        var health = comm.sync_health;
        var matchingThread = null;
        var cd = null;
        for (var i = 0; i < comm.threads.length; i++) {
          if (comm.threads[i].case_no === caseNo) {
            matchingThread = comm.threads[i];
            cd = comm.conversation_details[matchingThread.id] || null;
            break;
          }
        }
        if (!cd) {
          return '<div class="text-center text-muted" style="padding:32px;">Немає привʼязаного треду комунікації для цього кейсу.</div>';
        }
        var html = '';

        // Sync health + ticket reference
        html += '<div class="flex items-center gap-8 mb-12">' +
          '<span class="badge-status ' + (health.state === 'connected' ? 'done' : 'blocked') + '">' +
            (health.state === 'connected' ? '✓ Zammad підключено' : '⚠ Zammad: ' + health.state) + '</span>' +
          '<span class="text-sm text-muted">ticket_id: <span class="font-mono">' + cd.ticket_id + '</span></span>' +
        '</div>';

        html += C.sectionNotice('Комунікація (SA-04)',
          'Тред прив\'язаний до кейсу через ticket_id. UI працює через FastAPI proxy, без прямого доступу до Zammad API. ' +
          'Критичні комерційні рішення мають бути відображені в timeline, не тільки в note.');

        // ── Articles ──
        html += '<h3 class="text-sm font-bold mb-8">Повідомлення (' + cd.articles.length + ')</h3>';
        cd.articles.forEach(function(a) {
          var isInternal = a.visibility === 'internal';
          html += '<div class="card mb-8" style="border-left:3px solid ' + (isInternal ? '#e8a735' : 'var(--accent)') + '; padding:10px 12px;">' +
            '<div class="flex justify-between items-center" style="margin-bottom:4px;">' +
              '<div>' +
                '<span class="font-bold text-sm">' + a.actor + '</span> ' +
                C.visibilityBadge(a.visibility) +
                ' <span class="text-muted" style="font-size:11px;">' + a.channel + '</span>' +
              '</div>' +
              '<span class="text-muted" style="font-size:11px;">' + a.timestamp + '</span>' +
            '</div>' +
            '<div class="text-sm">' + a.summary + '</div>' +
            (a.attachment_refs && a.attachment_refs.length > 0 ? '<div class="text-muted" style="font-size:11px; margin-top:4px;">📎 ' + a.attachment_refs.join(', ') + '</div>' : '') +
            '<div class="flex gap-8" style="margin-top:6px;">' +
              '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 6px;">📌 Комітмент</button>' +
              '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 6px;">📋 Follow-up</button>' +
            '</div>' +
          '</div>';
        });

        // ── Commitments ──
        if (cd.commitments.length > 0) {
          html += '<h3 class="text-sm font-bold mt-16 mb-8">Комітменти (' + cd.commitments.length + ')</h3>';
          html += C.table(
            ['ID', 'Текст', 'Зафіксував', 'Час', 'Статус'],
            cd.commitments.map(function(c) { return [
              '<span class="font-mono text-sm">' + c.id + '</span>',
              c.text, c.pinned_by, c.pinned_at, C.statusBadge(c.status)
            ]; })
          );
        }

        // ── Composer ──
        html += '<div class="card mt-16" style="background:var(--surface-secondary);">' +
          '<div class="flex gap-8 mb-8">' +
            '<button class="btn btn-sm btn-primary">📧 Зовнішня відповідь</button>' +
            '<button class="btn btn-sm btn-secondary">📝 Внутрішня нотатка</button>' +
          '</div>' +
          '<textarea class="form-input" rows="2" placeholder="Введіть текст відповіді…" readonly style="resize:none; font-size:12px;"></textarea>' +
          '<div class="flex justify-between items-center mt-8">' +
            '<span class="text-sm text-muted">📎 Вкладення</span>' +
            '<div class="btn-group">' +
              '<button class="btn btn-sm btn-ghost">📋 Шаблон</button>' +
              '<button class="btn btn-sm btn-primary">Надіслати</button>' +
            '</div>' +
          '</div>' +
        '</div>';

        // Link to full SA-04 experience
        html += '<div class="mt-12 text-center">' +
          C.link('#/roles/sales/communication', '↗ Відкрити повний інтерфейс комунікації (SA-04) — треди, шаблони, сценарії') +
        '</div>';

        return html;
      })()) +

      C.tabContent('tasks', `<p class="text-secondary">Завдання цього кейсу: ${C.link('#/shared/tasks', 'Переглянути в модулі завдань →')}</p>`) +
      C.tabContent('docs', (() => {
        const docs = DATA.documents.data;
        return C.sectionNotice('Документи кейсу (SH-05)',
            'Центральне сховище документів кейсу з моделлю пакет/версія. Одна підтверджена версія на пакет. ' +
            'Завантаження, підтвердження та AI-екстракція полів — усе в одному місці. ' +
            'Впевненість нижче 70% автоматично створює виняток low_confidence_extraction і запускає поглиблену верифікацію.') +

          C.section('Пакети документів (' + d.case_no + ')') +
          C.table(
            ['Пакет ID', 'Тип', 'Версія', 'Статус', 'Верифікація', 'Впевненість AI', 'Джерело', 'Зовнішній ID', 'Завантажив', 'Дата'],
            docs.packets.map(p => [
              '<span class="font-mono text-sm">' + p.packet_id + '</span>',
              p.doc_type, 'v' + p.current_version,
              C.statusBadge(p.approval_state),
              C.verificationModeBadge(p.verification_mode),
              C.confidenceBadge(p.extraction_confidence),
              C.sourceSystemBadge(p.source_system),
              p.external_document_id ? '<span class="font-mono text-sm">' + p.external_document_id + '</span>' : '<span class="text-muted">—</span>',
              p.uploaded_by, p.uploaded_at,
            ])
          ) +

          C.section('Історія версій (CMR)') +
          C.table(
            ['Пакет', 'Версія', 'Статус', 'Завантажив', 'Дата', 'Примітка'],
            docs.version_history.map(v => [
              '<span class="font-mono text-sm">' + v.packet_id + '</span>',
              'v' + v.version, C.statusBadge(v.status),
              v.uploaded_by, v.uploaded_at, v.note,
            ])
          ) +

          C.section('Автоматизація документів') +
          '<div class="card-grid">' +
            '<div class="card" style="border-left:3px solid var(--accent);">' +
              '<div style="font-weight:600; font-size:13px; margin-bottom:4px;">📄 Генерація CMR-чернетки</div>' +
              '<div class="text-sm text-secondary mb-8">Автоматичне створення чернетки CMR з даних інвойсу та кейсу.</div>' +
              C.btn('Згенерувати CMR-чернетку', 'btn-sm btn-secondary') +
            '</div>' +
            '<div class="card" style="border-left:3px solid var(--accent);">' +
              '<div style="font-weight:600; font-size:13px; margin-bottom:4px;">🏥 Авто-перевірка медичного реєстру</div>' +
              '<div class="text-sm text-secondary mb-8">Перевірка відповідності продукції записам медичного реєстру.</div>' +
              C.btn('Запустити перевірку', 'btn-sm btn-secondary') +
            '</div>' +
          '</div>' +

          C.section('Помилки (демо)') +
          '<div class="card" style="border-left:4px solid var(--danger); margin-bottom:8px;">' +
            '<div class="card-title text-danger" style="font-size:13px;">Невідповідність медичного реєстру</div>' +
            '<p class="text-sm text-secondary">Виявлено розбіжність між кодом продукту та записом медичного реєстру. Потрібна ручна верифікація перед затвердженням.</p>' +
          '</div>' +

          C.actionBar('Дії з документами', [
            { label: 'Завантажити нову версію', cls: 'btn-primary' },
            { label: 'Підтвердити', cls: 'btn-primary' },
            { label: 'Згенерувати CMR-чернетку', cls: 'btn-secondary' },
            { label: 'Перевірка мед. реєстру', cls: 'btn-secondary' },
            { label: 'Завантажити', cls: 'btn-secondary' },
            { label: 'Sync з Mayan EDMS', cls: 'btn-secondary' },
            { label: 'Відкрити зовнішнє джерело', cls: 'btn-ghost' },
          ]);
      })()) +
      C.tabContent('exceptions', `<p class="text-secondary">Винятки: ${C.link('#/shared/exceptions', 'Переглянути в модулі винятків →')}</p>`) +
      C.tabContent('gate', `<p class="text-secondary">Фінансовий шлюз: ${C.link('#/roles/finance/gate', 'Переглянути контроль шлюзу видачі →')}</p>`);
  },

  // ─── SH-04 Завдання та SLA ───
  '#/shared/tasks': function() {
    const d = DATA.tasks.data;
    const td = d.task_detail;
    const bq = d.breach_queue;
    const kpi = d.kpi;

    // Унікальні значення для фільтрів
    const taskTypes = [...new Set(d.items.map(t => t.task_type))];
    const ownerRoles = [...new Set(d.items.map(t => t.owner_role))];
    const statuses = [...new Set(d.items.map(t => t.status))];

    // Хелпер: бейдж ескалації
    function escalationBadge(s) {
      if (!s || s === 'not_escalated') return '<span class="badge-status">—</span>';
      const cls = s === 'L2' ? 'danger' : (s === 'L1' ? 'warning' : '');
      return '<span class="badge-severity ' + (s === 'L2' ? 'high' : (s === 'L1' ? 'medium' : 'low')) + '">' + s + '</span>';
    }

    // Хелпер: SLA таймер (демо — обчислення відносно поточного часу)
    function slaTimer(dueAt, status) {
      if (status === 'done' || status === 'cancelled') return '<span class="text-muted text-sm">—</span>';
      var due = new Date(dueAt.replace(' ', 'T') + ':00');
      var now = new Date('2026-02-11T12:00:00');
      var diff = due - now;
      if (diff <= 0) return '<span class="text-danger font-bold text-sm">Прострочено</span>';
      var hours = Math.floor(diff / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      if (hours < 4) return '<span class="text-warning font-bold text-sm">' + hours + ' год ' + mins + ' хв</span>';
      return '<span class="text-sm">' + hours + ' год ' + mins + ' хв</span>';
    }

    return C.pageHeader('Завдання та SLA', 'SH-04 — Управління задачами з прозорим SLA') +

      // ── Page-level hero-notice ──
      C.heroNotice('Модуль задач і SLA',
        '<strong>Для всіх ролей.</strong> Формалізовані задачі з прозорими дедлайнами, SLA-станами та автоматичними ескалаціями. Кожна задача має lifecycle, SLA-таймер і прив\'язку до кейсу.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> завдання передавались усно, email або в месенджерах. Дедлайни не контролювались системою. Ескалації відбувались ad-hoc, коли хтось помічав проблему. Не було способу побачити всі задачі команди з їх пріоритетами.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> кожна задача рухається по lifecycle (open → in_progress → done) з видимим SLA-таймером. Breached-задачі автоматично ескалюються (L1 → L2 → L3). Перепризначення, скасування, ескалація — завжди з reason_code і audit trail. Режим АРМ фокусує на «next best action» для поточної зміни.') +

      // ── Stat Cards ──
      C.statCards([
        { value: d.counters.active_tasks, label: 'Активні завдання', color: 'accent' },
        { value: d.counters.at_risk_tasks, label: 'Під ризиком', color: 'warning' },
        { value: d.counters.breached_tasks, label: 'Порушено SLA', color: 'danger' },
        { value: d.counters.done_today, label: 'Завершено сьогодні', color: 'success' },
      ]) +

      // ── Tabs: Role Inbox / Task Details / Breach Queue ──
      C.tabs([
        { id: 'role-inbox', label: 'Черга задач' },
        { id: 'task-detail', label: 'Деталі задачі' },
        { id: 'breach-queue', label: 'Черга порушень' },
      ], 0) +

      // ═══════════════════════════════════════
      // TAB 1: Role Inbox
      // ═══════════════════════════════════════
      C.tabContent('role-inbox',

        // ARM Mode indicator (docs/20)
        '<div class="card mb-12" style="border-left:3px solid var(--accent);">' +
          '<div class="flex justify-between items-center">' +
            '<div><span class="text-sm font-bold">Режим АРМ</span> <span class="text-sm text-muted">· Фокус на «next best action» для поточної зміни</span></div>' +
            '<div>' + C.statusBadge('active') + '</div>' +
          '</div>' +
        '</div>' +

        // Saved Views
        C.savedViews([
          { id: 'all', label: 'Усі завдання', icon: '📋', count: d.counters.active_tasks },
          { id: 'overdue', label: 'Прострочені', icon: '🔴', count: d.counters.breached_tasks },
          { id: 'at_risk', label: 'Під ризиком', icon: '⚠', count: d.counters.at_risk_tasks },
          { id: 'my_role', label: 'Моя роль', icon: '👤', count: 3 },
          { id: 'arm_next_action', label: 'АРМ: Next Action', icon: '🎯', count: 4 },
        ], 'all') +

        // Filter Dropdowns
        C.filterDropdowns([
          { label: 'Тип задачі', options: [{ label: 'Усі типи', selected: true }, ...taskTypes.map(t => ({ label: C.typeLabel(t) }))] },
          { label: 'Роль-власник', options: [{ label: 'Усі ролі', selected: true }, ...ownerRoles.map(r => ({ label: r }))] },
          { label: 'Статус', options: [{ label: 'Усі статуси', selected: true }, ...statuses.map(s => ({ label: C.statusBadge(s).replace(/<[^>]+>/g, '') }))] },
          { label: 'SLA', options: [{ label: 'Усі', selected: true }, { label: 'В нормі' }, { label: 'Під ризиком' }, { label: 'Порушено' }] },
        ]) +

        // Sort info
        '<div class="flex justify-between items-center mb-8">' +
          '<div class="text-sm text-muted">' +
            'Сортування: ' + C.sortIndicator('SLA стан') + ' → ' + C.sortIndicator('Пріоритет') + ' → ' + C.sortIndicator('Дедлайн') +
          '</div>' +
        '</div>' +

        // Main Table
        C.table(
          ['ID', 'Кейс', 'Тип', 'Назва', 'Відповідальний', 'SLA таймер', 'Термін', 'Статус', 'SLA', 'Пріоритет', 'Джерело', 'Ескалація', 'Дії'],
          d.items.map(function(t) { return [
            '<span class="font-mono text-sm">' + t.id + '</span>',
            C.caseLink(t.case_no),
            C.typeLabel(t.task_type),
            t.title + (t.blocked_by.length > 0 ? ' <span class="badge-severity medium" title="Блокери: ' + t.blocked_by.join(', ') + '">🔒 ' + t.blocked_by.length + '</span>' : ''),
            t.owner_role + ' — ' + t.owner_user,
            slaTimer(t.due_at, t.status),
            t.due_at,
            C.statusBadge(t.status),
            C.slaBadge(t.sla_state),
            C.priorityBadge(t.priority),
            C.sourceSystemBadge(t.source_system) + (t.external_task_id ? ' <span class="font-mono text-sm">' + t.external_task_id + '</span>' : ''),
            escalationBadge(t.escalation_status),
            '<div class="quick-actions-row">' +
              '<button class="btn btn-ghost btn-sm" onclick="openModal(\'task-start\')" title="Розпочати">▶</button>' +
              '<button class="btn btn-ghost btn-sm" onclick="openModal(\'task-complete\')" title="Завершити">✓</button>' +
              '<button class="btn btn-ghost btn-sm" onclick="openModal(\'task-reassign\')" title="Перепризначити">👤</button>' +
              '<button class="btn btn-ghost btn-sm" onclick="openModal(\'task-escalate\')" title="Ескалювати">⬆</button>' +
              (t.external_task_id ? '<button class="btn btn-ghost btn-sm" title="Sync зовнішнього стану (Plane)">🔄</button>' : '') +
            '</div>'
          ]; })
        ) +

        // Action Bar
        C.actionBar('Дії із завданнями', [
          { label: 'Призначити', cls: 'btn-secondary', onclick: "openModal('task-assign')" },
          { label: 'Перепризначити', cls: 'btn-secondary', onclick: "openModal('task-reassign')" },
          { label: 'Розпочати', cls: 'btn-primary', onclick: "openModal('task-start')" },
          { label: 'Завершити', cls: 'btn-primary', onclick: "openModal('task-complete')" },
          { label: 'Скасувати', cls: 'btn-ghost', onclick: "openModal('task-cancel')" },
          { label: 'Ескалювати', cls: 'btn-danger', onclick: "openModal('task-escalate')" },
        ]) +

        // Section: Lifecycle notice (critical)
        C.sectionHeroNotice('Lifecycle задачі та обмеження переходів',
          'Задача рухається: open → in_progress → done. Скасування (cancelled) можливе тільки з reason. Повторне відкриття (reopen) зі стану done — explicit action з аудитом. Неможливо скасувати breached задачу без аудиту причини.') +
        C.sectionNotice('Правила переходів',
          'open → in_progress: звичайний перехід. in_progress → done: завершення (блокується якщо є відкриті blockers). open|in_progress → cancelled: тільки з reason_code (TASK_CANCEL_REASON_REQUIRED). done → reopen: audit required (TASK_ALREADY_COMPLETED).'),

        true // active tab
      ) +

      // ═══════════════════════════════════════
      // TAB 2: Task Details
      // ═══════════════════════════════════════
      C.tabContent('task-detail',

        C.sectionHeroNotice('Деталі задачі: ' + td.id,
          'Повний контекст задачі з prerequisite-чеклістом, блокерами та action log. Кожна критична дія (зміна відповідального, статусу, пріоритету) фіксується з actor/time/reason.') +
        C.sectionNotice('Зв\'язки',
          'Задача прив\'язана до кейсу ' + td.case_no + '. Перехід до повної картки кейсу: SH-03. Ескалація переходить до SH-06.') +

        // Task header info
        '<div class="card mb-16">' +
          '<div class="card-header"><span class="card-title">' + td.title + '</span>' + C.slaBadge(td.sla_state) + ' ' + C.priorityBadge(td.priority) + ' ' + escalationBadge(td.escalation_status) + '</div>' +
          '<div class="card-grid">' +
            '<div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">ID задачі</span><span class="doc-meta-value font-mono">' + td.id + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">' + C.caseLink(td.case_no) + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Тип</span><span class="doc-meta-value">' + C.typeLabel(td.task_type) + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">' + C.statusBadge(td.status) + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Дедлайн</span><span class="doc-meta-value">' + td.due_at + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">SLA таймер</span><span class="doc-meta-value">' + slaTimer(td.due_at, td.status) + '</span></div>' +
            '</div>' +
            '<div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Відповідальна роль</span><span class="doc-meta-value">' + td.owner_role + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Відповідальний</span><span class="doc-meta-value">' + td.owner_user + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Блокери</span><span class="doc-meta-value">' + (td.blocked_by.length > 0 ? td.blocked_by.map(function(b) { return '<span class="badge-severity medium">' + b + '</span>'; }).join(' ') : '<span class="text-muted">Немає</span>') + '</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Case context
        C.section('Контекст кейсу') +
        '<div class="card mb-16">' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Клієнт</span><span class="doc-meta-value">' + td.case_context.client + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Етап</span><span class="doc-meta-value">' + td.case_context.stage + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Очікувана сума</span><span class="doc-meta-value">' + td.case_context.expected_amount + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Отримано</span><span class="doc-meta-value">' + td.case_context.received_amount + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Недоплата</span><span class="doc-meta-value text-danger font-bold">' + td.case_context.shortfall + '</span></div>' +
          '<div class="mt-8">' + C.link('#/shared/timeline', 'Відкрити повну картку кейсу →') + '</div>' +
        '</div>' +

        // Prerequisites checklist
        C.section('Prerequisite-чекліст') +
        C.checklist(td.prerequisites) +

        // Action Log
        C.section('Журнал дій') +
        '<div class="table-wrap"><table>' +
          '<thead><tr><th>Час</th><th>Актор</th><th>Дія</th><th>Причина</th><th>Код</th></tr></thead>' +
          '<tbody>' + td.action_log.map(function(a) {
            return '<tr>' +
              '<td class="text-sm text-muted">' + a.ts + '</td>' +
              '<td>' + a.actor + '</td>' +
              '<td>' + a.action + '</td>' +
              '<td class="text-sm">' + a.reason + '</td>' +
              '<td><span class="text-sm" title="' + a.reason_code + '">' + C.reasonCodeLabel(a.reason_code) + '</span></td>' +
            '</tr>';
          }).join('') +
          '</tbody>' +
        '</table></div>' +

        // Action bar for task details
        C.actionBar('Дії із задачею ' + td.id, [
          { label: 'Розпочати', cls: 'btn-primary', onclick: "openModal('task-start')" },
          { label: 'Перепризначити', cls: 'btn-secondary', onclick: "openModal('task-reassign')" },
          { label: 'Ескалювати', cls: 'btn-danger', onclick: "openModal('task-escalate')" },
          { label: 'Скасувати', cls: 'btn-ghost', onclick: "openModal('task-cancel')" },
        ])
      ) +

      // ═══════════════════════════════════════
      // TAB 3: Breach Queue
      // ═══════════════════════════════════════
      C.tabContent('breach-queue',

        C.sectionHeroNotice('Черга порушень SLA',
          'Усі задачі зі sla_state=breached. Кожна має статус ескалації, відповідального за next action і resolution_eta. Критична секція — кожне порушення потребує негайної реакції для уникнення фінансових/митних втрат.') +
        C.sectionNotice('Ескалаційна модель',
          'L1 — ескалація на керівника підрозділу. L2 — ескалація на керівника операцій. L3 — ескалація на директора. Кожна ескалація має reason_code, escalated_at і resolution_eta.') +

        // Breach queue table
        C.table(
          ['ID', 'Кейс', 'Назва', 'Відповідальний', 'Дедлайн', 'Рівень ескалації', 'Ескалація на', 'Причина ескалації', 'Ескальовано', 'ETA вирішення'],
          bq.map(function(t) { return [
            '<span class="font-mono text-sm">' + t.id + '</span>',
            C.caseLink(t.case_no),
            t.title,
            t.owner_role + ' — ' + t.owner_user,
            '<span class="text-danger">' + t.due_at + '</span>',
            '<span class="badge-severity ' + (t.escalation_level === 'L2' ? 'high' : 'medium') + '">' + t.escalation_level + '</span>',
            t.escalated_to_role,
            '<span class="text-sm">' + t.escalation_reason + '</span>',
            t.escalated_at,
            t.resolution_eta
          ]; })
        ) +

        C.actionBar('Дії з порушеннями', [
          { label: 'Ескалювати далі', cls: 'btn-danger', onclick: "openModal('task-escalate')" },
          { label: 'Перепризначити', cls: 'btn-secondary', onclick: "openModal('task-reassign')" },
          { label: 'Відкрити виняток', cls: 'btn-secondary', onclick: "navigate('#/shared/exceptions')" },
        ])
      ) +

      // ═══════════════════════════════════════
      // KPI Section
      // ═══════════════════════════════════════
      C.section('KPI модуля задач') +
      C.statCards([
        { value: kpi.median_task_completion_time_hours + ' год', label: 'Медіанний час завершення', color: 'accent' },
        { value: kpi.reopen_rate, label: 'Частка reopens', color: '' },
        { value: kpi.mean_time_to_acknowledge_breach_minutes + ' хв', label: 'Час реакції на breach', color: 'warning' },
        { value: kpi.time_to_first_action_minutes + ' хв', label: 'Час до першої дії', color: 'accent' },
      ]) +

      C.section('Порушення SLA за ролями') +
      C.table(
        ['Роль', 'Частка порушень'],
        kpi.breach_rate_per_role.map(function(r) { return [
          r.role,
          '<strong class="' + (parseFloat(r.rate) > 5 ? 'text-danger' : '') + '">' + r.rate + '</strong>'
        ]; })
      ) +

      // ═══════════════════════════════════════
      // Audit trail demo
      // ═══════════════════════════════════════
      C.section('Останні аудит-записи (демо)') +
      C.auditMeta('Фінанси — Лариса П.', 'Ескалація L1: SLA порушено, очікується доплата', '2026-02-11 09:00', 'SLA_BREACHED') +
      '<div class="mt-8">' +
      C.auditMeta('Система', 'SLA стан → breached (T-1199)', '2026-02-10 17:30', 'SLA_BREACH_AUTO') +
      '</div><div class="mt-8">' +
      C.auditMeta('Брокер — Дмитро С.', 'Перепризначення: T-1193 → Керівник операцій', '2026-02-11 12:00', 'TASK_REASSIGNED') +
      '</div>' +

      // ═══════════════════════════════════════
      // UI States Demo
      // ═══════════════════════════════════════
      C.section('Стани UI (демо)') +
      '<div class="ui-states-grid">' +
        '<div class="ui-state-demo">' +
          '<div class="ui-state-demo-label">Завантаження — Skeleton</div>' +
          C.skeleton(3, 7) +
        '</div>' +
        '<div class="ui-state-demo">' +
          '<div class="ui-state-demo-label">Порожньо — Немає результатів</div>' +
          C.emptyState('Завдань не знайдено', 'За поточним фільтром або рольовою чергою завдань немає.') +
          '<div class="mt-8 text-center"><button class="btn btn-secondary">Очистити фільтри</button></div>' +
        '</div>' +
        '<div class="ui-state-demo">' +
          '<div class="ui-state-demo-label">Помилка — Помилка завантаження</div>' +
          C.errorState('Помилка завантаження завдань', 'Не вдалося завантажити чергу задач або SLA-метадані. Перевірте з\'єднання.') +
        '</div>' +
        '<div class="ui-state-demo">' +
          '<div class="ui-state-demo-label">Заборонено — Доступ заборонено</div>' +
          C.forbiddenState('Операційний адміністратор') +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════
      // Крайні випадки
      // ═══════════════════════════════════════
      C.section('Крайні випадки (демо)') +
      C.sectionHeroNotice('Граничні сценарії SH-04',
        'Демонстрація поведінки модуля при нестандартних ситуаціях: зміна SLA під час перегляду, паралельне перепризначення, завершення з відкритим блокером, role switch, втрата зв\'язку.') +
      C.sectionNotice('Припущення',
        'У PoC-фазі edge cases демонструються статично. Реальна реактивність і live-оновлення рядків реалізуються на наступному етапі.') +
      '<div class="card-grid">' +
        '<div class="card">' +
          '<div class="card-title">Задача стала breached під час перегляду</div>' +
          '<p class="text-sm text-secondary">Рядок T-1200 оновлюється inline: SLA badge змінюється з «Під ризиком» на «Порушено», з\'являється prompt для ескалації.</p>' +
        '</div>' +
        '<div class="card">' +
          '<div class="card-title">Паралельне перепризначення</div>' +
          '<p class="text-sm text-secondary">Два оператори одночасно перепризначають T-1199. Другий отримує conflict-відповідь (HTTP 409) і пропозицію refresh стану.</p>' +
        '</div>' +
        '<div class="card">' +
          '<div class="card-title">done без закритого blocker</div>' +
          '<p class="text-sm text-secondary">Спроба завершити T-1199 блокується: prerequisite «100% суми оплачено» не виконано. Код помилки: INVALID_TASK_TRANSITION.</p>' +
        '</div>' +
        '<div class="card">' +
          '<div class="card-title">Role switch у відкритій черзі</div>' +
          '<p class="text-sm text-secondary">Перемикання ролі з «Фінанси» на «Брокер» перевалідовує scope задач. Задачі Фінансів зникають, з\'являються задачі Брокера.</p>' +
        '</div>' +
        '<div class="card">' +
          '<div class="card-title">Втрата зв\'язку під час complete</div>' +
          '<p class="text-sm text-secondary">Оптимістичний апдейт статусу відкочується. Користувач отримує явний error з пропозицією повторити дію.</p>' +
        '</div>' +
      '</div>' +

      // ═══════════════════════════════════════
      // Modals
      // ═══════════════════════════════════════
      C.modal('task-assign', 'Призначити задачу',
        C.formGroup('Роль-власник', C.formSelect(['Брокер', 'Автологістика', 'Авіалогістика', 'Склад', 'Бухгалтерія', 'Фінанси', 'Продажі'])) +
        C.formGroup('Відповідальний', C.formSelect(['Дмитро С.', 'Андрій К.', 'Марія Л.', 'Лариса П.', 'Тетяна В.', 'Оксана М.', 'Віктор Г.'])) +
        '<p class="text-sm text-muted mt-8">Ця дія буде записана в audit trail.</p>',
        C.btn('Призначити', 'btn-primary', 'onclick="closeModal(\'task-assign\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'task-assign\')"')
      ) +

      C.modal('task-reassign', 'Перепризначити задачу',
        C.formGroup('Нова роль', C.formSelect(['Брокер', 'Автологістика', 'Авіалогістика', 'Склад', 'Бухгалтерія', 'Фінанси', 'Продажі'])) +
        C.formGroup('Новий відповідальний', C.formSelect(['Дмитро С.', 'Андрій К.', 'Марія Л.', 'Лариса П.', 'Тетяна В.', 'Оксана М.', 'Віктор Г.'])) +
        C.formGroup('Причина перепризначення', C.formInput('Вкажіть причину…')) +
        '<p class="text-sm text-muted mt-8">⚠ Критична дія — причина обов\'язкова. Запис у audit trail.</p>',
        C.btn('Перепризначити', 'btn-primary', 'onclick="closeModal(\'task-reassign\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'task-reassign\')"')
      ) +

      C.modal('task-start', 'Розпочати задачу',
        '<p>Задача перейде у статус <strong>in_progress</strong>.</p>' +
        '<p class="text-sm text-muted mt-8">Перехід буде зафіксовано в action log.</p>',
        C.btn('Розпочати', 'btn-primary', 'onclick="closeModal(\'task-start\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'task-start\')"')
      ) +

      C.modal('task-complete', 'Завершити задачу',
        '<p>Задача перейде у статус <strong>done</strong>.</p>' +
        '<p class="text-sm text-warning mt-8">⚠ Після завершення задачу не можна редагувати. Повторне відкриття потребує explicit reopen з аудитом.</p>' +
        '<p class="text-sm text-muted mt-8">Перехід буде заблоковано, якщо є невиконані prerequisites.</p>',
        C.btn('Завершити', 'btn-primary', 'onclick="closeModal(\'task-complete\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'task-complete\')"')
      ) +

      C.modal('task-cancel', 'Скасувати задачу',
        C.formGroup('Причина скасування', C.formInput('Обов\'язкове поле — вкажіть причину…')) +
        '<p class="text-sm text-danger mt-8">⚠ Скасування breached задачі без аудиту причини заборонено. Код: TASK_CANCEL_REASON_REQUIRED.</p>',
        C.btn('Скасувати задачу', 'btn-danger', 'onclick="closeModal(\'task-cancel\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'task-cancel\')"')
      ) +

      C.modal('task-escalate', 'Ескалювати задачу',
        C.formGroup('Рівень ескалації', C.formSelect(['L1 — Керівник підрозділу', 'L2 — Керівник операцій', 'L3 — Директор'])) +
        C.formGroup('Причина ескалації', C.formInput('Обов\'язкове поле — вкажіть причину…')) +
        C.formGroup('Очікуваний час вирішення', C.formInput('РРРР-ММ-ДД ГГ:ХХ', '2026-02-12 09:00')) +
        '<p class="text-sm text-muted mt-8">Ескалація створить audit/event запис з причиною. Код: TASK_ESCALATION_REASON_REQUIRED.</p>',
        C.btn('Ескалювати', 'btn-danger', 'onclick="closeModal(\'task-escalate\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'task-escalate\')"')
      );
  },

  // ─── SH-05 Документи (redirect → вкладка «Документи» в кейсі) ───
  '#/shared/documents': function() {
    navigateToTab('#/shared/timeline', 'docs');
    return '<p class="text-secondary p-24">Перенаправлення на вкладку «Документи» кейсу…</p>';
  },

  // ─── SH-06 Винятки ───
  '#/shared/exceptions': function() {
    const d = DATA.exceptions.data;
    return C.pageHeader('Винятки та ескалації', 'SH-06 — Керування відхиленнями') +
      C.heroNotice('Виняткові ситуації',
        '<strong>Для всіх ролей.</strong> Структурований потік для керування винятками: часткове прибуття, розбіжність ваги, митне утримання, платіжний виняток.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> виняткові ситуації вирішувались через email-ланцюги між ролями. Хто відповідальний, який дедлайн — визначалось ситуативно. Однакові проблеми вирішувались по-різному кожного разу.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> кожен виняток має тип, severity, owner-role і SLA на response. Ескалація з reason_code та адресатом з політики. Таймер до наступної ескалації завжди видимий. Повторювані першопричини — в аналітиці для системного покращення.') +

      C.filtersBar([
        { label: 'Усі', active: true },
        { label: 'Відкрито' }, { label: 'Висока критичність' }, { label: 'Моя роль' },
      ]) +

      C.table(
        ['ID', 'Кейс', 'Тип', 'Критичність', 'Статус', 'Відповідальний', 'Відкрито', 'SLA відповідь'],
        d.items.map(e => [
          `<span class="font-mono text-sm">${e.id}</span>`,
          C.caseLink(e.case_no),
          `<span>${C.typeLabel(e.type)}</span>`,
          C.severityBadge(e.severity),
          C.statusBadge(e.status),
          e.owner_role,
          e.opened_at,
          e.sla_response,
        ])
      ) +

      C.section('Деталі винятку: EX-301') +
      `<div class="card">
        <div class="card-header"><span class="card-title">Платіжний виняток</span>${C.severityBadge('high')}</div>
        <p>${d.items[0].description}</p>
        <div class="mt-12">${C.link('#/flows/payment-exception', 'Переглянути повний сценарій платіжного винятку →')}</div>
      </div>` +

      C.actionBar('Дії з винятками', [
        { label: 'Призначити відповідального' },
        { label: 'Додати підтвердження', cls: 'btn-secondary' },
        { label: 'Вирішити', cls: 'btn-primary' },
        { label: 'Ескалювати', cls: 'btn-danger' },
      ]);
  },

  // ─── SH-07 Усі сповіщення (повний архів, доступний через dropdown → "Усі сповіщення") ───
  '#/shared/notifications': function() {
    const d = DATA.notifications.data;

    // Фільтри
    const filterTypes = [
      { label: 'Усі', active: true },
      { label: 'Непрочитані', active: false },
      { label: 'Задачі', active: false },
      { label: 'SLA', active: false },
      { label: 'Approval', active: false },
      { label: 'Передачі', active: false },
      { label: 'Єдиний ввід', active: false }
    ];

    return C.pageHeader('Усі сповіщення', 'SH-07 — Архів структурованих сповіщень') +

      C.notice('Навігація',
        'Ця сторінка показує повний архів сповіщень. Для швидкого перегляду останніх сповіщень — використовуйте іконку 🔔 у верхній панелі.') +

      C.statCards([
        { value: d.unread_count, label: 'Непрочитаних', color: 'accent' },
        { value: d.items.length, label: 'Усього', color: '' },
        { value: d.items.filter(function(n) { return n.approval_id; }).length, label: 'Approval', color: 'warning' },
        { value: d.items.filter(function(n) { return n.type && n.type.indexOf('handover') >= 0; }).length, label: 'Передачі', color: '' }
      ]) +

      C.filtersBar(filterTypes) +

      d.items.map(function(n) {
        var link = '#/shared/timeline';
        if (n.approval_id) link = '#/shared/approval-detail';
        else if (n.type && n.type.indexOf('handover') >= 0) link = '#/shared/handover-board';
        else if (n.type && n.type.indexOf('single_entry') >= 0) link = '#/shared/accounting-single-entry';

        return '<div class="card" style="' + (!n.read ? 'border-left: 3px solid var(--accent);' : '') + '">' +
          '<div class="flex justify-between items-center">' +
            '<div>' +
              '<div class="card-title" style="font-size:13px">' + n.title + '</div>' +
              '<div class="text-sm text-muted">' + n.time + ' · ' + C.typeLabel(n.type) +
                (n.approval_type ? ' · ' + C.approvalTypeBadge(n.approval_type) + ' ' + C.verificationModeBadge(n.verification_mode) : '') +
              '</div>' +
            '</div>' +
            '<div>' + C.link(link, 'Відкрити →') + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
  },

  // ─── SH-07 Налаштування сповіщень (окрема сторінка) ───
  '#/shared/notification-settings': function() {
    var allTypes = ['task_assigned','task_nearing_breach','task_breached','approval_decision_required','approval_sla_at_risk','approval_sla_breached','document_approval','exception_opened','gate_changed','handover_ack_required','handover_delivery_failed','single_entry_conflict','single_entry_synced','insurance_request_sent','insurance_confirmed','template_message_sent','template_message_failed','arrival_auto_synced','arrival_sync_failed'];

    return C.pageHeader('Налаштування сповіщень', 'SH-07 — Канали доставки та фільтри типів') +

      C.notice('Демо',
        'Налаштування каналів та типів сповіщень. У продакшені — збереження через API <code>PUT /api/v1/notification-settings</code>.') +

      C.section('Канали доставки') +
      '<div class="card" style="max-width:600px">' +
        '<div class="text-sm text-muted mb-8">Активні канали: <strong>у застосунку</strong> · <strong>електронною поштою</strong> · <strong>push mobile</strong></div>' +
        '<div class="checklist-item"><span class="check-icon checked">✓</span><span>У застосунку (in-app)</span></div>' +
        '<div class="checklist-item"><span class="check-icon checked">✓</span><span>Електронна пошта</span></div>' +
        '<div class="checklist-item"><span class="check-icon checked">✓</span><span>Push mobile</span></div>' +
      '</div>' +

      C.section('Типи сповіщень') +
      '<div class="card" style="max-width:600px">' +
        allTypes.map(function(t) {
          return '<div class="checklist-item"><span class="check-icon checked">✓</span><span>' + C.typeLabel(t) + '</span><span class="text-muted text-sm" style="margin-left:auto">у застосунку + e-mail + push</span></div>';
        }).join('') +
      '</div>' +

      C.section('Тихі години') +
      '<div class="card" style="max-width:600px">' +
        '<div class="text-sm text-muted mb-8">Email та push сповіщення не надсилаються у тихі години. In-app сповіщення доставляються завжди.</div>' +
        C.formGroup('Початок', C.formInput('22:00', '22:00')) +
        C.formGroup('Кінець', C.formInput('07:00', '07:00')) +
      '</div>';
  },

  // ─── SH-09 Рішення (Approvals Inbox) ───
  '#/shared/approvals': function() {
    const d = DATA.approvals.data;
    const ct = d.counters;

    return C.pageHeader('Рішення', 'SH-09 — Inbox рішень для HIGH/CRITICAL дій') +

      C.heroNotice('Inbox рішень',
        '<strong>Для ролей-затверджувачів (Керівник фінансів, Керівник складу, Брокер та ін.).</strong> Кожне критичне рішення (override шлюзу, авторизація видачі, затвердження інвойсу) проходить через цей inbox.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> критичні рішення приймались усно або листом без формального процесу. Не було snapshot того, що саме затверджувалось. При інцидентах було складно встановити, хто, коли і на якій підставі прийняв рішення.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> кожен запит має snapshot (що зміниться після затвердження), чекліст верифікації та panel рішення. Для DEEP-верифікації кнопка «Затвердити» заблокована до завершення обов\'язкових перевірок. Рішення незмінне, записується в timeline кейсу з actor/time/reason.') +

      C.statCards([
        { value: ct.pending, label: 'В очікуванні', color: 'warning' },
        { value: ct.breached_sla, label: 'Порушено SLA', color: 'danger' },
        { value: ct.approved_today, label: 'Затверджено сьогодні', color: 'success' },
        { value: ct.rejected_today, label: 'Відхилено сьогодні', color: '' },
      ]) +

      // Filters
      C.filtersBar([
        { label: 'В очікуванні', active: true },
        { label: 'Усі' },
        { label: 'Затверджено' },
        { label: 'Відхилено' },
        { label: 'Моя роль' },
      ]) +

      // Sorting
      '<div class="flex justify-between items-center mb-8">' +
        '<div class="text-sm text-muted">' +
          'Сортування: ' + C.sortIndicator('Ризик') + ' → ' + C.sortIndicator('SLA age') + ' → ' + C.sortIndicator('Тип') +
        '</div>' +
      '</div>' +

      // Inbox Table
      C.table(
        ['ID', 'Тип рішення', 'Кейс', 'Запитав', 'Верифікація', 'Роль-відповідальний', 'Ризик', 'SLA', 'Статус', 'Дії'],
        d.items.map(function(a) {
          return [
            '<span class="font-mono text-sm">' + a.id + '</span>',
            C.approvalTypeBadge(a.approval_type),
            C.caseLink(a.case_no),
            a.requested_by,
            C.verificationModeBadge(a.verification_mode),
            C.roleLabel(a.approver_role),
            C.severityBadge(a.risk),
            C.slaBadge(a.sla_state),
            C.approvalStatusBadge(a.status),
            a.status === 'pending'
              ? '<button class="btn btn-primary btn-sm" onclick="navigate(\'#/shared/approval-detail\')">Розглянути</button>'
              : '<button class="btn btn-ghost btn-sm" onclick="navigate(\'#/shared/approval-detail\')">Деталі</button>'
          ];
        })
      ) +

      // Gate Matrix Section
      C.section('Approval Gate Matrix (MVP)') +
      C.sectionHeroNotice('Матриця рішень',
        'Повний перелік типів рішень з роллю-власником, режимом верифікації та SLA. P0 — обов\'язкові для MVP, P1 — бажані.') +
      C.sectionNotice('Правила',
        'Для кожного типу рішення визначено: тригер, роль-затверджувач, backup-роль, режим верифікації та SLA на прийняття рішення.') +

      '<h3 class="text-sm font-bold mt-16 mb-8">P0 (обов\'язково)</h3>' +
      C.table(
        ['Тип', 'Тригер', 'Роль', 'Верифікація', 'SLA'],
        [
          [C.approvalTypeBadge('INVOICE_CAPTURE_APPROVAL'), 'OCR confidence low, конфлікт суми/валюти', C.roleLabel('ACCOUNTING'), C.verificationModeBadge('standard') + ' / ' + C.verificationModeBadge('deep'), '30 хв'],
          [C.approvalTypeBadge('MEDICAL_COMPLIANCE_APPROVAL'), 'Медична невідповідність / high risk', C.roleLabel('BROKER'), C.verificationModeBadge('deep'), '60 хв'],
          [C.approvalTypeBadge('FX_DECISION_APPROVAL'), 'FX rule override / disputed source', C.roleLabel('FINANCE'), C.verificationModeBadge('standard'), '30 хв'],
          [C.approvalTypeBadge('DOC_FINALIZATION_APPROVAL'), 'Фінальна версія CMR/TTN', C.roleLabel('ROAD_LOGISTICS / BROKER'), C.verificationModeBadge('standard'), '45 хв'],
          [C.approvalTypeBadge('PAYMENT_GATE_OVERRIDE_APPROVAL'), 'Manual FAIL → PASS', C.roleLabel('FINANCE_LEAD'), C.verificationModeBadge('deep'), '15 хв'],
          [C.approvalTypeBadge('RELEASE_AUTHORIZATION_APPROVAL'), 'Release/dispatch HIGH/CRITICAL', C.roleLabel('WAREHOUSE_LEAD'), C.verificationModeBadge('standard'), '15 хв'],
        ]
      ) +

      '<h3 class="text-sm font-bold mt-16 mb-8">P1 (бажано)</h3>' +
      C.table(
        ['Тип', 'Тригер', 'Роль', 'Верифікація', 'SLA'],
        [
          [C.approvalTypeBadge('INSURANCE_EXCEPTION_APPROVAL'), 'Insurance required, пакет missing', C.roleLabel('SALES_LEAD / OPS_LEAD'), C.verificationModeBadge('deep'), '60 хв'],
          [C.approvalTypeBadge('CUSTOMS_REFERENCE_OVERRIDE_APPROVAL'), 'Customs post override', C.roleLabel('BROKER_LEAD'), C.verificationModeBadge('standard'), '30 хв'],
          [C.approvalTypeBadge('RATE_OUTLIER_APPROVAL'), 'Route/carrier rate outlier', C.roleLabel('ROAD_LOGISTICS_LEAD'), C.verificationModeBadge('standard'), '45 хв'],
          [C.approvalTypeBadge('EXCEPTION_CLOSURE_APPROVAL'), 'Close critical exception', C.roleLabel('OPS_LEAD'), C.verificationModeBadge('standard'), '30 хв'],
        ]
      ) +

      // UI States
      C.section('Стани UI (демо)') +
      '<div class="ui-states-grid">' +
        '<div class="ui-state-demo">' +
          '<div class="ui-state-demo-label">Порожньо — Немає рішень</div>' +
          C.emptyState('Немає рішень в очікуванні', 'Усі approval-запити оброблені. Нових HIGH/CRITICAL рішень немає.') +
        '</div>' +
      '</div>';
  },

  // ─── SH-09 Approval Detail ───
  '#/shared/approval-detail': function() {
    var d = DATA.approvals.data.detail;
    var checklistRequired = d.checklist.filter(function(i) { return i.required !== false; });
    var checklistDone = checklistRequired.filter(function(i) { return i.done; }).length;
    var allChecklistDone = checklistDone >= checklistRequired.length;

    return C.pageHeader('Деталі рішення: ' + d.id, d.approval_type) +

      C.heroNotice('Деталі Approval-рішення',
        '<strong>Для ролі-затверджувача.</strong> Повний контекст запиту: snapshot, diff, linked context, чекліст верифікації та panel рішення.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> вас просили «підтвердити override» листом або усно. Контексту (на якій підставі, які дані, що зміниться) часто не було достатньо. Рішення не мало формального запису.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> snapshot запиту показує повні дані та що зміниться після approve. Linked context — пов\'язані документи, фінансові рішення, винятки. Чекліст верифікації (для DEEP-режиму — обов\'язковий). Можливість надіслати сигнал корекції замість відхилення. Рішення незмінне після прийняття.') +

      // Header card
      '<div class="card mb-16" style="border-left: 4px solid var(--danger)">' +
        '<div class="card-header">' +
          '<span class="card-title">' + C.approvalTypeBadge(d.approval_type) + '</span>' +
          C.approvalStatusBadge(d.status) + ' ' + C.slaBadge(d.sla_state) + ' ' + C.severityBadge(d.risk) +
        '</div>' +
        '<div class="card-grid">' +
          '<div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">' + C.caseLink(d.case_no) + ' — ' + d.client + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Запитав</span><span class="doc-meta-value">' + d.requested_by + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Час запиту</span><span class="doc-meta-value">' + d.requested_at + '</span></div>' +
          '</div>' +
          '<div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Роль-затверджувач</span><span class="doc-meta-value">' + C.roleLabel(d.approver_role) + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Backup-роль</span><span class="doc-meta-value">' + C.roleLabel(d.backup_role) + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Верифікація</span><span class="doc-meta-value">' + C.verificationModeBadge(d.verification_mode) + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">SLA дедлайн</span><span class="doc-meta-value text-danger font-bold">' + d.sla_deadline + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Snapshot diff
      C.section('Знімок запиту (що зміниться)') +
      C.sectionHeroNotice('Diff-огляд запиту',
        'Перегляд даних запиту та того, що зміниться у кейсі після затвердження. Перевірте кожне поле перед прийняттям рішення.') +
      C.sectionNotice('Незмінний знімок',
        'Знімок запиту незмінний після створення. Ваше рішення зберігається окремим знімком рішення.') +
      C.approvalSnapshotDiff(d.request_snapshot) +

      // Linked context
      C.section('Пов\'язаний контекст') +
      C.approvalLinkedContext(d.linked_context) +

      // Checklist
      C.section('Чекліст верифікації') +
      C.sectionHeroNotice('Верифікація перед рішенням',
        'Для режиму DEEP — обов\'язковий чекліст перевірок. Кнопка «Затвердити» недоступна до завершення усіх обов\'язкових пунктів. Це запобігає формальному штампуванню.') +
      C.sectionNotice('Режим верифікації: ' + d.verification_mode,
        d.verification_mode === 'deep' ? 'Поглиблена верифікація. Усі обов\'язкові пункти мають бути позначені перед затвердженням.' : 'Стандартна верифікація. Чекліст рекомендований, але не блокує затвердження.') +
      C.deepVerifyChecklist(d.checklist, d.verification_mode) +

      // Correction signal form
      C.section('Сигнал корекції') +
      C.correctionSignalForm() +

      // Decision footer
      C.section('Рішення') +
      C.decisionFooter(d.id, d.status, allChecklistDone) +

      // Decision history / timeline
      C.section('Історія рішення') +
      C.timeline(d.decision_history.map(function(e) {
        return {
          ts: e.ts,
          actor: e.actor,
          message: '<strong>' + e.event + '</strong>: ' + e.detail,
          detail: '<span class="text-sm text-muted">correlation_id: ' + e.correlation_id + '</span>',
          icon: e.event === 'ApprovalCreated' ? 'event-success' : ''
        };
      })) +

      // Modals
      C.modal('approval-approve', 'Затвердити рішення',
        '<p>Ви затверджуєте ' + C.approvalTypeBadge(d.approval_type) + ' для кейсу <strong>' + d.case_no + '</strong>.</p>' +
        '<p class="text-sm text-warning mt-8">⚠ Рішення незмінне після підтвердження.</p>' +
        C.formGroup('Коментар (необов\'язковий)', C.formInput('Додатковий коментар до рішення…')),
        C.btn('Затвердити', 'btn-primary', 'onclick="closeModal(\'approval-approve\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'approval-approve\')"')
      ) +

      C.modal('approval-reject', 'Відхилити рішення',
        '<p>Ви відхиляєте ' + C.approvalTypeBadge(d.approval_type) + ' для кейсу <strong>' + d.case_no + '</strong>.</p>' +
        C.formGroup('Код причини (обов\'язковий)', C.formSelect(['Недостатні підстави', 'Невірні дані', 'Потребує доопрацювання', 'Порушення політики', 'Інше'])) +
        C.formGroup('Коментар', C.formInput('Обов\'язково вкажіть деталі відхилення…')) +
        '<p class="text-sm text-danger mt-8">⚠ Відхилення незмінне. Код причини обов\'язковий.</p>',
        C.btn('Відхилити', 'btn-danger', 'onclick="closeModal(\'approval-reject\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'approval-reject\')"')
      ) +

      C.modal('approval-cancel', 'Скасувати запит',
        '<p>Ви скасовуєте запит ' + C.approvalTypeBadge(d.approval_type) + ' для кейсу <strong>' + d.case_no + '</strong>.</p>' +
        C.formGroup('Код причини (обов\'язковий)', C.formSelect(['Дублікат запиту', 'Помилковий запит', 'Контекст змінився', 'Інше'])) +
        C.formGroup('Коментар', C.formInput('Вкажіть причину скасування…')) +
        '<p class="text-sm text-danger mt-8">⚠ Скасування незмінне.</p>',
        C.btn('Скасувати запит', 'btn-danger', 'onclick="closeModal(\'approval-cancel\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'approval-cancel\')"')
      );
  },

  // ─── SH-10 Внутрішні передачі (Дошка передач) ───
  '#/shared/handover-board': function() {
    var d = DATA.handoverBoard.data;

    return C.pageHeader('Внутрішні передачі і контроль SLA', 'SH-10 — Дошка передач (P0: 2.3 Autoexchange)') +

      C.heroNotice('Внутрішні передачі і контроль SLA',
        '<strong>Для всіх ролей. P0 пріоритет (2.3).</strong> Внутрішній обмін документами і відповідальністю — як системний процес з явним SLA, каналом і підтвердженням прийому.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> передача кейсу між відділами (логістика → брокер, брокер → склад) відбувалась через email із вкладеннями. Отримувач не підтверджував прийом. Загублені передачі виявлялись лише при зриві строків. Не було даних: скільки передач було, скільки загубилось, який середній час реакції.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> кожна передача фіксується з from_role, to_role, каналом, SLA та explicit acknowledgement. Failed handover автоматично створює задачу. Якщо manual fallback замість system-managed — причина обов\'язкова. Метрики: system_managed_rate, avg_ack_time, failed_delivery_rate.') +

      // Counters
      C.statCards([
        { value: d.counters.pending_ack, label: 'Очікує підтвердження', color: 'warning' },
        { value: d.counters.at_risk, label: 'SLA під ризиком', color: 'warning' },
        { value: d.counters.breached, label: 'SLA порушено', color: 'danger' },
        { value: d.counters.total_today, label: 'Передач за сьогодні', color: 'accent' },
      ]) +

      // Channel split
      C.section('Розподіл каналів') +
      C.statStrip([
        { value: d.channel_split.internal, label: 'Внутрішній', color: 'accent' },
        { value: d.channel_split.external, label: 'Зовнішній' },
        { value: d.channel_split.mixed, label: 'Змішаний', color: 'warning' }
      ]) +

      // Autoexchange Health Strip
      C.section('Здоров\'я автообміну') +
      C.autoexchangeHealthStrip(d.health) +

      // Manual Fallback Alerts
      C.section('Ручні fallback-сповіщення') +
      C.sectionHeroNotice('Manual fallback',
        'Ці передачі виконані через ручний канал замість системного. Причина fallback обов\'язкова. Кожен fallback знижує метрику system-managed rate.') +
      C.sectionNotice('Дії',
        'Перевірте причину fallback. Якщо системний канал відновлено — повторіть передачу через system-managed.') +
      C.table(
        ['Кейс', 'Від', 'До', 'Причина fallback', 'Час'],
        d.manual_fallback_alerts.map(function(a) { return [
          C.caseLink(a.case_no), C.roleLabel(a.from_role), C.roleLabel(a.to_role),
          '<span class="text-warning text-sm">' + a.reason + '</span>', a.fallback_at
        ]; })
      ) +

      // Filters
      C.filtersBar([
        { label: 'Усі', active: true },
        { label: 'Очікує підтвердження' },
        { label: 'Під ризиком' },
        { label: 'Збій' },
        { label: 'Моя роль' },
      ]) +

      // Main Table
      C.section('Реєстр передач') +
      C.table(
        ['Кейс', 'Крок', 'Від', 'До', 'Канал', 'Тип каналу', 'Статус', 'SLA', 'Підтвердження', 'Джерело', 'Час'],
        d.items.map(function(h) { return [
          C.caseLink(h.case_no),
          '<span class="font-mono text-sm">' + h.step_code + '</span>',
          C.roleLabel(h.from_role),
          C.roleLabel(h.to_role),
          '<span class="font-mono text-sm">' + h.channel_code + '</span>',
          C.handoverChannelBadge(h.channel_type),
          C.handoverStatusBadge(h.status),
          C.slaBadge(h.sla_state),
          h.evidence_ref ? '<span class="font-mono text-sm">' + h.evidence_ref + '</span>' : '<span class="text-muted">—</span>',
          h.evidence_source ? C.sourceSystemBadge(h.evidence_source) + ' <span class="text-sm text-muted">' + (h.evidence_detail || '') + '</span>' : '<span class="text-muted">—</span>',
          h.happened_at
        ]; })
      ) +

      // Actions
      C.actionBar('Дії з передачами', [
        { label: 'Надіслати передачу', cls: 'btn-primary', onclick: "openModal('handover-send')" },
        { label: 'Підтвердити прийом', cls: 'btn-primary', onclick: "openModal('handover-ack')" },
        { label: 'Відхилити з причиною', cls: 'btn-danger', onclick: "openModal('handover-reject')" },
        { label: 'Ескалювати порушення', cls: 'btn-danger', onclick: "openModal('handover-escalate')" },
      ]) +

      // Failed Delivery Reasons
      C.section('Причини збоїв доставки') +
      C.sectionHeroNotice('Збої доставки передач',
        'Кожна failed передача автоматично створює задачу типу handover_delivery_failed. Необхідно з\'ясувати причину та перевідправити або ескалювати.') +
      C.sectionNotice('Автоматизація',
        'Задача створюється автоматично з прив\'язкою до кейсу та роль-отримувача. SLA на реакцію — 2 год.') +
      C.table(
        ['Кейс', 'Причина', 'Час збою', 'Створена задача'],
        d.failed_reasons.map(function(f) { return [
          C.caseLink(f.case_no),
          '<span class="text-danger text-sm">' + f.reason + '</span>',
          f.failed_at,
          '<span class="font-mono text-sm">' + f.task_created + '</span>'
        ]; })
      ) +

      // Modals
      C.modal('handover-send', 'Надіслати передачу',
        C.formGroup('Кейс', C.formInput('', 'F1-2026-00142')) +
        C.formGroup('До ролі', C.formSelect(['Брокер', 'Автологістика', 'Авіалогістика', 'Склад', 'Бухгалтерія', 'Фінанси', 'Експедитор'])) +
        C.formGroup('Канал', C.formSelect(['system-managed (за замовчуванням)', 'external (ручний)', 'mixed'])) +
        '<p class="text-sm text-muted mt-8">Передача буде зафіксована в timeline кейсу.</p>',
        C.btn('Надіслати', 'btn-primary', 'onclick="closeModal(\'handover-send\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'handover-send\')"')
      ) +

      C.modal('handover-ack', 'Підтвердити прийом передачі',
        '<p>Ви підтверджуєте отримання передачі.</p>' +
        '<p class="text-sm text-muted mt-8">Статус зміниться на «Отримано». Запис у audit trail.</p>',
        C.btn('Підтвердити', 'btn-primary', 'onclick="closeModal(\'handover-ack\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'handover-ack\')"')
      ) +

      C.modal('handover-reject', 'Відхилити передачу',
        C.formGroup('Причина відхилення', C.formInput('Обов\'язково вкажіть причину…')) +
        '<p class="text-sm text-danger mt-8">⚠ Відхилення створить задачу для відправника. Код причини обов\'язковий.</p>',
        C.btn('Відхилити', 'btn-danger', 'onclick="closeModal(\'handover-reject\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'handover-reject\')"')
      ) +

      C.modal('handover-escalate', 'Ескалювати порушення SLA',
        C.formGroup('Причина ескалації', C.formInput('Обов\'язково вкажіть причину…')) +
        '<p class="text-sm text-danger mt-8">⚠ Ескалація сповістить керівника підрозділу. Код причини обов\'язковий.</p>',
        C.btn('Ескалювати', 'btn-danger', 'onclick="closeModal(\'handover-escalate\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'handover-escalate\')"')
      );
  },

  // ─── SH-11 Єдиний ввід бухгалтерських даних ───
  '#/shared/accounting-single-entry': function() {
    var d = DATA.accountingSingleEntry.data;

    return C.pageHeader('Єдиний ввід бухгалтерських даних', 'SH-11 — Консоль єдиного вводу (P0: 2.1)') +

      C.heroNotice('Єдиний ввід бухгалтерських даних',
        '<strong>Для бухгалтерії та фінансів. P0 пріоритет (2.1).</strong> Усунення потрійного ручного вводу через єдиний capture реквізитів і їх перевикористання у всіх фінансових кроках.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> одні й ті самі реквізити (номер інвойсу, суми, контрагент) вводились тричі: при створенні довідки витрат, при рахунку клієнту, при рознесенні оплати. Кожен ввід — ризик помилки. Розбіжності між вводами виявлялись лише при звірці з 1С.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> ключові поля вводяться один раз і мають source_ref. Повторний ввід тих самих полів блокується або вимагає override з причиною. Первинне джерело — OCR + metadata з Document Hub. Конфлікти дублювання потрапляють у чергу для explicit resolve. Sync до 1С — лише для записів без конфліктів.') +

      // Counters
      C.statCards([
        { value: d.counters.coverage_rate, label: 'Покриття єдиним вводом', color: 'accent' },
        { value: d.counters.override_count, label: 'Ручних overrides', color: 'warning' },
        { value: d.counters.conflict_queue, label: 'Конфлікти в черзі', color: 'danger' },
        { value: d.counters.ready_to_sync, label: 'Готово до sync 1С', color: 'success' },
        { value: d.counters.triple_upload_eliminated_rate, label: 'Зниження потрійного вводу', color: 'accent' },
      ]) +

      // Conflict Panel
      C.section('Конфлікти дублювання') +
      C.sectionHeroNotice('Черга конфліктів',
        'Конфлікти виникають при спробі повторного введення вже зафіксованих даних з іншим значенням. Кожен конфлікт потребує explicit resolve або override з причиною.') +
      C.sectionNotice('Правила вирішення',
        'resolve — прийняти нове значення. override — залишити старе з обґрунтуванням. Обидві дії логуються в audit trail.') +
      C.duplicateEntryConflictPanel(d.conflicts) +

      // Filters
      C.filtersBar([
        { label: 'Усі', active: true },
        { label: 'Єдиний ввід' },
        { label: 'Ручний override' },
        { label: 'З конфліктами' },
        { label: 'Готово до sync' },
      ]) +

      // Main Table
      C.section('Реєстр записів') +
      C.table(
        ['Кейс', 'Документ', 'Група полів', 'Режим вводу', 'Джерело', 'Конфлікт', 'Оновив', 'Час', 'Дії'],
        d.items.map(function(e) { return [
          C.caseLink(e.case_no),
          '<span class="font-mono text-sm">' + e.document_ref + '</span>',
          C.typeLabel(e.field_group),
          C.singleEntrySourceBadge(e.entry_mode),
          '<span class="font-mono text-sm">' + e.source_ref + '</span>',
          C.conflictStatusBadge(e.conflict_status),
          e.last_updated_by,
          e.updated_at,
          C.reuseTo1CAction(e)
        ]; })
      ) +

      // Actions
      C.actionBar('Дії з записами', [
        { label: 'Capture single entry', cls: 'btn-primary', onclick: "openModal('se-capture')" },
        { label: 'Повторити поля в задачу', cls: 'btn-secondary' },
        { label: 'Resolve conflict', cls: 'btn-primary', onclick: "openModal('se-resolve')" },
        { label: 'Override with reason', cls: 'btn-danger', onclick: "openModal('se-override')" },
        { label: 'Sync to 1С', cls: 'btn-primary', onclick: "openModal('se-sync')" },
      ]) +

      // Modals
      C.modal('se-capture', 'Capture single entry',
        C.formGroup('Кейс', C.formInput('', 'F1-2026-00142')) +
        C.formGroup('Група полів', C.formSelect(['invoice', 'cost_certificate', 'counterparty'])) +
        C.formGroup('Джерело даних', C.formInput('Вкажіть source_ref…')) +
        '<p class="text-sm text-muted mt-8">Дані будуть зафіксовані як single_entry з унікальним source_ref.</p>',
        C.btn('Зафіксувати', 'btn-primary', 'onclick="closeModal(\'se-capture\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'se-capture\')"')
      ) +

      C.modal('se-resolve', 'Resolve conflict',
        '<p>Ви приймаєте нове значення та закриваєте конфлікт.</p>' +
        C.formGroup('Коментар', C.formInput('Вкажіть обґрунтування…')) +
        '<p class="text-sm text-muted mt-8">Конфлікт буде закрито. Запис в audit trail.</p>',
        C.btn('Прийняти нове значення', 'btn-primary', 'onclick="closeModal(\'se-resolve\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'se-resolve\')"')
      ) +

      C.modal('se-override', 'Override with reason',
        C.formGroup('Причина override', C.formInput('Обов\'язково вкажіть причину…')) +
        '<p class="text-sm text-danger mt-8">⚠ Override залишить поточне значення. Причина обов\'язкова. Запис в audit trail.</p>',
        C.btn('Override', 'btn-danger', 'onclick="closeModal(\'se-override\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'se-override\')"')
      ) +

      C.modal('se-sync', 'Sync to 1С',
        '<p>Ви ініціюєте синхронізацію записів з 1С.</p>' +
        '<p class="text-sm text-warning mt-8">⚠ Sync можливий лише для записів без активних конфліктів. Перевірте чергу конфліктів.</p>',
        C.btn('Синхронізувати', 'btn-primary', 'onclick="closeModal(\'se-sync\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'se-sync\')"')
      );
  },

  // (Shared Conversation page removed — conversation is now inline in case tab + full SA-04 at #/roles/sales/communication)

  // ─── SH-08 Звіти та аналітика ───
  '#/shared/reports': function() {
    var d = DATA.reports.data;
    var oo = d.operations_overview;
    var sla = d.sla_dashboard;
    var exc = d.exceptions_dashboard;
    var fg = d.finance_gate;
    var ue = d.user_expectations;
    var ai = d.ai_quality;
    var p0 = DATA.p0Efficiency.data;
    var ad = DATA.approvals.data.dashboard;
    var drill = '#/shared/cases';

    // ── Tab: Операційний огляд ──
    var tabOps =
      C.dashCardGrid([
        { value: oo.active_cases, label: 'Активні кейси', trend: oo.active_cases_trend, color: 'accent', drilldown: drill },
        { value: oo.at_risk, label: 'Під ризиком SLA', trend: oo.at_risk_trend, color: 'warning', drilldown: drill },
        { value: oo.breached, label: 'Порушено SLA', trend: oo.breached_trend, color: 'danger', drilldown: drill },
        { value: oo.release_waiting, label: 'Очікують видачу', trend: oo.release_waiting_trend, color: 'accent', drilldown: drill },
        { value: oo.completed_today, label: 'Завершено сьогодні', trend: oo.completed_today_trend, color: 'success' }
      ]) +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">📊</span> Розподіл активних кейсів</div>' +
        C.donutChart(oo.status_distribution, 'Усього', oo.active_cases) +
      '</div>';

    // ── Tab: SLA ──
    var tabSla =
      C.dashCardGrid([
        { value: sla.mean_response_hours + ' год', label: 'Середній час реакції', trend: sla.mean_response_trend, color: 'accent' },
        { value: sla.mean_resolve_hours + ' год', label: 'Середній час вирішення', trend: sla.mean_resolve_trend, color: 'warning' },
        { value: sla.total_breaches_30d, label: 'Порушень SLA (30 днів)', trend: sla.total_breaches_trend, color: 'danger', drilldown: drill }
      ]) +
      '<div class="dash-two-col">' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">📋</span> Порушення за етапами</div>' +
          C.horizontalBarChart(
            sla.breach_by_stage.map(function(r) { return { label: r.stage, value: r.count, drilldown: drill }; }),
            { max: 5, colorFn: function(v) { return v >= 3 ? 'danger' : (v >= 1 ? 'warning' : 'success'); } }
          ) +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">👥</span> Порушення за ролями</div>' +
          C.horizontalBarChart(
            sla.breach_by_role.map(function(r) { return { label: r.role, value: r.count, drilldown: drill }; }),
            { max: 5, colorFn: function(v) { return v >= 3 ? 'danger' : (v >= 1 ? 'warning' : 'success'); } }
          ) +
        '</div>' +
      '</div>';

    // ── Tab: Винятки ──
    var tabExc =
      C.dashCardGrid([
        { value: exc.total_open, label: 'Відкриті винятки', trend: exc.total_open_trend, color: 'warning', drilldown: '#/shared/exceptions' },
        { value: exc.mean_resolution_hours + ' год', label: 'Середній час вирішення', trend: exc.mean_resolution_trend, color: 'accent' }
      ]) +
      '<div class="dash-two-col">' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">⚠</span> Винятки за типами</div>' +
          C.horizontalBarChart(
            exc.by_type.map(function(r) { return { label: C.typeLabel(r.type), value: r.count, drilldown: '#/shared/exceptions' }; }),
            { max: 10, colorFn: function(v) { return v >= 6 ? 'danger' : (v >= 3 ? 'warning' : 'accent'); } }
          ) +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">🔄</span> Повторювані першопричини</div>' +
          C.horizontalBarChart(
            exc.repeat_root_causes.map(function(r) { return { label: r.cause, value: r.count }; }),
            { max: 5, colorFn: function() { return 'warning'; } }
          ) +
        '</div>' +
      '</div>';

    // ── Tab: Фінансовий шлюз ──
    var tabGate =
      C.dashCardGrid([
        { value: fg.blocked_partial_payment, label: 'Блок: часткова оплата', trend: fg.blocked_partial_trend, color: 'danger', drilldown: drill },
        { value: fg.blocked_missing_docs, label: 'Блок: відсутні документи', trend: fg.blocked_docs_trend, color: 'warning', drilldown: drill },
        { value: fg.gate_fail_count_30d, label: 'Блокувань (30 днів)', trend: fg.gate_fail_trend, color: 'danger' },
        { value: fg.total_gate_evaluations_30d, label: 'Усього оцінок (30 днів)', trend: fg.total_evals_trend, color: 'accent' }
      ]) +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">🔐</span> Розподіл результатів шлюзу (30 днів)</div>' +
        C.donutChart(fg.gate_distribution, 'Pass rate', fg.pass_rate_pct + '%') +
      '</div>';

    // ── Tab: Рішення (Approvals) ──
    var tabApprovals =
      C.sectionNotice('Операційна аналітика рішень',
        'Порушення SLA, медіанний час рішення, approve/reject ratio, deep/spot-check coverage. Дані для оцінки завантаження ролей і виявлення bottleneck.') +
      C.dashCardGrid([
        { value: ad.breached_sla_count, label: 'Порушено SLA', color: 'danger', drilldown: '#/shared/approvals' },
        { value: ad.median_time_to_decision_min + ' хв', label: 'Медіанний час рішення', color: 'accent' },
        { value: ad.approve_reject_ratio.approved + '% / ' + ad.approve_reject_ratio.rejected + '%', label: 'Затверджено / Відхилено', color: 'accent' },
        { value: ad.deep_coverage_rate, label: 'DEEP coverage', color: 'warning' },
        { value: ad.spot_check_rate, label: 'Spot-check rate', color: 'accent' }
      ]) +
      '<div class="dash-two-col">' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">📝</span> В очікуванні за типом</div>' +
          C.horizontalBarChart(
            ad.pending_by_type.map(function(r) { return { label: C.approvalTypeBadge(r.type), value: r.count, drilldown: '#/shared/approvals' }; }),
            { max: 3, colorFn: function(v) { return v > 0 ? 'warning' : 'success'; } }
          ) +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">👤</span> В очікуванні за роллю</div>' +
          C.horizontalBarChart(
            ad.pending_by_role.map(function(r) { return { label: C.roleLabel(r.role), value: r.count, drilldown: '#/shared/approvals' }; }),
            { max: 3, colorFn: function(v) { return v > 0 ? 'warning' : 'success'; } }
          ) +
        '</div>' +
      '</div>' +
      C.donutChart([
        { label: 'Затверджено', pct: ad.approve_reject_ratio.approved, color: 'success' },
        { label: 'Відхилено', pct: ad.approve_reject_ratio.rejected, color: 'danger' }
      ], 'Рішення', (ad.approve_reject_ratio.approved + ad.approve_reject_ratio.rejected) + '');

    // ── Tab: P0 Ефективність ──
    var tabP0 =
      C.sectionNotice('Ефективність P0 процесів',
        'Ключові метрики ROI: 2.3 Внутрішні передачі (автообмін) та 2.1 Єдиний ввід бухгалтерії.') +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">🔄</span> 2.3 Внутрішні передачі</div>' +
        C.dashCardGrid([
          { value: p0.handover_metrics.system_managed_rate, label: 'Системний канал', color: 'accent', drilldown: '#/shared/handover-board' },
          { value: p0.handover_metrics.manual_fallback_rate, label: 'Ручний fallback', color: 'warning' },
          { value: p0.handover_metrics.avg_ack_time_minutes + ' хв', label: 'Час підтвердження', color: 'accent' },
          { value: p0.handover_metrics.failed_delivery_rate, label: 'Збої доставки', color: 'danger' },
          { value: p0.handover_metrics.breached_sla_count, label: 'Порушені SLA', color: 'danger', drilldown: '#/shared/handover-board' }
        ]) +
      '</div>' +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">📊</span> 2.1 Єдиний ввід бухгалтерії</div>' +
        C.dashCardGrid([
          { value: p0.single_entry_metrics.coverage_rate, label: 'Покриття єдиним вводом', color: 'accent', drilldown: '#/shared/accounting-single-entry' },
          { value: p0.single_entry_metrics.override_rate, label: 'Частка override', color: 'warning' },
          { value: p0.single_entry_metrics.conflict_rate, label: 'Конфлікти', color: 'danger', drilldown: '#/shared/accounting-single-entry' },
          { value: p0.single_entry_metrics.sync_readiness_rate, label: 'Готовність sync 1С', color: 'accent' },
          { value: p0.single_entry_metrics.mean_resolution_minutes + ' хв', label: 'Час вирішення конфлікту', color: 'accent' }
        ]) +
      '</div>' +
      '<div class="card-grid mt-12">' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/shared/handover-board\')">' +
          '<div style="font-weight:600;">🔄 Дошка передач</div>' +
          '<div class="text-sm text-secondary">Переглянути всі передачі →</div>' +
        '</div>' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/shared/accounting-single-entry\')">' +
          '<div style="font-weight:600;">📊 Консоль єдиного вводу</div>' +
          '<div class="text-sm text-secondary">Переглянути єдиний ввід →</div>' +
        '</div>' +
      '</div>';

    // ── Tab: AI Якість ──
    var tabAI =
      C.sectionNotice('Якість AI-екстракції документів',
        'Точність автоматичної екстракції полів. Дані для калібрування порогів впевненості та виявлення проблемних типів документів.') +
      C.dashCardGrid([
        { value: ai.auto_accept_rate, label: 'Авто-підтвердження', trend: ai.auto_accept_trend, color: 'success' },
        { value: ai.low_confidence_frequency, label: 'Низька впевненість', trend: ai.low_conf_trend, color: 'warning' },
        { value: ai.mean_confidence_score, label: 'Середня впевненість', trend: ai.mean_conf_trend, color: 'accent' },
        { value: ai.low_confidence_threshold, label: 'Поріг (low)', color: 'accent' }
      ]) +
      '<div class="dash-two-col">' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">📄</span> Розподіл обробки документів</div>' +
          C.donutChart(ai.ai_distribution, 'Документи', ai.auto_accept_rate) +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-title"><span class="dash-icon">📈</span> Виправлення за типом документа</div>' +
          C.horizontalBarChart(
            ai.correction_rate_by_flow.map(function(r) { return { label: r.flow, value: r.rate_num }; }),
            { max: 15, colorFn: function(v) { return v > 10 ? 'danger' : (v > 7 ? 'warning' : 'success'); } }
          ) +
        '</div>' +
      '</div>' +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">🔧</span> Поля з найбільшою кількістю виправлень</div>' +
        C.table(['Поле', 'Виправлення', 'Усього', 'Частка'],
          ai.fields_most_corrected.map(function(f) { return [
            f.field,
            '<strong>' + f.corrections + '</strong>',
            f.total,
            '<strong class="' + (parseFloat(f.rate) > 7 ? 'text-danger' : (parseFloat(f.rate) > 5 ? 'text-warning' : '')) + '">' + f.rate + '</strong>'
          ]; })
        ) +
      '</div>';

    // ── Tab: Очікування користувачів ──
    var tabUE =
      C.sectionNotice('Відповідність очікуванням користувачів',
        'Прогрес реалізації ключових функцій з docs/20_user_expectations.md: автоматизація, синхронізація, мобільні дії, швидкість UI.') +
      C.dashCardGrid([
        { value: ue.insurance_auto_workflow_rate, label: 'Авто-workflow страхування', trend: ue.insurance_trend, color: 'accent' },
        { value: ue.template_message_usage_rate, label: 'Використання шаблонів', trend: ue.template_trend, color: 'accent' },
        { value: ue.arrival_auto_sync_rate, label: 'Авто-sync прибуттів', trend: ue.arrival_trend, color: 'success' },
        { value: ue.mobile_critical_action_usage, label: 'Мобільні критичні дії', trend: ue.mobile_trend, color: 'warning' },
        { value: ue.p95_ui_latency_desktop_ms + ' мс', label: 'P95 latency (desktop)', trend: ue.latency_desktop_trend, color: ue.p95_ui_latency_desktop_ms <= 2000 ? 'success' : 'warning' },
        { value: ue.p95_ui_latency_mobile_ms + ' мс', label: 'P95 latency (mobile)', trend: ue.latency_mobile_trend, color: ue.p95_ui_latency_mobile_ms <= 3000 ? 'success' : 'warning' }
      ]) +
      '<div class="dash-section">' +
        '<div class="dash-section-title"><span class="dash-icon">🎯</span> Прогрес відносно цільових показників</div>' +
        C.horizontalBarChart([
          { label: 'Страхування (ціль ' + ue.target_rates.insurance + ')', value: parseInt(ue.insurance_auto_workflow_rate) },
          { label: 'Шаблони (ціль ' + ue.target_rates.template + ')', value: parseInt(ue.template_message_usage_rate) },
          { label: 'Авто-sync (ціль ' + ue.target_rates.arrival + ')', value: parseInt(ue.arrival_auto_sync_rate) },
          { label: 'Мобільні дії (ціль ' + ue.target_rates.mobile + ')', value: parseInt(ue.mobile_critical_action_usage) }
        ], { max: 100, colorFn: function(v) { return v >= 80 ? 'success' : (v >= 50 ? 'accent' : 'warning'); } }) +
      '</div>';

    // ── Збираємо сторінку ──
    return C.pageHeader('Звіти та аналітика', 'SH-08 — Операційна прозорість') +
      C.heroNotice('Аналітичні панелі операційної прозорості',
        '<strong>Для керівників і операційного адміністратора.</strong> Дашборди в реальному часі: стан кейсів, SLA, тренди винятків, фінансовий шлюз, ефективність P0-процесів, якість AI, очікування користувачів.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> керівник збирав дані вручну, запитуючи кожний відділ. Аналітика з запізненням, на суб\'єктивних оцінках. Порівняння між ролями/етапами — неможливе.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> 8 тематичних дашбордів з drill-down до списку кейсів. Кожна метрика показує тренд відносно попереднього періоду.') +
      C.periodFilter(['Сьогодні', 'Тиждень', 'Місяць', 'Квартал'], 1) +
      C.tabs([
        { id: 'rpt-ops', label: '📋 Огляд' },
        { id: 'rpt-sla', label: '⏱ SLA' },
        { id: 'rpt-exc', label: '⚠ Винятки' },
        { id: 'rpt-gate', label: '🔐 Шлюз' },
        { id: 'rpt-appr', label: '✅ Рішення' },
        { id: 'rpt-p0', label: '🎯 P0' },
        { id: 'rpt-ai', label: '🤖 AI' },
        { id: 'rpt-ue', label: '👤 Очікування' }
      ], 0) +
      C.tabContent('rpt-ops', tabOps, true) +
      C.tabContent('rpt-sla', tabSla) +
      C.tabContent('rpt-exc', tabExc) +
      C.tabContent('rpt-gate', tabGate) +
      C.tabContent('rpt-appr', tabApprovals) +
      C.tabContent('rpt-p0', tabP0) +
      C.tabContent('rpt-ai', tabAI) +
      C.tabContent('rpt-ue', tabUE);
  },

});


/* =====================================================
   Інтерактивна логіка списку кейсів (SH-02)
   ===================================================== */

// ─── Маппінг ролей role-key → Український лейбл ───
var _CL_ROLE_MAP = {
  'sales': 'Продажі', 'air-logistics': 'Авіалогістика', 'broker': 'Брокер',
  'road-logistics': 'Автологістика', 'warehouse': 'Склад', 'accounting': 'Бухгалтерія',
  'finance': 'Фінанси', 'expeditor': 'Експедитор (Польща)', 'ops-admin': 'Операційний адміністратор'
};

// ─── Маппінг SLA лейблів → код ───
var _CL_SLA_MAP = { 'В нормі': 'on_track', 'Під ризиком': 'at_risk', 'Порушено': 'breached' };
var _CL_SLA_ORDER = { 'breached': 0, 'at_risk': 1, 'on_track': 2 };
var _CL_PRIORITY_ORDER = { 'high': 0, 'medium': 1, 'normal': 2, 'low': 3 };
var _CL_PRIORITY_MAP = { 'Високий': 'high', 'Середній': 'medium', 'Звичайний': 'normal', 'Низький': 'low' };

// ─── Маппінг case_status лейблів → код ───
var _CL_STATUS_MAP = { 'Відкрито': 'open', 'Заблоковано': 'blocked', 'Виконано': 'done', 'Архівовано': 'archived' };

// ─── Маппінг sync_state лейблів → код ───
var _CL_SYNC_MAP = { 'Підключено': 'ok', 'Повторна спроба': 'retrying', 'Помилка': 'error' };

// ─── Активна роль (UA лейбл) ───
function _clActiveRoleLabel() {
  var key = '';
  try { key = _getPersistedRole() || ''; } catch(e) {}
  return _CL_ROLE_MAP[key] || '';
}

// ─── Усі вихідні дані + згенеровані додаткові записи для пагінації ───
function _clAllItems() {
  return DATA.cases.data.items;
}

// ─── Обчислення відфільтрованих + відсортованих записів ───
function _clCompute() {
  var st = window._clState || {};
  var items = _clAllItems().slice();

  // 1. Пошук (нечутливий до регістру, часткові збіги)
  if (st.search) {
    var q = st.search.toLowerCase().trim();
    items = items.filter(function(c) {
      return c.case_no.toLowerCase().indexOf(q) >= 0 ||
        c.client.toLowerCase().indexOf(q) >= 0 ||
        (c.awb || '').toLowerCase().indexOf(q) >= 0 ||
        (c.cmr || '').toLowerCase().indexOf(q) >= 0 ||
        (c.invoice_number || '').toLowerCase().indexOf(q) >= 0 ||
        c.current_stage.toLowerCase().indexOf(q) >= 0 ||
        c.owner_role.toLowerCase().indexOf(q) >= 0;
    });
  }

  // 2. Saved View пресети
  var view = st.view || 'all';
  if (view === 'my_queue') {
    var rl = _clActiveRoleLabel();
    if (rl) items = items.filter(function(c) { return c.owner_role === rl; });
  } else if (view === 'at_risk') {
    items = items.filter(function(c) { return c.sla_state === 'at_risk'; });
  } else if (view === 'breached') {
    items = items.filter(function(c) { return c.sla_state === 'breached'; });
  } else if (view === 'exceptions') {
    items = items.filter(function(c) { return c.has_exception; });
  } else if (view === 'handover_pending') {
    items = items.filter(function(c) { return c.case_status === 'open'; });
  } else if (view === 'single_entry_conflict') {
    items = items.filter(function(c) { return c.has_exception && c.case_status === 'open'; });
  } else if (view === 'arrival_sync_issues') {
    items = items.filter(function(c) { return c.integration_sync_state !== 'ok'; });
  }

  // 3. Фільтри dropdown
  var f = st.filters || {};
  if (f.stage) items = items.filter(function(c) { return c.current_stage === f.stage; });
  if (f.state) items = items.filter(function(c) { return c.current_state === f.state; });
  if (f.case_status) items = items.filter(function(c) { return c.case_status === f.case_status; });
  if (f.sla) items = items.filter(function(c) { return c.sla_state === f.sla; });
  if (f.role) items = items.filter(function(c) { return c.owner_role === f.role; });
  if (f.priority) items = items.filter(function(c) { return c.priority === f.priority; });
  if (f.sync) items = items.filter(function(c) { return c.integration_sync_state === f.sync; });

  // 4. Сортування
  var col = st.sortCol || 'sla_state';
  var dir = st.sortDir || 'desc';
  items.sort(function(a, b) {
    var va, vb;
    if (col === 'sla_state') { va = _CL_SLA_ORDER[a.sla_state] || 9; vb = _CL_SLA_ORDER[b.sla_state] || 9; }
    else if (col === 'priority') { va = _CL_PRIORITY_ORDER[a.priority] || 9; vb = _CL_PRIORITY_ORDER[b.priority] || 9; }
    else if (col === 'updated_at') { va = a.updated_at; vb = b.updated_at; }
    else if (col === 'case_no') { va = a.case_no; vb = b.case_no; }
    else if (col === 'client') { va = a.client; vb = b.client; }
    else if (col === 'current_stage') { va = a.current_stage; vb = b.current_stage; }
    else if (col === 'owner_role') { va = a.owner_role; vb = b.owner_role; }
    else if (col === 'case_status') { va = a.case_status; vb = b.case_status; }
    else { va = a[col] || ''; vb = b[col] || ''; }
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    // Вторинне сортування
    if (col !== 'sla_state') {
      var sa = _CL_SLA_ORDER[a.sla_state] || 9, sb = _CL_SLA_ORDER[b.sla_state] || 9;
      if (sa !== sb) return sa - sb;
    }
    if (col !== 'priority') {
      var pa = _CL_PRIORITY_ORDER[a.priority] || 9, pb = _CL_PRIORITY_ORDER[b.priority] || 9;
      if (pa !== pb) return pa - pb;
    }
    return 0;
  });

  return items;
}

// ─── Підрахунок для Saved Views (на повних даних, без фільтрів) ───
function _clViewCounts() {
  var all = _clAllItems();
  var rl = _clActiveRoleLabel();
  return {
    all: all.length,
    my_queue: rl ? all.filter(function(c) { return c.owner_role === rl; }).length : 0,
    at_risk: all.filter(function(c) { return c.sla_state === 'at_risk'; }).length,
    breached: all.filter(function(c) { return c.sla_state === 'breached'; }).length,
    exceptions: all.filter(function(c) { return c.has_exception; }).length,
    handover_pending: 5,
    single_entry_conflict: 3,
    arrival_sync_issues: all.filter(function(c) { return c.integration_sync_state !== 'ok'; }).length
  };
}

// ─── Перевірка чи є активні фільтри ───
function _clHasActiveFilters() {
  var st = window._clState || {};
  if (st.search) return true;
  if (st.view !== 'all') return true;
  var f = st.filters || {};
  for (var k in f) { if (f[k]) return true; }
  return false;
}

// ─── Рендер saved views ───
function _clRenderViews() {
  var el = document.getElementById('cl-views');
  if (!el) return;
  var st = window._clState || {};
  var counts = _clViewCounts();
  var views = [
    { id: 'all', label: 'Усі кейси', icon: '📋', count: counts.all },
    { id: 'my_queue', label: 'Моя черга', icon: '👤', count: counts.my_queue },
    { id: 'at_risk', label: 'SLA під ризиком', icon: '⚠', count: counts.at_risk },
    { id: 'breached', label: 'Порушені SLA', icon: '🔴', count: counts.breached },
    { id: 'exceptions', label: 'З винятками', icon: '❗', count: counts.exceptions },
    { id: 'handover_pending', label: 'P0: Handover в очікуванні', icon: '🔄', count: counts.handover_pending },
    { id: 'single_entry_conflict', label: 'P0: Single-entry конфлікти', icon: '📊', count: counts.single_entry_conflict },
    { id: 'arrival_sync_issues', label: 'Arrival Auto-sync Issues', icon: '🔁', count: counts.arrival_sync_issues }
  ];
  var h = '<div class="saved-views">';
  views.forEach(function(v) {
    var cls = v.id === st.view ? 'active' : '';
    h += '<button class="saved-view-chip ' + cls + '" data-view="' + v.id + '" onclick="_clSetView(\'' + v.id + '\')">' +
      '<span class="saved-view-icon">' + v.icon + '</span>' + v.label +
      '<span class="saved-view-count">' + v.count + '</span></button>';
  });
  h += '</div>';
  el.innerHTML = h;
}

// ─── Рендер фільтрів ───
function _clRenderFilters() {
  var el = document.getElementById('cl-filters');
  if (!el) return;
  var allItems = _clAllItems();
  var st = window._clState || {};
  var f = st.filters || {};

  // Унікальні значення
  var stages = []; var stagesSet = {};
  var roles = []; var rolesSet = {};
  var stateMap = {}; // code → UA label
  allItems.forEach(function(c) {
    if (!stagesSet[c.current_stage]) { stages.push(c.current_stage); stagesSet[c.current_stage] = 1; }
    if (c.owner_role !== '—' && !rolesSet[c.owner_role]) { roles.push(c.owner_role); rolesSet[c.owner_role] = 1; }
    if (!stateMap[c.current_state]) {
      stateMap[c.current_state] = C.currentStateBadge(c.current_state).replace(/<[^>]+>/g, '').trim();
    }
  });

  function sel(label, key, opts, val) {
    var h = '<div class="filter-dropdown-group"><label class="filter-dropdown-label">' + label + '</label>' +
      '<select class="form-select form-select-sm" data-filter="' + key + '" onchange="_clOnFilter(this)">';
    opts.forEach(function(o) {
      var selected = (o.value || '') === (val || '') ? ' selected' : '';
      h += '<option value="' + (o.value || '') + '"' + selected + '>' + o.label + '</option>';
    });
    h += '</select></div>';
    return h;
  }

  var h = '<div class="filter-dropdowns">';
  h += sel('Етап', 'stage',
    [{ label: 'Усі етапи', value: '' }].concat(stages.map(function(s) { return { label: s, value: s }; })),
    f.stage);
  h += sel('Стан', 'state',
    [{ label: 'Усі стани', value: '' }].concat(Object.keys(stateMap).map(function(code) { return { label: stateMap[code], value: code }; })),
    f.state);
  h += sel('Статус кейсу', 'case_status',
    [{ label: 'Усі', value: '' }, { label: 'Відкрито', value: 'open' }, { label: 'Заблоковано', value: 'blocked' }, { label: 'Виконано', value: 'done' }, { label: 'Архівовано', value: 'archived' }],
    f.case_status);
  h += sel('SLA', 'sla',
    [{ label: 'Усі', value: '' }, { label: 'В нормі', value: 'on_track' }, { label: 'Під ризиком', value: 'at_risk' }, { label: 'Порушено', value: 'breached' }],
    f.sla);
  h += sel('Роль-власник', 'role',
    [{ label: 'Усі ролі', value: '' }].concat(roles.map(function(r) { return { label: r, value: r }; })),
    f.role);
  h += sel('Пріоритет', 'priority',
    [{ label: 'Усі', value: '' }, { label: 'Високий', value: 'high' }, { label: 'Середній', value: 'medium' }, { label: 'Звичайний', value: 'normal' }, { label: 'Низький', value: 'low' }],
    f.priority);
  h += sel('Sync', 'sync',
    [{ label: 'Усі', value: '' }, { label: 'Підключено', value: 'ok' }, { label: 'Повторна спроба', value: 'retrying' }, { label: 'Помилка', value: 'error' }],
    f.sync);

  var hasFilters = _clHasActiveFilters();
  h += '<button class="btn btn-ghost btn-sm filter-clear-btn' + (hasFilters ? ' cl-active-clear' : '') + '" onclick="_clClearFilters()">' +
    (hasFilters ? '✕ Очистити фільтри' : 'Очистити фільтри') + '</button>';
  h += '</div>';
  el.innerHTML = h;
}

// ─── Рендер інформації про сортування ───
function _clRenderSortInfo(filtered) {
  var el = document.getElementById('cl-sort-info');
  if (!el) return;
  var st = window._clState || {};
  var total = _clAllItems().length;
  var colLabels = {
    sla_state: 'SLA стан', priority: 'Пріоритет', updated_at: 'Оновлено',
    case_no: '№ кейсу', client: 'Клієнт', current_stage: 'Етап', owner_role: 'Роль-власник', case_status: 'Статус'
  };
  var label = colLabels[st.sortCol] || st.sortCol;
  var arrow = st.sortDir === 'asc' ? '↑' : '↓';

  var h = '<div class="cl-sort-bar">' +
    '<div class="cl-sort-left">' +
      '<span class="text-sm text-muted">Знайдено: <strong>' + filtered.length + '</strong>' +
        (filtered.length !== total ? ' з ' + total : '') + ' кейсів</span>' +
    '</div>' +
    '<div class="cl-sort-right">' +
      '<span class="text-sm text-muted">Сортування: </span>' +
      '<span class="sort-indicator cl-sort-active">' + label + ' ' + arrow + '</span>' +
    '</div>' +
  '</div>';
  el.innerHTML = h;
}

// ─── Рендер таблиці ───
function _clRenderTable(pageItems) {
  var el = document.getElementById('cl-table');
  if (!el) return;
  var st = window._clState || {};

  if (pageItems.length === 0) {
    el.innerHTML =
      '<div class="cl-empty-state">' +
        '<div class="cl-empty-icon">🔍</div>' +
        '<div class="cl-empty-title">Кейсів не знайдено</div>' +
        '<p class="cl-empty-desc">За поточним фільтром або пошуковим запитом результатів немає.</p>' +
        '<button class="btn btn-secondary" onclick="_clClearFilters()">Очистити фільтри</button>' +
      '</div>';
    return;
  }

  // Сортовані заголовки
  var cols = [
    { key: 'case_no', label: '№ кейсу' },
    { key: 'client', label: 'Клієнт' },
    { key: 'current_stage', label: 'Етап' },
    { key: 'current_state', label: 'Стан' },
    { key: 'case_status', label: 'Статус кейсу' },
    { key: 'sla_state', label: 'SLA' },
    { key: 'owner_role', label: 'Роль-власник' },
    { key: 'priority', label: 'Пріоритет' },
    { key: 'sync', label: 'Sync' },
    { key: 'updated_at', label: 'Оновлено' },
    { key: '_actions', label: 'Дії' }
  ];

  var h = '<div class="table-wrap"><table class="cl-table">';

  // Заголовки з можливістю сортування
  h += '<thead><tr>';
  cols.forEach(function(col) {
    if (col.key === '_actions' || col.key === 'sync') {
      h += '<th>' + col.label + '</th>';
    } else {
      var isActive = st.sortCol === col.key;
      var arrow = isActive ? (st.sortDir === 'asc' ? ' ↑' : ' ↓') : '';
      var cls = isActive ? 'cl-th-active' : 'cl-th-sortable';
      h += '<th class="' + cls + '" onclick="_clSort(\'' + col.key + '\')" title="Сортувати за: ' + col.label + '">' + col.label + arrow + '</th>';
    }
  });
  h += '</tr></thead>';

  // Тіло таблиці
  h += '<tbody>';
  pageItems.forEach(function(c) {
    var rowCls = '';
    if (c.sla_state === 'breached') rowCls = 'cl-row-breached';
    else if (c.sla_state === 'at_risk') rowCls = 'cl-row-at-risk';
    if (c.has_exception) rowCls += ' cl-row-exception';

    h += '<tr class="cl-row ' + rowCls + '" data-case="' + c.case_no + '" onclick="_clOpenCase(\'' + c.case_no + '\', event)">';
    h += '<td class="cl-cell-case-no"><a href="#/shared/timeline" onclick="event.stopPropagation()" class="cl-case-link">' + c.case_no + '</a></td>';
    h += '<td>' + c.client + '</td>';
    h += '<td class="cl-cell-stage">' + c.current_stage + '</td>';
    h += '<td>' + C.currentStateBadge(c.current_state) + '</td>';
    h += '<td>' + C.caseStatusBadge(c.case_status) + '</td>';
    h += '<td>' + C.slaBadge(c.sla_state) + '</td>';
    h += '<td>' + c.owner_role + '</td>';
    h += '<td>' + C.priorityBadge(c.priority) + '</td>';
    h += '<td>' + C.syncStatusBadge(c.integration_sync_state) + '</td>';
    h += '<td class="cl-cell-date">' + c.updated_at + '</td>';
    h += '<td class="cl-cell-actions" onclick="event.stopPropagation()">' +
      '<div class="quick-actions-row">' +
        '<button class="btn btn-ghost btn-sm" onclick="navigate(\'#/shared/timeline\')" title="Відкрити кейс">📂</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="navigateToTab(\'#/shared/timeline\',\'conversation\')" title="Комунікація">💬</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="_clQuickAction(\'assign-role\',\'' + c.case_no + '\')" title="Призначити роль-власника">👤</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="_clQuickAction(\'change-priority\',\'' + c.case_no + '\')" title="Змінити пріоритет">⚡</button>' +
      '</div>' +
    '</td>';
    h += '</tr>';
  });
  h += '</tbody></table></div>';

  el.innerHTML = h;
}

// ─── Рендер пагінації ───
function _clRenderPagination(filtered) {
  var el = document.getElementById('cl-pagination');
  if (!el) return;
  var st = window._clState || {};
  var total = filtered.length;
  var perPage = st.perPage || 10;
  var totalPages = Math.max(1, Math.ceil(total / perPage));
  var page = Math.min(st.page || 1, totalPages);

  if (total === 0) { el.innerHTML = ''; return; }

  var from = (page - 1) * perPage + 1;
  var to = Math.min(page * perPage, total);

  var h = '<div class="pagination-summary">' +
    '<span class="text-sm text-muted">Показано ' + from + '–' + to + ' з ' + total + ' кейсів · Сторінка ' + page + ' з ' + totalPages + '</span>' +
    '<div class="pagination-controls">';

  h += '<button class="btn btn-ghost btn-sm" ' + (page <= 1 ? 'disabled' : 'onclick="_clSetPage(' + (page - 1) + ')"') + '>← Попередня</button>';

  // Номери сторінок
  for (var i = 1; i <= totalPages; i++) {
    if (i === page) {
      h += '<span class="pagination-page-num cl-page-active">' + i + '</span>';
    } else {
      h += '<button class="btn btn-ghost btn-sm cl-page-btn" onclick="_clSetPage(' + i + ')">' + i + '</button>';
    }
  }

  h += '<button class="btn btn-ghost btn-sm" ' + (page >= totalPages ? 'disabled' : 'onclick="_clSetPage(' + (page + 1) + ')"') + '>Наступна →</button>';
  h += '</div></div>';
  el.innerHTML = h;
}

// ─── Головна функція оновлення ───
function _clRefresh() {
  var st = window._clState || {};
  var filtered = _clCompute();

  // Скидання сторінки якщо вийшли за межі
  var perPage = st.perPage || 10;
  var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (st.page > totalPages) st.page = 1;

  // Обчислити поточну сторінку
  var from = ((st.page || 1) - 1) * perPage;
  var pageItems = filtered.slice(from, from + perPage);

  _clRenderViews();
  _clRenderFilters();
  _clRenderSortInfo(filtered);
  _clRenderTable(pageItems);
  _clRenderPagination(filtered);
}

// ─── Обробники подій ───
var _clSearchTimer = null;
function _clOnSearch(e) {
  var st = window._clState || {};
  clearTimeout(_clSearchTimer);
  _clSearchTimer = setTimeout(function() {
    st.search = (e.target.value || '').trim();
    st.page = 1;
    _clRefresh();
  }, 200);
}

function _clSetView(id) {
  var st = window._clState || {};
  st.view = id;
  st.page = 1;
  // Скидання dropdown-фільтрів при перемиканні view
  st.filters = {};
  _clRefresh();
  // Оновити поле пошуку
  var searchEl = document.getElementById('cl-search');
  if (searchEl) searchEl.value = st.search;
}

function _clOnFilter(selectEl) {
  var st = window._clState || {};
  var key = selectEl.getAttribute('data-filter');
  var val = selectEl.value || '';
  if (!st.filters) st.filters = {};
  st.filters[key] = val;
  st.page = 1;
  _clRefresh();
}

function _clClearFilters() {
  window._clState = { search: '', view: 'all', filters: {}, sortCol: 'sla_state', sortDir: 'desc', page: 1, perPage: (window._clState || {}).perPage || 10 };
  var searchEl = document.getElementById('cl-search');
  if (searchEl) searchEl.value = '';
  _clRefresh();
}

function _clSort(col) {
  var st = window._clState || {};
  if (st.sortCol === col) {
    st.sortDir = st.sortDir === 'desc' ? 'asc' : 'desc';
  } else {
    st.sortCol = col;
    st.sortDir = 'desc';
  }
  st.page = 1;
  _clRefresh();
}

function _clSetPage(n) {
  var st = window._clState || {};
  st.page = n;
  _clRefresh();
  // Скрол до таблиці
  var tbl = document.getElementById('cl-table');
  if (tbl) tbl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _clOpenCase(caseNo, event) {
  if (event && (event.target.tagName === 'BUTTON' || event.target.tagName === 'A' || event.target.closest('button') || event.target.closest('a'))) return;
  navigate('#/shared/timeline');
}

function _clQuickAction(modalId, caseNo) {
  var el1 = document.getElementById('cl-modal-case-no');
  var el2 = document.getElementById('cl-modal-case-no-pri');
  if (el1) el1.textContent = caseNo;
  if (el2) el2.textContent = caseNo;
  openModal(modalId);
}

function _clModalConfirm(modalId) {
  closeModal(modalId);
  // Показати підтвердження через тимчасовий toast
  _clShowToast('Дію виконано. Зміна записана в audit trail.');
}

function _clShowToast(msg) {
  var existing = document.getElementById('cl-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'cl-toast';
  t.className = 'cl-toast cl-toast-show';
  t.innerHTML = '<span class="cl-toast-icon">✓</span> ' + msg;
  document.body.appendChild(t);
  setTimeout(function() { t.classList.add('cl-toast-hide'); }, 2500);
  setTimeout(function() { t.remove(); }, 3000);
}

// ─── Ініціалізація (після рендеру DOM) ───
function _clInit() {
  // Прив'язати пошук
  var searchEl = document.getElementById('cl-search');
  if (searchEl) {
    searchEl.addEventListener('input', _clOnSearch);
    searchEl.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { searchEl.value = ''; window._clState.search = ''; window._clState.page = 1; _clRefresh(); }
    });
    // Фокус на пошук
    searchEl.focus();
  }

  // Початковий рендер усіх динамічних частин
  _clRefresh();
}
