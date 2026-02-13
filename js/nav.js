/* =====================================================
   F1 Операційна Платформа — Налаштування навігації
   ===================================================== */

const NAV_CONFIG = [
  {
    title: 'Основне',
    items: [
      { icon: '📋', label: 'Кейси', hash: '#/shared/cases' },
      { icon: '✅', label: 'Завдання та SLA', hash: '#/shared/tasks', badge: 8 },
      { icon: '⚠', label: 'Винятки', hash: '#/shared/exceptions', badge: 5 },
      { icon: '🛡', label: 'Рішення', hash: '#/shared/approvals', badge: 3 },
      { icon: '📊', label: 'Звіти', hash: '#/shared/reports' },
    ]
  },
  {
    title: 'Пріоритетне',
    p0: true,
    items: [
      { icon: '🔄', label: 'Дошка передач', hash: '#/shared/handover-board', badge: 4 },
      { icon: '📊', label: 'Консоль єдиного вводу', hash: '#/shared/accounting-single-entry', badge: 2 },
    ]
  },
  { divider: true },
  {
    title: 'Продажі',
    role: 'sales',
    items: [
      { icon: '💼', label: 'Робочий простір', hash: '#/roles/sales/workspace' },
      { icon: '📝', label: 'Створити прорахунок', hash: '#/roles/sales/quote' },
      { icon: '📁', label: 'Документи клієнта', hash: '#/roles/sales/documents' },
      { icon: '💬', label: 'Комунікація', hash: '#/roles/sales/communication' },
    ]
  },
  {
    title: 'Авіалогістика',
    role: 'air-logistics',
    items: [
      { icon: '✈', label: 'Робочий простір', hash: '#/roles/air-logistics/workspace' },
      { icon: '🎫', label: 'Букінг і AWB', hash: '#/roles/air-logistics/booking' },
      { icon: '📡', label: 'Попереднє сповіщення', hash: '#/roles/air-logistics/prealert' },
      { icon: '🤝', label: 'Передача', hash: '#/roles/air-logistics/handover' },
    ]
  },
  {
    title: 'Брокер',
    role: 'broker',
    items: [
      { icon: '🛃', label: 'Робочий простір', hash: '#/roles/broker/workspace' },
      { icon: '🚛', label: 'T1 і транзит', hash: '#/roles/broker/transit' },
      { icon: '📋', label: 'Митне оформлення', hash: '#/roles/broker/clearance' },
      { icon: '⚖', label: 'Розбіжності', hash: '#/roles/broker/discrepancy' },
    ]
  },
  {
    title: 'Автологістика',
    role: 'road-logistics',
    items: [
      { icon: '🚚', label: 'Робочий простір', hash: '#/roles/road-logistics/workspace' },
      { icon: '📅', label: 'Планування авто', hash: '#/roles/road-logistics/truck-planning' },
      { icon: '🛂', label: 'Контроль кордону', hash: '#/roles/road-logistics/border' },
      { icon: '📦', label: 'Закриття доставки', hash: '#/roles/road-logistics/delivery' },
    ]
  },
  {
    title: 'Склад',
    role: 'warehouse',
    items: [
      { icon: '🏭', label: 'Робочий простір', hash: '#/roles/warehouse/workspace' },
      { icon: '📥', label: 'Обробка прибуття', hash: '#/roles/warehouse/arrival' },
      { icon: '🔓', label: 'Видача / відправка', hash: '#/roles/warehouse/release' },
      { icon: '🐛', label: 'Журнал інцидентів', hash: '#/roles/warehouse/issues' },
    ]
  },
  {
    title: 'Бухгалтерія',
    role: 'accounting',
    items: [
      { icon: '🧾', label: 'Робочий простір', hash: '#/roles/accounting/workspace' },
      { icon: '📊', label: 'Довідка витрат', hash: '#/roles/accounting/cost-cert' },
      { icon: '🧾', label: 'Рахунки клієнтам', hash: '#/roles/accounting/customer-inv' },
      { icon: '📩', label: 'Рахунки агентів', hash: '#/roles/accounting/agent-inv' },
    ]
  },
  {
    title: 'Фінанси',
    role: 'finance',
    items: [
      { icon: '💰', label: 'Робочий простір', hash: '#/roles/finance/workspace' },
      { icon: '💳', label: 'Рознесення оплат', hash: '#/roles/finance/allocation' },
      { icon: '🚦', label: 'Шлюз видачі', hash: '#/roles/finance/gate' },
      { icon: '🔄', label: 'Звірка', hash: '#/roles/finance/reconciliation' },
    ]
  },
  {
    title: 'Експедитор (Польща)',
    role: 'expeditor',
    items: [
      { icon: '🏗', label: 'Робочий простір', hash: '#/roles/expeditor/workspace' },
      { icon: '📥', label: 'Реєстрація прибуття', hash: '#/roles/expeditor/arrival-checkin' },
      { icon: '📋', label: 'Термінальна подача та MRN', hash: '#/roles/expeditor/terminal-submission' },
      { icon: '🤝', label: 'Дошка передач', hash: '#/roles/expeditor/handover' },
    ]
  },
  {
    title: 'Операційний адміністратор',
    role: 'ops-admin',
    items: [
      { icon: '⚙', label: 'Робочий простір', hash: '#/roles/ops-admin/workspace' },
      { icon: '⏱', label: 'Редактор SLA-політик', hash: '#/roles/ops-admin/sla-editor' },
      { icon: '🔀', label: 'Правила статусів', hash: '#/roles/ops-admin/status-rules' },
      { icon: '📚', label: 'Довідкові дані', hash: '#/roles/ops-admin/reference' },
    ]
  },
];

function navigateToTab(hash, tabId) {
  navigate(hash);
  setTimeout(function() {
    var tabs = document.querySelectorAll('.tab-item');
    for (var i = 0; i < tabs.length; i++) {
      var btn = tabs[i];
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').indexOf("'" + tabId + "'") !== -1) {
        btn.click();
        break;
      }
    }
  }, 60);
}

function renderSidebar(activeHash) {
  const sb = document.getElementById('sidebar');
  const activeRole = document.getElementById('roleSwitcher')?.value || '';

  // Будуємо впорядкований список секцій:
  // якщо вибрана роль — її секція завжди на початку
  let sections = NAV_CONFIG;
  if (activeRole) {
    const roleSection = NAV_CONFIG.find(s => s.role === activeRole);
    const rest = NAV_CONFIG.filter(s => s !== roleSection);
    sections = roleSection ? [roleSection, { divider: true }, ...rest] : rest;
  }

  let html = '';
  sections.forEach(section => {
    if (section.divider) {
      html += '<div class="nav-divider"></div>';
      return;
    }
    // Якщо активна роль вибрана, приховуємо інші рольові секції
    if (activeRole && section.role && section.role !== activeRole) {
      return;
    }
    const sectionCls = [
      'nav-section',
      section.role === activeRole ? 'nav-section--active-role' : '',
      section.p0 ? 'nav-section--p0' : '',
    ].filter(Boolean).join(' ');
    html += `<div class="${sectionCls}">`;
    html += `<div class="nav-section-title">${section.title}</div>`;
    section.items.forEach(item => {
      const isActive = activeHash === item.hash && !item.tabTarget;
      var onclick = item.tabTarget
        ? `event.preventDefault();navigateToTab('${item.hash}','${item.tabTarget}');closeMobileNav();`
        : `event.preventDefault();navigate('${item.hash}');closeMobileNav();`;
      html += `<a class="nav-item ${isActive ? 'active' : ''}" href="${item.hash}" onclick="${onclick}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </a>`;
    });
    html += `</div>`;
  });
  sb.innerHTML = html;
}
