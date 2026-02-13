/* =====================================================
   F1 Операційна платформа — Повторно використовувані UI-компоненти
   ===================================================== */

const C = {

  // ─── Page-level Hero Notice (mandatory per policy) ───
  heroNotice(title, body) {
    return `<div class="hero-notice">
      <div class="hero-notice-title">${title}</div>
      <p>${body}</p>
    </div>`;
  },

  // ─── Page-level Notice (mandatory per policy) ───
  notice(title, body) {
    return `<div class="notice">
      <div class="notice-title">${title}</div>
      <p>${body}</p>
    </div>`;
  },

  // ─── Section-level notices (critical sections only) ───
  sectionHeroNotice(title, body) {
    return `<div class="section-hero-notice">
      <div class="hero-notice-title">${title}</div>
      <p>${body}</p>
    </div>`;
  },

  sectionNotice(title, body) {
    return `<div class="section-notice">
      <div class="notice-title">${title}</div>
      <p>${body}</p>
    </div>`;
  },

  // ─── Page Header ───
  pageHeader(title, subtitle) {
    return `<div class="page-header">
      <h1 class="page-title">${title}</h1>
      ${subtitle ? `<div class="page-subtitle">${subtitle}</div>` : ''}
    </div>`;
  },

  // ─── Section Title ───
  section(title) {
    return `<h2 class="section-title">${title}</h2>`;
  },

  // ─── SLA Badge ───
  slaBadge(state) {
    const labels = { on_track: 'В нормі', at_risk: 'Під ризиком', breached: 'Порушено' };
    const cls = (state || '').replace(/_/g, '-');
    return `<span class="badge-sla ${cls}">${labels[state] || state}</span>`;
  },

  // ─── Status Badge ───
  statusBadge(status) {
    const labels = {
      open: 'Відкрито',
      in_progress: 'У роботі',
      done: 'Виконано',
      completed: 'Виконано',
      blocked: 'Заблоковано',
      pending: 'В очікуванні',
      cancelled: 'Скасовано',
      resolved: 'Вирішено',
      closed: 'Закрито',
      processing: 'Опрацювання',
      hold: 'Утримання',
      released: 'Випущено',
      confirmed: 'Підтверджено',
      draft: 'Чернетка',
      matched: 'Зіставлено',
      partial: 'Частково',
      unmatched: 'Не зіставлено',
      approved: 'Підтверджено',
      ready_to_issue: 'Готово до виставлення',
      pending_review: 'На перевірці',
      active: 'Активно',
      scheduled: 'Заплановано',
      in_flight: 'У польоті',
      customs_check: 'Митна перевірка',
      waiting_for_rates: 'Очікування ставок',
      waiting_client_confirm: 'Очікування клієнта',
      case_created: 'Кейс створено',
      expired: 'Протерміновано',
      lost: 'Програно',
      onboarding: 'Онбординг'
    };
    const cls = (status || '').replace(/_/g, '-');
    return `<span class="badge-status ${cls}">${labels[status] || status}</span>`;
  },

  // ─── Gate Badge ───
  gateBadge(state) {
    const s = (state || '').toLowerCase();
    const labels = {
      pass: 'ДОЗВІЛ',
      fail: 'БЛОКУВАННЯ',
      pending: 'ОЧІКУЄТЬСЯ'
    };
    return `<span class="badge-gate ${s}">${labels[s] || s.toUpperCase()}</span>`;
  },

  // ─── Severity Badge ───
  severityBadge(sev) {
    const labels = { high: 'Висока', medium: 'Середня', low: 'Низька' };
    return `<span class="badge-severity ${sev}">${labels[sev] || sev}</span>`;
  },

  // ─── Priority Badge ───
  priorityBadge(p) {
    const labels = { high: 'Високий', medium: 'Середній', normal: 'Звичайний', low: 'Низький' };
    return `<span class="badge-priority ${p}">${labels[p] || p}</span>`;
  },

  // ─── Entity / enum labels ───
  roleLabel(role) {
    const labels = {
      Sales: 'Продажі',
      'Air Logistics': 'Авіалогістика',
      Broker: 'Брокер',
      'Road Logistics': 'Автологістика',
      Warehouse: 'Склад',
      Accounting: 'Бухгалтерія',
      Finance: 'Фінанси',
      'Ops Admin': 'Операційний адміністратор',
      op_admin: 'Операційний адміністратор',
      // UPPER_CASE approver role codes
      SALES: 'Продажі',
      SALES_LEAD: 'Керівник продажів',
      AIR_LOGISTICS: 'Авіалогістика',
      AIR_LOGISTICS_LEAD: 'Керівник авіалогістики',
      BROKER: 'Брокер',
      BROKER_LEAD: 'Керівник брокерів',
      ROAD_LOGISTICS: 'Автологістика',
      ROAD_LOGISTICS_LEAD: 'Керівник автологістики',
      WAREHOUSE: 'Склад',
      WAREHOUSE_LEAD: 'Керівник складу',
      ACCOUNTING: 'Бухгалтерія',
      ACCOUNTING_LEAD: 'Керівник бухгалтерії',
      FINANCE: 'Фінанси',
      FINANCE_LEAD: 'Керівник фінансів',
      OPS_ADMIN: 'Операційний адміністратор',
      OPS_LEAD: 'Керівник операцій',
      // snake_case role codes
      finance_user: 'Фінансист',
      broker_user: 'Брокер',
      accounting_user: 'Бухгалтер',
      warehouse_system: 'Система (Склад)',
      air_logistics: 'Авіалогістика',
      road_logistics: 'Автологістика',
      sales: 'Продажі',
      broker: 'Брокер',
      warehouse: 'Склад',
      system: 'Система',
      // Expeditor role
      Expeditor: 'Експедитор (Польща)',
      EXPEDITOR: 'Експедитор',
      EXPEDITOR_LEAD: 'Керівник експедиторів',
      expeditor: 'Експедитор',
      expeditor_user: 'Експедитор'
    };
    // Handle composite roles like "ROAD_LOGISTICS / BROKER"
    if (role && role.includes(' / ')) {
      return role.split(' / ').map(r => labels[r.trim()] || r.trim()).join(' / ');
    }
    return labels[role] || role;
  },

  stageLabel(stage) {
    const labels = {
      'Customs Clearance': 'Митне оформлення',
      'Road Transit': 'Автотранзит',
      'Warehouse Release': 'Видача зі складу',
      'Payment Gate': 'Платіжний шлюз',
      'Air Booking': 'Авіабукінг',
      'Pre-Alert': 'Попереднє сповіщення',
      Accounting: 'Бухгалтерія',
      'Terminal Processing': 'Обробка на терміналі',
      Completed: 'Завершено'
    };
    return labels[stage] || stage;
  },

  typeLabel(type) {
    const labels = {
      payment_exception: 'Платіжний виняток',
      weight_mismatch: 'Розбіжність ваги',
      partial_arrival: 'Часткове прибуття',
      customs_hold: 'Митне утримання',
      damaged_packaging: 'Пошкоджене пакування',
      count_mismatch: 'Розбіжність кількості',
      amount_mismatch: 'Розбіжність суми',
      missing_event: 'Відсутня подія',
      duplicate: 'Дублікат',
      customs_clearance: 'Митне оформлення',
      border_crossing: 'Перетин кордону',
      payment_gate: 'Платіжний шлюз',
      client_comm: 'Комунікація з клієнтом',
      prealert: 'Попереднє сповіщення',
      cost_certificate: 'Довідка витрат',
      payment_allocation: 'Рознесення оплат',
      delivery_closure: 'Закриття доставки',
      task_assigned: 'Призначено завдання',
      task_nearing_breach: 'Завдання близьке до порушення SLA',
      task_breached: 'Завдання порушило SLA',
      document_approval: 'Погодження документа',
      exception_opened: 'Відкрито виняток',
      gate_changed: 'Змінено стан шлюзу',
      exception_escalated: 'Ескалація винятку',
      agent_invoice: 'Рахунок агента',
      low_confidence_extraction: 'Низька впевненість AI-екстрактора',
      approval_decision_required: 'Потрібне рішення (Approval)',
      approval_sla_at_risk: 'Approval SLA під ризиком',
      approval_sla_breached: 'Approval SLA порушено',
      // P0: Handover & Single-entry types
      handover_sent: 'Передачу надіслано',
      handover_acknowledged: 'Передачу підтверджено',
      handover_failed: 'Передачу не виконано',
      handover_escalated: 'Передачу ескальовано',
      handover_ack_required: 'Потрібне підтвердження передачі',
      handover_delivery_failed: 'Збій доставки передачі',
      single_entry_captured: 'Єдиний ввід зафіксовано',
      single_entry_conflict: 'Конфлікт єдиного вводу',
      single_entry_synced: 'Синхронізовано з 1С',
      accounting_single_entry_conflict: 'Конфлікт бухг. єдиного вводу',
      accounting_single_entry_override: 'Override бухг. єдиного вводу',
      insurance_request_sent: 'Запит страхування надіслано',
      insurance_confirmed: 'Страхування підтверджено',
      template_message_sent: 'Шаблонне повідомлення надіслано',
      template_message_failed: 'Збій шаблонного повідомлення',
      arrival_auto_synced: 'Прибуття авто-синхронізовано',
      arrival_sync_failed: 'Збій синхронізації прибуття',
      arrival_registered: 'Прибуття зареєстровано',
      arrival_mismatch: 'Розбіжність при прибутті',
      terminal_submission: 'Термінальна подача',
      mrn_received: 'MRN отримано',
      // Headless module events (Zammad / Mayan / Plane)
      conversation_article_received: 'Нове повідомлення (Zammad)',
      conversation_reply_sent: 'Відповідь надіслано (Zammad)',
      commitment_pinned: 'Комітмент зафіксовано',
      external_document_ingested: 'Документ імпортовано (Mayan)',
      external_document_version_added: 'Нову версію додано (Mayan)',
      external_task_state_changed: 'Стан задачі оновлено (Plane)',
      external_task_sync_issue: 'Проблема синхронізації задачі'
    };
    return labels[type] || type;
  },

  // ─── IMCP Current State Badge ───
  currentStateBadge(state) {
    const labels = {
      BROKER_REVIEW_PENDING: 'Очікує перевірки брокера',
      CUSTOMS_HOLD: 'Митне утримання',
      CUSTOMS_CHECK: 'Митна перевірка',
      IN_TRANSIT: 'В дорозі',
      BORDER_CROSSING: 'Перетин кордону',
      WAREHOUSE_RECEIVING: 'Приймання на складі',
      PAYMENT_GATE_PENDING: 'Очікує платіжного шлюзу',
      GATE_EVALUATION_PENDING: 'Очікує оцінки шлюзу',
      RELEASE_BLOCKED: 'Видачу заблоковано',
      DOCS_COMPLETE: 'Документи укомплектовано',
      READY_FOR_RELEASE: 'Готово до видачі',
      RELEASED: 'Видано',
      BOOKING_CONFIRMED: 'Букінг підтверджено',
      BOOKING_IN_PROGRESS: 'Букінг у процесі',
      PRE_ALERT_SENT: 'Попередній алерт надіслано',
      PREALERT_PREPARATION: 'Підготовка попереднього сповіщення',
      QUOTE_SENT: 'Комерційна пропозиція надіслана',
      CLIENT_CONFIRMED: 'Клієнт підтвердив',
      INVOICED: 'Виставлено рахунок',
      COST_CERT_PENDING: 'Довідка витрат в очікуванні',
      COST_CERT_IN_PROGRESS: 'Довідка витрат у процесі',
      DELIVERY_CLOSURE: 'Закриття доставки',
      COMPLETED: 'Завершено',
      EXCEPTION_OPEN: 'Виняток відкрито',
      ESCALATED: 'Ескальовано',
      // Expeditor states
      TERMINAL_ARRIVAL_PENDING: 'Очікує прибуття на термінал',
      TERMINAL_SUBMISSION_IN_PROGRESS: 'Термінальна подача',
      MRN_PENDING: 'Очікує MRN',
      HANDOVER_TO_ROAD_PENDING: 'Передача в автоконтур',
      SEALED_EVENT_RECORDED: 'Пломбування зафіксовано'
    };
    const cls = (state || '').toLowerCase().replace(/_/g, '-');
    return `<span class="badge-state ${cls}">${labels[state] || state}</span>`;
  },

  // ─── Case Status Badge (IMCP: open/blocked/done/archived) ───
  caseStatusBadge(status) {
    const labels = {
      open: 'Відкрито',
      blocked: 'Заблоковано',
      done: 'Виконано',
      archived: 'Архівовано'
    };
    const cls = (status || '').replace(/_/g, '-');
    return `<span class="badge-case-status ${cls}">${labels[status] || status}</span>`;
  },

  // ─── Extraction Confidence Badge ───
  confidenceBadge(score) {
    const pct = Math.round((score || 0) * 100);
    let cls = 'confidence-high';
    if (pct < 70) cls = 'confidence-low';
    else if (pct < 85) cls = 'confidence-medium';
    return `<span class="badge-confidence ${cls}" title="AI-впевненість: ${pct}%">${pct}%</span>`;
  },

  // ─── Verification Mode Badge ───
  verificationModeBadge(mode) {
    const labels = {
      standard: 'Стандартна',
      deep: 'Поглиблена',
      spot_check: 'Вибіркова',
      manual: 'Ручна'
    };
    const cls = (mode || '').replace(/_/g, '-');
    return `<span class="badge-verification ${cls}">${labels[mode] || mode}</span>`;
  },

  // ─── Transition State Label (for status rule transitions) ───
  transitionLabel(code) {
    const labels = {
      quote_confirmed: 'Пропозицію підтверджено',
      booking_requested: 'Букінг запитано',
      awb_confirmed: 'AWB підтверджено',
      arrived: 'Прибуло',
      customs_processing: 'Митне оформлення',
      customs_cleared: 'Митницю пройдено',
      release_ready: 'Готово до видачі',
      gate_pass: 'Шлюз пройдено',
      released: 'Видано'
    };
    return labels[code] || code;
  },

  // ─── Reason Code Label (audit trail localization) ───
  reasonCodeLabel(code) {
    const labels = {
      SLA_BREACHED: 'SLA порушено',
      SLA_BREACH_AUTO: 'Автоматичне порушення SLA',
      TASK_CREATED: 'Задачу створено',
      TASK_ASSIGNED: 'Задачу призначено',
      TASK_REASSIGNED: 'Задачу перепризначено',
      PRIORITY_CHANGE: 'Зміна пріоритету',
      OWNER_ROLE_CHANGE: 'Зміна ролі-власника',
      INVALID_TASK_TRANSITION: 'Невалідний перехід задачі',
      TASK_CANCEL_REASON_REQUIRED: 'Причина скасування обовʼязкова',
      TASK_ESCALATION_REASON_REQUIRED: 'Причина ескалації обовʼязкова',
      TASK_ALREADY_COMPLETED: 'Задачу вже завершено',
      INCOTERMS_ROUTE_CONFLICT: 'Конфлікт Incoterms/маршруту',
      SEARCH_QUERY_TOO_SHORT: 'Запит занадто короткий',
      INVALID_FILTER_VALUE: 'Невалідне значення фільтра',
      VIEW_NOT_FOUND: 'Подання не знайдено',
      UNAUTHORIZED_ROLE_SCOPE: 'Недостатній рольовий доступ',
      CASE_NOT_FOUND: 'Кейс не знайдено'
    };
    return labels[code] || code;
  },

  // ─── Approval Type Badge ───
  approvalTypeBadge(type) {
    const labels = {
      INVOICE_CAPTURE_APPROVAL: 'Затвердження інвойсу',
      MEDICAL_COMPLIANCE_APPROVAL: 'Медична відповідність',
      FX_DECISION_APPROVAL: 'Курсове рішення',
      DOC_FINALIZATION_APPROVAL: 'Фіналізація документа',
      PAYMENT_GATE_OVERRIDE_APPROVAL: 'Override платіжного шлюзу',
      RELEASE_AUTHORIZATION_APPROVAL: 'Авторизація видачі',
      INSURANCE_EXCEPTION_APPROVAL: 'Виняток страхування',
      CUSTOMS_REFERENCE_OVERRIDE_APPROVAL: 'Override митного довідника',
      RATE_OUTLIER_APPROVAL: 'Відхилення ставки',
      EXCEPTION_CLOSURE_APPROVAL: 'Закриття винятку'
    };
    const severity = {
      INVOICE_CAPTURE_APPROVAL: 'medium',
      MEDICAL_COMPLIANCE_APPROVAL: 'high',
      FX_DECISION_APPROVAL: 'medium',
      DOC_FINALIZATION_APPROVAL: 'low',
      PAYMENT_GATE_OVERRIDE_APPROVAL: 'high',
      RELEASE_AUTHORIZATION_APPROVAL: 'high',
      INSURANCE_EXCEPTION_APPROVAL: 'medium',
      CUSTOMS_REFERENCE_OVERRIDE_APPROVAL: 'medium',
      RATE_OUTLIER_APPROVAL: 'low',
      EXCEPTION_CLOSURE_APPROVAL: 'medium'
    };
    const sev = severity[type] || 'low';
    return `<span class="badge-approval-type ${sev}">${labels[type] || type}</span>`;
  },

  // ─── Approval Status Badge ───
  approvalStatusBadge(status) {
    const labels = { pending: 'В очікуванні', approved: 'Затверджено', rejected: 'Відхилено', cancelled: 'Скасовано', expired: 'Протерміновано' };
    const cls = (status || '').replace(/_/g, '-');
    return `<span class="badge-approval-status ${cls}">${labels[status] || status}</span>`;
  },

  // ─── Approval Snapshot Diff ───
  approvalSnapshotDiff(snapshot, title) {
    const rows = Object.entries(snapshot).map(([key, val]) => {
      const labelMap = {
        gate_current: 'Поточний стан шлюзу', gate_proposed: 'Запропонований стан', gate_before: 'Стан до', gate_after: 'Стан після',
        expected_total: 'Очікувана сума', received_total: 'Отримана сума', shortfall: 'Недоплата', justification: 'Обґрунтування',
        release_type: 'Тип видачі', client: 'Клієнт', pieces: 'Місця', gate_status: 'Статус шлюзу',
        doc_type: 'Тип документа', confidence: 'Впевненість AI', conflicting_fields: 'Конфліктні поля',
        product: 'Продукт', mismatch: 'Невідповідність', version: 'Версія', changes: 'Зміни',
        override_source: 'Джерело override', default_rule: 'Правило за замовчуванням', difference: 'Різниця',
        reason: 'Причина'
      };
      const label = labelMap[key] || key;
      const value = Array.isArray(val) ? val.join('; ') : val;
      return `<div class="compare-row"><span>${label}</span><span class="font-bold">${value}</span></div>`;
    }).join('');
    return `<div class="approval-snapshot-diff">
      <div class="compare-panel">
        <div class="compare-panel-title">${title || 'Знімок запиту'}</div>
        ${rows}
      </div>
    </div>`;
  },

  // ─── Deep Verify Checklist Panel ───
  deepVerifyChecklist(items, mode) {
    const total = items.filter(i => i.required !== false).length;
    const done = items.filter(i => i.done && i.required !== false).length;
    const allDone = done >= total;
    return `<div class="deep-verify-panel ${allDone ? 'complete' : 'incomplete'}">
      <div class="deep-verify-header">
        <span class="deep-verify-title">Чекліст верифікації (${C.verificationModeBadge(mode || 'deep')})</span>
        <span class="deep-verify-progress">${done} / ${total} обов'язкових</span>
      </div>
      <ul class="checklist">${items.map(i =>
        `<li class="checklist-item">
          <span class="check-icon ${i.done ? 'checked' : ''}">${i.done ? '✓' : ''}</span>
          <span>${i.item}${i.required === false ? ' <span class="text-muted text-sm">(необов\'язково)</span>' : ''}</span>
        </li>`
      ).join('')}</ul>
      ${!allDone ? '<div class="deep-verify-blocker">Кнопка «Затвердити» заблокована до завершення обов\'язкових перевірок</div>' : ''}
    </div>`;
  },

  // ─── Decision Footer (approve/reject/cancel + reason) ───
  decisionFooter(approvalId, status, checklistComplete) {
    const isPending = status === 'pending';
    const approveDisabled = !isPending || !checklistComplete;
    return `<div class="decision-footer">
      <div class="decision-footer-actions">
        ${C.btn('Затвердити', 'btn-primary' + (approveDisabled ? '' : ''), approveDisabled ? 'disabled title="Завершіть чекліст верифікації"' : `onclick="openModal('approval-approve')"`)
        }
        ${C.btn('Відхилити', isPending ? 'btn-danger' : 'btn-danger', isPending ? `onclick="openModal('approval-reject')"` : 'disabled')}
        ${C.btn('Скасувати', isPending ? 'btn-ghost' : 'btn-ghost', isPending ? `onclick="openModal('approval-cancel')"` : 'disabled')}
      </div>
      <div class="decision-footer-hint text-sm text-muted">Відхилення та скасування вимагають reason_code. Рішення незмінне після прийняття.</div>
    </div>`;
  },

  // ─── Correction Signal Form ───
  correctionSignalForm() {
    return `<div class="correction-signal-form">
      <div class="correction-signal-title">Сигнал корекції</div>
      <p class="text-sm text-muted mb-8">Заповніть, якщо ви редагуєте AI-чернетку пропозиції</p>
      ${C.formGroup('Тип корекції', C.formSelect(['Виправлення суми', 'Виправлення валюти', 'Виправлення поля', 'Інше']))}
      ${C.formGroup('Першопричина', C.formSelect(['Помилка OCR', 'Неповні дані джерела', 'Змінені умови', 'Інше']))}
      ${C.formGroup('Змінені поля', C.formInput('Вкажіть поля, що були змінені…'))}
    </div>`;
  },

  // ─── Approval Linked Context ───
  approvalLinkedContext(ctx) {
    let html = '<div class="approval-linked-context">';
    if (ctx.open_exceptions && ctx.open_exceptions.length) {
      html += '<div class="linked-section"><span class="linked-label">Відкриті винятки:</span> ' + ctx.open_exceptions.join(', ') + '</div>';
    }
    if (ctx.financial_decisions && ctx.financial_decisions.length) {
      html += '<div class="linked-section"><span class="linked-label">Фінансові рішення:</span> ' + ctx.financial_decisions.join(', ') + '</div>';
    }
    if (ctx.documents && ctx.documents.length) {
      html += '<div class="linked-section"><span class="linked-label">Документи:</span> ' + ctx.documents.join(', ') + '</div>';
    }
    html += '</div>';
    return html;
  },

  // ─── P0: Handover Channel Badge ───
  handoverChannelBadge(type) {
    const labels = { internal: 'Внутрішній', external: 'Зовнішній', mixed: 'Змішаний', 'system-managed': 'Системний' };
    const cls = (type || '').replace(/[_-]/g, '-');
    return `<span class="badge-status ${cls}">${labels[type] || type}</span>`;
  },

  // ─── P0: Handover Status Badge ───
  handoverStatusBadge(status) {
    const labels = { planned: 'Заплановано', sent: 'Надіслано', received: 'Отримано', failed: 'Збій' };
    const cls = { planned: 'pending', sent: 'in-progress', received: 'done', failed: 'blocked' };
    return `<span class="badge-status ${cls[status] || ''}">${labels[status] || status}</span>`;
  },

  // ─── P0: Handover Step Card ───
  handoverStepCard(step) {
    return `<div class="card" style="border-left:3px solid var(--accent); margin-bottom:8px;">
      <div class="flex justify-between items-center">
        <div>
          <div class="font-bold text-sm">${step.step_code || ''}: ${C.roleLabel(step.from_role)} → ${C.roleLabel(step.to_role)}</div>
          <div class="text-sm text-muted">${step.channel_code || ''} · ${C.handoverChannelBadge(step.channel_type)}</div>
        </div>
        <div>${C.handoverStatusBadge(step.status)} ${C.slaBadge(step.sla_state)}</div>
      </div>
    </div>`;
  },

  // ─── P0: Autoexchange Health Strip ───
  autoexchangeHealthStrip(metrics) {
    return this.statStrip([
      { value: metrics.system_managed_rate || '—', label: 'Системний канал', color: 'accent' },
      { value: metrics.manual_fallback_rate || '—', label: 'Ручний fallback', color: parseInt(metrics.manual_fallback_rate) > 10 ? 'danger' : 'accent' },
      { value: metrics.failed_count ?? '—', label: 'Збої доставки', color: metrics.failed_count > 0 ? 'danger' : 'accent' },
      { value: (metrics.avg_ack_minutes ?? '—') + ' хв', label: 'Час підтвердження' }
    ]);
  },

  // ─── P0: Single-Entry Source Badge ───
  singleEntrySourceBadge(mode) {
    const labels = { single_entry: 'Єдиний ввід', manual_override: 'Ручний override' };
    const cls = mode === 'manual_override' ? 'warning' : 'accent';
    return `<span class="badge-status ${cls === 'warning' ? 'blocked' : 'done'}">${labels[mode] || mode}</span>`;
  },

  // ─── P0: Single-Entry Conflict Status Badge ───
  conflictStatusBadge(status) {
    const labels = { none: 'Без конфліктів', open: 'Конфлікт відкрито', resolved: 'Конфлікт вирішено', overridden: 'Override' };
    const cls = { none: 'done', open: 'blocked', resolved: 'done', overridden: 'pending' };
    return `<span class="badge-status ${cls[status] || ''}">${labels[status] || status}</span>`;
  },

  // ─── P0: Duplicate Entry Conflict Panel ───
  duplicateEntryConflictPanel(conflicts) {
    if (!conflicts || conflicts.length === 0) return '';
    return `<div class="card" style="border-left:4px solid var(--danger); margin-bottom:12px;">
      <div class="card-title" style="color:var(--danger);">Конфлікти дублювання записів (${conflicts.length})</div>
      ${conflicts.map(c => `<div class="doc-meta-row">
        <span class="doc-meta-label">${c.field_group}: ${c.field}</span>
        <span class="doc-meta-value"><span class="text-danger">${c.existing_value}</span> ≠ <span class="font-bold">${c.new_value}</span> <span class="text-muted text-sm">(${c.source_ref})</span></span>
      </div>`).join('')}
    </div>`;
  },

  // ─── P0: Reuse To 1C Action ───
  reuseTo1CAction(entry) {
    const canSync = entry.conflict_status === 'none' || entry.conflict_status === 'resolved';
    return `<div class="flex gap-8">
      <button class="btn btn-sm btn-secondary" title="Перевикористати в задачі">♻ Повторити</button>
      <button class="btn btn-sm ${canSync ? 'btn-primary' : 'btn-ghost'}" ${canSync ? '' : 'disabled title="Є активні конфлікти"'}>⬆ Sync 1С</button>
    </div>`;
  },

  // ─── Stat Strip (compact inline metrics) ───
  statStrip(items) {
    return `<div class="stat-strip">${items.map(i =>
      `<div class="stat-strip-item ${i.color || ''}">
        <span class="stat-strip-value">${i.value}</span>
        <span class="stat-strip-label">${i.label}</span>
      </div>`
    ).join('')}</div>`;
  },

  // ─── Stat Cards Row (legacy — use statStrip) ───
  statCards(items) {
    return this.statStrip(items);
  },

  // ─── Data Table ───
  table(headers, rows, opts = {}) {
    return `<div class="table-wrap"><table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  },

  // ─── Case Link ───
  caseLink(no) {
    return `<a href="#/shared/timeline" onclick="event.preventDefault();navigate('#/shared/timeline')">${no}</a>`;
  },

  // ─── Nav Link (inline) ───
  link(hash, label) {
    return `<a href="${hash}" onclick="event.preventDefault();navigate('${hash}')">${label}</a>`;
  },

  // ─── Button ───
  btn(label, cls = 'btn-primary', extra = '') {
    return `<button class="btn ${cls}" ${extra}>${label}</button>`;
  },

  // ─── Transition Action Bar ───
  actionBar(label, buttons) {
    return `<div class="action-bar">
      <span class="action-bar-label">${label}</span>
      <div class="btn-group">${buttons.map(b =>
        `<button class="btn ${b.cls || 'btn-primary'}" ${b.disabled ? 'disabled' : ''} ${b.onclick ? 'onclick="' + b.onclick + '"' : ''}>${b.label}</button>`
      ).join('')}</div>
    </div>`;
  },

  // ─── Tabs ───
  tabs(items, activeIdx = 0) {
    return `<div class="tabs">${items.map((t, i) =>
      `<button class="tab-item ${i === activeIdx ? 'active' : ''}" onclick="switchTab(this, '${t.id}')">${t.label}</button>`
    ).join('')}</div>`;
  },

  tabContent(id, html, active = false) {
    return `<div class="tab-content ${active ? 'active' : ''}" id="tab-${id}">${html}</div>`;
  },

  // ─── Timeline ───
  timeline(events) {
    return `<div class="timeline">${events.map(e =>
      `<div class="timeline-item ${e.icon || ''}">
        <div class="timeline-meta">${e.ts} &mdash; <span class="timeline-actor">${e.actor}</span></div>
        <div class="timeline-message">${e.message}</div>
        ${e.detail ? `<div class="timeline-detail">${e.detail}</div>` : ''}
      </div>`
    ).join('')}</div>`;
  },

  // ─── Checklist ───
  checklist(items) {
    return `<ul class="checklist">${items.map(i =>
      `<li class="checklist-item">
        <span class="check-icon ${i.done ? 'checked' : ''}">${i.done ? '✓' : ''}</span>
        <span>${i.item}</span>
      </li>`
    ).join('')}</ul>`;
  },

  // ─── Flow Steps (cross-role) ───
  flowSteps(steps) {
    return `<div class="flow-steps">${steps.map(s =>
      `<div class="flow-step ${s.status}">
        <div class="flow-step-number">${s.step}</div>
        <div class="flow-step-content">
          <div class="flow-step-role">${C.roleLabel(s.role)}</div>
          <div class="flow-step-title">${s.action}</div>
          <div class="flow-step-desc">${C.statusBadge(s.status)}</div>
          ${s.page ? `<span class="flow-step-link" onclick="navigate('${s.page}')">Перейти до екрану →</span>` : ''}
        </div>
      </div>`
    ).join('')}</div>`;
  },

  // ─── Flow Steps Compact (table-based for tabs) ───
  flowStepsCompact(steps) {
    return `<table class="fsc-table"><thead><tr><th class="fsc-th-num">№</th><th>Роль</th><th>Дія</th><th>Статус</th><th></th></tr></thead><tbody>${steps.map(s =>
      `<tr class="fsc-row ${s.status}">
        <td class="fsc-num">${s.step}</td>
        <td class="fsc-role">${C.roleLabel(s.role)}</td>
        <td class="fsc-action">${s.action}</td>
        <td class="fsc-status">${C.statusBadge(s.status)}</td>
        <td class="fsc-link">${s.page ? `<a href="${s.page}" onclick="event.preventDefault();navigate('${s.page}')" title="Перейти до екрану">→</a>` : ''}</td>
      </tr>`
    ).join('')}</tbody></table>`;
  },

  // ─── Kanban Board ───
  kanban(columns) {
    return `<div class="kanban">${columns.map(col =>
      `<div class="kanban-column">
        <div class="kanban-column-header">${col.title} <span class="kanban-column-count">${col.cards.length}</span></div>
        <div class="kanban-cards">${col.cards.map(c =>
          `<div class="kanban-card" onclick="navigate('${c.link || '#/shared/timeline'}')">
            <div class="kanban-card-title">${c.title}</div>
            <div class="kanban-card-meta">${c.meta || ''}</div>
          </div>`
        ).join('')}</div>
      </div>`
    ).join('')}</div>`;
  },

  // ─── Compare Grid (side-by-side) ───
  compareGrid(panels) {
    return `<div class="compare-grid">${panels.map(p =>
      `<div class="compare-panel">
        <div class="compare-panel-title">${p.title}</div>
        ${p.rows.map(r =>
          `<div class="compare-row ${r.mismatch ? 'mismatch' : ''}">
            <span>${r.label}</span><span class="font-bold">${r.value}</span>
          </div>`
        ).join('')}
      </div>`
    ).join('')}</div>`;
  },

  // ─── Widget ───
  widget(title, bodyHtml, actionHtml = '') {
    return `<div class="widget">
      <div class="widget-header">
        <span class="widget-title">${title}</span>
        ${actionHtml}
      </div>
      <div class="widget-body">${bodyHtml}</div>
    </div>`;
  },

  // ─── Filters Bar ───
  filtersBar(filters) {
    return `<div class="filters-bar">${filters.map(f =>
      `<span class="filter-chip ${f.active ? 'active' : ''}">${f.label}</span>`
    ).join('')}</div>`;
  },

  // ─── Empty State ───
  emptyState(title, desc) {
    return `<div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-title">${title}</div>
      <p>${desc}</p>
    </div>`;
  },

  // ─── Form Group ───
  formGroup(label, inputHtml) {
    return `<div class="form-group">
      <label class="form-label">${label}</label>
      ${inputHtml}
    </div>`;
  },

  formInput(placeholder, value = '') {
    return `<input class="form-input" placeholder="${placeholder}" value="${value}" readonly>`;
  },

  formSelect(options) {
    return `<select class="form-select">${options.map(o => {
      const val = typeof o === 'object' ? (o.value || '') : o;
      const lbl = typeof o === 'object' ? (o.label || o.value || '') : o;
      return `<option value="${val}">${lbl}</option>`;
    }).join('')}</select>`;
  },

  // ─── Steps Progress ───
  stepsProgress(steps, activeIdx) {
    return `<div class="steps">${steps.map((s, i) => {
      let cls = i < activeIdx ? 'completed' : (i === activeIdx ? 'active' : '');
      return `<div class="step ${cls}">
        <span class="step-dot"></span>
        <span class="step-label">${s}</span>
      </div>`;
    }).join('')}</div>`;
  },

  // ─── Modal (confirmation) ───
  modal(id, title, bodyHtml, actions) {
    return `<div class="modal-backdrop" id="modal-${id}">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">${title}</span>
          <button class="modal-close" onclick="closeModal('${id}')">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">${actions}</div>
      </div>
    </div>`;
  },

  // ─── Search Bar (SH-02) ───
  searchBar(placeholder, id = 'globalSearch') {
    return `<div class="search-bar">
      <span class="search-bar-icon">🔍</span>
      <input class="search-bar-input" id="${id}" type="text" placeholder="${placeholder}" autocomplete="off">
      <span class="search-bar-hint text-muted text-sm">case_no · AWB · CMR · invoice · клієнт · ticket_id · document_id · work_item_id</span>
    </div>`;
  },

  // ─── Saved Views (SH-02 filter tabs) ───
  savedViews(views, activeId = null) {
    return `<div class="saved-views">${views.map(v =>
      `<button class="saved-view-chip ${v.id === activeId ? 'active' : ''}" data-view="${v.id}">
        ${v.icon ? `<span class="saved-view-icon">${v.icon}</span>` : ''}${v.label}
        ${v.count != null ? `<span class="saved-view-count">${v.count}</span>` : ''}
      </button>`
    ).join('')}</div>`;
  },

  // ─── Filter Dropdowns Row (SH-02) ───
  filterDropdowns(filters) {
    return `<div class="filter-dropdowns">${filters.map(f =>
      `<div class="filter-dropdown-group">
        <label class="filter-dropdown-label">${f.label}</label>
        <select class="form-select form-select-sm" ${f.disabled ? 'disabled' : ''}>
          ${f.options.map(o => `<option${o.selected ? ' selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </div>`
    ).join('')}
      <button class="btn btn-ghost btn-sm filter-clear-btn">Очистити фільтри</button>
    </div>`;
  },

  // ─── Sort Indicator ───
  sortIndicator(label, dir = 'desc') {
    const arrow = dir === 'asc' ? '↑' : '↓';
    return `<span class="sort-indicator">${label} ${arrow}</span>`;
  },

  // ─── Loading Skeleton ───
  skeleton(rows = 5, cols = 8) {
    const headerCells = Array.from({ length: cols }, () => '<th><span class="skeleton-block skeleton-text-md"></span></th>').join('');
    const bodyRows = Array.from({ length: rows }, () =>
      `<tr>${Array.from({ length: cols }, () => '<td><span class="skeleton-block skeleton-text-sm"></span></td>').join('')}</tr>`
    ).join('');
    return `<div class="skeleton-wrap">
      <div class="skeleton-filters">
        <span class="skeleton-block skeleton-search"></span>
        ${Array.from({ length: 4 }, () => '<span class="skeleton-block skeleton-chip"></span>').join('')}
      </div>
      <div class="table-wrap"><table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table></div>
    </div>`;
  },

  // ─── Error State ───
  errorState(title, desc) {
    return `<div class="error-state">
      <div class="error-state-icon">⚠</div>
      <div class="error-state-title">${title}</div>
      <p>${desc}</p>
      <div class="mt-12"><button class="btn btn-secondary" onclick="location.reload()">Спробувати знову</button></div>
    </div>`;
  },

  // ─── Forbidden State ───
  forbiddenState(roleLabel) {
    return `<div class="forbidden-state">
      <div class="forbidden-state-icon">🚫</div>
      <div class="forbidden-state-title">Доступ заборонено</div>
      <p>У вас немає ролі <strong>${roleLabel}</strong> для доступу до цього модулю. Зверніться до адміністратора для отримання прав.</p>
    </div>`;
  },

  // ─── Audit Trail Meta (SH-02 quick actions) ───
  auditMeta(actor, action, timestamp, reasonCode) {
    const reasonLabel = reasonCode ? C.reasonCodeLabel(reasonCode) : '';
    return `<div class="audit-meta">
      <span class="audit-meta-label">Аудит:</span>
      <span class="audit-meta-actor">${actor}</span> —
      <span class="audit-meta-action">${action}</span>
      <span class="audit-meta-ts">${timestamp}</span>
      ${reasonCode ? `<span class="audit-meta-reason" title="${reasonCode}">[${reasonLabel}]</span>` : ''}
    </div>`;
  },

  // ─── External Sync Status Badge (03_global_components: connected/degraded/retrying/failed) ───
  syncStatusBadge(state) {
    const labels = {
      connected: 'Підключено',
      degraded: 'Деградовано',
      retrying: 'Повторна спроба',
      failed: 'Збій зʼєднання',
      ok: 'Підключено',
      error: 'Помилка'
    };
    const cls = {
      connected: 'done', ok: 'done',
      degraded: 'pending', retrying: 'pending',
      failed: 'blocked', error: 'blocked'
    };
    return `<span class="badge-status ${cls[state] || ''}" title="Sync: ${state}">${labels[state] || state}</span>`;
  },

  // ─── Source System Badge (f1_core / zammad / mayan / plane / 1c) ───
  sourceSystemBadge(system) {
    const labels = {
      f1_core: 'F1 Core',
      zammad: 'Zammad',
      mayan: 'Mayan EDMS',
      plane: 'Plane',
      '1c': '1С'
    };
    return `<span class="badge-status" title="Джерело: ${system}">${labels[system] || system}</span>`;
  },

  // ─── Conversation Visibility Badge (internal/external) ───
  visibilityBadge(vis) {
    const labels = { internal: 'Внутрішня нотатка', external: 'Зовнішня відповідь' };
    const cls = vis === 'external' ? 'accent' : '';
    return `<span class="badge-status ${cls === 'accent' ? 'done' : 'pending'}">${labels[vis] || vis}</span>`;
  },

  // ─── Integration Health Strip (for workspace and drawer) ───
  integrationHealthStrip(systems) {
    return `<div class="card" style="background:var(--surface-secondary); padding:12px;">
      <div class="flex gap-16 flex-wrap">
        ${systems.map(s => `<div class="text-center">
          <div style="font-size:14px; font-weight:600;">${s.label}</div>
          <div class="mt-4">${C.syncStatusBadge(s.state)}</div>
        </div>`).join('')}
      </div>
    </div>`;
  },

  // ─── Topbar Integration Dots (compact indicator for header) ───
  topbarIntegrationDots(systems) {
    const dotColorMap = { connected: 'var(--success)', ok: 'var(--success)', degraded: 'var(--warning)', retrying: 'var(--warning)', failed: 'var(--danger)', error: 'var(--danger)' };
    const labelMap = { connected: 'Підключено', ok: 'Підключено', degraded: 'Деградовано', retrying: 'Повторна спроба', failed: 'Збій зʼєднання', error: 'Помилка' };
    const hasIssue = systems.some(s => s.state !== 'connected' && s.state !== 'ok');
    const dots = systems.map(s =>
      `<span class="ih-dot" style="background:${dotColorMap[s.state] || 'var(--text-muted)'};" title="${s.label}: ${labelMap[s.state] || s.state}"></span>`
    ).join('');
    return `<div class="ih-topbar-wrap" id="integrationHealthToggle" onclick="toggleIntegrationDropdown()" aria-label="Стан зовнішніх систем" tabindex="0">
      <div class="ih-dots">${dots}</div>
      ${hasIssue ? '<span class="ih-warn-icon" title="Є проблеми з інтеграціями">⚠</span>' : ''}
    </div>`;
  },

  // ─── Topbar Integration Dropdown (details panel) ───
  integrationDropdown(systems) {
    const labelMap = { connected: 'Підключено', ok: 'Підключено', degraded: 'Деградовано', retrying: 'Повторна спроба', failed: 'Збій зʼєднання', error: 'Помилка' };
    const clsMap = { connected: 'done', ok: 'done', degraded: 'pending', retrying: 'pending', failed: 'blocked', error: 'blocked' };
    const rows = systems.map(s =>
      `<div class="ih-dd-row">
        <span class="ih-dd-label">${s.label}</span>
        <span class="badge-status ${clsMap[s.state] || ''}">${labelMap[s.state] || s.state}</span>
        ${s.last_sync ? `<span class="ih-dd-sync">${s.last_sync}</span>` : ''}
      </div>`
    ).join('');
    return `<div class="ih-dropdown" id="integrationDropdown" style="display:none;">
      <div class="ih-dd-title">Стан зовнішніх систем</div>
      ${rows}
    </div>`;
  },

  // ─── Guided Stepper (03_global_components) ───
  guidedStepper(steps, currentIdx = 0) {
    return `<div class="guided-stepper">
      <div class="guided-stepper-header">
        <span class="guided-stepper-title">Покроковий сценарій</span>
        <span class="guided-stepper-progress">Крок ${currentIdx + 1} з ${steps.length}</span>
      </div>
      <div class="guided-stepper-body">
        ${steps.map((s, i) => `<div class="guided-step ${i < currentIdx ? 'completed' : (i === currentIdx ? 'active' : 'pending')}">
          <span class="guided-step-num">${i + 1}</span>
          <span class="guided-step-label">${s}</span>
        </div>`).join('')}
      </div>
      <div class="guided-stepper-actions">
        ${currentIdx > 0 ? '<button class="btn btn-ghost btn-sm">← Назад</button>' : ''}
        ${currentIdx < steps.length - 1 ? '<button class="btn btn-primary btn-sm">Далі →</button>' : '<button class="btn btn-primary btn-sm">Завершити ✓</button>'}
      </div>
    </div>`;
  },

  // ─── Template Message Button (03_global_components) ───
  templateMessageBtn(context, caseNo, extraInfo) {
    return `<div class="template-message-btn-wrap">
      <button class="btn btn-secondary btn-sm" onclick="openModal('template-msg')">📋 Надіслати шаблонне повідомлення</button>
      <span class="text-sm text-muted" style="margin-left:8px">Контекст: ${context} · ${caseNo}</span>
    </div>`;
  },

  // ─── Template Message Modal Content ───
  templateMessageModalContent(context, caseData) {
    return `<div class="template-message-form">
      <p class="text-sm text-muted mb-8">Шаблон автоматично підставляє дані кейсу: номер, AWB/CMR, ETA, контакти.</p>
      ${C.formGroup('Тип шаблону', C.formSelect([
        'Повідомлення клієнту про статус',
        'Повідомлення складу про прибуття',
        'Повідомлення брокеру про готовність',
        'Повідомлення перевізнику',
        'Попередження про затримку'
      ]))}
      ${C.formGroup('Одержувач', C.formInput('Автоматично з кейсу', caseData || ''))}
      ${C.formGroup('Попередній перегляд', '<textarea class="form-input" rows="3" readonly placeholder="Шаблон буде заповнено автоматично з даних кейсу…"></textarea>')}
    </div>`;
  },

  // ─── Insurance Quick Toggle (03_global_components) ───
  insuranceQuickToggle(state) {
    const labels = {
      not_requested: 'Не запитано',
      requested: 'Запитано',
      confirmed: 'Підтверджено'
    };
    const cls = {
      not_requested: '',
      requested: 'pending',
      confirmed: 'done'
    };
    return `<div class="insurance-toggle-wrap">
      <div class="flex items-center gap-8">
        <span class="text-sm font-bold">Страхування:</span>
        <span class="badge-status ${cls[state] || ''}">${labels[state] || state}</span>
        ${state === 'not_requested' ? '<button class="btn btn-primary btn-sm" onclick="openModal(\'insurance-request\')">Запросити страхування</button>' : ''}
        ${state === 'requested' ? '<span class="text-sm text-muted">Очікується підтвердження</span>' : ''}
        ${state === 'confirmed' ? '<span class="text-sm text-muted">✓ Поліс активний</span>' : ''}
      </div>
    </div>`;
  },

  // ─── Mobile Action Dock (03_global_components) ───
  mobileActionDock(actions) {
    return `<div class="mobile-action-dock">
      <div class="mobile-dock-title">📱 Мобільна панель швидких дій</div>
      <div class="mobile-dock-actions">
        ${actions.map(a => `<button class="mobile-dock-btn ${a.cls || ''}" title="${a.title || a.label}">
          <span class="mobile-dock-icon">${a.icon || '⚡'}</span>
          <span class="mobile-dock-label">${a.label}</span>
        </button>`).join('')}
      </div>
      <div class="text-sm text-muted text-center mt-4">Доступно на мобільних пристроях для критичних сценаріїв</div>
    </div>`;
  },

  // ─── Dashboard Card Grid (SH-08) ───
  dashCardGrid(items) {
    return `<div class="dash-card-grid">${items.map(i => {
      const trendCls = i.trend > 0 ? 'up' : (i.trend < 0 ? 'down' : 'flat');
      const trendIcon = i.trend > 0 ? '↑' : (i.trend < 0 ? '↓' : '→');
      const trendSign = i.trend > 0 ? '+' : '';
      const colorCls = i.color || '';
      const click = i.drilldown ? ` onclick="navigate('${i.drilldown}')" style="cursor:pointer;" title="Деталізація →"` : '';
      return `<div class="dash-card ${colorCls}"${click}>
        <div class="dash-card-value">${i.value}</div>
        <div class="dash-card-label">${i.label}</div>
        ${i.trend != null ? `<div class="dash-card-trend ${trendCls}">${trendIcon} ${trendSign}${i.trend}% vs мин. тиждень</div>` : ''}
        ${i.drilldown ? '<div class="dash-card-drill">Деталізація →</div>' : ''}
      </div>`;
    }).join('')}</div>`;
  },

  // ─── Horizontal Bar Chart (CSS-only, SH-08) ───
  horizontalBarChart(items, opts = {}) {
    const max = opts.max || Math.max(...items.map(i => i.value), 1);
    const colorFn = opts.colorFn || function(v) { return v > 0 ? 'danger' : 'success'; };
    return `<div class="h-bar-chart">${items.map(i => {
      const pct = Math.round((i.value / max) * 100);
      const cls = typeof colorFn === 'function' ? colorFn(i.value) : (i.color || 'accent');
      const click = i.drilldown ? ` onclick="navigate('${i.drilldown}')" style="cursor:pointer;" title="Деталізація →"` : '';
      return `<div class="h-bar-row"${click}>
        <span class="h-bar-label">${i.label}</span>
        <div class="h-bar-track">
          <div class="h-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <span class="h-bar-value">${i.value}</span>
      </div>`;
    }).join('')}</div>`;
  },

  // ─── Donut Chart (CSS conic-gradient, SH-08) ───
  donutChart(segments, centerLabel, centerValue) {
    let angle = 0;
    const gradientParts = [];
    const colorMap = { accent: 'var(--accent)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)', muted: 'var(--text-muted)' };
    segments.forEach(function(s) {
      const color = colorMap[s.color] || s.color || 'var(--accent)';
      const start = angle;
      angle += (s.pct / 100) * 360;
      gradientParts.push(color + ' ' + start + 'deg ' + angle + 'deg');
    });
    const gradient = gradientParts.join(', ');
    const legend = segments.map(function(s) {
      const color = colorMap[s.color] || s.color || 'var(--accent)';
      return '<div class="donut-legend-item"><span class="donut-legend-dot" style="background:' + color + '"></span>' + s.label + ' <strong>' + s.pct + '%</strong></div>';
    }).join('');
    return `<div class="donut-chart-wrap">
      <div class="donut-chart" style="background:conic-gradient(${gradient})">
        <div class="donut-hole">
          <div class="donut-center-value">${centerValue || ''}</div>
          <div class="donut-center-label">${centerLabel || ''}</div>
        </div>
      </div>
      <div class="donut-legend">${legend}</div>
    </div>`;
  },

  // ─── Period Filter Bar (mock, SH-08) ───
  periodFilter(periods, activeIdx) {
    if (activeIdx == null) activeIdx = 1;
    return `<div class="period-filter">${periods.map(function(p, i) {
      return '<button class="period-btn ' + (i === activeIdx ? 'active' : '') + '">' + p + '</button>';
    }).join('')}</div>`;
  },

  // ─── Notification Dropdown (SH-07 refactored) ───
  notificationDropdownContent(data) {
    const items = (data.items || []).slice(0, 7);
    const unread = data.unread_count || 0;

    const itemsHtml = items.map(function(n) {
      const cls = !n.read ? 'unread' : '';
      // Визначаємо link на основі типу
      var link = '#/shared/timeline';
      if (n.approval_id) link = '#/shared/approval-detail';
      else if (n.type && n.type.indexOf('handover') >= 0) link = '#/shared/handover-board';
      else if (n.type && n.type.indexOf('single_entry') >= 0) link = '#/shared/accounting-single-entry';

      var badgesHtml = '';
      if (n.approval_type) {
        badgesHtml = ' · ' + C.approvalTypeBadge(n.approval_type);
      }

      return '<div class="notif-item ' + cls + '" onclick="closeNotifDropdown();navigate(\'' + link + '\')">' +
        '<span class="notif-dot"></span>' +
        '<div class="notif-content">' +
          '<div class="notif-content-title">' + n.title + '</div>' +
          '<div class="notif-content-meta">' + n.time + ' · ' + C.typeLabel(n.type) + badgesHtml + '</div>' +
        '</div>' +
        '<span class="notif-arrow">→</span>' +
      '</div>';
    }).join('');

    return '<div class="notif-dropdown-header">' +
        '<span class="notif-dropdown-title">Сповіщення</span>' +
        '<div class="notif-dropdown-actions">' +
          '<span class="text-sm text-muted">' + unread + ' непрочитаних</span>' +
          '<a href="#/shared/notification-settings" onclick="event.preventDefault();closeNotifDropdown();navigate(\'#/shared/notification-settings\')" title="Налаштування сповіщень" style="font-size:16px;">⚙</a>' +
        '</div>' +
      '</div>' +
      '<div class="notif-dropdown-body">' +
        (items.length > 0 ? itemsHtml : '<div class="empty-state" style="padding:24px;"><div class="empty-state-icon">🔔</div><div class="empty-state-title">Немає сповіщень</div></div>') +
      '</div>' +
      '<div class="notif-dropdown-footer">' +
        '<a href="#/shared/notifications" onclick="event.preventDefault();closeNotifDropdown();navigate(\'#/shared/notifications\')">Усі сповіщення (' + (data.items || []).length + ') →</a>' +
        '<button class="btn btn-ghost btn-sm" onclick="closeNotifDropdown()">Закрити</button>' +
      '</div>';
  },

  // ─── Pagination Summary (SH-02) ───
  paginationSummary(shown, total, page, perPage) {
    const totalPages = Math.ceil(total / perPage);
    return `<div class="pagination-summary">
      <span class="text-sm text-muted">Показано ${shown} з ${total} кейсів · Сторінка ${page} з ${totalPages}</span>
      <div class="pagination-controls">
        <button class="btn btn-ghost btn-sm" ${page <= 1 ? 'disabled' : ''}>← Попередня</button>
        <span class="pagination-page-num">${page}</span>
        <button class="btn btn-ghost btn-sm" ${page >= totalPages ? 'disabled' : ''}>Наступна →</button>
      </div>
    </div>`;
  }
};

// ─── Tab switching helper ───
function switchTab(el, tabId) {
  el.closest('.tabs').querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const parent = el.closest('.tabs').parentElement;
  parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  const target = parent.querySelector('#tab-' + tabId);
  if (target) target.classList.add('active');
}

// ─── Modal helpers ───
function openModal(id) {
  const m = document.getElementById('modal-' + id);
  if (m) m.classList.add('show');
}
function closeModal(id) {
  const m = document.getElementById('modal-' + id);
  if (m) m.classList.remove('show');
}
