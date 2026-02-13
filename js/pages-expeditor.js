/* =====================================================
   Експедитор Pages: EX-01..EX-04
   ===================================================== */

registerPages({

  // ─── EX-01 Робочий простір експедитора ───
  '#/roles/expeditor/workspace': function() {
    var d = DATA.expeditor.data.workspace;
    var w = d.widgets;
    return C.pageHeader('Робочий простір експедитора', 'EX-01 — Термінал Польщі: arrival, submission, MRN, handover') +
      C.heroNotice('Робочий простір експедитора (Польща)',
        '<strong>Для експедитора (термінал у Польщі).</strong> Керування terminal-етапом: arrival check-in, термінальна подача на митницю, передача в road/transit.<br><br><strong>Раніше (AS-IS):</strong> повідомлення про прибуття (ДСК) приходило на email. Фактичні параметри (вага, місця) записували на папері. Готовність до подачі/вивозу повідомляли дзвінком або листом логісту та брокеру. MRN фіксували в записці.<br><strong>Тепер у F1 (TO-BE):</strong> arrival notice потрапляє як структурована задача у ваш inbox. Check-in форма автоматично порівнює параметри з packet кейсу. MRN зберігається з валідацією формату і audit trail. Подія «MRN received» автоматично розблоковує road-задачі. Готовність синхронізується через дошку передач з role-acknowledgement і SLA (TC-EXP-01, TC-EXP-02).') +

      // Navigation
      C.section('Навігація') +
      '<div class="card-grid">' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/roles/expeditor/arrival-checkin\')"><div style="font-weight:600;">📥 Реєстрація прибуття</div><div class="text-sm text-secondary">EX-02 — Прибуття та реєстрація ДСК</div></div>' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/roles/expeditor/terminal-submission\')"><div style="font-weight:600;">📋 Термінальна подача та MRN</div><div class="text-sm text-secondary">EX-03 — Submission, sealed, LRN/MRN</div></div>' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/roles/expeditor/handover\')"><div style="font-weight:600;">🤝 Дошка передач</div><div class="text-sm text-secondary">EX-04 — Матриця передач broker → expeditor → road</div></div>' +
        '<div class="card" style="cursor:pointer;" onclick="navigate(\'#/shared/handover-board\')"><div style="font-weight:600;">🔄 SH-10 Дошка передач (загальна)</div><div class="text-sm text-secondary">Внутрішні передачі і контроль SLA</div></div>' +
      '</div>' +

      // Queues
      C.statCards([
        { value: d.queues.arrival_notices, label: 'Повідомлення про прибуття (ДСК)', color: 'accent' },
        { value: d.queues.terminal_submission, label: 'Термінальна подача', color: 'warning' },
        { value: d.queues.mrn_pending, label: 'MRN в очікуванні', color: 'warning' },
        { value: d.queues.handover_to_road, label: 'Передача в автоконтур', color: '' },
      ]) +

      // Active tasks & alerts
      C.section('Операційні показники') +
      C.statStrip([
        { value: w.active_terminal_tasks, label: 'Активні задачі терміналу', color: 'accent' },
        { value: w.arrival_mismatch_alerts, label: 'Розбіжності при прибутті', color: w.arrival_mismatch_alerts > 0 ? 'danger' : '' },
        { value: w.sealed_required_cases, label: 'Очікують пломбування', color: 'warning' }
      ]) +

      // P0: Handover to Road SLA widget
      C.section('P0: SLA передач в автоконтур') +
      C.sectionHeroNotice('Критичні передачі в автоконтур',
        'Цей віджет показує SLA стан передач від експедитора до автологістики. Breached передачі потребують негайної ескалації.') +
      C.sectionNotice('Дії',
        'Для failed або breached передач — перейдіть до SH-10 Дошки передач для ack/escalation.') +
      C.table(
        ['Кейс', 'До ролі', 'SLA', 'Термін', 'Статус'],
        d.handover_to_road_sla.map(function(h) { return [
          C.caseLink(h.case_no), C.roleLabel(h.to_role), C.slaBadge(h.sla_state),
          h.due_at, C.handoverStatusBadge(h.status)
        ]; })
      ) +
      '<div class="mt-8">' + C.btn('Відкрити дошку передач →', 'btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"') + '</div>' +

      // MRN Pending by SLA
      C.section('MRN в очікуванні за SLA') +
      C.table(
        ['Кейс', 'SLA', 'Термін'],
        w.pending_mrn_by_sla.map(function(m) { return [
          C.caseLink(m.case_no), C.slaBadge(m.sla_state), m.due_at
        ]; })
      );
  },

  // ─── EX-02 Arrival Check-in ───
  '#/roles/expeditor/arrival-checkin': function() {
    var d = DATA.expeditor.data.arrivalCheckin;
    return C.pageHeader('Реєстрація прибуття', 'EX-02 — Реєстрація прибуття на термінал (ДСК)') +
      C.heroNotice('Реєстрація прибуття (ДСК)',
        '<strong>Для експедитора.</strong> Форма реєстрації фактичних параметрів прибуття за terminal notice (ДСК): вага, кількість місць, час.<br><br><strong>Раніше (AS-IS):</strong> ДСК приходив на email як лист із вкладенням. Ви порівнювали дані з документами вручну. Якщо вага або кількість не збігалась — писали email логісту або менеджеру і чекали відповіді. Реєстрація прибуття — лист «вантаж на терміналі».<br><strong>Тепер у F1 (TO-BE):</strong> ДСК потрапляє через ingest як структурована задача. При check-in система автоматично порівнює вагу/місця з packet і підсвічує ризики. Дія «mark arrived» змінює стан кейсу та додає подію ArrivalRegistered в timeline. Пакет для наступного кроку формується через packet checklist з explicit prerequisites (TC-EXP-01).') +
      // Arrival task payload
      '<div class="card mb-16">' +
        '<div class="card-header">' +
          '<span class="card-title">Прибуття: ' + C.caseLink(d.case_no) + '</span>' +
          (d.has_mismatch ? '<span class="badge-severity high">Розбіжність</span>' : '<span class="badge-status done">Без розбіжностей</span>') +
        '</div>' +
        '<div class="card-grid">' +
          '<div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">ДСК референс</span><span class="doc-meta-value font-mono">' + d.arrival_notice_ref + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Час прибуття</span><span class="doc-meta-value">' + d.arrival_time + '</span></div>' +
          '</div>' +
          '<div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Очікувана вага</span><span class="doc-meta-value">' + d.expected_weight_kg + ' кг</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Фактична вага</span><span class="doc-meta-value">' + d.actual_weight_kg + ' кг</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Очікувано місць</span><span class="doc-meta-value">' + d.expected_pieces + '</span></div>' +
            '<div class="doc-meta-row"><span class="doc-meta-label">Фактично місць</span><span class="doc-meta-value">' + d.actual_pieces + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Check-in form
      C.section('Форма check-in') +
      '<div class="form-row">' +
        C.formGroup('Фактична вага (кг) <span class="text-danger">*</span>', C.formInput('', d.actual_weight_kg)) +
        C.formGroup('Фактична кількість місць <span class="text-danger">*</span>', C.formInput('', d.actual_pieces)) +
        C.formGroup('Час прибуття <span class="text-danger">*</span>', C.formInput('', d.arrival_time)) +
      '</div>' +

      // Packet documents
      C.section('Пакет документів') +
      C.table(
        ['Документ', 'Статус'],
        d.packet_docs.map(function(doc) { return [
          doc.doc,
          doc.status === 'received'
            ? '<span class="badge-status done">Отримано</span>'
            : '<span class="badge-status blocked">Відсутній</span>'
        ]; })
      ) +

      // Checklist
      C.section('Чекліст check-in') +
      C.checklist(d.checklist) +

      // Actions
      C.actionBar('Дії check-in', [
        { label: 'Позначити як прибуло', cls: 'btn-primary' },
        { label: 'Зберегти розбіжність', cls: 'btn-danger' },
        { label: 'Підтвердити готовність пакета', cls: 'btn-secondary' },
      ]);
  },

  // ─── EX-03 Terminal Submission & MRN ───
  '#/roles/expeditor/terminal-submission': function() {
    var d = DATA.expeditor.data.terminalSubmission;
    return C.pageHeader('Термінальна подача та MRN', 'EX-03 — Terminal submission, sealed event, LRN/MRN') +
      C.heroNotice('Термінальна подача та MRN',
        '<strong>Для експедитора.</strong> Подача на термінальну митницю, фіксація пломбування та capture MRN.<br><br><strong>Раніше (AS-IS):</strong> після отримання LRN від брокера ви їхали на термінал і подавали документи. Факт подачі, пломбування та отримання MRN фіксували в email або записці. Автологіст дізнавався про MRN через ваш дзвінок або лист.<br><strong>Тепер у F1 (TO-BE):</strong> після «LRN set» ви автоматично отримуєте задачу на термінальну подачу. Подача фіксується як action з evidence upload (файли/фото). Пломбування — окрема подія «sealed» з медіа та авто-сповіщенням суміжних ролей. MRN зберігається з валідацією формату. Подія «MRN received» автоматично розблоковує виїзд у road-задачі (TC-EXP-02).') +

      // Transit packet info
      '<div class="card mb-16">' +
        '<div class="card-header">' +
          '<span class="card-title">Submission: ' + C.caseLink(d.case_no) + '</span>' +
          C.statusBadge(d.submission_status) +
        '</div>' +
        '<div class="doc-meta-row"><span class="doc-meta-label">Transit Packet (від брокера)</span><span class="doc-meta-value font-mono">' + d.transit_packet_from_broker + '</span></div>' +
      '</div>' +

      // Evidence files
      C.section('Файли підтверджень') +
      C.sectionHeroNotice('Підтвердження подачі',
        'Без завантажених файлів підтверджень (штампи, квитанції) подача не може бути завершена. Це critical gate для terminal flow.') +
      C.sectionNotice('Файли',
        'Кожен файл має timestamp завантаження. Підтримуються PDF, JPG, PNG.') +
      C.table(
        ['Файл', 'Завантажено'],
        d.evidence_files.map(function(f) { return [
          '<span class="font-mono text-sm">' + f.name + '</span>', f.uploaded_at
        ]; })
      ) +
      '<div class="mt-8">' + C.btn('Завантажити підтвердження', 'btn-secondary') + '</div>' +

      // Sealed event
      C.section('Подія пломбування') +
      C.sectionHeroNotice('Подія пломбування',
        'Пломбування є обов\'язковим етапом для transit. Фіксується номер пломби, час та фото-evidence.') +
      C.sectionNotice('Статус',
        d.sealed_event.recorded ? 'Пломбування зафіксовано.' : 'Пломбування ще не виконано.') +
      '<div class="card">' +
        '<div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">' + (d.sealed_event.recorded ? '<span class="badge-status done">Зафіксовано</span>' : '<span class="badge-status blocked">Очікується</span>') + '</span></div>' +
        (d.sealed_event.recorded ? (
          '<div class="doc-meta-row"><span class="doc-meta-label">Час пломбування</span><span class="doc-meta-value">' + d.sealed_event.sealed_at + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Номер пломби</span><span class="doc-meta-value font-mono">' + d.sealed_event.seal_number + '</span></div>' +
          '<div class="doc-meta-row"><span class="doc-meta-label">Фото підтвердження</span><span class="doc-meta-value font-mono">' + d.sealed_event.evidence_photo + '</span></div>'
        ) : '') +
      '</div>' +

      // MRN
      C.section('MRN (Movement Reference Number)') +
      C.sectionHeroNotice('Фіксація MRN',
        'MRN є ключовим ідентифікатором transit. Після отримання MRN автоматично тригериться unblocking road задач. Формат MRN перевіряється.') +
      C.sectionNotice('Статус',
        d.mrn.value ? 'MRN отримано та підтверджено.' : 'MRN ще не отримано.') +
      '<div class="card">' +
        '<div class="doc-meta-row"><span class="doc-meta-label">MRN</span><span class="doc-meta-value font-mono">' + (d.mrn.value || '<span class="text-warning">В очікуванні</span>') + '</span></div>' +
        '<div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">' + C.statusBadge(d.mrn.status) + '</span></div>' +
      '</div>' +
      '<div class="form-row mt-12">' +
        C.formGroup('Ввести MRN', C.formInput('Формат: 26XX0000000000', '')) +
      '</div>' +

      // Actions
      C.actionBar('Дії submission', [
        { label: 'Розпочати submission', cls: 'btn-primary' },
        { label: 'Додати sealed event', cls: 'btn-secondary' },
        { label: 'Встановити/підтвердити MRN', cls: 'btn-primary' },
        { label: 'Позначити terminal release', cls: 'btn-primary' },
      ]);
  },

  // ─── EX-04 Handover Board (Expeditor) ───
  '#/roles/expeditor/handover': function() {
    var d = DATA.expeditor.data.handoverBoard;
    return C.pageHeader('Дошка передач (Експедитор)', 'EX-04 — Матриця передач broker → expeditor → road') +
      C.heroNotice('Дошка передач (Експедитор)',
        '<strong>Для експедитора.</strong> Синхронізація готовності між брокером, експедитором і автологістикою з підтвердженням прийому та SLA.<br><br><strong>Раніше (AS-IS):</strong> координація між офісом (брокер), терміналом (ви) та автоконтуром велась по телефону і email. Не було єдиного місця для відстеження, хто що передав і хто підтвердив. Загублені передачі виявлялись лише при запізненні.<br><strong>Тепер у F1 (TO-BE):</strong> матриця передач із чітким SLA на підтвердження (ack). Prerequisites checklist перед кожною передачею. Role acknowledgement panel — ви бачите, хто ще не підтвердив прийом. Failed handover автоматично створює задачу. Критичні передачі в автоконтур підсвічуються у P0 блоці (TC-EXP-01, TC-EXP-02).') +

      // Matrix
      C.section('Матриця передач') +
      C.table(
        ['Від', 'До', 'Статус', 'Передумови', 'SLA'],
        d.matrix.map(function(m) { return [
          C.roleLabel(m.from_role), C.roleLabel(m.to_role),
          C.handoverStatusBadge(m.status === 'acknowledged' ? 'received' : m.status),
          m.prerequisites_met ? '<span class="badge-status done">Виконано</span>' : '<span class="badge-status blocked">Не виконано</span>',
          C.slaBadge(m.sla_state)
        ]; })
      ) +

      // Prerequisites
      C.section('Чекліст передумов') +
      C.sectionHeroNotice('Передумови передачі',
        'Усі prerequisites повинні бути виконані перед передачею наступній ролі. Відсутній MRN блокує передачу road logistics.') +
      C.sectionNotice('Статус',
        d.blockers.length > 0 ? 'Блокери: ' + d.blockers.join(', ') : 'Усі передумови виконані.') +
      C.checklist(d.prerequisites) +

      // Blockers
      (d.blockers.length > 0 ? (
        '<div class="card mt-8" style="border-left: 4px solid var(--danger)">' +
          '<p class="text-danger font-bold">⚠ Блокери передачі:</p>' +
          '<ul>' + d.blockers.map(function(b) { return '<li class="text-sm">' + b + '</li>'; }).join('') + '</ul>' +
        '</div>'
      ) : '') +

      // SLA Timers
      C.section('SLA таймери') +
      C.table(
        ['Від', 'До', 'SLA', 'Статус'],
        d.matrix.map(function(m) { return [
          C.roleLabel(m.from_role), C.roleLabel(m.to_role), C.slaBadge(m.sla_state),
          C.handoverStatusBadge(m.status === 'acknowledged' ? 'received' : m.status)
        ]; })
      ) +

      // Actions
      C.actionBar('Дії передачі', [
        { label: 'Підтвердити отримання', cls: 'btn-primary', onclick: "openModal('ex-ho-ack')" },
        { label: 'Підтвердити готовність', cls: 'btn-primary', disabled: d.blockers.length > 0 },
        { label: 'Запросити уточнення', cls: 'btn-secondary' },
        { label: 'Ескалювати', cls: 'btn-danger', onclick: "openModal('ex-ho-escalate')" },
      ]) +

      // Link to SH-10
      '<div class="mt-16">' + C.btn('Відкрити SH-10 Дошка передач (загальна) →', 'btn-secondary', 'onclick="navigate(\'#/shared/handover-board\')"') + '</div>' +

      // Modals
      C.modal('ex-ho-ack', 'Підтвердити отримання пакета',
        '<p>Ви підтверджуєте отримання пакета документів від попередньої ролі.</p>' +
        '<p class="text-sm text-muted mt-8">Статус зміниться. Запис у timeline.</p>',
        C.btn('Підтвердити', 'btn-primary', 'onclick="closeModal(\'ex-ho-ack\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'ex-ho-ack\')"')
      ) +

      C.modal('ex-ho-escalate', 'Ескалювати передачу',
        C.formGroup('Причина ескалації', C.formInput('Обов\'язково вкажіть причину…')) +
        '<p class="text-sm text-danger mt-8">⚠ Ескалація сповістить керівника. Reason code обов\'язковий.</p>',
        C.btn('Ескалювати', 'btn-danger', 'onclick="closeModal(\'ex-ho-escalate\')"') + ' ' + C.btn('Назад', 'btn-ghost', 'onclick="closeModal(\'ex-ho-escalate\')"')
      );
  },

});
