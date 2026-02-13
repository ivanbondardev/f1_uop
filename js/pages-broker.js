/* =====================================================
   Брокер Pages: BR-01..BR-04
   ===================================================== */

registerPages({

  // ─── BR-01 Робочий простір брокера ───
  '#/roles/broker/workspace': function() {
    const d = DATA.broker.data.workspace;
    return C.pageHeader('Робочий простір брокера', 'BR-01 — Митне оформлення та транзит') +
      C.heroNotice('Робочий простір брокера',
        '<strong>Для брокера (8 осіб).</strong> Ваш робочий простір для підготовки T1, контролю декларацій та вирішення розбіжностей документів. Контроль митних процедур від прибуття до оформлення.<br><br><strong>Раніше (AS-IS):</strong> ви отримували документи email-ланцюгом від логіста або менеджера, вручну перевіряли повноту пакету (інвойс, пакувальний лист, контракт, специфікація, SWIFT). При розбіжностях — писали листи туди-назад. Статус розмитнення повідомляли усно або листом.<br><strong>Тепер у F1 (TO-BE):</strong> T1 completeness checker перевіряє mandatory packet системно. Звірка метаданих — side-by-side з автоматичними discrepancy flags. Подія «LRN set» автоматично створює контекст для експедитора. Після «cleared» система виконує transition і створює задачі видачі без ручного підтвердження (TC-BR-01, TC-BR-02).') +
      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card">${C.link('#/roles/broker/transit', '🚛 T1 і транзит →')}</div>
        <div class="card">${C.link('#/roles/broker/clearance', '📋 Митне оформлення →')}</div>
        <div class="card">${C.link('#/roles/broker/discrepancy', '⚖ Вирішення розбіжностей →')}</div>
      </div>` +

      C.statCards([
        { value: d.queues.t1_preparation, label: 'Підготовка T1', color: 'accent' },
        { value: d.queues.customs_active, label: 'Активні митні', color: 'warning' },
        { value: d.queues.discrepancy_open, label: 'Розбіжності', color: 'danger' },
        { value: d.queues.completed_today, label: 'Завершено сьогодні', color: 'success' },
      ]) +

      C.section('Активні декларації') +
      C.table(
        ['Кейс', 'Тип', 'LRN', 'MRN', 'Статус', 'Митний пост'],
        d.active_declarations.map(dec => [
          C.caseLink(dec.case_no), dec.type,
          `<span class="font-mono text-sm">${dec.lrn}</span>`,
          `<span class="font-mono text-sm">${dec.mrn}</span>`,
          C.statusBadge(dec.status), dec.customs_post
        ])
      ) +

      // P0: Broker handover backlog widget (2.3)
      C.section('P0: Черга передач (2.3)') +
      C.widget('Черга передач брокера', `
        <div class="doc-meta-row"><span class="doc-meta-label">Очікують підтвердження</span><span class="doc-meta-value font-bold text-warning">2</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Manual fallback</span><span class="doc-meta-value text-danger">1 — потребує уваги</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">SLA breached</span><span class="doc-meta-value">${C.slaBadge('breached')} 1 передача</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"'));
  },

  // ─── BR-02 T1 і транзит ───
  '#/roles/broker/transit': function() {
    const d = DATA.broker.data.t1_transit;
    const missingDocs = d.doc_status.filter(ds => ds.status === 'missing');
    const hasAllDocs = missingDocs.length === 0;

    return C.pageHeader('T1 і транзит', 'BR-02 — T1 транзитний пакет') +
      C.heroNotice('Документний пакет T1 транзиту',
        '<strong>Для брокера.</strong> Підготовка повного документного пакету для T1 транзиту та формування LRN для подачі на митницю.<br><br><strong>Раніше (AS-IS):</strong> ви збирали пакет документів із різних листів і вкладень. Повноту перевіряли за власним чеклістом. LRN фіксували в Excel або записці. Інформування експедитора про LRN — окремим листом або дзвінком.<br><strong>Тепер у F1 (TO-BE):</strong> система автоматично перевіряє completeness перед подачею. LRN фіксується з валідацією формату та audit trail. Подія «LRN set» автоматично надсилає контекст експедитору та суміжним ролям. MRN імпортується з формальною перевіркою формату. Checkpoint «packet_ready_for_transit» розблоковує наступні задачі (TC-BR-01, TC-BR-02).') +
      `<div class="card">
        <div class="card-title">Транзит: ${C.caseLink(d.case_no)}</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">LRN</span><span class="doc-meta-value font-mono">${d.lrn}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">MRN</span><span class="doc-meta-value font-mono">${d.mrn || 'В очікуванні'}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Тип транзиту</span><span class="doc-meta-value">${d.transit_type}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Митниця відправлення</span><span class="doc-meta-value">${d.origin_customs}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Митниця призначення</span><span class="doc-meta-value">${d.dest_customs}</span></div>
          </div>
        </div>
      </div>` +

      C.section("Обов'язкові документи") +
      C.table(
        ['Документ', 'Статус'],
        d.doc_status.map(ds => [
          ds.doc,
          ds.status === 'uploaded'
            ? `<span class="badge-status done">Завантажено</span>`
            : `<span class="badge-status blocked">Відсутній</span>`
        ])
      ) +

      (!hasAllDocs ? `<div class="card mt-8" style="border-left: 4px solid var(--danger)">
        <p class="text-danger font-bold">⚠ Відсутні обов'язкові документи: ${missingDocs.map(d => d.doc).join(', ')}</p>
        <p class="text-sm text-muted">Подача T1 на митницю заблокована до завантаження всіх обов'язкових документів.</p>
      </div>` : '') +

      // ── LRN/MRN Entry Form ──
      C.section('Введення LRN / MRN') +
      C.sectionNotice('Формат номерів',
        'LRN (Local Reference Number) — внутрішній номер, присвоюється при подачі. MRN (Movement Reference Number) — присвоюється митницею після прийняття декларації.') +
      `<div class="card">
        <div class="card-title">Оновлення номерів декларації</div>
        ${C.formGroup('LRN (Local Reference Number)', C.formInput('UA202602110001', d.lrn))}
        ${C.formGroup('MRN (Movement Reference Number)', C.formInput('Введіть MRN після отримання від митниці...', d.mrn || ''))}
        ${C.formGroup('Митний пост подачі', C.formSelect([
          { value: 'KBP-T1', label: 'KBP-T1 (Аеропорт Бориспіль)' },
          { value: 'yahodyn', label: 'Ягодин-Дорогуськ' },
          { value: 'krakovets', label: 'Краковець' },
          { value: 'rava-ruska', label: 'Рава-Руська' },
        ]))}
        <div class="mt-8">${C.btn('Зберегти номери', 'btn-secondary')}</div>
      </div>` +

      C.actionBar('Дії транзиту', [
        { label: 'Подати на митницю', cls: 'btn-primary', disabled: !hasAllDocs, onclick: "openModal('t1-submit')" },
        { label: 'Запросити відсутній документ', cls: 'btn-secondary', onclick: "openModal('request-doc')" },
      ]) +

      // ── T1 Submission Modal ──
      C.modal('t1-submit', 'Подача T1 на митницю',
        `<p>Ви подаєте T1 декларацію для кейсу <strong>${d.case_no}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">LRN</span><span class="doc-meta-value font-mono">${d.lrn}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Тип транзиту</span><span class="doc-meta-value">${d.transit_type}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Митниця відправлення</span><span class="doc-meta-value">${d.origin_customs}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Митниця призначення</span><span class="doc-meta-value">${d.dest_customs}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Документи завантажено</span><span class="doc-meta-value">${d.doc_status.filter(ds => ds.status === 'uploaded').length}/${d.doc_status.length}</span></div>
        </div>
        ${C.formGroup('Коментар (необов\'язково)', C.formInput('Додатковий коментар до подачі...'))}
        <p class="text-sm text-warning mt-8">⚠ Після подачі MRN буде присвоєно митницею. Очікуваний час: 1-4 години.</p>`,
        C.btn('Подати T1', 'btn-primary', 'onclick="closeModal(\'t1-submit\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'t1-submit\')"')
      ) +

      // ── Request Missing Doc Modal ──
      C.modal('request-doc', 'Запит відсутнього документу',
        `<p>Сформувати запит на надання відсутнього документу.</p>
        ${C.formGroup('Документ', C.formSelect(missingDocs.map(d => ({ value: d.doc, label: d.doc }))))}
        ${C.formGroup('Запросити у ролі', C.formSelect([
          { value: 'sales', label: 'Продажі' },
          { value: 'air', label: 'Авіалогістика' },
          { value: 'client', label: 'Клієнт (через Продажі)' },
        ]))}
        ${C.formGroup('Терміновість', C.formSelect([
          { value: 'normal', label: 'Звичайна' },
          { value: 'urgent', label: 'Термінова (блокує подачу)' },
        ]))}
        ${C.formGroup('Коментар', '<textarea class="form-textarea" rows="2" placeholder="Чому документ потрібен та що саме очікується..."></textarea>')}`,
        C.btn('Надіслати запит', 'btn-primary', 'onclick="closeModal(\'request-doc\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'request-doc\')"')
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Відсутні документи:</strong> ${!hasAllDocs ? '<span class="text-danger">Поточний стан — відсутні: ' + missingDocs.map(d => d.doc).join(', ') + '</span>' : 'Всі документи завантажені'}. Подача T1 заблокована до повного комплекту.</li>
          <li><strong>Відхилення митницею:</strong> Якщо T1 відхилено — статус змінюється на «rejected», формується задача на виправлення з описом причини відхилення.</li>
          <li><strong>Прострочений LRN:</strong> Якщо LRN не використаний протягом 30 днів, потребує повторної генерації.</li>
          <li><strong>Множинні T1:</strong> Один кейс може мати декілька T1 (наприклад, при перезавантаженні). Кожен T1 — окремий рядок з власним LRN/MRN.</li>
        </ul>
      </div>` +

      // ── UI States ──
      C.section('UI States (демо)') +
      C.tabs([
        { id: 'br02-loading', label: 'Завантаження' },
        { id: 'br02-empty', label: 'Порожній стан' },
        { id: 'br02-error', label: 'Помилка' },
      ]) +
      C.tabContent('br02-loading', C.skeleton(3, 5)) +
      C.tabContent('br02-empty', C.emptyState('Немає активних T1 транзитів', 'T1 транзитний пакет буде створено після отримання попереднього сповіщення від авіалогістики.')) +
      C.tabContent('br02-error', C.errorState('Помилка завантаження T1', 'Не вдалося завантажити дані транзитного пакету. Перевірте з\'єднання та спробуйте ще раз.'));
  },

  // ─── BR-03 Митне оформлення ───
  '#/roles/broker/clearance': function() {
    const d = DATA.broker.data.clearance;
    return C.pageHeader('Митне оформлення', 'BR-03 — Митне оформлення') +
      C.heroNotice('Митне оформлення',
        '<strong>Для брокера.</strong> Митне оформлення кейсу: тип декларації, HS-коди, розрахунок мит та ПДВ, статус інспекцій.<br><br><strong>Раніше (AS-IS):</strong> стан декларації відстежувався в окремій системі або Excel. Суму митних платежів повідомляли менеджеру листом або дзвінком. Затримки на інспекції виявлялись із запізненням без ескалації.<br><strong>Тепер у F1 (TO-BE):</strong> митне оформлення ведеться в Дошці митного оформлення зі станами (preparing → submitted → inspection → cleared) та escalation CTA. Сума митних платежів автоматично зберігається у фінансовому snapshot кейсу і відображається менеджеру/фінансам. Після «cleared» система автоматично створює задачі видачі/доставки (TC-BR-02).') +

      C.sectionHeroNotice('Митне оформлення',
        'Це критична секція: помилки у декларації можуть призвести до штрафів або конфіскації. Перевіряйте HS-коди та заявлену вартість ретельно.') +
      C.sectionNotice('Інспекції',
        'Якщо митниця ініціює огляд — кейс переходить у потік митного утримання (CR-05).') +

      `<div class="card">
        <div class="card-title">Декларація: ${C.caseLink(d.case_no)}</div>
        <div class="card-grid">
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Тип</span><span class="doc-meta-value">${d.declaration_type}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">HS-коди</span><span class="doc-meta-value font-mono">${d.hs_codes.join(', ')}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Статус</span><span class="doc-meta-value">${C.statusBadge(d.status)}</span></div>
          </div>
          <div>
            <div class="doc-meta-row"><span class="doc-meta-label">Заявлена вартість</span><span class="doc-meta-value">$${d.declared_value_usd.toLocaleString()}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">Митні збори</span><span class="doc-meta-value">$${d.customs_duties.toLocaleString()}</span></div>
            <div class="doc-meta-row"><span class="doc-meta-label">ПДВ</span><span class="doc-meta-value">$${d.vat.toLocaleString()}</span></div>
          </div>
        </div>
      </div>` +

      // ── HS-Code Validation Panel ──
      C.section('Валідація HS-кодів') +
      C.sectionNotice('Автоматична перевірка',
        'Система перевіряє HS-коди проти довідника та класифікатора. Невідповідності підсвічуються для ручної корекції.') +
      C.table(
        ['HS-код', 'Опис', 'Ставка мита', 'Статус валідації'],
        [
          ['8471.30', 'Портативні цифрові обчислювальні машини (ноутбуки)', '0%', '<span class="badge-status done">✓ Валідний</span>'],
          ['8473.30', 'Частини та приладдя машин позиції 8471', '0%', '<span class="badge-status done">✓ Валідний</span>'],
        ]
      ) +

      // ── Inspection Panel ──
      C.section('Панель інспекцій') +
      C.sectionNotice('Статус інспекцій',
        'Якщо митниця ініціює огляд, кейс автоматично блокується. Прогрес інспекції відстежується тут.') +
      (d.inspections.length === 0
        ? `<div class="card"><p class="text-muted">Інспекцій не ініційовано. Декларація проходить стандартну процедуру.</p></div>`
        : C.table(['ID', 'Тип', 'Статус', 'Дата'], d.inspections.map(i => [i.id, i.type, C.statusBadge(i.status), i.date]))
      ) +

      // ── Customs Hold Linkage ──
      C.section('Зв\'язок з потоком митного утримання') +
      `<div class="card">
        <div class="card-title">CR-05: Митне утримання</div>
        <p class="text-muted">Якщо митниця ініціює огляд, кейс автоматично переходить у потік митного утримання (CR-05) з кризовим SLA.</p>
        <div class="mt-8">
          ${C.btn('Переглянути CR-05 →', 'btn-sm btn-secondary', 'onclick="navigate(\'#/flows/customs-hold\')"')}
          ${C.btn('Ініціювати огляд (демо)', 'btn-sm btn-danger', 'onclick="openModal(\'initiate-inspection\')"')}
        </div>
      </div>` +

      C.actionBar('Дії оформлення', [
        { label: 'Завершити оформлення', cls: 'btn-primary', onclick: "openModal('complete-clearance')" },
        { label: 'Позначити огляд', cls: 'btn-danger', onclick: "openModal('initiate-inspection')" },
        { label: 'Запросити корекцію', cls: 'btn-secondary', onclick: "openModal('request-clearance-correction')" },
      ]) +

      // ── Complete Clearance Modal ──
      C.modal('complete-clearance', 'Завершення митного оформлення',
        `<p>Ви завершуєте митне оформлення для кейсу <strong>${d.case_no}</strong>.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Тип декларації</span><span class="doc-meta-value">${d.declaration_type}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Загальні мита + ПДВ</span><span class="doc-meta-value">$${(d.customs_duties + d.vat).toLocaleString()}</span></div>
        </div>
        ${C.formGroup('Номер митної декларації', C.formInput('Введіть номер фінальної МД...'))}
        <p class="text-sm text-warning mt-8">⚠ Після завершення оформлення кейс переходить до етапу «Готовий до видачі». Переконайтесь у правильності всіх даних.</p>`,
        C.btn('Завершити', 'btn-primary', 'onclick="closeModal(\'complete-clearance\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'complete-clearance\')"')
      ) +

      // ── Initiate Inspection Modal ──
      C.modal('initiate-inspection', 'Реєстрація митного огляду',
        `<p>Реєстрація рішення митниці про огляд для кейсу <strong>${d.case_no}</strong>.</p>
        ${C.formGroup('Тип огляду', C.formSelect([
          { value: '', label: '— Оберіть тип —' },
          { value: 'document', label: 'Документальний огляд' },
          { value: 'physical', label: 'Фізичний огляд' },
          { value: 'scanning', label: 'Сканування (рентген)' },
          { value: 'lab', label: 'Лабораторні тести' },
        ]))}
        ${C.formGroup('Причина (від митниці)', '<textarea class="form-textarea" rows="2" placeholder="Причина ініціювання огляду..."></textarea>')}
        <p class="text-sm text-danger mt-8">⚠ Ця дія запускає потік CR-05 «Митне утримання» з кризовим SLA 4 години.</p>`,
        C.btn('Зареєструвати огляд', 'btn-danger', 'onclick="closeModal(\'initiate-inspection\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'initiate-inspection\')"')
      ) +

      // ── Request Correction Modal ──
      C.modal('request-clearance-correction', 'Запит корекції декларації',
        `${C.formGroup('Поле з помилкою', C.formSelect([
          { value: 'hs_code', label: 'HS-код' },
          { value: 'value', label: 'Заявлена вартість' },
          { value: 'weight', label: 'Вага' },
          { value: 'description', label: 'Опис товару' },
          { value: 'other', label: 'Інше' },
        ]))}
        ${C.formGroup('Поточне значення', C.formInput('Поточне значення...'))}
        ${C.formGroup('Правильне значення', C.formInput('Правильне значення...'))}
        ${C.formGroup('Причина корекції', '<textarea class="form-textarea" rows="2" placeholder="Чому потрібна корекція..."></textarea>')}`,
        C.btn('Надіслати запит', 'btn-primary', 'onclick="closeModal(\'request-clearance-correction\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'request-clearance-correction\')"')
      ) +

      C.section('Точки затвердження (MVP)') +
      C.sectionHeroNotice('Шлюзи затвердження для митного оформлення',
        'Митне оформлення може потребувати approval при: (1) mismatch медичних позицій/реєстрів → MEDICAL_COMPLIANCE_APPROVAL (deep verify), (2) override митного поста поза довідником → CUSTOMS_REFERENCE_OVERRIDE_APPROVAL. Для обох сценаріїв decision flow йде через inbox рішень.') +
      C.sectionNotice('Коли запускається approval',
        'MEDICAL_COMPLIANCE_APPROVAL — mismatch медичних позицій/реєстрів, deep verify обов\'язковий. CUSTOMS_REFERENCE_OVERRIDE_APPROVAL — override митного поста, що не входить до довідника. ' + C.link('#/shared/approvals', 'Переглянути Inbox рішень →')) +
      C.table(
        ['Тригер', 'Approval type', 'Роль', 'Верифікація'],
        [
          ['Mismatch медичних позицій/реєстрів', C.approvalTypeBadge('MEDICAL_COMPLIANCE_APPROVAL'), C.roleLabel('BROKER'), C.verificationModeBadge('deep')],
          ['Override митного поста поза довідником', C.approvalTypeBadge('CUSTOMS_REFERENCE_OVERRIDE_APPROVAL'), C.roleLabel('BROKER_LEAD'), C.verificationModeBadge('standard')],
        ]
      ) +

      // ── Edge Cases ──
      C.section('Крайні випадки (демо)') +
      `<div class="card">
        <div class="card-title">Нестандартні ситуації</div>
        <ul>
          <li><strong>Невалідний HS-код:</strong> Якщо HS-код не знайдений у класифікаторі — підсвітка червоним, блокує подачу декларації.</li>
          <li><strong>Зміна вартості після подачі:</strong> Потребує amendment декларації та повторного розрахунку мит.</li>
          <li><strong>Огляд без завершення:</strong> Якщо фізичний огляд не завершений протягом SLA — автоматична ескалація на керівника.</li>
          <li><strong>Множинні HS-коди з різними ставками:</strong> Система розраховує зважене середнє, але брокер може переглянути деталі по кожній позиції.</li>
        </ul>
      </div>`;
  },

  // ─── BR-04 Вирішення розбіжностей ───
  '#/roles/broker/discrepancy': function() {
    const d = DATA.broker.data.discrepancy;
    return C.pageHeader('Вирішення розбіжностей', 'BR-04 — Розв\'язання розбіжностей') +
      C.heroNotice('Вирішення розбіжностей',
        '<strong>Для брокера.</strong> Порівняння документних метаданих поруч (CMR/AWB/Інвойс) для виявлення та розв\'язання розбіжностей.<br><br><strong>Раніше (AS-IS):</strong> ви відкривали документи по черзі і вручну порівнювали вагу, кількість місць, найменування між CMR, AWB та інвойсом. При розбіжностях — писали email-пінг відповідальним. Час вирішення не контролювався.<br><strong>Тепер у F1 (TO-BE):</strong> звірка виконується через side-by-side метадані з rule-based discrepancy flags. Брокер відкриває discrepancy exception із owner-role, SLA та переліком необхідних правок замість email-пінгу. Запит уточнень клієнту — через structured clarification task у sales communication panel (TC-BR-01).') +
      C.sectionHeroNotice('Розбіжність документів',
        'Невирішені розбіжності блокують перехід кейсу. Перевіряйте всі джерела та фіксуйте першопричину для аудиту.') +
      C.sectionNotice('SLA',
        'Для винятку розбіжності ваги діє SLA 24 години на відповідь. Таймер видимий.') +

      `<div class="card mb-16">
        <div class="card-header">
          <span class="card-title">Виняток: ${d.exception_id} (${C.caseLink(d.case_no)})</span>
          ${C.severityBadge('medium')}
        </div>
        <p class="text-secondary">Тип: <span>${C.typeLabel(d.type)}</span></p>
      </div>` +

      // ── Repeated Mismatch Detection ──
      C.section('Виявлення повторних розбіжностей') +
      `<div class="card" style="border-left: 4px solid var(--warning)">
        <div class="card-title">Аналіз повторень</div>
        <div class="doc-meta-row"><span class="doc-meta-label">Тип розбіжності</span><span class="doc-meta-value">${C.typeLabel(d.type)}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Кількість подібних за 30 днів</span><span class="doc-meta-value font-bold text-warning">3 випадки</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Пов'язані кейси</span><span class="doc-meta-value">${C.caseLink('F1-2026-00130')}, ${C.caseLink('F1-2026-00125')}</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Ймовірна системна причина</span><span class="doc-meta-value text-warning">Помилка зважування перевізника (повторюється для того ж агента)</span></div>
        <p class="text-sm text-muted mt-8">Система виявила повторюваний патерн. Рекомендується ескалювати до операційного адміністратора для системного вирішення.</p>
      </div>` +

      C.section('Порівняння документів') +
      C.compareGrid([
        {
          title: 'CMR',
          rows: [
            { label: 'Вага (кг)', value: d.sources.cmr.weight_kg, mismatch: true },
            { label: 'Місця', value: d.sources.cmr.pieces },
            { label: 'Дата', value: d.sources.cmr.date },
          ]
        },
        {
          title: 'AWB',
          rows: [
            { label: 'Вага (кг)', value: d.sources.awb.weight_kg, mismatch: true },
            { label: 'Місця', value: d.sources.awb.pieces },
            { label: 'Дата', value: d.sources.awb.date },
          ]
        }
      ]) +

      `<div class="compare-grid"><div class="compare-panel">
        <div class="compare-panel-title">Інвойс</div>
        <div class="compare-row mismatch"><span>Вага (кг)</span><span class="font-bold">${d.sources.invoice.weight_kg}</span></div>
        <div class="compare-row"><span>Місця</span><span class="font-bold">${d.sources.invoice.pieces}</span></div>
        <div class="compare-row"><span>Дата</span><span class="font-bold">${d.sources.invoice.date}</span></div>
      </div></div>` +

      C.section('Першопричина') +
      C.formGroup('Оберіть першопричину', C.formSelect(d.root_cause_options)) +

      // ── Correction Signal Form ──
      C.section('Запит корекції') +
      C.sectionNotice('Формування запиту',
        'Запит корекції надсилається відповідній ролі з деталями розбіжності. Роль-отримувач отримує задачу та дедлайн.') +
      `<div class="card">
        <div class="card-title">Новий запит корекції</div>
        ${C.formGroup('До ролі', C.formSelect([
          { value: 'air', label: 'Авіалогістика' },
          { value: 'road', label: 'Автологістика' },
          { value: 'sales', label: 'Продажі' },
          { value: 'warehouse', label: 'Склад' },
        ]))}
        ${C.formGroup('Документ для корекції', C.formSelect([
          { value: 'awb', label: 'AWB' },
          { value: 'cmr', label: 'CMR' },
          { value: 'invoice', label: 'Інвойс' },
          { value: 'packing', label: 'Пакувальний лист' },
        ]))}
        ${C.formGroup('Опис розбіжності', '<textarea class="form-textarea" rows="3" placeholder="Детальний опис знайденої розбіжності та очікувана корекція..."></textarea>')}
        ${C.formGroup('Дедлайн', C.formInput('', '2026-02-12 18:00'))}
      </div>` +

      C.section('Поточні запити на корекцію') +
      C.table(
        ['До ролі', 'Документ', 'Статус', 'Запрошено'],
        d.correction_requests.map(cr => [cr.to_role, cr.doc, C.statusBadge(cr.status), cr.requested_at])
      ) +

      C.actionBar('Дії вирішення', [
        { label: 'Надіслати запит корекції', cls: 'btn-primary', onclick: "openModal('send-correction')" },
        { label: 'Перевірити повторно', cls: 'btn-secondary', onclick: "openModal('revalidate')" },
        { label: 'Вирішити виняток', cls: 'btn-primary', onclick: "openModal('resolve-discrepancy')" },
      ]) +

      // ── Send Correction Modal ──
      C.modal('send-correction', 'Підтвердження запиту корекції',
        `<p>Запит корекції буде надіслано обраній ролі.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Виняток</span><span class="doc-meta-value">${d.exception_id}</span></div>
          <div class="doc-meta-row"><span class="doc-meta-label">Кейс</span><span class="doc-meta-value">${d.case_no}</span></div>
        </div>
        <p class="text-sm text-warning mt-8">⚠ Роль-отримувач отримає задачу з дедлайном. SLA активується з моменту відправки.</p>`,
        C.btn('Надіслати', 'btn-primary', 'onclick="closeModal(\'send-correction\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'send-correction\')"')
      ) +

      // ── Revalidate Modal ──
      C.modal('revalidate', 'Повторна перевірка',
        `<p>Перевірити документи повторно після отримання коригованої версії.</p>
        <div class="mt-8">
          <div class="doc-meta-row"><span class="doc-meta-label">Отримані нові версії</span><span class="doc-meta-value">${d.correction_requests.filter(cr => cr.status === 'done').length}/${d.correction_requests.length}</span></div>
        </div>
        <p class="text-sm text-muted mt-8">Порівняння буде оновлено з новими версіями документів. Якщо розбіжність вирішена — виняток можна закрити.</p>`,
        C.btn('Перевірити', 'btn-primary', 'onclick="closeModal(\'revalidate\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'revalidate\')"')
      ) +

      // ── Resolve Discrepancy Modal ──
      C.modal('resolve-discrepancy', 'Вирішення розбіжності',
        `<p>Закриття винятку <strong>${d.exception_id}</strong> для кейсу <strong>${d.case_no}</strong>.</p>
        ${C.formGroup('Результат вирішення', C.formSelect([
          { value: 'corrected', label: 'Документи скориговано — розбіжність усунена' },
          { value: 'accepted', label: 'Розбіжність прийнята (в межах допуску)' },
          { value: 'escalated', label: 'Ескальовано на керівника для рішення' },
        ]))}
        ${C.formGroup('Фінальна вага (кг)', C.formInput('Введіть узгоджену вагу...', ''))}
        ${C.formGroup('Коментар вирішення', '<textarea class="form-textarea" rows="3" placeholder="Обґрунтування рішення для аудиту..."></textarea>')}
        <p class="text-sm text-warning mt-8">⚠ Рішення фіксується в аудит-трейлі з reason_code і не може бути змінене після закриття.</p>`,
        C.btn('Вирішити', 'btn-primary', 'onclick="closeModal(\'resolve-discrepancy\')"') + ' ' +
        C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'resolve-discrepancy\')"')
      ) +

      // ── Audit Trail ──
      C.section('Аудит-трейл (демо)') +
      C.timeline([
        { ts: '2026-02-10 08:30', actor: 'Дмитро С. (Брокер)', event: 'ExceptionCreated', detail: 'Відкрито виняток EX-300: розбіжність ваги CMR/AWB/Інвойс', reason_code: 'WEIGHT_MISMATCH', correlation_id: 'corr-ex-300' },
        { ts: '2026-02-10 09:00', actor: 'Дмитро С. (Брокер)', event: 'CorrectionRequested', detail: 'Запит корекції AWB до Авіалогістики', reason_code: 'CORRECTION_AWB', correlation_id: 'corr-ex-300' },
        { ts: '2026-02-10 09:00', actor: 'Система', event: 'SLAStarted', detail: 'SLA 24 год на відповідь активовано', correlation_id: 'corr-ex-300' },
      ]);
  },

});
