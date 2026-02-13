/* =====================================================
   Склад Pages: WH-01..WH-04
   ===================================================== */

registerPages({

  // ─── WH-01 Робочий простір складу ───
  '#/roles/warehouse/workspace': function() {
    const d = DATA.warehouse.data.workspace;
    return C.pageHeader('Робочий простір складу', 'WH-01 — Управління складськими операціями') +
      C.heroNotice('Робочий простір складу',
        '<strong>Для складу / офіс-менеджера.</strong> Очікувані прибуття, обробка вантажів, видача/відправка та реєстрація інцидентів. Контроль фізичного руху вантажу.<br><br><strong>Раніше (AS-IS):</strong> запит на видачу приходив дзвінком або листом від менеджера. Чи дозволено видавати — уточнювали у фінансиста по телефону. Факт видачі фіксували на папері або в Excel. Про пошкодження повідомляли усно.<br><strong>Тепер у F1 (TO-BE):</strong> запит на видачу надходить як системна задача з контекстом сценарію. Стан оплати (gate badge) видно прямо в release panel — не потрібно телефонувати фінансисту. Кнопка видачі жорстко заблокована при gate≠pass. Факт відвантаження автоматично записується в timeline (TC-WH-01, TC-WH-02).') +
      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card">${C.link('#/roles/warehouse/arrival', '📥 Обробка прибуття →')}</div>
        <div class="card">${C.link('#/roles/warehouse/release', '🔓 Видача / відправка →')}</div>
        <div class="card">${C.link('#/roles/warehouse/issues', '🐛 Журнал інцидентів →')}</div>
      </div>` +

      C.statCards([
        { value: d.queues.awaiting_arrival, label: 'Очікуване прибуття', color: 'accent' },
        { value: d.queues.in_processing, label: 'В обробці', color: '' },
        { value: d.queues.release_ready, label: 'Готово до видачі', color: 'success' },
        { value: d.queues.incidents_open, label: 'Відкриті інциденти', color: 'danger' },
      ]) +

      C.section('Очікувані прибуття за сьогодні') +
      C.table(
        ['Кейс', 'Клієнт', 'Очікується', 'Місця', 'Шлюз'],
        d.today_arrivals.map(a => [
          C.caseLink(a.case_no), a.client, a.expected,
          a.pieces, C.gateBadge(a.gate)
        ])
      ) +

      // P0: Release handover status widget (2.3)
      C.section('P0: Статус Handover для видачі (2.3)') +
      C.widget('Handover для видачі', `
        <div class="doc-meta-row"><span class="doc-meta-label">Handover статус блокерів</span><span class="doc-meta-value text-warning">1 кейс без підтвердженого handover</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Handover правило</span><span class="doc-meta-value">Видача блокується без підтвердженого handover received</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"'));
  },

  // ─── WH-02 Обробка прибуття ───
  '#/roles/warehouse/arrival': function() {
    const d = DATA.warehouse.data.arrivalHandling;
    const hasDiscrepancy = d.expected_pieces !== d.received_pieces || d.discrepancies.length > 0;
    const allDone = d.checklist.every(i => i.done);

    return C.pageHeader('Обробка прибуття', 'WH-02 — Приймання вантажу') +
      C.heroNotice('Обробка прибуття',
        '<strong>Для складу.</strong> Приймання вантажу: розвантаження, перевірка кількості, візуальний огляд, зважування, фото-фіксація та розміщення.<br><br><strong>Раніше (AS-IS):</strong> про прибуття дізнавались від перевізника або менеджера. Кількість і стан вантажу перевіряли по паперових накладних. Розбіжності записували на папері та повідомляли листом або дзвінком.<br><strong>Тепер у F1 (TO-BE):</strong> очікувані прибуття відображаються в робочому просторі. Check-in форма автоматично порівнює кількість/вагу з документами кейсу. При розбіжностях створюється exception з SLA на вирішення. Подія arrival реєструється в timeline кейсу і автоматично нотифікує суміжні ролі.') +

      // ── Arrival Timestamp & Receiver ──
      `<div class="card">
        <div class="card-title">Прибуття: ${C.caseLink(d.case_no)}</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Очікується місць</span><span class="doc-meta-value">${d.expected_pieces}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Отримано місць</span><span class="doc-meta-value">${d.received_pieces}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Час прибуття</span><span class="doc-meta-value font-bold">2026-02-11 14:15</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Приймальник</span><span class="doc-meta-value">Віктор Г. (Склад)</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Стан</span><span class="doc-meta-value">${C.statusBadge(d.condition === 'good' ? 'done' : 'blocked')}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Перевірка ваги</span><span class="doc-meta-value">${d.weight_check_kg} кг</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Розбіжності</span><span class="doc-meta-value">${hasDiscrepancy ? '<span class="badge-status blocked">Виявлено</span>' : '<span class="badge-status done">Немає</span>'}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Транспорт доставки</span><span class="doc-meta-value font-mono">AA1234BB — Петренко В.</span></div>
          </div>
        </div>
      </div>` +

      // ── Release Blocker Notice ──
      C.sectionHeroNotice('Блокування видачі',
        'Видача вантажу можлива ТІЛЬКИ після перевірки платіжного шлюзу (payment_gate = pass). На етапі приймання шлюз ще не оцінений — видача заблокована автоматично.') +

      C.section('Чекліст приймання') +
      C.checklist(d.checklist) +

      // ── Discrepancy Capture Form ──
      C.section('Фіксація розбіжності') +
      C.sectionNotice('Форма розбіжності',
        'Заповніть цю форму, якщо виявлені невідповідності між очікуваними та фактичними даними. Розбіжність створює виняток у кейсі.') +
      `<div class="card">
        <div class="card-title">Форма фіксації розбіжності</div>
        ${C.formGroup('Тип розбіжності', C.formSelect([
          { value: '', label: '— Оберіть тип —' },
          { value: 'count_mismatch', label: 'Розбіжність кількості місць' },
          { value: 'weight_mismatch', label: 'Розбіжність ваги' },
          { value: 'damaged_packaging', label: 'Пошкодження пакування' },
          { value: 'damaged_goods', label: 'Пошкодження товару' },
          { value: 'wrong_labeling', label: 'Невірне маркування' },
          { value: 'temperature_violation', label: 'Порушення температурного режиму' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Очікувана кількість / вага', C.formInput('', d.expected_pieces + ' місць'))}
        ${C.formGroup('Фактична кількість / вага', C.formInput('', d.received_pieces + ' місць'))}
        ${C.formGroup('Опис розбіжності', '<textarea class="form-textarea" rows="3" placeholder="Детальний опис виявленої розбіжності..."></textarea>')}
        ${C.formGroup('Критичність', C.formSelect([
          { value: 'low', label: 'Низька — не впливає на процес' },
          { value: 'medium', label: 'Середня — потребує уваги' },
          { value: 'high', label: 'Висока — блокує подальші дії' },
          { value: 'critical', label: 'Критична — потрібна негайна ескалація' },
        ]))}
      </div>` +

      // ── Proof Upload ──
      C.section('Фото-фіксація') +
      `<div class="card">
        <div class="card-title">Завантаження доказів</div>
        <p class="text-sm text-muted">Фото-фіксація є обов'язковою для всіх розбіжностей та пошкоджень. Додайте фото стану вантажу при прибутті.</p>
        <div class="mt-8">
          <input type="file" class="form-input" accept="image/*" multiple disabled>
          <p class="text-sm text-muted mt-8">Прийняті формати: JPG, PNG. Максимум: 10 файлів по 5 МБ.</p>
        </div>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Завантажено фото</span><span class="doc-meta-value">5 📷</span></div>
        </div>
      </div>` +

      C.actionBar('Дії приймання', [
        { label: 'Завершити приймання', cls: 'btn-primary', disabled: !allDone, onclick: "openModal('complete-arrival')" },
        { label: 'Позначити розбіжність', cls: 'btn-danger', onclick: "openModal('report-discrepancy')" },
        { label: 'Додати фото', cls: 'btn-secondary' },
      ]) +

      // ── Complete Arrival Modal ──
      C.modal('complete-arrival', 'Завершення приймання',
        `<p>Ви завершуєте приймання для кейсу <strong>${d.case_no}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Місця</span><span class="doc-meta-value">${d.received_pieces} з ${d.expected_pieces}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Вага</span><span class="doc-meta-value">${d.weight_check_kg} кг</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Стан</span><span class="doc-meta-value">${d.condition}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Чекліст</span><span class="doc-meta-value">${d.checklist.filter(i => i.done).length}/${d.checklist.length}</span></div>
        </div>
        <p class="text-sm text-muted mt-8">Після завершення кейс переходить на етап «В обробці на складі».</p>`,
        C.btn('Завершити', 'btn-primary', 'onclick="closeModal(\'complete-arrival\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'complete-arrival\')"')
      ) +

      // ── Report Discrepancy Modal ──
      C.modal('report-discrepancy', 'Фіксація розбіжності',
        `<p class="text-danger font-bold">Фіксація розбіжності для кейсу ${d.case_no}</p>
        <p class="text-sm text-muted">Розбіжність буде зареєстрована як виняток і з'явиться в хронології кейсу.</p>
        ${C.formGroup('Тип', C.formSelect([
          { value: 'count', label: 'Кількість' },
          { value: 'weight', label: 'Вага' },
          { value: 'damage', label: 'Пошкодження' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Опис', '<textarea class="form-textarea" rows="3" placeholder="Деталі розбіжності..."></textarea>')}`,
        C.btn('Зафіксувати', 'btn-danger', 'onclick="closeModal(\'report-discrepancy\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'report-discrepancy\')"')
      ) +

      // ── Edge Cases ──
      C.section('Edge Cases (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Часткове прибуття:</strong> Якщо прибула частина вантажу (наприклад, 38 з 48), фіксується виняток часткового прибуття, кейс переходить у частковий стан.</li>
          <li><strong>Пошкоджене пакування:</strong> Обов'язкова фото-фіксація, створення інциденту в журналі (WH-04), повідомлення відповідальних ролей.</li>
          <li><strong>Невірне маркування:</strong> Якщо маркування не збігається з AWB/CMR — блокує розміщення на складі до вирішення.</li>
          <li><strong>Температурний режим:</strong> При порушенні температурного режиму (для чутливих товарів) — негайна ескалація та фото-фіксація показників термометра.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'wh02-loading', label: 'Завантаження' },
        { id: 'wh02-empty', label: 'Порожній стан' },
        { id: 'wh02-error', label: 'Помилка' },
      ]) +
      C.tabContent('wh02-loading', C.skeleton(3, 5)) +
      C.tabContent('wh02-empty', C.emptyState('Немає вантажів для приймання', 'Очікувані прибуття з\'являться після отримання попередніх сповіщень від авіалогістики.')) +
      C.tabContent('wh02-error', C.errorState('Помилка завантаження', 'Не вдалося завантажити дані приймання.'));
  },

  // ─── WH-03 Видача / відправка ───
  '#/roles/warehouse/release': function() {
    const d = DATA.warehouse.data.release;
    return C.pageHeader('Видача / відправка', 'WH-03 — Видача та відправка вантажу') +
      C.heroNotice('Видача / відправка',
        '<strong>Для складу.</strong> Видача вантажу зі складу. Видача можлива тільки при gate=pass. Без 100% оплати — видача системно заблокована.<br><br><strong>Раніше (AS-IS):</strong> менеджер або фінансист дзвонив і казав «можна видавати». Ви не мали підтвердження в письмовому вигляді. Якщо відбулась помилка — не було аудит-сліду, хто і коли дав дозвіл. Сценарій видачі (самовивіз/доставка Київ/інше місто/НП) визначали усно.<br><strong>Тепер у F1 (TO-BE):</strong> ви бачите live gate status badge у release panel без ручного уточнення. Кнопка видачі жорстко заблокована правилом gate≠pass — спроба фіксується в audit log. Для HIGH/CRITICAL кейсів потрібен додатковий approval. Prefilled release/dispatch форма із сценарієм (самовивіз/Київ/інше місто/НП). Обов\'язковий checklist валідує час/адресу/авто/отримувача. Факт відвантаження записується як подія в timeline (TC-WH-01, TC-WH-02).') +
      C.sectionHeroNotice('Контроль платіжного шлюзу',
        'Це критична секція: видача вантажу без підтвердження оплати може призвести до фінансових втрат. Шлюз у стані «БЛОКУВАННЯ» означає, що видачу зупинено до повної оплати.') +
      C.sectionNotice('Процес при БЛОКУВАННІ',
        'При статусі «БЛОКУВАННЯ» видача неможлива. Клієнт повинен здійснити доплату, після чого фінансист виконує повторну оцінку шлюзу. Тільки статус «ДОЗВІЛ» відкриває видачу.') +

      `<div class="card" style="border-left: 4px solid ${d.gate_status === 'fail' ? 'var(--danger)' : 'var(--success)'}">
        <div class="card-header">
          <span class="card-title">${C.caseLink(d.case_no)} — ${d.client}</span>
          ${C.gateBadge(d.gate_status)}
        </div>
        <div class="doc-meta-row"><span class="doc-meta-label">Причина шлюзу</span><span class="doc-meta-value text-danger">${d.gate_reason}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Оцінено о</span><span class="doc-meta-value">${d.gate_evaluated_at}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Оцінив</span><span class="doc-meta-value">${d.gate_evaluated_by}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">На складі з</span><span class="doc-meta-value">${d.stored_since} (${d.storage_days} днів)</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Видача</span><span class="doc-meta-value">${d.release_blocked ? '<span class="text-danger font-bold">ЗАБЛОКОВАНО</span>' : '<span class="text-success font-bold">ДОЗВОЛЕНО</span>'}</span></div>
      </div>` +

      // ── Dispatch Types Detail ──
      C.section('Типи видачі / відправки') +
      C.sectionNotice('Вибір типу',
        'Тип видачі визначає процедуру та додаткові документи. Кожен тип має свій чекліст.') +
      C.table(
        ['Тип', 'Опис', 'Додаткові документи', 'Доступний'],
        [
          ['Самовивіз', 'Клієнт забирає вантаж зі складу особисто', 'Довіреність, паспорт', d.release_blocked ? '<span class="badge-status blocked">Заблоковано</span>' : '<span class="badge-status done">Так</span>'],
          ['Доставка (Київ)', 'Доставка транспортом компанії по Києву', 'Маршрутний лист', d.release_blocked ? '<span class="badge-status blocked">Заблоковано</span>' : '<span class="badge-status done">Так</span>'],
          ['Доставка (інше місто)', 'Доставка транспортом компанії по Україні', 'CMR, маршрутний лист', d.release_blocked ? '<span class="badge-status blocked">Заблоковано</span>' : '<span class="badge-status done">Так</span>'],
          ['Нова Пошта', 'Відправка через Нова Пошта', 'ТТН, пакувальний лист', d.release_blocked ? '<span class="badge-status blocked">Заблоковано</span>' : '<span class="badge-status done">Так</span>'],
        ]
      ) +

      C.actionBar('Дії видачі', [
        { label: 'Запит авторизації видачі', cls: 'btn-primary', disabled: d.release_blocked, onclick: "openModal('release-approval')" },
        { label: 'Самовивіз', cls: 'btn-primary', disabled: d.release_blocked },
        { label: 'Доставка (Київ)', cls: 'btn-primary', disabled: d.release_blocked },
        { label: 'Доставка (інше місто)', cls: 'btn-primary', disabled: d.release_blocked },
        { label: 'Нова Пошта', cls: 'btn-primary', disabled: d.release_blocked },
        { label: 'Переглянути деталі шлюзу', cls: 'btn-ghost', onclick: "navigate('#/roles/finance/gate')" },
      ]) +

      C.section('Approval Touchpoints (MVP)') +
      C.sectionHeroNotice('Approval path для видачі',
        'Release/dispatch для HIGH/CRITICAL кейсів вимагає RELEASE_AUTHORIZATION_APPROVAL від Керівника складу. Якщо approval відхилено, release panel лишається заблокованим і створюється escalation task.') +
      C.sectionNotice('Деталі рішення',
        'Рішення ведеться через approval inbox/detail (SH-09). ' + C.link('#/shared/approvals', 'Переглянути Approval Inbox →')) +
      C.table(
        ['Тригер', 'Approval type', 'Роль', 'Верифікація', 'SLA'],
        [
          ['Release/dispatch HIGH/CRITICAL', C.approvalTypeBadge('RELEASE_AUTHORIZATION_APPROVAL'), C.roleLabel('WAREHOUSE_LEAD'), C.verificationModeBadge('standard'), '15 хв'],
        ]
      ) +

      C.modal('release-approval', 'Запит авторизації видачі',
        '<p>Ви створюєте запит на авторизацію видачі для кейсу <strong>' + d.case_no + '</strong>.</p>' +
        '<p class="text-sm text-warning mt-8">⚠ Запит потрапить в approval inbox Керівника складу зі стандартною верифікацією. SLA — 15 хв.</p>' +
        C.formGroup('Тип видачі', C.formSelect([
          { value: 'pickup', label: 'Самовивіз' },
          { value: 'delivery_kyiv', label: 'Доставка Київ' },
          { value: 'delivery_other', label: 'Доставка інше місто' },
          { value: 'nova_poshta', label: 'Нова Пошта' },
        ])) +
        C.formGroup('Коментар', C.formInput('Додатковий коментар...')),
        C.btn('Створити запит', 'btn-primary', 'onclick="closeModal(\'release-approval\')"') + ' ' + C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'release-approval\')"')
      ) +

      // ── Edge Cases ──
      C.section('Edge Cases (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Шлюз БЛОКУВАННЯ (поточний стан):</strong> Видача повністю заблокована. Очікується доплата €2,250 від клієнта ${d.client}.</li>
          <li><strong>Override шлюзу:</strong> У виняткових випадках можливий override через PAYMENT_GATE_OVERRIDE_APPROVAL (deep verify, Керівник фінансів).</li>
          <li><strong>Прострочене зберігання:</strong> При зберіганні понад ${d.storage_days} днів — автоматичне нарахування складського збору та повідомлення клієнту.</li>
          <li><strong>Частковий вантаж:</strong> Якщо прибула тільки частина — видача частини можлива за окремим approval.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'wh03-loading', label: 'Завантаження' },
        { id: 'wh03-empty', label: 'Порожній' },
        { id: 'wh03-forbidden', label: 'Доступ заборонено' },
      ]) +
      C.tabContent('wh03-loading', C.skeleton(3, 5)) +
      C.tabContent('wh03-empty', C.emptyState('Немає вантажів для видачі', 'Вантажі для видачі з\'являться після завершення приймання та оцінки платіжного шлюзу.')) +
      C.tabContent('wh03-forbidden', C.forbiddenState('Склад'));
  },

  // ─── WH-04 Журнал інцидентів ───
  '#/roles/warehouse/issues': function() {
    const d = DATA.warehouse.data.issueLog;
    return C.pageHeader('Журнал інцидентів', 'WH-04 — Реєстрація складських інцидентів') +
      C.heroNotice('Журнал інцидентів',
        '<strong>Для складу.</strong> Реєстрація складських інцидентів: пошкодження, невідповідність кількості, порушення умов зберігання.<br><br><strong>Раніше (AS-IS):</strong> про інциденти повідомляли усно або листом. Фото пошкоджень додавали як вкладення до email. Не було системного трекінгу: хто виявив, коли, що зробили. Відповідальний за вирішення визначався ситуативно.<br><strong>Тепер у F1 (TO-BE):</strong> кожен інцидент прив\'язаний до кейсу з обов\'язковим описом, фото-фіксацією та категоризацією. Система автоматично визначає severity і створює задачу відповідальній ролі з SLA. Усі дії з інцидентом фіксуються в timeline кейсу.') +

      C.table(
        ['ID', 'Кейс', 'Тип', 'Критичність', 'Опис', 'Хто зафіксував', 'Статус', 'Фото'],
        d.incidents.map(i => [
          `<span class="font-mono text-sm">${i.id}</span>`,
          C.caseLink(i.case_no),
          `<span>${C.typeLabel(i.type)}</span>`,
          C.severityBadge(i.severity),
          i.description,
          `<span class="text-sm">${i.reported_by}</span>`,
          C.statusBadge(i.status),
          `${i.photos} 📷`
        ])
      ) +

      C.actionBar('Дії з інцидентами', [
        { label: 'Зареєструвати інцидент', cls: 'btn-primary', onclick: "openModal('create-issue')" },
        { label: 'Додати фото', cls: 'btn-secondary' },
        { label: 'Ескалювати', cls: 'btn-danger' },
      ]) +

      // ── Create Issue Modal ──
      C.modal('create-issue', 'Реєстрація нового інциденту',
        `<div class="mt-8">
          ${C.formGroup('Кейс', C.formInput('F1-2026-XXXXX', ''))}
          ${C.formGroup('Тип інциденту', C.formSelect([
            { value: '', label: '— Оберіть тип —' },
            { value: 'damaged_packaging', label: 'Пошкодження пакування' },
            { value: 'damaged_goods', label: 'Пошкодження товару' },
            { value: 'count_mismatch', label: 'Розбіжність кількості' },
            { value: 'weight_mismatch', label: 'Розбіжність ваги' },
            { value: 'wrong_labeling', label: 'Невірне маркування' },
            { value: 'temperature_violation', label: 'Порушення температурного режиму' },
            { value: 'storage_condition', label: 'Порушення умов зберігання' },
            { value: 'other', label: 'Інше' },
          ]))}
          ${C.formGroup('Критичність', C.formSelect([
            { value: 'low', label: 'Низька' },
            { value: 'medium', label: 'Середня' },
            { value: 'high', label: 'Висока' },
            { value: 'critical', label: 'Критична' },
          ]))}
          ${C.formGroup('Опис інциденту', '<textarea class="form-textarea" rows="4" placeholder="Детальний опис інциденту..."></textarea>')}
          ${C.formGroup('Фото (доказова база)', '<input type="file" class="form-input" accept="image/*" multiple disabled>')}
          <p class="text-sm text-muted">Фото є обов'язковим для інцидентів типу «пошкодження». Мінімум 1 фото.</p>
        </div>`,
        C.btn('Зареєструвати', 'btn-primary', 'onclick="closeModal(\'create-issue\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'create-issue\')"')
      ) +

      // ── Assignment Panel ──
      C.section('Призначення відповідальних') +
      C.sectionNotice('Автоматичне призначення',
        'Інциденти автоматично призначаються відповідальній ролі залежно від типу. Ручне перепризначення доступне.') +
      C.table(
        ['Тип інциденту', 'Автоматичне призначення', 'SLA вирішення'],
        [
          ['Пошкодження пакування / товару', 'Склад → Автологістика → Страхування', '24 год'],
          ['Розбіжність кількості / ваги', 'Склад → Брокер', '12 год'],
          ['Порушення температурного режиму', 'Склад → Ескалація на керівника', '4 год'],
          ['Інше', 'Склад → Операційний адміністратор', '24 год'],
        ]
      ) +

      // ── Severity Escalation ──
      C.section('Ескалація за критичністю') +
      `<div class="card">
        <div class="card-title">Правила ескалації</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Низька</span><span class="doc-meta-value">Стандартний потік, без ескалації</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Середня</span><span class="doc-meta-value">Повідомлення відповідальній ролі, SLA 24 год</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Висока</span><span class="doc-meta-value">Негайне повідомлення, SLA 12 год, блокує подальший рух</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Критична</span><span class="doc-meta-value text-danger font-bold">Негайна ескалація на керівника операцій, SLA 4 год, кейс блокується</span></div>
      </div>` +

      // ── SLA Timer ──
      C.section('SLA контроль інцидентів') +
      C.table(
        ['ID', 'Тип', 'Критичність', 'SLA стан', 'Дедлайн', 'Залишок'],
        d.incidents.filter(i => i.status === 'open').map(i => [
          i.id,
          C.typeLabel(i.type),
          C.severityBadge(i.severity),
          C.slaBadge(i.severity === 'high' || i.severity === 'critical' ? 'at_risk' : 'on_track'),
          i.severity === 'critical' ? '4 год' : i.severity === 'high' ? '12 год' : '24 год',
          i.severity === 'critical' ? '<span class="text-danger font-bold">2 год 15 хв</span>' : '18 год'
        ])
      ) +

      // ── Evidence Upload ──
      C.section('Доказова база') +
      `<div class="card">
        <div class="card-title">Завантажені докази</div>
        ${d.incidents.map(i => `
          <div class="doc-meta-row">
            <span class="doc-meta-label">${i.id} — ${C.typeLabel(i.type)}</span>
            <span class="doc-meta-value">${i.photos} 📷 фото ${i.status === 'open' ? C.btn('+ Додати', 'btn-sm btn-secondary') : ''}</span>
          </div>
        `).join('')}
      </div>` +

      // ── Edge Cases ──
      C.section('Edge Cases (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Інцидент без фото:</strong> Система блокує збереження інцидентів типу «пошкодження» без хоча б 1 фото.</li>
          <li><strong>Повторний інцидент:</strong> Якщо подібний інцидент вже зареєстрований для цього кейсу — система попереджує про можливий дублікат.</li>
          <li><strong>Ескалація після SLA:</strong> При перевищенні SLA інцидент автоматично ескалюється на наступний рівень.</li>
          <li><strong>Пов'язані кейси:</strong> Якщо один інцидент впливає на кілька кейсів — можна створити спільний інцидент з прив'язкою до всіх.</li>
        </ul>
      </div>` +

      // ── Audit Trail ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-08 14:30', actor: 'Віктор Г. (Склад)', event: 'IssueCreated', detail: 'Зареєстровано ISS-101: пошкоджене пакування для F1-2026-00139', reason_code: 'ISSUE_DAMAGED', correlation_id: 'corr-iss-101' },
        { ts: '2026-02-08 14:45', actor: 'Система', event: 'IssueAssigned', detail: 'Інцидент призначено: Склад → Автологістика', correlation_id: 'corr-iss-101' },
        { ts: '2026-02-08 15:00', actor: 'Віктор Г. (Склад)', event: 'EvidenceUploaded', detail: '3 фото завантажено як доказова база', correlation_id: 'corr-iss-101' },
      ]);
  },

});
