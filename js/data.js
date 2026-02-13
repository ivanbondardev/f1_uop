/* =====================================================
   F1 Операційна Платформа — Модуль демо-даних
   Усі демо-дані загорнуті в явні JSON-об'єкти
   згідно з контрактом демо-даних (meta/data/errors).
   ===================================================== */

// ─── Глобальний стан інтеграцій (єдине джерело для topbar) ───
const INTEGRATION_HEALTH = [
  { system: 'zammad',  label: 'Zammad',     state: 'connected', last_sync: '1 хв тому' },
  { system: 'mayan',   label: 'Mayan EDMS', state: 'connected', last_sync: '3 хв тому' },
  { system: 'plane',   label: 'Plane',      state: 'connected', last_sync: '2 хв тому' },
  { system: '1c',      label: '1С',         state: 'degraded',  last_sync: '8 хв тому' }
];

const DATA = {

  // ─── Перелік кейсів (SH-02) ───
  cases: {
    meta: { source: "dummy", version: "poc" },
    data: {
      items: [
        { case_no: "F1-2026-00142", client: "ТехІмпорт Україна", current_stage: "Митне оформлення", current_state: "BROKER_REVIEW_PENDING", case_status: "open", sla_state: "on_track", owner_role: "Брокер", priority: "high", updated_at: "2026-02-11 09:14", awb: "074-12345678", cmr: "CMR-UA-2026-0901", invoice_number: "INV-2026-0142", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00141", client: "АгроПостач Лтд", current_stage: "Автотранзит", current_state: "BORDER_CROSSING", case_status: "open", sla_state: "at_risk", owner_role: "Автологістика", priority: "medium", updated_at: "2026-02-11 08:45", awb: "074-23456789", cmr: "CMR-UA-2026-0902", invoice_number: "INV-2026-0141", has_exception: true, integration_sync_state: "retrying" },
        { case_no: "F1-2026-00140", client: "ФармаДирект", current_stage: "Попереднє сповіщення", current_state: "PREALERT_PREPARATION", case_status: "open", sla_state: "on_track", owner_role: "Авіалогістика", priority: "normal", updated_at: "2026-02-11 07:30", awb: "074-34567890", cmr: null, invoice_number: "INV-2026-0140", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00139", client: "МедОблад Ко", current_stage: "Склад Видача", current_state: "RELEASE_BLOCKED", case_status: "blocked", sla_state: "breached", owner_role: "Склад", priority: "high", updated_at: "2026-02-10 17:30", awb: "074-45678901", cmr: "CMR-UA-2026-0903", invoice_number: "INV-2026-0139", has_exception: true, integration_sync_state: "error" },
        { case_no: "F1-2026-00138", client: "ТекстильСвіт", current_stage: "Бухгалтерія", current_state: "COST_CERT_IN_PROGRESS", case_status: "open", sla_state: "on_track", owner_role: "Бухгалтерія", priority: "normal", updated_at: "2026-02-10 16:50", awb: "074-56789012", cmr: "CMR-UA-2026-0904", invoice_number: "INV-2026-0138", has_exception: true, integration_sync_state: "ok" },
        { case_no: "F1-2026-00137", client: "АвтоДеталь ЄС", current_stage: "Платіжний шлюз", current_state: "GATE_EVALUATION_PENDING", case_status: "open", sla_state: "on_track", owner_role: "Фінанси", priority: "normal", updated_at: "2026-02-10 15:20", awb: "074-67890123", cmr: "CMR-UA-2026-0905", invoice_number: "INV-2026-0137", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00136", client: "ЕлектроХаб", current_stage: "Закриття доставки", current_state: "DELIVERY_CLOSURE", case_status: "open", sla_state: "on_track", owner_role: "Автологістика", priority: "normal", updated_at: "2026-02-10 14:00", awb: "074-78901234", cmr: "CMR-UA-2026-0906", invoice_number: "INV-2026-0136", has_exception: true, integration_sync_state: "ok" },
        { case_no: "F1-2026-00135", client: "ФудТрейд Інт", current_stage: "Авіабукінг", current_state: "BOOKING_IN_PROGRESS", case_status: "open", sla_state: "on_track", owner_role: "Авіалогістика", priority: "normal", updated_at: "2026-02-10 11:00", awb: "074-89012345", cmr: null, invoice_number: "INV-2026-0135", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00134", client: "Будмат Плюс", current_stage: "Завершено", current_state: "COMPLETED", case_status: "done", sla_state: "on_track", owner_role: "—", priority: "normal", updated_at: "2026-02-09 18:00", awb: "074-90123456", cmr: "CMR-UA-2026-0907", invoice_number: "INV-2026-0134", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00133", client: "КемЛогістикс", current_stage: "Завершено", current_state: "COMPLETED", case_status: "done", sla_state: "on_track", owner_role: "—", priority: "low", updated_at: "2026-02-09 16:40", awb: "074-01234567", cmr: "CMR-UA-2026-0908", invoice_number: "INV-2026-0133", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00132", client: "ІмпортТех Груп", current_stage: "Авіабукінг", current_state: "BOOKING_CONFIRMED", case_status: "open", sla_state: "on_track", owner_role: "Авіалогістика", priority: "normal", updated_at: "2026-02-09 14:20", awb: "074-11122233", cmr: null, invoice_number: "INV-2026-0132", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00131", client: "ПолімерПлюс", current_stage: "Попереднє сповіщення", current_state: "PRE_ALERT_SENT", case_status: "open", sla_state: "at_risk", owner_role: "Авіалогістика", priority: "medium", updated_at: "2026-02-09 11:00", awb: "074-22233344", cmr: null, invoice_number: "INV-2026-0131", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00130", client: "ГлобалТрансУА", current_stage: "Автотранзит", current_state: "IN_TRANSIT", case_status: "open", sla_state: "on_track", owner_role: "Автологістика", priority: "normal", updated_at: "2026-02-09 09:30", awb: "074-33344455", cmr: "CMR-UA-2026-0910", invoice_number: "INV-2026-0130", has_exception: false, integration_sync_state: "ok" },
        { case_no: "F1-2026-00129", client: "ФудЕкспорт ТОВ", current_stage: "Митне оформлення", current_state: "CUSTOMS_CHECK", case_status: "open", sla_state: "breached", owner_role: "Брокер", priority: "high", updated_at: "2026-02-08 17:45", awb: "074-44455566", cmr: "CMR-UA-2026-0911", invoice_number: "INV-2026-0129", has_exception: true, integration_sync_state: "retrying" },
        { case_no: "F1-2026-00128", client: "СтальКонструкт", current_stage: "Платіжний шлюз", current_state: "PAYMENT_GATE_PENDING", case_status: "open", sla_state: "on_track", owner_role: "Фінанси", priority: "normal", updated_at: "2026-02-08 15:10", awb: "074-55566677", cmr: "CMR-UA-2026-0912", invoice_number: "INV-2026-0128", has_exception: false, integration_sync_state: "ok" }
      ],
      total: 142,
      page: 1,
      per_page: 10,
      saved_view: null,
      applied_filters: {}
    },
    errors: []
  },

  // ─── Деталі кейсу / хронологія (SH-03) ───
  caseDetail: {
    meta: { source: "dummy", version: "poc" },
    data: {
      case_no: "F1-2026-00142",
      client: "ТехІмпорт Україна",
      stage: "Митне оформлення",
      current_state: "BROKER_REVIEW_PENDING",
      case_status: "open",
      sla: "on_track",
      priority: "high",
      scenario_type: "happy_path",
      created_at: "2026-02-05 10:30",
      awb: "074-12345678",
      cmr: "CMR-UA-2026-0901",
      origin: "Шанхай (PVG)",
      destination: "Київ (KBP)",
      weight_kg: 1240,
      pieces: 48,
      contacts: {
        client_contact: "Олена Коваль, +380 44 555 1234",
        agent: "СкайБрідж Логістикс (Шанхай)"
      },
      integration_health: [
        { system: "zammad", label: "Zammad", state: "connected" },
        { system: "mayan", label: "Mayan EDMS", state: "connected" },
        { system: "plane", label: "Plane", state: "connected" },
        { system: "1c", label: "1С", state: "degraded" }
      ],
      external_refs: [
        { system: "zammad", entity_type: "ticket", external_id: "ZMD-TKT-8842", case_id: "F1-2026-00142", linked_at: "2026-02-05 10:35" },
        { system: "mayan", entity_type: "document", external_id: "MYN-DOC-3301", case_id: "F1-2026-00142", linked_at: "2026-02-08 15:35" },
        { system: "plane", entity_type: "work_item", external_id: "PLN-WI-1201", case_id: "F1-2026-00142", linked_at: "2026-02-10 11:05" }
      ],
      timeline: [
        { ts: "2026-02-11 09:14", actor: "Брокер — Дмитро С.", type: "status_change", message: "Розпочато митне оформлення. LRN: UA202602110001", icon: "event-success", source_system: "f1_core" },
        { ts: "2026-02-11 08:50", actor: "Zammad (auto)", type: "conversation_article_received", message: "Нове вхідне повідомлення від клієнта: «Уточніть дату видачі»", icon: "", source_system: "zammad" },
        { ts: "2026-02-10 18:00", actor: "Plane (sync)", type: "external_task_state_changed", message: "Задача PLN-WI-1201 → in_progress (синхронізовано з Plane)", icon: "", source_system: "plane" },
        { ts: "2026-02-10 16:40", actor: "Автологістика — Андрій К.", type: "task", message: "Авто заплановано: TIR AA1234BB, водій Петренко В.", icon: "", source_system: "f1_core" },
        { ts: "2026-02-10 14:25", actor: "Mayan EDMS (auto)", type: "external_document_ingested", message: "Документ T1 пакет імпортовано в Mayan (MYN-DOC-3302)", icon: "", source_system: "mayan" },
        { ts: "2026-02-10 14:20", actor: "Брокер — Дмитро С.", type: "document", message: "Завантажено T1 пакет документів (v1)", icon: "", source_system: "f1_core" },
        { ts: "2026-02-10 11:00", actor: "Авіалогістика — Марія Л.", type: "status_change", message: "Вантаж прибув до KBP. DSK підтверджено.", icon: "event-success", source_system: "f1_core" },
        { ts: "2026-02-08 15:30", actor: "Авіалогістика — Марія Л.", type: "document", message: "AWB 074-12345678 підтверджено авіакомпанією", icon: "", source_system: "f1_core" },
        { ts: "2026-02-07 09:00", actor: "Авіалогістика — Марія Л.", type: "status_change", message: "Попереднє сповіщення відправлено брокеру та Автологістика", icon: "", source_system: "f1_core" },
        { ts: "2026-02-06 14:00", actor: "Авіалогістика — Марія Л.", type: "task", message: "Букінг підтверджено: Шанхай → Київ, рейс PS802", icon: "", source_system: "f1_core" },
        { ts: "2026-02-05 10:30", actor: "Продажі — Оксана М.", type: "status_change", message: "Кейс створено. Клієнт: ТехІмпорт Україна", icon: "event-success", source_system: "f1_core" }
      ]
    },
    errors: []
  },

  // ─── Tasks (SH-04) ───
  tasks: {
    meta: { source: "dummy", version: "poc" },
    data: {
      items: [
        { id: "T-1201", case_no: "F1-2026-00142", task_type: "customs_clearance", title: "Завершити митне оформлення", owner_role: "Брокер", owner_user: "Дмитро С.", due_at: "2026-02-12 18:00", status: "in_progress", sla_state: "on_track", priority: "high", escalation_status: "not_escalated", blocked_by: [], source_system: "f1_core", external_task_id: null },
        { id: "T-1200", case_no: "F1-2026-00141", task_type: "border_crossing", title: "Супровід перетину кордону", owner_role: "Автологістика", owner_user: "Андрій К.", due_at: "2026-02-11 23:59", status: "in_progress", sla_state: "at_risk", priority: "medium", escalation_status: "not_escalated", blocked_by: [], source_system: "plane", external_task_id: "PLN-WI-1200" },
        { id: "T-1199", case_no: "F1-2026-00139", task_type: "payment_gate", title: "Оцінити платіжний шлюз", owner_role: "Фінанси", owner_user: "Лариса П.", due_at: "2026-02-10 17:00", status: "open", sla_state: "breached", priority: "high", escalation_status: "L1", blocked_by: ["Очікування підтвердження оплати"], source_system: "f1_core", external_task_id: null },
        { id: "T-1198", case_no: "F1-2026-00139", task_type: "client_comm", title: "Повідомити клієнта про блокування", owner_role: "Продажі", owner_user: "Оксана М.", due_at: "2026-02-11 12:00", status: "open", sla_state: "on_track", priority: "medium", escalation_status: "not_escalated", blocked_by: [], source_system: "f1_core", external_task_id: null },
        { id: "T-1197", case_no: "F1-2026-00140", task_type: "prealert", title: "Підготувати пакет попереднього сповіщення", owner_role: "Авіалогістика", owner_user: "Марія Л.", due_at: "2026-02-11 14:00", status: "in_progress", sla_state: "on_track", priority: "normal", escalation_status: "not_escalated", blocked_by: [], source_system: "plane", external_task_id: "PLN-WI-1197" },
        { id: "T-1196", case_no: "F1-2026-00138", task_type: "cost_certificate", title: "Сформувати довідку витрат", owner_role: "Бухгалтерія", owner_user: "Тетяна В.", due_at: "2026-02-11 16:00", status: "in_progress", sla_state: "on_track", priority: "normal", escalation_status: "not_escalated", blocked_by: [], source_system: "f1_core", external_task_id: null },
        { id: "T-1195", case_no: "F1-2026-00137", task_type: "payment_allocation", title: "Рознести оплату по рахунках", owner_role: "Фінанси", owner_user: "Лариса П.", due_at: "2026-02-11 15:00", status: "open", sla_state: "on_track", priority: "normal", escalation_status: "not_escalated", blocked_by: [], source_system: "f1_core", external_task_id: null },
        { id: "T-1194", case_no: "F1-2026-00136", task_type: "delivery_closure", title: "Підтвердити доставку клієнту", owner_role: "Автологістика", owner_user: "Андрій К.", due_at: "2026-02-11 18:00", status: "in_progress", sla_state: "on_track", priority: "normal", escalation_status: "not_escalated", blocked_by: [], source_system: "f1_core", external_task_id: null },
        { id: "T-1193", case_no: "F1-2026-00141", task_type: "customs_clearance", title: "Підготовка декларації IM4", owner_role: "Брокер", owner_user: "Дмитро С.", due_at: "2026-02-10 12:00", status: "open", sla_state: "breached", priority: "high", escalation_status: "L2", blocked_by: ["Відсутня специфікація"], source_system: "f1_core", external_task_id: null },
        { id: "T-1192", case_no: "F1-2026-00138", task_type: "customs_clearance", title: "Надати додаткові документи митниці", owner_role: "Брокер", owner_user: "Дмитро С.", due_at: "2026-02-09 18:00", status: "in_progress", sla_state: "breached", priority: "high", escalation_status: "L1", blocked_by: ["Результати лабораторних тестів"], source_system: "f1_core", external_task_id: null }
      ],
      counters: {
        active_tasks: 10,
        breached_tasks: 3,
        at_risk_tasks: 1,
        done_today: 4
      },
      // ─── Task Detail (demo: T-1199) ───
      task_detail: {
        id: "T-1199",
        case_no: "F1-2026-00139",
        task_type: "payment_gate",
        title: "Оцінити платіжний шлюз",
        owner_role: "Фінанси",
        owner_user: "Лариса П.",
        due_at: "2026-02-10 17:00",
        status: "open",
        sla_state: "breached",
        priority: "high",
        escalation_status: "L1",
        blocked_by: ["Очікування підтвердження оплати"],
        case_context: {
          client: "МедОблад Ко",
          stage: "Платіжний шлюз",
          expected_amount: "€9,000",
          received_amount: "€6,750",
          shortfall: "€2,250"
        },
        prerequisites: [
          { item: "Рахунок клієнту виставлено", met: true },
          { item: "Банківська виписка отримана", met: true },
          { item: "Оплата ідентифікована в системі", met: true },
          { item: "100% суми оплачено", met: false },
          { item: "Немає блокуючих винятків", met: false }
        ],
        action_log: [
          { ts: "2026-02-11 09:00", actor: "Фінанси — Лариса П.", action: "Ескалація L1", reason: "Дедлайн порушено, очікується доплата клієнта", reason_code: "SLA_BREACHED" },
          { ts: "2026-02-10 17:30", actor: "Система", action: "SLA стан → breached", reason: "Дедлайн 2026-02-10 17:00 минув", reason_code: "SLA_BREACH_AUTO" },
          { ts: "2026-02-10 16:00", actor: "Фінанси — Лариса П.", action: "Статус → open", reason: "Задача створена з платіжного винятку", reason_code: "TASK_CREATED" },
          { ts: "2026-02-10 15:30", actor: "Система", action: "Задача призначена", reason: "Автопризначення за роллю Фінанси", reason_code: "TASK_ASSIGNED" }
        ]
      },
      // ─── Breach Queue ───
      breach_queue: [
        { id: "T-1199", case_no: "F1-2026-00139", task_type: "payment_gate", title: "Оцінити платіжний шлюз", owner_role: "Фінанси", owner_user: "Лариса П.", due_at: "2026-02-10 17:00", status: "open", sla_state: "breached", priority: "high", escalation_level: "L1", escalated_to_role: "Керівник фінансів", escalation_reason: "Дедлайн порушено, очікується доплата клієнта", escalated_at: "2026-02-11 09:00", resolution_eta: "2026-02-11 18:00" },
        { id: "T-1193", case_no: "F1-2026-00141", task_type: "customs_clearance", title: "Підготовка декларації IM4", owner_role: "Брокер", owner_user: "Дмитро С.", due_at: "2026-02-10 12:00", status: "open", sla_state: "breached", priority: "high", escalation_level: "L2", escalated_to_role: "Керівник операцій", escalation_reason: "Документ «Специфікація» не надано протягом 24 год", escalated_at: "2026-02-11 12:00", resolution_eta: "2026-02-12 09:00" },
        { id: "T-1192", case_no: "F1-2026-00138", task_type: "customs_clearance", title: "Надати додаткові документи митниці", owner_role: "Брокер", owner_user: "Дмитро С.", due_at: "2026-02-09 18:00", status: "in_progress", sla_state: "breached", priority: "high", escalation_level: "L1", escalated_to_role: "Керівник брокерів", escalation_reason: "Митне утримання — потрібні лабораторні тести", escalated_at: "2026-02-10 10:00", resolution_eta: "2026-02-11 14:00" }
      ],
      // ─── KPI ───
      kpi: {
        median_task_completion_time_hours: 6.4,
        breach_rate_per_role: [
          { role: "Фінанси", rate: "12.5%" },
          { role: "Брокер", rate: "8.3%" },
          { role: "Автологістика", rate: "4.1%" },
          { role: "Авіалогістика", rate: "2.0%" },
          { role: "Продажі", rate: "1.5%" },
          { role: "Бухгалтерія", rate: "0.8%" },
          { role: "Склад", rate: "3.2%" }
        ],
        reopen_rate: "3.1%",
        mean_time_to_acknowledge_breach_minutes: 22,
        time_to_first_action_minutes: 14
      }
    },
    errors: []
  },

  // ─── Документи (SH-05) ───
  documents: {
    meta: { source: "dummy", version: "poc" },
    data: {
      packets: [
        { packet_id: "DOC-AWB-142", doc_type: "AWB", case_no: "F1-2026-00142", current_version: 1, approval_state: "approved", verification_mode: "standard", extraction_confidence: 0.97, uploaded_by: "Марія Л.", uploaded_at: "2026-02-08 15:30", source_system: "f1_core", external_document_id: null, external_version_id: null },
        { packet_id: "DOC-CMR-142", doc_type: "CMR", case_no: "F1-2026-00142", current_version: 2, approval_state: "approved", verification_mode: "deep", extraction_confidence: 0.91, uploaded_by: "Андрій К.", uploaded_at: "2026-02-10 16:45", source_system: "mayan", external_document_id: "MYN-DOC-3301", external_version_id: "MYN-VER-3301-2" },
        { packet_id: "DOC-T1-142", doc_type: "Пакет T1", case_no: "F1-2026-00142", current_version: 1, approval_state: "draft", verification_mode: "standard", extraction_confidence: 0.88, uploaded_by: "Дмитро С.", uploaded_at: "2026-02-10 14:20", source_system: "mayan", external_document_id: "MYN-DOC-3302", external_version_id: "MYN-VER-3302-1" },
        { packet_id: "DOC-INV-142", doc_type: "Інвойс", case_no: "F1-2026-00142", current_version: 1, approval_state: "approved", verification_mode: "spot_check", extraction_confidence: 0.64, uploaded_by: "Оксана М.", uploaded_at: "2026-02-05 11:00", source_system: "f1_core", external_document_id: null, external_version_id: null },
        { packet_id: "DOC-PL-142", doc_type: "Пакувальний лист", case_no: "F1-2026-00142", current_version: 1, approval_state: "approved", verification_mode: "standard", extraction_confidence: 0.95, uploaded_by: "Оксана М.", uploaded_at: "2026-02-05 11:05", source_system: "f1_core", external_document_id: null, external_version_id: null }
      ],
      version_history: [
        { packet_id: "DOC-CMR-142", version: 2, status: "approved", uploaded_by: "Андрій К.", uploaded_at: "2026-02-10 16:45", note: "Оновлено вагу після зважування" },
        { packet_id: "DOC-CMR-142", version: 1, status: "замінено", uploaded_by: "Андрій К.", uploaded_at: "2026-02-09 10:00", note: "Початкова версія" }
      ]
    },
    errors: []
  },

  // ─── Винятки (SH-06) ───
  exceptions: {
    meta: { source: "dummy", version: "poc" },
    data: {
      items: [
        { id: "EX-301", case_no: "F1-2026-00139", type: "payment_exception", severity: "high", status: "open", owner_role: "Фінанси", opened_at: "2026-02-10 17:30", sla_response: "2026-02-11 12:00", description: "Часткова оплата: отримано 75% від суми рахунку" },
        { id: "EX-300", case_no: "F1-2026-00141", type: "weight_mismatch", severity: "medium", status: "in_progress", owner_role: "Брокер", opened_at: "2026-02-10 08:45", sla_response: "2026-02-11 08:45", description: "CMR: 2450 кг, AWB: 2380 кг, Рахунок: 2400 кг" },
        { id: "EX-299", case_no: "F1-2026-00138", type: "customs_hold", severity: "high", status: "open", owner_role: "Брокер", opened_at: "2026-02-09 14:00", sla_response: "2026-02-09 18:00", description: "Митний огляд ініційовано. Потрібні додаткові документи." },
        { id: "EX-298", case_no: "F1-2026-00136", type: "partial_arrival", severity: "medium", status: "resolved", owner_role: "Авіалогістика", opened_at: "2026-02-08 11:00", sla_response: "2026-02-09 11:00", description: "Прибуло 38 з 48 місць. 10 місць на наступному рейсі." },
        { id: "EX-297", case_no: "F1-2026-00134", type: "weight_mismatch", severity: "low", status: "closed", owner_role: "Брокер", opened_at: "2026-02-07 09:30", sla_response: "2026-02-08 09:30", description: "Відхилення 12 кг — прийнято як в межах допуску." },
        { id: "EX-296", case_no: "F1-2026-00140", type: "low_confidence_extraction", severity: "medium", status: "open", owner_role: "Авіалогістика", opened_at: "2026-02-11 07:45", sla_response: "2026-02-11 15:45", description: "AI-екстрактор повернув confidence 0.52 для полів ваги/кількості в AWB. Потрібна ручна верифікація (deep mode)." }
      ]
    },
    errors: []
  },

  // ─── Сповіщення (SH-07) ───
  notifications: {
    meta: { source: "dummy", version: "poc" },
    data: {
      items: [
        { id: "N-501", type: "task_breached", title: "SLA порушено: Платіжний шлюз (F1-2026-00139)", time: "12 хв. тому", read: false, link_case: "F1-2026-00139" },
        { id: "N-500", type: "exception_opened", title: "Нова виняткова ситуація: Часткова оплата", time: "35 хв. тому", read: false, link_case: "F1-2026-00139" },
        { id: "N-499", type: "task_assigned", title: "Нова задача: Супровід кордону (F1-2026-00141)", time: "1 год. тому", read: false, link_case: "F1-2026-00141" },
        { id: "N-498", type: "document_approval", title: "Потрібне затвердження: Пакет T1 (F1-2026-00142)", time: "2 год. тому", read: true, link_case: "F1-2026-00142" },
        { id: "N-497", type: "gate_changed", title: "Платіжний шлюз оновлено → БЛОКУВАННЯ (F1-2026-00139)", time: "3 год. тому", read: true, link_case: "F1-2026-00139" },
        { id: "N-496", type: "task_nearing_breach", title: "SLA під ризиком: Перетин кордону (F1-2026-00141)", time: "4 год. тому", read: true, link_case: "F1-2026-00141" },
        { id: "N-495", type: "exception_escalated", title: "Ескалація: Митне утримання (F1-2026-00138)", time: "6 год. тому", read: true, link_case: "F1-2026-00138" },
        { id: "N-494", type: "low_confidence_extraction", title: "Низька впевненість AI: AWB поля ваги/кількості (F1-2026-00140)", time: "8 год. тому", read: true, link_case: "F1-2026-00140" },
        { id: "N-493", type: "approval_decision_required", title: "Потрібне рішення: Ручна зміна платіжного шлюзу (F1-2026-00139)", time: "9 хв. тому", read: false, link_case: "F1-2026-00139", approval_id: "APR-201", approval_type: "PAYMENT_GATE_OVERRIDE_APPROVAL", verification_mode: "deep" },
        { id: "N-492", type: "approval_sla_at_risk", title: "Approval SLA під ризиком: Авторизація видачі (F1-2026-00142)", time: "25 хв. тому", read: false, link_case: "F1-2026-00142", approval_id: "APR-200", approval_type: "RELEASE_AUTHORIZATION_APPROVAL", verification_mode: "standard" },
        { id: "N-491", type: "approval_sla_breached", title: "SLA затвердження порушено: Ручна зміна платіжного шлюзу (F1-2026-00139)", time: "5 хв. тому", read: false, link_case: "F1-2026-00139", approval_id: "APR-201", approval_type: "PAYMENT_GATE_OVERRIDE_APPROVAL", verification_mode: "deep" },
        { id: "N-490", type: "handover_ack_required", title: "Потрібне підтвердження handover: Broker → Road (F1-2026-00142)", time: "15 хв. тому", read: false, link_case: "F1-2026-00142" },
        { id: "N-489", type: "handover_delivery_failed", title: "Збій доставки handover: Air → Broker (F1-2026-00138)", time: "30 хв. тому", read: false, link_case: "F1-2026-00138" },
        { id: "N-488", type: "single_entry_conflict", title: "Конфлікт єдиного вводу: Сума EUR (F1-2026-00141)", time: "45 хв. тому", read: false, link_case: "F1-2026-00141" },
        { id: "N-487", type: "single_entry_synced", title: "Sync 1С завершено: 5 записів (F1-2026-00137)", time: "1 год. тому", read: true, link_case: "F1-2026-00137" },
        { id: "N-486", type: "insurance_request_sent", title: "Запит страхування надіслано (F1-2026-00140)", time: "2 год. тому", read: true, link_case: "F1-2026-00140" },
        { id: "N-485", type: "template_message_sent", title: "Шаблонне повідомлення надіслано клієнту (F1-2026-00142)", time: "3 год. тому", read: true, link_case: "F1-2026-00142" },
        { id: "N-484", type: "arrival_auto_synced", title: "Прибуття авто-синхронізовано: F1-2026-00135", time: "5 год. тому", read: true, link_case: "F1-2026-00135" },
        { id: "N-483", type: "arrival_sync_failed", title: "Збій синхронізації прибуття: F1-2026-00141", time: "6 год. тому", read: false, link_case: "F1-2026-00141" }
      ],
      unread_count: 10
    },
    errors: []
  },

  // ─── Звіти (SH-08) ───
  reports: {
    meta: {
      document_path: "shared/SH-08_reports_and_dashboards.md",
      screen_id: "SH-08_reports_and_dashboards",
      primary_route: "/api/v1/reports/operations-overview",
      primary_event: "CaseUpdated",
      updated_at: "2026-02-12T09:00:00Z"
    },
    data: {
      operations_overview: {
        active_cases: 47, active_cases_trend: 12,
        at_risk: 8, at_risk_trend: -5,
        breached: 3, breached_trend: 50,
        release_waiting: 12, release_waiting_trend: 20,
        completed_today: 5, completed_today_trend: -17,
        // розподіл по статусах для donut
        status_distribution: [
          { label: "В роботі", pct: 55, color: "accent" },
          { label: "Під ризиком", pct: 17, color: "warning" },
          { label: "Порушено SLA", pct: 6, color: "danger" },
          { label: "Очікують видачу", pct: 22, color: "success" }
        ]
      },
      sla_dashboard: {
        breach_by_stage: [
          { stage: "Авіабукінг", count: 0 },
          { stage: "Попереднє сповіщення", count: 1 },
          { stage: "T1/Транзит", count: 0 },
          { stage: "Автотранзит", count: 2 },
          { stage: "Митниця", count: 1 },
          { stage: "Платіжний шлюз", count: 3 },
          { stage: "Видача", count: 1 }
        ],
        breach_by_role: [
          { role: "Продажі", count: 0 },
          { role: "Авіалогістика", count: 1 },
          { role: "Брокер", count: 1 },
          { role: "Автологістика", count: 2 },
          { role: "Склад", count: 1 },
          { role: "Бухгалтерія", count: 0 },
          { role: "Фінанси", count: 3 },
          { role: "Операційний адміністратор", count: 0 }
        ],
        mean_response_hours: 4.2, mean_response_trend: -8,
        mean_resolve_hours: 18.6, mean_resolve_trend: 5,
        total_breaches_30d: 8, total_breaches_trend: -11
      },
      exceptions_dashboard: {
        by_type: [
          { type: "payment_exception", count: 8 },
          { type: "weight_mismatch", count: 5 },
          { type: "partial_arrival", count: 3 },
          { type: "customs_hold", count: 2 }
        ],
        total_open: 18, total_open_trend: 6,
        mean_resolution_hours: 12.4, mean_resolution_trend: -15,
        repeat_root_causes: [
          { cause: "Неповний пакувальний лист", count: 4 },
          { cause: "Помилка конвертації валюти", count: 3 },
          { cause: "Затримка даних від перевізника", count: 2 }
        ]
      },
      finance_gate: {
        blocked_partial_payment: 6, blocked_partial_trend: 20,
        blocked_missing_docs: 4, blocked_docs_trend: -33,
        gate_fail_count_30d: 7, gate_fail_trend: -12,
        total_gate_evaluations_30d: 89, total_evals_trend: 8,
        pass_rate_pct: 92,
        gate_distribution: [
          { label: "Пройшли (pass)", pct: 92, color: "success" },
          { label: "Заблоковано (fail)", pct: 8, color: "danger" }
        ]
      },
      user_expectations: {
        insurance_auto_workflow_rate: "72%", insurance_trend: 5,
        template_message_usage_rate: "58%", template_trend: 12,
        arrival_auto_sync_rate: "85%", arrival_trend: 3,
        mobile_critical_action_usage: "34%", mobile_trend: -8,
        p95_ui_latency_desktop_ms: 1400, latency_desktop_trend: -6,
        p95_ui_latency_mobile_ms: 2200, latency_mobile_trend: -4,
        target_rates: {
          insurance: "80%",
          template: "70%",
          arrival: "90%",
          mobile: "60%",
          latency_desktop: "2000 мс",
          latency_mobile: "3000 мс"
        }
      },
      ai_quality: {
        correction_rate_by_flow: [
          { flow: "AWB", rate: "4.2%", rate_num: 4.2 },
          { flow: "CMR", rate: "6.8%", rate_num: 6.8 },
          { flow: "Інвойс", rate: "11.3%", rate_num: 11.3 },
          { flow: "Пакувальний лист", rate: "8.1%", rate_num: 8.1 },
          { flow: "Митна декларація", rate: "3.5%", rate_num: 3.5 }
        ],
        auto_accept_rate: "78.4%", auto_accept_trend: 2,
        low_confidence_frequency: "6.2%", low_conf_trend: -8,
        fields_most_corrected: [
          { field: "Вага (кг)", corrections: 24, total: 312, rate: "7.7%" },
          { field: "Кількість місць", corrections: 18, total: 312, rate: "5.8%" },
          { field: "Вартість (валюта)", corrections: 15, total: 298, rate: "5.0%" },
          { field: "HS-код", corrections: 11, total: 156, rate: "7.1%" },
          { field: "Дата документа", corrections: 8, total: 312, rate: "2.6%" }
        ],
        mean_confidence_score: 0.89, mean_conf_trend: 1,
        low_confidence_threshold: 0.70,
        ai_distribution: [
          { label: "Авто-підтверджено", pct: 78, color: "success" },
          { label: "Ручне підтвердження", pct: 16, color: "accent" },
          { label: "Низька впевненість", pct: 6, color: "warning" }
        ]
      }
    },
    errors: []
  },

  // ─── Продажі (SA-01..04) ───
  sales: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          new_inquiries: 4,
          quotes_pending: 7,
          awaiting_docs: 3,
          active_cases: 12
        },
        kpi: {
          response_time_to_client_hours: 4.2,
          request_completeness_rate: 0.86,
          stalled_confirmations_count: 5
        },
        recent_quotes: [
          { id: "Q-2026-088", client: "ТехІмпорт Україна", route: "PVG → KBP", weight: "1240 кг", status: "confirmed", created: "2026-02-05", sla: "on_track", blocker: null },
          { id: "Q-2026-087", client: "АгроПостач Лтд", route: "FRA → KBP", weight: "3200 кг", status: "pending", created: "2026-02-04", sla: "at_risk", blocker: "Відсутній інвойс" },
          { id: "Q-2026-086", client: "МедОблад Ко", route: "CDG → KBP", weight: "890 кг", status: "confirmed", created: "2026-02-03", sla: "on_track", blocker: null },
          { id: "Q-2026-085", client: "ФармаДирект", route: "IST → KBP", weight: "560 кг", status: "pending", created: "2026-02-02", sla: "breached", blocker: "Очікується MSDS" },
          { id: "Q-2026-084", client: "АвтоДеталь ЄС", route: "MUC → KBP", weight: "2100 кг", status: "pending", created: "2026-02-01", sla: "on_track", blocker: null },
          { id: "Q-2026-083", client: "ЕлектроХаб", route: "SIN → KBP", weight: "780 кг", status: "cancelled", created: "2026-01-30", sla: "on_track", blocker: null }
        ]
      },
      quote_wizard: {
        // ─── Базові дані (спільні для всіх сценаріїв) ───
        base: {
          quote_id: "Q-2026-088",
          quote_status: "waiting_for_rates",
          client_id: "CL-10234",
          client_name: "НовийКлієнт ТОВ",
          client_is_draft: false,
          pickup_contacts: [
            { name: "Мехмет Озтюрк", phone: "+90-555-123-4567", email: "m.ozturk@supplier.com.tr" },
            { name: "Айше Демір", phone: "+90-555-987-6543", email: "" }
          ],
          cargo: {
            weight_kg: 500,
            volume_m3: 3.8,
            places: 20,
            dimensions_or_volume: "120×80×100 см (×20 місць)",
            packaging_type: "Палети",
            stackability_flag: true
          },
          origin: "Стамбул (IST)",
          destination: "Київ (KBP)",
          incoterms: "EXW",
          readiness_date: "2026-02-20",
          dangerous_cargo: false,
          dangerous_cargo_description: "",
          msds_marker: false,
          insurance_required: true,
          insurance: {
            invoice_no: "INV-TR-2026-0045",
            invoice_date: "2026-02-18",
            invoice_amount: 12500.00,
            currency: "USD"
          },
          broker_side: "our",
          agents: [
            { id: "AR-8891", name: "ТуркЛог Експрес", rate_per_kg: 2.80, transit_days: 3, valid_until: "2026-02-25", status: "active" },
            { id: "AR-8892", name: "Босфор Ейр Карго", rate_per_kg: 3.10, transit_days: 2, valid_until: "2026-02-28", status: "active" },
            { id: "AR-8893", name: "Анатолія Логістикс", rate_per_kg: 2.60, transit_days: 5, valid_until: "2026-02-10", status: "expired" }
          ],
          selected_agent_rate_id: null,
          supplier_contacts_confirmed: true,
          invoice_attached: true,
          packing_list_attached: true,
          rates_requested: true,
          validation_warnings: [
            { code: "INCOTERMS_ROUTE_CONFLICT", message: "Incoterms EXW може суперечити обраному маршруту — перевірте умови забору." }
          ],
          validation_blockers: [],
          status_model: [
            { status: "draft", label: "Чернетка", description: "Менеджер заповнює wizard." },
            { status: "waiting_for_rates", label: "Очікування ставок", description: "Запит на ставки надіслано агентам." },
            { status: "waiting_client_confirm", label: "Очікування клієнта", description: "Ставку обрано, пропозицію надіслано клієнту." },
            { status: "case_created", label: "Кейс створено", description: "Клієнт підтвердив, кейс і задачі створено." }
          ],
          handover_checklist: [
            { item: "Контакти відправника підтверджені", done: true },
            { item: "Інвойс прикріплено", done: true },
            { item: "Пакувальний лист прикріплено", done: true },
            { item: "Агентську ставку обрано", done: false },
            { item: "Клієнтську заявку підписано", done: false }
          ]
        },
        // ─── Демо-сценарії (overrides до base) ───
        scenarios: {
          happy_path: {
            label: "Успішний шлях",
            icon: "✅",
            description: "Повне проходження wizard без блокерів. Ставки активні, дані повні.",
            overrides: {}
          },
          msds_blocker: {
            label: "Блокер MSDS",
            icon: "🚫",
            description: "Небезпечний вантаж без MSDS — повний блок на кроці «Ризики».",
            overrides: {
              quote_status: "draft",
              dangerous_cargo: true,
              dangerous_cargo_description: "Літієві батареї, UN3480",
              msds_marker: false,
              validation_blockers: [
                { code: "DANGEROUS_CARGO_MSDS_REQUIRED", field: "msds_marker", step: 3, message: "Небезпечний вантаж вимагає MSDS-маркування. Створення кейсу заблоковано до завантаження MSDS." }
              ],
              validation_warnings: []
            }
          },
          rate_expired: {
            label: "Протерміновані ставки",
            icon: "⏰",
            description: "Усі ставки протерміновані — потрібен повторний запит.",
            overrides: {
              quote_status: "waiting_for_rates",
              rates_requested: true,
              agents: [
                { id: "AR-8891", name: "ТуркЛог Експрес", rate_per_kg: 2.80, transit_days: 3, valid_until: "2026-02-10", status: "expired" },
                { id: "AR-8892", name: "Босфор Ейр Карго", rate_per_kg: 3.10, transit_days: 2, valid_until: "2026-02-08", status: "expired" },
                { id: "AR-8893", name: "Анатолія Логістикс", rate_per_kg: 2.60, transit_days: 5, valid_until: "2026-02-05", status: "expired" }
              ],
              validation_blockers: [
                { code: "AGENT_RATE_NOT_SELECTED", field: "selected_agent_rate_id", step: 4, message: "Усі ставки агентів протерміновані. Запросіть нові ставки перед створенням кейсу." }
              ],
              validation_warnings: []
            }
          },
          rate_reset: {
            label: "Скидання ставки",
            icon: "🔄",
            description: "Зміна параметрів вантажу після вибору ставки — ставка скидається.",
            overrides: {
              quote_status: "waiting_for_rates",
              selected_agent_rate_id: null,
              validation_warnings: [
                { code: "INCOTERMS_ROUTE_CONFLICT", message: "Incoterms EXW може суперечити обраному маршруту — перевірте умови забору." },
                { code: "RATE_RESET_AFTER_CARGO_CHANGE", message: "Параметри вантажу змінено після вибору ставки AR-8891. Обрану ставку скинуто — оберіть нову або запросіть оновлені." }
              ]
            }
          },
          new_client: {
            label: "Новий клієнт (чернетка)",
            icon: "👤",
            description: "Клієнт ще не завершив онбординг у 1С — блок на створення кейсу.",
            overrides: {
              quote_status: "draft",
              client_id: "DRAFT-CL-099",
              client_name: "ТестДрафт ТОВ",
              client_is_draft: true,
              validation_blockers: [
                { code: "CLIENT_ONBOARDING_INCOMPLETE", field: "client_id", step: 0, message: "Клієнт ще не пройшов онбординг у 1С. Створення кейсу заблоковано." }
              ],
              validation_warnings: []
            }
          }
        },
        // ─── Аудит-таймлайн подій прорахунку ───
        timeline: [
          { ts: "2026-02-11 10:00", actor: "Оксана М. (Продажі)", message: "Створено чернетку прорахунку Q-2026-088", detail: "QuoteDraftSaved · correlation_id: COR-Q-088" },
          { ts: "2026-02-11 10:15", actor: "Оксана М. (Продажі)", message: "Заповнено параметри вантажу та маршрут", detail: "QuoteWizardStep · кроки 1–3 збережено" },
          { ts: "2026-02-11 10:30", actor: "Система", message: "Запит на ставки надіслано 3 агентам", detail: "RatesRequested · request_id: RR-2026-088" },
          { ts: "2026-02-11 14:00", actor: "Система", message: "Отримано ставку від ТуркЛог Експрес", detail: "AgentRateReceived · AR-8891 · $2.80/кг · 3 дні" },
          { ts: "2026-02-11 15:10", actor: "Система", message: "Отримано ставку від Босфор Ейр Карго", detail: "AgentRateReceived · AR-8892 · $3.10/кг · 2 дні" },
          { ts: "2026-02-11 16:45", actor: "Система", message: "Ставка Анатолія Логістикс протермінована", detail: "AgentRateExpired · AR-8893 · valid_until: 2026-02-10" }
        ]
      },
      client_documents: [
        { doc_type: "Контракт", filename: "dogovir_novyi_klient_2026.pdf", status: "active", uploaded: "2026-01-15" },
        { doc_type: "Довіреність", filename: "dovirenist_novyi_klient.pdf", status: "active", uploaded: "2026-01-15" },
        { doc_type: "Довідка ІПН", filename: "dovidka_ipn.pdf", status: "active", uploaded: "2026-01-15" }
      ],
      communication: {
        // ─── Базові дані (спільні для всіх сценаріїв) ───
        base: {
          sync_health: { system: "zammad", state: "connected" },
          threads: [
            { id: "MSG-401", client: "ТехІмпорт Україна", subject: "Статус перевезення F1-2026-00142", last_message: "Вантаж на митному оформленні, очікуваний час — до кінця тижня.", date: "2026-02-11 09:30", unread: true, ticket_id: "ZMD-TKT-8842", case_no: "F1-2026-00142" },
            { id: "MSG-400", client: "АгроПостач Лтд", subject: "Запит на ставку FRA-KBP", last_message: "Надсилаємо пропозицію до кінця дня.", date: "2026-02-10 14:20", unread: false, ticket_id: "ZMD-TKT-8840", case_no: "F1-2026-00141" },
            { id: "MSG-399", client: "МедОблад Ко", subject: "Блокування видачі F1-2026-00139", last_message: "Очікуємо підтвердження оплати від бухгалтерії.", date: "2026-02-10 11:45", unread: true, ticket_id: "ZMD-TKT-8838", case_no: "F1-2026-00139" }
          ],
          conversation_details: {
            "MSG-401": {
              case_no: "F1-2026-00142", ticket_id: "ZMD-TKT-8842", client: "ТехІмпорт Україна",
              subject: "Статус перевезення F1-2026-00142",
              articles: [
                { article_id: "ART-5501", direction: "inbound", visibility: "external", channel: "email", actor: "Олена Коваль (ТехІмпорт)", summary: "Доброго дня, підкажіть будь ласка очікувану дату видачі вантажу.", timestamp: "2026-02-11 08:50", attachment_refs: [] },
                { article_id: "ART-5500", direction: "outbound", visibility: "external", channel: "email", actor: "Оксана М. (Sales)", summary: "Доброго дня! Вантаж на митному оформленні, орієнтовний час — до кінця тижня. Оновимо вас одразу після проходження.", timestamp: "2026-02-11 09:30", attachment_refs: [] },
                { article_id: "ART-5499", direction: "inbound", visibility: "internal", channel: "note", actor: "Продажі — Оксана М.", summary: "Внутрішня нотатка: Клієнт запитує дату. Перевірити з брокером стан митного оформлення.", timestamp: "2026-02-11 09:15", attachment_refs: [] },
                { article_id: "ART-5498", direction: "outbound", visibility: "external", channel: "email", actor: "Оксана М. (Sales)", summary: "Вантаж прибув до KBP, розпочато процедуру митного оформлення.", timestamp: "2026-02-10 12:00", attachment_refs: ["AWB копія (074-12345678)"] },
                { article_id: "ART-5497", direction: "inbound", visibility: "external", channel: "email", actor: "Олена Коваль (ТехІмпорт)", summary: "Дякуємо за інформацію. Чекаємо на подальші оновлення.", timestamp: "2026-02-10 14:15", attachment_refs: [] }
              ],
              commitments: [
                { id: "CMT-201", text: "Оновити клієнта після проходження митниці", pinned_by: "Оксана М.", pinned_at: "2026-02-11 09:35", status: "open" },
                { id: "CMT-200", text: "Надати копію AWB клієнту", pinned_by: "Оксана М.", pinned_at: "2026-02-10 11:50", status: "done" }
              ]
            },
            "MSG-400": {
              case_no: "F1-2026-00141", ticket_id: "ZMD-TKT-8840", client: "АгроПостач Лтд",
              subject: "Запит на ставку FRA-KBP",
              articles: [
                { article_id: "ART-5490", direction: "outbound", visibility: "external", channel: "email", actor: "Оксана М. (Sales)", summary: "Доброго дня! Надсилаємо прорахунок на маршрут FRA-KBP. Ставка $2.80/кг, транзит 3 дні. Очікуємо підтвердження.", timestamp: "2026-02-10 14:20", attachment_refs: ["Прорахунок Q-2026-087.pdf"] },
                { article_id: "ART-5489", direction: "inbound", visibility: "external", channel: "email", actor: "Менеджер АгроПостач", summary: "Добрий день! Просимо розрахувати вартість перевезення 3200 кг із Франкфурта до Києва. Потрібно до 20 лютого.", timestamp: "2026-02-10 10:30", attachment_refs: ["specification.xlsx"] }
              ],
              commitments: [
                { id: "CMT-210", text: "Підготувати прорахунок до кінця дня", pinned_by: "Оксана М.", pinned_at: "2026-02-10 10:35", status: "done" }
              ]
            },
            "MSG-399": {
              case_no: "F1-2026-00139", ticket_id: "ZMD-TKT-8838", client: "МедОблад Ко",
              subject: "Блокування видачі F1-2026-00139",
              articles: [
                { article_id: "ART-5485", direction: "outbound", visibility: "external", channel: "email", actor: "Оксана М. (Sales)", summary: "Шановний клієнте, видача вашого вантажу тимчасово заблокована до отримання повної оплати. Наразі підтверджено 75% суми. Просимо здійснити доплату €2,250.", timestamp: "2026-02-10 11:45", attachment_refs: [] },
                { article_id: "ART-5484", direction: "inbound", visibility: "internal", channel: "note", actor: "Продажі — Оксана М.", summary: "Фінанси підтвердили: gate=FAIL, отримано €6,750 з €9,000. Потрібно повідомити клієнта.", timestamp: "2026-02-10 11:30", attachment_refs: [] },
                { article_id: "ART-5483", direction: "inbound", visibility: "external", channel: "email", actor: "Ірина Бойко (МедОблад)", summary: "Доброго дня! Коли можемо забрати вантаж зі складу? Маємо терміновість.", timestamp: "2026-02-10 09:20", attachment_refs: [] }
              ],
              commitments: [
                { id: "CMT-215", text: "Повідомити клієнта одразу після проходження платіжного шлюзу", pinned_by: "Оксана М.", pinned_at: "2026-02-10 11:50", status: "open" }
              ]
            }
          },
          // ─── Шаблони повідомлень ───
          message_templates: [
            { id: "TPL-01", name: "Статус перевезення", context: "sales_communication", preview: "Доброго дня, {client_contact}!\n\nПовідомляємо про статус вашого перевезення {case_no}:\n— AWB: {awb}\n— Поточний стан: {current_state_label}\n— Орієнтовна дата: {eta}\n\nЗ повагою, {sales_manager}" },
            { id: "TPL-02", name: "Запит документів", context: "sales_communication", preview: "Доброго дня, {client_contact}!\n\nДля продовження роботи з кейсом {case_no} нам необхідні наступні документи:\n— {missing_docs}\n\nПросимо надіслати протягом {deadline}.\n\nЗ повагою, {sales_manager}" },
            { id: "TPL-03", name: "Підтвердження ставки", context: "sales_communication", preview: "Доброго дня, {client_contact}!\n\nПідтверджуємо ставку на маршрут {route}:\n— Ставка: {rate}/кг\n— Транзит: {transit_days} днів\n— Дійсна до: {valid_until}\n\nДля підтвердження, будь ласка, надішліть відповідь.\n\nЗ повагою, {sales_manager}" },
            { id: "TPL-04", name: "Повідомлення про затримку", context: "sales_communication", preview: "Доброго дня, {client_contact}!\n\nІнформуємо про затримку в обробці кейсу {case_no}.\n— Причина: {delay_reason}\n— Новий очікуваний строк: {new_eta}\n\nПриносимо вибачення за незручності.\n\nЗ повагою, {sales_manager}" },
            { id: "TPL-05", name: "Інструкція для складу (China)", context: "sales_communication", preview: "Dear Warehouse,\n\nPlease prepare shipment for case {case_no}:\n— Marking: {marking_instructions}\n— Address: {warehouse_address}\n— Contact: {warehouse_contact}\n— Pieces: {pieces}, Weight: {weight_kg} kg\n\nBest regards, {sales_manager}" }
          ],
          // ─── Таймлайн-прев'ю (аудит комунікацій) ───
          timeline_preview: [
            { ts: "2026-02-11 09:30", actor: "Оксана М. (Продажі)", type: "conversation_reply_sent", message: "Зовнішня відповідь надіслана клієнту ТехІмпорт Україна", detail: "ticket_id: ZMD-TKT-8842 · article_id: ART-5500", icon: "" },
            { ts: "2026-02-11 09:35", actor: "Оксана М. (Продажі)", type: "commitment_pinned", message: "Комітмент зафіксовано: «Оновити клієнта після проходження митниці»", detail: "CMT-201 · case_no: F1-2026-00142", icon: "event-success" },
            { ts: "2026-02-11 08:50", actor: "Zammad (auto)", type: "conversation_article_received", message: "Нове вхідне повідомлення від Олена Коваль (ТехІмпорт)", detail: "ticket_id: ZMD-TKT-8842 · article_id: ART-5501", icon: "" },
            { ts: "2026-02-10 14:20", actor: "Оксана М. (Продажі)", type: "conversation_reply_sent", message: "Прорахунок надіслано клієнту АгроПостач Лтд", detail: "ticket_id: ZMD-TKT-8840 · article_id: ART-5490", icon: "" },
            { ts: "2026-02-10 12:00", actor: "Оксана М. (Продажі)", type: "conversation_reply_sent", message: "Повідомлення клієнту про прибуття вантажу до KBP", detail: "ticket_id: ZMD-TKT-8842 · article_id: ART-5498", icon: "" },
            { ts: "2026-02-10 11:45", actor: "Оксана М. (Продажі)", type: "conversation_reply_sent", message: "Повідомлення МедОблад Ко щодо блокування видачі", detail: "ticket_id: ZMD-TKT-8838 · article_id: ART-5485", icon: "" }
          ]
        },
        // ─── Демо-сценарії (overrides до base) ───
        scenarios: {
          happy_path: {
            label: "Успішний шлях",
            icon: "✅",
            description: "Зв'язаний тред, Zammad підключено. Повна комунікація з клієнтом — треди, відповіді, комітменти.",
            overrides: {}
          },
          degraded_sync: {
            label: "Деградація Zammad",
            icon: "⚠️",
            description: "Zammad у стані degraded — зовнішня відправка обмежена, показано попереджувальний banner.",
            overrides: {
              sync_health: { system: "zammad", state: "degraded" },
              degradation_banner: "Зʼєднання з Zammad нестабільне. Відправка зовнішніх повідомлень може бути затримана. Внутрішні нотатки працюють нормально."
            }
          },
          unlinked_thread: {
            label: "Незвʼязаний тред",
            icon: "🔗",
            description: "Тред ще не привʼязаний до кейсу — blocker перед відправкою, CTA «Звʼязати тред».",
            overrides: {
              threads: [
                { id: "MSG-NEW", client: "НовийКонтакт ТОВ", subject: "Запит на перевезення зі Стамбула", last_message: "Просимо розрахувати вартість 500 кг IST-KBP.", date: "2026-02-12 08:30", unread: true, ticket_id: null, case_no: null },
                { id: "MSG-401", client: "ТехІмпорт Україна", subject: "Статус перевезення F1-2026-00142", last_message: "Вантаж на митному оформленні, очікуваний час — до кінця тижня.", date: "2026-02-11 09:30", unread: false, ticket_id: "ZMD-TKT-8842", case_no: "F1-2026-00142" }
              ],
              conversation_details: {
                "MSG-NEW": {
                  case_no: null, ticket_id: null, client: "НовийКонтакт ТОВ",
                  subject: "Запит на перевезення зі Стамбула", unlinked: true,
                  articles: [
                    { article_id: "ART-NEW-01", direction: "inbound", visibility: "external", channel: "email", actor: "Контакт НовийКонтакт ТОВ", summary: "Доброго дня! Просимо розрахувати вартість перевезення 500 кг зі Стамбула до Києва. Потрібно до кінця лютого. Вантаж — текстильна продукція.", timestamp: "2026-02-12 08:30", attachment_refs: ["inquiry_spec.pdf"] }
                  ],
                  commitments: []
                },
                "MSG-401": {
                  case_no: "F1-2026-00142", ticket_id: "ZMD-TKT-8842", client: "ТехІмпорт Україна",
                  subject: "Статус перевезення F1-2026-00142",
                  articles: [
                    { article_id: "ART-5501", direction: "inbound", visibility: "external", channel: "email", actor: "Олена Коваль (ТехІмпорт)", summary: "Доброго дня, підкажіть будь ласка очікувану дату видачі вантажу.", timestamp: "2026-02-11 08:50", attachment_refs: [] },
                    { article_id: "ART-5500", direction: "outbound", visibility: "external", channel: "email", actor: "Оксана М. (Sales)", summary: "Доброго дня! Вантаж на митному оформленні, орієнтовний час — до кінця тижня.", timestamp: "2026-02-11 09:30", attachment_refs: [] }
                  ],
                  commitments: []
                }
              }
            }
          },
          commitment_flow: {
            label: "Фіксація комітменту",
            icon: "📌",
            description: "Демонстрація створення комітменту з повідомлення та перетворення його на follow-up задачу.",
            overrides: {}
          },
          failed_send: {
            label: "Помилка відправки",
            icon: "❌",
            description: "Збій відправки через Zammad API — error banner, можливість повтору.",
            overrides: {
              sync_health: { system: "zammad", state: "failed" },
              send_error: {
                code: "ZAMMAD_SEND_FAILED",
                message: "Не вдалося надіслати повідомлення через Zammad API. Перевірте зʼєднання та спробуйте ще раз.",
                article_id: "ART-5500",
                retry_available: true
              }
            }
          }
        }
      }
    },
    errors: []
  },

  // ─── Авіалогістика (AL-01..04) ───
  airLogistics: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          booking_requests: 5,
          awb_pending: 3,
          prealert_queue: 4,
          handover_ready: 2,
          insurance_queue: 2
        },
        today_flights: [
          { flight: "PS802", route: "PVG → KBP", etd: "2026-02-11 06:00", eta: "2026-02-11 18:30", status: "in_flight", cases: 3 },
          { flight: "TK330", route: "IST → KBP", etd: "2026-02-11 10:15", eta: "2026-02-11 13:30", status: "scheduled", cases: 2 },
          { flight: "LH8460", route: "PVG → FRA → KBP", etd: "2026-02-12 08:00", eta: "2026-02-12 20:00", status: "scheduled", cases: 1 }
        ],
        // Пріоритизовані задачі (inbox)
        tasks: [
          { id: "TSK-4201", case_no: "F1-2026-00135", type: "booking", title: "Підтвердити букінг PS802 PVG→KBP", sla_state: "at_risk", sla_deadline: "2026-02-12 14:00", priority: "high", current_state: "BOOKING_IN_PROGRESS", blocker: null },
          { id: "TSK-4202", case_no: "F1-2026-00138", type: "awb", title: "Перевірити MAWB 074-11223344 — розбіжність ваги", sla_state: "breached", sla_deadline: "2026-02-12 10:00", priority: "high", current_state: "BROKER_REVIEW_PENDING", blocker: "weight_mismatch" },
          { id: "TSK-4203", case_no: "F1-2026-00140", type: "prealert", title: "Відправити pre-alert для TK330 IST→KBP", sla_state: "on_track", sla_deadline: "2026-02-12 16:00", priority: "medium", current_state: "PREALERT_PREPARATION", blocker: null },
          { id: "TSK-4204", case_no: "F1-2026-00142", type: "handover", title: "Підготувати handover-пакет до Брокер + Автологістика", sla_state: "on_track", sla_deadline: "2026-02-12 18:00", priority: "medium", current_state: "BOOKING_CONFIRMED", blocker: null },
          { id: "TSK-4205", case_no: "F1-2026-00137", type: "booking", title: "Запросити ставки у 3 агентів — LH Cargo, TK Cargo, PS", sla_state: "on_track", sla_deadline: "2026-02-13 12:00", priority: "normal", current_state: "BOOKING_IN_PROGRESS", blocker: null },
          { id: "TSK-4206", case_no: "F1-2026-00139", type: "awb", title: "Затвердити HAWB — очікує корекції одержувача", sla_state: "at_risk", sla_deadline: "2026-02-12 15:00", priority: "medium", current_state: "BROKER_REVIEW_PENDING", blocker: null },
          { id: "TSK-4207", case_no: "F1-2026-00141", type: "prealert", title: "Повторна розсилка pre-alert (зміна ETA)", sla_state: "on_track", sla_deadline: "2026-02-12 17:00", priority: "normal", current_state: "PRE_ALERT_SENT", blocker: null },
          { id: "TSK-4208", case_no: "F1-2026-00143", type: "insurance", title: "Страхування — очікується підтвердження полісу", sla_state: "on_track", sla_deadline: "2026-02-13 10:00", priority: "normal", current_state: "BOOKING_CONFIRMED", blocker: null }
        ],
        // SLA зведення
        sla_summary: {
          on_track: 5,
          at_risk: 2,
          breached: 1
        },
        // Блокери
        blockers: [
          { case_no: "F1-2026-00138", type: "weight_mismatch", message: "Розбіжність ваги MAWB/HAWB: 980 кг vs 1120 кг. Потрібна ручна верифікація.", severity: "high" },
          { case_no: "F1-2026-00135", type: "insurance_pending", message: "Страхування запитано, але не підтверджено. Відправка можлива без страхування.", severity: "medium" }
        ]
      },
      booking: {
        case_no: "F1-2026-00135",
        agent: "СкайБрідж Логістикс",
        airline: "PS",
        flight: "PS802",
        route: "PVG → KBP",
        etd: "2026-02-12 06:00",
        pieces: 30,
        weight_kg: 980,
        volume_weight_kg: 1120,
        chargeable_weight_kg: 1120,
        awb_number: "074-98765432",
        awb_status: "confirmed",
        rate_per_kg: 2.50,
        booking_ref: "BK-20260211-003",
        sla_booking_deadline: "2026-02-11 18:00",
        sla_awb_review_deadline: "2026-02-12 12:00",
        sla_state: "on_track",
        mawb: {
          number: "074-98765432",
          shipper: "СкайБрідж Логістикс (Шанхай)",
          consignee: "F1 Operations (Київ)",
          origin: "PVG",
          destination: "KBP",
          weight_kg: 980,
          pieces: 30,
          description: "Computer peripherals and accessories",
          declared_value: null,
          status: "confirmed"
        },
        hawb: {
          number: "HAWB-F1-2026-00135",
          shipper: "TechSupplier Co. Ltd",
          consignee: "ФудТрейд Інт — Мартинюк О.",
          consignee_address: "Київ, вул. Хрещатик 22, оф. 15",
          consignee_phone: "+380 44 555 9876",
          notify_party: "ФудТрейд Інт — бухгалтерія",
          weight_kg: 980,
          pieces: 30,
          description: "Computer peripherals and accessories",
          status: "draft"
        },
        mandatory_checks: [
          { item: "Маршрут відповідає замовленню", met: true },
          { item: "Консигнатор верифіковано", met: true },
          { item: "Кількість місць збігається", met: true },
          { item: "Вага збігається (фактична/об'ємна)", met: false },
          { item: "AWB номер валідний (формат IATA)", met: true },
          { item: "Ставка відповідає затвердженому контракту", met: true }
        ],
        carrier_options: [
          { id: "CO-01", carrier: "Ukraine International Airlines", flight: "PS802", route: "PVG→KBP (direct)", etd: "2026-02-12 06:00", eta: "2026-02-12 18:30", rate_per_kg: 2.50, transit_days: 1, service_notes: "Direct flight, priority handling", selected: true },
          { id: "CO-02", carrier: "Turkish Airlines Cargo", flight: "TK6302+TK330", route: "PVG→IST→KBP", etd: "2026-02-12 04:00", eta: "2026-02-13 13:30", rate_per_kg: 2.20, transit_days: 2, service_notes: "Transit IST, warehouse 6h", selected: false },
          { id: "CO-03", carrier: "Lufthansa Cargo", flight: "LH8460+LH1492", route: "PVG→FRA→KBP", etd: "2026-02-12 08:00", eta: "2026-02-13 20:00", rate_per_kg: 2.80, transit_days: 2, service_notes: "Premium handling, cold chain available", selected: false }
        ]
      },
      insurance: {
        case_no: "F1-2026-00140",
        insurance_required: true,
        insurance_state: "requested",
        policy_ref: null,
        requested_at: "2026-02-11 07:45",
        confirmed_at: null
      },
      prealert: {
        case_no: "F1-2026-00140",
        recipients_matrix: [
          { role: "Брокер", person: "Дмитро С.", reason: "T1 підготовка, митне оформлення" },
          { role: "Автологістика", person: "Андрій К.", reason: "Планування авто для вивозу" },
          { role: "Склад", person: "Віктор Г.", reason: "Підготовка до приймання вантажу" }
        ],
        required_attachments: [
          { doc: "Інвойс", status: "attached", required: true },
          { doc: "Пакувальний лист", status: "attached", required: true },
          { doc: "Копія AWB", status: "attached", required: true },
          { doc: "Сертифікат походження", status: "missing", required: false }
        ],
        eta: "2026-02-12 18:30",
        special_instructions: "Температурний режим: +2..+8°C"
      },
      handover: {
        case_no: "F1-2026-00142",
        checklist: [
          { item: "AWB підтверджено", done: true },
          { item: "DSK отримано", done: true },
          { item: "Попереднє сповіщення відправлено", done: true },
          { item: "Брокер підтвердив готовність T1", done: true },
          { item: "Автологістика підтвердила авто", done: true }
        ],
        handover_status: "ready"
      }
    },
    errors: []
  },

  // ─── Брокер (BR-01..04) ───
  broker: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          t1_preparation: 4,
          customs_active: 6,
          discrepancy_open: 2,
          completed_today: 3
        },
        active_declarations: [
          { case_no: "F1-2026-00142", type: "Імпорт", lrn: "UA202602110001", mrn: "—", status: "processing", customs_post: "KBP-T1" },
          { case_no: "F1-2026-00141", type: "Транзит T1", lrn: "UA202602100005", mrn: "26UA0001234567", status: "released", customs_post: "Ягодин" },
          { case_no: "F1-2026-00138", type: "Імпорт", lrn: "UA202602090003", mrn: "—", status: "hold", customs_post: "KBP-T1" }
        ]
      },
      t1_transit: {
        case_no: "F1-2026-00142",
        lrn: "UA202602110001",
        mrn: null,
        transit_type: "T1",
        origin_customs: "Аеропорт KBP",
        dest_customs: "Київський внутрішній термінал",
        required_docs: ["Копія AWB", "Інвойс", "Пакувальний лист", "Контракт", "Специфікація", "SWIFT підтвердження", "Транспортні реквізити"],
        doc_status: [
          { doc: "Копія AWB", status: "uploaded" },
          { doc: "Інвойс", status: "uploaded" },
          { doc: "Пакувальний лист", status: "uploaded" },
          { doc: "Контракт", status: "uploaded" },
          { doc: "Специфікація", status: "missing" },
          { doc: "SWIFT підтвердження", status: "missing" },
          { doc: "Транспортні реквізити", status: "uploaded" }
        ]
      },
      clearance: {
        case_no: "F1-2026-00142",
        declaration_type: "IM4",
        hs_codes: ["8471.30", "8473.30"],
        declared_value_usd: 48500,
        customs_duties: 4850,
        vat: 10670,
        status: "processing",
        inspections: []
      },
      discrepancy: {
        exception_id: "EX-300",
        case_no: "F1-2026-00141",
        type: "weight_mismatch",
        sources: {
          cmr: { weight_kg: 2450, pieces: 85, date: "2026-02-09" },
          awb: { weight_kg: 2380, pieces: 85, date: "2026-02-08" },
          invoice: { weight_kg: 2400, pieces: 85, date: "2026-02-07" }
        },
        root_cause_options: ["Помилка зважування перевізника", "Відмінність палетизації", "Помилка в документах", "Відхилення вологості"],
        selected_root_cause: null,
        correction_requests: [
          { to_role: "Авіалогістика", doc: "AWB", status: "pending", requested_at: "2026-02-10 09:00" }
        ]
      }
    },
    errors: []
  },

  // ─── Автологістика (RL-01..04) ───
  roadLogistics: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          planning_needed: 3,
          in_transit: 5,
          border_crossing: 2,
          delivery_pending: 4
        },
        fleet_today: [
          { truck: "AA1234BB", driver: "Петренко В.", route: "KBP → Київський склад", status: "in_transit", eta: "2026-02-11 14:00", cases: ["F1-2026-00142"] },
          { truck: "BC5678CD", driver: "Сидоренко О.", route: "Ягодин → Львівський склад", status: "border", eta: "2026-02-11 20:00", cases: ["F1-2026-00141"] },
          { truck: "KK9012LL", driver: "Мельник А.", route: "Київський склад → Клієнт", status: "delivering", eta: "2026-02-11 16:00", cases: ["F1-2026-00136"] }
        ]
      },
      truckPlanning: {
        case_no: "F1-2026-00142",
        pickup_point: "Вантажний термінал аеропорту KBP",
        delivery_point: "Київський центральний склад",
        weight_kg: 1240,
        pieces: 48,
        vehicle_type: "Тентований 20 т",
        assigned_truck: "AA1234BB",
        assigned_driver: "Петренко В.",
        planned_departure: "2026-02-11 10:00",
        planned_arrival: "2026-02-11 14:00",
        plan_locked: true,
        locked_at: "2026-02-11 09:30",
        locked_by: "Андрій К.",
        route_confirmed: true,
        carrier_options: [
          { id: "CR-01", carrier: "ТрансУА Логістикс", vehicle: "Тентований 20 т", price_uah: 4200, eta_hours: 4, notes: "Прямий рейс, GPS трекінг", status: "selected", driver: "Петренко В.", truck: "AA1234BB" },
          { id: "CR-02", carrier: "ВантажЕкспрес", vehicle: "Тентований 10 т", price_uah: 3600, eta_hours: 5, notes: "Дозавантаження в дорозі можливе", status: "backup", driver: "Іваненко М.", truck: "BB5678CC" },
          { id: "CR-03", carrier: "ЄвроТрак Сервіс", vehicle: "Рефрижератор 20 т", price_uah: 5800, eta_hours: 4, notes: "Температурний контроль +2..+8°C", status: "available", driver: null, truck: null }
        ],
        sla_state: "on_track",
        sla_deadline: "2026-02-11 12:00"
      },
      borderTracking: {
        case_no: "F1-2026-00141",
        border_post: "Ягодин-Дорогуськ",
        truck: "BC5678CD",
        driver: "Сидоренко О.",
        arrival_at_border: "2026-02-11 06:30",
        current_state: "CUSTOMS_CHECK",
        case_status: "open",
        queue_position: 3,
        estimated_clearance: "2026-02-11 12:00",
        events: [
          { ts: "2026-02-11 08:45", event: "Документи подано на митницю" },
          { ts: "2026-02-11 06:30", event: "Прибуття на прикордонний пост" },
          { ts: "2026-02-10 22:00", event: "Виїзд з терміналу (Люблін)" }
        ]
      },
      deliveryClosure: {
        case_no: "F1-2026-00136",
        delivery_address: "Київ, вул. Промислова 15, склад 3",
        recipient: "ЕлектроХаб — Мартинюк І.",
        actual_arrival: "2026-02-11 15:45",
        pod_signed: true,
        notes: "Усі 24 палети прийнято без зауважень.",
        final_cmr_attached: true,
        originals_dispatch_started: false,
        checklist: [
          { item: "Вантаж доставлено", done: true },
          { item: "POD підписано", done: true },
          { item: "Фото розвантаження", done: true },
          { item: "Фінальна CMR прикріплена", done: true },
          { item: "CMR закрито", done: true },
          { item: "Відправка оригіналів ініційована", done: false }
        ]
      }
    },
    errors: []
  },

  // ─── Склад (WH-01..04) ───
  warehouse: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          awaiting_arrival: 6,
          in_processing: 4,
          release_ready: 3,
          incidents_open: 2
        },
        today_arrivals: [
          { case_no: "F1-2026-00142", client: "ТехІмпорт Україна", expected: "14:00", pieces: 48, gate: "pending" },
          { case_no: "F1-2026-00140", client: "ФармаДирект", expected: "18:30", pieces: 30, gate: "pending" }
        ]
      },
      arrivalHandling: {
        case_no: "F1-2026-00142",
        expected_pieces: 48,
        received_pieces: 48,
        condition: "good",
        weight_check_kg: 1238,
        discrepancies: [],
        checklist: [
          { item: "Вантаж розвантажено", done: true },
          { item: "Кількість місць перевірено", done: true },
          { item: "Візуальний огляд стану", done: true },
          { item: "Вага звірена", done: true },
          { item: "Фото зроблено", done: true },
          { item: "Розміщено на складі", done: false }
        ]
      },
      release: {
        case_no: "F1-2026-00139",
        client: "МедОблад Ко",
        gate_status: "fail",
        gate_reason: "Часткова оплата: отримано 75% (€6,750 з €9,000)",
        gate_evaluated_at: "2026-02-10 17:30",
        gate_evaluated_by: "Фінанси — Лариса П.",
        release_blocked: true,
        stored_since: "2026-02-08",
        storage_days: 3
      },
      issueLog: {
        incidents: [
          { id: "ISS-101", case_no: "F1-2026-00139", type: "damaged_packaging", severity: "medium", description: "2 коробки з пошкодженим зовнішнім пакуванням", reported_by: "Склад — Віктор Г.", reported_at: "2026-02-08 14:30", status: "open", photos: 3 },
          { id: "ISS-100", case_no: "F1-2026-00136", type: "count_mismatch", severity: "low", description: "Фактично 24 палети замість 25 за CMR. Палета #25 об'єднана з #24.", reported_by: "Склад — Віктор Г.", reported_at: "2026-02-07 10:15", status: "resolved", photos: 1 }
        ]
      }
    },
    errors: []
  },

  // ─── Бухгалтерія (AC-01..04) ───
  accounting: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          cost_certs_pending: 5,
          customer_invoices_draft: 4,
          agent_invoices_incoming: 6,
          completed_today: 8
        },
        urgent_items: [
          { case_no: "F1-2026-00139", type: "cost_certificate", note: "Блокує платіжний шлюз", priority: "high" },
          { case_no: "F1-2026-00141", type: "agent_invoice", note: "Термін дати: завтра", priority: "medium" }
        ]
      },
      costCertificate: {
        case_no: "F1-2026-00142",
        client: "ТехІмпорт Україна",
        prerequisites: [
          { item: "Підписана заявка клієнта прикріплена", met: true },
          { item: "Первинні документи зібрані повністю", met: true },
          { item: "Курс валюти зафіксовано", met: true }
        ],
        line_items: [
          { description: "Авіаперевезення PVG-KBP", currency: "USD", amount: 3100.00, source_doc: "AWB 074-12345678" },
          { description: "Митне оформлення", currency: "UAH", amount: 8500.00, source_doc: "Брокер Інвойс BI-2026-044" },
          { description: "Автоперевезення KBP-склад", currency: "UAH", amount: 4200.00, source_doc: "CMR-UA-2026-0901" },
          { description: "Складське обслуговування", currency: "UAH", amount: 1500.00, source_doc: "Складська квитанція WR-142" }
        ],
        total_uah: 98450.00,
        fx_rate_usd: 41.20,
        status: "draft"
      },
      customerInvoice: {
        case_no: "F1-2026-00138",
        client: "ТекстильСвіт",
        invoice_no: "INV-2026-0138",
        amount: 125000.00,
        currency: "UAH",
        items: [
          { description: "Транспортні послуги (авіа + авто)", amount: 95000.00 },
          { description: "Митне оформлення", amount: 22000.00 },
          { description: "Складські послуги", amount: 8000.00 }
        ],
        prerequisites: [
          { item: "Підписана заявка клієнта прикріплена", met: true },
          { item: "Довідка витрат підтверджена", met: true },
          { item: "Первинні документи повні", met: true },
          { item: "Правило: 100% передоплата на дату виставлення", met: true }
        ],
        prerequisites_met: true,
        status: "ready_to_issue"
      },
      agentInvoice: {
        invoices: [
          { invoice_no: "AGI-2026-201", agent: "СкайБрідж Логістикс", amount_usd: 3100.00, case_no: "F1-2026-00142", received: "2026-02-09", due_date: "2026-02-23", status: "pending_review" },
          { invoice_no: "AGI-2026-200", agent: "ТуркЛог Експрес", amount_usd: 1850.00, case_no: "F1-2026-00135", received: "2026-02-08", due_date: "2026-02-22", status: "approved" },
          { invoice_no: "AGI-2026-199", agent: "ЄвроТранс ГмбХ", amount_eur: 2200.00, case_no: "F1-2026-00141", received: "2026-02-07", due_date: "2026-02-21", status: "pending_review" }
        ]
      }
    },
    errors: []
  },

  // ─── Фінанси (FI-01..04) ───
  finance: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          unallocated_payments: 8,
          partial_risk: 4,
          gate_pending: 6,
          reconciliation_mismatch: 3
        },
        today_widgets: {
          incoming_payments: 14,
          cases_blocked: 4,
          gate_fail_24h: 1
        }
      },
      paymentAllocation: {
        statement_items: [
          { ref: "PAY-20260211-001", payer: "ТехІмпорт Україна", amount: 98450.00, currency: "UAH", date: "2026-02-11", matched_case: "F1-2026-00142", status: "matched" },
          { ref: "PAY-20260211-002", payer: "МедОблад Ко", amount: 6750.00, currency: "EUR", date: "2026-02-11", matched_case: "F1-2026-00139", status: "partial" },
          { ref: "PAY-20260211-003", payer: "Невідомий платник", amount: 15000.00, currency: "UAH", date: "2026-02-11", matched_case: null, status: "unmatched" }
        ]
      },
      gateControl: {
        case_no: "F1-2026-00139",
        client: "МедОблад Ко",
        expected_total: 9000.00,
        currency: "EUR",
        received_total: 6750.00,
        shortfall: 2250.00,
        financial_summary: {
          expected: "€9,000",
          paid: "€6,750",
          status: "partial",
          as_of: "2026-02-11 11:30",
          last_sync: "2026-02-11 11:28",
          sync_source: "1С / банк"
        },
        prerequisites: [
          { item: "100% передоплата підтверджена", met: false },
          { item: "Бухгалтерські документи видані", met: true },
          { item: "Немає блокуючих винятків", met: false }
        ],
        gate_decision: "FAIL",
        last_evaluated: "2026-02-10 17:30",
        evaluated_by: "Лариса П."
      },
      reconciliation: {
        mismatches: [
          { id: "REC-051", type: "amount_mismatch", case_no: "F1-2026-00137", f1_amount: 45200.00, ext_amount: 45020.00, difference: 180.00, currency: "UAH", status: "open" },
          { id: "REC-050", type: "missing_event", case_no: "F1-2026-00135", description: "Оплата зафіксована в 1С, але не в F1", status: "open" },
          { id: "REC-049", type: "duplicate", case_no: "F1-2026-00133", description: "Подвійний запис оплати в F1", status: "resolved" }
        ]
      }
    },
    errors: []
  },

  // ─── Операційний адміністратор (OP-01..04) ───
  opsAdmin: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        sections: {
          policy_changes: 2,
          sla_health_alerts: 3,
          transition_conflicts: 1,
          reference_updates: 4
        },
        kpi: {
          manual_gate_reviews_30d: 7,
          rule_conflict_rate: "2.1%",
          policy_adoption_avg_days: 3.5
        }
      },
      slaPolicies: [
        { id: "SLA-001", name: "Авіабукінг SLA", stage: "Авіабукінг", target_minutes: 480, calendar: "business_hours", escalation: "Керівник групи → Керівник логістики", is_active: true, version: 3 },
        { id: "SLA-002", name: "Митне оформлення SLA", stage: "Митне оформлення", target_minutes: 1440, calendar: "calendar_days", escalation: "Керівник брокерів → Керівник операцій", is_active: true, version: 2 },
        { id: "SLA-003", name: "Платіжний шлюз SLA", stage: "Платіжний шлюз", target_minutes: 240, calendar: "business_hours", escalation: "Керівник фінансів → Фінансовий директор", is_active: true, version: 1 },
        { id: "SLA-004", name: "Склад Видача SLA", stage: "Склад Видача", target_minutes: 120, calendar: "business_hours", escalation: "Керівник складу → Керівник операцій", is_active: true, version: 2 }
      ],
      statusRules: [
        { id: "TR-01", from_status: "quote_confirmed", to_status: "booking_requested", required_docs: ["Контракт", "Інвойс"], role_whitelist: ["Продажі", "Авіалогістика"], is_active: true },
        { id: "TR-02", from_status: "booking_requested", to_status: "awb_confirmed", required_docs: ["AWB"], role_whitelist: ["Авіалогістика"], is_active: true },
        { id: "TR-03", from_status: "arrived", to_status: "customs_processing", required_docs: ["DSK", "Пакет T1"], role_whitelist: ["Брокер"], is_active: true },
        { id: "TR-04", from_status: "customs_cleared", to_status: "release_ready", required_docs: ["Митна декларація", "Довідка витрат"], role_whitelist: ["Склад", "Фінанси"], is_active: true },
        { id: "TR-05", from_status: "gate_pass", to_status: "released", required_docs: ["Дозвіл на видачу"], role_whitelist: ["Склад"], is_active: true }
      ],
      referenceData: {
        dictionaries: [
          { name: "Термінали", entries: 12, last_updated: "2026-02-01" },
          { name: "Митні пости", entries: 28, last_updated: "2026-01-15" },
          { name: "Перевізники", entries: 45, last_updated: "2026-02-08" },
          { name: "Агенти", entries: 34, last_updated: "2026-02-05" },
          { name: "Типи документів", entries: 18, last_updated: "2026-01-20" },
          { name: "Коди причин", entries: 22, last_updated: "2026-02-03" }
        ]
      }
    },
    errors: []
  },

  // ─── Approvals (SH-09) ───
  approvals: {
    meta: { source: "dummy", version: "poc" },
    data: {
      items: [
        { id: "APR-201", approval_type: "PAYMENT_GATE_OVERRIDE_APPROVAL", case_no: "F1-2026-00139", requested_by: "Лариса П.", requested_at: "2026-02-11 10:00", approver_role: "FINANCE_LEAD", verification_mode: "deep", status: "pending", risk: "high", sla_deadline: "2026-02-11 10:15", sla_state: "breached", request_snapshot: { gate_before: "FAIL", gate_after: "PASS_OVERRIDE", shortfall: "€2,250", reason: "Клієнт надіслав підтвердження банківського переказу" }, checklist: [{ item: "Перевірити банківську виписку", done: true }, { item: "Перевірити відповідність суми і валюти", done: true }, { item: "Перевірити ідентифікацію платника", done: false }, { item: "Підтвердити відсутність дублювання", done: false }] },
        { id: "APR-200", approval_type: "RELEASE_AUTHORIZATION_APPROVAL", case_no: "F1-2026-00142", requested_by: "Віктор Г.", requested_at: "2026-02-11 09:30", approver_role: "WAREHOUSE_LEAD", verification_mode: "standard", status: "pending", risk: "medium", sla_deadline: "2026-02-11 09:45", sla_state: "at_risk", request_snapshot: { release_type: "Самовивіз", client: "ТехІмпорт Україна", pieces: 48, gate_status: "PASS" }, checklist: [] },
        { id: "APR-199", approval_type: "INVOICE_CAPTURE_APPROVAL", case_no: "F1-2026-00140", requested_by: "AI Екстрактор", requested_at: "2026-02-11 08:00", approver_role: "ACCOUNTING", verification_mode: "deep", status: "pending", risk: "medium", sla_deadline: "2026-02-11 08:30", sla_state: "breached", request_snapshot: { doc_type: "Інвойс", confidence: 0.52, conflicting_fields: ["Сума: $12,500 vs $12,050", "Валюта: USD vs EUR"] }, checklist: [{ item: "Перевірити суму на оригіналі", done: false }, { item: "Перевірити валюту платежу", done: false }, { item: "Звірити з контрактом клієнта", done: false }] },
        { id: "APR-198", approval_type: "MEDICAL_COMPLIANCE_APPROVAL", case_no: "F1-2026-00141", requested_by: "Дмитро С.", requested_at: "2026-02-10 16:00", approver_role: "BROKER", verification_mode: "deep", status: "approved", risk: "high", sla_deadline: "2026-02-10 17:00", sla_state: "on_track", decided_at: "2026-02-10 16:45", decided_by: "Дмитро С.", decision: "approved", decision_reason: "Медичні реєстри відповідають, mismatch був у кодуванні", request_snapshot: { product: "Медичне обладнання", mismatch: "Код медичного реєстру не збігається з класифікатором" }, checklist: [{ item: "Перевірити медичний реєстр", done: true }, { item: "Перевірити класифікатор", done: true }, { item: "Порівняти з інвойсом", done: true }] },
        { id: "APR-197", approval_type: "DOC_FINALIZATION_APPROVAL", case_no: "F1-2026-00136", requested_by: "Андрій К.", requested_at: "2026-02-10 14:00", approver_role: "ROAD_LOGISTICS", verification_mode: "standard", status: "approved", risk: "low", sla_deadline: "2026-02-10 14:45", sla_state: "on_track", decided_at: "2026-02-10 14:30", decided_by: "Андрій К.", decision: "approved", decision_reason: "CMR фінальна версія підтверджена", request_snapshot: { doc_type: "CMR", version: "v3", changes: "Оновлено вагу після фактичного зважування" }, checklist: [] },
        { id: "APR-196", approval_type: "FX_DECISION_APPROVAL", case_no: "F1-2026-00138", requested_by: "Система", requested_at: "2026-02-10 12:00", approver_role: "FINANCE", verification_mode: "standard", status: "rejected", risk: "medium", sla_deadline: "2026-02-10 12:30", sla_state: "on_track", decided_at: "2026-02-10 12:20", decided_by: "Лариса П.", decision: "rejected", decision_reason: "Джерело курсу не підтверджене — застосовано дефолтне правило", request_snapshot: { override_source: "Курс агента", default_rule: "НБУ на дату операції", difference: "0.35 UAH/USD" }, checklist: [] }
      ],
      counters: { pending: 3, approved_today: 2, rejected_today: 1, breached_sla: 2 },
      // ─── Approval Detail (demo: APR-201) ───
      detail: {
        id: "APR-201",
        approval_type: "PAYMENT_GATE_OVERRIDE_APPROVAL",
        case_no: "F1-2026-00139",
        client: "МедОблад Ко",
        requested_by: "Лариса П.",
        requested_at: "2026-02-11 10:00",
        approver_role: "FINANCE_LEAD",
        backup_role: "OPS_LEAD",
        verification_mode: "deep",
        status: "pending",
        risk: "high",
        sla_deadline: "2026-02-11 10:15",
        sla_state: "breached",
        request_snapshot: {
          gate_current: "FAIL",
          gate_proposed: "PASS_OVERRIDE",
          expected_total: "€9,000",
          received_total: "€6,750",
          shortfall: "€2,250",
          justification: "Клієнт надіслав підтвердження банківського переказу залишку €2,250. SWIFT отримано, очікується зарахування протягом 24 год."
        },
        linked_context: {
          open_exceptions: ["EX-301 — Платіжний виняток"],
          financial_decisions: ["Gate FAIL з 2026-02-10 17:30"],
          documents: ["SWIFT підтвердження (draft, завантажено 2026-02-11 09:55)"]
        },
        checklist: [
          { item: "Перевірити банківську виписку / SWIFT", done: true, required: true },
          { item: "Перевірити відповідність суми і валюти", done: true, required: true },
          { item: "Перевірити ідентифікацію платника", done: false, required: true },
          { item: "Підтвердити відсутність дублювання оплати", done: false, required: true },
          { item: "Перевірити наявність відкритих винятків", done: true, required: false }
        ],
        decision_history: [
          { ts: "2026-02-11 10:00", actor: "Лариса П.", event: "ApprovalCreated", detail: "Запит ручної зміни БЛОКУВАННЯ → ДОЗВІЛ для F1-2026-00139", correlation_id: "corr-apr-201" },
          { ts: "2026-02-11 10:16", actor: "Система", event: "ApprovalSLABreached", detail: "SLA 15 хв перевищено, нотифікація backup ролі OPS_LEAD", correlation_id: "corr-apr-201" }
        ]
      },
      // ─── Approval Dashboard (SH-08 extension) ───
      dashboard: {
        pending_by_type: [
          { type: "PAYMENT_GATE_OVERRIDE_APPROVAL", count: 1 },
          { type: "RELEASE_AUTHORIZATION_APPROVAL", count: 1 },
          { type: "INVOICE_CAPTURE_APPROVAL", count: 1 },
          { type: "MEDICAL_COMPLIANCE_APPROVAL", count: 0 },
          { type: "FX_DECISION_APPROVAL", count: 0 },
          { type: "DOC_FINALIZATION_APPROVAL", count: 0 }
        ],
        pending_by_role: [
          { role: "FINANCE_LEAD", count: 1 },
          { role: "WAREHOUSE_LEAD", count: 1 },
          { role: "ACCOUNTING", count: 1 },
          { role: "BROKER", count: 0 },
          { role: "FINANCE", count: 0 }
        ],
        breached_sla_count: 2,
        median_time_to_decision_min: 18,
        approve_reject_ratio: { approved: 67, rejected: 33 },
        deep_coverage_rate: "60%",
        spot_check_rate: "15%"
      }
    },
    errors: []
  },

  // ─── P0: Внутрішні передачі (SH-10) ───
  handoverBoard: {
    meta: { source: "dummy", version: "poc" },
    data: {
      counters: { pending_ack: 5, at_risk: 2, breached: 1, total_today: 14 },
      channel_split: { internal: 9, external: 3, mixed: 2 },
      health: { system_managed_rate: "78%", manual_fallback_rate: "14%", failed_count: 2, avg_ack_minutes: 18 },
      manual_fallback_alerts: [
        { case_no: "F1-2026-00141", from_role: "Broker", to_role: "Road Logistics", reason: "Системний канал недоступний — мережева помилка", fallback_at: "2026-02-11 08:30" },
        { case_no: "F1-2026-00138", from_role: "Air Logistics", to_role: "Broker", reason: "Документ потребує ручної верифікації перед передачею", fallback_at: "2026-02-10 16:00" }
      ],
      items: [
        { case_no: "F1-2026-00142", step_code: "HO-AIR-BRK", from_role: "Air Logistics", to_role: "Broker", channel_code: "CH-INT-01", channel_type: "system-managed", status: "received", sla_state: "on_track", evidence_ref: "EVD-142-01", evidence_source: "mayan", evidence_detail: "MYN-DOC-3301 v2", happened_at: "2026-02-10 14:20" },
        { case_no: "F1-2026-00142", step_code: "HO-BRK-ROAD", from_role: "Broker", to_role: "Road Logistics", channel_code: "CH-INT-02", channel_type: "system-managed", status: "sent", sla_state: "on_track", evidence_ref: "EVD-142-02", evidence_source: "mayan", evidence_detail: "MYN-DOC-3302 v1", happened_at: "2026-02-11 09:14" },
        { case_no: "F1-2026-00141", step_code: "HO-BRK-ROAD", from_role: "Broker", to_role: "Road Logistics", channel_code: "CH-MAN-01", channel_type: "external", status: "sent", sla_state: "at_risk", evidence_ref: null, evidence_source: "zammad", evidence_detail: "ZMD-ART-5480 (fallback email)", happened_at: "2026-02-11 08:30" },
        { case_no: "F1-2026-00140", step_code: "HO-AIR-BRK", from_role: "Air Logistics", to_role: "Broker", channel_code: "CH-INT-03", channel_type: "system-managed", status: "planned", sla_state: "on_track", evidence_ref: null, happened_at: "2026-02-11 07:30" },
        { case_no: "F1-2026-00139", step_code: "HO-FIN-ACC", from_role: "Finance", to_role: "Accounting", channel_code: "CH-INT-04", channel_type: "system-managed", status: "received", sla_state: "on_track", evidence_ref: "EVD-139-01", happened_at: "2026-02-10 17:30" },
        { case_no: "F1-2026-00138", step_code: "HO-AIR-BRK", from_role: "Air Logistics", to_role: "Broker", channel_code: "CH-MAN-02", channel_type: "external", status: "failed", sla_state: "breached", evidence_ref: null, happened_at: "2026-02-10 16:00" },
        { case_no: "F1-2026-00136", step_code: "HO-ROAD-WH", from_role: "Road Logistics", to_role: "Warehouse", channel_code: "CH-INT-05", channel_type: "system-managed", status: "received", sla_state: "on_track", evidence_ref: "EVD-136-01", happened_at: "2026-02-10 14:00" },
        { case_no: "F1-2026-00135", step_code: "HO-ACC-FIN", from_role: "Accounting", to_role: "Finance", channel_code: "CH-INT-06", channel_type: "system-managed", status: "sent", sla_state: "on_track", evidence_ref: "EVD-135-01", happened_at: "2026-02-10 11:00" }
      ],
      failed_reasons: [
        { case_no: "F1-2026-00138", reason: "Документ відхилено отримувачем — невідповідність версії", failed_at: "2026-02-10 16:30", task_created: "T-1210" }
      ]
    },
    errors: []
  },

  // ─── P0: Єдиний ввід бухгалтерських даних (SH-11) ───
  accountingSingleEntry: {
    meta: {
      document_path: "shared/SH-11_accounting_single_entry_console.md",
      screen_id: "SH-11_accounting_single_entry_console",
      primary_route: "/api/v1/accounting/work-queue?mode=single-entry",
      primary_event: "SingleEntryCaptured",
      updated_at: "2026-02-12T09:00:00Z"
    },
    data: {
      counters: {
        coverage_rate: "82%",
        override_count: 4,
        conflict_queue: 3,
        ready_to_sync: 12,
        triple_upload_eliminated_rate: "67%",
        total_entries_today: 19,
        auto_captured: 15
      },
      items: [
        { case_no: "F1-2026-00142", document_ref: "INV-2026-0142", field_group: "invoice", entry_mode: "single_entry", source_ref: "OCR-AWB-142", conflict_status: "none", last_updated_by: "Система (AI)", updated_at: "2026-02-11 09:00", sync_status: "ready" },
        { case_no: "F1-2026-00142", document_ref: "CC-2026-0142", field_group: "cost_certificate", entry_mode: "single_entry", source_ref: "INV-2026-0142", conflict_status: "none", last_updated_by: "Тетяна В.", updated_at: "2026-02-11 10:30", sync_status: "ready" },
        { case_no: "F1-2026-00141", document_ref: "INV-2026-0141", field_group: "invoice", entry_mode: "manual_override", source_ref: "MANUAL-Тетяна", conflict_status: "open", last_updated_by: "Тетяна В.", updated_at: "2026-02-11 08:45", sync_status: "blocked" },
        { case_no: "F1-2026-00139", document_ref: "INV-2026-0139", field_group: "counterparty", entry_mode: "single_entry", source_ref: "1C-SYNC-139", conflict_status: "resolved", last_updated_by: "Система (1С)", updated_at: "2026-02-10 17:30", sync_status: "synced" },
        { case_no: "F1-2026-00138", document_ref: "CC-2026-0138", field_group: "cost_certificate", entry_mode: "single_entry", source_ref: "OCR-CMR-138", conflict_status: "open", last_updated_by: "Система (AI)", updated_at: "2026-02-10 16:50", sync_status: "blocked" },
        { case_no: "F1-2026-00137", document_ref: "INV-2026-0137", field_group: "invoice", entry_mode: "single_entry", source_ref: "OCR-INV-137", conflict_status: "none", last_updated_by: "Система (AI)", updated_at: "2026-02-10 15:20", sync_status: "ready" },
        { case_no: "F1-2026-00136", document_ref: "INV-2026-0136", field_group: "invoice", entry_mode: "manual_override", source_ref: "MANUAL-Лариса", conflict_status: "overridden", last_updated_by: "Лариса П.", updated_at: "2026-02-10 14:00", sync_status: "synced" },
        { case_no: "F1-2026-00135", document_ref: "CC-2026-0135", field_group: "cost_certificate", entry_mode: "single_entry", source_ref: "OCR-CMR-135", conflict_status: "none", last_updated_by: "Система (AI)", updated_at: "2026-02-10 11:40", sync_status: "ready" },
        { case_no: "F1-2026-00134", document_ref: "INV-2026-0134", field_group: "invoice", entry_mode: "single_entry", source_ref: "OCR-INV-134", conflict_status: "none", last_updated_by: "Система (AI)", updated_at: "2026-02-10 10:15", sync_status: "synced" },
        { case_no: "F1-2026-00133", document_ref: "INV-2026-0133", field_group: "counterparty", entry_mode: "manual_override", source_ref: "MANUAL-Тетяна", conflict_status: "overridden", last_updated_by: "Тетяна В.", updated_at: "2026-02-09 17:00", sync_status: "synced" }
      ],
      conflicts: [
        { case_no: "F1-2026-00141", field_group: "invoice", field: "Сума (EUR)", existing_value: "€8,200", new_value: "€8,450", source_ref: "OCR-CMR-141", detected_at: "2026-02-11 08:40", impact: "Різниця €250 — вплив на рахунок клієнту та довідку витрат. Потребує звірки з оригіналом інвойсу." },
        { case_no: "F1-2026-00138", field_group: "cost_certificate", field: "Курс USD/UAH", existing_value: "41.20", new_value: "41.35", source_ref: "НБУ-2026-02-10", detected_at: "2026-02-10 16:45", impact: "Курс НБУ оновився. Різниця 0.15 грн/USD — вплив на розрахунок витрат у гривні." },
        { case_no: "F1-2026-00141", field_group: "counterparty", field: "ЄДРПОУ", existing_value: "12345678", new_value: "12345679", source_ref: "1C-SYNC-141", detected_at: "2026-02-11 08:42", impact: "Розбіжність ЄДРПОУ з 1С. Можлива помилка OCR при розпізнаванні документа. Критично для податкових документів." }
      ],
      audit_trail: [
        { timestamp: "2026-02-11 10:30", actor: "Тетяна В.", action: "capture", detail: "Зафіксовано довідку витрат CC-2026-0142 з даних інвойсу INV-2026-0142", case_no: "F1-2026-00142", reason_code: null },
        { timestamp: "2026-02-11 09:15", actor: "Система (AI)", action: "auto_capture", detail: "Автозахоплення реквізитів інвойсу з OCR-AWB-142 (довірчість: 97%)", case_no: "F1-2026-00142", reason_code: null },
        { timestamp: "2026-02-11 08:45", actor: "Тетяна В.", action: "override", detail: "Ручне перевизначення суми інвойсу: €8,200 → €8,450. Причина: «Сума в оригіналі відрізняється від OCR»", case_no: "F1-2026-00141", reason_code: "ocr_mismatch" },
        { timestamp: "2026-02-10 17:30", actor: "Система (1С)", action: "sync_complete", detail: "Синхронізацію з 1С завершено для контрагента INV-2026-0139. Статус: ОК.", case_no: "F1-2026-00139", reason_code: null },
        { timestamp: "2026-02-10 16:50", actor: "Система (AI)", action: "conflict_detected", detail: "Курс USD/UAH у довідці (41.20) не збігається з курсом НБУ (41.35). Створено конфлікт.", case_no: "F1-2026-00138", reason_code: "rate_mismatch" },
        { timestamp: "2026-02-10 15:20", actor: "Система (AI)", action: "auto_capture", detail: "Автозахоплення інвойсу OCR-INV-137 (довірчість: 99%)", case_no: "F1-2026-00137", reason_code: null },
        { timestamp: "2026-02-10 14:00", actor: "Лариса П.", action: "override", detail: "Ручне перевизначення поля «Номер інвойсу». Причина: «Коректний номер з email клієнта»", case_no: "F1-2026-00136", reason_code: "client_correction" },
        { timestamp: "2026-02-10 13:45", actor: "Система", action: "sync_batch", detail: "Пакетна синхронізація 8 записів з 1С. Успішно: 8, помилок: 0.", case_no: null, reason_code: null }
      ],
      ready_to_sync_items: [
        { case_no: "F1-2026-00142", document_ref: "INV-2026-0142", field_group: "invoice", fields_count: 6, all_fields_valid: true, last_check: "2026-02-11 11:00" },
        { case_no: "F1-2026-00142", document_ref: "CC-2026-0142", field_group: "cost_certificate", fields_count: 8, all_fields_valid: true, last_check: "2026-02-11 11:00" },
        { case_no: "F1-2026-00137", document_ref: "INV-2026-0137", field_group: "invoice", fields_count: 6, all_fields_valid: true, last_check: "2026-02-10 16:00" },
        { case_no: "F1-2026-00135", document_ref: "CC-2026-0135", field_group: "cost_certificate", fields_count: 8, all_fields_valid: true, last_check: "2026-02-10 12:00" }
      ]
    },
    errors: []
  },

  // ─── Експедитор (EX-01..EX-04) ───
  expeditor: {
    meta: { source: "dummy", version: "poc" },
    data: {
      workspace: {
        queues: {
          arrival_notices: 3,
          terminal_submission: 2,
          mrn_pending: 2,
          handover_to_road: 4
        },
        widgets: {
          active_terminal_tasks: 7,
          arrival_mismatch_alerts: 1,
          pending_mrn_by_sla: [
            { case_no: "F1-2026-00142", sla_state: "on_track", due_at: "2026-02-12 16:00" },
            { case_no: "F1-2026-00141", sla_state: "at_risk", due_at: "2026-02-11 23:00" }
          ],
          sealed_required_cases: 2
        },
        handover_to_road_sla: [
          { case_no: "F1-2026-00142", to_role: "Road Logistics", sla_state: "on_track", due_at: "2026-02-12 18:00", status: "planned" },
          { case_no: "F1-2026-00141", to_role: "Road Logistics", sla_state: "at_risk", due_at: "2026-02-11 22:00", status: "sent" },
          { case_no: "F1-2026-00140", to_role: "Road Logistics", sla_state: "on_track", due_at: "2026-02-13 10:00", status: "planned" },
          { case_no: "F1-2026-00138", to_role: "Road Logistics", sla_state: "breached", due_at: "2026-02-10 18:00", status: "failed" }
        ]
      },
      arrivalCheckin: {
        case_no: "F1-2026-00142",
        arrival_notice_ref: "DSK-KBP-2026-0142",
        expected_weight_kg: 1240,
        expected_pieces: 48,
        actual_weight_kg: 1238,
        actual_pieces: 48,
        arrival_time: "2026-02-10 11:00",
        has_mismatch: false,
        packet_docs: [
          { doc: "Arrival Notice (ДСК)", status: "received" },
          { doc: "Інвойс", status: "received" },
          { doc: "Пакувальний лист", status: "received" },
          { doc: "Копія AWB", status: "received" }
        ],
        checklist: [
          { item: "ДСК отримано та перевірено", done: true },
          { item: "Фактичну вагу зважено", done: true },
          { item: "Кількість місць перераховано", done: true },
          { item: "Розбіжності перевірено", done: true },
          { item: "Пакет документів готовий до передачі", done: false }
        ]
      },
      terminalSubmission: {
        case_no: "F1-2026-00142",
        transit_packet_from_broker: "T1-PKT-142",
        submission_status: "submitted",
        evidence_files: [
          { name: "terminal_stamp_142.pdf", uploaded_at: "2026-02-11 10:00" },
          { name: "customs_receipt_142.jpg", uploaded_at: "2026-02-11 10:05" }
        ],
        sealed_event: {
          recorded: true,
          sealed_at: "2026-02-11 10:30",
          seal_number: "PL-SEAL-2026-00891",
          evidence_photo: "sealed_142.jpg"
        },
        mrn: {
          value: null,
          format_valid: null,
          status: "pending"
        }
      },
      handoverBoard: {
        case_no: "F1-2026-00142",
        matrix: [
          { from_role: "Broker", to_role: "Expeditor", status: "acknowledged", prerequisites_met: true, sla_state: "on_track" },
          { from_role: "Expeditor", to_role: "Road Logistics", status: "pending", prerequisites_met: false, sla_state: "on_track" }
        ],
        prerequisites: [
          { item: "Пакет документів від брокера отримано", done: true },
          { item: "Arrival check-in завершено", done: true },
          { item: "Terminal submission виконано", done: true },
          { item: "Sealed event зафіксовано", done: true },
          { item: "MRN отримано та підтверджено", done: false },
          { item: "Критичних розбіжностей немає", done: true }
        ],
        blockers: ["MRN ще не отримано"]
      }
    },
    errors: []
  },

  // ─── P0 Efficiency Metrics (SH-08 extension) ───
  p0Efficiency: {
    meta: { source: "dummy", version: "poc" },
    data: {
      handover_metrics: {
        system_managed_rate: "78%",
        manual_fallback_rate: "14%",
        avg_ack_time_minutes: 18,
        failed_delivery_rate: "3.2%",
        breached_sla_count: 1
      },
      single_entry_metrics: {
        coverage_rate: "82%",
        override_rate: "9.5%",
        conflict_rate: "4.8%",
        sync_readiness_rate: "76%",
        mean_resolution_minutes: 35
      }
    },
    errors: []
  },

  // ─── Міжрольові сценарії ───
  flows: {
    meta: { source: "dummy", version: "poc" },
    data: {
      happyPath: {
        case_no: "F1-2026-00134",
        client: "Будмат Плюс",
        steps: [
          { step: 1, role: "Продажі", action: "Створення кейсу та завантаження документів", status: "completed", page: "#/roles/sales/workspace" },
          { step: 2, role: "Авіалогістика", action: "Букінг та підтвердження AWB", status: "completed", page: "#/roles/air-logistics/booking" },
          { step: 3, role: "Авіалогістика", action: "Відправка попереднього сповіщення", status: "completed", page: "#/roles/air-logistics/prealert" },
          { step: 4, role: "Брокер", action: "T1 підготовка, LRN/MRN", status: "completed", page: "#/roles/broker/transit" },
          { step: 5, role: "Автологістика", action: "Планування авто та супровід кордону", status: "completed", page: "#/roles/road-logistics/truck-planning" },
          { step: 6, role: "Брокер", action: "Митне оформлення", status: "completed", page: "#/roles/broker/clearance" },
          { step: 7, role: "Бухгалтерія", action: "Довідка витрат та рахунки", status: "completed", page: "#/roles/accounting/cost-cert" },
          { step: 8, role: "Фінанси", action: "Рознесення оплати → Шлюз ДОЗВІЛ", status: "completed", page: "#/roles/finance/gate" },
          { step: 9, role: "Склад", action: "Видача / відправка", status: "completed", page: "#/roles/warehouse/release" },
          { step: 10, role: "Система", action: "Фінальний статус: Завершено", status: "completed", page: "#/shared/cases" }
        ]
      },
      partialArrival: {
        case_no: "F1-2026-00136",
        trigger: "Прибуло 38 з 48 місць",
        steps: [
          { step: 1, role: "Авіалогістика", action: "Фіксація винятку часткового прибуття", status: "completed" },
          { step: 2, role: "Система", action: "Кейс → частковий стан", status: "completed" },
          { step: 3, role: "Автологістика", action: "Планування вивозу фактичної частини", status: "completed" },
          { step: 4, role: "Продажі", action: "Повідомлення клієнту", status: "completed" },
          { step: 5, role: "Авіалогістика", action: "Відстеження решти вантажу", status: "completed" },
          { step: 6, role: "Система", action: "Виняток закрито після повного прибуття", status: "completed" }
        ],
        arrived_part: { pieces: 38, weight_kg: 980 },
        pending_part: { pieces: 10, weight_kg: 260, eta: "2026-02-12" }
      },
      weightMismatch: {
        case_no: "F1-2026-00141",
        trigger: "CMR 2450 кг / AWB 2380 кг / Інвойс 2400 кг",
        steps: [
          { step: 1, role: "Брокер", action: "Відкриття винятку розбіжності ваги", status: "completed" },
          { step: 2, role: "Система", action: "Порівняння документів поруч", status: "completed" },
          { step: 3, role: "Авіалогістика", action: "Запит коригуючого AWB", status: "in_progress" },
          { step: 4, role: "Брокер", action: "Повторна перевірка після нової версії", status: "pending" },
          { step: 5, role: "Система", action: "Виняток вирішено, блокування знято", status: "pending" }
        ]
      },
      paymentException: {
        case_no: "F1-2026-00139",
        trigger: "Отримано 75% оплати (€6,750 з €9,000)",
        steps: [
          { step: 1, role: "Фінанси", action: "Фіксація платіжного винятку", status: "completed" },
          { step: 2, role: "Фінанси", action: "Шлюз → БЛОКУВАННЯ", status: "completed" },
          { step: 3, role: "Склад", action: "Видача заблокована", status: "completed" },
          { step: 4, role: "Продажі", action: "Повідомлення клієнту", status: "in_progress" },
          { step: 5, role: "Фінанси", action: "Переоцінка шлюзу після доплати", status: "pending" },
          { step: 6, role: "FINANCE_LEAD", action: "Ручна зміна платіжного шлюзу (поглиблена верифікація)", status: "pending" },
          { step: 7, role: "Фінанси", action: "Шлюз ДОЗВІЛ після підтвердженої оплати або затвердженої ручної зміни", status: "pending" }
        ],
        breakdown: {
          expected: 9000.00,
          received: 6750.00,
          shortfall: 2250.00,
          currency: "EUR"
        }
      },
      customsHold: {
        case_no: "F1-2026-00138",
        trigger: "Митний огляд ініційовано",
        steps: [
          { step: 1, role: "Брокер", action: "Відкриття винятку митного утримання", status: "completed" },
          { step: 2, role: "Система", action: "Кризовий SLA активовано (4 год)", status: "completed" },
          { step: 3, role: "Продажі", action: "Комунікація з клієнтом", status: "in_progress" },
          { step: 4, role: "Брокер", action: "Надання додаткових документів", status: "in_progress" },
          { step: 5, role: "Брокер", action: "Оновлення статусу декларації", status: "pending" },
          { step: 6, role: "OPS_LEAD", action: "Закриття винятку через затвердження керівника", status: "pending" },
          { step: 7, role: "Система", action: "Після затвердження виняток → закрито", status: "pending" }
        ],
        hold_since: "2026-02-09 14:00",
        elapsed_hours: 43,
        evidence_checklist: [
          { item: "Сертифікат походження", provided: true },
          { item: "Технічна документація", provided: true },
          { item: "Результати лабораторних тестів", provided: false },
          { item: "Декларація виробника", provided: false }
        ]
      }
    },
    errors: []
  }
};
