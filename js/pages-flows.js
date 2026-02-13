/* =====================================================
   Міжрольовий сценарій Pages: CR-01..CR-05
   Чисті render-функції + диспетчер renderFlowTab()
   ===================================================== */

// ─── Маппінг scenario_type → UA-назва та опис ───
const FLOW_SCENARIO_META = {
  happy_path:        { code: 'CR-01', title: 'Наскрізний щасливий шлях', subtitle: 'Стандартний кейс без винятків' },
  partial_arrival:   { code: 'CR-02', title: 'Часткове прибуття',        subtitle: 'Часткове прибуття вантажу' },
  weight_mismatch:   { code: 'CR-03', title: 'Розбіжність ваги',        subtitle: 'Розбіжність ваги між документами' },
  payment_exception: { code: 'CR-04', title: 'Платіжний виняток',       subtitle: 'Часткова оплата перед видачею' },
  customs_hold:      { code: 'CR-05', title: 'Митне утримання',         subtitle: 'Митне утримання' },
};

// ═══════════════════════════════════════════════════════
// Чисті render-функції (повертають HTML-рядок)
// ═══════════════════════════════════════════════════════

function renderHappyPathFlow(d, opts) {
  var isTab = opts && opts.isTab;

  // ── Compact tab layout ──
  if (isTab) {
    return '' +
      // Зона 1: Статус
      '<div class="card-grid mb-12">' +
        '<div class="card" style="padding:10px 14px;">' +
          '<div class="text-sm text-muted">Статус кейсу</div>' +
          '<div class="font-bold">' + C.statusBadge('done') + ' Завершено</div>' +
        '</div>' +
        '<div class="card" style="padding:10px 14px;">' +
          '<div class="text-sm text-muted">Затвердження</div>' +
          '<div class="font-bold">' + C.approvalTypeBadge('RELEASE_AUTHORIZATION_APPROVAL') + '</div>' +
          '<div class="text-sm">' + C.roleLabel('WAREHOUSE_LEAD') + ' · ' + C.verificationModeBadge('standard') + '</div>' +
        '</div>' +
      '</div>' +

      // Зона 2: Компактні кроки
      C.flowStepsCompact(d.steps) +

      // Зона 3: Handover + Gates compact
      '<div style="display:flex; gap:12px; margin-top:12px;">' +
        '<div class="card" style="padding:10px 14px; flex:1; min-width:0; overflow:auto;">' +
          '<div class="font-bold text-sm mb-8">Передачі між ролями</div>' +
          '<table class="fsc-table"><thead><tr><th>Крок</th><th>Від</th><th>До</th><th>SLA</th><th>Статус</th></tr></thead><tbody>' +
            '<tr class="fsc-row"><td>2→4</td><td>Авіалогістика</td><td>Брокер</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
            '<tr class="fsc-row"><td>3→5</td><td>Авіалогістика</td><td>Автологістика</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
            '<tr class="fsc-row"><td>5→6</td><td>Автологістика</td><td>Брокер</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
            '<tr class="fsc-row"><td>6→7</td><td>Брокер</td><td>Бухгалтерія</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
            '<tr class="fsc-row"><td>7→8</td><td>Бухгалтерія</td><td>Фінанси</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
            '<tr class="fsc-row"><td>8→9</td><td>Фінанси</td><td>Склад</td><td>' + C.slaBadge('on_track') + '</td><td>' + C.handoverStatusBadge('received') + '</td></tr>' +
          '</tbody></table>' +
        '</div>' +
        '<div class="card" style="padding:10px 14px; flex:1; min-width:0;">' +
          '<div class="font-bold text-sm mb-8">Контрольні точки</div>' +
          '<ul class="checklist" style="margin:0; font-size:13px;">' +
            '<li class="checklist-item"><span class="check-icon checked">✓</span>Передачі фіксуються в timeline</li>' +
            '<li class="checklist-item"><span class="check-icon checked">✓</span>SLA видимі на кожному кроці</li>' +
            '<li class="checklist-item"><span class="check-icon checked">✓</span>Шлюз блокує видачу до ДОЗВОЛУ</li>' +
            '<li class="checklist-item"><span class="check-icon checked">✓</span>CRITICAL → через inbox рішень</li>' +
            '<li class="checklist-item"><span class="check-icon checked">✓</span>Фінальний статус після умов</li>' +
          '</ul>' +
        '</div>' +
      '</div>';
  }

  // ── Full standalone page ──
  return C.pageHeader('Наскрізний щасливий шлях', 'CR-01 — Стандартний кейс без винятків') +
    C.heroNotice('Наскрізний щасливий шлях',
      '<strong>Для всіх ролей.</strong> Повний цикл кейсу від створення в Продажах до видачі на Складі — через усі 8 ролей.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> повний цикл кейсу координувався через email-ланцюги між 5-8 людьми різних відділів. Передача відповідальності між ролями — неформальна. SLA не контролювався. Затримку на будь-якому етапі помічали лише коли клієнт скаржився.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> кожен крок — системна задача з SLA. Handover між ролями — видимий процес із підтвердженням прийому (ack). Payment gate блокує видачу до PASS. Весь шлях — в єдиній timeline кейсу. Клікніть «Перейти до екрану», щоб побачити рольову сторінку кожного кроку.') +

    `<div class="card mb-16">
      <div class="card-header">
        <span class="card-title">Кейс: ${d.case_no}</span>
        ${C.statusBadge('done')}
      </div>
      <p class="text-secondary">Клієнт: ${d.client}</p>
    </div>` +

    C.section('Кроки сценарію') +
    C.flowSteps(d.steps) +

    C.section('Контрольні точки передачі') +
    C.sectionNotice('Передачі між ролями',
      'Кожна передача між ролями фіксується в SH-10 Дошка передач. Нижче показані всі точки передач наскрізного шляху.') +
    C.table(
      ['Крок', 'Від', 'До', 'Канал', 'SLA', 'Статус'],
      [
        ['2→4', 'Авіалогістика', 'Брокер', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
        ['3→5', 'Авіалогістика', 'Автологістика', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
        ['5→6', 'Автологістика', 'Брокер', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
        ['6→7', 'Брокер', 'Бухгалтерія', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
        ['7→8', 'Бухгалтерія', 'Фінанси', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
        ['8→9', 'Фінанси', 'Склад', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track'), C.handoverStatusBadge('received')],
      ]
    ) +

    C.section('Критичні інтерфейсні контрольні точки') +
    `<ul class="checklist">
      <li class="checklist-item"><span class="check-icon checked">✓</span>Передача між ролями фіксується в хронології</li>
      <li class="checklist-item"><span class="check-icon checked">✓</span>Стани SLA видимі на кожному кроці</li>
      <li class="checklist-item"><span class="check-icon checked">✓</span>Платіжний шлюз блокує видачу до рішення «Дозвіл»</li>
      <li class="checklist-item"><span class="check-icon checked">✓</span>HIGH/CRITICAL рішення проходять через inbox рішень, не через пряму CTA-кнопку</li>
      <li class="checklist-item"><span class="check-icon checked">✓</span>Фінальний статус тільки після умов закриття</li>
    </ul>` +

    C.section('Шлюзи затвердження у щасливому шляху') +
    C.sectionHeroNotice('Шлях затвердження для HIGH/CRITICAL рішень',
      'У наскрізному сценарії кроки з HIGH/CRITICAL ризиком (ручна зміна шлюзу, авторизація видачі) проходять через inbox рішень, а не через пряму CTA-кнопку.') +
    C.table(
      ['Крок', 'Тип рішення', 'Роль-затверджувач', 'Верифікація'],
      [
        ['9. Видача / відправка', C.approvalTypeBadge('RELEASE_AUTHORIZATION_APPROVAL'), C.roleLabel('WAREHOUSE_LEAD'), C.verificationModeBadge('standard')]
      ]
    );
}

function renderPartialArrivalFlow(d, opts) {
  var isTab = opts && opts.isTab;

  // ── Compact tab layout ──
  if (isTab) {
    return '' +
      // Зона 1: stat strip + статус
      C.statStrip([
        { value: d.arrived_part.pieces + ' місць', label: 'Прибула', color: 'accent' },
        { value: d.pending_part.pieces + ' місць', label: 'Очікується', color: 'warning' },
        { value: d.pending_part.eta, label: 'ETA решти' },
        { value: C.statusBadge('in_progress'), label: 'Статус кейсу' },
      ]) +

      // Зона 2: Компактні кроки
      '<div class="mt-12">' + C.flowStepsCompact(d.steps) + '</div>' +

      // Зона 3: Таблиця частин
      '<div class="mt-12">' +
      '<table class="fsc-table"><thead><tr><th>Частина</th><th>Місця</th><th>Вага (кг)</th><th>Статус</th><th>Дата / ETA</th></tr></thead><tbody>' +
        '<tr class="fsc-row done"><td>Частина 1</td><td>' + d.arrived_part.pieces + '</td><td>' + d.arrived_part.weight_kg + '</td><td><span class="badge-status done">Прибула</span></td><td>2026-02-10</td></tr>' +
        '<tr class="fsc-row in_progress"><td>Частина 2</td><td>' + d.pending_part.pieces + '</td><td>' + d.pending_part.weight_kg + '</td><td><span class="badge-status pending">Очікується</span></td><td>' + d.pending_part.eta + '</td></tr>' +
      '</tbody></table>' +
      '</div>';
  }

  // ── Full standalone page ──
  return C.pageHeader('Сценарій часткового прибуття', 'CR-02 — Часткове прибуття вантажу') +
    C.heroNotice('Сценарій винятку: часткове прибуття',
      '<strong>Для складу, експедитора, логіста.</strong> Прибула лише частина вантажу. Система розділяє прибуло vs в очікуванні і блокує закриття.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> складський працівник повідомляв менеджера листом або дзвінком. Часто кейс закривали, не дочекавшись решти вантажу, або забували про непрбулу частину. Відстеження в записках чи Excel.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> розділення прибуло vs в очікуванні із окремим timeline. Фінальне закриття заборонене до повної комплектації. Кожна зміна статусу часткового прибуття видима всім ролям. Виняток закривається автоматично після прибуття решти.') +

    `<div class="card mb-16">
      <div class="card-header">
        <span class="card-title">Кейс: ${d.case_no}</span>
        ${C.statusBadge('in_progress')}
      </div>
    </div>` +

    C.section('Кроки сценарію') +
    C.flowSteps(d.steps) +

    C.section('Kanban: Стан частин вантажу') +
    C.sectionNotice('Розділений стан',
      'Кейс знаходиться в розділеному стані: одна частина на складі, інша — в очікуванні прибуття.') +
    C.kanban([
      {
        title: 'Прибула частина',
        cards: [
          `<div class="card-title">${d.arrived_part.pieces} місць / ${d.arrived_part.weight_kg} кг</div>
          <p>Статус: <span class="badge-status done">На складі</span></p>
          <p class="text-sm text-muted">Приймання завершено, розміщено на складі</p>`
        ]
      },
      {
        title: 'В очікуванні',
        cards: [
          `<div class="card-title">${d.pending_part.pieces} місць / ${d.pending_part.weight_kg} кг</div>
          <p>Статус: <span class="badge-status pending">Очікується</span></p>
          <p class="text-sm text-muted">ETA: ${d.pending_part.eta}</p>`
        ]
      },
      {
        title: 'Видача',
        cards: [
          `<div class="card-title">Заблоковано</div>
          <p>Статус: <span class="badge-status blocked">Чекає повного прибуття</span></p>
          <p class="text-sm text-muted">Видача можлива тільки після комплектації</p>`
        ]
      }
    ]) +

    C.section('Відстеження частин вантажу') +
    C.table(
      ['Частина', 'Місця', 'Вага (кг)', 'Статус', 'Дата прибуття / ETA'],
      [
        ['Частина 1', d.arrived_part.pieces, d.arrived_part.weight_kg, '<span class="badge-status done">Прибула</span>', '2026-02-10'],
        ['Частина 2', d.pending_part.pieces, d.pending_part.weight_kg, '<span class="badge-status pending">Очікується</span>', d.pending_part.eta],
      ]
    ) +

    C.section('Розподіл відправлення') +
    C.compareGrid([
      {
        title: 'Прибула частина',
        rows: [
          { label: 'Місця', value: d.arrived_part.pieces },
          { label: 'Вага (кг)', value: d.arrived_part.weight_kg },
        ]
      },
      {
        title: 'Частина в очікуванні',
        rows: [
          { label: 'Місця', value: d.pending_part.pieces },
          { label: 'Вага (кг)', value: d.pending_part.weight_kg },
          { label: 'Очікувана дата прибуття', value: d.pending_part.eta },
        ]
      }
    ]);
}

function renderWeightMismatchFlow(d, opts) {
  var isTab = opts && opts.isTab;

  // ── Compact tab layout ──
  if (isTab) {
    return '' +
      // Зона 1: stat strip ваги + кнопка
      '<div style="display:flex; gap:12px; margin-bottom:12px;">' +
        '<div class="card" style="padding:10px 14px; flex:2; min-width:0;">' +
          C.statStrip([
            { value: '2 450 кг', label: 'CMR', color: 'danger' },
            { value: '2 380 кг', label: 'AWB', color: 'warning' },
            { value: '2 400 кг', label: 'Інвойс' },
          ]) +
        '</div>' +
        '<div class="card" style="padding:10px 14px; flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:6px;">' +
          C.btn('Надіслати запит корекції', 'btn-primary btn-sm') +
          '<div class="text-sm text-muted">AWB · ' + C.slaBadge('on_track') + ' 16 год</div>' +
        '</div>' +
      '</div>' +

      // Зона 2: Компактні кроки
      C.flowStepsCompact(d.steps) +

      // Зона 3: Approval gates
      '<div class="mt-12">' +
      '<table class="fsc-table"><thead><tr><th>Сценарій</th><th>Тип рішення</th><th>Роль</th><th>Верифікація</th></tr></thead><tbody>' +
        '<tr class="fsc-row"><td>Зміна документів</td><td>' + C.approvalTypeBadge('DOC_FINALIZATION_APPROVAL') + '</td><td>' + C.roleLabel('ROAD_LOGISTICS / BROKER') + '</td><td>' + C.verificationModeBadge('standard') + '</td></tr>' +
        '<tr class="fsc-row"><td>Зміна ставки</td><td>' + C.approvalTypeBadge('RATE_OUTLIER_APPROVAL') + '</td><td>' + C.roleLabel('ROAD_LOGISTICS_LEAD') + '</td><td>' + C.verificationModeBadge('standard') + '</td></tr>' +
      '</tbody></table>' +
      '</div>';
  }

  // ── Full standalone page ──
  return C.pageHeader('Сценарій розбіжності ваги', 'CR-03 — Розбіжність ваги між документами') +
    C.heroNotice('Потік винятку розбіжності ваги',
      '<strong>Для брокера, логіста, менеджера.</strong> Вага в CMR, AWB та Invoice не збігається. Потрібне з\'ясування причини та корекція перед митним оформленням.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> брокер виявляв розбіжність при підготовці митних документів і писав email логісту та менеджеру. Починався email-пінг. Хто відповідальний за корекцію — визначали ситуативно. Час вирішення не контролювався.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> side-by-side порівняння метаданих із автоматичними discrepancy flags. Exception із owner-role, SLA та root cause selector. Запит корекцій клієнту — через structured clarification task. Перехід кейсу заблоковано до вирішення (TC-BR-01).') +

    C.sectionHeroNotice('Вирішення розбіжностей',
      'Невирішена розбіжність ваги блокує митне оформлення та може призвести до штрафів. Пріоритетне вирішення обов\'язкове.') +

    `<div class="card mb-16">
      <div class="card-header"><span class="card-title">Кейс: ${C.caseLink(d.case_no)}</span> ${C.statusBadge('in_progress')}</div>
    </div>` +

    C.section('Кроки сценарію') +
    C.flowSteps(d.steps) +

    C.section('Запит корекції (inline)') +
    C.sectionNotice('Сигнал корекції',
      'Швидкий запит корекції безпосередньо з flow-сторінки. Деталі розбіжності автоматично заповнюються.') +
    `<div class="card">
      <div class="card-title">Швидкий запит корекції</div>
      <div class="card-grid">
        <div>
          ${C.formGroup('До ролі', C.formSelect([
            { value: 'air', label: 'Авіалогістика (корекція AWB)' },
            { value: 'road', label: 'Автологістика (корекція CMR)' },
          ]))}
        </div>
        <div>
          ${C.formGroup('Тип розбіжності', C.formInput('Розбіжність ваги', 'Розбіжність ваги'))}
        </div>
      </div>
      ${C.formGroup('Деталі', '<textarea class="form-textarea" rows="2" placeholder="CMR: 2450 кг, AWB: 2380 кг, Інвойс: 2400 кг. Потрібна корекція AWB.">CMR: 2450 кг, AWB: 2380 кг, Інвойс: 2400 кг. Потрібна корекція AWB.</textarea>')}
      <div class="mt-8">${C.btn('Надіслати запит корекції', 'btn-primary')}</div>
    </div>` +

    C.section('Індикатор повторної перевірки') +
    `<div class="card" style="border-left: 4px solid var(--warning)">
      <div class="card-title">Статус повторної перевірки</div>
      <div class="doc-meta-row"><span class="doc-meta-label">Запит корекції AWB</span><span class="doc-meta-value">${C.statusBadge('pending')} — відповідь очікується</span></div>
      <div class="doc-meta-row"><span class="doc-meta-label">SLA відповіді</span><span class="doc-meta-value">${C.slaBadge('on_track')} — залишилось 16 год</span></div>
      <div class="doc-meta-row"><span class="doc-meta-label">Повторна перевірка</span><span class="doc-meta-value"><span class="badge-status pending">Очікує нової версії документа</span></span></div>
      <p class="text-sm text-muted mt-8">Після отримання коригованого AWB система автоматично запустить повторне порівняння документів.</p>
    </div>` +

    C.section('Порівняння документів') +
    C.statStrip([
      { value: '2,450 кг', label: 'CMR', color: 'danger' },
      { value: '2,380 кг', label: 'AWB', color: 'warning' },
      { value: '2,400 кг', label: 'Інвойс' }
    ]) +
    `<p class="text-center text-sm text-muted mt-8">${C.link('#/roles/broker/discrepancy', 'Переглянути екран повного вирішення розбіжності →')}</p>` +

    C.section('Шлюзи затвердження') +
    C.table(
      ['Сценарій', 'Тип рішення', 'Роль', 'Верифікація'],
      [
        ['Зміна фінальних документів', C.approvalTypeBadge('DOC_FINALIZATION_APPROVAL'), C.roleLabel('ROAD_LOGISTICS / BROKER'), C.verificationModeBadge('standard')],
        ['Зміна ставки', C.approvalTypeBadge('RATE_OUTLIER_APPROVAL'), C.roleLabel('ROAD_LOGISTICS_LEAD'), C.verificationModeBadge('standard')],
      ]
    );
}

function renderPaymentExceptionFlow(d, opts) {
  var isTab = opts && opts.isTab;
  var pctPaid = Math.round(d.breakdown.received / d.breakdown.expected * 100);

  // ── Compact tab layout ──
  if (isTab) {
    return '' +
      // Зона 1: Payment panel + actions
      '<div style="display:flex; gap:12px; margin-bottom:12px;">' +
        '<div class="card" style="padding:10px 14px; border-left:4px solid var(--danger); flex:2; min-width:0;">' +
          '<div style="display:flex; gap:16px;">' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Очікується</span><span class="doc-meta-value font-bold">' + d.breakdown.currency + ' ' + d.breakdown.expected.toLocaleString() + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Отримано</span><span class="doc-meta-value">' + d.breakdown.currency + ' ' + d.breakdown.received.toLocaleString() + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Недоплата</span><span class="doc-meta-value text-danger font-bold">' + d.breakdown.currency + ' ' + d.breakdown.shortfall.toLocaleString() + '</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Шлюз</span><span class="doc-meta-value">' + C.gateBadge('fail') + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Ручна зміна</span><span class="doc-meta-value">' + C.approvalStatusBadge('pending') + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div style="background:var(--surface-2);height:6px;border-radius:3px;overflow:hidden;margin-top:8px;">' +
            '<div style="background:var(--danger);width:' + pctPaid + '%;height:100%;"></div>' +
          '</div>' +
          '<div class="text-sm text-muted" style="margin-top:4px;">Оплата: ' + pctPaid + '%</div>' +
        '</div>' +
        '<div class="card" style="padding:10px 14px; flex:1; display:flex; flex-direction:column; justify-content:center; gap:6px;">' +
          C.btn('Переоцінити шлюз', 'btn-primary btn-sm') +
          C.btn('Ручна зміна БЛОКУВАННЯ → ДОЗВІЛ', 'btn-danger btn-sm') +
          '<div class="text-sm text-muted text-center">SLA ручної зміни: 15 хв</div>' +
        '</div>' +
      '</div>' +

      // Зона 2: Компактні кроки (merged, без дублікатного override flow)
      C.flowStepsCompact(d.steps) +

      // Зона 3: Approval gate
      '<div class="mt-12">' +
      '<table class="fsc-table"><thead><tr><th>Дія</th><th>Тип рішення</th><th>Роль</th><th>Верифікація</th><th>SLA</th></tr></thead><tbody>' +
        '<tr class="fsc-row"><td>БЛОКУВАННЯ → ДОЗВІЛ</td><td>' + C.approvalTypeBadge('PAYMENT_GATE_OVERRIDE_APPROVAL') + '</td><td>' + C.roleLabel('FINANCE_LEAD') + '</td><td>' + C.verificationModeBadge('deep') + '</td><td>15 хв</td></tr>' +
      '</tbody></table>' +
      '</div>';
  }

  // ── Full standalone page ──
  return C.pageHeader('Сценарій платіжного винятку', 'CR-04 — Часткова оплата перед видачею') +
    C.heroNotice('Сценарій платіжного винятку',
      '<strong>Для фінансиста, менеджера, складу.</strong> Часткова оплата або розбіжність перед видачею. Видача системно заблокована до підтвердження 100% оплати.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> фінансист перевіряв оплату в 1С вручну. При частковій оплаті — повідомляв менеджера листом. Менеджер зв\'язувався з клієнтом. Склад чекав усного підтвердження. Ручна зміна (видача без повної оплати) — без формального запису.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> оцінка шлюзу → рішення «БЛОКУВАННЯ» → автоматичне блокування видачі на складі → клієнтська комунікація → доплата → повторна оцінка → «ДОЗВІЛ». Ручна зміна БЛОКУВАННЯ→ДОЗВІЛ вимагає затвердження з поглибленою верифікацією. Все — в audit trail (TC-FIN-02).') +
    C.sectionHeroNotice('Виняток платіжного шлюзу',
      'Фінансовий блокер видачі вантажу. При «БЛОКУВАННІ» клієнт повинен здійснити доплату. Після підтвердження повної оплати фінансист повторно оцінює шлюз.') +

    `<div class="card mb-16" style="border-left: 4px solid var(--danger)">
      <div class="card-header"><span class="card-title">Кейс: ${C.caseLink(d.case_no)}</span> ${C.gateBadge('fail')}</div>
    </div>` +

    C.section('Кроки сценарію') +
    C.flowSteps(d.steps) +

    C.section('Потік затвердження ручної зміни') +
    C.sectionNotice('Детальний потік ручної зміни',
      'Нижче показано покрокове проходження затвердження ручної зміни платіжного шлюзу.') +
    C.flowSteps([
      { step: 1, role: 'Фінанси', action: 'Створення запиту ручної зміни БЛОКУВАННЯ → ДОЗВІЛ', status: 'completed' },
      { step: 2, role: 'Система', action: 'Запит потрапляє в Inbox рішень керівника фінансів', status: 'completed' },
      { step: 3, role: 'FINANCE_LEAD', action: 'Поглиблена верифікація (банківська виписка, сума, платник, дублікати)', status: 'in_progress' },
      { step: 4, role: 'FINANCE_LEAD', action: 'Рішення: Затвердити / Відхилити', status: 'pending' },
      { step: 5, role: 'Система', action: 'Якщо затверджено → шлюз = ДОЗВІЛ, сповіщення складу', status: 'pending' },
    ]) +

    C.section('Панель оплати в реальному часі') +
    `<div class="card" style="border-left: 4px solid var(--accent)">
      <div class="card-title">Фінансовий стан кейсу</div>
      <div class="card-grid">
        <div>
          <div class="doc-meta-row"><span class="doc-meta-label">Очікується</span><span class="doc-meta-value font-bold">${d.breakdown.currency} ${d.breakdown.expected.toLocaleString()}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Отримано</span><span class="doc-meta-value">${d.breakdown.currency} ${d.breakdown.received.toLocaleString()}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Недоплата</span><span class="doc-meta-value text-danger font-bold">${d.breakdown.currency} ${d.breakdown.shortfall.toLocaleString()}</span></div>
        </div>
        <div>
          <div class="doc-meta-row"><span class="doc-meta-label">Шлюз</span><span class="doc-meta-value">${C.gateBadge('fail')}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Остання оцінка</span><span class="doc-meta-value">2026-02-10 17:30</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Запит ручної зміни</span><span class="doc-meta-value">${C.approvalStatusBadge('pending')}</span></div>
        </div>
      </div>
      <div class="mt-8">
        <div style="background: var(--surface-2); height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: var(--danger); width: 75%; height: 100%;"></div>
        </div>
        <p class="text-sm text-muted mt-8">Прогрес оплати: 75% (€6,750 / €9,000)</p>
      </div>
    </div>
    <p class="text-center text-sm text-muted mt-8">${C.link('#/roles/finance/gate', 'Переглянути контроль шлюзу видачі →')}</p>` +

    C.section('Шлюз затвердження: Ручна зміна') +
    C.table(
      ['Дія', 'Тип рішення', 'Роль', 'Верифікація', 'SLA'],
      [
        ['Ручне БЛОКУВАННЯ → ДОЗВІЛ', C.approvalTypeBadge('PAYMENT_GATE_OVERRIDE_APPROVAL'), C.roleLabel('FINANCE_LEAD'), C.verificationModeBadge('deep'), '15 хв'],
      ]
    );
}

function renderCustomsHoldFlow(d, opts) {
  var isTab = opts && opts.isTab;
  var evidenceProvided = d.evidence_checklist.filter(function(e) { return e.provided; }).length;
  var evidenceTotal = d.evidence_checklist.length;
  var evidencePct = Math.round(evidenceProvided / evidenceTotal * 100);

  // ── Compact tab layout ──
  if (isTab) {
    return '' +
      // Зона 1: SLA countdown + actions + evidence progress
      '<div style="display:flex; gap:12px; margin-bottom:12px;">' +
        '<div class="card" style="padding:10px 14px; border-left:4px solid var(--danger); background:rgba(239,68,68,0.04); flex:2; min-width:0;">' +
          '<div class="font-bold text-sm" style="color:var(--danger);">КРИЗОВИЙ SLA — ПЕРЕВИЩЕНО</div>' +
          '<div style="display:flex; gap:16px; margin-top:6px;">' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Утримання з</span><span class="doc-meta-value text-danger font-bold">' + d.hold_since + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Минуло</span><span class="doc-meta-value text-danger font-bold">' + d.elapsed_hours + ' год</span></div>' +
            '</div>' +
            '<div style="flex:1; min-width:0;">' +
              '<div class="doc-meta-row"><span class="doc-meta-label">SLA</span><span class="doc-meta-value">4 год · ' + C.slaBadge('breached') + '</span></div>' +
              '<div class="doc-meta-row"><span class="doc-meta-label">Підтвердження</span><span class="doc-meta-value">' + evidenceProvided + '/' + evidenceTotal + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div style="background:var(--surface-2);height:6px;border-radius:3px;overflow:hidden;margin-top:8px;">' +
            '<div style="background:' + (evidenceProvided === evidenceTotal ? 'var(--success)' : 'var(--warning)') + ';width:' + evidencePct + '%;height:100%;"></div>' +
          '</div>' +
        '</div>' +
        '<div class="card" style="padding:10px 14px; flex:1; display:flex; flex-direction:column; justify-content:center; gap:6px;">' +
          C.btn('Ескалювати негайно', 'btn-danger btn-sm') +
          C.btn('Завантажити підтвердження', 'btn-primary btn-sm') +
          C.btn('Повідомити клієнта', 'btn-secondary btn-sm') +
        '</div>' +
      '</div>' +

      // Зона 2: Компактні кроки
      C.flowStepsCompact(d.steps) +

      // Зона 3: evidence checklist (inline) + approval gate
      '<div style="display:flex; gap:12px; margin-top:12px;">' +
        '<div class="card" style="padding:10px 14px; flex:1; min-width:0;">' +
          '<div class="font-bold text-sm mb-8">Чекліст підтверджень</div>' +
          '<ul class="checklist" style="margin:0; font-size:13px;">' +
            d.evidence_checklist.map(function(e) {
              return '<li class="checklist-item"><span class="check-icon ' + (e.provided ? 'checked' : 'failed') + '">' + (e.provided ? '✓' : '✗') + '</span>' + e.item + '</li>';
            }).join('') +
          '</ul>' +
        '</div>' +
        '<div class="card" style="padding:10px 14px; flex:1; min-width:0;">' +
          '<div class="font-bold text-sm mb-8">Шлюз закриття</div>' +
          '<table class="fsc-table"><thead><tr><th>Тип</th><th>Роль</th><th>SLA</th></tr></thead><tbody>' +
            '<tr class="fsc-row"><td>' + C.approvalTypeBadge('EXCEPTION_CLOSURE_APPROVAL') + '</td><td>' + C.roleLabel('OPS_LEAD') + '</td><td>30 хв</td></tr>' +
          '</tbody></table>' +
        '</div>' +
      '</div>';
  }

  // ── Full standalone page ──
  return C.pageHeader('Сценарій митного утримання', 'CR-05 — Митне утримання') +
    C.heroNotice('Сценарій винятку: митне утримання',
      '<strong>Для брокера, логіста, менеджера.</strong> Митниця затримала вантаж для огляду. Потрібна швидка координація для мінімізації затримки.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> про утримання дізнавались від брокера по телефону. Час утримання ніхто не трекав. Документи для огляду збирали ad-hoc. Ескалація — лише коли клієнт починав скаржитись на затримку.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> швидка ескалація з одного кліку. Таймер утримання показує час утримання в реальному часі. Чекліст підтверджень — перелік документів для зняття утримання. Кожна дія фіксується в timeline. Кризовий SLA (4 години) активується автоматично. Закриття вимагає затвердження закриття винятку (TC-BR-02).') +

    C.sectionHeroNotice('Митне утримання — ВИСОКА КРИТИЧНІСТЬ',
      'Митне утримання є надзвичайною ситуацією. Кожна година простою збільшує витрати. Негайна ескалація та координація обов\'язкові.') +

    C.section('Кризовий SLA зворотний відлік') +
    `<div class="card" style="border-left: 4px solid var(--danger); background: rgba(239,68,68,0.05);">
      <div class="card-title" style="color: var(--danger);">⏱ КРИЗОВИЙ SLA — ПЕРЕВИЩЕНО</div>
      <div class="card-grid">
        <div>
          <div class="doc-meta-row"><span class="doc-meta-label">Утримання з</span><span class="doc-meta-value text-danger font-bold">${d.hold_since}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Минуло часу</span><span class="doc-meta-value text-danger font-bold">${d.elapsed_hours} год</span></div>
        </div>
        <div>
          <div class="doc-meta-row"><span class="doc-meta-label">SLA ліміт</span><span class="doc-meta-value">4 год</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Перевищення</span><span class="doc-meta-value text-danger font-bold">${d.elapsed_hours - 4} год</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">SLA стан</span><span class="doc-meta-value">${C.slaBadge('breached')}</span></div>
        </div>
      </div>
      <div class="mt-8">
        <div style="background: var(--surface-2); height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: var(--danger); width: 100%; height: 100%;"></div>
        </div>
        <p class="text-sm text-danger mt-8 font-bold">SLA порушено. Ескалація активна. Негайні дії обов'язкові.</p>
      </div>
    </div>` +

    `<div class="card mb-16" style="border-left: 4px solid var(--danger)">
      <div class="card-header">
        <span class="card-title">Кейс: ${C.caseLink(d.case_no)}</span>
        ${C.severityBadge('high')}
      </div>
      <div class="doc-meta-row"><span class="doc-meta-label">Утримання з</span><span class="doc-meta-value text-danger font-bold">${d.hold_since}</span></div>
      <div class="doc-meta-row"><span class="doc-meta-label">Минуло</span><span class="doc-meta-value text-danger font-bold">${d.elapsed_hours} год</span></div>
    </div>` +

    C.section('Кроки сценарію') +
    C.flowSteps(d.steps) +

    C.section('Прогрес збору підтверджень') +
    C.sectionNotice('Доказова база',
      'Митниця може запитати будь-який з нижче перелічених документів. Чим швидше зібрано — тим скоріше вирішення.') +
    `<div class="card">
      <div class="card-title">Збір підтверджень: ${evidenceProvided}/${evidenceTotal}</div>
      <div class="mt-8">
        <div style="background: var(--surface-2); height: 12px; border-radius: 6px; overflow: hidden;">
          <div style="background: ${evidenceProvided === evidenceTotal ? 'var(--success)' : 'var(--warning)'}; width: ${(evidenceProvided / evidenceTotal * 100).toFixed(0)}%; height: 100%;"></div>
        </div>
      </div>
    </div>` +

    C.section('Чекліст підтверджень') +
    `<ul class="checklist">${d.evidence_checklist.map(function(e) {
      return '<li class="checklist-item">' +
        '<span class="check-icon ' + (e.provided ? 'checked' : 'failed') + '">' + (e.provided ? '✓' : '✗') + '</span>' +
        '<span>' + e.item + '</span>' +
      '</li>';
    }).join('')}</ul>` +

    C.actionBar('Антикризові дії', [
      { label: 'Ескалювати негайно', cls: 'btn-danger' },
      { label: 'Завантажити підтвердження', cls: 'btn-primary' },
      { label: 'Повідомити клієнта', cls: 'btn-secondary' },
    ]) +

    C.section('Шлюз затвердження: Закриття винятку') +
    C.sectionHeroNotice('Затвердження закриття винятку',
      'При звільненні від митниці закриття проходить через затвердження закриття винятку (керівник операцій). Після затвердження виняток переходить у «закрито».') +
    C.table(
      ['Дія', 'Тип рішення', 'Роль', 'Верифікація', 'SLA'],
      [
        ['Закриття критичного винятку', C.approvalTypeBadge('EXCEPTION_CLOSURE_APPROVAL'), C.roleLabel('OPS_LEAD'), C.verificationModeBadge('standard'), '30 хв'],
      ]
    );
}

// ═══════════════════════════════════════════════════════
// Диспетчер: renderFlowTab(scenarioType)
// Повертає HTML flow-діаграми для вбудовування у таб
// ═══════════════════════════════════════════════════════

var FLOW_RENDERERS = {
  happy_path:        function() { return renderHappyPathFlow(DATA.flows.data.happyPath, { isTab: true }); },
  partial_arrival:   function() { return renderPartialArrivalFlow(DATA.flows.data.partialArrival, { isTab: true }); },
  weight_mismatch:   function() { return renderWeightMismatchFlow(DATA.flows.data.weightMismatch, { isTab: true }); },
  payment_exception: function() { return renderPaymentExceptionFlow(DATA.flows.data.paymentException, { isTab: true }); },
  customs_hold:      function() { return renderCustomsHoldFlow(DATA.flows.data.customsHold, { isTab: true }); },
};

// ─── Іконки сценаріїв для pill-кнопок ───
var FLOW_SCENARIO_ICONS = {
  happy_path:        '🟢',
  partial_arrival:   '🟡',
  weight_mismatch:   '🟠',
  payment_exception: '🔴',
  customs_hold:      '⛔',
};

var _activeFlowScenario = null;

function switchFlowScenario(scenarioType) {
  _activeFlowScenario = scenarioType;
  var container = document.getElementById('flow-scenario-content');
  var switcher = document.getElementById('flow-scenario-switcher');
  var descEl = document.getElementById('flow-scenario-description');
  if (!container) return;

  // Оновити pills
  if (switcher) {
    switcher.innerHTML = buildFlowPills(scenarioType);
  }

  // Оновити опис
  if (descEl) {
    descEl.innerHTML = buildFlowDescription(scenarioType);
  }

  // Оновити контент
  var renderer = FLOW_RENDERERS[scenarioType];
  var meta = FLOW_SCENARIO_META[scenarioType];
  if (!renderer || !meta) {
    container.innerHTML = '<div class="card"><p class="text-secondary">Рендерер не знайдено.</p></div>';
    return;
  }
  container.innerHTML =
    '<div class="mb-12"><span class="badge-status info">' + meta.code + '</span> <strong>' + meta.title + '</strong> — ' + meta.subtitle + '</div>' +
    renderer();
}

function buildFlowPills(activeKey) {
  var pills = '';
  var keys = Object.keys(FLOW_SCENARIO_META);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var m = FLOW_SCENARIO_META[key];
    var icon = FLOW_SCENARIO_ICONS[key] || '';
    var isActive = key === activeKey;
    pills += '<button class="btn btn-sm ' + (isActive ? 'btn-primary' : 'btn-ghost') + '" ' +
      (isActive ? 'disabled' : 'onclick="switchFlowScenario(\'' + key + '\')"') + '>' +
      icon + ' ' + m.title + '</button>';
  }
  return pills;
}

function buildFlowDescription(scenarioType) {
  var meta = FLOW_SCENARIO_META[scenarioType];
  var icon = FLOW_SCENARIO_ICONS[scenarioType] || '';
  if (!meta) return '';
  return '<div class="text-sm text-secondary" style="margin-top:8px;">' +
    icon + ' <strong>' + meta.title + ':</strong> ' + meta.subtitle +
  '</div>';
}

function renderFlowTab(scenarioType) {
  _activeFlowScenario = scenarioType;

  // ── Pill-перемикач сценаріїв (для демо) ──
  var switcher =
    '<div class="card" style="margin-bottom:16px; border:1px dashed var(--accent); background:var(--surface-secondary);">' +
      '<div style="font-weight:600; font-size:13px; margin-bottom:8px; color:var(--accent);">Демо-сценарії (перемикач)</div>' +
      '<div id="flow-scenario-switcher" style="display:flex; gap:8px; flex-wrap:wrap;">' +
        buildFlowPills(scenarioType) +
      '</div>' +
      '<div id="flow-scenario-description">' + buildFlowDescription(scenarioType) + '</div>' +
    '</div>';

  // ── Початковий контент ──
  var meta = FLOW_SCENARIO_META[scenarioType];
  if (!meta) {
    return switcher + '<div id="flow-scenario-content"><div class="card"><p class="text-secondary">Сценарій для цього кейсу не визначено.</p></div></div>';
  }

  var renderer = FLOW_RENDERERS[scenarioType];
  var content = renderer ? renderer() : '';

  return switcher +
    '<div id="flow-scenario-content">' +
      '<div class="mb-12"><span class="badge-status info">' + meta.code + '</span> <strong>' + meta.title + '</strong> — ' + meta.subtitle + '</div>' +
      content +
    '</div>';
}

// ═══════════════════════════════════════════════════════
// Реєстрація SPA-роутів (використовують ті самі render-функції)
// ═══════════════════════════════════════════════════════

registerPages({

  '#/flows/happy-path': function() {
    return renderHappyPathFlow(DATA.flows.data.happyPath, { isTab: false });
  },

  '#/flows/partial-arrival': function() {
    return renderPartialArrivalFlow(DATA.flows.data.partialArrival, { isTab: false });
  },

  '#/flows/weight-mismatch': function() {
    return renderWeightMismatchFlow(DATA.flows.data.weightMismatch, { isTab: false });
  },

  '#/flows/payment-exception': function() {
    return renderPaymentExceptionFlow(DATA.flows.data.paymentException, { isTab: false });
  },

  '#/flows/customs-hold': function() {
    return renderCustomsHoldFlow(DATA.flows.data.customsHold, { isTab: false });
  },

});
