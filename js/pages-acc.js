/* =====================================================
   Бухгалтерія Pages: AC-01..AC-04
   ===================================================== */

registerPages({

  // ─── AC-01 Робочий простір бухгалтерії ───
  '#/roles/accounting/workspace': function() {
    const d = DATA.accounting.data.workspace;
    return C.pageHeader('Робочий простір бухгалтерії', 'AC-01 — Бухгалтерський облік операцій') +
      C.heroNotice('Робочий простір бухгалтерії',
        '<strong>Для бухгалтера (2 особи).</strong> Довідки транспортних витрат, рахунки клієнтам та агентам. Контроль фінансового документообігу кейсів від прибуття до закриття.<br><br><strong>Раніше (AS-IS):</strong> ви дізнавались про завершення рейсу з email від логіста. Дані рейсу (маршрут, дати, суми) шукали в різних листах та 1С. Підписану заявку — запитували у менеджера. Рахунок і довідку витрат формували вручну в Excel/1С.<br><strong>Тепер у F1 (TO-BE):</strong> закриття доставки автоматично створює вам задачу з повним payload рейсу. Наявність підписаної заявки — системний blocker. Довідка витрат рахується в редакторі AC-02 з валідацією документів. Рахунок клієнту — в AC-03, де 100% передоплата контролюється системно (TC-ACC-01, TC-ACC-02).') +
      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card">${C.link('#/roles/accounting/cost-cert', '📊 Довідка витрат →')}</div>
        <div class="card">${C.link('#/roles/accounting/customer-inv', '🧾 Рахунки клієнтам →')}</div>
        <div class="card">${C.link('#/roles/accounting/agent-inv', '📩 Рахунки агентів →')}</div>
      </div>` +

      C.statCards([
        { value: d.queues.cost_certs_pending, label: 'Довідки витрат в очікуванні', color: 'accent' },
        { value: d.queues.customer_invoices_draft, label: 'Чернетки рахунків клієнтам', color: 'warning' },
        { value: d.queues.agent_invoices_incoming, label: 'Рахунки агентів', color: '' },
        { value: d.queues.completed_today, label: 'Завершено сьогодні', color: 'success' },
      ]) +

      // P0: Single-entry queue widget (2.1)
      C.section('P0: Черга Single-Entry (2.1)') +
      C.widget('Єдиний ввід — черга', `
        <div class="doc-meta-row"><span class="doc-meta-label">Покриття єдиним вводом</span><span class="doc-meta-value font-bold">82%</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Конфлікти дублювання</span><span class="doc-meta-value text-danger font-bold">3</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Ручні overrides сьогодні</span><span class="doc-meta-value text-warning">4</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Готово до sync 1С</span><span class="doc-meta-value">12 записів</span></div>
      `, C.btn('Single-Entry Console →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/accounting-single-entry\')"')) +

      // P0: System-managed handover from SH-10
      C.widget('System-managed Handover', `
        <div class="doc-meta-row"><span class="doc-meta-label">Вхідні handover від фінансів</span><span class="doc-meta-value font-bold">2</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Канал</span><span class="doc-meta-value">${C.handoverChannelBadge('system-managed')}</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-secondary', 'onclick="navigate(\'#/shared/handover-board\')"')) +

      C.section('Термінові позиції') +
      C.table(
        ['Кейс', 'Тип', 'Примітка', 'Пріоритет'],
        d.urgent_items.map(u => [
          C.caseLink(u.case_no), C.typeLabel(u.type), u.note, C.priorityBadge(u.priority)
        ])
      );
  },

  // ─── AC-02 Довідка витрат ───
  '#/roles/accounting/cost-cert': function() {
    const d = DATA.accounting.data.costCertificate;
    const allPrereqs = d.prerequisites.every(p => p.met);

    return C.pageHeader('Довідка транспортних витрат', 'AC-02 — Довідка транспортних витрат') +
      C.heroNotice('Довідка витрат',
        '<strong>Для бухгалтера.</strong> Формування довідки транспортних витрат: збір витратних позицій із первинних документів, розрахунок суми у гривнях.<br><br><strong>Раніше (AS-IS):</strong> ви збирали витрати з різних джерел: email із сумою агента, 1С із митними платежами, записки логіста. Конвертацію валют робили вручну. Якщо підписаної заявки не було — дізнавались про це вже в процесі роботи.<br><strong>Тепер у F1 (TO-BE):</strong> система автоматично перевіряє наявність підписаної заявки як blocker prerequisite. Довідка рахується в редакторі з валідацією source-docs і правил валюти/курсу. Реквізити підтягуються з Document Hub. Довідка публікується як approved версія packet, а брокер/менеджер отримують нотифікації (TC-ACC-01).') +
      C.sectionHeroNotice('Передумови формування довідки',
        'Без виконаних передумов довідка витрат не може бути підтверджена. Підписана заявка клієнта є обов\'язковим документом у кейсі.') +
      C.sectionNotice('Блокери',
        'Відсутність підписаної заявки або неповний комплект первинних документів блокує підтвердження довідки витрат.') +

      `<div class="card">
        <div class="card-header">
          <span class="card-title">Довідка витрат: ${C.caseLink(d.case_no)}</span>
          ${C.statusBadge(d.status)}
        </div>
        <p class="text-secondary mb-8">Клієнт: ${d.client}</p>
      </div>` +

      C.section('Чекліст передумов') +
      `<ul class="checklist">${d.prerequisites.map(p =>
        `<li class="checklist-item">
          <span class="check-icon ${p.met ? 'checked' : 'failed'}">${p.met ? '✓' : '✗'}</span>
          <span>${p.item}</span>
        </li>`
      ).join('')}</ul>` +

      C.section('Позиції витрат') +
      C.table(
        ['Опис', 'Валюта', 'Сума', 'Первинний документ', 'Дії'],
        d.line_items.map((li, idx) => [
          li.description, li.currency,
          li.amount.toLocaleString(undefined, {minimumFractionDigits: 2}),
          `<span class="font-mono text-sm">${li.source_doc}</span>`,
          C.btn('Редагувати', 'btn-sm btn-ghost', 'onclick="openModal(\'edit-line-item\')"')
        ])
      ) +

      `<div class="card mt-16">
        <div class="flex justify-between">
          <span class="font-bold">Разом (UAH)</span>
          <span class="font-bold" style="font-size:18px">₴${d.total_uah.toLocaleString()}</span>
        </div>
        <div class="doc-meta-row"><span class="doc-meta-label">Курс (USD/UAH)</span><span class="doc-meta-value">${d.fx_rate_usd}</span></div>
      </div>` +

      // ── FX Rate Source Panel ──
      C.section('Джерело валютного курсу') +
      C.sectionNotice('Контроль курсу',
        'Курс конвертації визначається правилом: НБУ на дату операції. Ручний override потребує FX_DECISION_APPROVAL.') +
      `<div class="card">
        <div class="card-title">Валютний курс</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Поточний курс USD/UAH</span><span class="doc-meta-value font-bold">${d.fx_rate_usd}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Джерело</span><span class="doc-meta-value">НБУ на 2026-02-11</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Дата фіксації</span><span class="doc-meta-value">2026-02-11 09:30</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Курс агента</span><span class="doc-meta-value">41.55 (відхилення +0.35)</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Правило</span><span class="doc-meta-value">НБУ на дату операції (дефолт)</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Override</span><span class="doc-meta-value"><span class="badge-status pending">Не застосовано</span></span></div>
          </div>
        </div>
      </div>` +

      // ── Export Preview ──
      C.section('Попередній перегляд експорту') +
      `<div class="card" style="border-left: 4px solid var(--accent)">
        <div class="card-title">Попередній перегляд ПДФ</div>
        <div style="background: var(--surface-2); padding: var(--space-12); border-radius: var(--radius); margin-top: var(--space-8); font-size: 0.85rem;">
          <p><strong>ДОВІДКА ТРАНСПОРТНИХ ВИТРАТ</strong></p>
          <p>Кейс: ${d.case_no} | Клієнт: ${d.client}</p>
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          ${d.line_items.map(li => `<p>${li.description}: ${li.amount.toLocaleString()} ${li.currency} (${li.source_doc})</p>`).join('')}
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          <p><strong>РАЗОМ: ₴${d.total_uah.toLocaleString()}</strong></p>
          <p>Курс USD/UAH: ${d.fx_rate_usd} (НБУ)</p>
        </div>
      </div>` +

      C.actionBar('Дії з довідкою', [
        { label: 'Підтвердити довідку', cls: 'btn-primary', disabled: !allPrereqs },
        { label: 'Запросити корекцію', cls: 'btn-secondary' },
        { label: 'Додати позицію', cls: 'btn-secondary', onclick: "openModal('add-line-item')" },
        { label: 'Експорт у ПДФ', cls: 'btn-ghost' },
      ]) +

      // ── Edit Line Item Modal ──
      C.modal('edit-line-item', 'Редагування позиції витрат',
        `${C.formGroup('Опис', C.formInput('Авіаперевезення PVG-KBP', 'Авіаперевезення PVG-KBP'))}
        ${C.formGroup('Валюта', C.formSelect([
          { value: 'UAH', label: 'UAH' },
          { value: 'USD', label: 'USD' },
          { value: 'EUR', label: 'EUR' },
        ]))}
        ${C.formGroup('Сума', C.formInput('3100.00', '3100.00'))}
        ${C.formGroup('Первинний документ', C.formInput('AWB 074-12345678', 'AWB 074-12345678'))}
        <p class="text-sm text-muted mt-8">Зміна позиції перерахує загальну суму довідки.</p>`,
        C.btn('Зберегти', 'btn-primary', 'onclick="closeModal(\'edit-line-item\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'edit-line-item\')"')
      ) +

      // ── Add Line Item Modal ──
      C.modal('add-line-item', 'Додавання позиції витрат',
        `${C.formGroup('Опис', C.formInput('Введіть опис витрати...'))}
        ${C.formGroup('Валюта', C.formSelect([
          { value: 'UAH', label: 'UAH' },
          { value: 'USD', label: 'USD' },
          { value: 'EUR', label: 'EUR' },
        ]))}
        ${C.formGroup('Сума', C.formInput('0.00'))}
        ${C.formGroup('Первинний документ', C.formInput('Референс документу...'))}`,
        C.btn('Додати', 'btn-primary', 'onclick="closeModal(\'add-line-item\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'add-line-item\')"')
      ) +

      // ── Audit Trail ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-11 08:00', actor: 'Тетяна В. (Бухгалтерія)', event: 'CostCertCreated', detail: 'Створено довідку витрат для ' + d.case_no, reason_code: 'CERT_NEW', correlation_id: 'corr-cc-142' },
        { ts: '2026-02-11 09:30', actor: 'Система', event: 'FXRateFixed', detail: 'Зафіксовано курс USD/UAH = ' + d.fx_rate_usd + ' (НБУ)', correlation_id: 'corr-cc-142' },
      ]);
  },

  // ─── AC-03 Рахунки клієнтам ───
  '#/roles/accounting/customer-inv': function() {
    const d = DATA.accounting.data.customerInvoice;
    return C.pageHeader('Рахунки клієнтам', 'AC-03 — Рахунки клієнтам') +
      C.heroNotice('Рахунки клієнтам',
        '<strong>Для бухгалтера.</strong> Формування та видача рахунків клієнтам на основі довідки витрат. Обов\'язкові передумови: підписана заявка, підтверджена довідка, правило 100% передоплати.<br><br><strong>Раніше (AS-IS):</strong> ви формували рахунок в 1С вручну, вписуючи суми з довідки витрат. Контроль передоплати — перевіряли в 1С або питали у фінансиста. Рахунок клієнту відправляв менеджер листом. Якщо клієнт сплачував частково — дізнавались при спробі закрити кейс.<br><strong>Тепер у F1 (TO-BE):</strong> рахунок формується в AC-03, де 100% передоплата і blocker-умови контролюються системно. При фінансових конфліктах — approval gate. Рахунок і сума митних платежів відправляються клієнту через Communication Panel з прив\'язкою до кейсу та дедлайном оплати (TC-ACC-01).') +
      C.sectionHeroNotice('Передумови виставлення рахунку',
        'Рахунок є критичним фінансовим документом. Без виконаних передумов виставлення заблоковано. Перевірте чекліст нижче.') +
      C.sectionNotice('Правило оплати',
        'Рахунок виставляється з умовою 100% передоплати. Видача вантажу можлива тільки після підтвердженої повної оплати.') +

      `<div class="card">
        <div class="card-header">
          <span class="card-title">Рахунок: ${d.invoice_no}</span>
          ${C.statusBadge(d.status)}
        </div>
        <div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">${C.caseLink(d.case_no)}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Клієнт</span><span class="doc-meta-value">${d.client}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Передумови</span><span class="doc-meta-value">${d.prerequisites_met ? '<span class="text-success">✅ Усе виконано</span>' : '<span class="text-danger">❌ Не виконано</span>'}</span></div>
      </div>` +

      C.section('Чекліст передумов') +
      `<ul class="checklist">${d.prerequisites.map(p =>
        `<li class="checklist-item">
          <span class="check-icon ${p.met ? 'checked' : 'failed'}">${p.met ? '✓' : '✗'}</span>
          <span>${p.item}</span>
        </li>`
      ).join('')}</ul>` +

      C.section('Позиції рахунку') +
      C.table(
        ['Опис', 'Сума (UAH)'],
        d.items.map(i => [i.description, `₴${i.amount.toLocaleString()}`])
      ) +

      `<div class="card mt-8">
        <div class="flex justify-between">
          <span class="font-bold">Разом</span>
          <span class="font-bold" style="font-size:18px">₴${d.amount.toLocaleString()} ${d.currency}</span>
        </div>
      </div>` +

      // ── Preview Modal Trigger ──
      C.section('Попередній перегляд') +
      `<div class="card" style="border-left: 4px solid var(--accent)">
        <div style="background: var(--surface-2); padding: var(--space-12); border-radius: var(--radius); font-size: 0.85rem;">
          <p><strong>РАХУНОК №${d.invoice_no}</strong></p>
          <p>Кейс: ${d.case_no} | Клієнт: ${d.client}</p>
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          ${d.items.map(i => `<p>${i.description}: ₴${i.amount.toLocaleString()}</p>`).join('')}
          <hr style="border-color: var(--border); margin: var(--space-8) 0;">
          <p><strong>РАЗОМ: ₴${d.amount.toLocaleString()} ${d.currency}</strong></p>
          <p>Умови: 100% передоплата</p>
        </div>
      </div>` +

      // ── Linked Approvals Display ──
      C.section('Пов\'язані рішення') +
      C.sectionNotice('Історія рішень',
        'Рахунок може мати пов\'язані approval-рішення (OCR верифікація, фіналізація документів).') +
      C.table(
        ['ID', 'Тип', 'Статус', 'Рішення', 'Дата'],
        [
          ['APR-199', C.approvalTypeBadge('INVOICE_CAPTURE_APPROVAL'), C.approvalStatusBadge('pending'), '—', '2026-02-11 08:00'],
        ]
      ) +

      C.actionBar('Дії з рахунком', [
        { label: 'Виставити рахунок', cls: 'btn-primary', disabled: !d.prerequisites_met, onclick: "openModal('issue-invoice')" },
        { label: 'Редагувати чернетку', cls: 'btn-secondary' },
        { label: 'Попередній перегляд ПДФ', cls: 'btn-ghost', onclick: "openModal('preview-invoice')" },
      ]) +

      // ── Issue Invoice Modal ──
      C.modal('issue-invoice', 'Виставлення рахунку',
        `<p>Ви виставляєте рахунок <strong>${d.invoice_no}</strong> клієнту <strong>${d.client}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Сума</span><span class="doc-meta-value">₴${d.amount.toLocaleString()}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">${d.case_no}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Передумови</span><span class="doc-meta-value">${d.prerequisites_met ? '✅ Виконано' : '❌ Не виконано'}</span></div>
        </div>
        ${C.formGroup('Метод відправки', C.formSelect([
          { value: 'email', label: 'Email клієнту' },
          { value: 'portal', label: 'Клієнтський портал' },
          { value: 'print', label: 'Друк (ручна доставка)' },
        ]))}
        <p class="text-sm text-warning mt-8">⚠ Після виставлення рахунок фіксується як офіційний документ. Зміни потребують кредит-ноти.</p>`,
        C.btn('Виставити', 'btn-primary', 'onclick="closeModal(\'issue-invoice\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'issue-invoice\')"')
      ) +

      // ── Preview Invoice Modal ──
      C.modal('preview-invoice', 'Попередній перегляд рахунку',
        `<div style="background: var(--surface-2); padding: var(--space-16); border-radius: var(--radius); font-size: 0.9rem;">
          <h3>РАХУНОК №${d.invoice_no}</h3>
          <p>Від: F1 Operations</p>
          <p>Кому: ${d.client}</p>
          <p>Кейс: ${d.case_no}</p>
          <hr>
          ${d.items.map(i => `<div class="doc-meta-row"><span class="doc-meta-label">${i.description}</span><span class="doc-meta-value">₴${i.amount.toLocaleString()}</span></div>`).join('')}
          <hr>
          <div class="doc-meta-row"><span class="doc-meta-label font-bold">РАЗОМ</span><span class="doc-meta-value font-bold">₴${d.amount.toLocaleString()}</span></div>
          <p class="mt-8 text-sm">Умови оплати: 100% передоплата</p>
        </div>`,
        C.btn('Закрити', 'btn-ghost', 'onclick="closeModal(\'preview-invoice\')"')
      ) +

      C.section('Точки затвердження (MVP)') +
      C.sectionHeroNotice('Шлюзи затвердження для рахунків',
        'Рахунки клієнтам можуть потребувати approval при: (1) low-confidence OCR / конфлікт суми/валюти → INVOICE_CAPTURE_APPROVAL, (2) пов\'язані фінальні документи CMR/TTN → DOC_FINALIZATION_APPROVAL.') +
      C.table(
        ['Тригер', 'Approval type', 'Роль', 'Верифікація'],
        [
          ['Low-confidence OCR, конфлікт суми/валюти', C.approvalTypeBadge('INVOICE_CAPTURE_APPROVAL'), C.roleLabel('ACCOUNTING'), C.verificationModeBadge('standard') + ' / ' + C.verificationModeBadge('deep')],
          ['CMR/TTN пов\'язані фіндоки', C.approvalTypeBadge('DOC_FINALIZATION_APPROVAL'), C.roleLabel('ROAD_LOGISTICS / BROKER'), C.verificationModeBadge('standard')],
        ]
      );
  },

  // ─── AC-04 Рахунки агентів ───
  '#/roles/accounting/agent-inv': function() {
    const d = DATA.accounting.data.agentInvoice;
    return C.pageHeader('Рахунки агентів', 'AC-04 — Рахунки від агентів') +
      C.heroNotice('Рахунки агентів',
        '<strong>Для бухгалтера.</strong> Прийом та верифікація рахунків від транспортних агентів: перевірка сум, прив\'язка до кейсу, контроль строків оплати.<br><br><strong>Раніше (AS-IS):</strong> рахунки від агентів приходили на email, ви вручну шукали відповідний кейс, порівнювали суми із затвердженою ставкою. При невідповідностях — листування з логістом і агентом. Строки оплати контролювали в окремому файлі.<br><strong>Тепер у F1 (TO-BE):</strong> рахунок агента потрапляє в чергу верифікації з прив\'язкою до кейсу. Система автоматично порівнює суму з operational rate. Невідповідності формують виняток з owner-role і SLA. Підтверджений рахунок автоматично передається у фінанси як line item. Строки оплати трекаються системно (TC-ACC-01).') +
      // ── Due Date Tracker ──
      C.section('Контроль термінів оплати') +
      C.sectionNotice('Ризик прострочення',
        'Рахунки агентів із терміном оплати менше 3 днів підсвічуються як «під ризиком». Прострочені — як «критичні».') +
      C.table(
        ['№ рахунку', 'Агент', 'Сума', 'Кейс', 'Отримано', 'Термін оплати', 'Днів до терміну', 'Статус'],
        d.invoices.map(i => {
          const dueDate = new Date(i.due_date);
          const now = new Date('2026-02-11');
          const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          const riskCls = daysLeft <= 0 ? 'text-danger font-bold' : daysLeft <= 3 ? 'text-warning font-bold' : '';
          return [
            `<span class="font-mono text-sm">${i.invoice_no}</span>`,
            i.agent,
            i.amount_usd ? `$${i.amount_usd.toLocaleString()}` : `€${i.amount_eur.toLocaleString()}`,
            C.caseLink(i.case_no),
            i.received, i.due_date,
            `<span class="${riskCls}">${daysLeft <= 0 ? 'Прострочено!' : daysLeft + ' дн.'}</span>`,
            C.statusBadge(i.status),
          ];
        })
      ) +

      // ── Amount Verification Panel ──
      C.section('Верифікація суми') +
      C.sectionNotice('Перевірка відповідності',
        'Сума рахунку агента перевіряється проти контрактних умов та довідки витрат. Відхилення понад 5% потребують розслідування.') +
      `<div class="card">
        <div class="card-title">Перевірка відповідності рахунків</div>
        ${d.invoices.map(i => `
          <div class="doc-meta-row">
            <span class="doc-meta-label">${i.invoice_no} (${i.agent})</span>
            <span class="doc-meta-value">
              ${i.amount_usd ? '$' + i.amount_usd.toLocaleString() : '€' + i.amount_eur.toLocaleString()}
              — <span class="badge-status done">В межах допуску</span>
            </span>
          </div>
        `).join('')}
        <p class="text-sm text-muted mt-8">Автоматична перевірка проти контрактних умов. Відхилення &gt;5% підсвічуються.</p>
      </div>` +

      C.actionBar('Дії з рахунком агента', [
        { label: 'Підтвердити', cls: 'btn-primary', onclick: "openModal('approve-agent-inv')" },
        { label: 'Запросити уточнення', cls: 'btn-secondary', onclick: "openModal('request-clarification')" },
        { label: 'Зареєструвати новий', cls: 'btn-secondary', onclick: "openModal('register-agent-inv')" },
        { label: 'Прив\'язати до кейсу', cls: 'btn-ghost', onclick: "openModal('link-to-case')" },
        { label: 'Передати у фінанси', cls: 'btn-primary' },
      ]) +

      // ── Register Agent Invoice Modal ──
      C.modal('register-agent-inv', 'Реєстрація рахунку від агента',
        `${C.formGroup('Номер рахунку', C.formInput('AGI-2026-XXX'))}
        ${C.formGroup('Агент', C.formSelect([
          { value: '', label: '— Оберіть агента —' },
          { value: 'skybridge', label: 'СкайБрідж Логістикс' },
          { value: 'turklog', label: 'ТуркЛог Експрес' },
          { value: 'eurotrans', label: 'ЄвроТранс ГмбХ' },
          { value: 'other', label: 'Інший' },
        ]))}
        ${C.formGroup('Сума', C.formInput('0.00'))}
        ${C.formGroup('Валюта', C.formSelect([
          { value: 'USD', label: 'USD' },
          { value: 'EUR', label: 'EUR' },
          { value: 'UAH', label: 'UAH' },
        ]))}
        ${C.formGroup('Кейс', C.formInput('F1-2026-XXXXX'))}
        ${C.formGroup('Дата отримання', C.formInput('', '2026-02-11'))}
        ${C.formGroup('Термін оплати', C.formInput('', '2026-02-25'))}
        ${C.formGroup('Файл рахунку', '<input type="file" class="form-input" accept=".pdf,.jpg,.png" disabled>')}`,
        C.btn('Зареєструвати', 'btn-primary', 'onclick="closeModal(\'register-agent-inv\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'register-agent-inv\')"')
      ) +

      // ── Link to Case Modal ──
      C.modal('link-to-case', 'Прив\'язка до кейсу',
        `<p>Прив\'язка рахунку агента до кейсу F1.</p>
        ${C.formGroup('Рахунок', C.formSelect(d.invoices.map(i => ({ value: i.invoice_no, label: i.invoice_no + ' — ' + i.agent }))))}
        ${C.formGroup('Кейс', C.formInput('F1-2026-XXXXX'))}
        <p class="text-sm text-muted mt-8">Прив'язка дозволяє автоматичне звірення суми рахунку з довідкою витрат.</p>`,
        C.btn('Прив\'язати', 'btn-primary', 'onclick="closeModal(\'link-to-case\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'link-to-case\')"')
      ) +

      // ── Approve Agent Invoice Modal ──
      C.modal('approve-agent-inv', 'Підтвердження рахунку агента',
        `<p>Ви підтверджуєте рахунок агента. Після підтвердження рахунок буде передано у фінанси для оплати.</p>
        ${C.formGroup('Коментар', C.formInput('Додатковий коментар...'))}
        <p class="text-sm text-warning mt-8">⚠ Підтвердження є фінальним. Після підтвердження рахунок потрапляє у чергу оплати.</p>`,
        C.btn('Підтвердити', 'btn-primary', 'onclick="closeModal(\'approve-agent-inv\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'approve-agent-inv\')"')
      ) +

      // ── Request Clarification Modal ──
      C.modal('request-clarification', 'Запит уточнення',
        `${C.formGroup('Рахунок', C.formSelect(d.invoices.map(i => ({ value: i.invoice_no, label: i.invoice_no + ' — ' + i.agent }))))}
        ${C.formGroup('Тип питання', C.formSelect([
          { value: 'amount', label: 'Невідповідність суми' },
          { value: 'docs', label: 'Відсутні підтверджуючі документи' },
          { value: 'duplicate', label: 'Можливий дублікат' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Деталі', '<textarea class="form-textarea" rows="3" placeholder="Опис питання..."></textarea>')}`,
        C.btn('Надіслати', 'btn-primary', 'onclick="closeModal(\'request-clarification\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'request-clarification\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Дублікат рахунку:</strong> Система перевіряє номер рахунку та суму — при збігу попереджає про можливий дублікат.</li>
          <li><strong>Валюта не збігається:</strong> Якщо валюта рахунку агента не збігається з контрактною — потребує ручної верифікації.</li>
          <li><strong>Прострочений термін:</strong> Рахунки з терміном оплати, що минув, автоматично ескалюються на керівника.</li>
          <li><strong>Сума перевищує контрактну:</strong> Відхилення &gt;5% блокує автоматичне підтвердження і потребує ручної перевірки.</li>
        </ul>
      </div>`;
  },

});
