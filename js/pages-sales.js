/* =====================================================
   Продажі Pages: SA-01..SA-04
   ===================================================== */

// ─── SA-04 Communication State & Helpers ───
window._sa04_scenario = window._sa04_scenario || 'happy_path';
window._sa04_selected_thread = typeof window._sa04_selected_thread === 'number' ? window._sa04_selected_thread : 0;
window._sa04_composer_mode = window._sa04_composer_mode || 'external';
window._sa04_demo_articles = window._sa04_demo_articles || [];
window._sa04_demo_commitments = window._sa04_demo_commitments || [];

function sa04SetScenario(key) {
  window._sa04_scenario = key;
  window._sa04_selected_thread = 0;
  window._sa04_composer_mode = 'external';
  window._sa04_demo_articles = [];
  window._sa04_demo_commitments = [];
  handleRoute();
}

function sa04SelectThread(idx) {
  window._sa04_selected_thread = idx;
  handleRoute();
}

function sa04SetComposerMode(mode) {
  window._sa04_composer_mode = mode;
  handleRoute();
}

function sa04GetData() {
  var comm = DATA.sales.data.communication;
  var key = window._sa04_scenario || 'happy_path';
  var scenario = comm.scenarios[key] || comm.scenarios.happy_path;
  var d = {};
  for (var k in comm.base) { if (comm.base.hasOwnProperty(k)) d[k] = comm.base[k]; }
  if (scenario.overrides) {
    for (var k in scenario.overrides) { if (scenario.overrides.hasOwnProperty(k)) d[k] = scenario.overrides[k]; }
  }
  return { d: d, scenario: scenario, scenarioKey: key, scenarios: comm.scenarios };
}

function sa04SendDemo() {
  var mode = window._sa04_composer_mode;
  var textarea = document.getElementById('sa04-composer-text');
  var text = textarea ? textarea.value : '';
  if (!text.trim()) { alert('Введіть текст повідомлення'); return; }
  var now = new Date();
  var ts = now.toISOString().replace('T', ' ').substring(0, 16);
  window._sa04_demo_articles.push({
    article_id: 'ART-DEMO-' + now.getTime(),
    direction: 'outbound',
    visibility: mode === 'external' ? 'external' : 'internal',
    channel: mode === 'external' ? 'email' : 'note',
    actor: 'Оксана М. (Sales)',
    summary: text,
    timestamp: ts,
    attachment_refs: [],
    demo_new: true
  });
  handleRoute();
}

function sa04PinCommitment() {
  var textarea = document.getElementById('sa04-commitment-text');
  var text = textarea ? textarea.value : '';
  if (!text.trim()) return;
  var now = new Date();
  var ts = now.toISOString().replace('T', ' ').substring(0, 16);
  window._sa04_demo_commitments.push({
    id: 'CMT-DEMO-' + now.getTime(),
    text: text,
    pinned_by: 'Оксана М.',
    pinned_at: ts,
    status: 'open',
    demo_new: true
  });
  closeModal('sa04-commitment');
  handleRoute();
}

function sa04CreateFollowUp() {
  closeModal('sa04-followup');
  // Demo: show toast-like banner
  window._sa04_followup_created = true;
  handleRoute();
}

function sa04LinkThread() {
  // Demo: simulate linking unlinked thread to a case
  window._sa04_scenario = 'happy_path';
  window._sa04_selected_thread = 0;
  handleRoute();
}

function sa04RetrySync() {
  // Demo: simulate retry → switch to happy path
  window._sa04_scenario = 'happy_path';
  handleRoute();
}

// ─── SA-02 Wizard State & Helpers ───
window._sa02_step = typeof window._sa02_step === 'number' ? window._sa02_step : 0;
window._sa02_scenario = window._sa02_scenario || 'happy_path';

function sa02GoToStep(idx) {
  window._sa02_step = idx;
  handleRoute();
}

function sa02SetScenario(key) {
  window._sa02_scenario = key;
  window._sa02_step = 0;
  handleRoute();
}

function sa02GetData() {
  var qw = DATA.sales.data.quote_wizard;
  var key = window._sa02_scenario || 'happy_path';
  var scenario = qw.scenarios[key] || qw.scenarios.happy_path;
  var d = {};
  for (var k in qw.base) { if (qw.base.hasOwnProperty(k)) d[k] = qw.base[k]; }
  if (scenario.overrides) {
    for (var k in scenario.overrides) { if (scenario.overrides.hasOwnProperty(k)) d[k] = scenario.overrides[k]; }
  }
  return { d: d, scenario: scenario, scenarioKey: key, timeline: qw.timeline, scenarios: qw.scenarios };
}

registerPages({

  // ─── SA-01 Робочий простір продажів ───
  '#/roles/sales/workspace': function() {
    const d = DATA.sales.data.workspace;
    const kpi = d.kpi;
    return C.pageHeader('Робочий простір продажів', 'SA-01 — Огляд продажів та управління клієнтами') +
      C.heroNotice('Робочий простір продажів',
        '<strong>Для менеджера з продажів (25 осіб).</strong> Це ваша єдина точка входу для роботи із запитами, прорахунками та активними кейсами. Черги автоматично пріоритезують роботу: зверху — елементи з блокерами та порушеннями SLA.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> ви моніторили запити в розрізнених email-ланцюгах, Excel і месенджерах. Статуси прорахунків уточнювали вручну, пріоритети не формалізовані, SLA не контролювався. Для передачі кейсу логістам — складали лист з вкладеннями та пересилали вручну.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> усі запити клієнтів, прорахунки та кейси в одному місці з автоматичним SLA-контролем. Кнопка «Дошка передач» дозволяє передати кейс логістиці з повним чеклістом (документи, контакти, інвойс). Ви бачите стан оплати через badge платіжного шлюзу без ручних запитів до фінансів (TC-MS-03).') +

      // ─── Navigation cards ───
      C.section('Навігація') +
      `<div class="card-grid">
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/sales/quote')">
          <div style="font-weight:600; margin-bottom:4px;">📝 Створити прорахунок / кейс</div>
          <div class="text-sm text-secondary">SA-02 — Майстер створення прорахунку та кейсу</div>
        </div>
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/sales/documents')">
          <div style="font-weight:600; margin-bottom:4px;">📁 Документи клієнта</div>
          <div class="text-sm text-secondary">SA-03 — Управління базовими документами клієнта</div>
        </div>
        <div class="card" style="cursor:pointer;" onclick="navigate('#/roles/sales/communication')">
          <div style="font-weight:600; margin-bottom:4px;">💬 Комунікація з клієнтом</div>
          <div class="text-sm text-secondary">SA-04 — Контекстні повідомлення по кейсах</div>
        </div>
      </div>` +

      // ─── Queue counters ───
      C.statCards([
        { value: d.queues.new_inquiries, label: 'Нові запити', color: 'accent' },
        { value: d.queues.quotes_pending, label: 'Прорахунки в очікуванні', color: 'warning' },
        { value: d.queues.awaiting_docs, label: 'Очікуються документи', color: '' },
        { value: d.queues.active_cases, label: 'Активні кейси', color: 'accent' },
      ]) +

      // ─── KPI (операційні) ───
      C.section('Операційні KPI') +
      C.statStrip([
        { value: kpi.response_time_to_client_hours + ' год', label: 'Медіана відповіді клієнту', color: 'accent' },
        { value: Math.round(kpi.request_completeness_rate * 100) + '%', label: 'Повнота запитів', color: kpi.request_completeness_rate >= 0.9 ? 'accent' : 'warning' },
        { value: kpi.stalled_confirmations_count, label: 'Завислих підтверджень', color: kpi.stalled_confirmations_count > 3 ? 'danger' : 'accent' }
      ]) +

      // ─── Recent quotes table (з SLA та blockers) ───
      C.section('Останні прорахунки') +
      C.table(
        ['№ прорахунку', 'Клієнт', 'Маршрут', 'Вага', 'Статус', 'SLA', 'Blocker', 'Створено'],
        d.recent_quotes
          .slice()
          .sort(function(a, b) {
            // Пріоритезація: blocker-и вище, потім breached > at_risk > on_track, потім старіші раніше
            var blockerA = a.blocker ? 1 : 0;
            var blockerB = b.blocker ? 1 : 0;
            if (blockerB !== blockerA) return blockerB - blockerA;
            var slaOrder = { breached: 3, at_risk: 2, on_track: 1 };
            var slaA = slaOrder[a.sla] || 0;
            var slaB = slaOrder[b.sla] || 0;
            if (slaB !== slaA) return slaB - slaA;
            return a.created < b.created ? -1 : 1;
          })
          .map(function(q) { return [
            '<span class="font-mono">' + q.id + '</span>', q.client, q.route,
            q.weight, C.statusBadge(q.status), C.slaBadge(q.sla),
            q.blocker
              ? '<span class="badge-severity high" style="font-size:11px;">' + q.blocker + '</span>'
              : '<span class="text-muted">—</span>',
            q.created
          ]; })
      ) +

      // ─── P0: Handover readiness widget ───
      C.section('P0: Готовність передач (2.3)') +
      C.widget('Готовність передач', `
        <div class="doc-meta-row"><span class="doc-meta-label">Кейси готові до handover</span><span class="doc-meta-value font-bold">3</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Очікують документів</span><span class="doc-meta-value text-warning">2</span></div>
        <div class="doc-meta-row"><span class="doc-meta-label">Single-entry статус (read-only)</span><span class="doc-meta-value">${C.singleEntrySourceBadge('single_entry')} — 82% покриття</span></div>
      `, C.btn('Дошка передач →', 'btn-sm btn-primary', 'onclick="navigate(\'#/shared/handover-board\')"')) +

      // ─── Quick actions (з навігацією) ───
      C.actionBar('Швидкі дії', [
        { label: 'Новий прорахунок', cls: 'btn-primary', onclick: "navigate('#/roles/sales/quote')" },
        { label: 'Переглянути всі кейси', cls: 'btn-secondary', onclick: "navigate('#/shared/cases')" },
      ]) +

      // ─── Пріоритезація і правила сортування (демо-пояснення) ───
      C.section('Правила пріоритезації (демо)') +
      `<div class="card" style="border-left:3px solid var(--accent);">
        <ol style="margin:0; padding-left:18px; font-size:13px; line-height:1.7;">
          <li>Елементи з <strong>blocker-ами</strong> (відсутні обов'язкові документи/дані) — вище за звичайні.</li>
          <li>Елементи <span class="badge-sla breached" style="font-size:11px;">Порушено</span> / <span class="badge-sla at-risk" style="font-size:11px;">Під ризиком</span> — вище за <span class="badge-sla on-track" style="font-size:11px;">В нормі</span>.</li>
          <li>Старіші записи обробляються раніше в межах однакового пріоритету.</li>
          <li>Нові запити мають пріоритет вищий за повторні зміни в активних кейсах.</li>
        </ol>
      </div>` +

      // ─── Edge cases (демо) ───
      C.section('Крайні випадки (демо)') +
      `<div class="card-grid">
        <div class="card" style="border-left:3px solid #e8a735;">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Черги завантажено, таблиця — помилка</div>
          <div class="text-sm text-secondary">Counters відображаються нормально. Таблиця показує error-banner із кнопкою «Повторити».</div>
        </div>
        <div class="card" style="border-left:3px solid #e8a735;">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Таблиця завантажена, черги — помилка</div>
          <div class="text-sm text-secondary">Таблиця відображається. Summary-зона показує «Часткові дані — зверніть увагу».</div>
        </div>
        <div class="card" style="border-left:3px solid #e8a735;">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Порожній стан</div>
          <div class="text-sm text-secondary">Немає прорахунків / черги пусті → CTA: «Новий прорахунок».</div>
        </div>
        <div class="card" style="border-left:3px solid #d04040;">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Кейс архівовано/скасовано між кліками</div>
          <div class="text-sm text-secondary">При відкритті → пояснення та редірект на список кейсів.</div>
        </div>
        <div class="card" style="border-left:3px solid #d04040;">
          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">Неповні дані запиту</div>
          <div class="text-sm text-secondary">Елемент залишається у черзі з явним індикатором blocker.</div>
        </div>
      </div>`;
  },

  // ─── SA-02 Створити прорахунок / кейс (Покроковий Wizard) ───
  '#/roles/sales/quote': function() {
    var wd = sa02GetData();
    var d = wd.d;
    var scenario = wd.scenario;
    var step = window._sa02_step || 0;
    var cargo = d.cargo;
    var ins = d.insurance;
    var blockers = d.validation_blockers || [];
    var warnings = d.validation_warnings || [];
    var stepBlockers = blockers.filter(function(b) { return b.step === step; });
    var hasBlockersOnStep = stepBlockers.length > 0;
    var hasAnyBlockers = blockers.length > 0;

    var STEP_NAMES = ['Клієнт і контакти', 'Параметри вантажу', 'Маршрут та Incoterms', 'Ризики', 'Перегляд та створення'];
    var currentStatusObj = (d.status_model || []).find(function(s) { return s.status === d.quote_status; }) || { label: d.quote_status, description: '' };

    // ── Helper: інтерактивна прогрес-панель ──
    function renderStepsNav() {
      return '<div class="steps">' + STEP_NAMES.map(function(name, i) {
        var cls = i < step ? 'completed' : (i === step ? 'active' : '');
        var clickAttr = i !== step ? ' onclick="sa02GoToStep(' + i + ')" style="cursor:pointer;" title="Перейти до кроку ' + (i + 1) + '"' : '';
        return '<div class="step ' + cls + '"' + clickAttr + '>' +
          '<span class="step-dot"></span>' +
          '<span class="step-label">' + name + '</span>' +
        '</div>';
      }).join('') + '</div>';
    }

    // ── Helper: футер навігації по кроках ──
    function renderStepFooter() {
      var isFirst = step === 0;
      var isLast = step === 4;
      var canProceed = !hasBlockersOnStep;
      var canCreate = isLast && d.selected_agent_rate_id && !hasAnyBlockers;

      var buttons = [];
      if (!isFirst) {
        buttons.push({ label: '← Назад', cls: 'btn-secondary', onclick: "sa02GoToStep(" + (step - 1) + ")" });
      }
      buttons.push({ label: 'Зберегти чернетку', cls: 'btn-ghost' });
      if (!isLast) {
        if (canProceed) {
          buttons.push({ label: 'Далі →', cls: 'btn-primary', onclick: "sa02GoToStep(" + (step + 1) + ")" });
        } else {
          buttons.push({ label: 'Далі →', cls: 'btn-primary', disabled: true });
        }
      } else {
        buttons.push({ label: 'Підтвердити й створити кейс', cls: 'btn-primary', disabled: !canCreate });
      }
      return C.actionBar('Крок ' + (step + 1) + ' з 5 — ' + STEP_NAMES[step], buttons);
    }

    // ── Helper: блокуючі помилки (summary) ──
    function renderBlockersSummary() {
      if (blockers.length === 0) return '';
      return '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
        '<div class="notice-title" style="color:var(--danger);">Блокуючі помилки (' + blockers.length + ')</div>' +
        blockers.map(function(b) {
          return '<p style="margin:4px 0;">' +
            '<span class="font-mono text-sm" style="color:var(--danger);">[' + b.code + ']</span> ' + b.message +
            (b.step !== undefined ? ' <span class="text-muted text-sm">(крок ' + (b.step + 1) + ': ' + STEP_NAMES[b.step] + ')</span>' : '') +
          '</p>';
        }).join('') +
      '</div>';
    }

    // ── Helper: попередження (non-blocking) ──
    function renderWarnings() {
      if (warnings.length === 0) return '';
      return '<div class="notice" style="border-left:3px solid #e8a735; background:#fef9ee;">' +
        '<div class="notice-title">Попередження валідації</div>' +
        warnings.map(function(w) {
          return '<p style="margin:4px 0;"><span class="font-mono text-sm" style="color:#b07d12;">[' + w.code + ']</span> ' + w.message + '</p>';
        }).join('') +
      '</div>';
    }

    // ── Helper: перемикач демо-сценаріїв ──
    function renderScenarioSwitcher() {
      var html = '<div class="card" style="border:1px dashed var(--accent); background:var(--surface-secondary); padding:8px 12px;">' +
        '<div style="font-weight:600; font-size:12px; margin-bottom:6px; color:var(--accent);">Демо-сценарії (перемикач)</div>' +
        '<div style="display:flex; gap:6px; flex-wrap:wrap;">';
      var keys = Object.keys(wd.scenarios);
      keys.forEach(function(key) {
        var s = wd.scenarios[key];
        var isActive = key === wd.scenarioKey;
        html += '<button class="btn btn-sm ' + (isActive ? 'btn-primary' : 'btn-ghost') + '" ' +
          (isActive ? 'disabled' : 'onclick="sa02SetScenario(\'' + key + '\')"') + '>' +
          s.icon + ' ' + s.label + '</button>';
      });
      html += '</div>' +
        '<div class="text-sm text-secondary" style="margin-top:4px; font-size:11px;">' + scenario.icon + ' <strong>' + scenario.label + ':</strong> ' + scenario.description + '</div>' +
      '</div>';
      return html;
    }

    // ═══════════════════════════════════════════
    // Збірка HTML сторінки
    // ═══════════════════════════════════════════
    var html = '';

    // ── Заголовок + notices ──
    html += C.pageHeader('Створити прорахунок / кейс', 'SA-02 — Майстер створення прорахунку та кейсу');

    html += C.heroNotice('Створення прорахунку',
      '<strong>Для менеджера з продажів.</strong> Wizard проведе вас через усі кроки від запиту клієнта до створення кейсу та передачі логістиці.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> ви вели прорахунок в Excel або email. Вручну збирали дані від клієнта, запитували ставки листом, формували пропозицію у Word/PDF і пересилали. Ризики вантажу (MSDS, страхування) часто пропускались. Передача логістиці — окремий лист із вкладеннями без чіткого чеклісту.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> 5-кроковий wizard із валідацією обов\'язкових полів (Incoterms, вага, маршрут, брокер). Для небезпечного вантажу система автоматично відкриває blocker-чекліст документів (MSDS). Запит ставок логістиці — одна кнопка «Запит ставок» без дублювання в email. Після вибору ставки дія «Підтвердити й створити кейс» одночасно створює кейс, стартові задачі та пакет документів (TC-MS-02).');

    // ── Перемикач сценаріїв ──
    html += renderScenarioSwitcher();

    // ── Статус прорахунку ──
    html += '<div class="card" style="border-left:3px solid var(--accent);">' +
      '<div class="flex justify-between items-center">' +
        '<div>' +
          '<span class="text-sm text-muted">Статус прорахунку:</span> ' +
          C.statusBadge(d.quote_status) +
        '</div>' +
        '<div class="text-sm text-secondary">' + currentStatusObj.description + '</div>' +
      '</div>' +
    '</div>';

    // ── Блокуючі помилки та попередження ──
    html += renderBlockersSummary();
    html += renderWarnings();

    // ── Прогрес-панель кроків (інтерактивна) ──
    html += renderStepsNav();

    // ═══════════════════════════════════════════
    // КРОК 1: Клієнт і контакти (step === 0)
    // ═══════════════════════════════════════════
    if (step === 0) {
      html += C.section('Крок 1 — Клієнт і контакти');

      // Блокер нового клієнта (контекстний для цього кроку)
      if (d.client_is_draft) {
        html += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
          '<div class="notice-title" style="color:var(--danger);">Блокер: новий клієнт без контрагента в 1С</div>' +
          '<p><span class="font-mono text-sm">[' + d.client_id + ']</span> <strong>' + d.client_name + '</strong><br>' +
          'Онбординг не завершено. Створення кейсу заблоковано до отримання client_id з 1С.<br>' +
          'Дозволено лише збереження чернетки прорахунку.</p>' +
        '</div>';
      }

      html += '<div class="form-row">' +
        C.formGroup('Клієнт (client_id) <span class="text-danger">*</span>', C.formInput('', d.client_name + ' [' + d.client_id + ']')) +
        C.formGroup('Статус клієнта', C.formInput('', d.client_is_draft ? 'Чернетка (без client_id в 1С)' : 'Підтверджений контрагент')) +
      '</div>';

      html += '<div class="card">' +
        '<div class="card-title" style="font-size:12px; margin-bottom:6px;">Контакти відправника / постачальника <span class="text-danger">*</span></div>' +
        C.table(
          ['Ім\'я', 'Телефон', 'Email'],
          d.pickup_contacts.map(function(c) { return [
            c.name, c.phone, c.email || '<span class="text-muted">—</span>'
          ]; })
        ) +
        '<p class="text-sm text-muted" style="margin-top:8px;">Мінімум 1 контакт з ім\'ям та каналом зв\'язку. Другорядні контакти рекомендовані.</p>' +
      '</div>';
    }

    // ═══════════════════════════════════════════
    // КРОК 2: Параметри вантажу (step === 1)
    // ═══════════════════════════════════════════
    if (step === 1) {
      html += C.section('Крок 2 — Параметри вантажу');

      html += '<div class="form-row">' +
        C.formGroup('Кількість місць <span class="text-danger">*</span>', C.formInput('', cargo.places)) +
        C.formGroup('Вага (кг) <span class="text-danger">*</span>', C.formInput('', cargo.weight_kg)) +
        C.formGroup('Об\'єм (м³) <span class="text-danger">*</span>', C.formInput('', cargo.volume_m3 + ' м³')) +
      '</div>' +
      '<div class="form-row">' +
        C.formGroup('Розміри / опис', C.formInput('', cargo.dimensions_or_volume)) +
        C.formGroup('Тип пакування', C.formInput('', cargo.packaging_type)) +
        C.formGroup('Штабелювання <span class="text-danger">*</span>', C.formSelect(
          cargo.stackability_flag
            ? ['Так (можна штабелювати)', 'Ні (не штабелювати)']
            : ['Ні (не штабелювати)', 'Так (можна штабелювати)']
        )) +
      '</div>';

      html += '<p class="text-sm text-secondary" style="margin-top:4px; font-size:11px;">Для авіа: система автоматично порівнює фактичну та об\'ємну вагу (коефіцієнт 1:6) і бере більшу.</p>';
    }

    // ═══════════════════════════════════════════
    // КРОК 3: Маршрут та Incoterms (step === 2)
    // ═══════════════════════════════════════════
    if (step === 2) {
      html += C.section('Крок 3 — Маршрут та Incoterms');

      html += '<div class="form-row">' +
        C.formGroup('Пункт відправлення <span class="text-danger">*</span>', C.formInput('', d.origin)) +
        C.formGroup('Пункт призначення <span class="text-danger">*</span>', C.formInput('', d.destination)) +
        C.formGroup('Incoterms <span class="text-danger">*</span>', C.formSelect(['EXW', 'FCA', 'FOB', 'DAP', 'CIF', 'DDP'])) +
      '</div>' +
      '<div class="form-row">' +
        C.formGroup('Дата готовності вантажу <span class="text-danger">*</span>', C.formInput('РРРР-ММ-ДД', d.readiness_date)) +
      '</div>';
    }

    // ═══════════════════════════════════════════
    // КРОК 4: Ризики (step === 3)
    // ═══════════════════════════════════════════
    if (step === 3) {
      html += C.section('Крок 4 — Ризики');

      html += C.sectionHeroNotice('Ризикові прапорці',
        'Секція фіксує ознаки небезпечного вантажу (з обов\'язковим MSDS), потребу страхування та вибір сторони митного брокера. ' +
        'Небезпечний вантаж без MSDS-маркування повністю блокує створення кейсу.');

      // MSDS-блокер (контекстний для цього кроку)
      var msdsBlocker = blockers.find(function(b) { return b.code === 'DANGEROUS_CARGO_MSDS_REQUIRED'; });
      if (msdsBlocker) {
        html += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
          '<div class="notice-title" style="color:var(--danger);">Блокуюча помилка — перехід заблоковано</div>' +
          '<p><span class="font-mono text-sm" style="color:var(--danger);">[' + msdsBlocker.code + ']</span> ' + msdsBlocker.message + '</p>' +
          '<p class="text-sm text-muted" style="margin-top:4px;">Кнопка «Далі» неактивна. Завантажте MSDS-документ або змініть позначку небезпечного вантажу.</p>' +
        '</div>';
      } else {
        html += C.sectionNotice('Умовні поля',
          'Якщо вантаж небезпечний — обов\'язковий опис та MSDS-маркер. Якщо потрібне страхування — обов\'язкові реквізити інвойсу.');
      }

      html += '<div class="form-row">' +
        C.formGroup('Небезпечний вантаж', C.formSelect(d.dangerous_cargo ? ['Так', 'Ні'] : ['Ні', 'Так'])) +
        C.formGroup('Опис небезпечного вантажу' + (d.dangerous_cargo ? ' <span class="text-danger">*</span>' : ''), C.formInput('Клас, UN-номер...', d.dangerous_cargo_description || '')) +
        C.formGroup('MSDS-маркер' + (d.dangerous_cargo ? ' <span class="text-danger">*</span>' : ''), C.formSelect(d.msds_marker ? ['Так', 'Ні'] : ['Ні', 'Так'])) +
      '</div>' +
      '<div class="form-row">' +
        C.formGroup('Потреба страхування', C.formSelect(d.insurance_required ? ['Так', 'Ні'] : ['Ні', 'Так'])) +
        C.formGroup('Сторона брокера <span class="text-danger">*</span>', C.formSelect(
          d.broker_side === 'our'
            ? ['Наш брокер', 'Брокер клієнта']
            : ['Брокер клієнта', 'Наш брокер']
        )) +
      '</div>';

      // Реквізити страхового інвойсу (умовно-обов'язкові)
      if (d.insurance_required) {
        html += '<div class="card" style="margin-top:8px; border-left:3px solid var(--accent);">' +
          '<div class="card-title" style="font-size:12px; margin-bottom:6px;">Реквізити страхового інвойсу (обов\'язкові при страхуванні)</div>' +
          '<div class="form-row">' +
            C.formGroup('Номер інвойсу <span class="text-danger">*</span>', C.formInput('', ins.invoice_no)) +
            C.formGroup('Дата інвойсу <span class="text-danger">*</span>', C.formInput('', ins.invoice_date)) +
            C.formGroup('Сума інвойсу <span class="text-danger">*</span>', C.formInput('', ins.invoice_amount + ' ' + ins.currency)) +
          '</div>' +
        '</div>';
      }
    }

    // ═══════════════════════════════════════════
    // КРОК 5: Перегляд та створення (step === 4)
    // ═══════════════════════════════════════════
    if (step === 4) {
      html += C.section('Крок 5 — Перегляд та створення');

      html += C.sectionHeroNotice('Вибір ставки та створення кейсу',
        'Оберіть агентську ставку, перевірте строк дії. Протерміновані ставки потребують повторного запиту. ' +
        'Зміна параметрів вантажу або маршруту після вибору ставки — скидає обрану ставку та повертає в «Очікування ставок».');

      // ── CTA «Запит ставок» (якщо ставки ще не запитані) ──
      if (!d.rates_requested) {
        html += '<div class="card" style="border-left:3px solid var(--accent); text-align:center; padding:16px;">' +
          '<p style="margin-bottom:8px; font-size:13px;">Ставки ще не запитані. Надішліть запит агентам для отримання цінових пропозицій.</p>' +
          C.btn('Запит ставок (request-rates)', 'btn-primary') +
          '<p class="text-sm text-muted" style="margin-top:8px;">POST /api/v1/quotes/' + d.quote_id + '/request-rates</p>' +
        '</div>';
      } else {
        // Блокер ставок (контекстний для цього кроку)
        var rateBlocker = blockers.find(function(b) { return b.code === 'AGENT_RATE_NOT_SELECTED'; });
        if (rateBlocker) {
          html += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
            '<div class="notice-title" style="color:var(--danger);">Блокуюча помилка</div>' +
            '<p><span class="font-mono text-sm" style="color:var(--danger);">[' + rateBlocker.code + ']</span> ' + rateBlocker.message + '</p>' +
          '</div>';
        }

        // Таблиця ставок агентів
        html += '<h3 style="margin:8px 0 6px; font-size:13px; font-weight:600;">Ставки агентів</h3>';
        html += C.table(
          ['ID', 'Агент', 'Ставка/кг', 'Днів у дорозі', 'Дійсна до', 'Статус', 'Дія'],
          d.agents.map(function(a) { return [
            '<span class="font-mono text-sm">' + a.id + '</span>',
            a.name,
            '$' + a.rate_per_kg,
            a.transit_days + ' днів',
            a.valid_until,
            a.status === 'expired'
              ? '<span class="badge-status blocked">Протермінована</span>'
              : '<span class="badge-status confirmed">Активна</span>',
            a.status === 'expired'
              ? C.btn('Повторний запит', 'btn-sm btn-secondary')
              : (d.selected_agent_rate_id === a.id
                  ? C.btn('Обрано ✓', 'btn-sm btn-primary', 'disabled')
                  : C.btn('Обрати', 'btn-sm btn-primary'))
          ]; })
        );
      }

      // Handover checklist
      html += C.sectionNotice('Handover',
        'Перед передачею логістиці обов\'язково: підтверджені контакти відправника, прикріплений інвойс і пакувальний лист. ' +
        'Якщо розмитнення нашими брокерами — пакет документів розширюється (контракт, специфікація, swift).');

      html += '<h3 style="margin:10px 0 6px; font-size:13px; font-weight:600;">Чекліст передачі</h3>';
      html += C.checklist(d.handover_checklist);

      // Зведення параметрів
      html += '<h3 style="margin:10px 0 6px; font-size:13px; font-weight:600;">Зведення параметрів</h3>';
      html += '<div class="card">' +
        C.table(
          ['Параметр', 'Значення'],
          [
            ['Клієнт', d.client_name + ' [' + d.client_id + ']'],
            ['Маршрут', d.origin + ' → ' + d.destination],
            ['Incoterms', d.incoterms],
            ['Вага / Об\'єм / Місця', cargo.weight_kg + ' кг / ' + cargo.volume_m3 + ' м³ / ' + cargo.places + ' місць'],
            ['Штабелювання', cargo.stackability_flag ? 'Так' : 'Ні'],
            ['Дата готовності', d.readiness_date],
            ['Небезпечний вантаж', d.dangerous_cargo ? 'Так — ' + d.dangerous_cargo_description : 'Ні'],
            ['MSDS', d.dangerous_cargo ? (d.msds_marker ? '✓ Маркер наявний' : '<span class="text-danger">✗ Потрібен MSDS</span>') : 'Не потрібен'],
            ['Страхування', d.insurance_required ? 'Так (' + ins.invoice_no + ')' : 'Ні'],
            ['Брокер', d.broker_side === 'our' ? 'Наш брокер' : 'Брокер клієнта'],
            ['Обрана ставка', d.selected_agent_rate_id || '<span class="text-danger">Не обрано</span>'],
            ['Інвойс прикріплено', d.invoice_attached ? '✓' : '<span class="text-danger">✗</span>'],
            ['Пакувальний лист', d.packing_list_attached ? '✓' : '<span class="text-danger">✗</span>']
          ]
        ) +
      '</div>';

      // ── Аудит-таймлайн прорахунку ──
      html += '<h3 style="margin:10px 0 6px; font-size:13px; font-weight:600;">Аудит-таймлайн прорахунку</h3>';
      html += C.timeline(wd.timeline);
    }

    // ── Навігаційний футер (завжди видимий) ──
    html += renderStepFooter();

    html += '<p class="text-muted" style="margin-top:6px; font-size:11px;"><span class="text-danger">*</span> — обов\'язкове поле. Блокуючі помилки відображаються на рівні кроку та у верхньому summary-блоці.</p>';

    return html;
  },

  // ─── SA-03 Документи клієнта ───
  '#/roles/sales/documents': function() {
    const d = DATA.sales.data.client_documents;
    return C.pageHeader('Документи клієнта', 'SA-03 — Документи клієнтів') +
      C.heroNotice('Клієнтські документи',
        '<strong>Для менеджера з продажів.</strong> Керування базовими документами клієнта: контракти, довіреності, сертифікати. Без актуальних документів система заблокує створення нових кейсів.<br><br>' +
        '<strong>Раніше (AS-IS):</strong> документи клієнтів зберігались у папках на диску або як вкладення в email. Актуальність (термін дії) перевіряли вручну. Протерміновані документи часто пропускались, що створювало ризики на етапі митного оформлення.<br>' +
        '<strong>Тепер у F1 (TO-BE):</strong> структурований реєстр із трекінгом статусів та дат. Протерміновані документи автоматично блокують старт нових кейсів для цього клієнта. Запросити документ у клієнта — шаблонне повідомлення через Communication Panel з прив\'язкою до кейсу (TC-MS-01).') +

      C.table(
        ['Тип', 'Назва файлу', 'Статус', 'Завантажено'],
        d.map(doc => [
          doc.doc_type, `<span class="font-mono text-sm">${doc.filename}</span>`,
          C.statusBadge(doc.status), doc.uploaded
        ])
      ) +

      C.actionBar('Дії з документами', [
        { label: 'Завантажити документ', cls: 'btn-primary' },
        { label: 'Запросити у клієнта', cls: 'btn-secondary' },
      ]);
  },

  // ─── SA-04 Комунікація з клієнтом (Zammad Conversation Engine) ───
  '#/roles/sales/communication': function() {
    var wd = sa04GetData();
    var d = wd.d;
    var scenario = wd.scenario;
    var threads = d.threads || [];
    var selectedIdx = Math.min(window._sa04_selected_thread || 0, threads.length - 1);
    var selectedThread = threads[selectedIdx] || null;
    var details = d.conversation_details || {};
    var cd = selectedThread ? (details[selectedThread.id] || null) : null;
    var health = d.sync_health || { state: 'connected' };
    var composerMode = window._sa04_composer_mode || 'external';
    var isUnlinked = cd && cd.unlinked;
    var isFailed = health.state === 'failed';
    var isDegraded = health.state === 'degraded';
    var sendError = d.send_error || null;
    var followupCreated = window._sa04_followup_created || false;
    window._sa04_followup_created = false;

    // Merge demo articles/commitments into current thread detail
    var allArticles = cd ? (cd.articles || []).concat(window._sa04_demo_articles || []) : [];
    var allCommitments = cd ? (cd.commitments || []).concat(window._sa04_demo_commitments || []) : [];
    var templates = d.message_templates || [];
    var timelineEvents = d.timeline_preview || [];

    var html = '';

    // ═══════════════════════════════════════════
    // 1. HEADER + NOTICES
    // ═══════════════════════════════════════════
    html += C.pageHeader('Комунікація з клієнтом', 'SA-04 — Conversation Engine (Zammad)');

    html += C.heroNotice('Клієнтська комунікація (Headless Zammad)',
      '<strong>Для менеджера з продажів (25 осіб).</strong> Вся комунікація з клієнтом — в контексті кейсу. Внутрішні нотатки, зовнішні відповіді, комітменти та вкладення зберігаються в єдиному треді.<br><br>' +
      '<strong>Раніше (AS-IS):</strong> комунікація з клієнтом велась через особисту пошту. Критичні рішення (підтвердження ставки, строки оплати, узгодження маркування) губились у потоці листів. Інші ролі (логістика, брокер, бухгалтерія) не бачили контексту переговорів і мусили перепитувати.<br>' +
      '<strong>Тепер у F1 (TO-BE):</strong> кожне повідомлення прив\'язане до кейсу. Шаблонні повідомлення з автопідстановкою даних (case_no, AWB, ETA, контакти) замість ручного тексту. Для China-складу — автогенерація інструкції з адресою і маркуванням. Зафіксований комітмент можна перетворити на задачу одним кліком (TC-MS-02, TC-MS-03).');

    // ═══════════════════════════════════════════
    // 2. SCENARIO SWITCHER
    // ═══════════════════════════════════════════
    html += '<div class="card" style="margin-bottom:16px; border:1px dashed var(--accent); background:var(--surface-secondary);">' +
      '<div style="font-weight:600; font-size:13px; margin-bottom:8px; color:var(--accent);">Демо-сценарії (перемикач)</div>' +
      '<div style="display:flex; gap:8px; flex-wrap:wrap;">';
    var scenarioKeys = Object.keys(wd.scenarios);
    scenarioKeys.forEach(function(key) {
      var s = wd.scenarios[key];
      var isActive = key === wd.scenarioKey;
      html += '<button class="btn btn-sm ' + (isActive ? 'btn-primary' : 'btn-ghost') + '" ' +
        (isActive ? 'disabled' : 'onclick="sa04SetScenario(\'' + key + '\')"') + '>' +
        s.icon + ' ' + s.label + '</button>';
    });
    html += '</div>' +
      '<div class="text-sm text-secondary" style="margin-top:8px;">' + scenario.icon + ' <strong>' + scenario.label + ':</strong> ' + scenario.description + '</div>' +
    '</div>';

    // ═══════════════════════════════════════════
    // 3. DEGRADATION / ERROR BANNERS
    // ═══════════════════════════════════════════

    // Degradation banner
    if (isDegraded && d.degradation_banner) {
      html += '<div class="notice" style="border-left:4px solid #e8a735; background:#fef9ee;">' +
        '<div class="notice-title" style="color:#b07d12;">Обмежений режим Zammad</div>' +
        '<p>' + d.degradation_banner + '</p>' +
      '</div>';
    }

    // Failed banner
    if (isFailed) {
      html += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
        '<div class="notice-title" style="color:var(--danger);">Збій зʼєднання з Zammad</div>' +
        '<p>Неможливо отримати чи надіслати повідомлення. Перевірте стан інтеграції або зверніться до адміністратора.</p>' +
        '<div style="margin-top:8px;">' + C.btn('Повторити зʼєднання', 'btn-sm btn-secondary', 'onclick="sa04RetrySync()"') + '</div>' +
      '</div>';
    }

    // Send error banner
    if (sendError) {
      html += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg);">' +
        '<div class="notice-title" style="color:var(--danger);">Помилка відправки</div>' +
        '<p><span class="font-mono text-sm">[' + sendError.code + ']</span> ' + sendError.message + '</p>' +
        (sendError.retry_available ? '<div style="margin-top:8px;">' + C.btn('Повторити відправку', 'btn-sm btn-primary', 'onclick="sa04RetrySync()"') + '</div>' : '') +
      '</div>';
    }

    // Follow-up created toast
    if (followupCreated) {
      html += '<div class="notice" style="border-left:4px solid var(--accent); background:#eef6ff;">' +
        '<div class="notice-title" style="color:var(--accent);">Follow-up задачу створено</div>' +
        '<p>Задача створена і зʼявиться в черзі задач відповідної ролі. Подію додано в timeline кейсу.</p>' +
      '</div>';
    }

    // ═══════════════════════════════════════════
    // 4. SPLIT-PANE LAYOUT
    // ═══════════════════════════════════════════
    html += '<div class="comm-split">';

    // ─── LEFT PANEL: Thread list ───
    html += '<div class="comm-sidebar">';
    html += '<div class="comm-sidebar-title">Треди · ' + threads.length + '</div>';

    if (threads.length === 0) {
      html += '<div class="text-center text-muted" style="padding:24px 8px; font-size:12px;">Немає тредів</div>';
    } else {
      threads.forEach(function(t, idx) {
        var isSelected = idx === selectedIdx;
        var borderColor = isSelected ? 'var(--accent)' : (t.unread ? '#e8a735' : 'transparent');
        var bg = isSelected ? 'rgba(0,122,204,0.06)' : '';
        var hasTicket = !!t.ticket_id;
        html += '<div class="card" style="border-left:3px solid ' + borderColor + '; cursor:pointer; ' + (bg ? 'background:' + bg + ';' : '') + '" onclick="sa04SelectThread(' + idx + ')">' +
          '<div style="font-weight:600; font-size:12px; line-height:1.3; margin-bottom:2px;">' +
            (t.unread ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--accent);margin-right:4px;vertical-align:middle;"></span>' : '') +
            t.subject +
          '</div>' +
          '<div class="text-sm text-muted truncate" style="font-size:11px;">' + t.client + '</div>' +
          '<div class="text-muted truncate" style="font-size:10px; margin-top:2px; line-height:1.4;">' + t.last_message.substring(0, 55) + '…</div>' +
          '<div class="flex justify-between items-center" style="margin-top:4px;">' +
            '<span style="font-size:10px; color:var(--text-muted);">' + t.date.substring(5) + '</span>' +
            (hasTicket
              ? '<span class="font-mono" style="font-size:9px; color:var(--text-muted);">' + t.ticket_id + '</span>'
              : '<span class="badge-status blocked" style="font-size:9px; padding:1px 5px;">Не звʼязано</span>') +
          '</div>' +
        '</div>';
      });
    }

    html += '</div>'; // end comm-sidebar

    // ─── RIGHT PANEL: Detail with tabs + composer ───
    html += '<div class="comm-main">';

    if (cd) {
      // ── Tabs ──
      html += C.tabs([
        { id: 'sa04-msg', label: 'Повідомлення (' + allArticles.length + ')' },
        { id: 'sa04-cmt', label: 'Комітменти (' + allCommitments.length + ')' },
        { id: 'sa04-tpl', label: 'Шаблони' },
        { id: 'sa04-tl', label: 'Таймлайн' }
      ], 0);

      // ── Scrollable tab body ──
      html += '<div class="comm-main-body">';

      // ──── Tab: Повідомлення ────
      var msgHtml = '';

      if (isUnlinked) {
        msgHtml += '<div class="notice" style="border-left:4px solid var(--danger); background:var(--danger-bg); margin-bottom:8px;">' +
          '<div class="notice-title" style="color:var(--danger);">Тред не привʼязаний до кейсу</div>' +
          '<p style="margin-bottom:6px;">Відправка заблокована. Привʼяжіть тред до кейсу.</p>' +
          C.btn('Привʼязати', 'btn-sm btn-primary', 'onclick="sa04LinkThread()"') + ' ' +
          C.btn('Новий кейс', 'btn-sm btn-secondary', 'onclick="navigate(\'#/roles/sales/quote\')"') +
        '</div>';
      }

      if (allArticles.length === 0) {
        msgHtml += '<div class="text-center text-muted" style="padding:32px 12px;">Немає повідомлень. Надішліть перше повідомлення через composer нижче.</div>';
      } else {
        allArticles.forEach(function(a) {
          var isInternal = a.visibility === 'internal';
          var isNew = a.demo_new;
          var bColor = isNew ? '#28a745' : (isInternal ? '#e8a735' : 'var(--accent)');
          msgHtml += '<div class="card mb-8" style="border-left:3px solid ' + bColor + '; padding:10px 12px; ' + (isNew ? 'background:#f0fff4;' : '') + '">' +
            '<div class="flex justify-between items-center" style="margin-bottom:4px;">' +
              '<div>' +
                '<span class="font-bold text-sm">' + a.actor + '</span> ' +
                C.visibilityBadge(a.visibility) +
                ' <span class="text-muted" style="font-size:11px;">' + a.channel + '</span>' +
                (isNew ? ' <span class="badge-status done" style="font-size:10px;">Нове</span>' : '') +
              '</div>' +
              '<span class="text-muted" style="font-size:11px;">' + a.timestamp + '</span>' +
            '</div>' +
            '<div class="text-sm">' + a.summary + '</div>' +
            (a.attachment_refs && a.attachment_refs.length > 0 ? '<div class="text-muted" style="font-size:11px; margin-top:4px;">📎 ' + a.attachment_refs.join(', ') + '</div>' : '') +
            '<div class="flex gap-8" style="margin-top:6px;">' +
              '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 6px;" onclick="openModal(\'sa04-commitment\')">📌 Комітмент</button>' +
              '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:2px 6px;" onclick="openModal(\'sa04-followup\')">📋 Follow-up</button>' +
            '</div>' +
          '</div>';
        });
      }

      html += C.tabContent('sa04-msg', msgHtml, true);

      // ──── Tab: Комітменти ────
      var cmtHtml = '';
      if (allCommitments.length === 0) {
        cmtHtml += '<div class="text-center text-muted" style="padding:24px;">Немає зафіксованих комітментів.</div>';
      } else {
        cmtHtml += C.table(
          ['ID', 'Текст', 'Зафіксував', 'Дата', 'Статус'],
          allCommitments.map(function(c) { return [
            '<span class="font-mono text-sm">' + c.id + '</span>' + (c.demo_new ? ' <span class="badge-status done" style="font-size:10px;">Нове</span>' : ''),
            c.text,
            c.pinned_by,
            c.pinned_at,
            C.statusBadge(c.status)
          ]; })
        );
      }
      cmtHtml += '<div style="margin-top:12px;">' +
        C.btn('📌 Зафіксувати комітмент', 'btn-sm btn-secondary', 'onclick="openModal(\'sa04-commitment\')"') +
      '</div>';
      html += C.tabContent('sa04-cmt', cmtHtml);

      // ──── Tab: Шаблони ────
      var tplHtml = '<div class="text-sm text-muted" style="margin-bottom:12px;">Шаблони з автопідстановкою даних кейсу. Оберіть шаблон для перегляду та надсилання.</div>';
      tplHtml += '<div class="card-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">';
      templates.forEach(function(tpl) {
        tplHtml += '<div class="card" style="cursor:pointer; padding:10px 12px;" onclick="openModal(\'sa04-template\')">' +
          '<div style="font-weight:600; font-size:12px; margin-bottom:2px;">📋 ' + tpl.name + '</div>' +
          '<div style="font-size:10px; color:var(--text-muted);">' + tpl.context + '</div>' +
        '</div>';
      });
      tplHtml += '</div>';
      html += C.tabContent('sa04-tpl', tplHtml);

      // ──── Tab: Таймлайн ────
      var tlHtml = '<div class="text-sm text-muted" style="margin-bottom:8px;">Аудит-лог комунікацій із f1_case_events.</div>';
      if (timelineEvents.length > 0) {
        tlHtml += C.timeline(timelineEvents.map(function(e) {
          return { ts: e.ts, actor: e.actor, message: C.typeLabel(e.type) + ': ' + e.message, detail: e.detail, icon: e.icon || '' };
        }));
      } else {
        tlHtml += '<div class="text-center text-muted" style="padding:24px;">Немає подій.</div>';
      }
      html += C.tabContent('sa04-tl', tlHtml);

      html += '</div>'; // end comm-main-body

      // ── Composer (sticky bottom) ──
      var canSend = !isUnlinked && !isFailed;
      html += '<div class="comm-composer-wrap">';

      // Mode tabs
      html += '<div class="flex items-center gap-4" style="margin-bottom:8px;">' +
        '<button class="btn btn-sm ' + (composerMode === 'external' ? 'btn-primary' : 'btn-ghost') + '" style="font-size:11px;padding:3px 8px;" onclick="sa04SetComposerMode(\'external\')">📧 Зовнішня</button>' +
        '<button class="btn btn-sm ' + (composerMode === 'internal' ? 'btn-primary' : 'btn-ghost') + '" style="font-size:11px;padding:3px 8px;" onclick="sa04SetComposerMode(\'internal\')">📝 Нотатка</button>' +
        '<span class="text-muted" style="font-size:10px; margin-left:auto;">' +
          (composerMode === 'external' ? 'клієнт побачить' : 'лише внутрішня') + '</span>' +
      '</div>';

      if (isDegraded && composerMode === 'external') {
        html += '<div style="font-size:10px; color:#b07d12; margin-bottom:4px;">⚠ Відправка може бути затримана</div>';
      }

      html += '<div class="flex gap-8">' +
        '<textarea id="sa04-composer-text" class="form-input" rows="2" ' + (canSend ? '' : 'disabled ') +
          'placeholder="' + (composerMode === 'external' ? 'Відповідь клієнту...' : 'Внутрішня нотатка...') + '" ' +
          'style="flex:1; resize:none; font-size:12px;"></textarea>' +
        '<div class="flex flex-col gap-4" style="flex-shrink:0;">' +
          (canSend
            ? '<button class="btn btn-sm ' + (composerMode === 'external' ? 'btn-primary' : 'btn-secondary') + '" style="font-size:11px;" onclick="sa04SendDemo()">' +
                (composerMode === 'external' ? 'Надіслати' : 'Зберегти') + '</button>'
            : '<button class="btn btn-sm btn-primary" style="font-size:11px;" disabled>' +
                (composerMode === 'external' ? 'Надіслати' : 'Зберегти') + '</button>') +
          '<button class="btn btn-ghost btn-sm" style="font-size:10px;padding:2px 6px;" onclick="openModal(\'sa04-template\')">📋 Шаблон</button>' +
        '</div>' +
      '</div>';

      if (!canSend) {
        html += '<div style="font-size:10px; color:var(--danger); margin-top:4px;">' +
          (isUnlinked ? 'Привʼяжіть тред до кейсу' : 'Перевірте зʼєднання з Zammad') + '</div>';
      }

      html += '</div>'; // end comm-composer-wrap

    } else {
      // No detail available
      html += C.emptyState('Оберіть тред', 'Оберіть тред зліва для перегляду повідомлень та дій.');
    }

    html += '</div>'; // end comm-main
    html += '</div>'; // end comm-split

    // ═══════════════════════════════════════════
    // 5. EDGE CASES (collapsible)
    // ═══════════════════════════════════════════
    html += '<details style="margin-top:8px;">' +
      '<summary style="cursor:pointer; font-weight:600; color:var(--text-muted); font-size:12px; padding:6px 0; user-select:none;">Крайні випадки (демо) ▸</summary>' +
      '<div class="card-grid" style="margin-top:8px;">' +
        '<div class="card" style="border-left:3px solid #e8a735; padding:10px;">' +
          '<div style="font-weight:600; font-size:12px; margin-bottom:2px;">Zammad degraded</div>' +
          '<div style="font-size:11px; color:var(--text-secondary);">Зовнішня відправка обмежена. Banner + fallback.</div>' +
        '</div>' +
        '<div class="card" style="border-left:3px solid var(--danger); padding:10px;">' +
          '<div style="font-weight:600; font-size:12px; margin-bottom:2px;">Zammad disconnected</div>' +
          '<div style="font-size:11px; color:var(--text-secondary);">Усі дії заблоковані. Retry CTA.</div>' +
        '</div>' +
        '<div class="card" style="border-left:3px solid var(--danger); padding:10px;">' +
          '<div style="font-weight:600; font-size:12px; margin-bottom:2px;">Тред без кейсу</div>' +
          '<div style="font-size:11px; color:var(--text-secondary);">Blocker + CTA привʼязки.</div>' +
        '</div>' +
        '<div class="card" style="border-left:3px solid #e8a735; padding:10px;">' +
          '<div style="font-weight:600; font-size:12px; margin-bottom:2px;">Порожній тред / Помилка</div>' +
          '<div style="font-size:11px; color:var(--text-secondary);">Empty state, error banner + retry.</div>' +
        '</div>' +
      '</div>' +
    '</details>';

    // ═══════════════════════════════════════════
    // 12. MODALS
    // ═══════════════════════════════════════════

    // ─── Commitment modal ───
    html += C.modal('sa04-commitment', 'Зафіксувати комітмент',
      '<div class="text-sm text-muted mb-8">Оберіть або введіть текст комітменту, який потрібно зафіксувати. Комітмент з\'явиться в таблиці та в аудит-таймлайні.</div>' +
      C.formGroup('Текст комітменту <span class="text-danger">*</span>',
        '<textarea id="sa04-commitment-text" class="form-input" rows="2" placeholder="Наприклад: Оновити клієнта після проходження митниці..." style="width:100%;"></textarea>') +
      C.formGroup('Джерело', C.formSelect(allArticles.map(function(a) { return a.actor + ' — ' + a.summary.substring(0, 50) + '…'; }).concat(['Вільний ввід']))) +
      '<p class="text-sm text-muted">Комітмент буде видимий для всіх дотичних ролей (read-only).</p>',
      C.btn('Зафіксувати', 'btn-primary', 'onclick="sa04PinCommitment()"') + ' ' +
      C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'sa04-commitment\')"')
    );

    // ─── Follow-up task modal ───
    html += C.modal('sa04-followup', 'Створити follow-up задачу',
      '<div class="text-sm text-muted mb-8">Задача буде створена в F1 та синхронізована з Plane. Вона з\'явиться в черзі задач відповідної ролі.</div>' +
      C.formGroup('Назва задачі <span class="text-danger">*</span>',
        C.formInput('Наприклад: Перевірити з брокером стан оформлення', cd && allArticles.length > 0 ? allArticles[0].summary.substring(0, 60) : '')) +
      C.formGroup('Тип задачі', C.formSelect(['Клієнтська комунікація', 'Документи', 'Уточнення', 'Ескалація'])) +
      C.formGroup('Відповідальна роль', C.formSelect(['Продажі', 'Авіалогістика', 'Брокер', 'Автологістика', 'Склад', 'Бухгалтерія', 'Фінанси'])) +
      C.formGroup('Дедлайн', C.formInput('РРРР-ММ-ДД ГГ:ХХ', '2026-02-13 12:00')) +
      (cd && cd.case_no ? '<p class="text-sm text-muted">Кейс: <strong>' + cd.case_no + '</strong> · Джерело: conversation thread</p>' : ''),
      C.btn('Створити задачу', 'btn-primary', 'onclick="sa04CreateFollowUp()"') + ' ' +
      C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'sa04-followup\')"')
    );

    // ─── Template message modal (with live preview) ───
    var tplPreview = templates.length > 0 ? templates[0].preview : '';
    // Simple variable substitution for demo
    if (cd) {
      tplPreview = tplPreview
        .replace(/\{client_contact\}/g, cd.client || '—')
        .replace(/\{case_no\}/g, cd.case_no || '—')
        .replace(/\{awb\}/g, '074-12345678')
        .replace(/\{current_state_label\}/g, 'Митне оформлення')
        .replace(/\{eta\}/g, 'кінець тижня')
        .replace(/\{sales_manager\}/g, 'Оксана М.')
        .replace(/\{route\}/g, 'IST → KBP')
        .replace(/\{rate\}/g, '$2.80')
        .replace(/\{transit_days\}/g, '3')
        .replace(/\{valid_until\}/g, '2026-02-25');
    }

    html += C.modal('sa04-template', 'Шаблонне повідомлення',
      '<div class="text-sm text-muted mb-8">Оберіть шаблон — дані кейсу підставляться автоматично. Перегляньте перед відправкою.</div>' +
      C.formGroup('Тип шаблону', '<select class="form-select" id="sa04-tpl-select">' +
        templates.map(function(tpl, i) { return '<option value="' + i + '">' + tpl.name + '</option>'; }).join('') +
      '</select>') +
      C.formGroup('Одержувач', C.formInput('', cd ? cd.client : '—')) +
      '<div class="card" style="background:var(--surface-secondary); margin-top:8px;">' +
        '<div style="font-weight:600; font-size:12px; margin-bottom:4px; color:var(--accent);">Попередній перегляд (з підставленими даними):</div>' +
        '<pre style="white-space:pre-wrap; font-size:12px; margin:0; line-height:1.6;">' + tplPreview + '</pre>' +
      '</div>' +
      '<div class="text-sm text-muted mt-8">Змінні: <code>{client_contact}</code>, <code>{case_no}</code>, <code>{awb}</code>, <code>{eta}</code>, <code>{current_state_label}</code></div>',
      C.btn('Надіслати', 'btn-primary', 'onclick="sa04SendDemo(); closeModal(\'sa04-template\')"') + ' ' +
      C.btn('Скасувати', 'btn-ghost', 'onclick="closeModal(\'sa04-template\')"')
    );

    return html;
  },

});
