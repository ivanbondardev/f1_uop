/* =====================================================
   Автологістика Pages: RL-01..RL-04
   ===================================================== */

registerPages({

  // ─── RL-01 Робочий простір автологістики ───
  '#/roles/road-logistics/workspace': function() {
    const d = DATA.roadLogistics.data.workspace;
    return C.pageHeader('Робочий простір автологістики', 'RL-01 — Управління автоперевезеннями') +
      C.heroNotice('Робочий простір автологістики',
        '<strong>Для автологіста.</strong> Планування авто, відстеження руху, перетин кордону та доставка. Контроль автопарку від призначення до підтвердження доставки.<br><br><strong>Раніше (AS-IS):</strong> ви отримували завдання від логіста по телефону або email. Підбір перевізника — в Excel, дані авто/водія передавали листом. Стан руху авто через кордон уточнювали по телефону. Завершення доставки повідомляли листом бухгалтерії і менеджеру.<br><strong>Тепер у F1 (TO-BE):</strong> задача truck planning приходить із повним payload одразу після handover. Carrier planning console з контролем outlier-ризиків. Дані авто/водія публікуються брокеру/експедитору автоматично. Border timeline з авто-ескалацією по SLA. ETA оновлюється як подія кейсу (TC-AUTO-01, TC-AUTO-02).') +
      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card">${C.link('#/roles/road-logistics/truck-planning', '📅 Планування авто →')}</div>
        <div class="card">${C.link('#/roles/road-logistics/border', '🛂 Контроль кордону →')}</div>
        <div class="card">${C.link('#/roles/road-logistics/delivery', '📦 Закриття доставки →')}</div>
      </div>` +

      C.statCards([
        { value: d.queues.planning_needed, label: 'Потрібно планування', color: 'accent' },
        { value: d.queues.in_transit, label: 'У транзиті', color: '' },
        { value: d.queues.border_crossing, label: 'Перетин кордону', color: 'warning' },
        { value: d.queues.delivery_pending, label: 'Доставка в очікуванні', color: '' },
      ]) +

      C.section('Автопарк сьогодні') +
      C.table(
        ['Авто', 'Водій', 'Маршрут', 'Статус', 'Очікуване прибуття (ETA)', 'Кейси'],
        d.fleet_today.map(f => [
          `<span class="font-mono font-bold">${f.truck}</span>`, f.driver,
          f.route, C.statusBadge(f.status === 'border' ? 'pending' : (f.status === 'delivering' ? 'in_progress' : f.status)),
          f.eta, f.cases.map(c => C.caseLink(c)).join(', ')
        ])
      ) +

      // P0: Incoming handovers widget (2.3)
      C.section('P0: Вхідні передачі (2.3)') +
      C.widget('Вхідні передачі', `
        <div class="doc-meta-row"><span class="doc-meta-label">Очікують прийому</span><span class="doc-meta-value font-bold text-warning">2</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Downstream handover → Accounting</span><span class="doc-meta-value">${C.handoverChannelBadge('system-managed')}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">SLA at_risk</span><span class="doc-meta-value">${C.slaBadge('at_risk')} 1 передача</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"'));
  },

  // ─── RL-02 Планування авто ───
  '#/roles/road-logistics/truck-planning': function() {
    const d = DATA.roadLogistics.data.truckPlanning;
    return C.pageHeader('Планування авто', 'RL-02 — Планування автоперевезень') +
      C.heroNotice('Планування авто',
        '<strong>Для автологіста.</strong> Призначення транспорту та водія для кейсу: пункти, тип транспорту, часові вікна. Оптимізація маршрутів та автопарку.<br><br><strong>Раніше (AS-IS):</strong> ви вибирали перевізника по ціні/доступності з особистих контактів або Excel-списку. Ціну не порівнювали з ринковою нормою. Дані авто/водія вносили в лист і пересилали брокеру та менеджеру вручну.<br><strong>Тепер у F1 (TO-BE):</strong> підбір перевізника ведеться в carrier planning console з контролем ціни, ETA та ризиків. Outlier-ціна вимагає reason-code при lock плану. Дані авто/водія вносяться у structured форму і автоматично публікуються як handover-артефакт брокеру та експедитору. CMR керується через packet/version у Document Hub (TC-AUTO-01).') +
      // ── SLA & Lock Status ──
      C.section('SLA та статус блокування') +
      `<div class="card">
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">SLA стан</span><span class="doc-meta-value">${C.slaBadge(d.sla_state)}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Дедлайн планування</span><span class="doc-meta-value">${d.sla_deadline}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">План заблокований</span><span class="doc-meta-value">${d.plan_locked ? '<span class="badge-status done">🔒 Заблоковано</span>' : '<span class="badge-status pending">🔓 Відкрито</span>'}</span></div>
            ${d.plan_locked ? `<div class="doc-meta-row"><span class="doc-meta-label">Заблокував</span><span class="doc-meta-value">${d.locked_by} о ${d.locked_at}</span></div>` : ''}
            <div class="doc-meta-row"><span class="doc-meta-label">Маршрут підтверджено</span><span class="doc-meta-value">${d.route_confirmed ? '<span class="badge-status done">Так</span>' : '<span class="badge-status blocked">Ні</span>'}</span></div>
          </div>
        </div>
      </div>` +

      // ── Carrier Comparison Table ──
      C.section('Порівняння перевізників') +
      C.sectionNotice('Вибір перевізника',
        'Оберіть оптимальний варіант з урахуванням ціни, часу доставки та додаткових можливостей. Обраний перевізник фіксується в плані.') +
      C.table(
        ['ID', 'Перевізник', 'Транспорт', 'Ціна (UAH)', 'ETA (год)', 'Примітки', 'Водій', 'Авто', 'Статус'],
        d.carrier_options.map(co => [
          `<span class="font-mono">${co.id}</span>`,
          co.carrier,
          co.vehicle,
          co.price_uah.toLocaleString(),
          co.eta_hours,
          co.notes,
          co.driver || '—',
          co.truck || '—',
          co.status === 'selected'
            ? '<span class="badge-status done">Обраний</span>'
            : co.status === 'backup'
              ? '<span class="badge-status pending">Резервний</span>'
              : '<span class="badge-status">Доступний</span>'
        ])
      ) +

      // ── Plan Details ──
      C.section('Деталі плану') +
      `<div class="card">
        <div class="card-title">Планування: ${C.caseLink(d.case_no)}</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Пункт завантаження</span><span class="doc-meta-value">${d.pickup_point}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Пункт доставки</span><span class="doc-meta-value">${d.delivery_point}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.weight_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.pieces}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Тип транспорту</span><span class="doc-meta-value">${d.vehicle_type}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Авто</span><span class="doc-meta-value font-mono">${d.assigned_truck}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Водій</span><span class="doc-meta-value">${d.assigned_driver}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Відправлення</span><span class="doc-meta-value">${d.planned_departure}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Очікуване прибуття (ETA)</span><span class="doc-meta-value">${d.planned_arrival}</span></div>
          </div>
        </div>
      </div>` +

      // ── Route Confirmation Blocker ──
      (!d.route_confirmed ? `<div class="card mt-8" style="border-left: 4px solid var(--danger)">
        <p class="text-danger font-bold">⚠ Маршрут не підтверджено. Відправка заблокована.</p>
        <p class="text-sm text-muted">Підтвердіть маршрут після перевірки пунктів завантаження/доставки та наявності необхідних документів.</p>
      </div>` : '') +

      C.actionBar('Дії планування', [
        { label: 'Підтвердити відправку', cls: 'btn-primary', disabled: !d.route_confirmed },
        { label: d.plan_locked ? 'Розблокувати план' : 'Заблокувати план', cls: 'btn-secondary', onclick: d.plan_locked ? "openModal('unlock-plan')" : '' },
        { label: 'Змінити авто', cls: 'btn-secondary', disabled: d.plan_locked, onclick: "openModal('change-truck')" },
        { label: 'Перепризначити водія', cls: 'btn-secondary', disabled: d.plan_locked },
      ]) +

      // ── Unlock Plan (change-after-lock) Modal ──
      C.modal('unlock-plan', 'Розблокування плану',
        `<p>Ви розблоковуєте план для кейсу <strong>${d.case_no}</strong>. Це дозволить зміни після блокування.</p>
        ${C.formGroup('Причина розблокування', C.formSelect([
          { value: '', label: '— Оберіть причину —' },
          { value: 'truck_breakdown', label: 'Поломка транспорту' },
          { value: 'driver_unavailable', label: 'Водій недоступний' },
          { value: 'route_change', label: 'Зміна маршруту (клієнт)' },
          { value: 'weight_change', label: 'Зміна ваги/габаритів вантажу' },
          { value: 'schedule_conflict', label: 'Конфлікт розкладу' },
          { value: 'other', label: 'Інша причина' },
        ]))}
        ${C.formGroup('Детальний опис', '<textarea class="form-textarea" rows="3" placeholder="Опишіть причину розблокування..."></textarea>')}
        <p class="text-sm text-warning mt-8">⚠ Зміна після блокування фіксується в аудит-трейлі з reason_code.</p>`,
        C.btn('Розблокувати', 'btn-primary', 'onclick="closeModal(\'unlock-plan\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'unlock-plan\')"')
      ) +

      // ── Change Truck Modal ──
      C.modal('change-truck', 'Зміна транспорту',
        `<p>Зміна авто для кейсу <strong>${d.case_no}</strong>.</p>
        ${C.formGroup('Новий перевізник', C.formSelect(d.carrier_options.map(co => ({ value: co.id, label: co.carrier + ' — ' + co.vehicle + ' (' + co.price_uah + ' UAH)' }))))}
        ${C.formGroup('Причина зміни', '<textarea class="form-textarea" rows="2" placeholder="Чому потрібна зміна..."></textarea>')}`,
        C.btn('Змінити', 'btn-primary', 'onclick="closeModal(\'change-truck\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'change-truck\')"')
      ) +

      // ── Edge Cases ──
      C.section('Edge Cases (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Зміна після блокування:</strong> ${d.plan_locked ? '<span class="text-warning">План заблоковано</span>. Зміни потребують розблокування з обов\'язковою причиною.' : 'План відкритий для змін.'}</li>
          <li><strong>Перевантаження авто:</strong> Якщо вага вантажу перевищує максимально допустиму для обраного транспорту, система блокує призначення.</li>
          <li><strong>Недоступність водія:</strong> При відсутності водія — система пропонує резервний варіант або ескалацію.</li>
          <li><strong>Температурний режим:</strong> Якщо кейс потребує рефрижератора, звичайний тентований транспорт блокується.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'rl02-loading', label: 'Завантаження' },
        { id: 'rl02-empty', label: 'Порожній стан' },
      ]) +
      C.tabContent('rl02-loading', C.skeleton(3, 6)) +
      C.tabContent('rl02-empty', C.emptyState('Немає активних планувань', 'Планування буде створено після отримання попереднього сповіщення.'));
  },

  // ─── RL-03 Контроль кордону ───
  '#/roles/road-logistics/border': function() {
    const d = DATA.roadLogistics.data.borderTracking;
    return C.pageHeader('Контроль кордону', 'RL-03 — Відстеження перетину кордону') +
      C.heroNotice('Контроль кордону',
        '<strong>Для автологіста.</strong> Моніторинг руху авто через кордон: позиція, статус перевірки, час проходження. Координація з Брокером.<br><br><strong>Раніше (AS-IS):</strong> ви дізнавались стан авто на кордоні по телефону від водія або перевізника. Затримки виявляли із запізненням. Менеджера і брокера інформували вручну, коли пам\'ятали.<br><strong>Тепер у F1 (TO-BE):</strong> рух авто фіксується статусами (pre-border → at-border → under-inspection → crossed) у border timeline з auto-escalation по SLA. ETA оновлюється як подія кейсу — автоматично підсвічує готовність задач брокера/складу без ручного повідомлення (TC-AUTO-01).') +
      C.sectionHeroNotice('Перетин кордону',
        'Перетин кордону є критичною точкою передачі. Документи повинні відповідати вимогам обох митниць. Затримки впливають на всі наступні SLA.') +
      C.sectionNotice('Координація',
        'Брокер та Автологістика працюють паралельно на кордоні. Події фіксуються в хронології для повного аудиту.') +

      // ── SLA Timer ──
      C.section('SLA таймер кордону') +
      `<div class="card" style="border-left: 4px solid var(--warning)">
        <div class="card-title">⏱ SLA контроль перетину кордону</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Прибуття на кордон</span><span class="doc-meta-value">${d.arrival_at_border}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Очікуване проходження</span><span class="doc-meta-value">${d.estimated_clearance}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Час на кордоні</span><span class="doc-meta-value font-bold text-warning">5 год 30 хв</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">SLA стан</span><span class="doc-meta-value">${C.slaBadge('at_risk')}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">SLA ліміт</span><span class="doc-meta-value">8 год</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Залишок</span><span class="doc-meta-value font-bold">2 год 30 хв</span></div>
          </div>
        </div>
      </div>` +

      `<div class="card">
        <div class="card-title">Кордон: ${C.caseLink(d.case_no)}</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Пост</span><span class="doc-meta-value">${d.border_post}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Авто</span><span class="doc-meta-value font-mono">${d.truck}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Водій</span><span class="doc-meta-value">${d.driver}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Стан</span><span class="doc-meta-value">${C.currentStateBadge(d.current_state)}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Статус кейсу</span><span class="doc-meta-value">${C.caseStatusBadge(d.case_status)}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Черга</span><span class="doc-meta-value">#${d.queue_position}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Орієнтовне проходження</span><span class="doc-meta-value">${d.estimated_clearance}</span></div>
          </div>
        </div>
      </div>` +

      // ── Driver Communication Panel ──
      C.section('Комунікація з водієм') +
      C.sectionNotice('Канал зв\'язку',
        'Комунікація з водієм через шаблонні повідомлення. Фіксується в хронології кейсу.') +
      `<div class="card">
        <div class="card-title">Панель зв\'язку з водієм</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Водій</span><span class="doc-meta-value">${d.driver}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Останній контакт</span><span class="doc-meta-value">${d.events[0]?.ts || '—'}</span></div>
        <div class="mt-8">
          ${C.btn('📞 Зателефонувати', 'btn-secondary')} 
          ${C.btn('📋 Шаблон: статус кордону', 'btn-secondary', 'onclick="openModal(\'driver-template\')"')} 
          ${C.btn('📋 Шаблон: затримка', 'btn-secondary')}
        </div>
      </div>` +

      // ── Customs Check Status ──
      C.section('Статус митної перевірки') +
      `<div class="card">
        <div class="card-title">Митна перевірка на кордоні</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Документи подано</span><span class="doc-meta-value"><span class="badge-status done">Так</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Статус перевірки</span><span class="doc-meta-value">${C.currentStateBadge(d.current_state)}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Позиція у черзі</span><span class="doc-meta-value">#${d.queue_position}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Фізичний огляд</span><span class="doc-meta-value"><span class="badge-status pending">Не ініційовано</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Координація з Брокером</span><span class="doc-meta-value"><span class="badge-status done">Активна</span></span></div>
      </div>` +

      C.section('Події на кордоні') +
      C.timeline(d.events.map(e => ({
        ts: e.ts, actor: 'Автологістика', event: 'BorderEvent', detail: e.event
      }))) +

      C.actionBar('Дії на кордоні', [
        { label: 'Оновити статус', cls: 'btn-primary', onclick: "openModal('update-border-status')" },
        { label: 'Повідомити про затримку', cls: 'btn-danger', onclick: "openModal('border-delay')" },
        { label: 'Зв\'язатися з водієм', cls: 'btn-secondary' },
      ]) +

      // ── Update Border Status Modal ──
      C.modal('update-border-status', 'Оновлення статусу кордону',
        `${C.formGroup('Новий статус', C.formSelect([
          { value: 'CUSTOMS_CHECK', label: 'Митна перевірка' },
          { value: 'DOCUMENTS_SUBMITTED', label: 'Документи подано' },
          { value: 'INSPECTION_INITIATED', label: 'Огляд ініційовано' },
          { value: 'CLEARED', label: 'Пропущено' },
          { value: 'REJECTED', label: 'Відмовлено' },
        ]))}
        ${C.formGroup('Коментар', '<textarea class="form-textarea" rows="2" placeholder="Додаткова інформація..."></textarea>')}`,
        C.btn('Оновити', 'btn-primary', 'onclick="closeModal(\'update-border-status\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'update-border-status\')"')
      ) +

      // ── Border Delay Modal ──
      C.modal('border-delay', 'Повідомлення про затримку',
        `<p class="text-danger font-bold">Затримка на кордоні для кейсу ${d.case_no}</p>
        ${C.formGroup('Причина затримки', C.formSelect([
          { value: '', label: '— Оберіть причину —' },
          { value: 'queue', label: 'Велика черга' },
          { value: 'inspection', label: 'Додатковий огляд' },
          { value: 'docs', label: 'Проблеми з документами' },
          { value: 'technical', label: 'Технічна проблема (система митниці)' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Очікуваний час вирішення', C.formInput('Наприклад: +2 години'))}
        <p class="text-sm text-warning mt-8">⚠ Сповіщення про затримку буде надіслано залученим ролям (Брокер, Продажі).</p>`,
        C.btn('Повідомити', 'btn-danger', 'onclick="closeModal(\'border-delay\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'border-delay\')"')
      ) +

      // ── Driver Template Modal ──
      C.modal('driver-template', 'Шаблон повідомлення водію',
        `<div style="background: var(--surface-2); padding: var(--space-12); border-radius: var(--radius);">
          <p><strong>Водій:</strong> ${d.driver}</p>
          <p><strong>Кейс:</strong> ${d.case_no}</p>
          <p><strong>Пост:</strong> ${d.border_post}</p>
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          <p>Доброго дня, ${d.driver}! Повідомте, будь ласка, актуальний статус на кордоні ${d.border_post}. Поточна позиція у черзі: #${d.queue_position}.</p>
        </div>`,
        C.btn('Надіслати', 'btn-primary', 'onclick="closeModal(\'driver-template\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'driver-template\')"')
      ) +

      // ── Edge Cases ──
      C.section('Edge Cases (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>SLA breached:</strong> Якщо час на кордоні перевищує ліміт — автоматична ескалація на керівника логістики.</li>
          <li><strong>Відмова на кордоні:</strong> При відмові у перетині — створюється виняток, кейс блокується, формується задача для брокера.</li>
          <li><strong>Зміна маршруту:</strong> Якщо потрібно змінити кордонний пост — план потрібно розблокувати та перепланувати.</li>
          <li><strong>Водій не відповідає:</strong> Якщо водій не відповідає на зв'язок протягом 1 години — автоматична ескалація.</li>
        </ul>
      </div>`;
  },

  // ─── RL-04 Закриття доставки ───
  '#/roles/road-logistics/delivery': function() {
    const d = DATA.roadLogistics.data.deliveryClosure;
    const allDone = d.checklist.every(i => i.done);
    return C.pageHeader('Закриття доставки', 'RL-04 — Закриття доставки') +
      C.heroNotice('Закриття доставки',
        '<strong>Для автологіста.</strong> Фінальний етап: підтвердження прийому, підпис POD, фото, прикріплення фінальної CMR та відправка оригіналів.<br><br><strong>Раніше (AS-IS):</strong> після доставки ви писали email бухгалтерії «рейс закритий, потрібна довідка/рахунок» і прикладали CMR. Якщо підписаної заявки не було — дізнавались про це пізніше від бухгалтера. Стан оплати перевіряли запитом до фінансів.<br><strong>Тепер у F1 (TO-BE):</strong> закриття крок доставки автоматично створює бухгалтерії задачу на довідку/рахунок. Фактичні дані рейсу подаються через delivery closure форму з обов\'язковими полями і вкладенням CMR. Наявність підписаної заявки — автоматичний blocker. Доставка/видача дозволяється тільки при payment_gate=pass. Підтвердження доставки (POD/CMR) запускає наступні задачі на акт/закриття (TC-AUTO-02).') +
      C.sectionHeroNotice('Шлюз доставки — обов\'язкова фінальна CMR',
        'Без прикріпленої фінальної CMR закриття доставки ЗАБЛОКОВАНО. POD є юридичним документом — переконайтеся у правильності підпису. Фінальна CMR фіксує всі параметри перевезення.') +
      C.sectionNotice('Відправка оригіналів',
        'Після закриття доставки необхідно ініціювати процес відправки оригіналів документів. Це окремий крок, який фіксується в чеклісті.') +

      `<div class="card">
        <div class="card-title">Доставка: ${C.caseLink(d.case_no)}</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Адреса</span><span class="doc-meta-value">${d.delivery_address}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Отримувач</span><span class="doc-meta-value">${d.recipient}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Прибуття</span><span class="doc-meta-value">${d.actual_arrival}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Підпис отримувача (POD)</span><span class="doc-meta-value">${d.pod_signed ? '✅ Підписано' : '❌ Не підписано'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Фінальна CMR</span><span class="doc-meta-value">${d.final_cmr_attached ? '✅ Прикріплена' : '<span class="text-danger font-bold">❌ Не прикріплена — БЛОКЕР</span>'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Відправка оригіналів</span><span class="doc-meta-value">${d.originals_dispatch_started ? '✅ Ініційовано' : '⏳ Очікує'}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Примітки</span><span class="doc-meta-value">${d.notes}</span></div>
      </div>` +

      (!d.final_cmr_attached ? `<div class="card mt-8" style="border-left: 4px solid var(--danger)">
        <p class="text-danger font-bold">⚠ Фінальна CMR не прикріплена. Закриття доставки заблоковано до прикріплення фінальної CMR.</p>
      </div>` : '') +

      C.section('Чекліст закриття') +
      C.checklist(d.checklist) +

      // ── Originals Dispatch Form ──
      C.section('Відправка оригіналів') +
      C.sectionNotice('Процес відправки',
        'Оригінали документів (CMR, POD, акти) відправляються поштою або кур\'єром. Фіксується трек-номер та дата відправки.') +
      `<div class="card">
        <div class="card-title">Форма відправки оригіналів</div>
        ${C.formGroup('Спосіб відправки', C.formSelect([
          { value: 'courier', label: 'Кур\'єрська служба (Нова Пошта)' },
          { value: 'ukrposhta', label: 'Укрпошта (рекомендований лист)' },
          { value: 'internal', label: 'Внутрішня логістика' },
        ]))}
        ${C.formGroup('Трек-номер', C.formInput('Введіть трек-номер після відправки...'))}
        ${C.formGroup('Дата відправки', C.formInput('', '2026-02-12'))}
        ${C.formGroup('Перелік документів', '<textarea class="form-textarea" rows="3" placeholder="CMR (фінальна)\nPOD (підписаний)\nАкт прийому-передачі"></textarea>')}
      </div>` +

      // ── CMR Closure Gate ──
      C.section('CMR Closure Gate') +
      C.sectionHeroNotice('Шлюз закриття CMR',
        'CMR закривається тільки після перевірки всіх обов\'язкових полів: фактична вага, кількість місць, підписи, дати. Невідповідності блокують закриття.') +
      `<div class="card">
        <div class="card-title">Перевірка фінальної CMR</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Фактична вага (кг)</span><span class="doc-meta-value font-bold">1238 кг</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Кількість місць</span><span class="doc-meta-value font-bold">48</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Підпис відправника</span><span class="doc-meta-value"><span class="badge-status done">Є</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Підпис отримувача</span><span class="doc-meta-value"><span class="badge-status done">Є</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Підпис перевізника</span><span class="doc-meta-value"><span class="badge-status done">Є</span></span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">CMR закрита</span><span class="doc-meta-value">${d.checklist.find(i => i.item.includes('CMR закрито'))?.done ? '<span class="badge-status done">Так</span>' : '<span class="badge-status blocked">Ні</span>'}</span></div>
      </div>` +

      // ── Approval Touchpoint: DOC_FINALIZATION ──
      C.section('Approval Touchpoints') +
      C.sectionHeroNotice('DOC_FINALIZATION_APPROVAL',
        'Фіналізація документів (CMR) є критичною дією, яка потребує approval для HIGH ризикових кейсів. Зміна фінальної CMR після закриття — неможлива.') +
      C.table(
        ['Тригер', 'Approval type', 'Роль', 'Верифікація'],
        [
          ['Фіналізація CMR після доставки', C.approvalTypeBadge('DOC_FINALIZATION_APPROVAL'), C.roleLabel('ROAD_LOGISTICS'), C.verificationModeBadge('standard')],
        ]
      ) +

      C.actionBar('Дії закриття', [
        { label: 'Завершити доставку', cls: 'btn-primary', disabled: !d.final_cmr_attached || !allDone, onclick: "openModal('complete-delivery')" },
        { label: 'Прикріпити фінальну CMR', cls: 'btn-secondary', onclick: "openModal('attach-cmr')" },
        { label: 'Ініціювати відправку оригіналів', cls: 'btn-secondary', disabled: !d.final_cmr_attached, onclick: "openModal('dispatch-originals')" },
        { label: 'Повідомити про інцидент', cls: 'btn-danger' },
      ]) +

      // ── Complete Delivery Modal ──
      C.modal('complete-delivery', 'Завершення доставки',
        `<p>Ви завершуєте доставку для кейсу <strong>${d.case_no}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Отримувач</span><span class="doc-meta-value">${d.recipient}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">POD підписано</span><span class="doc-meta-value">${d.pod_signed ? 'Так' : 'Ні'}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Чекліст</span><span class="doc-meta-value">${d.checklist.filter(i => i.done).length}/${d.checklist.length} виконано</span></div>
        </div>
        <p class="text-sm text-warning mt-8">⚠ Після завершення доставки кейс переходить на фінальний етап. Ця дія потребує DOC_FINALIZATION_APPROVAL.</p>`,
        C.btn('Завершити', 'btn-primary', 'onclick="closeModal(\'complete-delivery\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'complete-delivery\')"')
      ) +

      // ── Attach CMR Modal ──
      C.modal('attach-cmr', 'Прикріплення фінальної CMR',
        `<p>Завантажте фінальну версію CMR для кейсу <strong>${d.case_no}</strong>.</p>
        ${C.formGroup('Файл CMR', '<input type="file" class="form-input" accept=".pdf,.jpg,.png" disabled>')}
        ${C.formGroup('Версія', C.formInput('v3 (фінальна)'))}
        ${C.formGroup('Коментар', C.formInput('Фінальна CMR після фактичного зважування'))}
        <p class="text-sm text-muted mt-8">Після завантаження CMR пройде валідацію обов'язкових полів.</p>`,
        C.btn('Завантажити', 'btn-primary', 'onclick="closeModal(\'attach-cmr\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'attach-cmr\')"')
      ) +

      // ── Dispatch Originals Modal ──
      C.modal('dispatch-originals', 'Ініціювання відправки оригіналів',
        `<p>Ініціювання відправки оригіналів документів для кейсу <strong>${d.case_no}</strong>.</p>
        ${C.formGroup('Спосіб відправки', C.formSelect([
          { value: 'courier', label: 'Кур\'єрська служба' },
          { value: 'ukrposhta', label: 'Укрпошта' },
          { value: 'internal', label: 'Внутрішня логістика' },
        ]))}
        ${C.formGroup('Документи до відправки', '<textarea class="form-textarea" rows="3" placeholder="CMR, POD, акти..."></textarea>')}
        <p class="text-sm text-muted mt-8">Трек-номер можна додати після фактичної відправки.</p>`,
        C.btn('Ініціювати', 'btn-primary', 'onclick="closeModal(\'dispatch-originals\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'dispatch-originals\')"')
      ) +

      // ── Audit Trail ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-11 15:45', actor: 'Петренко В. (Водій)', event: 'DeliveryArrived', detail: 'Прибуття на адресу доставки: ' + d.delivery_address, reason_code: 'DELIVERY_ARRIVAL', correlation_id: 'corr-del-136' },
        { ts: '2026-02-11 16:00', actor: 'Мартинюк І. (Отримувач)', event: 'PODSigned', detail: 'POD підписано отримувачем', reason_code: 'POD_SIGNED', correlation_id: 'corr-del-136' },
        { ts: '2026-02-11 16:15', actor: 'Андрій К. (Автологістика)', event: 'CMRAttached', detail: 'Фінальна CMR v3 прикріплена', reason_code: 'CMR_FINAL', correlation_id: 'corr-del-136' },
        { ts: '2026-02-11 16:20', actor: 'Андрій К. (Автологістика)', event: 'CMRClosed', detail: 'CMR закрита — всі підписи та параметри перевірені', reason_code: 'CMR_CLOSED', correlation_id: 'corr-del-136' },
      ]);
  },

});
