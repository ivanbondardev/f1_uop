/* =====================================================
   Авіалогістика Pages: AL-01..AL-04
   ===================================================== */

registerPages({

  // ─── AL-01 Робочий простір авіалогістики ───
  '#/roles/air-logistics/workspace': function() {
    const d = DATA.airLogistics.data.workspace;
    const ins = DATA.airLogistics.data.insurance;

    // Helpers
    const taskTypeLabels = { booking: 'Букінг', awb: 'AWB', prealert: 'Pre-alert', handover: 'Передача', insurance: 'Страхування' };
    const taskTypeIcons = { booking: '🎫', awb: '📄', prealert: '📡', handover: '🤝', insurance: '🛡' };
    const priorityOrder = { high: 0, medium: 1, normal: 2 };

    // Фільтровані задачі по типу (для вкладок)
    function tasksByType(type) {
      return type === 'all'
        ? d.tasks.slice().sort(function(a, b) { return (priorityOrder[a.priority] || 9) - (priorityOrder[b.priority] || 9); })
        : d.tasks.filter(function(t) { return t.type === type; });
    }

    // Рендер одного рядка задачі
    function taskRow(t) {
      var slaClass = t.sla_state === 'breached' ? 'text-danger font-bold' : (t.sla_state === 'at_risk' ? 'text-warning font-bold' : 'text-muted');
      return [
        '<span class="font-mono text-sm">' + (taskTypeIcons[t.type] || '') + ' ' + t.id + '</span>',
        C.caseLink(t.case_no),
        '<span title="' + t.title + '">' + t.title + '</span>',
        C.priorityBadge(t.priority),
        C.currentStateBadge(t.current_state),
        C.slaBadge(t.sla_state) + '<br><span class="text-sm ' + slaClass + '">' + t.sla_deadline + '</span>',
        t.blocker ? '<span class="badge-severity high">' + C.typeLabel(t.blocker) + '</span>' : '<span class="text-muted text-sm">—</span>'
      ];
    }

    // Рендер таблиці задач
    function tasksTable(tasks) {
      if (tasks.length === 0) return C.emptyState('Немає задач', 'У цій черзі наразі немає активних задач.');
      return C.table(
        ['Задача', 'Кейс', 'Опис', 'Пріоритет', 'Стан', 'SLA / Дедлайн', 'Блокер'],
        tasks.map(taskRow)
      );
    }

    // SLA summary numbers
    var slaSummary = d.sla_summary;
    var totalTasks = d.tasks.length;

    return C.pageHeader('Робочий простір авіалогістики', 'AL-01 — Управління авіаперевезеннями') +
      C.heroNotice('Робочий простір авіалогістики',
        '<strong>Для логіста авіаперевезень.</strong> Створення букінгів, підтвердження AWB, контроль ставок і маршрутів. Кожен букінг прив\'язаний до кейсу.<br><br><strong>Раніше (AS-IS):</strong> ви запитували ставки у кількох агентів листами, вручну порівнювали ціни і строки. Валідність ставки ніхто не трекав — іноді ставка протерміновувалась до підтвердження клієнта. Калькуляція релевантної ваги (фактична vs об\'ємна) — в Excel.<br><strong>Тепер у F1 (TO-BE):</strong> запити ставок відправляються шаблонами з booking board, валідність/expiry трекається системно. Калькуляція ваги і собівартості виконується в quote engine. Після підтвердження клієнта дія «create booking» синхронізує ETD/ETA через інтеграційний канал. Дані маршруту автоматично створюють downstream-задачі з SLA (TC-LOG-01).') +

      // ── SLA Overview + KPI ──
      C.statCards([
        { value: totalTasks, label: 'Активних задач', color: 'accent' },
        { value: slaSummary.on_track, label: 'SLA в нормі', color: 'success' },
        { value: slaSummary.at_risk, label: 'SLA під ризиком', color: 'warning' },
        { value: slaSummary.breached, label: 'SLA порушено', color: 'danger' },
        { value: d.queues.handover_ready, label: 'Готово до передачі', color: 'success' },
        { value: d.queues.insurance_queue, label: 'Черга страхування', color: '' }
      ]) +

      // ── Blockers Panel ──
      (d.blockers.length > 0 ? (
        '<div class="card card-accent-danger card-highlight mb-16">' +
          '<div class="card-title" style="color:var(--danger)">⚠ Блокери, що потребують уваги (' + d.blockers.length + ')</div>' +
          d.blockers.map(function(b) {
            return '<div class="doc-meta-row" style="padding:8px 0; border-bottom:1px solid var(--divider);">' +
              '<span class="doc-meta-label">' + C.caseLink(b.case_no) + ' · ' + C.severityBadge(b.severity) + '</span>' +
              '<span class="doc-meta-value">' + b.message + '</span>' +
            '</div>';
          }).join('') +
        '</div>'
      ) : '') +

      // ── Quick Navigation ──
      `<div class="card-grid" style="margin-bottom:20px;">
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/air-logistics/booking')">
          <div class="flex items-center gap-8">
            <span style="font-size:20px;">🎫</span>
            <div>
              <div class="font-bold">Букінг і AWB</div>
              <div class="text-sm text-muted">${d.queues.booking_requests} запитів · ${d.queues.awb_pending} AWB в очікуванні</div>
            </div>
          </div>
        </div>
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/air-logistics/prealert')">
          <div class="flex items-center gap-8">
            <span style="font-size:20px;">📡</span>
            <div>
              <div class="font-bold">Попередні сповіщення</div>
              <div class="text-sm text-muted">${d.queues.prealert_queue} у черзі</div>
            </div>
          </div>
        </div>
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/air-logistics/handover')">
          <div class="flex items-center gap-8">
            <span style="font-size:20px;">🤝</span>
            <div>
              <div class="font-bold">Передача до Польщі</div>
              <div class="text-sm text-muted">${d.queues.handover_ready} готові до передачі</div>
            </div>
          </div>
        </div>
      </div>` +

      // ── Insurance Quick Toggle ──
      C.insuranceQuickToggle(ins.insurance_state) +

      // ── Queue Tabs: Prioritized Task Inbox ──
      C.section('Черга задач') +
      C.sectionNotice('Пріоритизований inbox',
        'Задачі відсортовані за пріоритетом і SLA-дедлайном. Червоні — SLA порушено, жовті — під ризиком. Блокери вказують, що потребує вирішення перед просуванням кейсу.') +
      C.tabs([
        { id: 'al01-all', label: 'Усі задачі (' + d.tasks.length + ')' },
        { id: 'al01-booking', label: '🎫 Букінг (' + tasksByType('booking').length + ')' },
        { id: 'al01-awb', label: '📄 AWB (' + tasksByType('awb').length + ')' },
        { id: 'al01-prealert', label: '📡 Pre-alert (' + tasksByType('prealert').length + ')' },
        { id: 'al01-handover', label: '🤝 Передача (' + tasksByType('handover').length + ')' },
      ], 0) +
      C.tabContent('al01-all', tasksTable(tasksByType('all')), true) +
      C.tabContent('al01-booking', tasksTable(tasksByType('booking'))) +
      C.tabContent('al01-awb', tasksTable(tasksByType('awb'))) +
      C.tabContent('al01-prealert', tasksTable(tasksByType('prealert'))) +
      C.tabContent('al01-handover', tasksTable(tasksByType('handover'))) +

      // ── Today's Flights ──
      C.section('Рейси за сьогодні') +
      C.table(
        ['Рейс', 'Маршрут', 'Плановий виліт (ETD)', 'Очікуване прибуття (ETA)', 'Статус', 'Кейси'],
        d.today_flights.map(function(f) {
          return [
            '<span class="font-mono font-bold">' + f.flight + '</span>',
            f.route,
            f.etd, f.eta,
            C.statusBadge(f.status),
            '<span class="font-bold">' + f.cases + '</span>'
          ];
        })
      ) +

      // ── P0: Handover package status widget (2.3) ──
      C.section('P0: Статус Handover пакетів (2.3)') +
      C.sectionNotice('Контроль передач',
        'Кейси, готові до handover, та ризики manual fallback. Натисніть «Дошка передач» для повного огляду SH-10.') +
      C.widget('Пакети передач', `
        <div class="doc-meta-row"><span class="doc-meta-label">Готових до передачі</span><span class="doc-meta-value font-bold">${d.queues.handover_ready}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Manual fallback ризик</span><span class="doc-meta-value text-warning">1 кейс</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">System-managed</span><span class="doc-meta-value">${C.handoverChannelBadge('system-managed')}</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"'));
  },

  // ─── AL-02 Букінг і AWB ───
  '#/roles/air-logistics/booking': function() {
    const d = DATA.airLogistics.data.booking;
    const allChecksMet = d.mandatory_checks.every(c => c.met);
    return C.pageHeader('Букінг і AWB', 'AL-02 — Букінг та підтвердження AWB') +
      C.heroNotice('Керування букінгом і AWB',
        '<strong>Для логіста авіаперевезень.</strong> Створення букінгів, підтвердження AWB, контроль ставок і маршрутів. Кожен букінг прив\'язаний до кейсу.<br><br><strong>Раніше (AS-IS):</strong> ви запитували ставки у кількох агентів листами, вручну порівнювали ціни і строки. Валідність ставки ніхто не трекав — іноді ставка протерміновувалась до підтвердження клієнта. Калькуляція релевантної ваги (фактична vs об\'ємна) — в Excel.<br><strong>Тепер у F1 (TO-BE):</strong> запити ставок відправляються шаблонами з booking board, валідність/expiry трекається системно. Калькуляція ваги і собівартості виконується в quote engine. Після підтвердження клієнта дія «create booking» синхронізує ETD/ETA через інтеграційний канал. Дані маршруту автоматично створюють downstream-задачі з SLA (TC-LOG-01).') +
      // ── SLA Display ──
      C.section('SLA контроль') +
      `<div class="card">
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Дедлайн підтвердження букінгу</span><span class="doc-meta-value">${d.sla_booking_deadline}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Дедлайн перевірки AWB</span><span class="doc-meta-value">${d.sla_awb_review_deadline}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">SLA стан</span><span class="doc-meta-value">${C.slaBadge(d.sla_state)}</span></div>
          </div>
        </div>
      </div>` +

      // ── Carrier Options ──
      C.section('Варіанти перевізників') +
      C.sectionNotice('Порівняння перевізників',
        'Оберіть оптимальний маршрут з урахуванням ставки, часу в дорозі та рівня обслуговування. Обраний варіант буде зафіксовано в букінгу.') +
      C.table(
        ['ID', 'Перевізник', 'Рейс', 'Маршрут', 'ETD', 'ETA', 'Ставка/кг', 'Транзит', 'Примітки', 'Статус'],
        d.carrier_options.map(co => [
          `<span class="font-mono">${co.id}</span>`,
          co.carrier,
          `<span class="font-mono">${co.flight}</span>`,
          co.route,
          co.etd, co.eta,
          `$${co.rate_per_kg}`,
          `${co.transit_days} дн.`,
          co.service_notes,
          co.selected ? '<span class="badge-status done">Обраний</span>' : '<span class="badge-status pending">Доступний</span>'
        ])
      ) +

      // ── Booking Details ──
      C.section('Поточний букінг') +
      `<div class="card">
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">${C.caseLink(d.case_no)}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Агент</span><span class="doc-meta-value">${d.agent}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Авіакомпанія / Рейс</span><span class="doc-meta-value">${d.airline} — ${d.flight}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Маршрут</span><span class="doc-meta-value">${d.route}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Плановий виліт (ETD)</span><span class="doc-meta-value">${d.etd}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">AWB</span><span class="doc-meta-value font-mono">${d.awb_number}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Статус AWB</span><span class="doc-meta-value">${C.statusBadge(d.awb_status)}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.pieces}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Фактична вага</span><span class="doc-meta-value">${d.weight_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Об'ємна вага</span><span class="doc-meta-value">${d.volume_weight_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Тарифна вага</span><span class="doc-meta-value font-bold">${d.chargeable_weight_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Ставка</span><span class="doc-meta-value">$${d.rate_per_kg}/кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Референс букінгу</span><span class="doc-meta-value font-mono">${d.booking_ref}</span></div>
          </div>
        </div>
      </div>` +

      // ── MAWB / HAWB Split View ──
      C.section('MAWB / HAWB розділений перегляд') +
      C.sectionNotice('Перевірка авіанакладних',
        'MAWB і HAWB перевіряються окремо. Розбіжності між полями виділяються для ручної верифікації. Затвердження MAWB є обов\'язковою передумовою для відправки попереднього сповіщення.') +
      `<div class="card-grid">
        <div class="card">
          <div class="card-title">MAWB: <span class="font-mono">${d.mawb.number}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Відправник</span><span class="doc-meta-value">${d.mawb.shipper}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Одержувач</span><span class="doc-meta-value">${d.mawb.consignee}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Відправлення</span><span class="doc-meta-value">${d.mawb.origin}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Призначення</span><span class="doc-meta-value">${d.mawb.destination}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.mawb.weight_kg} кг</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.mawb.pieces}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Опис товару</span><span class="doc-meta-value">${d.mawb.description}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Оголошена вартість</span><span class="doc-meta-value">${d.mawb.declared_value || '—'}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">${C.statusBadge(d.mawb.status)}</span></div>
        </div>
        <div class="card">
          <div class="card-title">HAWB: <span class="font-mono">${d.hawb.number}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Відправник</span><span class="doc-meta-value">${d.hawb.shipper}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Одержувач</span><span class="doc-meta-value">${d.hawb.consignee}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Адреса одержувача</span><span class="doc-meta-value">${d.hawb.consignee_address}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Телефон одержувача</span><span class="doc-meta-value">${d.hawb.consignee_phone}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Сторона сповіщення</span><span class="doc-meta-value">${d.hawb.notify_party}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.hawb.weight_kg} кг</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.hawb.pieces}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Опис товару</span><span class="doc-meta-value">${d.hawb.description}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">${C.statusBadge(d.hawb.status)}</span></div>
        </div>
      </div>` +

      // ── Consignee Validation Panel ──
      C.section('Валідація консигнатора') +
      `<div class="card" style="border-left: 4px solid var(--accent)">
        <div class="card-title">Перевірка даних одержувача (HAWB)</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Ім'я</span><span class="doc-meta-value">${d.hawb.consignee}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Адреса</span><span class="doc-meta-value">${d.hawb.consignee_address}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Телефон</span><span class="doc-meta-value">${d.hawb.consignee_phone}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Відповідність базі клієнтів</span><span class="doc-meta-value"><span class="badge-status done">Відповідає</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Notify Party</span><span class="doc-meta-value">${d.hawb.notify_party}</span></div>
        <p class="text-sm text-muted mt-8">Дані одержувача верифіковано автоматично проти бази клієнтів. Ручна перевірка потрібна при розбіжностях.</p>
      </div>` +

      // ── Mandatory Checks ──
      C.section('Обов\'язкові перевірки') +
      C.sectionNotice('Чекліст перед підтвердженням',
        'Усі обов\'язкові перевірки повинні бути пройдені перед затвердженням MAWB. Незадовільні перевірки блокують дію «Затвердити MAWB».') +
      C.table(
        ['Перевірка', 'Результат'],
        d.mandatory_checks.map(mc => [
          mc.item,
          mc.met
            ? '<span class="badge-status done">✓ Пройдено</span>'
            : '<span class="badge-status blocked">✗ Не пройдено</span>'
        ])
      ) +

      (!allChecksMet ? `<div class="card mt-8" style="border-left: 4px solid var(--danger)">
        <p class="text-danger font-bold">⚠ Не всі обов'язкові перевірки пройдені. Затвердження MAWB заблоковано.</p>
        <p class="text-sm text-muted">Необхідно виправити: ${d.mandatory_checks.filter(c => !c.met).map(c => c.item).join(', ')}</p>
      </div>` : '') +

      // ── Actions ──
      C.actionBar('Дії з букінгом і AWB', [
        { label: 'Затвердити MAWB', cls: 'btn-primary', disabled: !allChecksMet, onclick: "openModal('approve-mawb')" },
        { label: 'Запит корекції HAWB', cls: 'btn-secondary', onclick: "openModal('hawb-correction')" },
        { label: 'Підтвердити AWB пакет', cls: 'btn-primary' },
        { label: 'Редагувати букінг', cls: 'btn-secondary' },
        { label: 'Скасувати букінг', cls: 'btn-danger' },
      ]) +

      // ── Approve MAWB Modal ──
      C.modal('approve-mawb', 'Затвердження MAWB',
        `<p>Ви затверджуєте MAWB <strong class="font-mono">${d.mawb.number}</strong> для кейсу ${d.case_no}.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Маршрут</span><span class="doc-meta-value">${d.route}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.mawb.weight_kg} кг</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.mawb.pieces}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Перевірки пройдені</span><span class="doc-meta-value">${d.mandatory_checks.filter(c => c.met).length}/${d.mandatory_checks.length}</span></div>
        </div>
        ${C.formGroup('Коментар (необов\'язково)', C.formInput('Додатковий коментар до затвердження...'))}
        <p class="text-sm text-muted mt-8">Після затвердження MAWB зміни потребують повторної перевірки.</p>`,
        C.btn('Затвердити', 'btn-primary', 'onclick="closeModal(\'approve-mawb\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'approve-mawb\')"')
      ) +

      // ── HAWB Correction Modal ──
      C.modal('hawb-correction', 'Запит корекції HAWB',
        `<p>Формування запиту на корекцію HAWB <strong class="font-mono">${d.hawb.number}</strong>.</p>
        ${C.formGroup('Тип помилки', C.formSelect([
          { value: '', label: '— Оберіть тип —' },
          { value: 'consignee', label: 'Невірний одержувач' },
          { value: 'weight', label: 'Розбіжність ваги' },
          { value: 'pieces', label: 'Розбіжність кількості місць' },
          { value: 'address', label: 'Невірна адреса' },
          { value: 'description', label: 'Невірний опис товару' },
          { value: 'other', label: 'Інше' }
        ]))}
        ${C.formGroup('Опис помилки', '<textarea class="form-textarea" rows="3" placeholder="Детальний опис знайденої розбіжності..."></textarea>')}
        ${C.formGroup('Очікувана правильна інформація', C.formInput('Вкажіть правильні дані...'))}
        <p class="text-sm text-muted mt-8">Запит корекції буде надіслано агенту/авіакомпанії. Статус HAWB зміниться на «Очікує корекції».</p>`,
        C.btn('Надіслати запит', 'btn-primary', 'onclick="closeModal(\'hawb-correction\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'hawb-correction\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Розбіжність ваги MAWB/HAWB:</strong> Якщо вага в MAWB не збігається з HAWB, система підсвічує це в обов'язкових перевірках (${!allChecksMet ? '<span class="text-danger">поточний стан — є розбіжність</span>' : 'розбіжностей немає'}).</li>
          <li><strong>Зміна AWB після підтвердження:</strong> Повторна зміна AWB після затвердження MAWB скидає статус і потребує нового циклу перевірки.</li>
          <li><strong>Скасований рейс:</strong> Якщо рейс скасований, букінг переходить в стан «потребує перебукування» з автоматичним сповіщенням задіяних ролей.</li>
          <li><strong>Консигнатор не знайдений:</strong> Якщо дані одержувача HAWB не збігаються з базою клієнтів, потрібна ручна верифікація менеджером продажів.</li>
        </ul>
      </div>` +

      // ── UI States Demo ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'al02-loading', label: 'Завантаження' },
        { id: 'al02-empty', label: 'Порожній стан' },
        { id: 'al02-error', label: 'Помилка' },
      ]) +
      C.tabContent('al02-loading', C.skeleton(3, 6)) +
      C.tabContent('al02-empty', C.emptyState('Немає активних букінгів', 'Створіть новий букінг для кейсу через кнопку «Створити букінг».')) +
      C.tabContent('al02-error', C.errorState('Помилка завантаження букінгу', 'Не вдалося завантажити дані букінгу. Перевірте з\'єднання та спробуйте ще раз.')) +

      // ── Audit Trail Demo ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-12 09:30', actor: 'Ольга М. (Авіалогістика)', event: 'BookingCreated', detail: 'Створено букінг BK-20260211-003 — PS802 PVG→KBP', reason_code: 'BOOKING_NEW', correlation_id: 'corr-bk-135' },
        { ts: '2026-02-12 10:00', actor: 'Ольга М. (Авіалогістика)', event: 'AWBConfirmed', detail: 'AWB 074-98765432 підтверджено', reason_code: 'AWB_CONFIRMED', correlation_id: 'corr-bk-135' },
        { ts: '2026-02-12 10:15', actor: 'Система', event: 'MandatoryCheckFailed', detail: 'Перевірка ваги не пройдена: фактична 980 кг vs об\'ємна 1120 кг', reason_code: 'CHECK_FAIL_WEIGHT', correlation_id: 'corr-bk-135' },
      ]);
  },

  // ─── AL-03 Розсилка попереднього сповіщення ───
  '#/roles/air-logistics/prealert': function() {
    const d = DATA.airLogistics.data.prealert;
    const bk = DATA.airLogistics.data.booking;
    const allRequiredAttached = d.required_attachments.filter(a => a.required).every(a => a.status === 'attached');
    const hasAllRecipients = d.recipients_matrix.length >= 3;

    return C.pageHeader('Розсилка попереднього сповіщення', 'AL-03 — Розсилка попереднього сповіщення пакетів') +
      C.heroNotice('Попереднє сповіщення',
        '<strong>Для логіста авіаперевезень.</strong> Формування та відправка pre-alert пакету брокеру та експедитору. Без повного пакету відправка заблокована.<br><br><strong>Раніше (AS-IS):</strong> ви вручну компілювали pre-alert лист із вкладеннями (інвойс, пакувальний лист, AWB). Інформацію про митного власника і next-leg owner вписували текстом у лист. Часто забували прикласти обов\'язковий документ, що зупиняло процес.<br><strong>Тепер у F1 (TO-BE):</strong> pre-alert формується у builder-шаблоні з auto-validation обов\'язкових полів та пакетних вкладень. Інформація про одержувачів задається в структурованій recipients matrix. Звірка драфтів AWB виконується через checklist і discrepancy-правила. Handover блокується, доки packet не має статус «ready» (TC-LOG-02).') +
      // ── Pre-Alert Template Preview ──
      C.section('Попередній перегляд сповіщення') +
      C.sectionNotice('Шаблон повідомлення',
        'Система автоматично заповнює шаблон попереднього сповіщення даними кейсу. Перегляньте контент перед відправкою.') +
      `<div class="card" style="border-left: 4px solid var(--accent)">
        <div class="card-title">Шаблон попереднього сповіщення</div>
        <div style="background: var(--surface-2); padding: var(--space-12); border-radius: var(--radius); margin-top: var(--space-8); font-size: 0.85rem;">
          <p><strong>Кейс:</strong> ${d.case_no}</p>
          <p><strong>AWB:</strong> ${bk.awb_number}</p>
          <p><strong>Маршрут:</strong> ${bk.route}</p>
          <p><strong>ETD:</strong> ${bk.etd}</p>
          <p><strong>ETA:</strong> ${d.eta}</p>
          <p><strong>Місця / вага:</strong> ${bk.pieces} місць / ${bk.weight_kg} кг</p>
          <p><strong>Особливі інструкції:</strong> <span class="text-warning">${d.special_instructions}</span></p>
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          <p><strong>Маршрутна нотатка:</strong> Митне оформлення — KBP-T1 (Брокер: Дмитро С.). Наступна ділянка: автовивіз KBP → Київський склад (Автологістика: Андрій К.).</p>
        </div>
      </div>` +

      `<div class="card">
        <div class="card-title">Попереднє сповіщення: ${C.caseLink(d.case_no)}</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Очікуване прибуття (ETA)</span><span class="doc-meta-value">${d.eta}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Особливі інструкції</span><span class="doc-meta-value text-warning">${d.special_instructions}</span></div>
      </div>` +

      C.section('Матриця одержувачів') +
      C.table(
        ['Роль', 'Відповідальний', 'Причина розсилки'],
        d.recipients_matrix.map(r => [
          `<span class="font-bold">${r.role}</span>`,
          r.person,
          r.reason
        ])
      ) +

      // ── Route Note ──
      C.section('Маршрутна нотатка') +
      `<div class="card">
        ${C.formGroup('Хто здійснює митне оформлення', C.formInput('Брокер: Дмитро С. — KBP-T1', 'Брокер: Дмитро С. — KBP-T1'))}
        ${C.formGroup('Наступна ділянка маршруту', C.formInput('Автовивіз KBP → Київський склад', 'Автовивіз KBP → Київський склад'))}
        ${C.formGroup('Додаткові нотатки', '<textarea class="form-textarea" rows="2" placeholder="Додаткова інформація для одержувачів..."></textarea>')}
      </div>` +

      C.section('Обов\'язкові вкладення') +
      C.table(
        ['Документ', 'Статус', 'Обов\'язковий'],
        d.required_attachments.map(a => [
          a.doc,
          a.status === 'attached'
            ? '<span class="badge-status done">Прикріплено</span>'
            : '<span class="badge-status blocked">Відсутній</span>',
          a.required ? '<span class="text-danger font-bold">Так</span>' : 'Ні'
        ])
      ) +

      (!allRequiredAttached ? `<div class="card mt-8" style="border-left: 4px solid var(--danger)">
        <p class="text-danger font-bold">⚠ Не всі обов'язкові документи прикріплені. Відправка попереднього сповіщення заблокована.</p>
      </div>` : '') +

      // ── Validate Completeness ──
      C.section('Перевірка повноти') +
      `<div class="card">
        <div class="card-title">Результат валідації</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Обов'язкові документи</span><span class="doc-meta-value">${allRequiredAttached ? '<span class="badge-status done">Повний комплект</span>' : '<span class="badge-status blocked">Неповний</span>'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Одержувачі</span><span class="doc-meta-value">${hasAllRecipients ? '<span class="badge-status done">Усі призначені</span>' : '<span class="badge-status blocked">Є пропущені ролі</span>'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">AWB номер</span><span class="doc-meta-value">${bk.awb_status === 'confirmed' ? '<span class="badge-status done">Підтверджений</span>' : '<span class="badge-status blocked">Не підтверджений</span>'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">ETA заповнено</span><span class="doc-meta-value"><span class="badge-status done">Так</span></span></div>
      </div>` +

      // Quick Template Selector (docs/20)
      C.section('Швидкий вибір шаблону повідомлення') +
      C.sectionNotice('Шаблонні повідомлення',
        'Типові повідомлення складу/клієнту автоматично заповнюються даними кейсу (case_no, AWB, ETA, контакти). Оберіть шаблон за типом кейсу/маршруту.') +
      C.templateMessageBtn('prealert', d.case_no) +

      C.actionBar('Дії з попереднім сповіщенням', [
        { label: 'Перевірити повноту', cls: 'btn-secondary', onclick: "openModal('validate-completeness')" },
        { label: 'Надіслати попереднє сповіщення', cls: 'btn-primary', disabled: !allRequiredAttached, onclick: "openModal('dispatch-confirm')" },
        { label: 'Повторно надіслати', cls: 'btn-secondary' },
        { label: 'Надіслати шаблон складу/клієнту', cls: 'btn-secondary', onclick: "openModal('template-msg')" },
        { label: 'Додати документ', cls: 'btn-secondary' },
      ]) +

      // ── Dispatch Confirmation Modal ──
      C.modal('dispatch-confirm', 'Підтвердження відправки попереднього сповіщення',
        `<p>Ви відправляєте попереднє сповіщення для кейсу <strong>${d.case_no}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Одержувачі</span><span class="doc-meta-value">${d.recipients_matrix.map(r => r.role).join(', ')}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Документи</span><span class="doc-meta-value">${d.required_attachments.filter(a => a.status === 'attached').length} прикріплено</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">ETA</span><span class="doc-meta-value">${d.eta}</span></div>
        </div>
        <p class="text-sm text-warning mt-8">⚠ Після відправки буде автоматично створено задачі для кожної ролі-одержувача.</p>`,
        C.btn('Підтвердити відправку', 'btn-primary', 'onclick="closeModal(\'dispatch-confirm\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'dispatch-confirm\')"')
      ) +

      // ── Validate Completeness Modal ──
      C.modal('validate-completeness', 'Результат перевірки повноти',
        `<div class="mt-8">
          <h3>Перевірка документів</h3>
          ${d.required_attachments.map(a =>
            `<div class="doc-meta-row"><span class="doc-meta-label">${a.doc} ${a.required ? '(обов.)' : '(опц.)'}</span><span class="doc-meta-value">${a.status === 'attached' ? '<span class="badge-status done">✓</span>' : '<span class="badge-status blocked">✗</span>'}</span></div>`
          ).join('')}
          <h3 class="mt-8">Перевірка одержувачів</h3>
          ${d.recipients_matrix.map(r =>
            `<div class="doc-meta-row"><span class="doc-meta-label">${r.role}: ${r.person}</span><span class="doc-meta-value"><span class="badge-status done">✓ Призначений</span></span></div>`
          ).join('')}
          <h3 class="mt-8">Перевірка формату AWB</h3>
          <div class="doc-meta-row"><span class="doc-meta-label">AWB ${bk.awb_number}</span><span class="doc-meta-value"><span class="badge-status done">✓ Валідний формат IATA</span></span></div>
        </div>`,
        C.btn('Закрити', 'btn-ghost', 'onclick="closeModal(\'validate-completeness\')"')
      ) +

      C.modal('template-msg', 'Шаблонне повідомлення',
        C.templateMessageModalContent('prealert', d.case_no),
        C.btn('Надіслати', 'btn-primary', 'onclick="closeModal(\'template-msg\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'template-msg\')"')
      ) +

      C.modal('insurance-request', 'Запит страхування',
        '<p>Ви ініціюєте запит на страхування для кейсу.</p>' +
        '<p class="text-sm text-muted mt-8">Запит буде надіслано через API. Результат з\'явиться у timeline.</p>',
        C.btn('Запросити', 'btn-primary', 'onclick="closeModal(\'insurance-request\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'insurance-request\')"')
      ) +

      // ── Error States Demo ──
      C.section('Error States (демо)') +
      `<div class="card">
        <div class="card-title">Можливі помилки при відправці</div>
        <ul>
          <li><strong>MISSING_ATTACHMENT:</strong> Обов'язковий документ відсутній — блокує відправку.</li>
          <li><strong>MISSING_RECIPIENT:</strong> Не призначено одержувача для обов'язкової ролі — блокує відправку.</li>
          <li><strong>INVALID_AWB_FORMAT:</strong> AWB номер не відповідає формату IATA — потрібна корекція.</li>
          <li><strong>DUPLICATE_PREALERT:</strong> Попереднє сповіщення вже відправлено — потрібно використовувати «Повторно надіслати».</li>
        </ul>
      </div>`;
  },

  // ─── AL-04 Передача до Польщі ───
  '#/roles/air-logistics/handover': function() {
    const d = DATA.airLogistics.data.handover;
    const allDone = d.checklist.every(i => i.done);
    return C.pageHeader('Чекліст передачі', 'AL-04 — Передача відповідальності') +
      C.heroNotice('Контрольна точка передачі',
        '<strong>Для логіста авіаперевезень.</strong> Чекліст готовності до передачі кейсу Брокеру та Автологістиці. Передача можлива тільки при виконаних prerequisites.<br><br><strong>Раніше (AS-IS):</strong> ви писали лист брокеру або автологісту «кейс готовий, дивіться вкладення». Часто частина документів була не оновлена, а отримувач не підтверджував прийом. Загублені передачі виявлялись лише при зриві SLA.<br><strong>Тепер у F1 (TO-BE):</strong> handover виконується через системний канал з явним SLA, каналом і підтвердженням прийому. Отримувач підтверджує (ack) або відхиляє передачу з причиною. Failed handover автоматично створює задачу. Всі передачі пишуться в timeline кейсу (TC-LOG-02).') +
      C.sectionHeroNotice('Шлюз передачі',
        'Це критична точка передачі відповідальності. Переконайтеся, що всі документи підтверджені та ролі-отримувачі готові.') +
      C.sectionNotice('Перевірка',
        'Статус передачі визначається автоматично на основі чекліста. Усі пункти мають бути виконані для дозволу передачі.') +

      `<div class="card">
        <div class="card-header">
          <span class="card-title">Передача: ${C.caseLink(d.case_no)}</span>
          ${C.statusBadge(d.handover_status === 'ready' ? 'done' : 'pending')}
        </div>
        ${C.checklist(d.checklist)}
      </div>` +

      // ── Handover Recipients Status ──
      C.section('Статус ролей-отримувачів') +
      C.table(
        ['Роль-отримувач', 'Готовність', 'Канал передачі', 'SLA'],
        [
          ['Брокер — Дмитро С.', '<span class="badge-status done">Готовий</span>', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track')],
          ['Автологістика — Андрій К.', '<span class="badge-status done">Готовий</span>', C.handoverChannelBadge('system-managed'), C.slaBadge('on_track')],
        ]
      ) +

      C.actionBar('Дії передачі', [
        { label: 'Підтвердити передачу', cls: 'btn-primary', disabled: !allDone, onclick: "openModal('confirm-handover')" },
        { label: 'Позначити інцидент', cls: 'btn-danger', onclick: "openModal('handover-incident')" },
      ]) +

      // ── Confirm Handover Modal ──
      C.modal('confirm-handover', 'Підтвердження передачі',
        `<p>Ви підтверджуєте передачу кейсу <strong>${d.case_no}</strong> до наступних ролей.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Пунктів чекліста виконано</span><span class="doc-meta-value">${d.checklist.filter(i => i.done).length}/${d.checklist.length}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Брокер</span><span class="doc-meta-value">Дмитро С. — готовий</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Автологістика</span><span class="doc-meta-value">Андрій К. — готовий</span></div>
        </div>
        <p class="text-sm text-warning mt-8">⚠ Після підтвердження передачі відповідальність переходить до ролей-отримувачів. Дія фіксується в хронології.</p>`,
        C.btn('Підтвердити передачу', 'btn-primary', 'onclick="closeModal(\'confirm-handover\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'confirm-handover\')"')
      ) +

      // ── Handover Incident Modal ──
      C.modal('handover-incident', 'Позначити інцидент передачі',
        `${C.formGroup('Тип інциденту', C.formSelect([
          { value: '', label: '— Оберіть тип —' },
          { value: 'doc_rejected', label: 'Документ відхилено отримувачем' },
          { value: 'role_unavailable', label: 'Роль-отримувач недоступна' },
          { value: 'data_mismatch', label: 'Розбіжність даних' },
          { value: 'system_error', label: 'Технічна помилка каналу' },
          { value: 'other', label: 'Інше' }
        ]))}
        ${C.formGroup('Опис інциденту', '<textarea class="form-textarea" rows="3" placeholder="Детальний опис проблеми передачі..."></textarea>')}
        <p class="text-sm text-muted mt-8">Інцидент буде зафіксовано в хронології та створено задачу для вирішення.</p>`,
        C.btn('Зберегти інцидент', 'btn-danger', 'onclick="closeModal(\'handover-incident\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'handover-incident\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Частковий чекліст:</strong> Якщо не всі пункти виконані, кнопка «Підтвердити передачу» заблокована. ${!allDone ? '<span class="text-warning">(поточний стан)</span>' : ''}</li>
          <li><strong>Роль-отримувач недоступна:</strong> Якщо брокер або автологіст позначений як «відсутній», система пропонує вибрати заміну або ескалювати на керівника.</li>
          <li><strong>Системний канал недоступний:</strong> При недоступності system-managed каналу автоматичний fallback на зовнішній (email/Zammad) з відповідною позначкою.</li>
          <li><strong>Повторна передача:</strong> Якщо передача вже була здійснена, але потребує повторення (наприклад, після корекції), система створює нову версію з посиланням на попередню.</li>
        </ul>
      </div>` +

      // ── Audit Trail Demo ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-11 09:00', actor: 'Ольга М. (Авіалогістика)', event: 'HandoverInitiated', detail: 'Ініціювано передачу кейсу F1-2026-00142 до Брокер + Автологістика', reason_code: 'HANDOVER_INIT', correlation_id: 'corr-ho-142' },
        { ts: '2026-02-11 09:05', actor: 'Система', event: 'ChecklistValidated', detail: 'Чекліст передачі: 5/5 виконано', reason_code: 'CHECKLIST_PASS', correlation_id: 'corr-ho-142' },
        { ts: '2026-02-11 09:10', actor: 'Дмитро С. (Брокер)', event: 'HandoverAcknowledged', detail: 'Брокер підтвердив готовність прийняти кейс', reason_code: 'HANDOVER_ACK', correlation_id: 'corr-ho-142' },
        { ts: '2026-02-11 09:12', actor: 'Андрій К. (Автологістика)', event: 'HandoverAcknowledged', detail: 'Автологістика підтвердила готовність', reason_code: 'HANDOVER_ACK', correlation_id: 'corr-ho-142' },
      ]);
  },

});
