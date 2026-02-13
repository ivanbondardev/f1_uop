/* =====================================================
   Фінанси Pages: FI-01..FI-04
   ===================================================== */

registerPages({

  // ─── FI-01 Робочий простір фінансів ───
  '#/roles/finance/workspace': function() {
    const d = DATA.finance.data.workspace;
    return C.pageHeader('Робочий простір фінансів', 'FI-01 — Контроль оплат і платіжний шлюз') +
      C.heroNotice('Робочий простір фінансів',
        '<strong>Для фінансиста (7 осіб).</strong> Ваш робочий простір для контролю оплат, шлюзу видачі та звірки F1 ↔ 1С. Ви — єдиний контролер, який дозволяє або блокує видачу вантажу.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> ви збирали інформацію про оплати вручну з банківських виписок та 1С. Стан оплати кейсу уточнювали по запитах менеджера або складу. Дозвіл на видачу підтверджували усно або листом, що не мало аудит-сліду.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> банківські виписки та 1С-події автоматично потрапляють у чергу рознесення. Рішення шлюзу «ДОЗВІЛ»/«БЛОКУВАННЯ» системно блокує або дозволяє видачу на складі — без дублюючого ручного підтвердження. Near-release кейси підсвічуються в workspace (TC-FIN-01, TC-FIN-02).') +

      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card">${C.link('#/roles/finance/allocation', '💳 Рознесення оплат →')}</div>
        <div class="card">${C.link('#/roles/finance/gate', '🚦 Контроль шлюзу видачі →')}</div>
        <div class="card">${C.link('#/roles/finance/reconciliation', '🔄 Звірка →')}</div>
      </div>` +

      C.statCards([
        { value: d.queues.unallocated_payments, label: 'Нерознесені оплати', color: 'accent' },
        { value: d.queues.partial_risk, label: 'Ризик часткової оплати', color: 'warning' },
        { value: d.queues.gate_pending, label: 'Шлюз в очікуванні', color: 'danger' },
        { value: d.queues.reconciliation_mismatch, label: 'Розбіжності звірки', color: '' },
      ]) +

      C.section('Показники за сьогодні') +
      C.statStrip([
        { value: d.today_widgets.incoming_payments, label: 'Вхідні оплати', color: 'accent' },
        { value: d.today_widgets.cases_blocked, label: 'Кейси, заблоковані фінансами', color: 'danger' },
        { value: d.today_widgets.gate_fail_24h, label: 'Блокування шлюзу (24 год)', color: 'warning' }
      ]) +

      // P0: Single-entry sync health widget (2.1)
      C.section('P0: Здоров\'я Single-Entry Sync (2.1)') +
      C.widget('Синхронізація єдиного вводу', `
        <div class="doc-meta-row"><span class="doc-meta-label">Покриття єдиним вводом</span><span class="doc-meta-value font-bold">82%</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Конфлікти в черзі</span><span class="doc-meta-value text-danger">3</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Gate рішення використовують single-entry реквізити</span><span class="doc-meta-value">${C.singleEntrySourceBadge('single_entry')}</span></div>
      `, C.btn('Консоль єдиного вводу →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/accounting-single-entry\')"'));
  },

  // ─── FI-02 Рознесення оплат ───
  '#/roles/finance/allocation': function() {
    const d = DATA.finance.data.paymentAllocation;
    return C.pageHeader('Рознесення оплат', 'FI-02 — Рознесення оплат') +
      C.heroNotice('Консоль рознесення оплат',
        '<strong>Для фінансиста.</strong> Зіставлення банківських платежів із кейсами F1: автоматичне та ручне matching, розподіл оплат між кейсами, виявлення невідповідностей.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> ви відкривали банківську виписку в 1С, шукали відповідний кейс/клієнта по назві або сумі, вручну вносили рознесення. При частковій оплаті або іншій валюті — додатковий ланцюг з\'ясувань через email. Мismatch виявлявся лише при спробі закрити кейс.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> платежі автоматично потрапляють у чергу рознесення з підказками matching. Система попереджає про невідповідність суми, валюти або дублікат. Підтверджене рознесення одразу оновлює залишок кейсу та prerequisites для payment gate — менеджер і склад бачать актуальний стан без ваших ручних повідомлень (TC-FIN-01).') +

      C.section('Рядки виписки') +
      C.table(
        ['Референс', 'Платник', 'Сума', 'Валюта', 'Дата', 'Зіставлений кейс', 'Статус', 'Дії'],
        d.statement_items.map(si => [
          `<span class="font-mono text-sm">${si.ref}</span>`,
          si.payer,
          si.amount.toLocaleString(undefined, {minimumFractionDigits: 2}),
          si.currency, si.date,
          si.matched_case ? C.caseLink(si.matched_case) : '<span class="text-muted">—</span>',
          C.statusBadge(si.status),
          si.status === 'unmatched'
            ? C.btn('Зіставити', 'btn-sm btn-primary', 'onclick="openModal(\'match-payment\')"')
            : si.status === 'partial'
              ? C.btn('Розділити', 'btn-sm btn-secondary', 'onclick="openModal(\'split-payment\')"')
              : '<span class="text-muted">—</span>',
        ])
      ) +

      // ── Warnings Panel ──
      C.section('Попередження') +
      `<div class="card" style="border-left: 4px solid var(--warning)">
        <div class="card-title">Активні попередження</div>
        <div class="doc-meta-row"><span class="doc-meta-label">⚠ Можливий дублікат</span><span class="doc-meta-value">PAY-20260211-001 — перевірте відповідність суми та платника з попередніми записами</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">⚠ Невідповідність валюти</span><span class="doc-meta-value">PAY-20260211-002 — оплата EUR, рахунок в UAH. Потрібна конвертація.</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">⚠ Невідповідність суми</span><span class="doc-meta-value">PAY-20260211-002 — часткова оплата: €6,750 з €9,000 (75%)</span></div>
      </div>` +

      C.actionBar('Дії рознесення', [
        { label: 'Зіставити з кейсом', cls: 'btn-primary', onclick: "openModal('match-payment')" },
        { label: 'Розділити оплату', cls: 'btn-secondary', onclick: "openModal('split-payment')" },
        { label: 'Позначити як незіставлене', cls: 'btn-danger' },
      ]) +

      // ── Match Payment Modal ──
      C.modal('match-payment', 'Зіставлення оплати з кейсом',
        `<p>Зіставлення банківського платежу з кейсом F1.</p>
        ${C.formGroup('Платіж', C.formSelect(d.statement_items.map(si => ({ value: si.ref, label: si.ref + ' — ' + si.payer + ' (' + si.currency + si.amount.toLocaleString() + ')' }))))}
        ${C.formGroup('Кейс', C.formInput('F1-2026-XXXXX'))}
        ${C.formGroup('Коментар', C.formInput('Додаткова інформація...'))}
        <div class="mt-8" style="background: var(--surface-2); padding: var(--space-8); border-radius: var(--radius);">
          <p class="text-sm font-bold">Перевірки перед зіставленням:</p>
          <div class="doc-meta-row"><span class="doc-meta-label">Відповідність суми</span><span class="doc-meta-value"><span class="badge-status pending">Буде перевірено</span></span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Відповідність валюти</span><span class="doc-meta-value"><span class="badge-status pending">Буде перевірено</span></span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Дублікат</span><span class="doc-meta-value"><span class="badge-status pending">Буде перевірено</span></span></div>
        </div>`,
        C.btn('Зіставити', 'btn-primary', 'onclick="closeModal(\'match-payment\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'match-payment\')"')
      ) +

      // ── Split Payment Modal ──
      C.modal('split-payment', 'Розділення оплати',
        `<p>Розділення одного платежу між кількома кейсами.</p>
        ${C.formGroup('Платіж', C.formSelect(d.statement_items.map(si => ({ value: si.ref, label: si.ref + ' — ' + si.currency + si.amount.toLocaleString() }))))}
        <div class="card mt-8">
          <div class="card-title">Розподіл</div>
          ${C.formGroup('Кейс 1', C.formInput('F1-2026-XXXXX'))}
          ${C.formGroup('Сума 1', C.formInput('0.00'))}
          ${C.formGroup('Кейс 2', C.formInput('F1-2026-YYYYY'))}
          ${C.formGroup('Сума 2', C.formInput('0.00'))}
        </div>
        ${C.formGroup('Коментар розподілу', '<textarea class="form-textarea" rows="2" placeholder="Пояснення розподілу..."></textarea>')}
        <p class="text-sm text-warning mt-8">⚠ Сума частин повинна дорівнювати загальній сумі платежу.</p>`,
        C.btn('Розділити', 'btn-primary', 'onclick="closeModal(\'split-payment\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'split-payment\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Невідомий платник (PAY-20260211-003):</strong> Платіж від невідомого платника потребує ручного розслідування. Можливий варіант: оплата через іншу юрособу.</li>
          <li><strong>Часткова оплата:</strong> PAY-20260211-002 — €6,750 з €9,000 (75%). Шлюз лишається у стані FAIL до повної оплати.</li>
          <li><strong>Дублікат:</strong> При спробі зіставити платіж, який вже зіставлений — система попереджає про дублікат.</li>
          <li><strong>Різна валюта:</strong> Якщо валюта платежу не збігається з валютою рахунку — потрібна конвертація з фіксацією курсу.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'fi02-loading', label: 'Завантаження' },
        { id: 'fi02-empty', label: 'Порожній' },
        { id: 'fi02-error', label: 'Помилка' },
      ]) +
      C.tabContent('fi02-loading', C.skeleton(4, 7)) +
      C.tabContent('fi02-empty', C.emptyState('Немає нерознесених оплат', 'Усі вхідні платежі зіставлені з кейсами.')) +
      C.tabContent('fi02-error', C.errorState('Помилка синхронізації', 'Не вдалося завантажити банківську виписку. Перевірте інтеграцію з 1С.'));
  },

  // ─── FI-03 Контроль шлюзу видачі ───
  '#/roles/finance/gate': function() {
    const d = DATA.finance.data.gateControl;
    return C.pageHeader('Контроль шлюзу видачі', 'FI-03 — Контроль платіжного шлюзу') +
      C.heroNotice('Контроль шлюзу видачі',
        '<strong>Для фінансиста.</strong> Прийняття рішення «ДОЗВІЛ» або «БЛОКУВАННЯ» видачі вантажу. Перевірка передумов: 100% передоплата, документи, відсутність відкритих винятків.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> склад або менеджер телефонував/писав вам з питанням «чи можна видавати?». Ви перевіряли оплату в 1С, іноді забували повідомити про блокування. Дозвіл давався усно або листом без фіксації підстав і часу рішення.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> ви оцінюєте кейс за агрегованим чеклістом (оплати, документи, відкриті exception). Рішення «ДОЗВІЛ» автоматично сповіщає склад і менеджера. «БЛОКУВАННЯ» з reason-code стартує follow-up задачу на доопрацювання. Склад читає gate-статус напряму в release panel без дублюючого каналу (TC-FIN-02).') +

      C.sectionHeroNotice('Рішення платіжного шлюзу',
        'Це критична секція: рішення шлюзу безпосередньо впливає на видачу вантажу зі складу. «БЛОКУВАННЯ» зупиняє видачу до підтвердженої 100% оплати.') +
      C.sectionNotice('Процес при БЛОКУВАННІ',
        'При «БЛОКУВАННІ» склад отримує сповіщення. Для зняття блокування необхідна доплата клієнтом та повторна оцінка шлюзу фінансистом з результатом «ДОЗВІЛ».') +

      `<div class="card" style="border-left: 4px solid var(--danger)">
        <div class="card-header">
          <span class="card-title">${C.caseLink(d.case_no)} — ${d.client}</span>
          ${C.gateBadge(d.gate_decision)}
        </div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Очікується</span><span class="doc-meta-value font-bold">€${d.expected_total.toLocaleString()}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Отримано</span><span class="doc-meta-value">€${d.received_total.toLocaleString()}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Недоплата</span><span class="doc-meta-value text-danger font-bold">€${d.shortfall.toLocaleString()}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Остання оцінка</span><span class="doc-meta-value">${d.last_evaluated}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Оцінив</span><span class="doc-meta-value">${d.evaluated_by}</span></div>
          </div>
        </div>
      </div>` +

      // Real-time Payment Visibility Panel
      C.section('Видимість оплат у реальному часі') +
      C.sectionHeroNotice('Near-real-time фінансовий стан',
        'Панель показує поточний стан оплати з інтеграцій (1С/банк). Автоматичне оновлення дозволяє приймати рішення шлюзу на актуальних даних.') +
      `<div class="card" style="border-left: 3px solid var(--accent)">
        <div class="card-title" style="font-size:13px; margin-bottom:8px;">Фінансовий підсумок кейсу</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Очікується</span><span class="doc-meta-value font-bold">${d.financial_summary.expected}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Сплачено</span><span class="doc-meta-value">${d.financial_summary.paid}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Стан</span><span class="doc-meta-value">${C.statusBadge(d.financial_summary.status)}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Актуально на</span><span class="doc-meta-value">${d.financial_summary.as_of}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Остання синхронізація</span><span class="doc-meta-value">${d.financial_summary.last_sync}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Джерело</span><span class="doc-meta-value">${d.financial_summary.sync_source}</span></div>
          </div>
        </div>
        <div class="mt-8">${C.btn('🔄 Оновити стан оплати', 'btn-sm btn-secondary')} <span class="text-sm text-muted ml-8">Симуляція: дані оновляться при натисканні (демо)</span></div>
      </div>` +

      C.section('Чекліст передумов') +
      `<ul class="checklist">${d.prerequisites.map(p =>
        `<li class="checklist-item">
          <span class="check-icon ${p.met ? 'checked' : 'failed'}">${p.met ? '✓' : '✗'}</span>
          <span>${p.item}</span>
        </li>`
      ).join('')}</ul>` +

      C.actionBar('Дії шлюзу', [
        { label: 'Переоцінити шлюз', cls: 'btn-primary' },
        { label: 'Запит override FAIL → PASS', cls: 'btn-primary', onclick: "openModal('gate-override')" },
        { label: 'Оновити стан оплати (1С/банк)', cls: 'btn-secondary' },
        { label: 'Встановити БЛОКУВАННЯ', cls: 'btn-danger' },
        { label: 'Сповістити склад', cls: 'btn-secondary' },
      ]) +

      C.section('Точки затвердження (MVP)') +
      C.sectionHeroNotice('Шлях затвердження для override шлюзу',
        'Manual FAIL → PASS вимагає PAYMENT_GATE_OVERRIDE_APPROVAL від Керівника фінансів з поглибленою верифікацією. Якщо override відхилено, gate лишається FAIL і warehouse отримує blocker-нотифікацію.') +
      C.table(
        ['Тригер', 'Approval type', 'Роль', 'Верифікація', 'SLA'],
        [
          ['Manual FAIL → PASS', C.approvalTypeBadge('PAYMENT_GATE_OVERRIDE_APPROVAL'), C.roleLabel('FINANCE_LEAD'), C.verificationModeBadge('deep'), '15 хв'],
        ]
      ) +

      C.modal('gate-override', 'Запит override платіжного шлюзу',
        '<p>Ви створюєте запит на override FAIL → PASS для кейсу <strong>' + d.case_no + '</strong>.</p>' +
        '<p class="text-sm text-warning mt-8">⚠ Цей запит потрапить в approval inbox Керівника фінансів з deep-верифікацією. Рішення буде прийнято протягом SLA 15 хв.</p>' +
        C.formGroup('Обґрунтування', '<textarea class="form-textarea" rows="3" placeholder="Вкажіть причину override..."></textarea>') +
        C.formGroup('Підтверджуючий документ', C.formSelect([
          { value: 'swift', label: 'SWIFT підтвердження' },
          { value: 'statement', label: 'Банківська виписка' },
          { value: 'guarantee', label: 'Гарантійний лист' },
          { value: 'other', label: 'Інше' },
        ])),
        C.btn('Створити запит', 'btn-primary', 'onclick="closeModal(\'gate-override\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'gate-override\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Часткова оплата (поточний стан):</strong> Отримано 75% (€6,750 з €9,000). Шлюз = FAIL. Видача заблокована.</li>
          <li><strong>Override без підтвердження:</strong> Спроба override без SWIFT/виписки — система блокує створення запиту.</li>
          <li><strong>Подвійна оплата:</strong> Якщо система виявляє дублікат оплати — шлюз не переходить у PASS, потрібне розслідування.</li>
          <li><strong>Прострочений SLA override:</strong> Якщо approval не прийнятий протягом 15 хв — автоматична ескалація на OPS_LEAD.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'fi03-loading', label: 'Завантаження' },
        { id: 'fi03-forbidden', label: 'Доступ заборонено' },
      ]) +
      C.tabContent('fi03-loading', C.skeleton(3, 5)) +
      C.tabContent('fi03-forbidden', C.forbiddenState('Фінанси'));
  },

  // ─── FI-04 Звірка ───
  '#/roles/finance/reconciliation': function() {
    const d = DATA.finance.data.reconciliation;
    return C.pageHeader('Звірка', 'FI-04 — Звірка F1 і 1С') +
      C.heroNotice('Звірка',
        '<strong>Для фінансиста.</strong> Щоденна звірка даних між F1 та 1С: виявлення розбіжностей сум, відсутніх або дубльованих подій, корекція та закриття.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> ви вручну порівнювали дані F1 і 1С — суми, дати, контрагентів. Розбіжності відстежували в окремій Excel-табличці. Час на з\'ясування причини розбіжності міг становити кілька годин через ланцюги уточнень.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> система автоматично виявляє розбіжності при щоденній звірці. Для типових випадків (різниця округлення, timing) доступна автоматична ресинхронізація. Кожна ручна корекція фіксується в аудит-трейлі з reason_code. Для нетипових розбіжностей створюється reconciliation item з owner-role і SLA замість ad-hoc листування (TC-FIN-01).') +

      // ── KPI Display ──
      C.section('KPI звірки') +
      C.statStrip([
        { value: d.mismatches.filter(m => m.status === 'open').length, label: 'Відкриті розбіжності', color: 'accent' },
        { value: d.mismatches.filter(m => m.status === 'resolved').length, label: 'Вирішені сьогодні', color: 'success' },
        { value: '35 хв', label: 'Середній час вирішення' },
        { value: '2.1%', label: 'Частка розбіжностей', color: 'warning' }
      ]) +

      C.section('Черга розбіжностей') +
      C.table(
        ['ID', 'Тип', 'Кейс', 'Деталі', 'Статус', 'Дії'],
        d.mismatches.map(m => [
          `<span class="font-mono text-sm">${m.id}</span>`,
          `<span>${C.typeLabel(m.type)}</span>`,
          C.caseLink(m.case_no),
          m.description || `F1: ${m.currency}${m.f1_amount?.toLocaleString()} vs 1С: ${m.currency}${m.ext_amount?.toLocaleString()} (Δ${m.difference?.toLocaleString()})`,
          C.statusBadge(m.status),
          m.status === 'open' ? C.btn('Деталі', 'btn-sm btn-ghost', 'onclick="openModal(\'mismatch-detail\')"') : '—',
        ])
      ) +

      // ── Mismatch Detail Panel ──
      C.section('Деталі розбіжності') +
      C.sectionNotice('Панель аналізу',
        'Детальний аналіз розбіжності з порівнянням даних F1 та 1С поруч.') +
      `<div class="card">
        <div class="card-title">REC-051: Невідповідність суми</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">${C.caseLink('F1-2026-00137')}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Тип</span><span class="doc-meta-value">${C.typeLabel('amount_mismatch')}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Дата виявлення</span><span class="doc-meta-value">2026-02-11</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Сума F1</span><span class="doc-meta-value font-bold">₴45,200</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Сума 1С</span><span class="doc-meta-value font-bold">₴45,020</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Різниця</span><span class="doc-meta-value text-danger font-bold">₴180</span></div>
          </div>
        </div>
        <p class="text-sm text-muted mt-8">Ймовірна причина: округлення при конвертації валюти.</p>
      </div>` +

      // ── Stale Status Support ──
      `<div class="card" style="border-left: 4px solid var(--warning)">
        <div class="card-title">Застарілий статус (Stale Mismatch)</div>
        <div class="doc-meta-row"><span class="doc-meta-label">REC-050</span><span class="doc-meta-value">Оплата зафіксована в 1С, але не в F1 — можливий stale status</span></div>
        <p class="text-sm text-muted mt-8">Stale mismatch виникає коли дані оновились в одній системі, але ще не синхронізувались з іншою. Рекомендація: запустити ресинхронізацію.</p>
      </div>` +

      C.actionBar('Дії звірки', [
        { label: 'Запустити ресинхронізацію', cls: 'btn-primary' },
        { label: 'Ручна корекція', cls: 'btn-secondary', onclick: "openModal('manual-correction')" },
        { label: 'Закрити розбіжність', cls: 'btn-primary', onclick: "openModal('close-mismatch')" },
      ]) +

      // ── Manual Correction Modal ──
      C.modal('manual-correction', 'Ручна корекція розбіжності',
        `<p>Ручне виправлення для вирівнювання даних F1 та 1С.</p>
        ${C.formGroup('Розбіжність', C.formSelect(d.mismatches.filter(m => m.status === 'open').map(m => ({ value: m.id, label: m.id + ' — ' + m.case_no }))))}
        ${C.formGroup('Дія', C.formSelect([
          { value: 'adjust_f1', label: 'Коригувати суму в F1' },
          { value: 'adjust_ext', label: 'Повідомити 1С про корекцію' },
          { value: 'accept_diff', label: 'Прийняти різницю (в межах допуску)' },
        ]))}
        ${C.formGroup('Причина корекції', C.formSelect([
          { value: 'rounding', label: 'Округлення при конвертації' },
          { value: 'timing', label: 'Різниця в часі фіксації' },
          { value: 'duplicate', label: 'Дублікат запису' },
          { value: 'manual_error', label: 'Помилка ручного вводу' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Коментар', '<textarea class="form-textarea" rows="3" placeholder="Деталі корекції для аудиту..."></textarea>')}
        <p class="text-sm text-warning mt-8">⚠ Ручна корекція фіксується в аудит-трейлі з reason_code і актором.</p>`,
        C.btn('Застосувати корекцію', 'btn-primary', 'onclick="closeModal(\'manual-correction\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'manual-correction\')"')
      ) +

      // ── Close Mismatch Modal ──
      C.modal('close-mismatch', 'Закриття розбіжності',
        `<p>Закриття розбіжності після вирішення.</p>
        ${C.formGroup('Розбіжність', C.formSelect(d.mismatches.filter(m => m.status === 'open').map(m => ({ value: m.id, label: m.id + ' — ' + C.typeLabel(m.type) }))))}
        ${C.formGroup('Результат', C.formSelect([
          { value: 'corrected', label: 'Виправлено — дані вирівняні' },
          { value: 'accepted', label: 'Прийнято — різниця в межах допуску' },
          { value: 'escalated', label: 'Ескальовано — потребує додаткового розслідування' },
        ]))}
        ${C.formGroup('Коментар', C.formInput('Фінальний коментар...'))}`,
        C.btn('Закрити', 'btn-primary', 'onclick="closeModal(\'close-mismatch\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'close-mismatch\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Stale mismatch:</strong> Дані оновились в 1С, але синхронізація з F1 ще не відбулась. Рекомендація: ресинхронізація.</li>
          <li><strong>Подвійний запис:</strong> REC-049 — дублікат оплати в F1. Один запис потрібно видалити.</li>
          <li><strong>Різниця округлення:</strong> Малі різниці (до ₴200) при конвертації валют — типовий випадок, можна закрити як «в межах допуску».</li>
          <li><strong>Відсутня подія:</strong> Оплата є в 1С, але не з'являється в F1 — потрібне ручне розслідування або ресинхронізація.</li>
        </ul>
      </div>` +

      // ── Audit Trail ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-11 07:00', actor: 'Система', event: 'ReconciliationStarted', detail: 'Щоденна звірка F1 ↔ 1С запущена автоматично', correlation_id: 'corr-rec-daily' },
        { ts: '2026-02-11 07:05', actor: 'Система', event: 'MismatchDetected', detail: 'Виявлено 3 розбіжності: REC-049, REC-050, REC-051', correlation_id: 'corr-rec-daily' },
        { ts: '2026-02-11 08:30', actor: 'Лариса П. (Фінанси)', event: 'MismatchResolved', detail: 'REC-049 закрито: подвійний запис видалено', reason_code: 'DUPLICATE_REMOVED', correlation_id: 'corr-rec-049' },
      ]);
  },

});
