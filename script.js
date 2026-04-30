'use strict';

// ═══════════════════════════════════════════════════════════════════
//  CASE DATA — 3 Cases with branching decision trees
// ═══════════════════════════════════════════════════════════════════

const CASES = [

  // ──────────────────────────────────────────────────────────────
  // CASE 1: SHOCK
  // ──────────────────────────────────────────────────────────────
  {
    id: 'cc-1',
    title: 'Case #1',
    blurb: 'Acute clinical deterioration requiring rapid assessment and resuscitation.',
    artType: 'shock',
    patient: { name: 'Gerald Hoffman', initials: 'GH', age: '67M', weight: '82 kg', allergies: 'NKDA' },

    vignette: `<p>A 67-year-old man with <span class="hl">T2DM, CKD stage 3, hypertension, COPD</span> was admitted for community-acquired pneumonia and started on ceftriaxone + azithromycin. He initially improved.</p><p>On <span class="hl">hospital day 2</span>, you receive a page from the nurse:</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">Tower 5 · Bed 5</div><div class="pager-time">14:32</div></div></div><div class="pager-msg">"Patient is more confused and now hypotensive. Please come to bedside."</div></div><p>A rapid response is called.</p>`,

    rnReport: `"He was fine at 6am but I just went in and he barely responded when I called his name. His pressure is in the 80s. He's hot, flushed, and sweating through his gown. He's diaphoretic, altered, and minimally responsive. I've got a peripheral IV from admission. What do you want me to do first?"`,
    rnCues: [
      'Look at the monitor. Note the vital signs.',
      'Verbalize your differential diagnosis for hypotension out loud.'
    ],

    vitals: [
      { lbl: 'HR',   val: '118',    unit: 'bpm',        st: 'vw' },
      { lbl: 'BP',   val: '82/44',  unit: 'mm Hg',      st: 'vc' },
      { lbl: 'RR',   val: '28',     unit: '/min',        st: 'vw' },
      { lbl: 'SpO₂', val: '92%',   unit: '4L NC',       st: 'vw' },
      { lbl: 'Temp', val: '38.9°C', unit: 'oral',        st: 'vc' },
      { lbl: 'GCS',  val: '12',     unit: '/15',         st: 'vw' }
    ],

    labs: [
      { lbl: 'Lactate',  val: '4.5',      unit: 'mmol/L',  st: 'lv-c' },
      { lbl: 'WBC',      val: '19.6',     unit: 'K/µL',    st: 'lv-c' },
      { lbl: 'Hgb',      val: '11.2',     unit: 'g/dL',    st: 'lv-a' },
      { lbl: 'Creat',    val: '2.1',      unit: '(bl 1.3)',st: 'lv-c' },
      { lbl: 'pH',       val: '7.31',     unit: 'ABG',     st: 'lv-c' },
      { lbl: 'PaCO₂',   val: '32',       unit: 'mm Hg',   st: 'lv-a' },
      { lbl: 'PaO₂',    val: '70',       unit: 'mm Hg',   st: 'lv-a' },
    ],

    examSystems: [
      { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused, GCS 12. Oriented to person only. Responds to loud voice.' },
      { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Diaphoretic. Flushed and warm skin.' },
      { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
      { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic, regular rhythm. Warm extremities. Bounding pulses.' },
      { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic.' },
      { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended, mild RLQ tenderness.' },
      { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm, no edema. Cap refill 3 sec.' }
    ],

    pocus: {
      rows: [
        { k:'LV',     v:'Hyperdynamic systolic function — EF visually >70%' },
        { k:'RV',     v:'Normal size and function' },
        { k:'IVC',    v:'Small, collapsible (>50% collapse with sniff)' },
        { k:'Lungs',  v:'Focal B-lines right lower zone; A-lines elsewhere' },
        { k:'Pericard',v:'No effusion' }
      ],
      interp: 'Distributive shock with relative hypovolemia and preserved cardiac function. Hyperdynamic LV + collapsible IVC = septic/distributive physiology. NOT cardiogenic.'
    },

    // DECISION POINT 1 — initial resuscitation
    decision1: {
      title: 'Initial Resuscitation Decision',
      prompt: 'What is your initial management? Enter your orders below.',
      placeholder: `Order your initial management...
e.g.: Lactate, CBC, CMP, cultures, oxygen, etc.`,
      // Branching logic: evaluate keywords in order text
      branches: [
        {
          id: 'good-resus-with-pressor-and-micu',
          label: '✓ COMPLETE INITIAL MANAGEMENT',
          type: 'good',
          triggers: ['2l','2000','2400','2460','2500','2600','2.5','2.6','2.5l','2.6l','3l','3000','30 ml/kg','30 cc/kg','30ml/kg','30cc/kg','norepi','norepinephrine','levophed','pressor','micu','icu','critical care','consult'],
          requires: 3, // Need fluids + pressor + MICU
          excludes: ['4l','4000','5l','5000','6l','6000','40 ml/kg','50 ml/kg'], // Exclude excessive fluids
          headline: 'Comprehensive shock management with MICU consultation',
          narrative: `You ordered <span class="hl">30 mL/kg crystalloid</span> (approximately 2.5 L), started <span class="hl">norepinephrine</span>, and consulted the <span class="hl">MICU team</span>. Excellent prioritization — the intensivist is on their way to evaluate.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '108',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '98/62', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '74',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '95%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'UO',    val: '40 mL', unit: 'last hr',st: 'vn' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `After 30 mL/kg fluid and norepinephrine 8 mcg/min, MAP has improved to 74 mm Hg. The MICU attending arrives: <em>"Good initial resuscitation. Let's transfer to ICU for closer monitoring. We'll need central access, arterial line, and continued vasopressor titration."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Improved alertness. GCS 14. Oriented to person and place. Responds appropriately to questions.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Less ill-appearing. Still diaphoretic but improving. Skin remains warm.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Mucous membranes slightly improved. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic but improved (HR 108). Regular rhythm. Warm extremities. Bounding pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe unchanged. Respiratory rate improved to 22.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended, mild RLQ tenderness unchanged.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm, no edema. Cap refill <2 sec (improved).' }
          ]
        },
        {
          id: 'good-fluid-with-pressor-no-micu',
          label: '⚠ PRESSOR STARTED BUT MICU NOT CONSULTED',
          type: 'warning',
          triggers: ['2l','2000','2400','2460','2500','2600','3l','3000','30 ml/kg','30 cc/kg','30ml/kg','30cc/kg','norepi','norepinephrine','levophed','pressor'],
          requires: 2,
          excludes: ['micu','icu','critical care','consult icu','4l','4000','5l','5000','6l','6000','40 ml/kg','50 ml/kg'], // Exclude MICU and excessive fluids
          headline: 'Adequate resuscitation but missing ICU consultation',
          narrative: `You gave 30 mL/kg fluid and started norepinephrine — hemodynamics are improving. However, <span class="hl">this patient requires ICU-level care</span>. A patient on vasopressors should be in an intensive care setting with close monitoring, central access, and intensivist oversight.<br/><br/>The floor nurse pages: <em>"Doctor, he's on pressors now — shouldn't we call the ICU? I'm not comfortable managing this on the floor."</em>`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '110',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '94/58', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '70',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '94%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `MAP is 70 mm Hg on norepinephrine. The charge nurse contacts the MICU attending independently. The intensivist arrives: <em>"This patient needs ICU monitoring now. Let's get him transferred."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Slightly improved. GCS 13. Responds to voice but remains confused.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Still ill-appearing. Diaphoretic. Warm skin.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 110). Regular rhythm. Warm extremities.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic (RR 26).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm, no edema. Cap refill 2-3 sec.' }
          ]
        },
        {
          id: 'excessive-fluid',
          label: '⚠ EXCESSIVE FLUID ADMINISTRATION',
          type: 'bad',
          triggers: ['4l','4000','4500','5l','5000','6l','6000','40 ml/kg','40ml/kg','40 cc/kg','40cc/kg','50 ml/kg','50ml/kg','50 cc/kg','50cc/kg'],
          requires: 1,
          headline: 'Fluid overload causing respiratory decompensation',
          narrative: `You ordered <span class="hl">excessive fluid volume (≥4 liters)</span>. While initial resuscitation with 30 mL/kg (~2.5L) is appropriate, giving significantly more than this without reassessment can lead to <span class="hl">iatrogenic fluid overload</span>.<br/><br/>
          After the large volume infusion, the patient develops acute respiratory distress.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '128',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '88/52', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '64',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'RR',    val: '32',    unit: '/min',   st: 'vc' },
            { lbl: 'SpO₂',  val: '86%',   unit: '10L NRB',st: 'vc' },
            { lbl: 'Lungs', val: 'Bilateral crackles', unit: '', st: 'vc' },
          ],
          vitalsMsg: `The patient is now in severe respiratory distress. SpO₂ 86% on NRB 10L, RR 32, tachypneic with accessory muscle use. New bilateral crackles on lung exam.<br/><br/>
          RN: <em>"Doctor, he's really struggling to breathe now! His lungs sound wet and his oxygen is dropping. Do we need to intubate?"</em><br/><br/>
          <strong>Teaching point:</strong> In septic shock, after initial 30 mL/kg bolus, further fluids should be guided by dynamic assessment (pulse pressure variation, passive leg raise, IVC collapsibility). Empiric large-volume fluid administration without reassessment causes pulmonary edema, especially in elderly patients or those with underlying cardiac/renal disease.<br/><br/>
          <span class="hl">Patient now requires intubation for hypoxemic respiratory failure secondary to fluid overload.</span>`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Fluid Overload Complication:</strong><br/>
          • Initial septic shock resuscitation: 30 mL/kg (~2.5L for 82 kg patient)<br/>
          • Additional fluid should be given based on dynamic assessment, not empirically<br/>
          • Excessive fluid (≥4L) without reassessment → iatrogenic pulmonary edema<br/>
          • This patient developed respiratory failure requiring intubation<br/><br/>
          <strong>Key Learning:</strong> After initial 30 mL/kg bolus, reassess hemodynamics and fluid responsiveness before giving more. Use dynamic measures (PPV, PLR, IVC) to guide further fluid therapy.`,
          decisions: ['Excessive fluid administration', 'Iatrogenic pulmonary edema', 'Review fluid responsiveness assessment'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused and agitated. GCS 12. Anxious due to respiratory distress.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Severely ill-appearing. Diaphoretic. Using accessory muscles to breathe.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. JVD now present (fluid overload).' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 128). Regular rhythm. Bounding pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'<span class="hl">Bilateral coarse crackles throughout</span> (new finding - pulmonary edema). Labored breathing. RR 32.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm, <span class="hl">trace lower extremity edema</span> (new - fluid overload). Cap refill 2 sec.' }
          ]
        },
        {
          id: 'inadequate-fluid',
          label: '⚠ INSUFFICIENT FLUID VOLUME',
          type: 'warning',
          triggers: ['500','1l','1000','1500','fluid','bolus','saline','lactated','albumin'],
          requires: 1,
          excludes: ['2l','2000','2400','2460','2500','2600','2.5','2.6','2.5l','2.6l','3l','3000','30 ml/kg','30 cc/kg','30ml/kg','30cc/kg','4l','4000','5l','5000','6l','6000','40 ml/kg','50 ml/kg'],
          headline: 'Fluid resuscitation inadequate',
          narrative: `You ordered IV fluids, but the volume appears insufficient. The patient's hemodynamic response is suboptimal.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '124',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '76/42', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '53',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '91%',   unit: '6L NC',  st: 'vw' },
            { lbl: 'UO',    val: '8 mL',  unit: 'last hr',st: 'vc' },
          ],
          vitalsMsg: `BP rose briefly to 88/50 mm Hg after the initial fluid, but has now dropped back to 76/42 mm Hg. MAP 53. Urine output minimal.<br/><br/>RN: <em>"The pressure isn't holding. What else do you want to do?"</em>`,
          nextDecision: 'decision1_5',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Worsening confusion. GCS 11. Minimally responsive.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Very ill-appearing. Diaphoretic. Pale, mottled skin.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Very dry mucous membranes. Flat neck veins (hypovolemia).' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Severe tachycardia (HR 124). Thready pulses. Cool extremities (worsening perfusion).' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic (RR 30).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'<span class="hl">Cool, clammy extremities</span>. Cap refill >4 sec (poor perfusion).' }
          ]
        },
        {
          id: 'pressor-no-fluid',
          label: '⚠ VASOPRESSOR WITHOUT ADEQUATE FLUID',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed','vasopressor','pressor','dopamine','phenylephrine','neosynephrine','neo-synephrine','epinephrine','adrenalin'],
          requires: 1,
          excludes: ['2l','2000','2400','2460','2500','2600','3l','3000','30 ml/kg','30 cc/kg','30ml/kg','30cc/kg','1l','1000','crystalloid','normal saline','lactated','lr','ns','4l','4000','5l','5000'],
          headline: 'Vasopressor initiated without fluid resuscitation',
          narrative: `You started a vasopressor without completing an initial fluid challenge. The patient's response is concerning.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '118',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '94/52', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '66',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '92%',   unit: '4L NC',  st: 'vw' },
            { lbl: 'Lactate',val:'5.8',   unit: 'mmol/L', st: 'vc' },
            { lbl: 'UO',    val: '12 mL', unit: 'last hr',st: 'vc' },
          ],
          vitalsMsg: `Norepinephrine has raised MAP to 66 mm Hg, but repeat lactate is 5.8 mmol/L (worsening). Urine output remains poor.<br/><br/>RN: <em>"The pressure looks better on the monitor but he still looks really sick. His hands and feet are cold."</em>`,
          nextDecision: 'decision1_5',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Lethargic.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Diaphoretic. Pale.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Very dry mucous membranes. Flat neck veins.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 118). MAP improved but peripheries cool.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'<span class="hl">Cold hands and feet</span> (inadequate perfusion despite pressor). Mottled. Cap refill >4 sec.' }
          ]
        },
        {
          id: 'no-action',
          label: '⚠ NO FLUIDS OR PRESSORS ORDERED',
          type: 'bad',
          triggers: ['lactate','cbc','culture','antibiotic','oxygen'],
          requires: 1,
          excludes: ['fluid','bolus','saline','lactated','lr','ns','norepi','norepinephrine','pressor','vasopressor'],
          headline: 'Critical interventions missing — patient deteriorating',
          narrative: `You ordered diagnostic studies but did not address the immediate hemodynamic instability. In septic shock, <span class="hl">diagnostic workup cannot substitute for simultaneous resuscitation</span>.<br/><br/>MAP 45 mm Hg. HR 136. GCS 8 — the patient is unresponsive. Anuria has developed over the last hour. The RN calls overhead: <em>"Doctor — BP is 68/34. The patient is unresponsive. I'm calling the Code!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 2 Bed 8. Code Blue, Tower 2 Bed 8.',
            cause: 'Cardiovascular collapse from untreated septic shock — distributive physiology with vasoplegia, progressive end-organ failure, and lactic acidosis.',
            monitor_phrase: 'Look at the monitor — no pulse. PEA on telemetry.',
            hs_ts: [
              'Hypovolemia ← most likely (distributive shock, third-spacing)',
              'Hypoxia ← SpO₂ 87% on NRB before arrest',
              'Hydrogen ion (severe lactic acidosis, pH <7.1)',
              'Hypo/Hyperkalemia ← renal failure in shock',
              'Tension pneumothorax (rule out)',
              'Thrombosis — septic emboli or underlying PE',
              'Tamponade (less likely)',
              'Toxins / medications'
            ],
            acls_specifics: [
              'Aggressive volume resuscitation — push NS/LR boluses during CPR',
              'Norepinephrine via peripheral IV during resuscitation if MAP unresponsive',
              'Broad-spectrum IV antibiotics if not yet given — source control is definitive',
              'Sodium bicarbonate 1 mEq/kg if pH <7.1 (bridge to fix the cause)',
              'Consider calcium gluconate if hyperkalemia from renal failure'
            ],
            rosc_label: '✓ ROSC Achieved — Continuing Sepsis Management →'
          },
          nextVitals: [
            { lbl: 'HR',    val: '136',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '68/34', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '45',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '87%',   unit: '10L NRB',st: 'vc' },
            { lbl: 'GCS',   val: '8',     unit: '/15',    st: 'vc' },
            { lbl: 'UO',    val: '0 mL',  unit: 'last hr',st: 'vc' },
          ],
          vitalsMsg: `After ROSC, the MICU team has been called to bedside. The patient is intubated and on norepinephrine. Broad-spectrum antibiotics are running.<br/><br/><strong>Key teaching:</strong> In septic shock, hemodynamic resuscitation and antibiotics must be initiated simultaneously with diagnostic workup — not after. Each hour of delay increases mortality by 7–10%.`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Critical Delay.</strong><br/><br/>A Code Blue occurred because hemodynamic resuscitation was not initiated. The sepsis bundle (fluids, antibiotics, vasopressor, lactate) must run in parallel with diagnostic workup, not after it. After ROSC, the patient is transferred to the MICU on norepinephrine and vasopressin.`,
          decisions: [
            'Failed to initiate simultaneous resuscitation with diagnostic workup',
            'Sepsis bundle must be started within the first hour',
            'PEA arrest from distributive shock — treated with volume + vasopressors during CPR',
            'After ROSC: target MAP ≥65, repeat lactate, continue antibiotics'
          ],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'<span class="hl">Post-cardiac arrest. Sedated and intubated after ROSC. GCS not assessable.</span>' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'ROSC achieved. Tachycardic (HR 118). On norepinephrine infusion. MAP targeting ≥65.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated, mechanically ventilated. Bilateral crackles.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool, mottled extremities. Gradual improvement expected with vasopressor support.' }
          ]
        },
        {
          id: 'default',
          label: 'ORDERS RECEIVED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Orders documented',
          narrative: `Orders have been sent. The nurse is implementing your management plan.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '120',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '80/44', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '56',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '91%',   unit: '6L NC',  st: 'vw' },
            { lbl: 'UO',    val: '15 mL', unit: 'last hr',st: 'vc' },
          ],
          vitalsMsg: `Patient status remains critical. Hemodynamics have not improved significantly.`,
          nextDecision: 'decision1_5',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Minimally responsive to commands.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Diaphoretic. Pale skin.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 120). Thready pulses. Cool peripheries.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool extremities. Cap refill >3 sec.' }
          ]
        }
      ]
    },

    // DECISION POINT 1.5 — reassessment and rescue
    decision1_5: {
      title: 'Reassessment — Additional Management Needed',
      conditionAlert: true,
      alertText: 'Initial resuscitation incomplete. Patient remains hemodynamically unstable.',
      alertSub: 'Reassess and address missing components of shock management.',
      vitals: [
        { lbl: 'HR',   val: '120',   unit: 'bpm',    st: 'vc' },
        { lbl: 'BP',   val: '78/42', unit: 'mm Hg',  st: 'vc' },
        { lbl: 'MAP',  val: '54',    unit: 'mm Hg',  st: 'vc' },
        { lbl: 'SpO₂', val: '91%',   unit: '6L NC',  st: 'vw' },
        { lbl: 'GCS',  val: '12',    unit: '/15',    st: 'vw' }
      ],
      prompt: 'The patient remains in shock. What additional interventions are needed?',
      placeholder: `Address missing components...
e.g.: Additional interventions, medications, consults, etc.`,
      branches: [
        {
          id: 'rescue-complete',
          label: '✓ RESCUE MANAGEMENT COMPLETE',
          type: 'good',
          triggers: ['norepi','norepinephrine','levophed','pressor','2l','2000','2400','2460','2500','2600','3l','3000','30 ml/kg','30 cc/kg','micu','icu'],
          requires: 2, // Need either more fluid or pressor, ideally both
          headline: 'Appropriate escalation of care',
          narrative: `You recognized the incomplete initial management and escalated appropriately. Norepinephrine is being started and MICU has been consulted.<br/><br/>
          <strong>Key Learning:</strong> Recognizing when initial management is inadequate and promptly escalating care is critical. This "rescue" prevented further deterioration.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '110',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '92/56', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '68',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '94%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `After completing resuscitation, MAP has improved to 68 mm Hg on norepinephrine 8 mcg/min. The patient is stabilizing.<br/><br/>
          MICU attending: <em>"Good recognition and escalation. Let's transfer to ICU for continued management."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Improved. GCS 13. More responsive.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Still ill-appearing but improving. Diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 110). Regular. Warming extremities.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. RR 24.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warming. Cap refill 2-3 sec (improved).' }
          ]
        },
        {
          id: 'rescue-fluid-only',
          label: '✓ ADDITIONAL FLUID GIVEN',
          type: 'warning',
          triggers: ['fluid'], // Simplified - actual check is in evaluateBranch
          requires: 1,
          excludes: ['norepi','norepinephrine','levophed','pressor'],
          headline: 'Adequate fluid volume achieved',
          narrative: `You've now given additional fluid. Combined with your initial order, the patient has received adequate fluid resuscitation (approximately 2.5L total for this 82 kg patient).<br/><br/>
          However, the patient remains hypotensive despite completing fluid resuscitation. MAP remains <65 mm Hg despite adequate volume. What's your next step?`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '116',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '84/48', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '60',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '93%',   unit: '4L NC',  st: 'vw' },
            { lbl: 'UO',    val: '18 mL', unit: 'last hr',st: 'vw' },
          ],
          vitalsMsg: `After completing fluid resuscitation, BP has improved slightly to 84/48 mm Hg (MAP 60 mm Hg). However, MAP remains <65 mm Hg despite adequate fluid.<br/><br/>
          RN: <em>"We've given the full amount now. His pressure is a little better but still low. What do you want to do next?"</em>`,
          nextDecision: 'decision1_6',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Slowly improving.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Diaphoretic. Still looks unwell.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes improving. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 116). Regular. Peripheral pulses palpable but weak.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. RR 26.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Slightly warmer but still cool. Cap refill 3 sec.' }
          ]
        },
        {
          id: 'rescue-pressor-only',
          label: '⚠ ADDED PRESSOR BUT STILL MISSING COMPONENTS',
          type: 'warning',
          triggers: ['norepi','norepinephrine','levophed','pressor'],
          requires: 1,
          excludes: ['micu','icu','2l','2000','2400','2460','2500','2600','3l','3000','30 ml/kg','30 cc/kg'],
          headline: 'Vasopressor started but management still incomplete',
          narrative: `Norepinephrine has been started, which addresses part of the problem. However, if initial fluid resuscitation was inadequate, additional fluid may still be needed. The nurse is setting up the norepinephrine infusion now.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '116',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '88/50', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '63',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '92%',   unit: '4L NC',  st: 'vw' },
            { lbl: 'Norepi',val: '10',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `MAP has improved to 63 mm Hg with norepinephrine. The patient is showing some improvement.<br/><br/>
          <strong>Charge Nurse approaches you:</strong><br/>
          <em>"Doctor, good call starting the norepinephrine. I'm seeing some improvement in his vitals. But I need to bring something up — typically when patients are on vasopressors like this, they need ICU-level monitoring. Should I call the MICU team to arrange transfer? Patients on pressors really need continuous monitoring and titration in the unit."</em>`,
          nextDecision: 'decision1_7',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Slowly improving.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing but stabilizing. Still diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 116). Regular rhythm. Peripheral pulses improving.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic (RR 26).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warming slightly. Cap refill 3 sec.' }
          ]
        },
        {
          id: 'rescue-micu-only',
          label: '⚠ CALLED MICU BUT HEMODYNAMIC SUPPORT STILL INCOMPLETE',
          type: 'warning',
          triggers: ['micu','icu','critical care','consult'],
          requires: 1,
          excludes: ['norepi','norepinephrine','pressor','2l','2000','2400','2460','2500','2600','3l','3000','30 ml/kg','30 cc/kg'],
          headline: 'MICU consulted but vasopressor not initiated',
          narrative: `MICU has been consulted, which is appropriate. However, the patient remains hypotensive (MAP <65 mm Hg) and requires immediate vasopressor support.<br/><br/>
          The MICU team arrives and immediately starts norepinephrine.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '118',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '86/48', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '61',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '92%',   unit: '4L NC',  st: 'vw' },
            { lbl: 'Norepi',val: '12',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `MICU team initiated norepinephrine. MAP slowly improving to 61 mm Hg.<br/><br/>
          MICU attending: <em>"In septic shock with MAP <65 despite fluids, don't wait for us to arrive — start the pressor. Time matters."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Slowly improving.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 118). Cool extremities.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Tachypneic.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool. Cap refill 3 sec.' }
          ]
        },
        {
          id: 'rescue-incomplete',
          label: '⚠ INSUFFICIENT ESCALATION',
          type: 'bad',
          triggers: [],
          requires: 0,
          headline: 'Critical interventions still missing',
          narrative: `The patient remains in shock. Additional diagnostic tests alone will not stabilize hemodynamics. Immediate priorities: vasopressor support (norepinephrine) for MAP <65 mm Hg and MICU consultation for ICU-level care.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '132',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '70/38', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '49',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '88%',   unit: '10L NRB',st: 'vc' },
            { lbl: 'GCS',   val: '10',    unit: '/15',    st: 'vc' },
          ],
          vitalsMsg: `Patient continues to deteriorate. MAP 49 mm Hg. GCS declining.<br/><br/>
          Charge nurse initiates overhead rapid response for additional support.`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Failure to Rescue:</strong><br/>
          • Patient had incomplete initial management AND incomplete rescue management<br/>
          • Septic shock with MAP <65 mm Hg requires immediate vasopressor (norepinephrine)<br/>
          • MICU consultation critical for ICU-level monitoring<br/>
          • Delayed escalation led to continued deterioration<br/><br/>
          <strong>Key Learning:</strong> When initial management is inadequate, recognize it quickly and escalate aggressively. "Failure to rescue" is a major cause of preventable mortality.`,
          decisions: ['Failed to escalate care appropriately', 'Review recognition of deteriorating patient', 'Immediate vasopressor support needed in refractory shock'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'<span class="hl">Severely altered. GCS 10. Minimally responsive.</span>' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Critically ill-appearing. Cold, mottled.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. Flat neck veins.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Severe tachycardia (HR 132). Weak, thready pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles. Tachypneic.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Distended, rigid.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'<span class="hl">Cold, mottled. No palpable peripheral pulses.</span>' }
          ]
        }
      ]
    },

    // DECISION POINT 1.6 — Post-fluid pressor decision
    decision1_6: {
      title: 'Persistent Hypotension Despite Adequate Fluid',
      conditionAlert: true,
      alertText: 'Completed 30 mL/kg fluid resuscitation, but MAP remains <65 mm Hg',
      alertSub: 'Patient has received adequate volume but remains hypotensive. Consider vasopressor support.',
      vitals: [
        { lbl: 'HR',   val: '116',   unit: 'bpm',    st: 'vw' },
        { lbl: 'BP',   val: '84/48', unit: 'mm Hg',  st: 'vw' },
        { lbl: 'MAP',  val: '60',    unit: 'mm Hg',  st: 'vw' },
        { lbl: 'SpO₂', val: '93%',   unit: '4L NC',  st: 'vw' },
        { lbl: 'Fluids', val: '2.5L', unit: '(30 mL/kg)', st: 'vn' }
      ],
      prompt: 'The patient has received adequate fluid resuscitation but MAP remains <65 mm Hg. What is your next step?',
      placeholder: `Next intervention...
e.g.: vasopressor, MICU consult, etc.`,
      branches: [
        {
          id: 'post-fluid-pressor-and-micu',
          label: '✓ VASOPRESSOR + MICU CONSULTATION',
          type: 'good',
          triggers: ['norepi','norepinephrine','levophed','pressor','vasopressor','micu','icu','critical care'],
          requires: 2,
          headline: 'Appropriate management of fluid-refractory shock',
          narrative: `Excellent decision-making. You completed adequate fluid resuscitation (30 mL/kg), recognized persistent hypotension (MAP <65 mm Hg), and appropriately initiated vasopressor support with MICU consultation.<br/><br/>
          <strong>Key Learning:</strong> In septic shock, if MAP remains <65 mm Hg despite adequate fluid (30 mL/kg), start norepinephrine. This is "fluid-refractory" shock and requires vasopressor support.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '108',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '96/58', unit: 'mm Hg',  st: 'vn' },
            { lbl: 'MAP',   val: '71',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '95%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
            { lbl: 'UO',    val: '35 mL', unit: 'last hr',st: 'vn' },
          ],
          vitalsMsg: `After initiating norepinephrine 8 mcg/min, MAP has improved to 71 mm Hg. Urine output improving. The patient is stabilizing.<br/><br/>
          MICU attending arrives: <em>"Perfect management. You recognized fluid-refractory shock and started pressors appropriately. Let's transfer to ICU for continued vasopressor titration and monitoring."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Improved. GCS 14. More alert and responsive.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Still ill-appearing but clearly improving. Less diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Mucous membranes improving. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 108). Regular rhythm. Warming extremities. Stronger pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. RR 22 (improved).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warming nicely. Cap refill 2 sec (much improved).' }
          ]
        },
        {
          id: 'post-fluid-pressor-only',
          label: '✓ VASOPRESSOR STARTED',
          type: 'good',
          triggers: ['norepi','norepinephrine','levophed','pressor','vasopressor'],
          requires: 1,
          excludes: ['micu','icu','critical care'],
          headline: 'Vasopressor appropriately initiated',
          narrative: `Good recognition. You identified fluid-refractory shock (MAP <65 despite 30 mL/kg fluid) and started norepinephrine. This is the correct next step.<br/><br/>
          The nurse is setting up the norepinephrine infusion now.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '110',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '92/54', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '67',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '94%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'Norepi',val: '10',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `MAP has improved to 67 mm Hg on norepinephrine. The patient is stabilizing.<br/><br/>
          <strong>Charge Nurse approaches you:</strong><br/>
          <em>"Doctor, I'm glad we started the norepinephrine. The patient looks better already. But I need to mention something — typically when patients are on pressors like this, they need ICU-level monitoring. Should I call the MICU team to arrange transfer? Patients on vasopressors really should be in the unit for continuous monitoring and titration."</em>`,
          nextDecision: 'decision1_7',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Improved. GCS 14. More alert and responsive.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Still ill-appearing but clearly improving. Less diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Mucous membranes improving. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 110). Regular rhythm. Warming extremities. Stronger pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. RR 22 (improved).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warming nicely. Cap refill 2 sec (much improved).' }
          ]
        },
        {
          id: 'post-fluid-more-fluid',
          label: '⚠ ADDITIONAL FLUID AFTER COMPLETING 30 mL/kg',
          type: 'warning',
          triggers: ['fluid','bolus','saline','lr','lactated','ringer','crystalloid','1l','1000','500'],
          requires: 1,
          excludes: ['norepi','norepinephrine','pressor'],
          headline: 'Excessive fluid without vasopressor',
          narrative: `You've already given 30 mL/kg fluid resuscitation. The patient remains hypotensive (MAP <65 mm Hg) despite adequate volume — this is "fluid-refractory" shock.<br/><br/>
          Further fluid without vasopressor support will not improve MAP and risks fluid overload. The appropriate next step is to start norepinephrine, not give more fluid.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '118',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '86/46', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '59',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '91%',   unit: '6L NC',  st: 'vw' },
            { lbl: 'Fluids',val: '3.5L',  unit: 'total',  st: 'vw' },
          ],
          vitalsMsg: `After an additional liter of fluid (now 3.5L total), BP remains low at 86/46 mm Hg. Patient is showing early signs of fluid overload with worsening oxygenation.<br/><br/>
          RN: <em>"Doctor, his pressure isn't coming up and he's getting more short of breath. I'm hearing crackles in both lungs now."</em>`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Inappropriate Fluid Escalation:</strong><br/>
          • Patient had already received adequate fluid (30 mL/kg = 2.5L)<br/>
          • MAP remained <65 mm Hg → this is "fluid-refractory" shock<br/>
          • Additional fluid without vasopressor = inappropriate and harmful<br/>
          • Patient developed fluid overload with pulmonary edema<br/><br/>
          <strong>Surviving Sepsis Guidelines:</strong><br/>
          1. Initial 30 mL/kg crystalloid in first 3 hours<br/>
          2. If MAP <65 mm Hg despite adequate fluid → START NOREPINEPHRINE<br/>
          3. Further fluid only if evidence of fluid responsiveness (PPV, PLR, IVC)<br/><br/>
          <strong>Teaching Point:</strong> Recognize fluid-refractory shock and transition to vasopressor support. More fluid is NOT always better.`,
          decisions: ['Excessive fluid administration', 'Failed to recognize fluid-refractory shock', 'Review indications for vasopressor initiation'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused. GCS 12. Anxious.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Ill-appearing. Increasingly dyspneic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Moist mucous membranes. JVD now present (fluid overload).' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 118). Bounding pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'<span class="hl">Bilateral crackles</span> (fluid overload). Increased work of breathing.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm, developing edema. Cap refill 2 sec.' }
          ]
        },
        {
          id: 'post-fluid-wait',
          label: '⚠ NO INTERVENTION',
          type: 'bad',
          triggers: [],
          requires: 0,
          headline: 'Delayed vasopressor initiation',
          narrative: `The patient has received adequate fluid (30 mL/kg) but MAP remains <65 mm Hg. This is fluid-refractory shock requiring immediate vasopressor support.<br/><br/>
          Waiting or ordering more labs without starting norepinephrine will allow continued hypoperfusion and organ damage.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '126',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '76/42', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '53',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '90%',   unit: '6L NC',  st: 'vw' },
            { lbl: 'Lactate',val:'6.2',   unit: 'mmol/L', st: 'vc' },
          ],
          vitalsMsg: `Without vasopressor support, the patient continues to deteriorate. BP dropping to 76/42 mm Hg. Repeat lactate now 6.2 mmol/L (worsening).<br/><br/>
          Overhead page: <em>"Rapid response, Tower 5 Bed 5. Patient deteriorating despite fluids."</em>`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Failure to Initiate Vasopressor:</strong><br/>
          • Patient received adequate fluid (30 mL/kg)<br/>
          • MAP remained <65 mm Hg = fluid-refractory shock<br/>
          • Norepinephrine should have been started immediately<br/>
          • Delay in vasopressor initiation led to continued hypoperfusion<br/>
          • Rising lactate and worsening organ dysfunction<br/><br/>
          <strong>Critical Learning:</strong> In septic shock, if MAP <65 mm Hg DESPITE adequate fluid resuscitation, start norepinephrine immediately. Every hour of delayed vasopressor support increases mortality.`,
          decisions: ['Failed to recognize fluid-refractory shock', 'Delayed vasopressor initiation', 'Review septic shock management algorithm'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Worsening confusion. GCS 11. Minimally responsive.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Critically ill-appearing. Cold, mottled.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. Flat neck veins.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Severe tachycardia (HR 126). Weak, thready pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles. Tachypneic (RR 30).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, tender.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'<span class="hl">Cold, mottled. Poor perfusion.</span>' }
          ]
        }
      ]
    },

    // DECISION POINT 1.7 — MICU consultation after pressor
    decision1_7: {
      title: 'ICU Transfer — Patient on Vasopressors',
      conditionAlert: true,
      alertText: 'Patient stabilizing on norepinephrine but requires ICU-level care',
      alertSub: 'The charge nurse is asking about MICU consultation for ICU transfer.',
      vitals: [
        { lbl: 'HR',   val: '110',   unit: 'bpm',    st: 'vw' },
        { lbl: 'BP',   val: '92/54', unit: 'mm Hg',  st: 'vw' },
        { lbl: 'MAP',  val: '67',    unit: 'mm Hg',  st: 'vn' },
        { lbl: 'SpO₂', val: '94%',   unit: '4L NC',  st: 'vn' },
        { lbl: 'Norepi', val: '10',  unit: 'mcg/min', st: 'vw' }
      ],
      prompt: 'The charge nurse is right — the patient is on vasopressors and needs ICU-level monitoring. What do you want to do?',
      placeholder: `Your response...
e.g.: MICU consult, ICU transfer, etc.`,
      branches: [
        {
          id: 'micu-consult-added',
          label: '✓ MICU CONSULTATION INITIATED',
          type: 'good',
          triggers: ['micu','icu','critical care','consult','intensivist','transfer'],
          requires: 1,
          headline: 'ICU transfer appropriately arranged',
          narrative: `Excellent. You recognized that any patient on vasopressors requires ICU-level monitoring and initiated MICU consultation.<br/><br/>
          <strong>Key Learning:</strong> Vasopressors = ICU care. Patients on norepinephrine need continuous hemodynamic monitoring, frequent titration, and close observation that can only be provided in an ICU setting.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '108',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '96/58', unit: 'mm Hg',  st: 'vn' },
            { lbl: 'MAP',   val: '71',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '95%',   unit: '4L NC',  st: 'vn' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
            { lbl: 'UO',    val: '35 mL', unit: 'last hr',st: 'vn' },
          ],
          vitalsMsg: `The MICU attending arrives and reviews the case. MAP is now 71 mm Hg on norepinephrine 8 mcg/min. Urine output is improving.<br/><br/>
          MICU Attending: <em>"Good management. You recognized septic shock, gave appropriate initial fluid resuscitation, started pressors for fluid-refractory shock, and called us for ICU transfer. That's exactly the right sequence. We'll take over from here and continue titrating the pressor. Nice work."</em>`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Alert and oriented. GCS 15. Responding appropriately.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Still ill but clearly improving. Much less diaphoretic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Mucous membranes moist. No JVD.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 108) but improved. Regular rhythm. Warm extremities. Strong pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. RR 20 (improved).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mild RLQ tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. Cap refill <2 sec (normal perfusion restored).' }
          ]
        },
        {
          id: 'no-micu-consult',
          label: '⚠ DECLINED ICU TRANSFER',
          type: 'bad',
          triggers: [],
          requires: 0,
          headline: 'Inappropriate decision to keep patient on floor',
          narrative: `You chose not to call the MICU despite the patient being on vasopressors. This is inappropriate and potentially dangerous.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '118',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '86/48', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '61',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '91%',   unit: '4L NC',  st: 'vw' },
            { lbl: 'Norepi',val: '15',    unit: 'mcg/min',st: 'vc' },
          ],
          vitalsMsg: `Without ICU-level monitoring, the patient's condition worsens. The floor nurse is unable to properly titrate the norepinephrine infusion. MAP is dropping and the pressor dose has escalated to 15 mcg/min.<br/><br/>
          Overhead page: <em>"Rapid response, Tower 5. Patient on pressors deteriorating on the floor. We need ICU backup NOW."</em><br/><br/>
          The MICU team arrives emergently and immediately transfers the patient to the ICU.`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Critical Error — Inappropriate Floor Management:</strong><br/>
          • Patient on vasopressors MUST be in ICU<br/>
          • Floor nurses are not trained to titrate pressors<br/>
          • Lack of continuous monitoring led to deterioration<br/>
          • This represents a serious lapse in judgment<br/><br/>
          <strong>Absolute Rule:</strong> Vasopressors = ICU. There are NO exceptions. Any patient requiring norepinephrine, vasopressin, epinephrine, or other vasopressors must be managed in an ICU setting with appropriate monitoring and nursing expertise.<br/><br/>
          <strong>Teaching Point:</strong> The floor is not equipped for vasopressor management. Even if the patient seems stable, vasopressor titration requires ICU-level care.`,
          decisions: ['Inappropriately kept patient on floor', 'Failed to recognize ICU indication', 'Review absolute indications for ICU transfer'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Worsening confusion. GCS 12. Lethargic.' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Deteriorating. Diaphoretic. Anxious.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. Flat neck veins.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic (HR 118). Thready pulses.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles. Tachypneic (RR 26).' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, tender.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool extremities. Poor perfusion.' }
          ]
        }
      ]
    },

    // DECISION POINT 2 — vasopressor escalation
    decision2: {
      title: 'Vasopressor Escalation — MICU Management',
      prompt: 'The patient remains on norepinephrine. Current dose is trending up to 12 mcg/min and MAP is marginal at 62-64 mm Hg. What is your next step?',
      placeholder: `Enter escalation plan...
e.g.: Additional medications, procedures, labs, etc.`,
      branches: [
        {
          id: 'vasopressin-and-steroids',
          label: '✓ COMPLETE ESCALATION',
          type: 'good',
          triggers: ['vasopressin','pitressin','hydrocortisone','steroid','50 mg','100 mg','stress dose'],
          requires: 2,
          headline: 'Appropriate vasopressor escalation with steroids',
          narrative: `Excellent escalation strategy. You added:<br/>
          • <span class="hl">Vasopressin 0.03 units/min</span> — per VASST trial, add when norepinephrine exceeds 10-15 mcg/min<br/>
          • <span class="hl">Hydrocortisone 50 mg IV q6h</span> (or 100 mg q8h) — stress-dose steroids for refractory septic shock<br/><br/>
          Over the next 2 hours, norepinephrine is titrated down to 8 mcg/min. MAP stabilizes at 68-72 mm Hg. Lactate trending down from 4.5 to 3.1 mmol/L.`,
          nextDecision: null,
          endState: 'good',
          endMsg: 'Excellent shock management. Patient stabilized on multimodal vasopressor support (norepinephrine + vasopressin) with stress-dose steroids. Continue source control, de-escalate antibiotics based on cultures, wean pressors as tolerated, and monitor for complications.',
          decisions: ['30 mL/kg fluid resuscitation', 'Started norepinephrine first-line', 'Consulted MICU appropriately', 'Added vasopressin per VASST trial (norepi >10 mcg/min)', 'Initiated stress-dose steroids for refractory shock']
        },
        {
          id: 'vasopressin-only',
          label: '✓ VASOPRESSIN ADDED',
          type: 'good',
          triggers: ['vasopressin','pitressin'],
          requires: 1,
          excludes: ['hydrocortisone','steroid'],
          headline: 'Vasopressin escalation appropriate',
          narrative: `You added <span class="hl">vasopressin 0.03 units/min</span> — correct per VASST trial when norepinephrine exceeds 10 mcg/min.<br/><br/>
          MAP improves to 66-68 mm Hg. Norepinephrine requirements decrease slightly.<br/><br/>
          Consider adding <span class="hl">stress-dose steroids (hydrocortisone 50 mg q6h or 100 mg q8h)</span> for refractory septic shock, especially if requiring high-dose or multi-vasopressor support.`,
          nextDecision: null,
          endState: 'good',
          endMsg: 'Good vasopressor escalation. Patient improved with norepinephrine + vasopressin. Consider stress-dose steroids if shock persists or worsens.',
          decisions: ['Appropriate fluid resuscitation', 'Norepinephrine first-line', 'MICU consultation', 'Vasopressin added appropriately', 'Consider steroids if shock remains refractory']
        },
        {
          id: 'steroids-only',
          label: '⚠ STEROIDS WITHOUT VASOPRESSIN',
          type: 'warning',
          triggers: ['hydrocortisone','steroid','50 mg','100 mg'],
          requires: 1,
          excludes: ['vasopressin'],
          headline: 'Steroids initiated but vasopressor not optimized',
          narrative: `You started stress-dose steroids, which is appropriate for refractory shock. However, when norepinephrine exceeds 10 mcg/min, <span class="hl">vasopressin should be added first</span> per VASST trial guidelines before escalating to other agents.<br/><br/>
          Vasopressin (0.03 units/min, fixed dose) is a second-line vasopressor that works synergistically with norepinephrine and may allow de-escalation of norepi dose.`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Initial Management:</strong> Ensure 30 mL/kg fluid resuscitation, blood cultures, early antibiotics, and MICU consultation were addressed.<br/><br/>
          <strong>Vasopressor Escalation:</strong> Steroids are appropriate but vasopressor escalation should follow guidelines: norepinephrine first-line, then vasopressin when norepi >10 mcg/min.`,
          decisions: ['Initial resuscitation appropriate', 'Steroids given', 'Missed opportunity to add vasopressin first', 'Review septic shock management priorities']
        },
        {
          id: 'more-norepi-only',
          label: '⚠ CONTINUING NOREPINEPHRINE ALONE',
          type: 'warning',
          triggers: ['increase','titrate','more norepi','higher dose'],
          requires: 1,
          excludes: ['vasopressin','hydrocortisone','steroid'],
          headline: 'Norepinephrine escalation without adding second agent',
          narrative: `You continued escalating norepinephrine alone. While this may temporarily maintain MAP, guidelines recommend adding <span class="hl">vasopressin 0.03 units/min when norepinephrine exceeds 10 mcg/min</span> (VASST trial).<br/><br/>
          Single high-dose norepinephrine is associated with increased arrhythmias and may worsen tissue perfusion due to excessive vasoconstriction. Multimodal vasopressor therapy is preferred.`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Initial Management:</strong> Review fluid resuscitation (30 mL/kg), early antibiotics, and MICU consultation timing.<br/><br/>
          <strong>Vasopressor Escalation:</strong> High-dose single-agent vasopressor support is suboptimal. Add vasopressin when norepi >10 mcg/min, then consider stress-dose steroids.`,
          decisions: ['Initial resuscitation done', 'Did not follow multi-vasopressor escalation guidelines', 'Review sepsis bundle components']
        },
        {
          id: 'default2',
          label: 'ORDERS RECEIVED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Orders documented',
          narrative: `Vasopressor escalation algorithm:<br/>
          • <strong>Norepinephrine</strong> 4-20 mcg/min first-line<br/>
          • <strong>Vasopressin</strong> 0.03-0.04 units/min when norepi >10 mcg/min<br/>
          • <strong>Hydrocortisone</strong> 50 mg IV q6h (or 100 mg q8h) for refractory shock<br/>
          • Consider <strong>epinephrine</strong> if still refractory`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Initial Management Review:</strong><br/>
          • 30 mL/kg fluid resuscitation (~2,460 mL for 82 kg patient) within first 3 hours<br/>
          • Blood cultures before antibiotics<br/>
          • Broad-spectrum antibiotics within 1 hour<br/>
          • Vasopressors if MAP remains <65 mm Hg after fluids<br/>
          • MICU consultation for ICU-level monitoring<br/><br/>
          <strong>Vasopressor Escalation:</strong> norepinephrine → vasopressin (when >10 mcg/min) → steroids → epinephrine.`,
          decisions: ['Review septic shock bundles', 'Revisit multimodal vasopressor approach']
        }
      ]
    },

    // DECISION POINT 2B — secondary escalation (vasopressin/steroids)
    decision2Delayed: {
      title: 'Urgent Vasopressor Start — Delayed',
      conditionAlert: true,
      alertText: 'No vasopressor has been started. MAP is critically low. End-organ ischemia is developing.',
      alertSub: 'Fluids alone are insufficient for septic shock once MAP <65 despite resuscitation.',
      vitals: [
        { lbl: 'HR',   val: '132',   unit: 'bpm',    st: 'vc' },
        { lbl: 'BP',   val: '72/38', unit: 'mm Hg',  st: 'vc' },
        { lbl: 'MAP',  val: '49',    unit: 'mm Hg',  st: 'vc' },
        { lbl: 'SpO₂', val: '86%',   unit: '10L NRB',st: 'vc' },
        { lbl: 'GCS',  val: '9',     unit: '/15',    st: 'vc' }
      ],
      prompt: 'Start vasopressor support now. Which agent and at what dose?',
      placeholder: 'Enter vasopressor order now...',
      branches: [
        {
          id: 'late-norepi',
          label: 'VASOPRESSOR STARTED',
          type: 'warning',
          triggers: ['norepi','norepinephrine','levophed','vasopressor','pressor','dopamine','epinephrine','adrenalin'],
          requires: 1,
          headline: 'Vasopressor initiated — but delayed',
          narrative: `Norepinephrine is now running. MAP begins to recover toward 62 mm Hg over 20 minutes. However, the delay has resulted in worsening end-organ dysfunction — creatinine has risen and the GCS is lower.<br/><br/>
          <strong>Key learning:</strong> Norepinephrine should not wait for central access. Peripheral pressor via antecubital or larger peripheral IV with frequent site checks is safe for short-term bridging.`,
          nextDecision: 'decision2',
          endState: 'concern',
          endMsg: null,
          decisions: []
        },
        {
          id: 'default-delayed',
          label: 'ORDERS RECEIVED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Vasopressor needed urgently',
          narrative: 'Start norepinephrine immediately. Do not delay for line placement.',
          nextDecision: null,
          endState: 'concern',
          endMsg: 'Vasopressor was not initiated promptly. In septic shock unresponsive to initial fluids, norepinephrine should be started early — including peripherally.',
          decisions: ['Vasopressor delay led to prolonged end-organ hypoperfusion']
        }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────
  // CASE 2: MASSIVE PE
  // ──────────────────────────────────────────────────────────────
  {
    id: 'cc-2',
    title: 'Case #2',
    blurb: 'Sudden cardiopulmonary compromise requiring time-critical diagnostic and therapeutic decisions.',
    artType: 'pe',
    patient: { name: 'Ruth Nakamura', initials: 'RN', age: '83F', weight: '58 kg', allergies: 'PCN (Rash)' },

    vignette: `<p>An 83-year-old woman with <span class="hl">paraesophageal hernia, moderate aortic stenosis, remote colon cancer, early Alzheimer's</span> was admitted for a 2-day history of nausea/vomiting with CT findings of mild small bowel obstruction.</p><p>She was NPO × 24h, improved, and was advanced to liquids. Surgery deferred: "medical management per primary." She was ambulating to the bathroom when you receive a page from the nurse:</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">Tower 3 · Bed 12</div><div class="pager-time">22:18</div></div></div><div class="pager-msg">"Patient suddenly very short of breath and confused. O2 sat dropping into 70s. Please come urgently."</div></div><p>A rapid response team is called.</p>`,

    rnReport: `"She was totally fine at lunch, asking for her daughter. Now she's confused and her sat just dropped to 84% on 6 liters. Her pulse is 128. She doesn't have a fever. Lungs sound clear to me — I don't understand why she can't breathe. She hasn't been out of bed since she came in two days ago."`,
    rnCues: [
      'Look at the monitor. Note the vital signs.',
      'Verbalize your differential diagnosis for hypoxia or respiratory distress.'
    ],

    vitals: [
      { lbl: 'HR',   val: '118',   unit: 'bpm, sinus', st: 'vw' },
      { lbl: 'BP',   val: '107/64', unit: 'mm Hg',      st: 'vw' },
      { lbl: 'RR',   val: '28',    unit: '/min',        st: 'vc' },
      { lbl: 'SpO₂', val: '86%',   unit: '6L NC',      st: 'vc' },
      { lbl: 'Temp', val: '36.8°C',unit: 'oral',        st: 'vn' },
      { lbl: 'JVP',  val: 'Elevated', unit: '~10 cm',  st: 'vw' }
    ],

    labs: [
      { lbl: 'pH',       val: '7.47',  unit: 'ABG',    st: 'lv-a' },
      { lbl: 'PaCO₂',   val: '30',    unit: 'mm Hg',  st: 'lv-a' },
      { lbl: 'PaO₂',    val: '52',    unit: 'mm Hg',  st: 'lv-c' },
      { lbl: 'Lactate',  val: '5.2',   unit: 'mmol/L', st: 'lv-c' },
      { lbl: 'Troponin', val: '53',    unit: 'mildly↑',st: 'lv-a' },
      { lbl: 'BNP',      val: '302',   unit: 'pg/mL',  st: 'lv-a' },
      { lbl: 'Creat',    val: '1.4',   unit: '(bl 1.0)',st:'lv-a' }
    ],

    examSystems: [
      { icon:'😰', lbl:'General', key:'gen',     text:'Ill-appearing. Anxious. Diaphoretic. Cyanotic lips. Speaking in short phrases.' },
      { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Confused, disoriented. GCS 13. Answering questions briefly. No focal deficits.' },
      { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic. Elevated JVP ~12 cm. Loud P2 component. Cool extremities.' },
      { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Clear bilaterally. No crackles, no wheeze. Tachypneic.' },
      { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft. Mild distension consistent with SBO history. Non-tender.' },
      { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool. Right thigh appears slightly fuller/warmer than left. No pitting edema.' }
    ],

    pocus: {
      rows: [
        { k:'PSAX',    v:'RV dilation with septal flattening — D-sign present' },
        { k:'A4C',     v:'RV > LV (RV:LV ratio >1.0) — severe RV dilation' },
        { k:'IVC',     v:'Plethoric, >2.1 cm, <50% respiratory variation' },
        { k:'Lungs',   v:'A-lines bilaterally — no pulmonary edema' },
        { k:'Pericard',v:'No pericardial effusion' }
      ],
      interp: 'Obstructive shock from massive PE with acute RV failure. D-sign + RV > LV + plethoric IVC = classic acute cor pulmonale. Do NOT give large fluid boluses — this will worsen RV distension.'
    },

    decision1: {
      title: 'Initial Stabilization',
      prompt: 'The patient is severely hypoxic and tachypneic. What are your immediate orders?',
      placeholder: `Enter initial management orders...
e.g.: Labs, imaging, oxygen, medications, consults, etc.`,
      branches: [
        {
          id: 'pe-complete',
          label: '✓ COMPREHENSIVE PE MANAGEMENT',
          type: 'good',
          triggers: ['oxygen','nrb','norepinephrine','norepi','levophed','heparin','anticoagul','pert','micu','icu'],
          requires: 4, // Need oxygen + norepi + heparin + PERT/MICU
          headline: 'Correct stabilization for massive PE with team activation',
          narrative: `Excellent management:<br/>
          • <span class="hl">Oxygen escalated to NRB 15L</span><br/>
          • <span class="hl">Norepinephrine started</span> — maintains SVR without excessive tachycardia<br/>
          • <span class="hl">Heparin initiated</span> — prevents clot propagation<br/>
          • <span class="hl">PERT team activated</span> — multidisciplinary PE response<br/><br/>
          You correctly avoided large fluid boluses in RV failure.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '118',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '86/50', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '62',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '90%',   unit: 'NRB 15L',st: 'vw' },
            { lbl: 'Norepi',val: '10',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `SpO₂ improved to 90% on NRB. MAP is 62 mm Hg on norepinephrine 10 mcg/min — still critically hypotensive. Heparin infusing.<br/><br/>PERT team arrives: <em>"We've reviewed the POCUS. Confirmed massive PE with RV failure. No absolute contraindications to thrombolysis. This patient needs MICU and we need to make a thrombolysis decision now."</em>`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-good-no-pert',
          label: '⚠ GOOD MANAGEMENT BUT PERT NOT CALLED',
          type: 'warning',
          triggers: ['oxygen','nrb','norepinephrine','norepi','levophed','heparin'],
          requires: 3,
          excludes: ['pert','pe team','pulmonary embolism response'],
          headline: 'Appropriate stabilization but missing PERT activation',
          narrative: `You escalated oxygen, started norepinephrine, and initiated heparin — good initial management. However, <span class="hl">massive PE requires PERT (Pulmonary Embolism Response Team) activation</span>.<br/><br/>
          PERT provides rapid multidisciplinary assessment for thrombolysis vs catheter-directed therapy vs surgical embolectomy decisions.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '122',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '82/48', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '59',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '89%',   unit: 'NRB 15L',st: 'vw' },
            { lbl: 'Norepi',val: '12',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `The charge nurse pages the PERT team independently. The intensivist and interventional cardiology fellow arrive: <em>"This is a massive PE — we should have been called immediately. Let's get to MICU and discuss thrombolysis."</em>`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-fluids',
          label: '⚠ LARGE FLUID BOLUS GIVEN',
          type: 'bad',
          triggers: ['1l','1000','1500','2l','2000','fluid bolus','normal saline','lactated ringer','liter'],
          requires: 1,
          excludes: ['small','cautious','250','500'],
          headline: 'Large fluid bolus — harmful in RV failure',
          narrative: `You gave a large fluid bolus. In obstructive shock with RV failure, aggressive fluid loading is <span class="hl">harmful</span>. The RV is already severely distended and pressure-overloaded.<br/><br/>
          After the bolus: HR → 148, BP paradoxically drops to <span class="hl">66/38 mm Hg</span>. The patient becomes less responsive. POCUS shows worsening RV dilation with interventricular septal shift bowing into the LV.`,
          showVitalsButton: true,
          showCodeBlue: true, // NEW: trigger code blue modal
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA — Obstructive)',
            overhead: 'Code Blue, ICU Bed 12. Code Blue, ICU Bed 12. PERT Team to ICU Bed 12.',
            cause: 'Obstructive PEA from worsened RV failure after large fluid bolus. In massive PE, the RV is already critically distended. Aggressive fluid loading → further RV dilation → interventricular septal shift → impaired LV filling → complete cardiovascular collapse.',
            monitor_phrase: 'Look at the monitor — PEA. RV is maximally distended on POCUS. No pulse on check.',
            hs_ts: [
              'Thrombosis (PE) ← PRIMARY CAUSE — consider thrombolytics',
              'Tension pneumothorax (rule out)',
              'Tamponade (rule out — can mimic PE hemodynamics)',
              'Hypovolemia (relative)',
              'Hypoxia',
              'Hydrogen ion (lactic acidosis)'
            ],
            acls_specifics: [
              'Consider systemic thrombolytics during CPR — tPA 100mg IV over 2 hours',
              'If thrombolytics given: CPR must continue × 60–90 min for drug to work',
              'Do NOT give more fluid — RV overload is the mechanism',
              'Epinephrine 1mg IV q3–5 min',
              'Post-ROSC: emergent CTPA or echo, PERT consultation, consider catheter-directed therapy'
            ],
            rosc_label: '✓ ROSC Achieved — PERT Team Taking Over →'
          },
          nextVitals: [
            { lbl: 'HR',    val: '148',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '66/38', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '47',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '82%',   unit: '6L NC',  st: 'vc' },
            { lbl: 'GCS',   val: '10',    unit: '/15',    st: 'vc' },
          ],
          vitalsMsg: `<strong>Key learning:</strong> In obstructive shock, fluids worsen RV dilation → impair LV filling → reduce CO → more hypotension. Limit to 250-500 mL only if clearly preload-responsive.<br/><br/>
          After ROSC, the PERT team and MICU continue advanced resuscitation and stabilization.`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-no-anticoag',
          label: '⚠ NO ANTICOAGULATION STARTED',
          type: 'warning',
          triggers: ['oxygen','nrb','norepinephrine','norepi','levophed'],
          requires: 2,
          excludes: ['heparin','anticoagul','lovenox','enoxaparin','pert','micu','icu'],
          headline: 'Hemodynamic support without anticoagulation',
          narrative: `You escalated oxygen and started norepinephrine, but <span class="hl">did not initiate anticoagulation</span>. Consider empiric anticoagulation while diagnostic workup proceeds.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '128',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '76/44', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '55',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '87%',   unit: 'NRB 15L',st: 'vc' },
            { lbl: 'Norepi',val: '8',     unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `Norepinephrine is infusing. MAP remains critically low. RN: <em>"Should we start heparin? And should we call the PERT team or MICU?"</em>`,
          nextDecision: 'decision1_5'
        },
        {
          id: 'pe-oxygen-only',
          label: '⚠ INADEQUATE INITIAL MANAGEMENT',
          type: 'warning',
          triggers: ['oxygen','nrb','15l','non-rebreather'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed','heparin','anticoagul','pert','micu'],
          headline: 'Only oxygen escalated',
          narrative: `You escalated oxygen to NRB, which is appropriate. However, this patient is in shock (MAP 53, lactate 5.2) and needs immediate vasopressor support and anticoagulation.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '136',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '72/40', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '51',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '88%',   unit: 'NRB 15L',st: 'vw' },
          ],
          vitalsMsg: `SpO₂ improved slightly but patient remains in shock. RN: <em>"Blood pressure is still very low. Do we need pressors? Should I call MICU?"</em>`,
          nextDecision: 'decision1_5'
        },
        {
          id: 'pe-diagnostic-workup',
          label: 'DIAGNOSTIC WORKUP ORDERED',
          type: 'neutral',
          triggers: [/\bcta\b/,/\bctpa\b/,/\bct.?pulmonary\b/,/\bct.?angio\b/,/\becho\b/,/\bechocardiogram\b/,/\bimaging\b/],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed','heparin','anticoagul','pert','1l','2l','1000','2000','liter','bolus'],
          headline: 'Diagnostic imaging ordered',
          narrative: `You've ordered diagnostic imaging. The team is mobilizing to get the study completed.<br/><br/>
          While awaiting results, the patient remains tachypneic and hypoxic but hemodynamically stable enough for imaging.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '122',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '102/60', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '74',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'SpO₂',  val: '88%',   unit: '6L NC',  st: 'vc' },
          ],
          vitalsMsg: `Diagnostic imaging is being processed. Patient remains stable for workup. The nurse asks: "While we're waiting for results, do you want to start any empiric treatment?"`,
          nextDecision: 'decision1_5'
        },
        {
          id: 'pe-default',
          label: 'ORDERS RECEIVED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Orders documented',
          narrative: `Orders have been sent. The nurse is implementing your management plan.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '136',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '72/38', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '49',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '85%',   unit: '6L NC',  st: 'vc' },
          ],
          vitalsMsg: `Patient remains critically unstable.`,
          nextDecision: 'decision1_5'
        }
      ]
    },

    decision1_5: {
      title: 'Bedside Reassessment — Additional Orders',
      conditionAlert: true,
      alertText: 'Patient remains in shock. Management is incomplete.',
      alertSub: 'Consider vasopressor support, underlying cause, and critical care consultation.',
      vitals: [
        { lbl: 'HR',   val: '136',   unit: 'bpm',    st: 'vc' },
        { lbl: 'BP',   val: '70/38', unit: 'mm Hg',  st: 'vc' },
        { lbl: 'MAP',  val: '49',    unit: 'mm Hg',  st: 'vc' },
        { lbl: 'SpO₂', val: '86%',   unit: 'NRB 15L',st: 'vc' },
      ],
      prompt: 'What additional management is needed now?',
      placeholder: 'Add interventions...',
      branches: [
        {
          id: 'pe-rescue-complete',
          label: '✓ COMPLETE MANAGEMENT',
          type: 'good',
          triggers: ['norepinephrine','norepi','levophed','heparin','anticoagul','pert','micu'],
          requires: 3, // Need pressor + anticoag + team
          headline: 'Essential interventions added',
          narrative: `You completed the management plan:<br/>
          • <span class="hl">Norepinephrine started</span> — maintains SVR<br/>
          • <span class="hl">Heparin initiated</span> — prevents clot propagation<br/>
          • <span class="hl">PERT/MICU team activated</span> — for advanced management<br/><br/>
          Critical interventions are now in place.`,
          showVitalsButton: true,
          showMICUTransfer: true,
          nextVitals: [
            { lbl: 'HR',    val: '122',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',    val: '84/48', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '60',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '89%',   unit: 'NRB 15L',st: 'vw' },
            { lbl: 'Norepi',val: '12',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `MAP improving to 60 mm Hg on norepinephrine. Heparin infusing.<br/><br/>PERT team arrives: <em>"We've reviewed the case. This is massive PE with hemodynamic instability. We need to make a thrombolysis decision now."</em>`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-rescue-heparin-team-no-pressor',
          label: '⚠ ANTICOAGULATION AND TEAM WITHOUT PRESSOR',
          type: 'warning',
          triggers: ['heparin','anticoagul','pert','micu'],
          requires: 2, // heparin + (pert or micu)
          excludes: ['norepinephrine','norepi','levophed'],
          headline: 'Anticoagulation and team called, but vasopressor missing',
          narrative: `Good initial steps — heparin started and critical care team called. However, patient remains in shock (MAP 49 mm Hg) and requires vasopressor support. Norepinephrine is first-line for obstructive shock.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '138',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '72/40', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '51',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '87%',   unit: 'NRB 15L',st: 'vw' },
          ],
          vitalsMsg: `Heparin infusing. MICU team arrives and immediately starts norepinephrine for hemodynamic support. RN: <em>"They're taking over the pressor management."</em><br/><br/>PERT consult is also activated to discuss thrombolysis.`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-rescue-pressor-only',
          label: '⚠ PRESSOR WITHOUT ANTICOAGULATION',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed'],
          requires: 1,
          excludes: ['heparin','anticoagul'],
          headline: 'Vasopressor started but anticoagulation missing',
          narrative: `Norepinephrine is helping support blood pressure. However, anticoagulation has not been started. In suspected PE, heparin should be initiated empirically while awaiting definitive therapy.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '128',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '80/46', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',   val: '57',    unit: 'mm Hg',  st: 'vw' },
            { lbl: 'SpO₂',  val: '88%',   unit: 'NRB 15L',st: 'vw' },
            { lbl: 'Norepi',val: '10',    unit: 'mcg/min',st: 'vw' },
          ],
          vitalsMsg: `RN: <em>"Should I start heparin? The PERT team is asking if we're anticoagulating."</em><br/><br/>The charge nurse initiates heparin protocol and pages PERT team.`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-rescue-fluids',
          label: '⚠ LARGE FLUID BOLUS IN RV FAILURE',
          type: 'bad',
          triggers: ['1l','1000','1500','2l','2000','fluid','bolus','normal saline','lactated ringer','liter','ns','lr'],
          requires: 1,
          excludes: ['small','cautious','250','500'],
          headline: 'Large fluid bolus worsens RV failure',
          narrative: `You ordered additional fluid resuscitation despite the patient already showing signs of RV failure from massive PE.<br/><br/>
          In obstructive shock with RV dysfunction, large fluid boluses are <span class="hl">contraindicated</span>. The RV is already pressure-overloaded and cannot handle additional preload.<br/><br/>
          After the fluid bolus: HR → 152, BP drops to <span class="hl">58/32 mm Hg</span>. The patient becomes unresponsive. Monitor shows PEA arrest.`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA — Obstructive)',
            overhead: 'Code Blue, ICU Bed 12. Code Blue, ICU Bed 12. PERT Team Stat.',
            cause: 'Obstructive PEA from RV failure worsened by fluid loading in massive PE. The RV was already at maximum capacity. Bolus → acute RV dilation → bowing of interventricular septum (D-sign) → complete LV inflow obstruction → cardiovascular collapse.',
            monitor_phrase: 'Look at the monitor — PEA. POCUS: D-sign, RV larger than LV, no effective output.',
            hs_ts: [
              'Thrombosis (massive PE) ← CAUSE — thrombolytics during CPR if confirmed',
              'Tamponade (can mimic PE — rule out with POCUS)',
              'Tension pneumothorax (rule out)',
              'Hypoxia',
              'Hypovolemia (relative — do NOT give more fluid)'
            ],
            acls_specifics: [
              'tPA 100mg IV during CPR if massive PE is confirmed or strongly suspected',
              'CPR must continue 60–90 minutes after thrombolytic for drug effect',
              'Absolutely do NOT give more IV fluid — contraindicated in RV failure',
              'Epinephrine 1mg IV q3–5 min',
              'Emergent PERT consultation after ROSC',
              'Consider mechanical circulatory support (VA-ECMO) if available'
            ],
            rosc_label: '✓ ROSC After Thrombolytics — PERT Team Assuming Care →'
          },
          nextVitals: [
            { lbl: 'HR',    val: '152',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '58/32', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '41',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '78%',   unit: 'NRB',    st: 'vc' },
            { lbl: 'GCS',   val: '3',     unit: '/15',    st: 'vc' },
          ],
          vitalsMsg: `<strong>Critical Error:</strong> Large volume fluid administration in massive PE with RV dysfunction caused acute RV distension → complete hemodynamic collapse → PEA arrest.<br/><br/>
          After ROSC is achieved, emergency PERT consultation is called. The team proceeds with emergent catheter-directed thrombolysis in the ICU.`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-rescue-anticoag-only',
          label: '⚠ ANTICOAGULATION WITHOUT PRESSOR',
          type: 'warning',
          triggers: ['heparin','anticoagul','lovenox'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed'],
          headline: 'Anticoagulation without vasopressor support',
          narrative: `Heparin started — appropriate. However, patient is in shock (MAP 49) and requires vasopressor support. Norepinephrine is first-line for obstructive shock.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '140',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '68/40', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '49',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '87%',   unit: 'NRB 15L',st: 'vw' },
          ],
          vitalsMsg: `Heparin infusing but MAP remains critically low. RN: <em>"Do you want to start a pressor? Should I call the MICU?"</em><br/><br/>The rapid response team initiates norepinephrine and pages PERT.`,
          nextDecision: 'decision2'
        },
        {
          id: 'pe-rescue-default',
          label: 'ADDITIONAL ORDERS NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Critical interventions still needed',
          narrative: `The patient remains hemodynamically unstable. Additional management is required.<br/><br/>
          Massive PE requires: vasopressor support (norepinephrine), anticoagulation (heparin), and PERT activation for advanced therapy discussion.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '138',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '74/42', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '53',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '86%',   unit: 'NRB 15L',st: 'vc' },
          ],
          vitalsMsg: `RN: <em>"The patient is still very hypotensive. What else should we do? Should I call the PERT team and MICU?"</em>`,
          nextDecision: 'decision1_5'
        }
      ]
    },

    decision2: {
      title: 'PERT Conference — Treatment Strategy Decision',
      prompt: 'PERT team has assembled: Interventional Radiology, Pulmonary/Critical Care, Cardiology, and Primary Medicine. The patient remains critically ill with massive PE and hemodynamic instability. The team is discussing treatment options. What is your recommendation?',
      placeholder: `Enter your treatment recommendation...
e.g.: Treatment strategy, rationale, monitoring plan, etc.`,
      branches: [
        {
          id: 'pert-systemic-tpa',
          label: '✓ SYSTEMIC THROMBOLYSIS RECOMMENDED',
          type: 'good',
          triggers: ['systemic','tpa','alteplase','thrombolysis','100 mg','100mg','bedside'],
          requires: 1,
          headline: 'Appropriate recommendation for systemic tPA',
          narrative: `You present to the PERT team: "This is massive PE with hemodynamic instability. No absolute contraindications identified. I recommend systemic alteplase 100 mg IV over 2 hours at bedside."<br/><br/>
          <strong>PERT discussion:</strong><br/>
          <span class="hl">IR:</span> "We could take her to the cath lab for thrombectomy, but she's very unstable. Transport risk is high."<br/>
          <span class="hl">Cardiology:</span> "Agree with systemic lysis. It's faster, done at bedside, and first-line per guidelines for massive PE."<br/>
          <span class="hl">Pulm/Crit Care:</span> "No contraindications. Let's proceed with tPA and keep cath-directed as backup if she doesn't respond."<br/><br/>
          <strong>Decision: Systemic thrombolysis approved.</strong><br/><br/>
          Alteplase 100 mg IV infusion started. Heparin held. At 45 minutes: BP rises to <span class="hl">104/68 mm Hg</span>, SpO₂ 94%, HR 108. Patient opens eyes and asks "where am I?"`,
          nextDecision: null,
          endState: 'good',
          endMsg: 'Excellent PERT activation and treatment recommendation. Systemic thrombolysis resulted in rapid hemodynamic improvement. Patient stable in MICU on anticoagulation.',
          decisions: ['Recognized massive PE', 'Avoided large fluid bolus in RV failure', 'Started norepinephrine appropriately', 'Activated PERT team', 'Recommended systemic tPA as first-line', 'Team consensus for bedside lysis over cath lab', 'Successful reperfusion therapy']
        },
        {
          id: 'pert-catheter-directed',
          label: '✓ CATHETER-DIRECTED THERAPY RECOMMENDED',
          type: 'good',
          triggers: ['catheter','thrombectomy','catheter-directed','cath lab','ir','interventional'],
          requires: 1,
          excludes: ['systemic','bedside tpa','100 mg iv'],
          headline: 'Catheter-directed therapy recommended',
          narrative: `You present: "I recommend catheter-directed therapy with IR thrombectomy."<br/><br/>
          <strong>PERT discussion:</strong><br/>
          <span class="hl">IR:</span> "We can do this, but she'll need transport to the cath lab. Current MAP 58 — that's borderline for safe transport. We'd need about 45-60 minutes to get set up."<br/>
          <span class="hl">Cardiology:</span> "For massive PE this unstable, systemic tPA at bedside is faster and guideline first-line. Catheter-directed is better for intermediate-high risk or if systemic lysis fails."<br/>
          <span class="hl">Pulm/Crit Care:</span> "I agree. She's too unstable for transport. Let's do systemic lysis now, and if she doesn't respond in 2 hours, we can reassess for rescue catheter-directed therapy."<br/><br/>
          <strong>Team consensus: Start systemic tPA, catheter-directed as backup.</strong><br/><br/>
          Alteplase started. At 40 minutes: BP 102/66, SpO₂ 93%. Hemodynamics improving.`,
          nextDecision: null,
          endState: 'good',
          endMsg: 'Good thinking about catheter-directed therapy. PERT team correctly prioritized systemic tPA for unstable massive PE (faster, bedside). Catheter-directed remains excellent rescue option.',
          decisions: ['PERT activated', 'Considered advanced therapies', 'Team redirected to systemic lysis for massive PE', 'Understand catheter-directed role: intermediate-risk or failed lysis']
        },
        {
          id: 'pert-medical-only',
          label: '⚠ ANTICOAGULATION ONLY — NO REPERFUSION',
          type: 'bad',
          triggers: ['anticoagulation only','heparin only','no tpa','no thrombolysis','conservative','medical management','continue heparin'],
          requires: 1,
          excludes: ['tpa','alteplase','catheter','thrombectomy'],
          headline: 'Reperfusion therapy withheld',
          narrative: `You recommend: "Continue anticoagulation and medical management."<br/><br/>
          <strong>PERT discussion:</strong><br/>
          <span class="hl">Pulm/Crit Care:</span> "This is massive PE — she's on pressors with MAP 58. Anticoagulation alone has 30-50% mortality. She needs reperfusion therapy NOW."<br/>
          <span class="hl">Cardiology:</span> "Echo shows severe RV dysfunction. Without clot removal, she's going to arrest. Systemic tPA or catheter thrombectomy — we need to do one of them."<br/>
          <span class="hl">IR:</span> "I can take her for thrombectomy but honestly systemic lysis is faster for this degree of instability."<br/><br/>
          While the team debates, patient's MAP drops to <span class="hl">44 mm Hg</span> on norepi 18 mcg/min. GCS declines to 7. RN: <em>"She's coding!"</em><br/><br/>
          <strong>Team initiates systemic tPA emergently during resuscitation.</strong>`,
          nextDecision: null,
          endState: 'concern',
          endMsg: 'Massive PE requires reperfusion therapy. Anticoagulation alone is insufficient for hemodynamically unstable patients. Always consider tPA or catheter-directed therapy.',
          decisions: ['PERT activated appropriately', 'Failed to recommend reperfusion therapy', 'Patient deteriorated without intervention', 'Understand massive PE = reperfusion mandatory']
        },
        {
          id: 'pert-surgery',
          label: '⚠ SURGICAL EMBOLECTOMY RECOMMENDED',
          type: 'warning',
          triggers: ['surgical','embolectomy','surgery','cardiac surgery','open'],
          requires: 1,
          excludes: ['tpa','alteplase','catheter-directed'],
          headline: 'Surgical embolectomy as first-line',
          narrative: `You recommend: "Surgical embolectomy."<br/><br/>
          <strong>PERT discussion:</strong><br/>
          <span class="hl">Cardiothoracic Surgery (on phone):</span> "We can do this, but it requires transport to OR, cardiopulmonary bypass, median sternotomy. Mortality 10-30% even in best hands. This is rescue therapy for failed thrombolysis or absolute contraindications — not first-line."<br/>
          <span class="hl">Pulm/Crit Care:</span> "She has no contraindications to lysis. Systemic tPA takes 5 minutes to start. Surgery takes 2 hours to set up. We'd be watching her code while waiting."<br/>
          <span class="hl">Cardiology:</span> "Agree. Surgical embolectomy is last resort. Let's do systemic lysis now."<br/><br/>
          <strong>Team consensus: Systemic thrombolysis.</strong><br/><br/>
          Alteplase initiated. BP improves within 40 minutes.`,
          nextDecision: null,
          endState: 'concern',
          endMsg: 'Surgical embolectomy is rescue therapy for failed lysis or absolute contraindications. For massive PE without contraindications, systemic tPA is first-line (fastest, bedside).',
          decisions: ['PERT activated', 'Understand surgical embolectomy is rescue, not first-line', 'Team consensus achieved', 'Systemic lysis successful']
        },
        {
          id: 'pert-default',
          label: 'RECOMMENDATION PENDING',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'PERT team awaiting recommendation',
          narrative: `<strong>PERT decision algorithm for massive PE:</strong><br/>
          <br/>
          <strong>First-line (no contraindications):</strong><br/>
          • <span class="hl">Systemic thrombolysis</span> — alteplase 100 mg IV over 2 hrs<br/>
          • Fastest, done at bedside, guideline-recommended<br/>
          <br/>
          <strong>Second-line (failed lysis or relative contraindications):</strong><br/>
          • <span class="hl">Catheter-directed therapy</span> — IR thrombectomy<br/>
          • Lower bleeding risk, requires stable patient for transport<br/>
          <br/>
          <strong>Rescue (failed all above or absolute contraindications):</strong><br/>
          • <span class="hl">Surgical embolectomy</span> — median sternotomy, CPB<br/>
          • Highest mortality, longest time to initiate`,
          nextDecision: null,
          endState: 'concern',
          endMsg: 'Review massive PE treatment algorithm. PERT facilitates rapid multidisciplinary decision-making.',
          decisions: ['Understand PERT role', 'Review reperfusion options']
        }
      ]
    }
  },

  // ──────────────────────────────────────────────────────────────
  // CASE 3: ARDS / VENT
  // ──────────────────────────────────────────────────────────────
  {
    id: 'cc-3',
    title: 'Case #3',
    blurb: 'Progressive respiratory failure with escalating support needs and airway/ventilator management choices.',
    artType: 'ards',
    patient: { name: 'Christine Vo', initials: 'CV', age: '54F', weight: '72 kg', allergies: 'NKDA' },

    vignette: `<p>A 54-year-old woman with <span class="hl">obesity and hypertension</span> was admitted to the MICU two days ago with severe influenza A pneumonia requiring high-flow nasal cannula. She has been on oseltamivir and broad-spectrum antibiotics.</p><p>Despite maximal HFNC support (60 L/min, FiO₂ 90%), her oxygenation continues to worsen. You are the MICU resident on call when you receive a page from the ICU nurse:</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">DH 7432 · Bed 01</div><div class="pager-time">03:47</div></div></div><div class="pager-msg">"Patient in severe respiratory distress. SpO2 84% on max high flow. Using accessory muscles. Need you at bedside now."</div></div><p>You arrive to find the patient tachypneic with RR 38, using accessory muscles, appears exhausted. HFNC is at <span class="hl">60 L/min, FiO₂ 90%</span>.</p>`,

    rnReport: `"She keeps pulling at the cannula and she's using her neck muscles to breathe. She can only say two or three words at a time. Her sats were 92% at the last check and now the monitor is reading 84%. Her husband is here and he's terrified."`,
    rnCues: [
      'Look at the monitor. Note the vital signs.',
      'Verbalize your differential diagnosis for hypoxia or respiratory distress.'
    ],

    vitals: [
      { lbl: 'HR',    val: '126',    unit: 'bpm',             st: 'vc' },
      { lbl: 'BP',    val: '108/64', unit: 'mm Hg',           st: 'vn' },
      { lbl: 'RR',    val: '38',     unit: '/min',            st: 'vc' },
      { lbl: 'SpO₂',  val: '84%',   unit: 'HFNC 60L FiO₂90%',st: 'vc' },
      { lbl: 'Temp',  val: '38.2°C', unit: 'oral',            st: 'vw' }
    ],

    labs: [
      { lbl: 'pH',      val: '7.48',  unit: 'ABG',    st: 'lv-a' },
      { lbl: 'PaCO₂',  val: '30',    unit: 'mm Hg',  st: 'lv-a' },
      { lbl: 'PaO₂',   val: '52',    unit: 'mm Hg',  st: 'lv-c' },
      { lbl: 'P/F',     val: '~58',   unit: 'mm Hg',  st: 'lv-c' },
      { lbl: 'Lactate', val: '2.6',   unit: 'mmol/L', st: 'lv-a' },
      { lbl: 'WBC',     val: '14',    unit: 'K/µL',   st: 'lv-a' },
      { lbl: 'BMP',     val: 'Normal',unit: '',       st: 'lv-n' }
    ],

    examSystems: [
      { icon:'😰', lbl:'General', key:'gen',     text:'Severe respiratory distress. Tripod positioning. Accessory muscle use. Diaphoretic. 3-word sentences.' },
      { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Anxious but alert. GCS 14. Oriented ×4. Following commands. Tiring.' },
      { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Diffuse bilateral crackles. Decreased air entry bases bilaterally. No wheeze.' },
      { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic. Regular. No murmurs. No elevated JVP (not cardiogenic).' },
      { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mildly distended (aerophagia from HFNC). Non-tender.' },
      { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Good peripheral pulses.' }
    ],

    pocus: {
      rows: [
        { k:'LV',      v:'Normal systolic function — EF visually preserved, not cardiogenic' },
        { k:'RV',      v:'Normal size, no dilation' },
        { k:'Lungs',   v:'Diffuse bilateral B-lines — alveolar flooding pattern' },
        { k:'Effusion',v:'No pleural effusions bilaterally' },
        { k:'Pericard',v:'No pericardial effusion' }
      ],
      interp: 'Non-cardiogenic pulmonary edema consistent with ARDS. Normal LV function excludes cardiogenic cause. Diffuse B-lines = severe alveolar flooding. Berlin criteria: Severe ARDS (P/F 58, PEEP ≥5).'
    },

    decision1: {
      title: 'Acute Respiratory Failure Management',
      prompt: 'SpO₂ 84% on max HFNC 60L, patient tiring with accessory muscle use. What is your immediate management?',
      placeholder: `Enter your management plan...
e.g.: Airway, medications, ventilation, etc.`,
      branches: [
        {
          id: 'ards-complete-intubation',
          label: '✓ COMPREHENSIVE INTUBATION PLAN',
          type: 'good',
          triggers: ['intubat','rsi','ketamine','rocuronium','succinylcholine','preoxygenat','apneic','6 ml/kg','pbw','lung protective'],
          requires: 3, // Need intubation + drugs + vent settings (already in MICU)
          headline: 'Appropriate airway management with lung-protective ventilation',
          narrative: `Excellent plan:<br/>
          • <span class="hl">RSI with ketamine + rocuronium</span> — ketamine maintains hemodynamics<br/>
          • <span class="hl">Pre-oxygenation maximized</span> with HFNC flush + NRB + apneic oxygenation<br/>
          • <span class="hl">Lung-protective ventilation (6 mL/kg PBW)</span> ordered<br/><br/>
          <strong>PBW calculation:</strong> For 5'4" female: PBW = 45.5 + 2.3 × (64 − 60) = <span class="hl">54.7 kg</span><br/>
          Target VT = 6 mL/kg × 54.7 = <span class="hl">328 mL</span> (NOT 6 × 72 kg actual weight)<br/><br/>
          Intubation successful on first attempt. ETT 7.5 at 21 cm at lip.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '105',       unit: 'bpm',      st: 'vw' },
            { lbl: 'BP',    val: '92/54',     unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2',  val: '94%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'vw' },
            { lbl: 'GCS',   val: '13/15',     unit: '',         st: 'vw' },
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '20',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '10',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
            { lbl: 'Pplat', val: '28',        unit: 'cm H2O',   st: 'vn' },
          ],
          vitalsMsg: `Patient is intubated and on lung-protective ventilation. SpO₂ 90% on FiO₂ 80%, PEEP 10. Plateau pressure 28 cm H₂O (acceptable).<br/><br/>MICU attending: <em>"Excellent intubation and vent settings. This is severe ARDS from influenza. We'll need to optimize PEEP, consider prone positioning, and manage sedation carefully."</em>`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated. RASS -2 (light sedation). No spontaneous movement. Ventilator-synchronous.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -2. Pupils equal and reactive. Moving all extremities to noxious stimuli.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal bilateral breath sounds. Diffuse crackles bilaterally. Ventilator cycling normally.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardia improved from pre-intubation. Regular rhythm. No murmurs.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended. OG tube in place with minimal output.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Good peripheral pulses. No DVT signs.' }
          ],
          nextDecision: 'decision2'
        },
        {
          id: 'ards-high-tidal-volume',
          label: '⚠ INAPPROPRIATE TIDAL VOLUME — BAROTRAUMA ARREST',
          type: 'bad',
          triggers: ['intubat','rsi','8 ml/kg','430','450','500','high tidal'],
          requires: 2,
          excludes: ['6 ml/kg','328','330','pbw','lung protective'],
          headline: 'High tidal volume — volutrauma leading to arrest',
          narrative: `You intubated but ordered <span class="hl">high tidal volume</span> based on actual body weight instead of Predicted Body Weight (PBW).<br/><br/>
          VT 430 mL = 7.9 mL/kg actual weight. Post-intubation Pplat is 34 cm H₂O — dangerously high in ARDS.<br/><br/>
          Over 12 minutes: the ventilator alarms escalate. Suddenly, SpO₂ drops to 60%, BP drops to 52/28. Trachea deviates right. The RT shouts: <em>"She has no breath sounds on the left — tension pneumo! And she's losing her pulse!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'PEA (Obstructive — Tension Pneumothorax)',
            overhead: 'Code Blue, MICU Bed 4. Code Blue, MICU Bed 4. Bring the thoracostomy tray.',
            cause: 'Tension pneumothorax from ventilator-induced barotrauma. High tidal volume → Pplat 34 cm H₂O → alveolar rupture → pneumothorax → mediastinal shift → obstructive shock → PEA arrest.',
            monitor_phrase: 'Look at the monitor — PEA. Absent left-sided breath sounds. Tracheal deviation to right.',
            hs_ts: [
              'Tension pneumothorax ← PRIMARY CAUSE — needle decompress immediately',
              'Hypoxia (secondary to lung collapse)',
              'Hypovolemia (obstructive physiology)',
              'Hydrogen ion (acute hypercapnia + hypoxic acidosis)',
              'Other T\'s: tamponade, thrombosis (rule out)'
            ],
            acls_specifics: [
              'IMMEDIATE: Needle decompression — 2nd intercostal space, midclavicular line',
              'Follow with chest tube thoracostomy (4th-5th ICS, anterior axillary line)',
              'Do NOT defibrillate — this is obstructive PEA, not a shockable rhythm',
              'Reduce tidal volume to 6 mL/kg PBW immediately after ROSC (328 mL for this patient)',
              'Target Pplat <30 cm H₂O — ventilator-induced lung injury kills',
              'Post-ROSC: repeat CXR, confirm lung re-expansion, reassess ventilator settings'
            ],
            rosc_label: '✓ ROSC After Needle Decompression — Continuing ARDS Care →'
          },
          nextVitals: [
            { lbl: 'VT',    val: '430 mL',    unit: '7.9 mL/kg',st: 'vc' },
            { lbl: 'Pplat', val: '34',        unit: 'cm H2O',   st: 'vc' },
            { lbl: 'SpO2',  val: '85%',       unit: 'FiO2 100%',st: 'vc' },
            { lbl: 'BP',    val: '82/48',     unit: 'mm Hg',    st: 'vc' },
          ],
          vitalsMsg: `After ROSC via needle decompression and chest tube, the tidal volume is corrected to 328 mL (6 mL/kg PBW).<br/><br/><strong>Key teaching:</strong> Tidal volume must be based on <span class="hl">Predicted Body Weight (PBW)</span>, not actual weight. For 5'4" female: PBW = 45.5 + 2.3 × (64−60) = 54.7 kg → VT = 328 mL. Pplat target is <30 cm H₂O. Barotrauma is a preventable, life-threatening complication of high-pressure ventilation.`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Post-arrest. Intubated and sedated after ROSC. Chest tube in place on left side.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Post-cardiac arrest. Sedated. Neurological outcome depends on arrest duration.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Left lung re-expanding after chest tube. Tidal volume corrected to 328 mL. Pplat now 24 cm H₂O.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'ROSC achieved. Tachycardic. Vasopressor support initiated.' },
          ],
          nextDecision: 'decision2'
        },
        {
          id: 'ards-niv-trial',
          label: '⚠ NIV TRIAL IN SEVERE ARDS',
          type: 'warning',
          triggers: ['bipap','cpap','niv','nippv','trial of niv','avoid intubation','continue hfnc'],
          requires: 1,
          excludes: ['intubat','rsi','etomidate','ketamine'],
          headline: 'NIV attempted — high failure risk in severe ARDS',
          narrative: `You tried BiPAP. While NIV can work in mild-moderate hypoxemic respiratory failure, this patient has:<br/>
          • SpO₂ 84% on max HFNC (severe hypoxemic respiratory failure)<br/>
          • Accessory muscle use and tiring<br/>
          • Altered mental status<br/><br/>
          After 10 minutes on BiPAP 18/10: SpO₂ drops to <span class="hl">78%</span>. Patient is combative, pulling at mask. GCS declining to 10.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '146',    unit: 'bpm',      st: 'vc' },
            { lbl: 'BP',   val: '86/52',  unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2', val: '78%',    unit: 'BiPAP',    st: 'vc' },
            { lbl: 'GCS',  val: '10',     unit: '/15',      st: 'vc' },
          ],
          vitalsMsg: `RT: <em>"She's failing BiPAP. We need to intubate NOW before she arrests."</em><br/><br/><span class="hl">Emergent intubation is required. Severe hypoxemic respiratory failure with this degree of hypoxemia is not a NIV candidate. When HFNC fails with severe hypoxemia, proceed to intubation, not NIV trial.</span>`,
          nextDecision: 'decision1_5'
        },
        {
          id: 'ards-no-intubation',
          label: '⚠ NO AIRWAY INTERVENTION — HYPOXIC ARREST',
          type: 'bad',
          triggers: ['increase oxygen','nrb','more oxygen','continue'],
          requires: 1,
          excludes: ['intubat','rsi','bipap','cpap','niv'],
          headline: 'Airway not secured — hypoxic cardiac arrest',
          narrative: `You escalated oxygen without securing the airway. This patient has failed HFNC with SpO₂ 84% and is visibly tiring — she cannot sustain this work of breathing much longer.<br/><br/>
          <span class="hl">This is a clear intubation indication.</span> Within 4 minutes, she becomes bradypneic, then apneic.<br/><br/>
          The monitor alarmed: HR 40, then asystole. The RN shouts: <em>"She doesn't have a pulse — I'm calling the Code!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'PEA → Asystole (Hypoxic Arrest)',
            overhead: 'Code Blue, MICU Bed 4. Airway Team to MICU Bed 4.',
            cause: 'Hypoxic cardiac arrest from untreated respiratory failure. SpO₂ 72% sustained → profound cellular hypoxia → myocardial depression → cardiac arrest.',
            monitor_phrase: 'Look at the monitor — HR 40 then flat line. No pulse on check.',
            hs_ts: [
              'Hypoxia ← PRIMARY CAUSE — address first',
              'Hypoventilation → respiratory acidosis',
              'Hydrogen ion (severe hypoxic acidosis)',
              'Tension pneumothorax (rule out during arrest)',
              'Hypovolemia (distributive component from sepsis)',
              'Tamponade (rule out)',
              'Thrombosis',
              'Toxins'
            ],
            acls_specifics: [
              'Immediate endotracheal intubation — airway is the arrest cause',
              'Bag-mask ventilation during CPR at 100% FiO₂',
              'Once intubated: confirm placement, set RR 10, FiO₂ 100%',
              'Epinephrine 1mg IV q3–5 min (PEA/Asystole)',
              'Target ETCO₂ >10 mm Hg to confirm adequate CPR quality',
              'Hypoxic arrest — neurological outcomes depend on time to oxygenation'
            ],
            rosc_label: '✓ ROSC Achieved — Airway Secured, Continuing ARDS Management →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '152',    unit: 'bpm',      st: 'vc' },
            { lbl: 'BP',   val: '68/40',  unit: 'mm Hg',    st: 'vc' },
            { lbl: 'SpO2', val: '72%',    unit: 'NRB 15L',  st: 'vc' },
            { lbl: 'GCS',  val: '6',      unit: '/15',      st: 'vc' },
            { lbl: 'RR',   val: '6',      unit: 'gasping',  st: 'vc' },
          ],
          vitalsMsg: `After ROSC, the patient is intubated on lung-protective ventilation. SpO₂ recovering to 88% on FiO₂ 100%.<br/><br/><strong>Key teaching:</strong> Hypoxic cardiac arrest from delayed intubation carries a significantly worse neurological prognosis than a controlled RSI. HFNC failure is an intubation indication — do not wait for arrest.`,
          nextDecision: 'decision1_5'
        },
        {
          id: 'ards-simple-intubation',
          label: '✓ INTUBATION ORDERED',
          type: 'good',
          triggers: ['intubat','secure airway','ett'],
          requires: 1,
          excludes: ['bipap','cpap','niv','continue hfnc','increase oxygen','nrb'],
          headline: 'Appropriate decision to intubate',
          narrative: `You recognized the need for intubation. Patient has failed HFNC with severe hypoxemia and is tiring.<br/><br/>
          RT and anesthesia are preparing for RSI. Consider:<br/>
          • RSI medications (induction + paralytic)<br/>
          • Pre-oxygenation strategy<br/>
          • Initial ventilator settings (lung-protective)<br/>
          • Post-intubation sedation plan`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '105',       unit: 'bpm',      st: 'vw' },
            { lbl: 'BP',    val: '92/54',     unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2',  val: '94%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'vw' },
            { lbl: 'GCS',   val: '13/15',     unit: '',         st: 'vw' },
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '20',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '10',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
          ],
          vitalsMsg: `Patient successfully intubated. RT has initiated lung-protective ventilation settings. SpO₂ improved to 90%.`,
          nextDecision: 'decision2'
        },
        {
          id: 'ards-default',
          label: 'ORDERS RECEIVED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Orders documented',
          narrative: `Orders have been sent. The team is implementing your management plan.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '142',    unit: 'bpm',      st: 'vc' },
            { lbl: 'SpO2', val: '80%',    unit: 'HFNC 60L', st: 'vc' },
            { lbl: 'RR',   val: '42',     unit: 'labored',  st: 'vc' },
            { lbl: 'GCS',  val: '12',     unit: '/15',      st: 'vc' },
          ],
          vitalsMsg: `Patient continues to deteriorate. RT: <em>"We need to make an airway decision NOW."</em>`,
          nextDecision: 'decision1_5'
        }
      ]
    },

    decision1_5: {
      title: 'Urgent Airway Management',
      conditionAlert: true,
      alertText: 'Patient in respiratory failure without secured airway.',
      alertSub: 'Severe hypoxemia on maximal HFNC. Intubation required.',
      vitals: [
        { lbl: 'HR',   val: '148',    unit: 'bpm',      st: 'vc' },
        { lbl: 'SpO2', val: '78%',    unit: 'HFNC 60L', st: 'vc' },
        { lbl: 'RR',   val: '44',     unit: 'gasping',  st: 'vc' },
        { lbl: 'BP',   val: '88/52',  unit: 'mm Hg',    st: 'vc' },
        { lbl: 'GCS',  val: '10',     unit: '/15',      st: 'vc' },
      ],
      prompt: 'What is your airway management plan?',
      placeholder: 'Enter intubation orders...',
      branches: [
        {
          id: 'ards-rescue-intubation',
          label: '✓ INTUBATION ORDERED',
          type: 'good',
          triggers: ['intubat','intubation','rsi','secure airway','ett'],
          requires: 1,
          headline: 'Intubation ordered',
          narrative: `You ordered intubation. RT and anesthesia perform rapid sequence intubation with ketamine and rocuronium. Lung-protective ventilation initiated.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '20',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '10',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
            { lbl: 'SpO2',  val: '88%',       unit: '',         st: 'vw' },
          ],
          vitalsMsg: `Patient intubated. Initial SpO₂ 88% on vent. RT managing ventilator settings.`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated post-emergent intubation. RASS -2. Stabilizing on ventilator.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -2. Pupils equal and reactive. Responds to noxious stimuli.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal bilateral breath sounds. Diffuse crackles. Ventilator cycling normally.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Heart rate improved from 148 to normal range. Hemodynamics stabilizing post-intubation.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended. OG tube placed.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Pulses palpable.' }
          ],
          nextDecision: 'decision2'
        },
        {
          id: 'ards-rescue-niv',
          label: '⚠ NIV ATTEMPTED',
          type: 'warning',
          triggers: ['bipap','cpap','niv','nippv'],
          requires: 1,
          excludes: ['intubat','rsi'],
          headline: 'NIV trial in severe hypoxemia',
          narrative: `BiPAP attempted. After 5 minutes: SpO₂ 74%, patient pulling at mask, GCS 8. RT: <em>"She's not tolerating this. We need to intubate NOW."</em><br/><br/>
          Crash intubation performed.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '22',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '10',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '100%',      unit: '',         st: 'vc' },
            { lbl: 'SpO2',  val: '84%',       unit: '',         st: 'vc' },
          ],
          vitalsMsg: `Crash intubation performed. More difficult due to delay. SpO₂ 84%, requires FiO₂ 100%.`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and deeply sedated post-crash intubation. RASS -3. Required more sedation due to difficult intubation.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Deeply sedated on propofol. RASS -3. Pupils equal. Unresponsive to voice, minimal response to pain.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated after difficult crash intubation. Equal breath sounds. Requires FiO₂ 100% for severe hypoxemia.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic from stress of crash intubation. Hemodynamics marginal.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft but distended from mask ventilation attempt. OG tube placed.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Cool peripherally. Delayed capillary refill. Stress response from crash intubation.' }
          ],
          nextDecision: 'decision2'
        },
        {
          id: 'ards-rescue-default',
          label: '⚠ NO AIRWAY DECISION',
          type: 'bad',
          triggers: [],
          requires: 0,
          headline: 'Airway not secured',
          narrative: `Without intervention, patient becomes apneic. Code blue called. Crash intubation during resuscitation.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '24',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '12',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '100%',      unit: '',         st: 'vc' },
            { lbl: 'SpO2',  val: '82%',       unit: '',         st: 'vc' },
          ],
          vitalsMsg: `Code intubation performed. Patient now stabilizing but required resuscitation. Early intubation would have prevented this.`,
          nextDecision: 'decision2'
        }
      ]
    },

    decision2: {
      title: 'Post-Intubation ABG Management — Ventilator Adjustments',
      prompt: 'Patient is intubated on: VT 330 mL (6 mL/kg PBW), RR 20, PEEP 10, FiO₂ 80%. You order an ABG 30 minutes post-intubation. Results: pH 7.18, PaCO₂ 68, PaO₂ 58, HCO₃ 24. What are your specific ventilator changes?',
      placeholder: `Enter SPECIFIC ventilator parameter changes...
You must specify EXACT numbers:
• Tidal volume: ___ mL (maintain 6 mL/kg PBW or adjust?)
• Respiratory rate: ___ (current 20, adjust?)
• PEEP: ___ cm H2O (current 10, adjust?)
• FiO2: ___ % (current 80%, adjust?)
• Explain your reasoning for each change`,
      branches: [
        {
          id: 'vent-correct-rr-increase',
          label: '✓ APPROPRIATE VENTILATOR ADJUSTMENT',
          type: 'good',
          triggers: ['rr 24','rr 25','rr 26','rr 27','rr 28','rr 29','rr 30','rr to 24','rr to 25','rr to 26','rr to 27','rr to 28','rr to 29','rr to 30','respiratory rate 24','respiratory rate 25','respiratory rate 26','respiratory rate 27','respiratory rate 28','respiratory rate to 24','respiratory rate to 25','respiratory rate to 26','respiratory rate to 27','respiratory rate to 28','increase rr','raise rr','higher rr','peep 14','peep 15','peep 16','peep to 14','peep to 15','peep to 16','increase peep','raise peep','higher peep'],
          requires: 2, // Need RR increase AND PEEP increase
          headline: 'Correct ABG-driven ventilator management',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • VT: <span class="hl">Keep 330 mL (6 mL/kg PBW)</span> — lung-protective, correct<br/>
          • RR: <span class="hl">Increase to 26-28</span> — addresses respiratory acidosis<br/>
          • PEEP: <span class="hl">Increase to 14-16</span> per ARDSnet FiO₂/PEEP table<br/>
          • FiO₂: Keep 80% for now, reassess after PEEP increase<br/><br/>
          <strong>Reasoning:</strong> pH 7.18 with PaCO₂ 68 = respiratory acidosis. <span class="hl">Permissive hypercapnia is acceptable (target pH >7.20)</span>, but pH 7.18 is just below threshold. Increasing RR will improve ventilation. PaO₂ 58 on FiO₂ 80% = severe hypoxemia → increase PEEP for recruitment.<br/><br/>
          
          <strong>RT:</strong> <em>"Perfect adjustments. Let me make those changes now. We'll reassess vitals and ABG in 30 minutes."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '108',       unit: 'bpm',      st: 'vw' },
            { lbl: 'BP',    val: '118/72',    unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2',  val: '92%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'vw' },
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '28',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '15',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
            { lbl: 'pH',    val: '7.24',      unit: '',         st: 'vn' },
            { lbl: 'PaCO2', val: '58',        unit: 'mm Hg',    st: 'vn' },
            { lbl: 'PaO2',  val: '78',        unit: 'mm Hg',    st: 'vw' },
            { lbl: 'HCO3',  val: '24',        unit: 'mEq/L',    st: 'vn' },
            { lbl: 'SaO2',  val: '94%',       unit: '',         st: 'vn' }
          ],
          vitalsMsg: `<strong>30-Minute Follow-up After Ventilator Adjustments:</strong><br/><br/>
          Vital signs improved: SpO₂ 92%, HR 108, BP 118/72.<br/><br/>
          <strong>Follow-up ABG Results:</strong><br/>
          • pH: 7.24 (improved from 7.18) ✓<br/>
          • PaCO₂: 58 mm Hg (improved from 68)<br/>
          • PaO₂: 78 mm Hg (improved from 58) ✓<br/>
          • HCO₃: 24 mEq/L<br/>
          • SaO₂: 94%<br/><br/>
          <strong>Analysis:</strong><br/>
          • Ventilation: Improved (pH 7.18 → 7.24, now >7.20 target)<br/>
          • Oxygenation: Improved (PaO₂ 58 → 78, P/F ratio 72 → 97)<br/>
          • Patient: Synchronous with ventilator<br/><br/>
          <strong>RT:</strong> <em>"Excellent response to your adjustments. Ventilation and oxygenation both improved. The patient is much more stable now."</em>`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated. RASS -1 to -2. Comfortable on ventilator. Improved from initial presentation.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -1 (easily arousable). Pupils equal and reactive. Follows simple commands when aroused.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal bilateral breath sounds. Crackles improved compared to admission. No bronchospasm. Synchronous with ventilator.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Heart rate normalized (108 bpm). Regular rhythm. Hemodynamically stable off pressors.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended. OG tube draining bilious fluid. No rigidity or tenderness.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm and well-perfused. No edema. Capillary refill <2 seconds.' }
          ],
          nextDecision: 'decision3'
        },
        {
          id: 'vent-rr-only',
          label: '✓ RR INCREASED BUT PEEP NOT OPTIMIZED',
          type: 'good',
          triggers: ['rr 24','rr 25','rr 26','rr 27','rr 28','rr 29','rr 30','rr to 24','rr to 25','rr to 26','rr to 27','rr to 28','rr to 29','rr to 30','respiratory rate 24','respiratory rate 25','respiratory rate 26','respiratory rate 27','respiratory rate 28','respiratory rate to 24','respiratory rate to 25','respiratory rate to 26','respiratory rate to 27','respiratory rate to 28','increase rr','raise rr','higher rr'],
          requires: 1,
          excludes: ['peep 14','peep 15','peep 16','peep to 14','peep to 15','peep to 16','increase peep','raise peep','higher peep'],
          headline: 'Ventilation addressed but oxygenation not optimized',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • RR: <span class="hl">Increased to 26</span> — addresses respiratory acidosis, good<br/>
          • VT: Kept at 330 mL — correct lung-protective strategy<br/>
          • PEEP: Kept at 10 — <span class="hl">missed opportunity to optimize oxygenation</span><br/><br/>
          <strong>Repeat ABG:</strong> pH 7.23, PaCO₂ 59, PaO₂ 62, HCO₃ 24<br/>
          Ventilation improved (pH now >7.20) but oxygenation still suboptimal (PaO₂ 62 on FiO₂ 80%).<br/><br/>
          RT: <em>"The P/F ratio is still only 78 (62/0.8). Per ARDSnet table, at FiO₂ 80%, we should increase PEEP to 14-16 for recruitment."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '110',       unit: 'bpm',      st: 'vw' },
            { lbl: 'BP',    val: '115/70',    unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2',  val: '90%',       unit: '',         st: 'vw' },
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '26',        unit: 'set',      st: 'vn' },
            { lbl: 'PEEP',  val: '10',        unit: 'cm H2O',   st: 'vw' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
            { lbl: 'pH',    val: '7.23',      unit: '',         st: 'vn' },
            { lbl: 'PaCO2', val: '59',        unit: 'mm Hg',    st: 'vn' },
            { lbl: 'PaO2',  val: '62',        unit: 'mm Hg',    st: 'vw' },
            { lbl: 'HCO3',  val: '24',        unit: 'mEq/L',    st: 'vn' }
          ],
          vitalsMsg: `<strong>30-Minute Follow-up:</strong><br/><br/>
          <strong>Follow-up ABG Results:</strong><br/>
          • pH: 7.23 (improved from 7.18) ✓<br/>
          • PaCO₂: 59 mm Hg (improved from 68)<br/>
          • PaO₂: 62 mm Hg (minimal improvement from 58)<br/>
          • P/F ratio: 78 (still severe ARDS)<br/><br/>
          <strong>Analysis:</strong> Ventilation improved (pH now >7.20), but oxygenation remains suboptimal. PEEP optimization would help with recruitment.<br/><br/>
          <strong>RT:</strong> <em>"The ventilation is better now. But we still need to address oxygenation - consider increasing PEEP per ARDSnet table."</em>`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated. RASS -2. Ventilator-synchronous but oxygenation still marginal.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -2. Pupils equal and reactive.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal breath sounds. Persistent crackles. Could benefit from more PEEP.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Heart rate 110 bpm. Regular rhythm. Stable hemodynamics.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended. OG tube in place.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Good pulses.' }
          ],
          nextDecision: 'decision3'
        },
        {
          id: 'vent-peep-only',
          label: '✓ PEEP INCREASED BUT RR NOT ADJUSTED',
          type: 'good',
          triggers: ['peep 14','peep 15','peep 16','peep to 14','peep to 15','peep to 16','increase peep','raise peep','higher peep'],
          requires: 1,
          excludes: ['rr 24','rr 25','rr 26','rr 27','rr 28','rr 29','rr 30','rr to 24','rr to 25','rr to 26','rr to 27','rr to 28','rr to 29','rr to 30','respiratory rate to 24','respiratory rate to 25','respiratory rate to 26','respiratory rate to 27','respiratory rate to 28','increase rr','raise rr','higher rr'],
          headline: 'Oxygenation addressed but ventilation not optimized',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • PEEP: <span class="hl">Increased to 14-16</span> — addresses oxygenation per ARDSnet table, good<br/>
          • VT: Kept at 330 mL — correct lung-protective strategy<br/>
          • RR: Kept at 20 — <span class="hl">missed opportunity to address respiratory acidosis</span><br/><br/>
          <strong>Repeat ABG:</strong> pH 7.18, PaCO₂ 68, PaO₂ 72, HCO₃ 24<br/>
          Oxygenation improved (PaO₂ from 58 to 72) but acidosis persists (pH still 7.18).<br/><br/>
          RT: <em>"The oxygenation is better, but the patient's pH is still 7.18 with PaCO₂ 68. We need to increase respiratory rate to improve ventilation and get the pH above 7.20."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '112',       unit: 'bpm',      st: 'vw' },
            { lbl: 'BP',    val: '116/74',    unit: 'mm Hg',    st: 'vw' },
            { lbl: 'SpO2',  val: '91%',       unit: '',         st: 'vw' },
            { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
            { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
            { lbl: 'RR',    val: '20',        unit: 'set',      st: 'vw' },
            { lbl: 'PEEP',  val: '15',        unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2',  val: '80%',       unit: '',         st: 'vw' },
            { lbl: 'pH',    val: '7.18',      unit: '',         st: 'vc' },
            { lbl: 'PaCO2', val: '68',        unit: 'mm Hg',    st: 'vc' },
            { lbl: 'PaO2',  val: '72',        unit: 'mm Hg',    st: 'vw' },
            { lbl: 'HCO3',  val: '24',        unit: 'mEq/L',    st: 'vn' }
          ],
          vitalsMsg: `<strong>30-Minute Follow-up:</strong><br/><br/>
          <strong>Follow-up ABG Results:</strong><br/>
          • pH: 7.18 (unchanged) ⚠<br/>
          • PaCO₂: 68 mm Hg (unchanged)<br/>
          • PaO₂: 72 mm Hg (improved from 58) ✓<br/>
          • P/F ratio: 90 (still severe ARDS but improved)<br/><br/>
          <strong>Analysis:</strong> Oxygenation improved with PEEP increase, but respiratory acidosis persists (pH still <7.20). Need to increase RR to improve ventilation.<br/><br/>
          <strong>RT:</strong> <em>"PEEP helped with oxygenation, but we still need to address the acidosis. Let's increase the respiratory rate."</em>`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated. RASS -2. Better oxygenation but still acidotic.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -2. Responsive to stimulation.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal breath sounds. Crackles improved with PEEP recruitment.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Heart rate 112 bpm. Regular rhythm. Hemodynamics stable.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, non-distended. OG tube in place.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Good pulses.' }
          ],
          nextDecision: 'decision3'
        },
        {
          id: 'vent-increase-vt-wrong',
          label: '⚠ INCREASED TIDAL VOLUME',
          type: 'bad',
          triggers: ['vt 400','vt 420','vt 450','vt 500','tidal volume 400','tidal volume 450','increase vt','increase tidal','raise vt'],
          requires: 1,
          headline: 'Abandoned lung-protective ventilation',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • VT: <span class="hl">Increased to 420 mL</span> — WRONG, abandons lung protection<br/>
          • RR: Kept at 20<br/><br/>
          <strong>Critical error:</strong> You increased tidal volume to address the respiratory acidosis. This violates ARDSnet protocol.<br/><br/>
          <strong>Key principle:</strong> In ARDS, <span class="hl">NEVER increase VT above 6 mL/kg PBW</span> to correct CO₂. Instead:<br/>
          • Increase <strong>respiratory rate</strong> to improve ventilation<br/>
          • Accept <strong>permissive hypercapnia</strong> (pH ≥7.20)<br/>
          • Maintain VT 6 mL/kg to prevent volutrauma<br/><br/>
          RT: <em>"Plateau pressure is now 34 cm H₂O — we're back above the 30 limit. We need to reduce VT back to 330 mL and increase RR instead."</em>`,
          nextDecision: 'decision3',
        },
        {
          id: 'vent-no-changes',
          label: '⚠ NO VENTILATOR CHANGES MADE',
          type: 'warning',
          triggers: ['no change','keep same','maintain','continue','no adjustment'],
          requires: 1,
          headline: 'ABG abnormalities not addressed',
          narrative: `You elected not to change the ventilator settings.<br/><br/>
          <strong>ABG analysis:</strong><br/>
          • pH 7.18 = <span class="hl">acidemia (below 7.20 target)</span><br/>
          • PaCO₂ 68 = respiratory acidosis<br/>
          • PaO₂ 58 on FiO₂ 80% = <span class="hl">P/F ratio 72 (severe hypoxemia)</span><br/><br/>
          While permissive hypercapnia is acceptable in ARDS, pH should be maintained <span class="hl">≥7.20</span>. At pH 7.18, you should increase respiratory rate to improve ventilation.<br/><br/>
          For oxygenation (P/F 72), PEEP should be optimized using ARDSnet FiO₂/PEEP table.`,
          nextDecision: 'decision3',
        },
        {
          id: 'vent-default',
          label: 'ORDERS PENDING',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Ventilator adjustments needed',
          narrative: `<strong>ABG interpretation guide:</strong><br/>
          Current: pH 7.18, PaCO₂ 68, PaO₂ 58, HCO₃ 24<br/><br/>
          <strong>Respiratory acidosis (pH 7.18, PaCO₂ 68):</strong><br/>
          • Target: pH ≥7.20 (permissive hypercapnia)<br/>
          • Intervention: <span class="hl">Increase respiratory rate</span> (20 → 26-28)<br/>
          • Do NOT increase VT (keep 6 mL/kg PBW)<br/><br/>
          <strong>Severe hypoxemia (PaO₂ 58 on FiO₂ 80%):</strong><br/>
          • P/F ratio: 58/0.8 = 72 (severe ARDS)<br/>
          • Intervention: <span class="hl">Increase PEEP</span> per ARDSnet table (10 → 14-16)<br/>
          • FiO₂ 80% with PEEP 10 is lower PEEP strategy — should use higher PEEP`,
          nextDecision: 'decision3',
          endState: 'concern',
          endMsg: 'Review ABG-driven ventilator management. Adjust RR for ventilation, PEEP for oxygenation. Maintain VT 6 mL/kg PBW.',
          decisions: ['Practice ABG interpretation', 'Review ARDSnet ventilator protocol']
        }
      ]
    },

    decision3: {
      title: 'Follow-up ABG After Ventilator Adjustments',
      prompt: `<strong>30 Minutes Post-Adjustment</strong><br/><br/>
      
You increased RR to 28 and PEEP to 15 cm H₂O. The patient has stabilized and you order a follow-up ABG to assess your ventilator changes.<br/><br/>

Review the updated vital signs, ABG results, and physical exam. What are your next management steps?`,
      vitals: [
        { lbl: 'HR',    val: '108',       unit: 'bpm',      st: 'vn' },
        { lbl: 'BP',    val: '118/72',    unit: 'mm Hg',    st: 'vn' },
        { lbl: 'SpO₂',  val: '92%',       unit: '',         st: 'vw' },
        { lbl: 'Temp',  val: '38.3°C',    unit: '',         st: 'vw' },
        { lbl: 'Mode',  val: 'AC/VC',     unit: '',         st: 'vn' },
        { lbl: 'VT',    val: '330 mL',    unit: '6 mL/kg',  st: 'vn' },
        { lbl: 'RR',    val: '28',        unit: 'set',      st: 'vn' },
        { lbl: 'PEEP',  val: '15',        unit: 'cm H₂O',   st: 'vn' },
        { lbl: 'FiO₂',  val: '80%',       unit: '',         st: 'vw' },
        { lbl: 'Pplat', val: '28',        unit: 'cm H₂O',   st: 'vn' },
      ],
      labs: [
        {
          cat: 'ABG',
          name: 'Arterial Blood Gas',
          needsUnlock: true,
          unlockMsg: 'ABG results available',
          results: [
            { test: 'pH', value: '7.24', flag: 'L', reference: '7.35-7.45' },
            { test: 'PaCO₂', value: '58 mm Hg', flag: 'H', reference: '35-45 mm Hg' },
            { test: 'PaO₂', value: '78 mm Hg', flag: 'L', reference: '80-100 mm Hg' },
            { test: 'HCO₃', value: '24 mEq/L', flag: '', reference: '22-26 mEq/L' },
            { test: 'SaO₂', value: '94%', flag: '', reference: '>95%' },
            { test: '', value: '', flag: '', reference: '' },
            { test: 'P/F Ratio', value: '97', flag: 'C', reference: '>300 mm Hg' },
            { test: 'Interpretation', value: 'Severe ARDS (P/F <100)', flag: 'C', reference: '' },
          ],
          interpretation: `<strong>ABG Interpretation:</strong><br/>
          • <strong>Ventilation:</strong> Improved (pH 7.18 → 7.24, PaCO₂ 68 → 58)<br/>
          • <strong>Oxygenation:</strong> Improved (PaO₂ 58 → 78)<br/>
          • <strong>P/F Ratio:</strong> 97 (severe ARDS, improved from 72)<br/>
          • <strong>pH Status:</strong> Acceptable with permissive hypercapnia (target ≥7.20)<br/>
          • <strong>Clinical Status:</strong> Patient synchronous with ventilator, hemodynamically stable`
        }
      ],
      placeholder: `Review ABG and vitals, then enter your next orders...

Key considerations:
• P/F ratio 97 = severe ARDS (threshold <100)
• pH 7.24 is acceptable (permissive hypercapnia)
• FiO₂ 80% is high but necessary for current oxygenation
• What adjunctive therapies are indicated for severe ARDS?`,
      branches: [
        {
          id: 'prone-positioning-ordered',
          label: '✓ PRONE POSITIONING ORDERED',
          type: 'good',
          triggers: ['prone','proning','prone position','prone positioning','flip prone','turn prone'],
          requires: 1,
          headline: 'Excellent ARDS management — prone positioning initiated',
          narrative: `<strong>Your order:</strong> Initiate prone positioning<br/><br/>
          
          <strong>Outstanding clinical reasoning:</strong> With P/F ratio 97 (severe ARDS, <150 mm Hg threshold) and FiO₂ 80%, prone positioning is indicated per PROSEVA trial.<br/><br/>
          
          <strong>PROSEVA Trial (2013):</strong><br/>
          • P/F <150 mm Hg + FiO₂ ≥60% = prone indication<br/>
          • 16% absolute mortality reduction with prone ≥16 hrs/day<br/>
          • Should be initiated within 36 hours of ARDS diagnosis<br/><br/>
          
          <strong>RT coordinates prone protocol:</strong><br/>
          Team assembles (6+ staff needed for safe turn). Patient positioned prone with pressure point protection. Ventilator settings maintained.<br/><br/>
          
          <strong>4-hour reassessment (after prone positioning):</strong><br/>
          • SpO₂: 96% (improved from 92%)<br/>
          • ABG: pH 7.26, PaCO₂ 56, <span class="hl">PaO₂ 110</span> (improved from 78!)<br/>
          • P/F ratio: 138 (still severe, but improved from 97)<br/>
          • FiO₂ successfully weaned to 65%<br/><br/>
          
          <strong>RT:</strong> <em>"Excellent response to proning! PaO₂ jumped from 78 to 110. We're now able to wean FiO₂. This is exactly what the PROSEVA trial showed - early prone positioning in severe ARDS saves lives."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '100',   unit: 'bpm',      st: 'vn' },
            { lbl: 'BP',   val: '118/68', unit: 'mm Hg',   st: 'vn' },
            { lbl: 'SpO2', val: '96%',   unit: '',         st: 'vn' },
            { lbl: 'Mode', val: 'AC/VC', unit: 'prone',    st: 'vn' },
            { lbl: 'VT',   val: '330 mL', unit: '6 mL/kg', st: 'vn' },
            { lbl: 'RR',   val: '28',    unit: 'set',      st: 'vn' },
            { lbl: 'PEEP', val: '15',    unit: 'cm H2O',   st: 'vn' },
            { lbl: 'FiO2', val: '65%',   unit: '',         st: 'vw' },
          ],
          vitalsMsg: `<strong>Exceptional ARDS management!</strong> You recognized severe ARDS (P/F <100) requiring prone positioning per evidence-based guidelines.<br/><br/>
          <strong>Key decisions:</strong><br/>
          • Appropriately intubated with lung-protective ventilation<br/>
          • Optimized PEEP per ARDSnet protocol<br/>
          • Recognized severe ARDS with P/F ratio 97<br/>
          • Ordered prone positioning per PROSEVA criteria (P/F <150, FiO₂ ≥60%)<br/>
          • Demonstrated complete evidence-based ARDS management<br/><br/>
          The patient continues to improve with prone positioning and will require ongoing ventilator management in the MICU.`,
          nextDecision: null
        },
        {
          id: 'maintain-settings-acceptable',
          label: '✓ MAINTAIN SETTINGS (ACCEPTABLE)',
          type: 'good',
          triggers: ['maintain','keep same','no change','continue current','stay at','hold','monitor'],
          requires: 1,
          excludes: ['prone','proning'],
          headline: 'Stabilization period - but consider adjunctive therapies',
          narrative: `<strong>Your decision:</strong> Maintain current ventilator settings and monitor.<br/><br/>
          
          <strong>Current status:</strong><br/>
          • VT: 330 mL (6 mL/kg) ✓<br/>
          • RR: 28 ✓<br/>
          • PEEP: 15 cm H₂O ✓<br/>
          • FiO₂: 80%<br/>
          • pH: 7.24 (acceptable with permissive hypercapnia)<br/>
          • P/F ratio: 97 (severe ARDS)<br/><br/>
          
          <strong>Reasonable approach</strong> - allowing stabilization before further changes. However, you missed an important opportunity:<br/><br/>
          
          <strong>Teaching point:</strong> P/F ratio 97 with FiO₂ 80% meets criteria for <span class="hl">prone positioning</span> (PROSEVA trial: P/F <150 + FiO₂ ≥60%).<br/><br/>
          
          <strong>4-hour reassessment:</strong><br/>
          SpO₂ 92-93%, patient stable. RT asks: <em>"With P/F ratio still in severe range (97), should we consider prone positioning? The evidence shows significant mortality benefit in severe ARDS."</em><br/><br/>
          
          Patient continues on current settings. Oxygenation remains marginal with high FiO₂.`,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Concluded — Acceptable Management.</strong><br/><br/>Ventilator settings were appropriate and the patient stabilized. However, a key opportunity was missed: with a P/F ratio of 97 and FiO₂ ≥60%, prone positioning was indicated per the PROSEVA trial (2013). Early prone positioning in severe ARDS (P/F <150) reduces 28-day mortality by 16% in absolute terms. Consider this intervention in future severe ARDS cases.`,
          decisions: [
            'Applied lung-protective ventilation (6 mL/kg PBW) ✓',
            'Optimized PEEP per ARDSnet protocol ✓',
            'Maintained permissive hypercapnia (pH 7.24 — acceptable) ✓',
            'Missed: prone positioning indication (P/F <150 + FiO₂ ≥60% = PROSEVA criteria)'
          ]
        },
        {
          id: 'wean-fio2-premature',
          label: '⚠ PREMATURE FiO₂ WEANING',
          type: 'warning',
          triggers: ['wean fio2','decrease fio2','lower fio2','fio2 70','fio2 60','fio2 to 70','fio2 to 60','titrate fio2','reduce fio2','fio2 down'],
          requires: 1,
          headline: 'FiO₂ weaning attempted - marginal for severe ARDS',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • FiO₂: <span class="hl">Wean to 60-70%</span><br/><br/>
          
          <strong>Result:</strong> You attempted to wean FiO₂ from 80% to 65%.<br/><br/>
          
          <strong>30-minute ABG:</strong><br/>
          • pH: 7.26<br/>
          • PaCO₂: 56<br/>
          • PaO₂: <span class="hl">68</span> (dropped from 78)<br/>
          • SpO₂: 88-89%<br/>
          • P/F ratio: 105 (still severe ARDS)<br/><br/>
          
          <strong>Teaching point:</strong> While technically adequate (SpO₂ 88% is acceptable in ARDS), you're working at the margin. With P/F ratio still <150 and requiring FiO₂ >60%, <span class="hl">prone positioning</span> should be considered first.<br/><br/>
          
          <strong>PROSEVA trial:</strong> P/F <150 + FiO₂ ≥60% = prone positioning indication. This provides recruitment and improved V/Q matching, allowing subsequent FiO₂ reduction.<br/><br/>
          
          <strong>RT:</strong> <em>"We're able to wean FiO₂ a bit, but we're still at 65% with borderline oxygenation. With severe ARDS and this degree of hypoxemia, should we consider prone positioning? The literature shows significant mortality benefit."</em>`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Suboptimal Sequence.</strong><br/><br/>FiO₂ weaning is correct in principle — oxygen toxicity is a real concern. However, the preferred sequence in severe ARDS is: (1) optimize PEEP, (2) initiate prone positioning if P/F <150 + FiO₂ ≥60%, then (3) wean FiO₂ once oxygenation improves with proning. Weaning FiO₂ without first addressing the V/Q mismatch leaves the patient at the margin with limited reserve.`,
          decisions: [
            'Applied lung-protective ventilation (6 mL/kg PBW) ✓',
            'Optimized PEEP per ARDSnet protocol ✓',
            'Attempted FiO₂ reduction — correct goal, incorrect sequence',
            'Missed: prone positioning before FiO₂ weaning in severe ARDS (P/F <150)'
          ]
        },
        {
          id: 'further-increase-rr',
          label: '⚠ FURTHER RR INCREASE UNNECESSARY',
          type: 'warning',
          triggers: ['rr 30','rr 32','rr 34','increase rr','raise rr','higher rr','rr to 30','rr to 32'],
          requires: 1,
          headline: 'Over-adjustment of respiratory rate',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • RR: <span class="hl">Increase to 30-32</span> - unnecessary, pH already 7.24<br/><br/>
          
          <strong>Teaching point:</strong> pH 7.24 with PaCO₂ 58 is <strong>acceptable</strong> with permissive hypercapnia strategy in ARDS. Target pH is ≥7.20, which you've achieved.<br/><br/>
          
          <strong>Key principles:</strong><br/>
          • <span class="hl">pH ≥7.20 is the goal</span> - you don't need to normalize pH<br/>
          • Higher RR → increased minute ventilation → potential for auto-PEEP<br/>
          • Accept PaCO₂ in 50s-60s if pH adequate<br/><br/>
          
          <strong>Result with RR 32:</strong><br/>
          pH 7.28, PaCO₂ 52, PaO₂ 76<br/>
          Patient developing auto-PEEP (total PEEP 18 cm H₂O). Starting to fight the ventilator.<br/><br/>
          
          <strong>RT:</strong> <em>"The pH looks better, but we're creating auto-PEEP. Remember, we don't need to normalize pH in ARDS - 7.24 was perfectly acceptable."</em>`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Over-correction.</strong><br/><br/>pH 7.24 was already within the acceptable range for permissive hypercapnia in ARDS (target ≥7.20). Increasing RR to 30–32 improved the pH but generated auto-PEEP (intrinsic PEEP), increasing mean airway pressure and risk of barotrauma. In ARDS, resist the reflex to normalize pH — accept mild respiratory acidosis and focus on oxygenation and lung protection.`,
          decisions: [
            'Applied lung-protective ventilation (6 mL/kg PBW) ✓',
            'Optimized PEEP per ARDSnet protocol ✓',
            'Over-corrected pH 7.24 — already within acceptable permissive hypercapnia range',
            'Auto-PEEP developed from high RR — increased barotrauma risk',
            'Target pH ≥7.20, not normal pH, in ARDS'
          ]
        },
        {
          id: 'decrease-peep-wrong',
          label: '⚠ PREMATURE PEEP REDUCTION',
          type: 'bad',
          triggers: ['decrease peep','lower peep','reduce peep','peep 12','peep 10','peep down','wean peep'],
          requires: 1,
          headline: 'Inappropriate de-recruitment',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • PEEP: <span class="hl">Decrease to 12</span> - WRONG, premature de-recruitment<br/><br/>
          
          <strong>Critical error:</strong> You decreased PEEP when the patient just achieved adequate oxygenation. P/F ratio is 97 (still severe ARDS) - PEEP should be maintained.<br/><br/>
          
          <strong>Result with PEEP 12:</strong><br/>
          SpO₂ drops to 86% within 5 minutes<br/>
          ABG: pH 7.26, PaCO₂ 55, <span class="hl">PaO₂ 56</span> (worsened from 78)<br/><br/>
          
          <strong>Teaching point:</strong><br/>
          • Don't wean PEEP when P/F ratio <200 (severe/moderate ARDS)<br/>
          • Wean <span class="hl">FiO₂ first</span>, then consider PEEP reduction<br/>
          • ARDSnet: Wean FiO₂ to 40-50% before reducing PEEP<br/><br/>
          
          <strong>RT:</strong> <em>"We're losing our recruitment! PEEP needs to go back to 15. In ARDS, we wean oxygen first, then PEEP much later."</em>`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Critical De-recruitment Error.</strong><br/><br/>Reducing PEEP from 15 to 12 in severe ARDS (P/F ratio 97) caused immediate alveolar de-recruitment. PaO₂ dropped from 78 to 56 mm Hg within minutes. The correct weaning sequence is: (1) wean FiO₂ to 40–50% first, then (2) reduce PEEP in stepwise fashion only once oxygenation is stable on low FiO₂. PEEP should not be reduced when P/F ratio remains <200.`,
          decisions: [
            'Applied lung-protective ventilation (6 mL/kg PBW) ✓',
            'PEEP optimized to 15 cm H₂O ✓',
            'Critical error: decreased PEEP before weaning FiO₂',
            'De-recruitment caused PaO₂ to drop from 78 to 56 mm Hg',
            'ARDSnet weaning: FiO₂ first → then PEEP, never the reverse'
          ]
        },
        {
          id: 'increase-fio2-wrong',
          label: '⚠ UNNECESSARY FiO₂ INCREASE',
          type: 'warning',
          triggers: ['increase fio2','fio2 90','fio2 100','raise fio2','higher fio2','fio2 up'],
          requires: 1,
          headline: 'Oxygen toxicity risk',
          narrative: `<strong>Your ventilator orders:</strong><br/>
          • FiO₂: <span class="hl">Increase to 90-100%</span> - unnecessary, oxygenation already improved<br/><br/>
          
          <strong>Current status:</strong><br/>
          • PaO₂ 78 on FiO₂ 80% → adequate oxygenation<br/>
          • SpO₂ 94% → within target range (88-95%)<br/>
          • PEEP optimized at 15 cm H₂O<br/><br/>
          
          <strong>Teaching point:</strong> With improved oxygenation and optimized PEEP, the goal is to <span class="hl">wean FiO₂</span> to reduce oxygen toxicity, not increase it.<br/><br/>
          
          <strong>FiO₂ strategy in ARDS:</strong><br/>
          • Use high FiO₂ initially for rescue<br/>
          • Optimize PEEP for recruitment (done ✓)<br/>
          • Once oxygenation improves, wean FiO₂ to <60% if possible<br/>
          • Prolonged FiO₂ >60% → risk of oxygen toxicity<br/><br/>
          
          <strong>RT:</strong> <em>"The patient's oxygenation is better now. We should be thinking about weaning oxygen, not increasing it. Let's avoid oxygen toxicity."</em>`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Incorrect Direction.</strong><br/><br/>With PaO₂ 78 and SpO₂ 94% already at goal, increasing FiO₂ to 90–100% adds oxygen toxicity risk without clinical benefit. Prolonged FiO₂ >60% causes absorptive atelectasis, reactive oxygen species formation, and direct pulmonary parenchymal injury. Once PEEP is optimized and oxygenation is adequate, the next step is always to wean FiO₂, not escalate it.`,
          decisions: [
            'Applied lung-protective ventilation (6 mL/kg PBW) ✓',
            'Optimized PEEP per ARDSnet protocol ✓',
            'Error: escalated FiO₂ when oxygenation was already at goal',
            'With SpO₂ 94% and PEEP optimized, next step is FiO₂ reduction',
            'Prolonged FiO₂ >60% → oxygen toxicity risk'
          ]
        },
        {
          id: 'decision3-default',
          label: 'REVIEW ABG AND ADJUST',
          type: 'neutral',
          triggers: [],
          requires: 0,
          headline: 'Consider next ventilator adjustments',
          narrative: `<strong>ABG Analysis Guide:</strong><br/><br/>
          
          <strong>Current ABG (30 min after adjustments):</strong><br/>
          pH 7.24, PaCO₂ 58, PaO₂ 78, HCO₃ 24, SaO₂ 94%<br/><br/>
          
          <strong>Interpretation:</strong><br/>
          • pH 7.24 = <span class="hl">ACCEPTABLE</span> (target ≥7.20 in permissive hypercapnia)<br/>
          • PaCO₂ 58 = Acceptable with pH 7.24<br/>
          • PaO₂ 78 = Improved (was 58)<br/>
          • P/F ratio: 78/0.8 = 97 (still severe ARDS but improved from 72)<br/><br/>
          
          <strong>Next steps to consider:</strong><br/><br/>
          
          <strong>1. FiO₂ Weaning (RECOMMENDED):</strong><br/>
          • Current: FiO₂ 80%, PaO₂ 78, SpO₂ 94%<br/>
          • With PEEP optimized (15 cm H₂O), can wean FiO₂<br/>
          • Target: Wean to 60-70% while maintaining SpO₂ 88-95%<br/>
          • Rationale: Reduce oxygen toxicity risk<br/><br/>
          
          <strong>2. Maintain Current Settings:</strong><br/>
          • Reasonable if you want stability before changes<br/>
          • Settings are appropriate for severe ARDS<br/>
          • Consider weaning FiO₂ at next reassessment<br/><br/>
          
          <strong>3. What NOT to do:</strong><br/>
          • ❌ Don't increase RR (pH 7.24 is acceptable)<br/>
          • ❌ Don't decrease PEEP (P/F still <200)<br/>
          • ❌ Don't increase FiO₂ (oxygenation adequate)<br/><br/>
          
          <strong>ARDSnet Weaning Strategy:</strong><br/>
          1. Optimize PEEP ✓ (done)<br/>
          2. Wean FiO₂ to 40-50% ← You are here<br/>
          3. Then consider stepwise PEEP reduction`,
          nextDecision: null,
          endState: 'concern',
          endMsg: 'Review ARDS ventilator weaning strategies. After PEEP optimization, wean FiO₂ first before considering PEEP reduction.',
          decisions: ['Practice ABG interpretation in ARDS', 'Review FiO₂ weaning strategies', 'Review ARDSnet protocol']
        }
      ]
    }
  }
];

// ═══════════════════════════════════════════════════════════════
//  SEPSIS SIMULATION CASES — 3 cases for PGY-1 training
// ═══════════════════════════════════════════════════════════════

const SEPSIS_CASES = [

  // ─────────────────────────────────────────────────────────────
  // SEPSIS CASE 1 — Mr. Arthur Hayes · Floor Sepsis
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ss-1',
    title: 'Case #1',
    blurb: 'Elderly patient on the floor with subtle vital sign changes and an infectious source.',
    artType: 'sepsis1',
    patient: { name: 'Arthur Hayes', initials: 'AH', age: '85M', weight: '82 kg', allergies: 'NKDA' },

    vignette: `<p>An 85-year-old man with <span class="hl">prostate cancer</span> was admitted to the medical-surgical floor for 2 days of profuse, watery diarrhea. He is <span class="hl">3 days post-sigmoidoscopy</span> and has been having <span class="hl">10–15 episodes of liquid, foul-smelling bowel movements per day</span> with associated crampy abdominal pain and chills. He received 1L NS in the ED and was admitted for workup. He has just arrived to your floor.</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">Tower 3 · Bed 14</div><div class="pager-time">19:32</div></div></div><div class="pager-msg">"Mr. Hayes just arrived. He's been having a lot of loose watery stools all day — the family says he's barely made it out of the bathroom. He looks really pale and tired. Can you come evaluate him?"</div></div>`,

    rnReport: `"He's barely comfortable — keeps getting up for the bathroom. He's had so many loose, watery bowel movements today the family lost count. His blood pressure just cycled — it's 101/44, MAP is 63. He's a little pale and seems more confused than when he came in from the ED. He's also really tender in the abdomen when I pressed on it. I'm worried about him."`,
    rnCues: [
      'Review the vital signs carefully — note the MAP.',
      'Does this patient meet criteria for sepsis despite the absence of fever?'
    ],

    vitals: [
      { lbl: 'HR',   val: '88',      unit: 'bpm',      st: 'vn' },
      { lbl: 'BP',   val: '101/44',  unit: 'mm Hg',    st: 'vc' },
      { lbl: 'MAP',  val: '63',      unit: 'mm Hg',    st: 'vw' },
      { lbl: 'RR',   val: '24',      unit: '/min',      st: 'vw' },
      { lbl: 'Temp', val: '97.7°F',  unit: '36.5°C',   st: 'vn' },
      { lbl: 'SpO₂', val: '94%',     unit: 'RA',        st: 'vw' },
      { lbl: 'GCS',  val: '14',      unit: '/15',       st: 'vw' }
    ],

    labs: [
      { lbl: 'WBC',    val: '10.2 (11% bands)', unit: 'K/µL',   st: 'lv-a' },
      { lbl: 'Hgb',    val: '11.4',             unit: 'g/dL',   st: 'lv-a' },
      { lbl: 'Plt',    val: '138',               unit: 'K/µL',   st: 'lv-n' },
      { lbl: 'Na',     val: '132',               unit: 'mEq/L',  st: 'lv-a' },
      { lbl: 'Creat',  val: '1.9',               unit: '(bl 1.1)',st:'lv-c' },
      { lbl: 'HCO₃',  val: '19',                unit: 'mEq/L',  st: 'lv-a' },
      { lbl: 'Lactate',val: '5.9',               unit: 'mmol/L', st: 'lv-a' },
      { lbl: 'Procal', val: '1.8',               unit: 'ng/mL',  st: 'lv-a' },
    ],

    examSystems: [
      { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Slightly slow to respond. Oriented to person and place, not time. GCS 14.' },
      { icon: '👁️', lbl: 'General', key: 'gen',     text: 'Ill-appearing elderly male. Pale. Fatigued affect.' },
      { icon: '👄', lbl: 'HEENT',   key: 'heent',   text: 'Dry mucous membranes. No JVD.' },
      { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Regular rate and rhythm. Cool extremities. Capillary refill ~3 seconds.' },
      { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'Mildly tachypneic. Clear to auscultation bilaterally.' },
      { icon: '🫃', lbl: 'Abdomen', key: 'abd',     text: 'Distended and tympanitic. Diffuse tenderness throughout, worse in the left lower quadrant and transverse colon. No voluntary guarding, no rebound. Hyperactive then hypoactive bowel sounds. Visibly distended abdomen noted.' },
      { icon: '🦵', lbl: 'Extrem',  key: 'ext',     text: 'Cool bilateral extremities. No edema. Cap refill 3 seconds.' }
    ],

    decision1: {
      title: 'Sepsis Recognition & Initial Bundle',
      prompt: 'Mr. Hayes has just arrived to your floor. What are your initial orders?',
      placeholder: `Enter your initial orders...\ne.g.: lactate, blood cultures, IV fluids, antibiotics, etc.`,
      branches: [
        {
          id: 'complete-sepsis-bundle',
          label: '✓ COMPLETE SEPSIS BUNDLE',
          type: 'good',
          triggers: ['lactate','blood culture','bcx','liter','normal saline','lactated ringer','lr','fluid','antibiotic','ceftriaxone','pip-tazo','piperacillin','zosyn','broad spectrum','meropenem'],
          requires: 3,
          excludes: ['4l','4000','5l','5000','6l','6000'],
          headline: 'Sepsis bundle initiated — early recognition',
          narrative: `You recognize that Mr. Hayes has vital sign abnormalities consistent with sepsis despite the absence of fever — <span class="hl">MAP 63 and RR 24 indicate organ dysfunction</span> regardless of the underlying infectious source.\n\n{{BCX_LINE}}{{LACTATE_LINE}}{{FLUID_LINE}}{{ABX_LINE}}{{ABX_REMINDER}}\n\n<strong>2026 SSC Update — Fluid Type:</strong> Balanced crystalloids (Lactated Ringer's) are now <span class="hl">suggested over 0.9% normal saline</span> — an upgraded recommendation in 2026. NS causes hyperchloremic metabolic acidosis with prolonged use.\n\n<strong>2026 SSC Update — Screening:</strong> NEWS, NEWS2, MEWS, or SIRS are now <span class="hl">recommended over qSOFA</span> as single screening tools for sepsis identification in hospitalized patients.\n\n{{ATTENDING_QUOTE}}`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '84',    unit: 'bpm',    st: 'vn' },
            { lbl: 'BP',   val: '108/64',unit: 'mm Hg',  st: 'vn' },
            { lbl: 'MAP',  val: '79',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'RR',   val: '20',    unit: '/min',    st: 'vn' },
            { lbl: 'SpO₂', val: '95%',   unit: 'RA',      st: 'vn' },
          ],
          vitalsMsg: `MAP improved to 79 mm Hg after your initial resuscitation. RN: <em>"He seems a bit more with it now. Should we continue monitoring up here?"</em>`,
          nextDecision: 'decision_toxic',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'More responsive after fluids. Oriented to person and place. Answering questions appropriately.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Extremities slightly warmer. Capillary refill ~2.5 sec.' }
          ]
        },
        {
          id: 'fluids-abx-no-lactate',
          type: 'warning',
          triggers: ['liter','normal saline','lr','fluid','antibiotic','ceftriaxone','pip-tazo','piperacillin','zosyn'],
          requires: 2,
          excludes: ['lactate'],
          headline: 'Fluids and antibiotics started — lactate not ordered',
          narrative: `Fluids and broad-spectrum antibiotics — good instincts. However, <span class="hl">lactate was not ordered</span>.\n\nLactate is a CMS core measure for the sepsis bundle. It serves two critical purposes: (1) confirms organ hypoperfusion and meets severe sepsis criteria, and (2) serial lactate every 2 hours gauges resuscitation response.\n\n<strong>2026 SSC Update:</strong> The guidelines now <span class="hl">suggest using serial lactate measurements to guide resuscitation</span> — with fluid administration individualized after initial bolus and monitoring of lactate decrement, rather than continuing fluids until lactate normalization is achieved.\n\nThe RN sends the lactate reflexively through the order set. It returns at 5.9 mmol/L. The attending: <em>"Don't forget — we need to repeat that in 2 hours."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '86',    unit: 'bpm',   st: 'vn' },
            { lbl: 'BP',   val: '105/60',unit: 'mm Hg', st: 'vn' },
            { lbl: 'MAP',  val: '75',    unit: 'mm Hg', st: 'vn' },
            { lbl: 'RR',   val: '22',    unit: '/min',   st: 'vw' },
          ],
          vitalsMsg: `MAP marginally improved after your initial orders. RN: <em>"He's slightly better. Should we send him to the unit?"</em>`,
          nextDecision: 'decision_toxic',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Slightly more responsive. Still mildly confused.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Marginal improvement. Cap refill still 3 sec.' }
          ]
        },
        {
          id: 'cdiff-treatment-only',
          label: '⚠ ANCHORED ON C. DIFF — SEPSIS UNTREATED',
          type: 'warning',
          triggers: ['flagyl','metronidazole oral','oral vancomycin','oral vanco','fidaxomicin','c diff','cdiff'],
          requires: 1,
          excludes: ['liter','normal saline','fluid','blood culture','bcx','lactate','pip-tazo','piperacillin','zosyn','ceftriaxone','meropenem'],
          headline: 'C. diff treated — systemic sepsis missed',
          narrative: `You order C. diff-targeted treatment but miss the larger emergency. The CT abdomen results show <span class="hl">toxic megacolon</span> — this is no longer just a C. diff infection, this is a surgical emergency.\n\nSepsis-3 criteria are met — and the underlying toxic megacolon requires: (1) IV fluid resuscitation, (2) systemic IV antibiotics for sepsis, (3) IV metronidazole + PO vancomycin for C. diff, and (4) emergency general surgery consult. PO vancomycin alone is not sufficient in this context.\n\nYou have 15 minutes before the RN calls back: <em>"His pressure is 74/38. He won't wake up. I'm calling a Code Blue."</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14.',
            cause: 'PEA arrest from untreated septic shock in the setting of toxic megacolon. Ordering only C. diff treatment without systemic resuscitation (IV fluids, IV antibiotics, vasopressor support) allowed hemodynamic collapse to progress unchecked.',
            monitor_phrase: 'Look at the monitor — organized rhythm, no pulse. PEA. Start CPR now.',
            hs_ts: [
              'Hypovolemia ← distributive shock, no IV fluids given',
              'Hydrogen ion (severe lactic acidosis from untreated sepsis)',
              'Hypoxia ← no oxygen support ordered',
              'Hypo/Hyperkalemia ← AKI (Cr 1.9 from 1.1)',
              'Tension pneumothorax (rule out)',
              'Thrombosis / Tamponade (rule out)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'IV broad-spectrum antibiotics DURING resuscitation — this is the definitive fix',
              'Push IV fluid boluses during CPR (no fluid had been given)',
              'After ROSC: norepinephrine, MICU transfer, continue full sepsis bundle',
              'The C. diff treatment was not wrong — the omission of systemic management was'
            ],
            rosc_label: '✓ ROSC Achieved — Initiating Systemic Sepsis Management →'
          },
          noROSCMsg: `Despite prolonged resuscitation, Mr. Hayes did not achieve ROSC. The team called the code.\n\nRoot cause: C. diff-targeted treatment was started but systemic sepsis management was omitted. The CT later confirmed toxic megacolon — a condition requiring simultaneous management of (1) hemodynamic sepsis, (2) C. diff infection (IV metronidazole + PO vancomycin), AND (3) emergency surgical consultation. Treating only one component of this complex emergency was not sufficient.`,
          nextVitals: [
            { lbl: 'HR',   val: '104',  unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',   val: '74/38',unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',  val: '50',   unit: 'mm Hg',  st: 'vc' },
            { lbl: 'RR',   val: '26',   unit: '/min',    st: 'vc' },
            { lbl: 'SpO₂', val: '88%',  unit: 'RA',      st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved after resuscitation. Mr. Hayes has been intubated and is being transferred to the MICU for ongoing critical care management.<br/><br/><strong>Key teaching:</strong> Diagnostic anchoring is one of the most common and dangerous cognitive errors in sepsis. A positive C. diff PCR identifies a source — it does not replace the obligation to treat the septic state simultaneously with IV antibiotics and hemodynamic resuscitation.`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Post-cardiac arrest. Sedated and intubated after ROSC.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved. On norepinephrine. MAP targeting ≥65.' },
            { icon: '🦵', lbl: 'Extrem',  key: 'ext',     text: 'Cold, mottled. Gradual improvement expected with resuscitation.' }
          ]
        },
        {
          id: 'labs-only-no-treatment',
          label: '✗ WORKUP WITHOUT TREATMENT — SEPTIC ARREST',
          type: 'bad',
          triggers: ['lactate','blood culture','bcx','cbc','bmp','ct'],
          requires: 2,
          excludes: ['liter','fluid','saline','antibiotic','ceftriaxone','pip-tazo','piperacillin','zosyn','vasopressor','norepi'],
          headline: 'Labs ordered — no resuscitation or antibiotics',
          narrative: `You order workup but don't initiate resuscitation or antibiotics. In sepsis, <span class="hl">every hour of antibiotic delay increases mortality by ~7–10%</span>.\n\nMr. Hayes cannot wait. He has active organ dysfunction with MAP 63 and rising lactate.\n\n20 minutes later, the RN calls: <em>"His pressure dropped to 74/38. He's unresponsive to my voice."</em> Two minutes after that: <em>"No pulse! I'm calling a Code Blue!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 3 Bed 14 — Medical-Surgical Unit. Rapid Response to Tower 3 Bed 14.',
            cause: 'PEA cardiac arrest from untreated septic shock. Progressive vasoplegia, end-organ hypoperfusion, and severe lactic acidosis (pH <7.1) led to myocardial depression and pulseless arrest.',
            monitor_phrase: 'Look at the monitor — organized rhythm but no pulse on check. PEA arrest.',
            hs_ts: [
              'Hypovolemia ← untreated distributive shock',
              'Hydrogen ion (severe lactic acidosis from sepsis)',
              'Hypoxia ← SpO₂ declining without oxygen support',
              'Hypo/Hyperkalemia ← AKI in setting of sepsis',
              'Tension pneumothorax (rule out)',
              'Thrombosis / Tamponade (rule out)',
              'Toxins (medications, source of infection)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'Push IV fluids during CPR — hypovolemic component of PEA',
              'Broad-spectrum antibiotics DURING resuscitation if not already given',
              'Treat the septic source — antibiotics are the definitive intervention',
              'Consider sodium bicarbonate if pH <7.1 (bridge, not a fix)',
              'After ROSC: norepinephrine, ICU transfer, continue sepsis bundle'
            ],
            rosc_label: '✓ ROSC Achieved — Initiating Full Sepsis Bundle →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '116',  unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',   val: '74/38',unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',  val: '50',   unit: 'mm Hg',  st: 'vc' },
            { lbl: 'RR',   val: '28',   unit: '/min',    st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved after resuscitation. Mr. Hayes has been intubated and is being transferred to the MICU for ongoing critical care management.<br/><br/><strong>Key teaching:</strong> In sepsis, the workup and treatment run simultaneously. Delaying antibiotics and fluids while waiting for lab results or a confirmed diagnosis costs lives. Time to treatment is the most modifiable mortality predictor.`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Post-cardiac arrest. Sedated and intubated after ROSC. GCS not assessable.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved. On norepinephrine. MAP targeting ≥65.' },
            { icon: '🦵', lbl: 'Extrem',  key: 'ext',     text: 'Cold, mottled. Gradual improvement expected with vasopressor and fluid resuscitation.' }
          ]
        },
        {
          id: 'default-ss1-d1',
          label: 'INCOMPLETE ORDERS — PATIENT DETERIORATING',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Orders incomplete — patient is crashing',
          narrative: `Your orders don't address the hemodynamic emergency in front of you. Mr. Hayes is in sepsis with MAP 63, AKI, and rising lactic acidosis.\n\nFluids and antibiotics are the two most time-sensitive interventions. Without them, septic shock progresses rapidly.\n\n20 minutes pass. The RN calls urgently: <em>"His pressure is 68/32. He's unresponsive. No pulse on check — calling Code Blue now."</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14.',
            cause: 'PEA cardiac arrest from untreated septic shock. No IV fluids, no antibiotics — distributive shock progressed unchecked to cardiovascular collapse.',
            monitor_phrase: 'Look at the monitor — PEA. No pulse on check. Begin high-quality CPR immediately.',
            hs_ts: [
              'Hypovolemia ← distributive shock, no IV resuscitation given',
              'Hydrogen ion (severe lactic acidosis)',
              'Hypoxia ← no oxygen support ordered',
              'Hypo/Hyperkalemia ← AKI from sepsis',
              'Tension pneumothorax (rule out)',
              'Thrombosis / Tamponade (rule out)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'IV fluid boluses during CPR — no resuscitation had been given',
              'IV broad-spectrum antibiotics during resuscitation — the definitive treatment',
              'After ROSC: norepinephrine, MICU transfer, full sepsis bundle',
              'Time to treatment is the most modifiable mortality factor in sepsis'
            ],
            rosc_label: '✓ ROSC Achieved — Beginning Sepsis Bundle Now →'
          },
          noROSCMsg: `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC. The team called the code.\n\nNo fluids, no antibiotics, and no vasopressor support were initiated before cardiac arrest. In septic shock, these three interventions must begin within the first hour. The delay was fatal.\n\nCore teaching: In sepsis with organ dysfunction, the treatment begins at recognition — not after workup is complete.`,
          nextVitals: [
            { lbl: 'HR',   val: '68',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',   val: '68/32',unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',  val: '44',   unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂', val: '84%',  unit: 'RA',      st: 'vc' },
            { lbl: 'GCS',  val: '3',    unit: '/15',     st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved after resuscitation. Mr. Hayes has been intubated and is being transferred to the MICU for ongoing critical care management.<br/><br/><strong>Key teaching:</strong> Sepsis management does not wait for a confirmed diagnosis. Organ dysfunction requires immediate action — fluids, antibiotics, and vasopressor support must begin at recognition, not after workup is complete.`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Post-cardiac arrest. Sedated and intubated after ROSC. Neurological prognosis guarded.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved. Norepinephrine initiated. MAP targeting ≥65 mm Hg.' },
            { icon: '🦵', lbl: 'Extrem',  key: 'ext',     text: 'Cold, mottled extremities. Gradual improvement expected with resuscitation.' }
          ]
        }
      ]
    },

    // Post-arrest decision point: reached only via Code Blue ROSC path
    decision2_postcode: {
      title: 'Post-Arrest MICU Management',
      prompt: 'Mr. Hayes achieved ROSC and has been intubated. He is now in the MICU. His current MAP is 52 mm Hg. The MICU nurse notes: "His abdomen looks really distended — it was bad before but it looks even worse now." What are your orders?',
      placeholder: `Enter your vasopressor and post-arrest orders...\ne.g.: norepinephrine, repeat lactate, 12-lead EKG, etc.`,
      branches: [
        {
          id: 'norepi-post-arrest',
          label: '✓ NOREPINEPHRINE ORDERED — CORRECT FIRST-LINE AGENT',
          type: 'good',
          triggers: ['norepinephrine','norepi','levophed'],
          requires: 1,
          excludes: [],
          headline: 'Norepinephrine initiated — appropriate post-arrest vasopressor',
          narrative: `Norepinephrine is the correct first-line vasopressor in septic shock, including the post-arrest setting. It provides alpha-1 mediated vasoconstriction to restore SVR with minimal chronotropic effect — critical in a post-arrest patient where arrhythmias are a concern.\n\n<strong>Post-ROSC targets:</strong><br/>• MAP ≥65 mm Hg<br/>• SpO₂ 92–98% (avoid hyperoxia — worsens post-arrest brain injury)<br/>• Normoglycemia (target 140–180 mg/dL)<br/>• Consider targeted temperature management if he remains comatose\n\nThe MICU attending: <em>"Good. Start at 0.1 mcg/kg/min and titrate up. Let's get a 12-lead EKG, repeat lactate, and post-intubation chest X-ray."</em>`,
          showVitalsButton: false,
          nextDecision: 'decision_toxic',
          decisions: [
            'Inadequate initial management led to PEA cardiac arrest',
            'ROSC achieved with CPR, epinephrine, IV fluids, and antibiotics during resuscitation',
            'Correctly selected norepinephrine as post-arrest vasopressor (first-line, SSC guidelines)',
            'Post-ROSC targets: MAP ≥65, SpO₂ 92–98%, normoglycemia, TTM if comatose'
          ]
        },
        {
          id: 'vasopressin-post-arrest',
          label: '⚠ VASOPRESSIN — ACCEPTABLE ADJUNCT, NOT FIRST-LINE',
          type: 'warning',
          triggers: ['vasopressin','pitressin'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed'],
          headline: 'Vasopressin ordered — acceptable adjunct, not first-line',
          narrative: `Vasopressin can be used as an adjunct vasopressor in refractory shock, but norepinephrine is the preferred first-line agent in septic shock and post-arrest hypotension.\n\nVasopressin replaces the relative vasopressin deficiency seen in distributive shock but lacks the titratable alpha-adrenergic potency of norepinephrine. It is typically added as a second agent to reduce norepinephrine requirements — not used as monotherapy.\n\nThe MICU fellow adds norepinephrine alongside the vasopressin.`,
          showVitalsButton: false,
          nextDecision: 'decision_toxic',
          decisions: [
            'Vasopressin ordered — acceptable adjunct, not first-line monotherapy',
            'SSC guidelines: norepinephrine first → add vasopressin to reduce norepinephrine dose',
            'MICU team added norepinephrine as primary agent'
          ]
        },
        {
          id: 'dopamine-post-arrest',
          label: '⚠ DOPAMINE — NOT PREFERRED POST-ARREST',
          type: 'warning',
          triggers: ['dopamine'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed'],
          headline: 'Dopamine ordered — higher arrhythmia risk in post-arrest patient',
          narrative: `Dopamine is not preferred in the post-arrest patient. The SOAP-II trial showed dopamine causes significantly more arrhythmias than norepinephrine — particularly atrial fibrillation. Post-arrest myocardium is electrically vulnerable and should not be exposed to dopamine's unpredictable dose-dependent beta-1 effects.\n\nThe MICU attending switches to norepinephrine.`,
          showVitalsButton: false,
          nextDecision: 'decision_toxic',
          decisions: [
            'Dopamine selected in post-arrest septic patient — not preferred',
            'SOAP-II trial: norepinephrine associated with significantly less arrhythmia than dopamine',
            'Post-arrest myocardium is electrically vulnerable — avoid arrhythmogenic agents',
            'MICU team transitioned to norepinephrine'
          ]
        },
        {
          id: 'fluids-no-pressor-post-arrest',
          label: '✗ MORE FLUIDS — VASOPRESSOR NOT ORDERED',
          type: 'bad',
          triggers: ['fluid','liter','saline','bolus','lr','ns'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed','vasopressor','pressor','dopamine','vasopressin'],
          headline: 'Fluids without vasopressor — distributive shock persists',
          narrative: `Mr. Hayes is in distributive septic shock post-arrest. His hypotension is from vasoplegia — not volume depletion. He already received IV fluids during CPR. Additional crystalloid will not raise SVR and risks worsening pulmonary edema in a freshly intubated, post-arrest patient.\n\nMAP drops further to 44 mm Hg. The MICU attending: <em>"We need a vasopressor now. Start norepinephrine."</em>`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded.</strong><br/><br/>Additional fluid loading did not address the vasoplegia. The MICU team started norepinephrine emergently as MAP dropped further. When MAP <65 in post-arrest distributive shock, vasopressor initiation — not more fluid — is the correct next step.`,
          decisions: [
            'Post-arrest MICU patient in distributive shock',
            'Fluid ordered instead of vasopressor — vasoplegia requires vasopressor, not volume',
            'Additional fluids in intubated post-arrest patient risks pulmonary edema',
            'MICU team started norepinephrine emergently'
          ]
        },
        {
          id: 'default-ss1-d2pc',
          label: 'VASOPRESSOR NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Post-arrest management — vasopressor required now',
          narrative: `Mr. Hayes is post-arrest in the MICU with MAP 52 mm Hg. The immediate priority is vasopressor support.\n\nOrder <strong>norepinephrine</strong> — start at 0.1 mcg/kg/min, titrate to MAP ≥65 mm Hg. Also consider: repeat lactate, 12-lead EKG (rule out STEMI as arrest precipitant), post-intubation CXR, and targeted temperature management if he remains comatose.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded.</strong><br/><br/>Vasopressor was not initiated. The MICU team started norepinephrine. In post-arrest distributive shock, norepinephrine should be the first order written in the MICU.`,
          decisions: [
            'Post-arrest MICU transfer achieved',
            'Vasopressor not ordered — MICU team intervened',
            'First-line post-arrest vasopressor: norepinephrine (SSC guidelines)'
          ]
        }
      ]
    },

    decision_toxic: {
      title: 'Toxic Megacolon Management',
      prompt: 'The CT abdomen results are back. The radiologist calls you: "On Mr. Hayes\' CT we\'re seeing marked dilation of the transverse colon measuring 9.2 centimeters, thinning of the colonic wall, focal intramural air, and extensive pericolonic fat stranding. No free air at this time." Mr. Hayes\' abdomen is markedly distended and tympanitic. What are your next orders?',
      placeholder: `Enter your orders...\ne.g.: general surgery consult, IV metronidazole, PO vancomycin, NPO, bowel rest, etc.`,
      branches: [
        {
          id: 'full-toxic-mgmt',
          label: '✓ COMPLETE TOXIC MEGACOLON MANAGEMENT',
          type: 'good',
          triggers: ['surgery','surgical','gen surg','general surgery','egs','emergency general surgery','metronidazole','flagyl','vancomycin','vanco','npo','bowel rest','colectomy'],
          requires: 3,
          excludes: [],
          headline: 'Complete management of toxic megacolon',
          narrative: `You address all components simultaneously:\n\n<strong>Surgery consult:</strong> Emergency general surgery paged and evaluating at bedside. The surgical team immediately begins planning for OR.\n\n<strong>C. diff treatment:</strong> IV metronidazole 500 mg q8h + PO vancomycin 125–500 mg q6h via NG tube initiated. Both routes required for complicated C. diff.\n\n<strong>NPO + bowel decompression:</strong> NG tube placed. Strict bowel rest. Serial abdominal exams ordered every 4–6 hours.\n\nThe surgery attending: <em>"Good — let's get him prepped for the OR."</em>`,
          showVitalsButton: false,
          nextDecision: 'decision2_volassess'
        },
        {
          id: 'surgery-no-cdiff-tx',
          label: '✗ SURGERY ONLY — C. DIFF TREATMENT NOT ORDERED',
          type: 'bad',
          triggers: ['surgery','surgical','gen surg','general surgery','egs'],
          requires: 1,
          excludes: ['metronidazole','flagyl','vancomycin','vanco'],
          headline: 'Surgery consulted — C. diff treatment missing — patient decompensates',
          narrative: `Surgery is on the way. But the underlying C. diff infection has not been treated medically — the bacterial toxin continues to destroy the colonic wall unchecked.\n\n45 minutes later the colon perforates. The RN calls urgently: <em>"His abdomen is completely rigid. He's diaphoretic and moaning. BP just dropped to 58/28 — I don't have a pulse. CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA — Septic)',
            overhead: 'Code Blue, Tower 3 Bed 14. Surgery to Tower 3 Bed 14 STAT.',
            cause: '',
            monitor_phrase: 'Look at the monitor — PEA. Rigid abdomen. No pulse on check. Begin CPR.',
            hs_ts: [
              'Hypovolemia ← fecal peritonitis, massive third-spacing',
              'Hydrogen ion (severe lactic acidosis from peritonitis)',
              'Hypoxia ← respiratory compromise from abdominal distension',
              'Septic source uncontrolled — ongoing C. diff infection + perforation'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min',
              'IV metronidazole + PO vancomycin via NG — must be started NOW',
              'Aggressive IV resuscitation during CPR',
              'Emergency surgery activation for emergent laparotomy',
              'After ROSC: emergent OR for subtotal colectomy'
            ],
            rosc_label: '✓ ROSC Achieved — Completing Management →'
          },
          noROSCMsg: `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC.\n\nThe surgery consult was placed but C. diff medical treatment was not initiated. Toxic megacolon requires simultaneous surgical consultation AND medical treatment — IV metronidazole + PO vancomycin must be started immediately, not deferred.`,
          nextVitals: [
            { lbl: 'HR',  val: '148',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',  val: '58/28',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP', val: '38',   unit: 'mm Hg', st: 'vc' },
          ],
          vitalsMsg: `Colonic perforation — fecal peritonitis. Patient unresponsive. Code Blue called.`,
          nextDecision: 'decision_toxic_postrosc'
        },
        {
          id: 'cdiff-tx-no-surgery',
          label: '✗ C. DIFF TREATED — SURGERY NOT CONSULTED',
          type: 'bad',
          triggers: ['metronidazole','flagyl','vancomycin','vanco'],
          requires: 1,
          excludes: ['surgery','surgical','gen surg','general surgery','egs'],
          headline: 'Antibiotics started — no surgical consult — colon perforates',
          narrative: `IV metronidazole and PO vancomycin are running. But the transverse colon is 9.2 cm with pneumatosis coli — this is a pre-perforation emergency. Antibiotics alone cannot decompress a massively dilated colon at imminent risk.\n\n30 minutes later the RN calls: <em>"Something is really wrong. His abdomen went completely rigid. He stopped responding to me. I don't have a pulse — calling Code Blue!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA — Obstructive)',
            overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14. General Surgery to Tower 3 STAT.',
            cause: '',
            monitor_phrase: 'Look at the monitor — PEA. Silent, rigid abdomen. No pulse. Begin CPR.',
            hs_ts: [
              'Hypovolemia ← massive third-spacing from peritonitis',
              'Hydrogen ion (severe metabolic acidosis)',
              'Hypoxia ← respiratory compromise, abdominal splinting',
              'Tension from abdominal compartment syndrome',
              'Septic source uncontrolled — perforated colon'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min',
              'Emergency surgery activation immediately — emergent laparotomy required',
              'Antibiotics already running — continue during CPR',
              'Aggressive volume resuscitation',
              'After ROSC: emergent OR'
            ],
            rosc_label: '✓ ROSC Achieved — Emergency Surgery Now →'
          },
          noROSCMsg: `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC.\n\nC. diff antibiotics were started but emergency surgical consultation was not placed. Toxic megacolon with pneumatosis coli required immediate surgical involvement — antibiotics alone cannot prevent perforation of a 9.2 cm colon with thinned wall and intramural air.`,
          nextVitals: [
            { lbl: 'HR',  val: '152',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',  val: '60/30',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP', val: '40',   unit: 'mm Hg', st: 'vc' },
          ],
          vitalsMsg: `Colonic perforation — peritonitis. Patient unresponsive. Code Blue called.`,
          nextDecision: 'decision_toxic_postrosc'
        },
        {
          id: 'toxic-no-management',
          label: '✗ NO TOXIC MEGACOLON MANAGEMENT',
          type: 'bad',
          triggers: ['icu','micu','transfer','norepinephrine','norepi','fluid','liter','saline','pocus','ultrasound'],
          requires: 1,
          excludes: ['surgery','surgical','gen surg','general surgery','egs','metronidazole','flagyl','vancomycin','vanco'],
          headline: 'Toxic megacolon not addressed — perforation',
          narrative: `You address hemodynamics but not the surgical emergency. 9.2 cm colon with pneumatosis coli — perforation is minutes away.\n\n20 minutes later: The RN shouts — <em>"His abdomen is rigid. He's gone limp — no pulse! CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA — Septic + Obstructive)',
            overhead: 'Code Blue, Tower 3 Bed 14. Surgery to Tower 3 Bed 14 STAT.',
            cause: '',
            monitor_phrase: 'Look at the monitor — PEA. Rigid abdomen. No pulse. Begin CPR immediately.',
            hs_ts: [
              'Hypovolemia ← massive third-spacing from fecal peritonitis',
              'Hydrogen ion (severe metabolic acidosis from peritonitis)',
              'Hypoxia ← respiratory compromise',
              'Septic source uncontrolled — perforated bowel, fecal contamination'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min',
              'Broad-spectrum IV antibiotics covering gram-negatives and anaerobes',
              'Aggressive volume resuscitation during CPR',
              'Emergency surgery activation during CPR — emergent laparotomy required',
              'After ROSC: emergent OR for subtotal colectomy'
            ],
            rosc_label: '✓ ROSC Achieved — Emergent OR Activation →'
          },
          noROSCMsg: `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC.\n\nToxic megacolon was identified on CT but neither surgical consultation nor C. diff treatment was initiated. The colon perforated causing fecal peritonitis and cardiovascular collapse. Toxic megacolon is a surgical emergency — hemodynamic management alone is insufficient.`,
          nextVitals: [
            { lbl: 'HR',      val: '142',          unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',      val: '66/34',         unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',     val: '44',            unit: 'mm Hg', st: 'vc' },
            { lbl: 'Abdomen', val: 'RIGID, silent', unit: '',      st: 'vc' },
          ],
          vitalsMsg: `Colonic perforation — fecal peritonitis. Patient unresponsive. Code Blue called.`,
          nextDecision: 'decision_toxic_postrosc'
        },
        {
          id: 'default-toxic',
          label: 'INCOMPLETE TOXIC MEGACOLON MANAGEMENT',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Incomplete response — patient decompensates',
          narrative: `The CT findings require immediate action and your orders did not fully address the emergency. The colon continues to dilate and the wall continues to thin.\n\nThe RN calls: <em>"His abdomen is worse. He just went unresponsive — no pulse. CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14.',
            cause: '',
            monitor_phrase: 'Look at the monitor — PEA. No pulse on check. Begin CPR.',
            hs_ts: [
              'Hypovolemia ← distributive + third-spacing from peritonitis',
              'Hydrogen ion (lactic acidosis)',
              'Hypoxia',
              'Septic source uncontrolled — untreated C. diff + toxic megacolon'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min',
              'Broad-spectrum IV antibiotics + IV metronidazole NOW',
              'Emergency surgery activation during CPR',
              'After ROSC: emergent OR'
            ],
            rosc_label: '✓ ROSC Achieved — Completing Management Now →'
          },
          noROSCMsg: `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC.\n\nThe CT findings were not acted upon adequately. Toxic megacolon requires immediate simultaneous management: (1) emergency surgery consultation, (2) IV metronidazole + PO vancomycin, and (3) NPO with bowel decompression.`,
          nextVitals: [
            { lbl: 'HR',  val: '140',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',  val: '64/32',unit: 'mm Hg', st: 'vc' },
          ],
          vitalsMsg: `Patient unresponsive. Code Blue called.`,
          nextDecision: 'decision_toxic_postrosc'
        }
      ]
    },

    decision_toxic_postrosc: {
      title: 'Post-Arrest Management — Perforated Colon',
      prompt: 'ROSC achieved. Mr. Hayes is intubated, hemodynamically unstable, and has a rigid abdomen. What are your immediate post-arrest orders?',
      placeholder: `Enter your orders...\ne.g.: norepinephrine, central line, IV metronidazole, PO vancomycin, surgery consult, etc.`,
      branches: [
        {
          id: 'full-postrosc-mgmt',
          label: '✓ COMPLETE POST-ARREST MANAGEMENT',
          type: 'good',
          triggers: ['norepinephrine','norepi','levophed','central line','cvl','central venous','metronidazole','flagyl','vancomycin','vanco','surgery','surgical','gen surg','general surgery','egs'],
          requires: 4,
          excludes: [],
          headline: 'Complete post-arrest management — emergent OR activation',
          narrative: `You address all critical components simultaneously:\n\n<strong>Vasopressor:</strong> Norepinephrine started for MAP support in distributive + hemorrhagic shock physiology from peritonitis.\n\n<strong>Central access:</strong> Central line placed — required for reliable vasopressor delivery and hemodynamic monitoring in a patient going emergently to the OR.\n\n<strong>C. diff treatment:</strong> IV metronidazole + PO vancomycin via NG tube — both routes required for complicated C. diff with toxic megacolon.\n\n<strong>Surgery:</strong> Emergency general surgery activated. The team is at bedside — subtotal colectomy with end ileostomy is planned.\n\nThe surgery attending: <em>"We're taking him to the OR now. Get anesthesia on the phone."</em>`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Emergent OR.</strong><br/><br/>Mr. Hayes was taken emergently to the operating room for subtotal colectomy with end ileostomy. Intraoperative findings confirmed perforated toxic megacolon with fecal peritonitis.<br/><br/>Post-operative course is prolonged with an expected extended ICU stay. Prognosis is guarded — perforated toxic megacolon carries 40–80% mortality.<br/><br/><strong>Key teaching:</strong> Abdominal imaging in a septic patient with profuse diarrhea and distension is not optional. The CT abdomen was the critical missed order that led to this sequence of events.`,
          decisions: [
            'CT abdomen was not ordered — toxic megacolon was not diagnosed',
            'Colonic perforation led to fecal peritonitis and cardiac arrest',
            'Post-ROSC: norepinephrine, central line, IV metronidazole + PO vancomycin, surgery consult',
            'Emergent subtotal colectomy required — OR activation appropriate',
            'Core teaching: abdominal imaging is essential in septic patients with GI symptoms and distension'
          ]
        },
        {
          id: 'postrosc-no-surgery',
          label: '⚠ PRESSORS + ANTIBIOTICS — NO SURGERY CONSULT',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed','metronidazole','flagyl','vancomycin','vanco'],
          requires: 2,
          excludes: ['surgery','surgical','gen surg','general surgery','egs','emergency general surgery'],
          headline: 'Medical management started — surgery not consulted',
          narrative: `Vasopressors and antibiotics — the right instincts. But a perforated bowel cannot be managed with antibiotics alone. <span class="hl">This patient needs emergent surgery.</span>\n\nThe MICU fellow calls: <em>"We can stabilize his hemodynamics temporarily but we can't fix a perforation. General surgery needs to be here now."</em>\n\nThe attending places the surgery consult emergently.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded.</strong><br/><br/>The attending placed an emergency surgery consult. Mr. Hayes was taken to the OR for subtotal colectomy. The surgical delay worsened his prognosis. In perforated toxic megacolon, surgery must be activated simultaneously with medical stabilization — not after.`,
          decisions: [
            'Vasopressors and antibiotics ordered — correct medical management',
            'Emergency surgery not consulted — critical omission for a perforated bowel',
            'Surgery activation must be simultaneous with medical stabilization, not sequential'
          ]
        },
        {
          id: 'postrosc-no-abx',
          label: '⚠ PRESSORS + SURGERY — NO C. DIFF ANTIBIOTICS',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed','surgery','surgical','gen surg','general surgery','egs'],
          requires: 2,
          excludes: ['metronidazole','flagyl','vancomycin','vanco'],
          headline: 'Surgery and pressors — C. diff antibiotics missing',
          narrative: `Surgery is activated and vasopressors are running. But the underlying C. diff infection is not being treated medically.\n\nFor complicated C. diff (toxic megacolon = complicated), surgery is required — but IV metronidazole + PO vancomycin should run simultaneously. PO vancomycin can be delivered via NG tube even in intubated patients.\n\nThe surgery team preps for the OR while the pharmacist adds IV metronidazole and PO vancomycin via NG.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded.</strong><br/><br/>Mr. Hayes went to the OR with surgery and pressors running but no C. diff antibiotics. The pharmacist added them perioperatively. Complete management requires both surgical and medical treatment simultaneously.`,
          decisions: [
            'Surgery consulted and vasopressors initiated — correct',
            'Missing: IV metronidazole + PO vancomycin for C. diff treatment',
            'Both surgical and medical management must run simultaneously in complicated C. diff'
          ]
        },
        {
          id: 'postrosc-pressors-only',
          label: '✗ PRESSORS ONLY — INCOMPLETE POST-ARREST MANAGEMENT',
          type: 'bad',
          triggers: ['norepinephrine','norepi','levophed','vasopressor','pressor','fluid','liter','saline'],
          requires: 1,
          excludes: ['surgery','surgical','gen surg','general surgery','egs','metronidazole','flagyl','vancomycin','vanco','central line','cvl'],
          headline: 'Vasopressor started — critical interventions missing',
          narrative: `Hemodynamic support is started but the underlying cause — a perforated bowel with fecal peritonitis — remains unaddressed.\n\nMAP briefly improves then drops again. The surgery fellow passes by the room and looks in: <em>"Is that a rigid abdomen? Why isn't surgery involved? This patient needs the OR immediately."</em>\n\nThe attending urgently places consults for surgery and adds IV antibiotics.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Incomplete Post-Arrest Management.</strong><br/><br/>Hemodynamic support was initiated but the perforated bowel, C. diff treatment, and central line were all omitted. Post-ROSC management of perforated toxic megacolon requires simultaneous activation of all four components: vasopressor, central access, IV + PO antibiotics, and emergency surgery.`,
          decisions: [
            'Vasopressor initiated — correct but incomplete',
            'Missing: central line, IV metronidazole + PO vancomycin, surgery consult',
            'Post-cardiac arrest from peritonitis requires all four interventions simultaneously'
          ]
        },
        {
          id: 'default-postrosc',
          label: 'POST-ARREST ORDERS NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Post-arrest management required',
          narrative: `Mr. Hayes is post-cardiac arrest with a perforated colon and fecal peritonitis. Four things must happen immediately and simultaneously:\n\n<strong>(1) Norepinephrine</strong> — vasopressor support for MAP ≥65<br/><strong>(2) Central line (CVL)</strong> — reliable access for vasopressors and monitoring<br/><strong>(3) IV metronidazole + PO vancomycin via NG tube</strong> — treat the C. diff<br/><strong>(4) Emergency general surgery consult</strong> — emergent laparotomy required\n\nWhat are your orders?`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded.</strong><br/><br/>The MICU team and surgery intervened. Mr. Hayes was taken to the OR emergently.`,
          decisions: [
            'Post-ROSC management incomplete — MICU and surgery team intervened'
          ]
        }
      ]
    },

    decision2_volassess: {
      title: 'Volume Status Assessment',
      prompt: 'Mr. Hayes is being prepared for the OR. Hemodynamically he remains borderline — MAP 62. Before the surgical team takes him, you want to assess his volume status. What would you like to do?',
      placeholder: `Enter your assessment orders...\ne.g.: POCUS, bedside ultrasound, passive leg raise, proceed, etc.`,
      branches: [
        {
          id: 'pocus-vol',
          label: '✓ BEDSIDE POCUS ORDERED',
          type: 'good',
          triggers: ['pocus','bedside echo','bedside ultrasound','point of care ultrasound','point-of-care ultrasound','ivc ultrasound','cardiac echo','echo'],
          requires: 1,
          excludes: [],
          headline: 'POCUS performed — volume status assessed',
          narrative: `You perform a bedside point-of-care ultrasound to assess IVC collapsibility and cardiac function.\n\n{{POCUS_VOL_RESULT}}\n\n<strong>2026 SSC Update (Rec 49):</strong> Dynamic measures — including POCUS assessment of IVC collapsibility — are now <span class="hl">suggested over physical examination or static measures alone</span> to guide initial fluid resuscitation. This is an upgraded recommendation from 2021.`,
          showVitalsButton: true,
          showPocusModal: true,
          nextVitals: [
            { lbl: 'HR',   val: '88',     unit: 'bpm',   st: 'vn' },
            { lbl: 'BP',   val: '101/44', unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '62',     unit: 'mm Hg', st: 'vw' },
            { lbl: 'RR',   val: '24',     unit: '/min',   st: 'vw' },
            { lbl: 'SpO₂', val: '94%',    unit: 'RA',     st: 'vw' },
          ],
          vitalsMsg: `{{POCUS_VOL_MSG}}`,
          nextDecision: 'decision2'
        },
        {
          id: 'plr-vol',
          label: '✓ PASSIVE LEG RAISE PERFORMED',
          type: 'good',
          triggers: ['passive leg raise','plr','leg raise','fluid challenge'],
          requires: 1,
          excludes: [],
          headline: 'Passive leg raise performed — fluid responsiveness assessed',
          narrative: `You perform a passive leg raise — a reversible ~500 mL autotransfusion that assesses preload responsiveness without committing additional IV fluid.\n\n{{PLR_VOL_RESULT}}\n\n<strong>2026 SSC Update (Rec 49):</strong> Dynamic measures including PLR are now <span class="hl">suggested over static measures alone</span> to guide fluid resuscitation decisions.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '88',     unit: 'bpm',   st: 'vn' },
            { lbl: 'BP',   val: '101/44', unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '62',     unit: 'mm Hg', st: 'vw' },
            { lbl: 'RR',   val: '24',     unit: '/min',   st: 'vw' },
          ],
          vitalsMsg: `{{PLR_VOL_MSG}}`,
          nextDecision: 'decision2'
        },
        {
          id: 'skip-vol-assessment',
          label: 'PROCEED TO MANAGEMENT',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Proceeding without formal volume assessment',
          narrative: `You proceed without formal volume status assessment. Mr. Hayes remains hypotensive with MAP 62.\n\nFor future reference: the 2026 SSC guidelines suggest using dynamic measures (POCUS, passive leg raise, pulse pressure variation) over static measures or physical exam alone to guide fluid resuscitation decisions.`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        }
      ]
    },

    decision2: {
      title: 'Pre-Operative Stabilization',
      prompt: 'Mr. Hayes is heading to the OR. MAP is 62. {{LACTATE_D2}}He received {{FLUID_L}}L LR and {{ANTIBIOTIC}}. The surgical team is at bedside. What are your final pre-operative orders?',
      placeholder: `Enter your next orders...\ne.g.: norepinephrine, MICU transfer, vasopressin, etc.`,
      branches: [
        {
          id: 'norepi-and-icu',
          label: '✓ FIRST-LINE VASOPRESSOR + ICU ESCALATION',
          type: 'good',
          triggers: ['norepinephrine','norepi','levophed','icu','micu','intensive care','transfer'],
          requires: 2,
          excludes: [],
          headline: 'Norepinephrine + ICU transfer — correct escalation',
          narrative: `Norepinephrine is the correct pre-operative vasopressor choice. MAP needs to be ≥65 before the anesthesia team will safely proceed.\n\n<strong>2026 SSC Update:</strong> Norepinephrine remains the <span class="hl">suggested first-line vasopressor</span> in septic shock. Peripheral vasopressor initiation is acceptable while central access is obtained — do not delay for a central line.\n\n<strong>Age-adjusted MAP:</strong> For adults ≥65 years, MAP 60–65 mm Hg is acceptable (2026 rec 14). Mr. Hayes is 85 years old — do not over-target MAP.\n\nThe anesthesia attending: <em>"Good — get norepi running peripherally. We'll place an art line in the OR. Let's move."</em>`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Complete — Emergent OR.</strong><br/><br/>Mr. Hayes is taken emergently to the operating room on norepinephrine. Subtotal colectomy with end ileostomy is performed. Intraoperative findings confirm fecal peritonitis from toxic megacolon. The C. diff PCR returned positive.<br/><br/>Post-operative ICU course is prolonged. Prognosis is guarded — perforated toxic megacolon carries significant mortality — but early recognition and complete management gave him the best possible chance.`,
          decisions: [
            'Recognized sepsis despite atypical presentation — no fever, subtle vitals',
            'Initiated complete early sepsis bundle: cultures, lactate, IV fluids, IV antibiotics',
            'Identified persistent hypotension after fluid resuscitation = septic shock',
            '2026 SSC: norepinephrine "suggested" as first-line vasopressor (SOAP-II trial)',
            'Peripheral vasopressor initiation acceptable while central access obtained (2026 rec 12)',
            'Age-adjusted MAP target: 60–65 mm Hg acceptable for adults ≥65 years (2026 rec 14)',
            'Appropriately escalated to ICU-level monitoring within 6 hours (2026 rec 15)'
          ]
        },
        {
          id: 'norepi-no-icu',
          label: '⚠ PRESSOR WITHOUT ICU TRANSFER',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed','vasopressor','pressor'],
          requires: 1,
          excludes: ['icu','micu','transfer','intensive care'],
          headline: 'Vasopressor started — ICU transfer not ordered',
          narrative: `You start norepinephrine — the correct choice. However, any patient requiring IV vasopressor support <span class="hl">requires ICU-level monitoring</span>. Floor nurses cannot safely titrate vasopressors or respond to the hemodynamic changes that follow.\n\nThe charge nurse calls: <em>"We can start this drip, but we're not staffed for vasopressor management up here. He really needs the unit."</em>\n\nMr. Hayes is ultimately transferred. Vasopressor initiation and ICU transfer are inseparable decisions.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Complete.</strong><br/><br/>Mr. Hayes is taken to the OR. The vasopressor was the right call — MAP must be ≥65 for safe anesthesia. Next time: vasopressor initiation and ICU/OR transfer are inseparable decisions in a hemodynamically unstable surgical patient.`,
          decisions: [
            'Recognized need for vasopressor support',
            'Correctly chose norepinephrine as first-line agent',
            'Missed: explicit ICU transfer order — floor is not appropriate for vasopressor management'
          ]
        },
        {
          id: 'dopamine-choice',
          label: '⚠ DOPAMINE — NOT PREFERRED AGENT',
          type: 'warning',
          triggers: ['dopamine'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed'],
          headline: 'Dopamine chosen — not the preferred vasopressor',
          narrative: `Dopamine was historically used in septic shock and remains a reasonable choice in select settings — however, <span class="hl">the 2026 SSC guidelines suggest norepinephrine as the first-line vasopressor</span> (note: "suggest," not "recommend" — the evidence strength was actually downgraded in 2026 from the 2021 version, but norepinephrine remains the preferred agent based on the SOAP-II trial).\n\nThe SOAP-II trial (De Backer et al., 2010) demonstrated that dopamine was associated with significantly higher rates of arrhythmia — particularly atrial fibrillation — compared to norepinephrine. Its unpredictable dose-dependent receptor effects make it less favorable in distributive shock.\n\nThe ICU attending switches to norepinephrine on Mr. Hayes' arrival to the unit.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Complete.</strong><br/><br/>Dopamine was transitioned to norepinephrine before the OR. Norepinephrine is the evidence-based first-line vasopressor in septic shock — less arrhythmia risk (SOAP-II trial), especially important in a pre-operative patient.`,
          decisions: [
            'Recognized need for vasopressor support',
            'Selected dopamine — not first-line per current SSC guidelines',
            'SOAP-II trial: norepinephrine associated with less arrhythmia than dopamine'
          ]
        },
        {
          id: 'more-fluid-no-pressor',
          label: '✗ MORE FLUID — NO VASOPRESSOR — ARREST',
          type: 'bad',
          triggers: ['fluid','saline','liter','bolus','more fluid','another liter'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed','vasopressor','pressor','dopamine','vasopressin'],
          headline: 'Fluid loading without vasopressor — septic arrest',
          narrative: `You continue fluid loading despite a rising lactate and persistent MAP <65. Distributive shock at this stage cannot be resolved with volume alone — the problem is vasoplegia, not hypovolemia.\n\nSpO₂ drops to 87% as bilateral crackles develop from fluid overload. Then: HR climbs to 140, BP drops to 60/30. The monitor alarms. Mr. Hayes becomes unresponsive. No pulse on check.\n\nThe RN activates the Code Blue.`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14.',
            cause: 'PEA arrest from refractory distributive shock. Fluid overload impaired respiratory function (bilateral crackles, SpO₂ 87%) while untreated vasoplegia drove progressive hemodynamic collapse.',
            monitor_phrase: 'Look at the monitor — organized electrical activity, no pulse. PEA arrest.',
            hs_ts: [
              'Hypovolemia (relative — distributive, not absolute)',
              'Hydrogen ion (lactic acidosis from ongoing shock)',
              'Hypoxia ← fluid overload → pulmonary edema',
              'Tension pneumothorax (rule out — bilateral crackles may mimic)',
              'Hypo/Hyperkalemia ← AKI from sepsis',
              'Thrombosis / Tamponade (rule out)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'Do NOT give more fluid during resuscitation — volume overload already present',
              'Norepinephrine should have been started before this point',
              'After ROSC: norepinephrine titrated to MAP ≥65, consider furosemide for pulmonary edema',
              'Rising lactate + MAP <65 after {{FLUID_L}}L = vasopressor indication — do not delay further'
            ],
            rosc_label: '✓ ROSC Achieved — Initiating Vasopressor Support →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '140',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '60/30',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '40',   unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '87%',  unit: 'on NRB',st: 'vc' },
          ],
          vitalsMsg: `After ROSC, Mr. Hayes is intubated and transferred to the MICU on norepinephrine. Furosemide is given for pulmonary edema from excessive fluid loading.<br/><br/><strong>Key teaching:</strong> In septic shock with rising lactate and MAP <65 after initial resuscitation, the next step is a vasopressor — not more fluid. Norepinephrine should not require 4+ liters to trigger.`,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Concluded — Preventable Arrest.</strong><br/><br/>Mr. Hayes coded because vasopressor initiation was delayed in favour of continued fluid loading. After ROSC, he is in the MICU on norepinephrine + furosemide for fluid overload. The lesson: rising lactate + MAP <65 after {{FLUID_L}}L = septic shock = start norepinephrine.`,
          decisions: [
            'Identified persistent septic shock but chose more fluid over vasopressor',
            'Fluid loading worsened pulmonary edema and did not resolve vasoplegia',
            'PEA arrest from refractory distributive shock + hypoxia',
            'Post-ROSC: norepinephrine + diuresis for fluid overload'
          ]
        },
        {
          id: 'default-ss1-d2',
          label: 'MANAGEMENT DIRECTION NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Next steps needed',
          narrative: `Mr. Hayes is in septic shock — MAP <65 despite {{FLUID_L}}L resuscitation with a rising lactate. Next steps: <strong>(1)</strong> initiate norepinephrine 0.1–0.3 mcg/kg/min titrating to MAP ≥65, and <strong>(2)</strong> transfer to the MICU. The floor cannot safely manage a vasopressor-dependent patient.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case ended.</strong><br/><br/>The Rapid Response team was called and escalated care.`,
          decisions: ['Septic shock recognized but vasopressor initiation delayed']
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // SEPSIS CASE 2 — Ms. Valentina Reyes · Septic Shock & Adrenal Crisis
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ss-2',
    title: 'Case #2',
    blurb: 'Young woman on chronic immunosuppression presenting with septic shock.',
    artType: 'sepsis2',
    patient: { name: 'Valentina Reyes', initials: 'VR', age: '20F', weight: '58 kg', allergies: 'NKDA' },

    vignette: `<p>A 20-year-old woman with <span class="hl">systemic lupus erythematosus (SLE)</span> on cyclophosphamide and <span class="hl">prednisone 20 mg daily × 3 months</span> presented to the ED with abdominal pain, back pain, nausea, and lethargy. She was admitted for sepsis workup.</p><p>On the telemetry unit, she has been declining since midnight.</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">Tower 4 · Bed 8</div><div class="pager-time">02:14</div></div></div><div class="pager-msg">"Ms. Reyes is going downhill fast. BP dropped to 85/55 and I can barely wake her up. She was okay two hours ago. Please come now."</div></div>`,

    rnReport: `"She's barely staying awake. Temp is 38.8. BP cycled at 85/55, HR 120. She's been on prednisone 20 mg for about 3 months for her lupus flare. I already gave her a small bolus. She looks really sick — skin was warm before but now it's cooling."`,
    rnCues: [
      'What is the significance of chronic prednisone use in a patient in septic shock?',
      'Does POCUS change your management?'
    ],

    vitals: [
      { lbl: 'HR',   val: '120',    unit: 'bpm',      st: 'vc' },
      { lbl: 'BP',   val: '85/55',  unit: 'mm Hg',    st: 'vc' },
      { lbl: 'MAP',  val: '65',     unit: 'mm Hg',    st: 'vw' },
      { lbl: 'RR',   val: '22',     unit: '/min',      st: 'vw' },
      { lbl: 'Temp', val: '38.8°C', unit: '101.8°F',  st: 'vw' },
      { lbl: 'SpO₂', val: '92%',   unit: '4L NC',     st: 'vw' },
      { lbl: 'GCS',  val: '12',     unit: '/15',       st: 'vw' }
    ],

    labs: [
      { lbl: 'WBC',     val: '2.1',   unit: 'K/µL',    st: 'lv-c' },
      { lbl: 'Hgb',     val: '10.8',  unit: 'g/dL',    st: 'lv-a' },
      { lbl: 'Plt',     val: '95',    unit: 'K/µL',    st: 'lv-c' },
      { lbl: 'Na',      val: '128',   unit: 'mEq/L',   st: 'lv-c' },
      { lbl: 'Creat',   val: '2.3',   unit: 'mg/dL',   st: 'lv-c' },
      { lbl: 'HCO₃',   val: '17',    unit: 'mEq/L',   st: 'lv-c' },
      { lbl: 'Lactate', val: '5.2',   unit: 'mmol/L',  st: 'lv-c' },
      { lbl: 'Cortisol',val: '8.2',   unit: 'mcg/dL ↓',st: 'lv-c' },
      { lbl: 'pH',      val: '7.29',  unit: 'ABG',     st: 'lv-c' },
      { lbl: 'PaO₂',   val: '68',    unit: 'mm Hg',   st: 'lv-a' },
    ],

    examSystems: [
      { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Lethargic. Oriented to person only. Slow to respond. GCS 12.' },
      { icon: '👁️', lbl: 'General', key: 'gen',     text: 'Young female, acutely ill. Diaphoretic. Skin warm initially, now cooling. Mild cushingoid features from steroid use.' },
      { icon: '👄', lbl: 'HEENT',   key: 'heent',   text: 'Dry mucous membranes. No JVD.' },
      { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Tachycardic. Regular rhythm. Extremities cooling.' },
      { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'Tachypneic. Scattered bibasilar rales.' },
      { icon: '🫃', lbl: 'Abdomen', key: 'abd',     text: 'Mild diffuse tenderness. Non-distended. No peritoneal signs.' },
      { icon: '🔬', lbl: 'POCUS',   key: 'pocus',   text: 'Hyperdynamic LV. Small, collapsible IVC (>50% collapse) — volume responsive. Bilateral B-lines. No pericardial effusion. Distributive shock physiology.' }
    ],

    decision1: {
      title: 'Septic Shock — Resuscitation, Vasopressor & Steroid Decision',
      prompt: 'Ms. Reyes: MAP 65, lactate 5.2, on prednisone 20 mg/day × 3 months. POCUS: hyperdynamic LV, collapsible IVC. CXR: bilateral interstitial opacities. What are your initial orders?',
      placeholder: `Enter your orders...\ne.g.: fluids, norepinephrine, hydrocortisone, antibiotics, etc.`,
      branches: [
        {
          id: 'complete-bundle-with-steroids',
          label: '✓ COMPLETE BUNDLE + STRESS DOSE STEROIDS',
          type: 'good',
          triggers: ['fluid','liter','saline','blood culture','bcx','antibiotic','zosyn','pip','meropenem','norepinephrine','norepi','levophed','hydrocortisone','steroid','stress dose','solu-cortef'],
          requires: 4,
          excludes: [],
          headline: 'Complete septic shock bundle with adrenal recognition',
          narrative: `Outstanding — all critical components addressed:\n\n<strong>Cultures + antibiotics:</strong> Broad-spectrum IV coverage for immunosuppressed host<br/><strong>Fluids:</strong> 30 mL/kg balanced crystalloid (LR preferred over NS — 2026 SSC rec 44), titrated with POCUS<br/><strong>Vasopressor:</strong> Norepinephrine targeting MAP ≥65<br/><strong>Steroids:</strong> Hydrocortisone — <span class="hl">critical given 3 months of chronic prednisone</span>\n\n<strong>2026 SSC Corticosteroid Update (Rec 79):</strong> The 2026 guidelines now suggest IV corticosteroids for <span class="hl">any patient with septic shock</span> — no longer restricted to refractory shock only. This was downgraded from a "for vasopressor-dependent patients" indication to a broader "for patients with septic shock" recommendation, with IV administration emphasized over oral.\n\nMs. Reyes additionally has HPA axis suppression risk from chronic prednisone — her cortisol of 8.2 mcg/dL is inappropriately low for a critically ill patient. Do NOT wait for stimulation testing in shock.\n\nHydrocortisone: <strong>50 mg IV q6h</strong> (or 200 mg/day continuous infusion).`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '104',   unit: 'bpm',   st: 'vw' },
            { lbl: 'BP',   val: '93/59', unit: 'mm Hg', st: 'vw' },
            { lbl: 'MAP',  val: '70',    unit: 'mm Hg', st: 'vn' },
            { lbl: 'RR',   val: '20',    unit: '/min',   st: 'vn' },
            { lbl: 'SpO₂', val: '94%',   unit: '4L NC', st: 'vn' },
          ],
          vitalsMsg: `45 min after norepinephrine, 2L LR, hydrocortisone 50 mg IV, and broad-spectrum antibiotics. MAP at goal.`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Somewhat more responsive. Oriented to person and place. Clearly improving.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'HR improving. Extremities marginally warmer with vasopressor support.' }
          ]
        },
        {
          id: 'bundle-no-steroids',
          label: '⚠ MISSED STRESS DOSE STEROIDS',
          type: 'warning',
          triggers: ['fluid','liter','saline','antibiotic','zosyn','pip','meropenem','norepinephrine','norepi','levophed'],
          requires: 3,
          excludes: ['hydrocortisone','steroid','stress dose','solu-cortef','cortisol'],
          headline: 'Septic shock bundle initiated — steroids missed',
          narrative: `Fluids, antibiotics, and norepinephrine — correct. But you miss a key update.\n\n<strong>2026 SSC Update (Rec 79):</strong> The 2026 guidelines now suggest IV corticosteroids for <span class="hl">any patient with septic shock</span> — the indication has broadened beyond just refractory shock. Combined with Ms. Reyes' chronic prednisone use (HIGH HPA axis suppression risk), hydrocortisone should be given early, not only if shock worsens.\n\nHydrocortisone 50 mg IV q6h (or 200 mg/day continuous infusion) is indicated here.\n\nThe pharmacist calls: <em>"Did you want corticosteroids? The 2026 SSC guidelines now suggest steroids broadly for septic shock — and she's on chronic prednisone, so her adrenal reserve is limited."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '114',   unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '86/52', unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '63',    unit: 'mm Hg', st: 'vw' },
            { lbl: 'SpO₂', val: '91%',   unit: '4L NC', st: 'vw' },
          ],
          vitalsMsg: `45 min later — MAP still borderline despite norepinephrine. Without steroid support the response is blunted.`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro', key: 'neuro', text: 'Persistent confusion. Minimal improvement. Consistent with ongoing septic encephalopathy.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Tachycardia persists. Vasopressor-dependent with MAP at goal only transiently.' }
          ]
        },
        {
          id: 'fluids-only-no-pressor',
          label: '✗ NO VASOPRESSOR IN SEPTIC SHOCK — CARDIAC ARREST',
          type: 'bad',
          triggers: ['fluid','liter','saline','bolus','blood culture','antibiotic'],
          requires: 2,
          excludes: ['norepinephrine','norepi','levophed','vasopressor','pressor','dopamine'],
          headline: 'Fluids without vasopressor — cardiovascular collapse',
          narrative: `Fluids and antibiotics are started — but in septic shock with lactate 5.2, waiting for fluids to fix MAP is not acceptable. Ms. Reyes has a hyperdynamic LV and distributive physiology — vasopressors must run in parallel from the start.\n\n30 minutes later: BP 70/40 → 55/28. GCS drops to 6. The RN shouts: <em>"She's unresponsive — no pulse! CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Ventricular Fibrillation (VFib)',
            overhead: 'Code Blue, Tower 4 Bed 8. Code Blue, Tower 4 Bed 8. Crash cart to Tower 4 STAT.',
            cause: '',
            monitor_phrase: 'Look at the monitor — coarse VFib. No pulse. Charge the defibrillator immediately.',
            hs_ts: [
              'Hydrogen ion (metabolic acidosis — pH 7.29, HCO₃ 17) ← lowers VFib threshold',
              'Hypo/Hyperkalemia ← AKI (Cr 2.3) in septic shock',
              'Hypoxia ← SpO₂ declining without vasopressor support',
              'Hypomagnesemia ← common in sepsis + SLE',
              'Toxins — septic mediators, myocardial depression',
              'Thrombosis — SLE hypercoagulable state (rule out PE)'
            ],
            acls_specifics: [
              'IMMEDIATE: Defibrillate 200J biphasic — do NOT delay',
              'Resume CPR × 2 min immediately after each shock',
              'Epinephrine 1mg IV after 2nd shock, then q3–5 min',
              'Amiodarone 300mg IV if refractory after 3rd shock',
              'Magnesium 2g IV — SLE + sepsis → likely low Mg²⁺',
              'Norepinephrine must be started immediately after ROSC',
              'Stress dose hydrocortisone — adrenal suppression from chronic prednisone'
            ],
            rosc_label: '✓ ROSC After Defibrillation — Initiating Vasopressor Now →'
          },
          noROSCMsg: `Despite resuscitation efforts, Ms. Reyes did not achieve ROSC.\n\nDistributive septic shock requires simultaneous vasopressor initiation alongside fluid resuscitation — not sequential. At a lactate of 5.2 with a hyperdynamic LV, fluids alone are insufficient. The VFib was precipitated by refractory hypotension, metabolic acidosis (pH 7.29), and hyperkalemia from AKI — all consequences of untreated shock.`,
          nextVitals: [
            { lbl: 'HR',   val: '134',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '55/28',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '37',   unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '84%',  unit: '4L NC', st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved after defibrillation. Ms. Reyes is intubated. Norepinephrine and hydrocortisone started immediately post-ROSC.`,
          nextDecision: 'decision2_postcode'
        },
        {
          id: 'pressor-no-abx',
          label: '✗ VASOPRESSOR WITHOUT ANTIBIOTICS — WORSENING SEPSIS',
          type: 'bad',
          triggers: ['norepinephrine','norepi','levophed','vasopressor','pressor'],
          requires: 1,
          excludes: ['blood culture','bcx','antibiotic','zosyn','pip','meropenem','ceftriaxone','vancomycin'],
          headline: 'MAP transiently supported — uncontrolled infection progresses',
          narrative: `You raise the blood pressure without treating the underlying infection. The vasopressor stabilizes MAP for a short window, but the infection continues unchecked.\n\nMs. Reyes is immunosuppressed on cyclophosphamide — without antibiotics, her bacterial load doubles every 20 minutes. 35 minutes after the pressor starts: temperature spikes to 40.1°C, HR climbs to 160, and the monitor alarms — VFib.\n\nThe RN shouts: <em>"She's in VFib! No pulse! Calling Code Blue NOW!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Ventricular Fibrillation (VFib)',
            overhead: 'Code Blue, Tower 4 Bed 8. Code Blue, Tower 4 Bed 8. Crash cart to Tower 4.',
            cause: 'VFib from sepsis-induced myocardial injury and electrolyte instability. In young patients with SLE, sepsis-induced cardiomyopathy and electrolyte disturbances (K⁺ 5.2, HCO₃⁻ 17) can precipitate malignant ventricular arrhythmias. Antibiotics are the definitive treatment — vasopressors without source control only delay inevitable deterioration.',
            monitor_phrase: 'Look at the monitor — coarse VFib. No pulse on check. Charge the defibrillator.',
            hs_ts: [
              'Hydrogen ion (metabolic acidosis lowers VFib threshold) ← active',
              'Hypo/Hyperkalemia (K⁺ 5.2 — borderline hyperkalemia) ← active',
              'Hypoxia (contributing factor)',
              'Hypomagnesemia (often concurrent with sepsis)',
              'Toxins — septic mediators causing myocardial depression',
              'Thrombosis (SLE hypercoagulable state)',
              'Tension pneumothorax (rule out)'
            ],
            acls_specifics: [
              'IMMEDIATE: Defibrillate 200J biphasic — DO NOT delay for IV access',
              'Resume CPR immediately × 2 min after each shock',
              'Epinephrine 1mg IV after 2nd shock, then q3–5 min',
              'Amiodarone 300mg IV if refractory after 3rd shock',
              'Magnesium 2g IV (SLE + sepsis → likely low Mg²⁺)',
              'Broad-spectrum IV antibiotics DURING resuscitation — this is the definitive fix',
              'After ROSC: 12-lead ECG, serial troponins, echocardiogram (sepsis cardiomyopathy)'
            ],
            rosc_label: '✓ ROSC After Defibrillation — Initiating Full Sepsis Bundle →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '160',   unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '70/38', unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '49',    unit: 'mm Hg', st: 'vc' },
            { lbl: 'Temp', val: '40.1°C',unit: '104.2°F',st:'vc' },
            { lbl: 'SpO₂', val: '86%',   unit: '4L NC', st: 'vc' },
          ],
          vitalsMsg: `After ROSC via defibrillation, Ms. Reyes is now intubated with broad-spectrum antibiotics running. Stress dose hydrocortisone is given for her adrenal insufficiency risk.<br/><br/><strong>Key teaching:</strong> Vasopressors address the hemodynamic consequence of sepsis — antibiotics treat the cause. In immunosuppressed patients, untreated infection progresses rapidly and precipitates lethal arrhythmias.`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro', key: 'neuro', text: 'Post-cardiac arrest. Sedated and intubated after ROSC. GCS not assessable.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved after defibrillation × 2. Sinus tachycardia. Troponin pending — rule out sepsis-induced cardiomyopathy.' },
            { icon: '🫁', lbl: 'Lungs', key: 'lungs', text: 'Intubated, mechanically ventilated on FiO₂ 80%. Bilateral B-lines on POCUS.' }
          ]
        },
        {
          id: 'default-ss2-d1',
          label: 'INCOMPLETE ORDERS — SEPTIC SHOCK DETERIORATION',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Incomplete orders — patient deteriorates',
          narrative: `Ms. Reyes is in septic shock — MAP 65, lactate 5.2, on chronic prednisone with HPA axis suppression. Without a complete bundle, her hemodynamics deteriorate rapidly.\n\nThe RN calls: <em>"Her pressure is down to 62/34. She's not responding. I don't have a pulse — calling Code Blue!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Ventricular Fibrillation (VFib)',
            overhead: 'Code Blue, Tower 4 Bed 8. Code Blue, Tower 4 Bed 8.',
            cause: '',
            monitor_phrase: 'Look at the monitor — coarse VFib. No pulse. Charge the defibrillator.',
            hs_ts: [
              'Hydrogen ion (metabolic acidosis pH 7.29 → lowers VFib threshold)',
              'Hypo/Hyperkalemia ← AKI (Cr 2.3)',
              'Hypoxia ← untreated respiratory compromise',
              'Hypomagnesemia ← sepsis + SLE',
              'Toxins — septic myocardial depression',
              'Thrombosis (SLE hypercoagulable — rule out PE)'
            ],
            acls_specifics: [
              'IMMEDIATE: Defibrillate 200J biphasic',
              'CPR × 2 min after each shock',
              'Epinephrine 1mg IV after 2nd shock, then q3–5 min',
              'Amiodarone 300mg IV if refractory',
              'Magnesium 2g IV (SLE + sepsis = low Mg²⁺)',
              'After ROSC: norepinephrine + hydrocortisone + broad-spectrum antibiotics immediately'
            ],
            rosc_label: '✓ ROSC Achieved — Initiating Full Septic Shock Bundle →'
          },
          noROSCMsg: `Despite resuscitation efforts, Ms. Reyes did not achieve ROSC.\n\nThe complete septic shock bundle was not initiated: blood cultures, IV antibiotics, 30 mL/kg balanced crystalloid, norepinephrine, and stress dose hydrocortisone must all start simultaneously. In a 20-year-old on chronic prednisone with SLE, untreated septic shock and adrenal insufficiency are rapidly fatal.`,
          nextVitals: [
            { lbl: 'HR',   val: '145',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '62/34',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '43',   unit: 'mm Hg', st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved. Ms. Reyes is intubated and the full septic shock bundle is started immediately post-arrest.`,
          nextDecision: 'decision2_postcode'
        }
      ]
    },

    decision2_postcode: {
      title: 'Post-Arrest MICU Management',
      prompt: 'Ms. Reyes achieved ROSC and has been intubated. She is now in the MICU. Her current MAP is 48 mm Hg. She is on chronic prednisone 20 mg/day and is critically ill. What are your orders?',
      placeholder: `Enter your post-arrest orders...\ne.g.: norepinephrine, antibiotics, hydrocortisone, cultures, etc.`,
      branches: [
        {
          id: 'full-postcode-ss2',
          label: '✓ COMPLETE POST-ARREST BUNDLE',
          type: 'good',
          triggers: ['norepinephrine','norepi','levophed','hydrocortisone','steroid','solu-cortef','antibiotic','zosyn','pip','meropenem','ceftriaxone','vancomycin','blood culture','bcx'],
          requires: 3,
          excludes: [],
          headline: 'Complete post-arrest septic shock management',
          narrative: `Full bundle initiated post-ROSC:\n\n<strong>Norepinephrine:</strong> First-line vasopressor — titrate to MAP ≥65\n<strong>Hydrocortisone 50 mg IV q6h:</strong> Critical — chronic prednisone = HPA suppression. Cortisol 8.2 mcg/dL is inappropriately low for a critically ill patient.\n<strong>IV antibiotics:</strong> Source control is the definitive treatment for sepsis\n<strong>Cultures × 2:</strong> Before antibiotics if not already drawn\n\n<strong>2026 SSC:</strong> Corticosteroids now suggested for any septic shock — not just refractory.`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        },
        {
          id: 'pressors-no-steroids-ss2',
          label: '⚠ PRESSORS + ANTIBIOTICS — NO HYDROCORTISONE',
          type: 'warning',
          triggers: ['norepinephrine','norepi','levophed','antibiotic','zosyn','meropenem','vancomycin'],
          requires: 2,
          excludes: ['hydrocortisone','steroid','solu-cortef','stress dose'],
          headline: 'Vasopressor and antibiotics — steroids still missing',
          narrative: `Norepinephrine and antibiotics are correct. But cortisol 8.2 mcg/dL + 3 months of prednisone = relative adrenal insufficiency.\n\nWithout hydrocortisone, vasopressor requirements will be higher and MAP will be harder to maintain. The 2026 SSC guidelines now suggest corticosteroids broadly for septic shock.\n\nThe ICU attending: <em>"Her cortisol was 8.2 — she needs stress dose steroids now. HPA axis suppression from chronic prednisone."</em>`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        },
        {
          id: 'default-ss2-postcode',
          label: 'POST-ARREST ORDERS NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Complete post-arrest bundle required',
          narrative: `Ms. Reyes is post-arrest in the MICU. Immediate priorities: <strong>(1)</strong> Norepinephrine to MAP ≥65, <strong>(2)</strong> Hydrocortisone 50 mg IV q6h (HPA suppression from chronic prednisone), <strong>(3)</strong> Blood cultures × 2 if not drawn, <strong>(4)</strong> Broad-spectrum IV antibiotics. What are your orders?`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        }
      ]
    },

    decision2: {
      title: 'Volume Reassessment & Vasopressor Escalation',
      prompt: '45 minutes later: 2L LR given, norepinephrine at 0.15 mcg/kg/min. MAP is 66. Repeat lactate 4.1 mmol/L — improving from 5.2. Repeat POCUS: IVC now appears fuller, less collapsible. RN asks: "Her MAP is barely at goal. Should we give more fluid or add another pressor?"',
      placeholder: `Enter your next orders...\ne.g.: vasopressin, hold fluid, reassess, etc.`,
      branches: [
        {
          id: 'vasopressin-add',
          label: '✓ SECOND VASOPRESSOR — VASOPRESSIN',
          type: 'good',
          triggers: ['vasopressin','second pressor','add pressor','escalate','pitressin'],
          requires: 1,
          excludes: [],
          headline: 'Vasopressin added — appropriate escalation',
          narrative: `You recognize that MAP is borderline on moderate norepinephrine and that the <span class="hl">IVC is now fuller and non-collapsible</span> — Ms. Reyes is no longer volume-responsive. The correct next step is vasopressor escalation, not more fluid.\n\n<strong>Vasopressin 0.03–0.04 U/min</strong> as a second vasopressor is evidence-based. The VASST trial showed vasopressin may reduce norepinephrine requirements.\n\n<strong>2026 SSC Update (Rec 55):</strong> Norepinephrine remains the suggested first-line agent over vasopressin. Vasopressin should be added when norepinephrine is insufficient, not used as monotherapy.\n\n<strong>De-escalation principle (DOVSS trial):</strong> When weaning later, wean norepinephrine <em>before</em> vasopressin — removing vasopressin first leads to greater hemodynamic instability.\n\n<strong>2026 Update — Active Fluid Removal (Rec 89):</strong> After the initial resuscitation phase, if persistent hypoperfusion is present, consider active fluid removal (diuretics or ultrafiltration) rather than continuing fluid accumulation.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Complete.</strong><br/><br/>Ms. Reyes is stabilized in the MICU on norepinephrine + vasopressin with stress dose steroids. Lactate is trending down. Key teaching: chronic prednisone → HPA suppression → stress dose steroids in shock. POCUS-guided resuscitation prevented fluid overload.`,
          decisions: [
            'Recognized septic shock with relative adrenal insufficiency from chronic prednisone',
            'Initiated complete bundle including stress dose hydrocortisone',
            'Used POCUS to assess volume status dynamically',
            'Identified IVC change — no longer volume-responsive',
            'Appropriately escalated to second vasopressor (vasopressin) rather than more fluid'
          ]
        },
        {
          id: 'more-fluid-ivc-full',
          label: '⚠ MORE FLUID DESPITE NON-RESPONSIVE IVC',
          type: 'warning',
          triggers: ['fluid','liter','saline','bolus','more fluid','another liter'],
          requires: 1,
          excludes: ['vasopressin','second pressor','dopamine','epinephrine'],
          headline: 'More fluid — IVC no longer collapsible',
          narrative: `You give another fluid bolus, but the repeat POCUS shows a <span class="hl">fuller, less collapsible IVC</span>. Ms. Reyes is no longer meaningfully volume-responsive. Additional fluid risks worsening the bilateral B-lines seen on her initial POCUS.\n\nSpO₂ drops from 94% to 89% as lung water accumulates.\n\nThe attending: <em>"The IVC is full — we're past the volume-responsive phase. We need vasopressin here, not more fluid."</em>`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Complete — suboptimal.</strong><br/><br/>A third liter was given without MAP benefit. SpO₂ dropped transiently. Vasopressin was eventually added. Key: use serial POCUS to guide resuscitation endpoints.`,
          decisions: [
            'Missed: POCUS showing IVC no longer collapsible',
            'Continued fluid loading when no longer volume-responsive',
            'Should have escalated to second vasopressor (vasopressin)',
            'Fluid overload worsened oxygenation transiently'
          ]
        },
        {
          id: 'premature-wean',
          label: '⚠ PREMATURE DE-ESCALATION',
          type: 'warning',
          triggers: ['wean','reduce norepi','turn down','decrease pressor','less pressor'],
          requires: 1,
          excludes: [],
          headline: 'Vasopressor wean attempted prematurely',
          narrative: `With MAP 66 and lactate still 4.1, this is premature.\n\nDe-escalation criteria: MAP consistently >65 without upward titration, lactate trending toward normal (<2 mmol/L), and clinical markers of end-organ recovery.\n\nThe RN calls: <em>"Her MAP dropped to 55 when I turned it down. I turned it back up."</em> Vasopressin is added and the wean is deferred.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case Complete.</strong><br/><br/>Premature wean resulted in MAP dropping to 55. Vasopressin was added; de-escalation deferred 12 hours when lactate had cleared. Remember (DOVSS trial): wean norepinephrine first, vasopressin last.`,
          decisions: [
            'Vasopressor wean attempted before stable MAP and lactate normalization',
            'De-escalation criteria: stable MAP >65, lactate <2, clinical improvement',
            'DOVSS trial: wean norepinephrine before vasopressin'
          ]
        },
        {
          id: 'default-ss2-d2',
          label: 'MANAGEMENT DIRECTION NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Next steps needed',
          narrative: `Ms. Reyes is on norepinephrine with MAP at 66 — borderline. The POCUS now shows a fuller IVC — she is no longer volume-responsive. Next step: add <strong>vasopressin 0.03–0.04 U/min</strong> as a second vasopressor. Continue stress dose steroids and reassess lactate every 2 hours.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'concern',
          endMsg: `<strong>Case ended.</strong><br/><br/>The ICU attending intervened.`,
          decisions: ['Vasopressor escalation not performed — ICU attending intervened']
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────
  // SEPSIS CASE 3 — Ms. Gloria Chen · Neutropenic Fever & Septic Shock
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ss-3',
    title: 'Case #3',
    blurb: 'Oncology patient with neutropenic fever and rapid hemodynamic deterioration.',
    artType: 'sepsis3',
    patient: { name: 'Gloria Chen', initials: 'GC', age: '60F', weight: '65 kg', allergies: 'NKDA' },

    vignette: `<p>A 60-year-old woman with <span class="hl">acute lymphoblastic leukemia (ALL)</span> completed induction chemotherapy and is preparing for allogeneic stem cell transplant. A <span class="hl">PICC line</span> was placed in her right arm for chemotherapy access.</p><p>She felt well until this afternoon. Now she has fever, chills, right arm pain at the PICC site, and new confusion.</p><div class="pager-box"><div class="pager-header"><div class="pager-icon">📟</div><div class="pager-meta"><div class="pager-from">Tower 6 · Bed 22</div><div class="pager-time">14:45</div></div></div><div class="pager-msg">"Her BP just dropped from 132/92 to 75/35. ANC is 200. She doesn't look right. I'm scared."</div></div>`,

    rnReport: `"She went from okay to terrible in 30 minutes. She's shaking with rigors, confused, asking where she is. Her right arm has erythema around the PICC site. ANC was 200 this morning — she's severely neutropenic. BP is 75/35, HR 130."`,
    rnCues: [
      'ANC 200 = severe neutropenia. How does this change your antibiotic approach?',
      'What is the time-to-antibiotic target in neutropenic fever?'
    ],

    vitals: [
      { lbl: 'HR',   val: '130',    unit: 'bpm',      st: 'vc' },
      { lbl: 'BP',   val: '75/35',  unit: 'mm Hg',    st: 'vc' },
      { lbl: 'MAP',  val: '48',     unit: 'mm Hg',    st: 'vc' },
      { lbl: 'RR',   val: '26',     unit: '/min',      st: 'vc' },
      { lbl: 'Temp', val: '38.9°C', unit: '102.0°F',  st: 'vw' },
      { lbl: 'SpO₂', val: '92%',   unit: '4L NC',     st: 'vw' },
      { lbl: 'ANC',  val: '200',    unit: '/µL ↓↓',   st: 'vc' }
    ],

    labs: [
      { lbl: 'WBC',    val: '0.6',    unit: 'K/µL',    st: 'lv-c' },
      { lbl: 'ANC',    val: '200',    unit: '/µL',      st: 'lv-c' },
      { lbl: 'Hgb',    val: '9.1',    unit: 'g/dL',    st: 'lv-c' },
      { lbl: 'Plt',    val: '42',     unit: 'K/µL',    st: 'lv-c' },
      { lbl: 'INR',    val: '1.6',    unit: '',         st: 'lv-a' },
      { lbl: 'Creat',  val: '1.8',    unit: 'mg/dL',   st: 'lv-a' },
      { lbl: 'Lactate',val: '3.6',    unit: 'mmol/L',  st: 'lv-c' },
      { lbl: 'Procal', val: '9.4',    unit: 'ng/mL',   st: 'lv-c' },
    ],

    examSystems: [
      { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Disoriented to time and place. Confused, answers questions but gives incorrect responses. GCS 12.' },
      { icon: '👁️', lbl: 'General', key: 'gen',     text: 'Acutely ill. Diaphoretic. Shivering with rigors.' },
      { icon: '👄', lbl: 'HEENT',   key: 'heent',   text: 'Dry mucous membranes. Oropharynx clear — no mucositis.' },
      { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'Tachycardic. Regular rhythm. Extremities cooling.' },
      { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'Tachypneic. Crackles at right lung base.' },
      { icon: '🫃', lbl: 'Abdomen', key: 'abd',     text: 'Soft. Non-distended. Mild diffuse tenderness. No focal rebound.' },
      { icon: '💉', lbl: 'PICC',    key: 'picc',    text: 'Right basilic PICC: erythema ~2 cm around insertion site. Tender to palpation. No purulence. US: PICC-associated thrombus, right basilic vein.' }
    ],

    decision1: {
      title: 'Neutropenic Fever — Antibiotic Selection & Resuscitation',
      prompt: 'Ms. Chen: ANC 200, MAP 48, lactate 3.6, temp 38.9°C, PICC site erythema, RLL infiltrate on CXR. She is in septic shock. What are your orders?',
      placeholder: `Enter your orders...\ne.g.: cefepime, vancomycin, blood cultures, fluids, norepinephrine, etc.`,
      branches: [
        {
          id: 'optimal-neutropenic-bundle',
          label: '✓ CEFEPIME + VANCOMYCIN + RESUSCITATION',
          type: 'good',
          triggers: ['cefepime','meropenem','vancomycin','vanco','blood culture','bcx','fluid','liter','norepinephrine','norepi','levophed'],
          requires: 4,
          excludes: [],
          headline: 'Complete neutropenic fever bundle',
          narrative: `Outstanding management:\n\n<strong>Anti-pseudomonal coverage:</strong> Cefepime — first-line for neutropenic fever<br/><strong>Gram-positive coverage:</strong> Vancomycin — indicated for PICC site infection, hemodynamic instability, and pneumonia<br/><strong>Cultures:</strong> Blood cultures from BOTH PICC and peripheral stick — essential for diagnosing CRBSI<br/><strong>Fluids + vasopressor:</strong> 30 mL/kg balanced crystalloid (LR preferred — 2026 SSC rec 44) + norepinephrine for MAP ≥65\n\n<span class="hl">Drawing paired cultures allows differential time-to-positivity analysis</span> — if PICC cultures turn positive >2 hours before peripheral cultures, CRBSI is confirmed.\n\n<strong>2026 SSC Update — Prolonged Beta-Lactam Infusion (Rec 33 — Upgraded to Strong Recommendation):</strong> For adults with sepsis or septic shock, the 2026 guidelines now <span class="hl">recommend prolonged infusion of beta-lactams for maintenance</span> after an initial loading dose over conventional bolus administration. This improves pharmacodynamic target attainment (time above MIC). Order cefepime as: loading dose IV over 30 min, then maintenance doses as extended infusion (e.g., 2g over 4 hours q8h).\n\n<strong>2026 SSC Update — De-escalation (Rec 36 — Upgraded to Strong Recommendation):</strong> When culture results and susceptibilities are available, the guidelines now <span class="hl">recommend de-escalation of antimicrobial therapy</span> — this is an upgrade from "suggest" in 2021.\n\nThe oncology attending: <em>"Good — and if cultures grow Staph aureus, that PICC is coming out. Also let's write cefepime as extended infusion — 2026 SSC now strongly recommends that."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '116',   unit: 'bpm',    st: 'vw' },
            { lbl: 'BP',   val: '88/56', unit: 'mm Hg',  st: 'vw' },
            { lbl: 'MAP',  val: '67',    unit: 'mm Hg',  st: 'vn' },
            { lbl: 'RR',   val: '24',    unit: '/min',    st: 'vw' },
            { lbl: 'SpO₂', val: '94%',   unit: '4L NC',  st: 'vn' },
          ],
          vitalsMsg: `45 min after cefepime, vancomycin, 2L NS, and norepinephrine. MAP at goal.`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Marginally more alert. Still confused but less agitated. Responds to name.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'HR trending slightly down. MAP at goal on vasopressor.' },
            { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'SpO₂ 94% on 4L NC. Crackles persist at right base.' }
          ]
        },
        {
          id: 'cefepime-no-vanco',
          label: '⚠ NO VANCOMYCIN — GRAM-POSITIVE GAP',
          type: 'warning',
          triggers: ['cefepime','meropenem','zosyn','pip-tazo','piperacillin'],
          requires: 1,
          excludes: ['vancomycin','vanco'],
          headline: 'Anti-pseudomonal coverage — vancomycin missing',
          narrative: `Cefepime — excellent first-line choice. But <span class="hl">vancomycin is missing</span>.\n\nVancomycin is indicated alongside anti-pseudomonal therapy when:\n• PICC site erythema ✓\n• Hemodynamic instability (MAP 48) ✓\n• Pneumonia (RLL infiltrate) ✓\n\nPICC-associated infections are overwhelmingly gram-positive: S. aureus, coagulase-negative Staph, Enterococcus — none covered by cefepime alone.\n\nThe pharmacist calls: <em>"She has a PICC site infection and is in shock — I strongly recommend adding vancomycin now."</em>`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '126',   unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '80/48', unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '59',    unit: 'mm Hg', st: 'vw' },
            { lbl: 'SpO₂', val: '90%',   unit: '4L NC', st: 'vw' },
          ],
          vitalsMsg: `45 min after cefepime + fluids + norepi (no vancomycin). BP inadequate — gram-positive source untreated.`,
          nextDecision: 'decision2',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro', key: 'neuro', text: 'Persistent confusion. No meaningful improvement.' },
            { icon: '💉', lbl: 'PICC',  key: 'picc',  text: 'Erythema slightly more extensive around insertion site.' }
          ]
        },
        {
          id: 'wrong-antibiotic',
          label: '✗ NO ANTI-PSEUDOMONAL COVERAGE — GRAM-NEGATIVE ARREST',
          type: 'bad',
          triggers: ['ceftriaxone','azithromycin','doxycycline','levofloxacin','amoxicillin','augmentin'],
          requires: 1,
          excludes: ['cefepime','meropenem','zosyn','pip-tazo','piperacillin'],
          headline: 'Inadequate coverage — gram-negative septic arrest',
          narrative: `The antibiotic lacks anti-pseudomonal coverage — a critical gap in a patient with ANC 200.\n\nMs. Chen has no neutrophils to compensate for incomplete antibiotic coverage. Gram-negative bacteremia, potentially Pseudomonas, progresses unchecked. Endotoxin release triggers a massive inflammatory cascade.\n\n20 minutes after the inadequate antibiotic: BP 52/28, HR 156, then the monitor alarms — flat line. The RN shouts: <em>"No pulse! Code Blue!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 6 Oncology Bed 22. Code Blue, Tower 6 Bed 22. Bring crash cart.',
            cause: 'PEA arrest from gram-negative septic shock in a profoundly immunocompromised host (ANC 200). Inadequate antibiotic coverage allowed unchecked bacteremia — likely Pseudomonas or gram-negative rod — leading to endotoxin-mediated cardiovascular collapse. There were no neutrophils to mount any containment response.',
            monitor_phrase: 'Look at the monitor — organized rhythm but no pulse. PEA. Start CPR immediately.',
            hs_ts: [
              'Hypovolemia ← distributive septic shock, untreated',
              'Hydrogen ion (severe lactic acidosis, pH <7.0)',
              'Hypoxia ← SpO₂ declining without airway management',
              'Hypo/Hyperkalemia ← acute kidney injury from shock',
              'Tension pneumothorax (rule out — patient has PICC, CXR infiltrate)',
              'Thrombosis ← PICC-associated thrombus already identified',
              'Tamponade (rule out in oncology patients)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'Switch to cefepime + vancomycin DURING resuscitation — this is the definitive fix',
              'Bag-mask ventilation then secure airway — hypoxia is contributing',
              'Push IV fluids during CPR for hypovolemic component',
              'Post-ROSC: initiate anti-pseudomonal coverage immediately if not done',
              'Discuss PICC removal with hematology-oncology (potential source)',
              'Platelet transfusion threshold: <10K spontaneous, <50K for procedures'
            ],
            rosc_label: '✓ ROSC Achieved — Switching to Cefepime + Vancomycin →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '140',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '62/30',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '41',   unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '87%',  unit: '4L NC', st: 'vc' },
          ],
          vitalsMsg: `After ROSC, cefepime + vancomycin are immediately started. Ms. Chen is intubated. The oncology attending: <em>"In neutropenic fever, we cannot afford the luxury of narrow-spectrum coverage. Pseudomonas coverage is non-negotiable."</em>`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Post-cardiac arrest. Sedated and intubated after ROSC.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved. On norepinephrine. Tachycardic.' },
            { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'Intubated on FiO₂ 100%. Right lower lobe consolidation on CXR.' }
          ]
        },
        {
          id: 'wait-for-cultures',
          label: '✗ ANTIBIOTICS WITHHELD — NEUTROPENIC ARREST',
          type: 'bad',
          triggers: ['culture','pan culture','blood culture','bcx','wait','pending','urine culture'],
          requires: 1,
          excludes: ['cefepime','meropenem','zosyn','pip-tazo','antibiotic','vanco','vancomycin'],
          headline: 'Cultures ordered — antibiotics withheld in neutropenic shock',
          narrative: `You order cultures but withhold antibiotics. In neutropenic fever, this is potentially fatal.\n\nMs. Chen has ANC 200 — she has no immune defense. Bacterial doubling time is 20 minutes. 8 minutes after you leave the room, the RN calls over the intercom: <em>"Doctor — she just went unresponsive. I'm checking for a pulse… I don't have one. Code Blue NOW."</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 6 Oncology Bed 22. Code Blue, Tower 6 Bed 22. Airway Team to Tower 6.',
            cause: 'PEA cardiac arrest from untreated neutropenic septic shock. ANC 200 = no immune reserve. Without antibiotics, gram-negative bacteremia progressed to overwhelming sepsis with cardiovascular collapse in under 10 minutes. This is why neutropenic fever is treated as an oncologic emergency with mandatory antibiotic initiation within 30–60 minutes.',
            monitor_phrase: 'Look at the monitor — narrow complex PEA. No pulse on check. Begin CPR.',
            hs_ts: [
              'Hypovolemia ← distributive shock, no IV fluids given',
              'Hydrogen ion (severe lactic acidosis, rapidly worsening)',
              'Hypoxia ← SpO₂ 84% before arrest, no airway intervention',
              'Hypo/Hyperkalemia ← AKI (Cr 1.8) in setting of shock',
              'Tension pneumothorax (rule out — CXR showed RLL infiltrate)',
              'Thrombosis ← PICC thrombus already identified by US',
              'Tamponade (rule out in oncology patients)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'Cefepime + vancomycin DURING resuscitation — antibiotics are the definitive treatment',
              'Secure airway — bag-mask then intubate',
              'Push IV fluids during CPR (no fluids had been given)',
              'Post-ROSC: ICU transfer, norepinephrine, continue antibiotics',
              'IDSA mandate: antibiotics within 30–60 min of neutropenic fever recognition',
              'Do NOT wait for cultures before starting antibiotics in neutropenic fever'
            ],
            rosc_label: '✓ ROSC Achieved — Starting Cefepime + Vancomycin Immediately →'
          },
          nextVitals: [
            { lbl: 'HR',   val: '148',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '58/28',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '38',   unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '84%',  unit: '4L NC', st: 'vc' },
          ],
          vitalsMsg: `After ROSC, cefepime and vancomycin are started immediately. Airway is secured. Ms. Chen is transferred to the MICU.<br/><br/><strong>Key teaching:</strong> Neutropenic fever = oncologic emergency. Antibiotics must be started within 30–60 minutes of recognition. You do NOT wait for culture results — you treat empirically and de-escalate later based on sensitivities.`,
          nextDecision: 'decision2_postcode',
          updatedExam: [
            { icon: '🧠', lbl: 'Neuro',   key: 'neuro',   text: 'Post-cardiac arrest. Intubated and sedated. Neurological prognosis guarded given arrest duration.' },
            { icon: '❤️', lbl: 'Cardiac', key: 'cardiac', text: 'ROSC achieved. Sinus tachycardia. Norepinephrine initiated for persistent hypotension.' },
            { icon: '🫁', lbl: 'Lungs',   key: 'lungs',   text: 'Intubated on FiO₂ 100%. RLL consolidation on CXR.' },
            { icon: '💉', lbl: 'PICC',    key: 'picc',    text: 'PICC remains in place. Hematology-oncology reviewing removal given bacteremia risk.' }
          ]
        },
        {
          id: 'default-ss3-d1',
          label: 'INCOMPLETE ORDERS — NEUTROPENIC ARREST',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Incomplete orders — neutropenic septic arrest',
          narrative: `Ms. Chen is in neutropenic septic shock with ANC 200. Without immediate anti-pseudomonal coverage and hemodynamic support, bacterial doubling progresses unchecked.\n\n10 minutes later: the RN calls urgently — <em>"She's unresponsive. I don't have a pulse. CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'Pulseless Electrical Activity (PEA)',
            overhead: 'Code Blue, Tower 6 Oncology Bed 22. Code Blue, Tower 6 Bed 22.',
            cause: '',
            monitor_phrase: 'Look at the monitor — organized rhythm, no pulse. PEA. Begin CPR immediately.',
            hs_ts: [
              'Hypovolemia ← distributive shock, no resuscitation initiated',
              'Hydrogen ion (lactic acidosis from untreated septic shock)',
              'Hypoxia ← SpO₂ 84% declining without intervention',
              'Hypo/Hyperkalemia ← AKI (Cr 1.8)',
              'Thrombosis ← PICC thrombus already identified',
              'Tension pneumothorax (rule out — RLL infiltrate on CXR)'
            ],
            acls_specifics: [
              'Epinephrine 1mg IV q3–5 min — start immediately',
              'Cefepime + vancomycin IV DURING resuscitation — definitive treatment',
              'Secure airway — bag-mask ventilation then intubate',
              'Push IV fluids during CPR',
              'After ROSC: ICU transfer, norepinephrine, continue antibiotics',
              'Neutropenic fever = antibiotic within 30–60 min — delays are fatal'
            ],
            rosc_label: '✓ ROSC Achieved — Initiating Cefepime + Vancomycin →'
          },
          noROSCMsg: `Despite resuscitation, Ms. Chen did not achieve ROSC.\n\nNeutropenic fever is an oncologic emergency requiring antibiotics within 30–60 minutes of recognition. ANC 200 means there is no immune reserve whatsoever — every minute without antibiotics allows unchecked bacterial multiplication.`,
          nextVitals: [
            { lbl: 'HR',   val: '152',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '58/28',unit: 'mm Hg', st: 'vc' },
            { lbl: 'MAP',  val: '38',   unit: 'mm Hg', st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved. Ms. Chen is intubated. Cefepime + vancomycin started immediately post-arrest.`,
          nextDecision: 'decision2_postcode'
        }
      ]
    },

    decision2_postcode: {
      title: 'Post-Arrest MICU Management',
      prompt: 'Ms. Chen achieved ROSC and has been intubated. She is now in the MICU. MAP is 52 mm Hg. ANC 200 — she is profoundly immunocompromised. What are your orders?',
      placeholder: `Enter your post-arrest orders...\ne.g.: cefepime, vancomycin, norepinephrine, blood cultures, etc.`,
      branches: [
        {
          id: 'full-postcode-ss3',
          label: '✓ COMPLETE POST-ARREST BUNDLE',
          type: 'good',
          triggers: ['cefepime','meropenem','vancomycin','vanco','norepinephrine','norepi','levophed','blood culture','bcx'],
          requires: 3,
          excludes: [],
          headline: 'Complete post-arrest management',
          narrative: `Full bundle initiated:\n\n<strong>Cefepime + vancomycin:</strong> Anti-pseudomonal + gram-positive coverage — essential for neutropenic fever\n<strong>Norepinephrine:</strong> First-line vasopressor for MAP ≥65\n<strong>Blood cultures × 2:</strong> PICC and peripheral — differential time-to-positivity for CRBSI diagnosis\n\n<strong>2026 SSC:</strong> Cefepime as extended infusion (prolonged beta-lactam infusion now a strong recommendation) optimizes time above MIC.`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        },
        {
          id: 'abx-no-pressor-ss3',
          label: '⚠ ANTIBIOTICS — NO VASOPRESSOR',
          type: 'warning',
          triggers: ['cefepime','meropenem','vancomycin','vanco','antibiotic'],
          requires: 1,
          excludes: ['norepinephrine','norepi','levophed','vasopressor','pressor'],
          headline: 'Antibiotics started — vasopressor not ordered',
          narrative: `Correct antibiotics — but MAP 52 requires immediate vasopressor support. Antibiotics treat the cause; norepinephrine maintains perfusion pressure while the antibiotics work.\n\nThe MICU fellow: <em>"Antibiotics are going — but her MAP is 52. We need norepi now."</em>`,
          showVitalsButton: false,
          nextDecision: 'decision2_postcode'
        },
        {
          id: 'default-ss3-postcode',
          label: 'POST-ARREST ORDERS NEEDED',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'Complete post-arrest bundle required',
          narrative: `Ms. Chen is post-arrest in the MICU. Immediate priorities: <strong>(1)</strong> Norepinephrine for MAP ≥65, <strong>(2)</strong> Cefepime + vancomycin — anti-pseudomonal + gram-positive coverage, <strong>(3)</strong> Blood cultures from PICC AND peripheral if not already drawn. What are your orders?`,
          showVitalsButton: false,
          nextDecision: 'decision2'
        }
      ]
    },

    decision2: {
      title: 'Rapid Response & Airway Decision',
      prompt: '45 minutes later: 2L LR given, cefepime + vancomycin running, norepinephrine at 0.2 mcg/kg/min. MAP is 62 — still borderline. RR is now 32. SpO₂ dropped to 88% on 4L NC. She is increasingly confused. The RN says: "I think she needs more help than we can give her up here. Are we going to intubate?"',
      placeholder: `Enter your orders...\ne.g.: rapid response, intubate, RSI, MICU transfer, HFNC, etc.`,
      branches: [
        {
          id: 'rrt-and-intubation',
          label: '✓ RAPID RESPONSE + PROACTIVE INTUBATION',
          type: 'good',
          triggers: ['rapid response','rrt','intubate','intubation','airway','rsi','icu','micu','intensive care'],
          requires: 2,
          excludes: [],
          headline: 'Rapid response activated + airway secured proactively',
          narrative: `You activate the Rapid Response and proactively address the airway — recognizing the signs of impending respiratory failure: RR 32, SpO₂ 88%, worsening confusion, and escalating vasopressor requirements.\n\n<span class="hl">In neutropenic patients, respiratory failure progresses rapidly. Planned intubation with RSI is always safer than crash intubation</span> in a coagulopathic (INR 1.6), thrombocytopenic (Plt 42) patient.\n\n<strong>RRT criteria met:</strong><br/>• SpO₂ <90% on supplemental O₂ ✓<br/>• SBP <90 ✓<br/>• Altered mental status ✓<br/>• Staff worried ✓\n\nMs. Chen is intubated with ketamine (hemodynamically favorable) + succinylcholine and transferred to the MICU.`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Complete.</strong><br/><br/>Ms. Chen is intubated and in the MICU on lung-protective ventilation. Blood cultures from the peripheral site grew Staph aureus within 12 hours — CRBSI confirmed. Vancomycin was the critical empiric choice. Hematology-oncology is reviewing PICC removal.<br/><br/><span style="color:var(--cyan)"><strong>2026 SSC Update:</strong></span> Once susceptibilities are available, the 2026 guidelines <strong>recommend</strong> de-escalation of antimicrobial therapy (upgraded from "suggest" in 2021). When Staph aureus sensitivities confirm MSSA, transition from vancomycin to oxacillin or nafcillin for superior outcomes.`,
          decisions: [
            'Recognized neutropenic fever as an oncologic emergency — antibiotics within 60 min',
            'Correctly selected cefepime + vancomycin',
            'Drew paired blood cultures: PICC + peripheral site',
            'Initiated fluid resuscitation and norepinephrine',
            'Activated RRT before patient crashed',
            'Secured airway proactively via RSI — avoided crash intubation'
          ]
        },
        {
          id: 'rrt-no-airway',
          label: '⚠ RRT ACTIVATED — AIRWAY NOT ADDRESSED',
          type: 'warning',
          triggers: ['rapid response','rrt','icu','micu','intensive care','transfer'],
          requires: 1,
          excludes: ['intubate','intubation','airway','rsi','hfnc','high flow','bipap'],
          headline: 'Rapid response called — airway deferred',
          narrative: `You correctly activate the Rapid Response. But Ms. Chen has RR 32, SpO₂ 88%, and worsening confusion — <span class="hl">you should be actively planning airway management in parallel</span>.\n\nThe MICU fellow arrives: <em>"We need to talk about the airway now. Neutropenic patients with septic shock and respiratory failure have very narrow windows. If she tires out, we are going to have a very difficult crash intubation in a coagulopathic, thrombocytopenic patient."</em>`,
          showVitalsButton: false,
          nextDecision: null,
          endState: 'good',
          endMsg: `<strong>Case Complete.</strong><br/><br/>The RRT team intubated Ms. Chen at bedside. Outcome similar — proactive airway planning would have been preferable. Key: airway planning and RRT activation should happen simultaneously in this scenario.`,
          decisions: [
            'Correctly identified deterioration and activated RRT',
            'Airway consideration was reactive rather than proactive',
            'In neutropenic septic shock + respiratory failure, airway planning should be concurrent with RRT'
          ]
        },
        {
          id: 'o2-escalation-no-rrt',
          label: '✗ OXYGEN ONLY — NO LEVEL-OF-CARE ESCALATION — ARREST',
          type: 'bad',
          triggers: ['hfnc','high flow','non-rebreather','nrb','bipap','increase oxygen','more oxygen','nasal cannula'],
          requires: 1,
          excludes: ['rapid response','rrt','intubate','intubation','icu','micu'],
          headline: 'O₂ escalated — no RRT — patient arrests',
          narrative: `You escalate oxygen but don't escalate the level of care. Ms. Chen meets RRT criteria on multiple counts — SpO₂ 88%, MAP 62, altered mental status — and the window for a controlled intubation in a coagulopathic, thrombocytopenic patient is closing fast.\n\n15 minutes later she becomes apneic. Then: no pulse.\n\nThe floor nurse shouts: <em>"She went apneic — now I don't have a pulse! CODE BLUE!"</em>`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'PEA → Asystole (Hypoxic Arrest)',
            overhead: 'Code Blue, Tower 6 Oncology Bed 22. Airway Team to Tower 6 STAT.',
            cause: '',
            monitor_phrase: 'Look at the monitor — asystole transitioning from PEA. No pulse. Begin CPR and bag-mask ventilation.',
            hs_ts: [
              'Hypoxia ← PRIMARY CAUSE — apnea from respiratory failure',
              'Hydrogen ion (hypoxic + lactic acidosis)',
              'Hypovolemia ← distributive shock, inadequate resuscitation',
              'Tension pneumothorax (rule out — RLL consolidation on CXR)',
              'Thrombosis ← PICC thrombus (SVC territory)',
              'Tamponade (rule out in oncology patients)'
            ],
            acls_specifics: [
              'Bag-mask ventilation at 100% FiO₂ — airway is the primary cause',
              'Immediate endotracheal intubation — secure airway first',
              'Epinephrine 1mg IV q3–5 min',
              'NOTE: Plt 42 and INR 1.6 — crash intubation in coagulopathic patient = high risk',
              'A controlled RSI before arrest would have been significantly safer',
              'After ROSC: MICU transfer, continue antibiotics, vasopressor support'
            ],
            rosc_label: '✓ ROSC After Airway Secured — Transferring to MICU →'
          },
          noROSCMsg: `Despite resuscitation, Ms. Chen did not achieve ROSC.\n\nRespiratory failure progressed to hypoxic cardiac arrest. The controlled RSI window was missed. In neutropenic patients with septic shock and worsening hypoxia, RRT activation and airway planning must happen simultaneously — not sequentially. Crash intubation in a coagulopathic (INR 1.6), thrombocytopenic (Plt 42) patient carries very high procedural risk.`,
          nextVitals: [
            { lbl: 'HR',   val: '124',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '70/40',unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '82%',  unit: 'BVM',   st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved after crash intubation. Ms. Chen is in the MICU on mechanical ventilation. The crash setting — in a Plt 42, INR 1.6 patient — could have been avoided with earlier RRT activation and planned RSI.`,
          nextDecision: 'decision2'
        },
        {
          id: 'default-ss3-d2',
          label: 'ESCALATION DELAYED — PATIENT ARRESTS',
          type: 'neutral',
          triggers: [],
          requires: 0,
          excludes: [],
          headline: 'No escalation plan — respiratory arrest',
          narrative: `No escalation orders entered. Ms. Chen has SpO₂ 88%, MAP 62, and is increasingly confused — she meets Rapid Response criteria.\n\nMinutes later she becomes apneic. The bedside nurse activates a Code Blue.`,
          showVitalsButton: true,
          showCodeBlue: true,
          codeBlueConfig: {
            rhythm: 'PEA (Hypoxic)',
            overhead: 'Code Blue, Tower 6 Oncology Bed 22. Airway Team to Tower 6.',
            cause: '',
            monitor_phrase: 'Look at the monitor — PEA. No respiratory effort. Begin CPR and bag-mask ventilation.',
            hs_ts: [
              'Hypoxia ← PRIMARY — respiratory failure without intervention',
              'Hydrogen ion (hypoxic and lactic acidosis)',
              'Hypovolemia ← distributive shock',
              'Tension pneumothorax (rule out)',
              'Thrombosis ← PICC thrombus'
            ],
            acls_specifics: [
              'Bag-mask ventilation at 100% FiO₂ immediately',
              'Intubate — airway is the arrest cause',
              'Epinephrine 1mg IV q3–5 min',
              'After ROSC: MICU transfer, vasopressor, continue antibiotics'
            ],
            rosc_label: '✓ ROSC Achieved — Transferring to MICU →'
          },
          noROSCMsg: `Despite resuscitation, Ms. Chen did not achieve ROSC.\n\nNo escalation was initiated despite meeting Rapid Response criteria. RRT activation and simultaneous RSI planning are mandatory when SpO₂ <90%, MAP <65, and mental status is deteriorating in a neutropenic patient.`,
          nextVitals: [
            { lbl: 'HR',   val: '118',  unit: 'bpm',   st: 'vc' },
            { lbl: 'BP',   val: '72/42',unit: 'mm Hg', st: 'vc' },
            { lbl: 'SpO₂', val: '88%',  unit: 'BVM',   st: 'vc' },
          ],
          vitalsMsg: `ROSC achieved. Ms. Chen is intubated and transferred to the MICU.`,
          nextDecision: 'decision2'
        }
      ]
    }
  }

]; // end SEPSIS_CASES

// ═══════════════════════════════════════════════════════════════
//  CASE ART SVGs
// ═══════════════════════════════════════════════════════════════

const ARTS = {
  shock: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(233,165,53,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#14120a 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><path d="M40 62C40 62 16 46 16 30C16 22 22 16 30 16C34 16 38 18 40 22C42 18 46 16 50 16C58 16 64 22 64 30C64 46 40 62 40 62Z" stroke="#e9a535" stroke-width="1.5" fill="rgba(233,165,53,0.1)"/><path d="M14 40L24 40L28 32L32 48L36 36L40 40L66 40" stroke="#e9a535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  pe: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(224,79,79,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#150b0b 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="28" cy="46" rx="14" ry="20" stroke="#e04f4f" stroke-width="1.5" opacity=".7"/><ellipse cx="52" cy="46" rx="14" ry="20" stroke="#e04f4f" stroke-width="1.5" opacity=".7"/><path d="M40 16L40 42" stroke="#e04f4f" stroke-width="2" stroke-linecap="round"/><path d="M40 23C34 23 28 29 28 37" stroke="#e04f4f" stroke-width="1.5" fill="none"/><path d="M40 23C46 23 52 29 52 37" stroke="#e04f4f" stroke-width="1.5" fill="none"/><circle cx="52" cy="30" r="8" stroke="#e9a535" stroke-width="1.5" fill="rgba(233,165,53,0.15)"/><line x1="52" y1="26" x2="52" y2="34" stroke="#e9a535" stroke-width="1.5"/><line x1="48" y1="30" x2="56" y2="30" stroke="#e9a535" stroke-width="1.5"/></svg>`
  },
  ards: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(63,157,224,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#0b1520 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="27" cy="46" rx="14" ry="20" stroke="#3f9de0" stroke-width="1.5" fill="rgba(63,157,224,0.07)"/><ellipse cx="53" cy="46" rx="14" ry="20" stroke="#3f9de0" stroke-width="1.5" fill="rgba(63,157,224,0.07)"/><path d="M40 15L40 42" stroke="#3f9de0" stroke-width="2" stroke-linecap="round"/><path d="M40 23C34 23 27 29 27 38" stroke="#3f9de0" stroke-width="1.5"/><path d="M40 23C46 23 53 29 53 38" stroke="#3f9de0" stroke-width="1.5"/><path d="M18 50Q22 46 26 50Q30 54 34 50" stroke="#e04f4f" stroke-width="1.2" fill="none"/><path d="M46 50Q50 46 54 50Q58 54 62 50" stroke="#e04f4f" stroke-width="1.2" fill="none"/></svg>`
  },
  sepsis1: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(94,196,125,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#0b160e 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="38" r="18" stroke="#5ec47d" stroke-width="1.5" fill="rgba(94,196,125,0.07)"/><path d="M28 38L36 46L52 30" stroke="#5ec47d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 14L40 20M40 56L40 62M14 38L20 38M60 38L66 38" stroke="#5ec47d" stroke-width="1.5" stroke-linecap="round" opacity=".5"/><circle cx="40" cy="38" r="26" stroke="#5ec47d" stroke-width="1" stroke-dasharray="3 4" opacity=".3"/></svg>`
  },
  sepsis2: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(167,107,220,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#120b1a 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><path d="M40 20C40 20 24 28 24 42C24 52 31 58 40 58C49 58 56 52 56 42C56 28 40 20 40 20Z" stroke="#a76bdc" stroke-width="1.5" fill="rgba(167,107,220,0.07)"/><path d="M32 40L38 46L50 34" stroke="#a76bdc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="40" y1="14" x2="40" y2="18" stroke="#a76bdc" stroke-width="1.5" stroke-linecap="round" opacity=".6"/><line x1="40" y1="62" x2="40" y2="66" stroke="#a76bdc" stroke-width="1.5" stroke-linecap="round" opacity=".6"/><line x1="18" y1="40" x2="22" y2="40" stroke="#a76bdc" stroke-width="1.5" stroke-linecap="round" opacity=".6"/><line x1="58" y1="40" x2="62" y2="40" stroke="#a76bdc" stroke-width="1.5" stroke-linecap="round" opacity=".6"/></svg>`
  },
  sepsis3: {
    bg: 'background:radial-gradient(ellipse at 50% 50%,rgba(224,141,53,0.18) 0%,transparent 70%),linear-gradient(155deg,#0c1829 0%,#191008 100%)',
    svg: `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="36" r="14" stroke="#e08d35" stroke-width="1.5" fill="rgba(224,141,53,0.07)"/><path d="M33 36C33 32.1 36.1 29 40 29C43.9 29 47 32.1 47 36" stroke="#e08d35" stroke-width="1.5" fill="none"/><line x1="40" y1="50" x2="40" y2="62" stroke="#e08d35" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="58" x2="46" y2="58" stroke="#e08d35" stroke-width="1.5" stroke-linecap="round"/><circle cx="56" cy="22" r="6" stroke="#e04f4f" stroke-width="1.5" fill="rgba(224,79,79,0.12)"/><line x1="53" y1="22" x2="59" y2="22" stroke="#e04f4f" stroke-width="1.2"/><line x1="56" y1="19" x2="56" y2="25" stroke="#e04f4f" stroke-width="1.2"/></svg>`
  }
};

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

const State = {
  activeModule: 'critical',
  caseData: null,
  revealed: new Set(),
  decisions: [],        // track what branch outcomes the user hit
  currentDecision: null,// 'decision1' | 'decision2' | 'decision2Delayed'
  recognizedOrders: [], // track what was ordered for bedside reassessment
  unlockedResults: new Set(), // track which results have been unlocked
  allOrdersEverOrdered: new Set(), // track every order type ever ordered across all decisions
  currentOxygenDevice: null, // track oxygen delivery device ordered
  intubationMeds: null, // track intubation medications
  ventilatorSettings: null, // track ventilator settings
  attendingCorrectedVentilator: false, // track if attending corrected vent settings
  triedHFNC: false, // track if HFNC was tried before intubation
  totalFluidGiven: 0, // track cumulative fluid volume across all decisions (in mL)
  micuPromptedNotOrdered: false, // track if MICU was prompted but not initially ordered
  lastOrderedAntibiotic: null, // track the specific antibiotic ordered (for token resolution)
  lactateOrdered: false,        // track whether lactate was ordered (for conditional display)
  culturesOrdered: false,       // track whether blood cultures were ordered
  ctOrdered: false,              // track whether CT abdomen was ordered
  postCodePath: false,           // track whether user arrived via a code-blue ROSC pathway (ss-1)

  reset() {
    this.caseData = null;
    this.revealed = new Set();
    this.decisions = [];
    this.currentDecision = null;
    this.recognizedOrders = [];
    this.unlockedResults = new Set();
    this.allOrdersEverOrdered = new Set();
    this.currentOxygenDevice = null;
    this.intubationMeds = null;
    this.ventilatorSettings = null;
    this.attendingCorrectedVentilator = false;
    this.triedHFNC = false;
    this.totalFluidGiven = 0;
    this.micuPromptedNotOrdered = false;
    this.lastOrderedAntibiotic = null;
    this.lactateOrdered = false;
    this.culturesOrdered = false;
    this.ctOrdered = false;
    this.postCodePath = false;
    // NOTE: activeModule is intentionally NOT reset here — it persists across cases
  }
};

// ═══════════════════════════════════════════════════════════════
//  DOM UTILS
// ═══════════════════════════════════════════════════════════════

const $ = id => document.getElementById(id);
const CE = tag => document.createElement(tag);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = $(id);
  if (t) { t.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function openModal(id) {
  const el = $(id); if (!el) return;
  el.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = $(id); if (!el) return;
  el.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.setAttribute('hidden', ''));
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════════════════════════
//  PHASE TRACKER
// ═══════════════════════════════════════════════════════════════

function buildPhaseTrack(totalPhases, activePhase) {
  const track = $('phase-track');
  if (!track) return;
  let html = '';
  for (let i = 1; i <= totalPhases; i++) {
    const cls = i < activePhase ? 'done' : i === activePhase ? 'active' : '';
    html += `<div class="ph-dot ${cls}">${i}</div>`;
    if (i < totalPhases) html += `<div class="ph-line"></div>`;
  }
  track.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
//  CASE SELECTION
// ═══════════════════════════════════════════════════════════════

function renderCaseList() {
  const grid = $('cases-grid');
  if (!grid) return;
  const dataset = State.activeModule === 'sepsis' ? SEPSIS_CASES : CASES;
  grid.innerHTML = dataset.map((c, i) => {
    const art = ARTS[c.artType];
    return `
      <div class="case-card" data-idx="${i}" tabindex="0" role="button" aria-label="Launch ${c.title}">
        <div class="case-card-art" style="${art.bg}">${art.svg}</div>
        <div class="case-card-body">
          <div class="case-title-text">${c.title}</div>
          <div class="case-blurb">${c.blurb}</div>
          <span class="case-tag">${State.activeModule === 'sepsis' ? 'Intermediate' : 'Advanced'}</span>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.case-card').forEach(card => {
    const go = () => launchCase(parseInt(card.dataset.idx));
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}

// ═══════════════════════════════════════════════════════════════
//  LAUNCH A CASE
// ═══════════════════════════════════════════════════════════════

function launchCase(idx) {
  State.reset();
  const dataset = State.activeModule === 'sepsis' ? SEPSIS_CASES : CASES;
  State.caseData = dataset[idx];
  $('sim-case-label').textContent = `${State.caseData.title}`;
  showScreen('screen-sim');
  buildPhaseTrack(5, 1);
  renderPhase1_Vignette();
}

// ═══════════════════════════════════════════════════════════════
//  RENDER HELPERS
// ═══════════════════════════════════════════════════════════════

function patientStrip() {
  const c = State.caseData;
  return `
    <div class="pt-strip">
      <div class="pt-avatar">${c.patient.initials}</div>
      <div><div class="pt-name">${c.patient.name}</div><div class="pt-meta">${c.patient.age} · Simulation</div></div>
      <div class="pt-chips">
        <div><div class="pt-chip-label">Weight</div><div class="pt-chip-val">${c.patient.weight}</div></div>
        <div><div class="pt-chip-label">Allergies</div><div class="pt-chip-val">${c.patient.allergies}</div></div>
      </div>
    </div>
  `;
}

function vitalsTable(vitals) {
  return `
    <table class="vitals-tbl">
      <thead><tr><th>Parameter</th><th>Value</th><th>Notes</th></tr></thead>
      <tbody>
        ${vitals.map(v => `<tr><td>${v.lbl}</td><td class="${v.st}">${v.val}</td><td>${v.unit}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function labGrid(labs, note) {
  return `
    <div class="lab-grid">${labs.map(l => `<div class="lab-cell"><div class="lab-lbl">${l.lbl}</div><div class="lab-val ${l.st}">${l.val}${l.unit ? ' <span style="font-size:10px;color:var(--tx-3)">' + l.unit + '</span>' : ''}</div></div>`).join('')}</div>
    ${note ? `<div style="font-family:var(--font-m);font-size:10px;color:var(--tx-3);line-height:1.6;margin-top:8px;">${note}</div>` : ''}
  `;
}

function examGrid(systems) {
  return `
    <div class="exam-grid" id="exam-grid">
      ${systems.map(s => `
        <button class="exam-btn" data-key="${s.key}" aria-label="Examine ${s.lbl}">
          <div class="eb-icon">${s.icon}</div>
          <div class="eb-label">${s.lbl}</div>
          <div class="eb-hint">Tap to examine</div>
        </button>
      `).join('')}
    </div>
    <div class="exam-reveals" id="exam-reveals"></div>
  `;
}

function pocusBlock(pocus) {
  return `
    <div class="pocus-wrap">
      <div class="pocus-head"><span class="pocus-lbl">POCUS — Bedside Ultrasound Findings</span></div>
      <div class="pocus-body">
        <div class="pocus-rows">${pocus.rows.map(r => `<div class="pocus-row"><div class="pocus-k">${r.k}</div><div class="pocus-v">${r.v}</div></div>`).join('')}</div>
        <div class="pocus-interp"><div class="pocus-interp-lbl">Interpretation</div><div class="pocus-interp-txt">${pocus.interp}</div></div>
      </div>
    </div>
  `;
}

function bindExamButtons() {
  const grid = $('exam-grid');
  if (!grid) return;
  grid.querySelectorAll('.exam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (State.revealed.has(key)) return;
      State.revealed.add(key);
      btn.classList.add('revealed');
      btn.querySelector('.eb-hint').textContent = 'Examined ✓';
      // Use currentExamSystems if available (for updated exams), otherwise use original
      const examSystems = State.currentExamSystems || State.caseData.examSystems;
      const sys = examSystems.find(s => s.key === key);
      if (!sys) return;
      const card = CE('div');
      card.className = 'reveal-card';
      card.innerHTML = `<div class="reveal-sys">${sys.icon} ${sys.lbl}</div><div class="reveal-txt">${sys.text}</div>`;
      $('exam-reveals').appendChild(card);
    });
  });
}

function ordersSection(decisionKey) {
  const dec = State.caseData[decisionKey];
  return `
    <div class="sec-lbl">Order Entry</div>
    <div class="order-panel">
      <div class="order-input-wrap">
        <textarea class="orders-ta" id="orders-ta"
          placeholder="Type each order on a new line&#10;e.g.: Lactate&#10;CBC, BMP&#10;Blood cultures x2&#10;500 mL LR bolus IV&#10;Norepinephrine 8 mcg/min IV&#10;Portable CXR&#10;EKG"></textarea>
      </div>
      <div class="order-parse-preview" id="order-preview">
        <div class="opp-header">
          <span class="opp-title">Order Recognition</span>
          <span class="opp-count" id="opp-count">0 orders</span>
        </div>
        <div class="opp-empty" id="opp-empty">Start typing orders above — each line will be parsed and categorized in real time.</div>
        <div class="opp-lines" id="opp-lines" style="display:none;"></div>
      </div>
      <div id="result-feed-wrap" style="display:none;">
        <div class="result-feed">
          <div class="result-feed-header">Results &amp; Acknowledgements</div>
          <div id="result-feed-cards"></div>
        </div>
      </div>
      <div class="orders-hint">Each order is recognized and categorized. Results appear in real time after you submit. Specific orders unlock specific results — order what you need.</div>
      <div class="btn-row">
        <button class="btn btn--primary" id="submit-orders" data-dec="${decisionKey}">Submit All Orders →</button>
      </div>
    </div>
  `;
}

function conditionAlertBlock(dec) {
  if (!dec.conditionAlert) return '';
  return `
    <div class="cond-alert">
      <div class="cond-icon">⚠</div>
      <div>
        <div class="cond-title">${dec.alertText}</div>
        <div class="cond-sub">${dec.alertSub}</div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
//  ORDER INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════

// ── CATEGORY CLASSIFIER ──────────────────────────────────────
// Each rule: { cat, label, patterns[] }  patterns are regex-like strings matched against lowercase line
const ORDER_CATEGORIES = {
  lab: {
    label: 'Lab',
    cssClass: 'cat-lab',
    typeClass: 'rct-lab',
    patterns: [
      /\bcbc\b/, /\bcomplete blood count\b/,
      /\bbmp\b/, /\bcmp\b/, /\bbasic metabolic\b/, /\bcomprehensive metabolic\b/,
      /\blactate\b/, /\blactic acid\b/,
      /\btroponin\b/, /\bhstrop\b/,
      /\bbnp\b/, /\bnt.pro.?bnp\b/,
      /\blft\b/, /\bliver function\b/,
      /\bcoag\b/, /\bpt\b(?![\w])/, /\bptt\b/, /\binr\b/, /\bprotime\b/,
      /\bblood culture\b/, /\bbc\b(?![\w])/, /\bculture\b/,
      /\burine culture\b/, /\bua\b(?![\w])/, /\burinalysis\b/,
      /\babg\b/, /\barterial blood gas\b/,
      /\bvbg\b/, /\bvenous blood gas\b/,
      /\bd.?dimer\b/,
      /\bprocalcitonin\b/, /\bpct\b(?![\w])/,
      /\bcreatinine\b/, /\bcreat\b/, /\bbun\b/,
      /\bglucose\b/,
      /\bhemoglobin\b/, /\bhgb\b/, /\bhematocrit\b/, /\bhct\b/,
      /\bplatelet\b/, /\bplts?\b/,
      /\bwbc\b/, /\bwhite blood cell\b/,
      /\btype and screen\b/, /\btype and cross\b/, /\bt&s\b/, /\bt&c\b/,
      /\bamylase\b/, /\blipase\b/,
      /\bph\b(?!ysical|armac)/, /\bpaco2\b/, /\bpao2\b/,
      /\brepeat lactate\b/, /\bfollow.?up lactate\b/,
      /\bpockit?\b/, /\bpoint.of.care\b/,
    ]
  },
  imaging: {
    label: 'Imaging',
    cssClass: 'cat-imaging',
    typeClass: 'rct-imaging',
    patterns: [
      /\bcxr\b/, /\bchest.?x.?ray\b/, /\bchest radiograph\b/, /\bportable cxr\b/,
      /\bct\b(?![\w])/, /\bcomputed tom/,
      /\bct.?chest\b/, /\bct chest\b/, /\bchest ct\b/,
      /\bct.?abdomen\b/, /\bct.?pelvis\b/, /\bct.?ap\b/, /\bct a\/p\b/, /\bct abd\/pelv\b/,
      /\bct.?head\b/, /\bhead ct\b/, /\bct brain\b/,
      /\bctpa\b/, /\bct.?pulmonary\b/, /\bct.?angio\b/, /\bct pe protocol\b/,
      /\bct.?neck\b/, /\bct.?spine\b/, /\bct c.?spine\b/,
      /\bxr\b(?![\w])/, /\bx.?ray\b/,
      /\bkub\b/,
      /\bmri\b/, /\bmra\b/, /\bmrv\b/,
      /\bdoppler\b/, /\bvenous doppler\b/, /\ble doppler\b/,
      /\bultrasound\b/, /\bus\b(?!e)(?![a-z])/, /\bechocardiograph\b/, /\becho\b(?![\w])/,
      /\bpocus\b/, /\bbedside echo\b/, /\bbedside ultrasound\b/,
      /\bv\/q\b/, /\bventilation.?perfusion\b/,
      /\bruq ultrasound\b/, /\bluq ultrasound\b/, /\brenal ultrasound\b/,
    ]
  },
  ekg: {
    label: 'EKG',
    cssClass: 'cat-ekg',
    typeClass: 'rct-ekg',
    patterns: [
      /\bekg\b/, /\becg\b/, /\belectrocardiog\b/, /\b12.?lead\b/, /\bcardiac monitor\b/
    ]
  },
  treatment: {
    label: 'Treatment',
    cssClass: 'cat-treatment',
    typeClass: 'rct-treatment',
    patterns: [
      /\boxygen\b/, /\bo2\b(?![\w])/,
      /\bnasal cannula\b/, /\bnc\b(?![\w])/, /\b\d+l nc\b/, /\b\d+ liter\b/,
      /\bnon.?rebreather\b/, /\bnrb\b/, /\bmask\b/,
      /\bhigh.?flow\b/, /\bhfnc\b/, /\boptiflow\b/,
      /\bbipap\b/, /\bcpap\b/, /\bniv\b/, /\bnippv\b/,
      /\bintubat(e|ed|ion|ing)?\b/, /\bendotracheal\b/, /\bett\b/, /\brsi\b/,
      /\bventilat\b/, /\bmechanical vent\b/,
      /\bnebs?\b/, /\bnebulizer\b/, /\balbuterol\b/, /\bipratropium\b/,
      /\bchest tube\b/, /\bthoracostomy\b/, /\bpigtail\b/,
      /\bngt\b/, /\bng tube\b/, /\bnasogastric\b/, /\bogt\b/,
      /\bfoley\b/, /\burinary catheter\b/,
    ]
  },
  fluid: {
    label: 'IV Fluid',
    cssClass: 'cat-fluid',
    typeClass: 'rct-fluid',
    patterns: [
      /\blactated ringer\b/, /\blr\b(?![\w])/, /\blrs\b(?![\w])/,
      /\bnormal saline\b/, /\bns\b(?![\w])/, /\b0\.9.*saline\b/, /\b0\.9%\b/,
      /\bhalf.?normal\b/, /\b0\.45.*saline\b/, /\bd5\b/,
      /\biv fluid\b/, /\biv.?fluid\b/,
      /\bbolus\b/, /\bfluid bolus\b/,
      /\b\d+\s?ml\b/, /\b\d+\s?cc\b/, /\b\d+\s?liter\b/, /\b\d+l\s?(?:ns|lr|saline)\b/,
      /\bcrystalloid\b/, /\bcolloid\b/, /\bplasmalyte\b/,
      /\bfree water\b/, /\bmaintenance fluid\b/, /\bmaintenance rate\b/,
      /\bblood product\b/, /\bprbc\b/, /\bpacked red\b/, /\bffp\b/, /\bcryoprecipitate\b/, /\bplatelets?\b(?! count)/,
    ]
  },
  med: {
    label: 'Medication',
    cssClass: 'cat-med',
    typeClass: 'rct-med',
    patterns: [
      // vasopressors
      /\bnorepinephrine\b/, /\bnorepi\b/, /\blevophed\b/,
      /\bvasopressin\b/, /\bvaso\b(?!pressor)/,
      /\bepinephrine\b/, /\bepi\b(?![\w])/,
      /\bdopamine\b/,
      /\bphenylephrine\b/,
      /\bdobutamine\b/, /\bmilrinone\b/,
      // antibiotics
      /\bvancomycin\b/, /\bvanco\b/,
      /\bcefepime\b/, /\bceftriaxone\b/, /\bcefazolin\b/, /\bceftazidime\b/,
      /\bpiperacillin\b/, /\bzosyn\b/, /\bpip.?tazo\b/,
      /\bmeropenem\b/, /\bimipenem\b/, /\beropenem\b/,
      /\bazithromycin\b/, /\bdoxycycline\b/,
      /\bmetronidazole\b/, /\bflagyl\b/,
      /\bfluconazole\b/,
      /\bantibiotic\b/, /\bbroadspectrum\b/, /\bbroad spectrum\b/,
      // anticoagulants
      /\bheparin\b/,
      /\benoxaparin\b/, /\blovenox\b/, /\blmwh\b/,
      /\brivaroxaban\b/, /\bapixaban\b/, /\bdabigatran\b/,
      /\bwarfarin\b/, /\bcoumadin\b/,
      // thrombolytics
      /\btpa\b/, /\balteplase\b/, /\btenecteplase\b/, /\bthrombolysis\b/, /\bthrombolytic\b/,
      // sedation / RSI
      /\bketamine\b/,
      /\bpropofol\b/, /\bdiprivan\b/,
      /\bmidazolam\b/, /\bversed\b/,
      /\bfentanyl\b/, /\bmorphine\b/, /\bhydromorphone\b/,
      /\bsuccinylcholine\b/, /\brocuronium\b/, /\bvecuronium\b/, /\bcisatracurium\b/,
      /\bnmba\b/, /\bneuromuscular\b/,
      /\brsi\b/, /\brapid sequence\b/,
      // steroids
      /\bhydrocortisone\b/, /\bdexamethasone\b/, /\bmethylprednisolone\b/,
      // antihypertensives
      /\blabetalol\b/, /\bnicardipine\b/, /\bnitroprusside\b/, /\bnitroglycerin\b/,
      // other
      /\bzofran\b/, /\bondansetron\b/,
      /\bppi\b/, /\bpantoprazole\b/, /\bomeprazole\b/,
      /\binsulin\b/,
      /\bacetaminophen\b/, /\btylenol\b/,
      /\bibuprofen\b/,
      /\boseltamivir\b/, /\btamiflu\b/,
    ]
  },
  consult: {
    label: 'Consult',
    cssClass: 'cat-consult',
    typeClass: 'rct-consult',
    patterns: [
      /\bconsult\b/,
      /\bmicu\b/, /\bicu\b(?! )/, /\bcritical care\b/, /\bintensiv\b/,
      /\bgi\b(?![\w])/, /\bgastro\b/, /\bgastroenterolog\b/,
      /\bcardiology\b/, /\bcardio\b(?! )/,
      /\bpulmonary\b/, /\bpulm\b(?![\w])/,
      /\bnephrology\b/, /\bnephro\b/, /\brenal\b(?! )/,
      /\bsurgery\b/, /\bsurgical\b/, /\bgen surg\b/,
      /\bneuro\b(?![\w])/, /\bneurolog\b/,
      /\bpalliative\b/, /\bpalliative care\b/, /\bhospice\b/,
      /\binfectious disease\b/, /\bid\b(?! )/, /\binfect dis\b/,
      /\bpsych\b/, /\bpsychiatry\b/,
      /\bheme\b/, /\bhematology\b/, /\bonc\b/, /\boncology\b/,
      /\btrauma\b/, /\btrauma team\b/,
      /\bpert\b/, /\bpulmonary embolism response\b/,
      /\brapid response\b/, /\bcode blue\b/, /\bcode team\b/,
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
//  MEDICAL TERMINOLOGY NORMALIZER
//  Expands clinical abbreviations and shorthand before pattern matching.
//  Applied to every order line so existing regex patterns catch them.
// ═══════════════════════════════════════════════════════════════

const MEDICAL_ABBREVS = [
  // ── CONSULTATIONS ─────────────────────────────────────────
  [/\begs\b/g,                    'emergency general surgery'],
  [/\bgen surg\b/g,               'general surgery'],
  [/\bgen surgery\b/g,            'general surgery'],
  [/\bsurg consult\b/g,           'surgery consult'],
  [/\bid consult\b/g,             'infectious disease consult'],
  [/\bid\b(?! )/g,                'infectious disease'],
  [/\bcards?\b(?!iac|iology)/g,   'cardiology'],
  [/\bnephro\b/g,                 'nephrology'],
  [/\bpulm\b(?!on)/g,             'pulmonary'],
  [/\bgastro\b/g,                 'gastroenterology'],
  [/\bgi\b(?!\w)/g,               'gastroenterology'],
  [/\bheme onc\b/g,               'hematology oncology'],
  [/\bheme\b/g,                   'hematology'],
  [/\bonc\b(?!\w)/g,              'oncology'],
  [/\bendo\b(?!\w)/g,             'endocrinology'],
  [/\brheum\b/g,                  'rheumatology'],
  [/\bneuro\b(?!\w)/g,            'neurology'],
  [/\bpsych\b/g,                  'psychiatry'],
  [/\bpalliative\b/g,             'palliative care'],
  [/\bsw consult\b/g,             'social work consult'],
  [/\bpt consult\b/g,             'physical therapy consult'],
  [/\bot consult\b/g,             'occupational therapy consult'],
  [/\bpert\b/g,                   'pulmonary embolism response team'],
  [/\birr?\b(?!\w)/g,             'interventional radiology'],
  [/\brt consult\b/g,             'respiratory therapy consult'],
  [/\brt\b(?!\w)/g,               'respiratory therapy'],
  [/\brrt\b/g,                    'rapid response team'],

  // ── LEVELS OF CARE ────────────────────────────────────────
  [/\bmicu\b/g,                   'medical intensive care unit'],
  [/\bsicu\b/g,                   'surgical intensive care unit'],
  [/\bcticu\b/g,                  'cardiothoracic intensive care unit'],
  [/\bnicu\b/g,                   'neuro intensive care unit'],
  [/\bicu\b(?!\w)/g,              'intensive care unit'],
  [/\btele\b(?!\w)/g,             'telemetry'],
  [/\bstep.?down\b/g,             'step down unit'],
  [/\bsnf\b/g,                    'skilled nursing facility'],

  // ── LINES / TUBES / PROCEDURES ────────────────────────────
  [/\ba.?line\b/g,                'arterial line'],
  [/\bcvl\b/g,                    'central venous line'],
  [/\btlc\b/g,                    'triple lumen catheter'],
  [/\bpicc\b/g,                   'peripherally inserted central catheter'],
  [/\bij line\b/g,                'internal jugular line'],
  [/\bscv\b/g,                    'subclavian vein catheter'],
  [/\bngt\b/g,                    'nasogastric tube'],
  [/\bogt\b/g,                    'orogastric tube'],
  [/\bng tube\b/g,                'nasogastric tube'],
  [/\bng\b(?!\w)/g,               'nasogastric'],
  [/\bfoley\b/g,                  'urinary catheter'],
  [/\bscd[s]?\b/g,                'sequential compression devices'],
  [/\bio access\b/g,              'intraosseous'],
  [/\bchest tube\b/g,             'thoracostomy'],
  [/\blp\b(?!\w)/g,               'lumbar puncture'],
  [/\bthoracentesis\b/g,          'pleural drainage'],
  [/\bparacentesis\b/g,           'abdominal drainage'],

  // ── LABS ──────────────────────────────────────────────────
  [/\bbcx\b/g,                    'blood cultures'],
  [/\bblood cx\b/g,               'blood cultures'],
  [/\bucx\b/g,                    'urine culture'],
  [/\burine cx\b/g,               'urine culture'],
  [/\bwound cx\b/g,               'wound culture'],
  [/\bsputum cx\b/g,              'sputum culture'],
  [/\bcbc\b/g,                    'complete blood count'],
  [/\bcbc w diff\b/g,             'complete blood count with differential'],
  [/\bcmp\b/g,                    'comprehensive metabolic panel'],
  [/\bbmp\b/g,                    'basic metabolic panel'],
  [/\blfts?\b/g,                  'liver function tests'],
  [/\bcoags?\b/g,                 'coagulation studies'],
  [/\binr\b/g,                    'prothrombin time inr'],
  [/\bptt\b/g,                    'partial thromboplastin time'],
  [/\bpt\/inr\b/g,                'prothrombin time inr'],
  [/\babg\b/g,                    'arterial blood gas'],
  [/\bvbg\b/g,                    'venous blood gas'],
  [/\blytes?\b/g,                 'electrolytes'],
  [/\bua\b(?!\w)/g,               'urinalysis'],
  [/\bpct\b(?!\w)/g,              'procalcitonin'],
  [/\bpoc glucose\b/g,            'point of care glucose'],
  [/\bfsbg\b/g,                   'fingerstick blood glucose'],
  [/\bfsbs?\b/g,                  'fingerstick blood sugar'],
  [/\btsh\b/g,                    'thyroid stimulating hormone'],
  [/\bfobt\b/g,                   'fecal occult blood test'],
  [/\bc diff\b/g,                 'c difficile'],
  [/\bcdiff\b/g,                  'c difficile'],
  [/\bd.?dimer\b/g,               'd dimer'],
  [/\btrop\b(?!\w)/g,             'troponin'],
  [/\bbnp\b/g,                    'brain natriuretic peptide'],
  [/\bnt.?probnp\b/g,             'nt proBNP'],
  [/\bcrp\b/g,                    'c reactive protein'],
  [/\besr\b/g,                    'erythrocyte sedimentation rate'],
  [/\bferritin\b/g,               'ferritin'],
  [/\tibc\b/g,                    'total iron binding capacity'],
  [/\buric acid\b/g,              'uric acid'],
  [/\bamylase\b/g,                'amylase'],
  [/\blipase\b/g,                 'lipase'],
  [/\ba1c\b/g,                    'hemoglobin a1c'],
  [/\bhba1c\b/g,                  'hemoglobin a1c'],
  [/\brenal panel\b/g,            'basic metabolic panel'],
  [/\bcomprehensive panel\b/g,    'comprehensive metabolic panel'],
  [/\bphos\b/g,                   'phosphate level'],
  [/\bphos level\b/g,             'phosphate'],
  [/\bmag\b(?!\w)/g,              'magnesium level'],
  [/\bca\b(?! \w\w)/g,            'calcium level'],

  // ── IMAGING ───────────────────────────────────────────────
  [/\bcxr\b/g,                    'chest x-ray'],
  [/\bpa.?lat\b/g,                'chest x-ray pa lateral'],
  [/\bkub\b/g,                    'abdominal x-ray'],
  [/\baxr\b/g,                    'abdominal x-ray'],
  [/\bct a\/p\b/g,                'ct abdomen pelvis'],
  [/\bct ap\b/g,                  'ct abdomen pelvis'],
  [/\bct abd\b/g,                 'ct abdomen'],
  [/\bct chest\b/g,               'ct chest'],
  [/\bctpa\b/g,                   'ct pulmonary angiography'],
  [/\bct head\b/g,                'ct brain head'],
  [/\bct brain\b/g,               'ct brain'],
  [/\bct neck\b/g,                'ct neck'],
  [/\bct spine\b/g,               'ct spine'],
  [/\bct pe\b/g,                  'ct pulmonary angiography'],
  [/\bv\/q\b/g,                   'ventilation perfusion scan'],
  [/\bvq scan\b/g,                'ventilation perfusion scan'],
  [/\bruq us\b/g,                 'right upper quadrant ultrasound'],
  [/\blfe us\b/g,                 'left upper quadrant ultrasound'],
  [/\ble us\b/g,                  'lower extremity ultrasound'],
  [/\bue us\b/g,                  'upper extremity ultrasound'],
  [/\btte\b/g,                    'transthoracic echocardiogram'],
  [/\btee\b/g,                    'transesophageal echocardiogram'],
  [/\becho\b/g,                   'echocardiogram'],
  [/\bmri brain\b/g,              'mri brain head'],
  [/\bmri spine\b/g,              'mri spine'],
  [/\bmri w\/wo\b/g,              'mri with without contrast'],
  [/\bpet scan\b/g,               'positron emission tomography'],
  [/\bnuclear stress\b/g,         'nuclear stress test'],
  [/\bmibi\b/g,                   'nuclear stress test'],

  // ── MEDICATIONS — ANTIBIOTICS ────────────────────────────
  [/\bpip[\s-]?tazo\b/g,          'piperacillin tazobactam'],
  [/\bzosyn\b/g,                  'piperacillin tazobactam'],
  [/\bptaz\b/g,                   'piperacillin tazobactam'],
  [/\bamp[\s-]?sulbactam\b/g,     'ampicillin sulbactam'],
  [/\bunasyn\b/g,                 'ampicillin sulbactam'],
  [/\bvanco\b/g,                  'vancomycin'],
  [/\bceftri\b/g,                 'ceftriaxone'],
  [/\brocephin\b/g,               'ceftriaxone'],
  [/\bcefe\b(?!\w)/g,             'cefepime'],
  [/\bmero\b(?!\w)/g,             'meropenem'],
  [/\bflagyl\b/g,                 'metronidazole'],
  [/\bflagyl iv\b/g,              'iv metronidazole'],
  [/\bflagyl po\b/g,              'po metronidazole'],
  [/\bdiflucan\b/g,               'fluconazole'],
  [/\bmica\b(?!\w)/g,             'micafungin'],
  [/\bambisome\b/g,               'amphotericin b'],
  [/\bampho b\b/g,                'amphotericin b'],
  [/\blevaquin\b/g,               'levofloxacin'],
  [/\bcipro\b/g,                  'ciprofloxacin'],
  [/\bdapto\b/g,                  'daptomycin'],
  [/\blinez\b/g,                  'linezolid'],
  [/\baz\b(?!\w)/g,               'aztreonam'],
  [/\bgent\b(?!\w)/g,             'gentamicin'],
  [/\btobra\b/g,                  'tobramycin'],
  [/\bamika\b/g,                  'amikacin'],
  [/\bclinda\b/g,                 'clindamycin'],
  [/\bazithro\b/g,                'azithromycin'],
  [/\bdoxy\b/g,                   'doxycycline'],
  [/\btmp[\s-]?smx\b/g,           'trimethoprim sulfamethoxazole'],
  [/\bbactrim\b/g,                'trimethoprim sulfamethoxazole'],
  [/\bpo vanco\b/g,               'oral vancomycin'],
  [/\boral vanco\b/g,             'oral vancomycin'],

  // ── MEDICATIONS — VASOPRESSORS / CARDIAC ─────────────────
  [/\bnorepi\b/g,                 'norepinephrine'],
  [/\blevophed\b/g,               'norepinephrine'],
  [/\bepi drip\b/g,               'epinephrine infusion'],
  [/\bvaso\b(?!pressin)/g,        'vasopressin'],
  [/\bneo\b(?!\w)/g,              'phenylephrine'],
  [/\bdopa\b(?!mine)/g,           'dopamine'],
  [/\bdobuta\b/g,                 'dobutamine'],
  [/\bmilri\b/g,                  'milrinone'],

  // ── MEDICATIONS — FLUIDS ──────────────────────────────────
  [/\blr\b(?!\w)/g,               'lactated ringers'],
  [/\blrs\b(?!\w)/g,              'lactated ringers'],
  [/\bns\b(?!\w)/g,               'normal saline'],
  [/\bd5w\b/g,                    'd5 water dextrose'],
  [/\bd5ns\b/g,                   'dextrose normal saline'],
  [/\bd5½ns\b/g,                  'dextrose half normal saline'],
  [/\bprbc[s]?\b/g,               'packed red blood cells transfusion'],
  [/\bpacked red[s]?\b/g,         'packed red blood cells transfusion'],
  [/\bffp\b/g,                    'fresh frozen plasma'],
  [/\bcryo\b(?!\w)/g,             'cryoprecipitate'],
  [/\bplts\b(?!\w)/g,             'platelets transfusion'],
  [/\btpn\b/g,                    'total parenteral nutrition'],
  [/\bppn\b/g,                    'peripheral parenteral nutrition'],
  [/\b½ns\b/g,                    'half normal saline'],
  [/\b0\.45\b/g,                  'half normal saline'],

  // ── MEDICATIONS — ANTICOAGULATION ─────────────────────────
  [/\bufh\b/g,                    'unfractionated heparin'],
  [/\bheparin gtt\b/g,            'heparin infusion'],
  [/\bsteparin\b/g,               'heparin'],
  [/\benox\b/g,                   'enoxaparin'],
  [/\blovenox\b/g,                'enoxaparin'],
  [/\blmwh\b/g,                   'low molecular weight heparin enoxaparin'],
  [/\beliquis\b/g,                'apixaban'],
  [/\bxarelto\b/g,                'rivaroxaban'],
  [/\bcoumadin\b/g,               'warfarin'],
  [/\bdvt ppx\b/g,                'dvt prophylaxis heparin'],
  [/\bdvt px\b/g,                 'dvt prophylaxis heparin'],
  [/\bvte ppx\b/g,                'vte prophylaxis heparin'],

  // ── MEDICATIONS — ELECTROLYTES / SUPPLEMENTS ──────────────
  [/\bkcl\b/g,                    'potassium chloride potassium'],
  [/\bk rider\b/g,                'potassium chloride potassium'],
  [/\bk repletion\b/g,            'potassium chloride potassium'],
  [/\bkphos\b/g,                  'potassium phosphate'],
  [/\bnaph?co3\b/g,               'sodium bicarbonate bicarb'],
  [/\bbicarb\b/g,                 'sodium bicarbonate'],
  [/\bmgso4\b/g,                  'magnesium sulfate magnesium'],
  [/\bmag repl\b/g,               'magnesium replacement'],
  [/\bca gluconate\b/g,           'calcium gluconate calcium'],
  [/\bd50\b/g,                    'dextrose 50 glucose'],
  [/\bd10\b/g,                    'dextrose 10 glucose'],
  [/\bmvi\b/g,                    'multivitamin'],
  [/\bthiamine\b/g,               'vitamin b1 thiamine'],
  [/\bfolate\b/g,                 'folic acid folate'],

  // ── MEDICATIONS — CARDIAC ─────────────────────────────────
  [/\bamio\b/g,                   'amiodarone'],
  [/\blido\b(?!\w)/g,             'lidocaine'],
  [/\batrop\b/g,                  'atropine'],
  [/\bdigoxin\b/g,                'digoxin'],
  [/\bmetop\b/g,                  'metoprolol'],
  [/\blopressor\b/g,              'metoprolol'],
  [/\bcoreg\b/g,                  'carvedilol'],
  [/\bnorvasc\b/g,                'amlodipine'],
  [/\bcardizem\b/g,               'diltiazem'],
  [/\bhyd?ral\b/g,                'hydralazine'],
  [/\bntg\b/g,                    'nitroglycerin'],
  [/\bnipride\b/g,                'sodium nitroprusside'],
  [/\bnitroprusside\b/g,          'sodium nitroprusside'],
  [/\blasix\b/g,                  'furosemide'],
  [/\bbumex\b/g,                  'bumetanide'],
  [/\bspiro\b/g,                  'spironolactone'],
  [/\bzarox\b/g,                  'metolazone'],
  [/\baldo\b(?!\w)/g,             'aldactone spironolactone'],
  [/\btorsemide\b/g,              'torsemide diuretic'],

  // ── MEDICATIONS — SEDATION / PAIN / NEURO ─────────────────
  [/\bpropofol\b/g,               'propofol sedation'],
  [/\bdiprivan\b/g,               'propofol sedation'],
  [/\bversed\b/g,                 'midazolam sedation'],
  [/\bativan\b/g,                 'lorazepam benzodiazepine'],
  [/\bprecedex\b/g,               'dexmedetomidine sedation'],
  [/\bdex\b(?!\w)/g,              'dexmedetomidine'],
  [/\bket\b(?!amine)/g,           'ketamine'],
  [/\bketamine\b/g,               'ketamine'],
  [/\bdilaudid\b/g,               'hydromorphone opioid'],
  [/\bhm\b(?!\w)/g,               'hydromorphone opioid'],
  [/\bfent\b(?!\w)/g,             'fentanyl opioid'],
  [/\bms\b(?! )(?!contin)/g,      'morphine opioid'],
  [/\bhaldol\b/g,                 'haloperidol antipsychotic'],
  [/\bseroquel\b/g,               'quetiapine antipsychotic'],
  [/\bclonopin\b/g,               'clonazepam benzodiazepine'],
  [/\bkeppra\b/g,                 'levetiracetam seizure'],
  [/\bdilantin\b/g,               'phenytoin seizure'],

  // ── MEDICATIONS — GI ──────────────────────────────────────
  [/\bppi\b/g,                    'proton pump inhibitor pantoprazole'],
  [/\bprotonix\b/g,               'pantoprazole ppi'],
  [/\bprilosec\b/g,               'omeprazole ppi'],
  [/\bnexium\b/g,                 'esomeprazole ppi'],
  [/\bh2b\b/g,                    'h2 blocker famotidine'],
  [/\bpepcid\b/g,                 'famotidine h2 blocker'],
  [/\bzantac\b/g,                 'ranitidine h2 blocker'],
  [/\breglan\b/g,                 'metoclopramide'],
  [/\bzofran\b/g,                 'ondansetron antiemetic'],
  [/\bcolace\b/g,                 'docusate stool softener'],
  [/\bmom\b(?!\w)/g,              'milk of magnesia laxative'],
  [/\blactulose\b/g,              'lactulose laxative'],
  [/\brifaximin\b/g,              'rifaximin'],
  [/\bsucralfate\b/g,             'sucralfate'],

  // ── MEDICATIONS — PULM / RESPIRATORY ─────────────────────
  [/\bduonebs?\b/g,               'albuterol ipratropium nebulizer'],
  [/\balbuterol neb\b/g,          'albuterol nebulizer'],
  [/\bipratropium neb\b/g,        'ipratropium nebulizer'],
  [/\bdpi\b/g,                    'dry powder inhaler'],
  [/\bsalb\b/g,                   'albuterol'],
  [/\bnac\b(?!\w)/g,              'n-acetylcysteine'],
  [/\bhfnc\b/g,                   'high flow nasal cannula'],
  [/\bhf nc\b/g,                  'high flow nasal cannula'],
  [/\bnrb\b/g,                    'non rebreather mask'],
  [/\bnrm\b/g,                    'non rebreather mask'],

  // ── MEDICATIONS — STEROIDS / ENDOCRINE ───────────────────
  [/\bsolumedrol\b/g,             'methylprednisolone steroid'],
  [/\bsolu.medrol\b/g,            'methylprednisolone steroid'],
  [/\bsolu.cortef\b/g,            'hydrocortisone steroid'],
  [/\bhc\b(?!\w)/g,               'hydrocortisone steroid'],
  [/\bdex\b(?!\w)/g,              'dexamethasone steroid'],
  [/\bpred\b(?!\w)/g,             'prednisone steroid'],
  [/\binsulin gtt\b/g,            'insulin infusion'],
  [/\binsulin drip\b/g,           'insulin infusion'],
  [/\briss\b/g,                   'regular insulin sliding scale'],
  [/\bss insulin\b/g,             'sliding scale insulin'],
  [/\bglargine\b/g,               'insulin glargine'],
  [/\blantus\b/g,                 'insulin glargine'],
  [/\bnph insulin\b/g,            'nph insulin'],

  // ── MISC ORDERS ───────────────────────────────────────────
  [/\bnpo\b/g,                    'nothing by mouth npo'],
  [/\bclears\b(?! ight)/g,        'clear liquid diet'],
  [/\bhob\b/g,                    'head of bed elevation'],
  [/\bfall precautions\b/g,       'fall precautions safety'],
  [/\bcontact precautions\b/g,    'contact isolation precautions'],
  [/\bdroplet precautions\b/g,    'droplet isolation precautions'],
  [/\bairborne precautions\b/g,   'airborne isolation precautions'],
  [/\bdnr\b/g,                    'do not resuscitate'],
  [/\bdni\b/g,                    'do not intubate'],
  [/\bfull code\b/g,              'full resuscitation code'],
  [/\bgoc\b/g,                    'goals of care'],
  [/\bacp\b/g,                    'advance care planning'],
  [/\brepeat labs\b/g,            'repeat laboratory'],
  [/\bserial labs\b/g,            'serial laboratory'],
  [/\bq\s?4h?\b/g,                'every 4 hours'],
  [/\bq\s?6h?\b/g,                'every 6 hours'],
  [/\bq\s?8h?\b/g,                'every 8 hours'],
  [/\bq\s?12h?\b/g,               'every 12 hours'],
  [/\bqd\b/g,                     'daily'],
  [/\bqhs\b/g,                    'nightly at bedtime'],
  [/\bbid\b/g,                    'twice daily'],
  [/\btid\b/g,                    'three times daily'],
  [/\bqid\b/g,                    'four times daily'],
  [/\bprn\b/g,                    'as needed'],
  [/\biv push\b/g,                'intravenous bolus'],
  [/\biv\b(?!\w)/g,               'intravenous'],
  [/\bpo\b(?!\w)/g,               'by mouth oral'],
  [/\bsq\b(?!\w)/g,               'subcutaneous'],
  [/\bim\b(?!\w)/g,               'intramuscular'],
  [/\bsl\b(?!\w)/g,               'sublingual'],
  [/\bpr\b(?!\w)/g,               'per rectum rectal'],
  [/\bngt feeds\b/g,              'nasogastric tube enteral feeding'],
  [/\btube feeds\b/g,             'enteral nutrition feeding'],
  [/\bplr\b/g,                    'passive leg raise fluid responsiveness'],
  [/\bppv\b/g,                    'pulse pressure variation fluid responsiveness'],
  [/\bsvv\b/g,                    'stroke volume variation fluid responsiveness'],
];

/**
 * Normalizes a clinical order line by expanding medical abbreviations
 * and shorthand before pattern matching. Case-insensitive.
 * @param {string} text — raw order line (already lowercased)
 * @returns {string} — expanded text
 */
function normalizeMedicalOrder(text) {
  let out = text;
  for (const [pattern, expansion] of MEDICAL_ABBREVS) {
    out = out.replace(pattern, expansion);
  }
  return out;
}

function classifyOrderLine(line) {
  const raw = line.toLowerCase().trim();
  const l   = normalizeMedicalOrder(raw);   // expand abbreviations first
  if (!l || l.startsWith('//') || l.startsWith('#')) return null;
  for (const [cat, def] of Object.entries(ORDER_CATEGORIES)) {
    if (def.patterns.some(p => p.test(l))) {
      return { cat, label: def.label, cssClass: def.cssClass };
    }
  }
  // Heuristic: if line contains "order", "give", "start", "administer", "mg", "mcg", "unit" → probably med
  if (/\b(order|give|administer|start|mg|mcg|units?|iv |po |sq |im )\b/.test(l)) {
    return { cat: 'med', label: 'Medication', cssClass: 'cat-med' };
  }
  return { cat: 'other', label: 'Other', cssClass: 'cat-other' };
}

// ── LIVE PARSE PREVIEW ────────────────────────────────────────
function bindOrderPreview() {
  const ta = $('orders-ta');
  if (!ta) return;
  ta.addEventListener('input', () => {
    const lines = ta.value.split('\n').filter(l => l.trim().length > 1);
    const count = $('opp-count');
    const empty = $('opp-empty');
    const linesDiv = $('opp-lines');
    if (!count || !empty || !linesDiv) return;

    const parsed = lines.map(l => ({ raw: l.trim(), cls: classifyOrderLine(l) })).filter(x => x.cls);
    count.textContent = `${parsed.length} order${parsed.length !== 1 ? 's' : ''}`;

    if (parsed.length === 0) {
      empty.style.display = 'block';
      linesDiv.style.display = 'none';
      linesDiv.innerHTML = '';
    } else {
      empty.style.display = 'none';
      linesDiv.style.display = 'flex';
      linesDiv.innerHTML = parsed.map(p => `
        <div class="opp-line">
          <span class="opp-cat ${p.cls.cssClass}">${p.cls.label}</span>
          <span class="opp-text">${escHtml(p.raw.substring(0, 120))}</span>
        </div>
      `).join('');
    }
  });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── RESULT CATALOG — what each specific order returns ────────
// Per case. Each entry: { id, triggers[], resultCard HTML }
// triggers are regex patterns; ALL orders in the textarea are checked

function getCaseResultCatalog(caseId) {
  // Shared EKG + common imaging
  const commonEKG = {
    id: 'ekg',
    cat: 'ekg',
    triggers: [/\bekg\b/, /\becg\b/, /\b12.?lead\b/],
    card: (_rawLine, cId) => {
      const findings = {
        'cc-1': 'Sinus tachycardia at 118 bpm. Normal axis. No ST-elevation or depression. No ischemic changes. QTc 432 ms.',
        'cc-2': 'Sinus tachycardia at 128 bpm. New incomplete right bundle branch block (RBBB). T-wave inversions in V1–V4. S1Q3T3 pattern present. No ST elevation.',
        'cc-3': 'Sinus tachycardia at 126 bpm. No acute ST changes. No ischemia. QTc 418 ms.'
      };
      
      // Case 2 gets the PE EKG image
      if (cId === 'cc-2') {
        return `
          <div class="result-card">
            <div class="result-card-type rct-ekg"></div>
            <div class="result-card-inner">
              <div class="result-card-tag" style="color:var(--orange)">EKG</div>
              <div class="result-card-name">12-Lead ECG</div>
              <div class="result-rows">
                <div class="result-row"><div class="result-lbl">Rate</div><div class="result-val"><span class="result-num">128</span> <span class="result-unit">bpm</span></div></div>
              </div>
              <div style="margin-top:12px;">
                <img src="PE_EKG.png" alt="EKG showing PE pattern" style="width:100%; border-radius:4px; border:1px solid var(--border);">
              </div>
            </div>
          </div>
        `;
      }
      
      // Default EKG for other cases
      return resultCard('ekg', 'EKG', '12-Lead ECG', [
        { lbl: 'Rate', val: cId === 'cc-1' ? '118' : cId === 'cc-2' ? '128' : '126', unit: 'bpm', ref: '', cls: 'rv-a' },
        { lbl: 'Rhythm', val: 'Sinus tachycardia', unit: '', ref: '', cls: 'rv-ok' },
      ], findings[cId] || 'Sinus tachycardia.');
    }
  };

  const catalogs = {
    'cc-1': [
      // LABS
      { id:'lactate', cat:'lab', triggers:[/\blactate\b/, /\blactic acid\b/],
        card: () => resultCard('lab','Lab','Lactate Level',[
          {lbl:'Lactate',val:'4.5',unit:'mmol/L',ref:'0.5–2.0',cls:'rv-c'}
        ],'') },
      { id:'cbc', cat:'lab', triggers:[/\bcbc\b/,/\bcomplete blood count\b/,/\bwbc\b/,/\bhemoglobin\b/,/\bhgb\b/],
        card: () => resultCard('lab','Lab','CBC',[
          {lbl:'WBC',    val:'19.6',unit:'K/µL', ref:'4.5–11',cls:'rv-c'},
          {lbl:'Hgb',    val:'11.2',unit:'g/dL', ref:'12–16', cls:'rv-a'},
          {lbl:'Hct',    val:'34%', unit:'',      ref:'36–46', cls:'rv-a'},
          {lbl:'Platelets',val:'140',unit:'K/µL',ref:'150–400',cls:'rv-a'},
        ],'') },
      { id:'bmp', cat:'lab', triggers:[/\bbmp\b/,/\bcmp\b/,/\bbasic metabolic\b/,/\bcomprehensive metabolic\b/,/\bcreatinine\b/,/\bcreat\b/,/\bbun\b/],
        card: () => resultCard('lab','Lab','BMP / CMP',[
          {lbl:'Na',  val:'138',unit:'mEq/L',ref:'135–145',cls:'rv-ok'},
          {lbl:'K',   val:'4.2',unit:'mEq/L',ref:'3.5–5.0',cls:'rv-ok'},
          {lbl:'Cl',  val:'102',unit:'mEq/L',ref:'96–106', cls:'rv-ok'},
          {lbl:'CO₂', val:'18', unit:'mEq/L',ref:'22–29',  cls:'rv-a'},
          {lbl:'BUN', val:'42', unit:'mg/dL', ref:'7–25',   cls:'rv-a'},
          {lbl:'Creat',val:'2.1',unit:'mg/dL',ref:'0.6–1.2',cls:'rv-c'},
          {lbl:'Glucose',val:'148',unit:'mg/dL',ref:'70–100',cls:'rv-a'},
        ],'') },
      { id:'abg', cat:'lab', triggers:[/\babg\b/,/\barterial blood gas\b/,/\bph\b(?!ysical)/,/\bpao2\b/,/\bpaco2\b/],
        card: () => resultCard('lab','Lab','ABG (4L NC)',[
          {lbl:'pH',   val:'7.31',unit:'',      ref:'7.35–7.45',cls:'rv-c'},
          {lbl:'PaCO₂',val:'32', unit:'mm Hg', ref:'35–45',    cls:'rv-a'},
          {lbl:'PaO₂', val:'70', unit:'mm Hg', ref:'80–100',   cls:'rv-a'},
          {lbl:'HCO₃', val:'16', unit:'mEq/L', ref:'22–28',    cls:'rv-c'},
          {lbl:'SpO₂', val:'93%',unit:'',      ref:'>95%',     cls:'rv-a'},
        ],'') },
      { id:'cultures', cat:'lab', triggers:[/\bblood cultures?\b/,/\bbc\b(?![\w])/,/\bcultures?\b/],
        card: () => resultCard('lab','Lab','Blood Cultures × 2',[
          {lbl:'Status',val:'Pending',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Gram stain',val:'Pending',unit:'',ref:'',cls:'rv-a'},
        ],'') },
      { id:'ua', cat:'lab', triggers:[/\bua\b(?![\w])/,/\burinalysis\b/,/\burine cultures?\b/],
        card: () => resultCard('lab','Lab','Urinalysis + Culture',[
          {lbl:'Color',  val:'Dark yellow',unit:'',ref:'',cls:'rv-a'},
          {lbl:'WBC',    val:'>50',unit:'/hpf',  ref:'<5',  cls:'rv-c'},
          {lbl:'Bacteria',val:'Many', unit:'',  ref:'None',cls:'rv-c'},
          {lbl:'Nitrite', val:'Pos', unit:'',   ref:'Neg', cls:'rv-c'},
        ],'') },
      // IMAGING
      { id:'cxr', cat:'imaging', triggers:[/\bcxr\b/,/\bchest.?x.?ray\b/,/\bchest radiograph\b/,/\bportable cxr\b/,/\bportable chest\b/],
        card: () => resultCard('imaging','Imaging','Chest X-Ray (Portable)',[
          {lbl:'Findings',val:'RLL consolidation',unit:'',ref:'',cls:'rv-c'},
          {lbl:'Comparison',val:'Worsening vs admission',unit:'',ref:'',cls:'rv-c'},
          {lbl:'PTX',val:'None',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Effusion',val:'Small right',unit:'',ref:'',cls:'rv-a'},
        ],'') },
      // FLUIDS (fluid order unlocks fluid acknowledgement card)
      { id:'ivfluid', cat:'fluid', triggers:[/\blr\b(?![\w])/,/\blrs\b/,/\blactated ringer\b/,/\bnormal saline\b/,/\bns\b(?![\w])/,/\bcrystalloid\b/,/\bbolus\b/,/\biv fluid\b/,/\bplasmalyte\b/],
        card: (raw) => resultCard('fluid','Fluid','IV Fluid Order',[
          {lbl:'Status',val:'Running',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Ordered',val:extractFluidDetail(raw),unit:'',ref:'',cls:'rv-ok'},
        ],'IV fluid administration confirmed. RN has started the ordered fluid via peripheral IV. Monitor UO and repeat BP in 15 min. In septic shock, target 30 mL/kg crystalloid as initial resuscitation.') },
      { id:'albumin', cat:'fluid', triggers:[/\balbumin\b/,/\b5% albumin\b/,/\b25% albumin\b/],
        card: (raw) => resultCard('fluid','⚠ Fluid','Albumin Order',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Type',val:'Albumin (colloid)',unit:'',ref:'',cls:'rv-a'},
        ],'<strong>⚠ Teaching Point:</strong> Albumin was ordered as fluid resuscitation. However, the Surviving Sepsis Campaign guidelines recommend <span class="hl">crystalloids (NS, LR) as first-line</span> for initial resuscitation in septic shock, NOT colloids like albumin.<br/><br/><strong>Evidence:</strong> The SAFE trial showed no mortality benefit of albumin over crystalloids in sepsis, and albumin is significantly more expensive. Crystalloids remain the standard of care for initial fluid resuscitation.<br/><br/><strong>Appropriate use of albumin:</strong> Patients requiring large volumes of crystalloid (>4L), severe hypoalbuminemia, or as rescue therapy — but NOT as first-line fluid.') },
      // MEDS
      { id:'norepi', cat:'med', triggers:[/\bnorepinephrine\b/,/\bnorepi\b/,/\blevophed\b/,/\blevo\b/],
        card: () => resultCard('med','Vasopressor','Norepinephrine',[
          {lbl:'Status',    val:'Infusing',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Start dose',val:'4-8',    unit:'mcg/min',ref:'Titrate to MAP ≥65',cls:'rv-ok'},
          {lbl:'Access',    val:'Peripheral IV (antecubital)',unit:'',ref:'',cls:'rv-a'},
        ],'Norepinephrine started peripherally — acceptable bridge while central access is being established. Check site q1h. Titrate up by 2-4 mcg/min q5–10 min to maintain MAP ≥65. Typical range 4-20 mcg/min. First-line for septic shock (Surviving Sepsis Campaign).') },
      { id:'vanco', cat:'med', triggers:[/\bvancomycin\b/,/\bvanco\b/],
        card: () => resultCard('med','Antibiotic','Vancomycin',[
          {lbl:'Status', val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',   val:'25 mg/kg',unit:'(renal adjustment needed)',ref:'',cls:'rv-a'},
          {lbl:'Route',  val:'IV',unit:'over 60 min',ref:'',cls:'rv-ok'},
        ],'Vancomycin ordered. Dose adjustment required given CKD (Cr 2.1). Pharmacy will contact you with AUC-guided dosing. Draw vancomycin trough before 4th dose.') },
      { id:'pip', cat:'med', triggers:[/\bpiperacillin\b/,/\bzosyn\b/,/\bpip.?tazo\b/],
        card: () => resultCard('med','Antibiotic','Pip-Tazo (Zosyn)',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'3.375g', unit:'IV q8h extended infusion',ref:'',cls:'rv-ok'},
        ],'Piperacillin-tazobactam ordered. Covers GNRs including Pseudomonas. Adjust for renal function (CrCl ~30 mL/min based on current Cr).') },
      { id:'cefepime', cat:'med', triggers:[/\bcefepime\b/],
        card: () => resultCard('med','Antibiotic','Cefepime',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'1g',     unit:'IV q12h (renal-adjusted)',ref:'',cls:'rv-a'},
        ],'Cefepime ordered. Renal-adjusted dose given AKI. Broad-spectrum coverage including Pseudomonas.') },
      { id:'duoneb', cat:'med', triggers:[/\bduoneb\b/,/\balbuterol\b/,/\bnebulizer\b/,/\bbronchodilator\b/,/\bipratropium\b/],
        card: () => resultCard('med','Bronchodilator','Albuterol Nebulizer',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'2.5-5 mg',unit:'via nebulizer',ref:'',cls:'rv-ok'},
          {lbl:'Frequency',val:'Q4-6h PRN',unit:'',ref:'',cls:'rv-ok'},
        ],'Albuterol nebulizer treatment ordered. Bronchodilator for wheezing or bronchospasm. Respiratory therapy notified.') },
      // POCUS
      { id:'pocus', cat:'imaging', triggers:[/\bpocus\b/,/\bbedside echo\b/,/\bbedside ultrasound\b/,/\bpoint.?of.?care\b/],
        card: () => {
          const pocus = State.caseData.pocus;
          return `
            <div class="result-card">
              <div class="result-card-type rct-imaging"></div>
              <div class="result-card-inner">
                <div class="result-card-tag" style="color:var(--blue)">Imaging</div>
                <div class="result-card-name">POCUS — Bedside Ultrasound</div>
                <div class="pocus-body" style="padding:0;">
                  <div class="pocus-rows" style="margin-bottom:10px;">${pocus.rows.map(r => `<div class="pocus-row"><div class="pocus-k">${r.k}</div><div class="pocus-v">${r.v}</div></div>`).join('')}</div>
                  <div class="pocus-interp"><div class="pocus-interp-lbl">Interpretation</div><div class="pocus-interp-txt">${pocus.interp}</div></div>
                </div>
              </div>
            </div>
          `;
        }
      },
      // PROCEDURES
      { id:'central-line', cat:'procedure', triggers:[/\bcentral line\b/,/\bcentral access\b/,/\bcvc\b/,/\bijv\b/,/\bsubclavian\b/,/\bfemoral line\b/,/\btripl?e lumen\b/],
        card: () => resultCard('procedure','Procedure','Central Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Internal jugular or subclavian',unit:'',ref:'',cls:'rv-ok'},
        ],'Central line ordered. Fellow is gathering supplies and prepping the patient. Triple-lumen catheter will provide central venous access for medications and monitoring. Will be placed at bedside using ultrasound guidance and sterile technique.') },
      { id:'arterial-line', cat:'procedure', triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Radial artery (preferred)',unit:'',ref:'',cls:'rv-ok'},
        ],'Arterial line ordered. Fellow is gathering supplies and prepping the patient. A-line will provide continuous blood pressure monitoring and arterial blood gas access. Will be placed at bedside using ultrasound guidance.') },
      // CONSULTATIONS
      { id:'micu', cat:'consult', triggers:[/\bmicu\b/,/\bicu\b(?! )/,/\bcritical care\b/,/\bintensiv(e|ist)/],
        card: () => resultCard('consult','Consultation','MICU Consultation',[
          {lbl:'Status',val:'Consult placed',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Team',val:'MICU attending paged',unit:'',ref:'',cls:'rv-ok'},
        ],'MICU consult placed. Attending will evaluate for ICU admission criteria and assist with critical care management.') },
      commonEKG,
    ],

    'cc-2': [
      { id:'abg', cat:'lab', triggers:[/\babg\b/,/\barterial blood gas\b/,/\bpao2\b/,/\bph\b(?!ys)/],
        card: () => resultCard('lab','Lab','ABG (6L NC)',[
          {lbl:'pH',    val:'7.47',unit:'',     ref:'7.35–7.45',cls:'rv-a'},
          {lbl:'PaCO₂', val:'30', unit:'mm Hg',ref:'35–45',    cls:'rv-a'},
          {lbl:'PaO₂',  val:'52', unit:'mm Hg',ref:'80–100',   cls:'rv-c'},
          {lbl:'HCO₃',  val:'22', unit:'mEq/L',ref:'22–28',    cls:'rv-ok'},
        ],'') },
      { id:'lactate', cat:'lab', triggers:[/\blactate\b/,/\blactic acid\b/],
        card: () => resultCard('lab','Lab','Lactate',[
          {lbl:'Lactate',val:'5.2',unit:'mmol/L',ref:'0.5–2.0',cls:'rv-c'}
        ],'') },
      { id:'cultures', cat:'lab', triggers:[/\bblood cultures?\b/,/\bbc\b(?![\w])/,/\bcultures?\b/],
        card: () => resultCard('lab','Lab','Blood Cultures × 2',[
          {lbl:'Status',val:'Pending',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Gram stain',val:'Pending',unit:'',ref:'',cls:'rv-a'},
        ],'') },
      { id:'troponin', cat:'lab', triggers:[/\btroponin\b/,/\bhstrop\b/,/\bcardiac enzymes\b/],
        card: () => resultCard('lab','Lab','Troponin I (hs)',[
          {lbl:'Troponin I',val:'53',unit:'ng/L (mild ↑)',ref:'<16',cls:'rv-a'},
        ],'') },
      { id:'bnp', cat:'lab', triggers:[/\bbnp\b/,/\bnt.?pro\b/,/\bnt-?proBNP\b/i],
        card: () => resultCard('lab','Lab','BNP',[
          {lbl:'BNP',val:'302',unit:'pg/mL',ref:'<100',cls:'rv-a'}
        ],'') },
      { id:'dimer', cat:'lab', triggers:[/\bd.?dimer\b/],
        card: () => resultCard('lab','Lab','D-Dimer',[
          {lbl:'D-Dimer',val:'>10,000',unit:'ng/mL FEU',ref:'<500',cls:'rv-c'}
        ],'') },
      { id:'doppler', cat:'imaging', triggers:[/\bdoppler\b/,/\ble.?doppler\b/,/\blower extremity\b/,/\bdvt\b/],
        card: () => resultCard('imaging','Imaging','LE Doppler Ultrasound',[
          {lbl:'Right femoral vein',val:'Acute DVT',unit:'',ref:'',cls:'rv-c'},
          {lbl:'Left lower ext.',  val:'No DVT',   unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Compressibility',  val:'Absent (R)',unit:'',ref:'',cls:'rv-c'},
        ],'') },
      { id:'cxr', cat:'imaging', triggers:[/\bcxr\b/,/\bchest.?x.?ray\b/,/\bchest radiograph\b/],
        card: () => resultCard('imaging','Imaging','Chest X-Ray (Portable)',[
          {lbl:'Lung fields',val:'Clear bilaterally',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Cardiomegaly',val:'None',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'PTX',val:'None',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Effusion',val:'None',unit:'',ref:'',cls:'rv-ok'},
        ],'') },
      { id:'ctpa', cat:'imaging', triggers:[/\bctpa\b/,/\bct.?pulmonary\b/,/\bct.?angio\b/,/\bct.?chest\b/,/\bcta\b/,/\bpe.?protocol\b/,/\bcta?.?pe\b/,/\bct\s*a\s*pe\b/],
        card: () => resultCard('imaging','Imaging','CT Pulmonary Angiogram',[
          {lbl:'Finding',val:'BILATERAL SADDLE PULMONARY EMBOLISM',unit:'',ref:'',cls:'rv-c'},
          {lbl:'Location',val:'Extensive thrombus in main pulmonary arteries',unit:'bilaterally extending into lobar branches',ref:'',cls:'rv-c'},
          {lbl:'RV/LV ratio',val:'>1.0',unit:'(severe RV dilation)',ref:'Normal <0.9',cls:'rv-c'},
          {lbl:'RV strain',val:'Present',unit:'(septal bowing)',ref:'',cls:'rv-c'},
        ],'<strong>MASSIVE PULMONARY EMBOLISM:</strong> Large bilateral saddle PE with RV/LV ratio >1.0 indicating acute RV dysfunction. This is a massive PE requiring immediate advanced therapy (thrombolysis vs embolectomy). Activate PERT team urgently.') },
      { id:'ivfluid', cat:'fluid', triggers:[/\blr\b(?![\w])/,/\blactated ringer\b/,/\bnormal saline\b/,/\bns\b(?![\w])/,/\bcrystalloid\b/,/\bbolus\b/,/\biv fluid\b/],
        card: (raw) => {
          const vol = extractFluidVolume(raw);
          const isLarge = vol > 750;
          return resultCard('fluid', isLarge ? '⚠ Fluid Order' : 'Fluid','IV Fluid Order',[
            {lbl:'Ordered', val: extractFluidDetail(raw), unit:'',ref:'',cls: isLarge ? 'rv-c' : 'rv-a'},
            {lbl:'Warning', val: isLarge ? 'Large bolus in RV failure' : 'Small cautious bolus given', unit:'',ref:'',cls: isLarge ? 'rv-c' : 'rv-ok'},
          ], isLarge
            ? '⚠ CAUTION: Large fluid bolus in obstructive shock worsens RV dilation by increasing preload on an already-distended RV. RV-septal interaction will further impair LV filling → paradoxical worsening of BP. Limit fluids to 250–500 mL if preload-responsive.'
            : 'Small cautious fluid bolus administered. Monitor hemodynamic response. Do not repeat unless clearly preload-responsive.');
        }
      },
      { id:'albumin', cat:'fluid', triggers:[/\balbumin\b/,/\b5% albumin\b/,/\b25% albumin\b/],
        card: (raw) => resultCard('fluid','⚠ Fluid','Albumin Order',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Type',val:'Albumin (colloid)',unit:'',ref:'',cls:'rv-a'},
        ],'<strong>⚠ Inappropriate in obstructive shock:</strong> Albumin (and all colloids) increase oncotic pressure and worsen RV overload in PE/RV failure. In obstructive shock, fluid resuscitation itself is controversial — and colloids are contraindicated.<br/><br/><strong>Correct approach:</strong> Minimal crystalloid (250-500 mL) only if preload-responsive, prefer vasopressors to maintain SVR.') },
      { id:'norepi', cat:'med', triggers:[/\bnorepinephrine\b/,/\bnorepi\b/,/\blevophed\b/,/\blevo\b/],
        card: () => resultCard('med','Vasopressor','Norepinephrine',[
          {lbl:'Status',val:'Infusing',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'8-12',unit:'mcg/min',ref:'Titrate to MAP ≥65',cls:'rv-ok'},
        ],'Norepinephrine maintains SVR and supports MAP without worsening tachycardia. First-line vasopressor in obstructive shock from PE. Does not fix the cause — definitive therapy required.') },
      { id:'heparin', cat:'med', triggers:[/\bheparin\b/,/\bunfractionated heparin\b/,/\biv heparin\b/,/\bheparin infusion\b/,/\buah\b/,/\banticoag/,/\blovenox\b/,/\benoxaparin\b/,/\blmwh\b/],
        card: () => resultCard('med','Anticoagulant','Heparin Infusion',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Bolus', val:'80 units/kg',unit:'IV (weight-based)',ref:'',cls:'rv-ok'},
          {lbl:'Infusion',val:'18 units/kg/hr',unit:'IV (per nomogram)',ref:'',cls:'rv-ok'},
          {lbl:'Note',  val:'DISCONTINUE during tPA',unit:'',ref:'',cls:'rv-a'},
        ],'Heparin started. Prevents further clot propagation. Must be DISCONTINUED during systemic thrombolysis (tPA) infusion. Resume without loading dose when aPTT <2× ULN after tPA.') },
      { id:'tpa', cat:'med', triggers:[/\btpa\b/,/\balteplase\b/,/\bthrombolysis\b/,/\bthrombolytic\b/],
        card: () => resultCard('med','Thrombolytic','Alteplase (tPA)',[
          {lbl:'Dose',   val:'100 mg',  unit:'IV over 2 hours',ref:'',cls:'rv-ok'},
          {lbl:'Route',  val:'Peripheral IV',unit:'acceptable',ref:'',cls:'rv-ok'},
          {lbl:'Heparin',val:'HOLD',   unit:'during infusion',ref:'',cls:'rv-c'},
          {lbl:'Status', val:'Administering',unit:'',ref:'',cls:'rv-ok'},
        ],'Alteplase 100 mg IV over 2 hours initiated. Standard dose for massive PE. Monitor for bleeding (BP checks q15min, neuro checks). Contraindications reviewed — none identified. Heparin held during infusion. Resume heparin when aPTT <80 (2× ULN) after infusion complete.') },
      { id:'duoneb', cat:'med', triggers:[/\bduoneb\b/,/\balbuterol\b/,/\bnebulizer\b/,/\bbronchodilator\b/,/\bipratropium\b/],
        card: () => resultCard('med','Bronchodilator','Albuterol Nebulizer',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'2.5-5 mg',unit:'via nebulizer',ref:'',cls:'rv-ok'},
          {lbl:'Frequency',val:'Q4-6h PRN',unit:'',ref:'',cls:'rv-ok'},
        ],'Albuterol nebulizer treatment ordered. Bronchodilator for wheezing or bronchospasm. Respiratory therapy notified.') },
      { id:'echo', cat:'imaging', triggers:[/\becho\b/,/\bechocardiogram\b/,/\btte\b/,/\btransthoracic echo\b/,/\bformal echo\b/],
        card: () => resultCard('imaging','Imaging','Formal Echocardiogram (TTE)',[
          {lbl:'RV size',val:'Severely dilated',unit:'RV/LV ratio >0.9',ref:'Normal <0.9',cls:'rv-c'},
          {lbl:'RV function',val:'Severely reduced',unit:'TAPSE 12 mm',ref:'Normal >16 mm',cls:'rv-c'},
          {lbl:'Septal motion',val:'Paradoxical (D-sign)',unit:'bowing into LV',ref:'',cls:'rv-c'},
          {lbl:'TR',val:'Moderate-severe',unit:'peak velocity 3.2 m/s',ref:'',cls:'rv-c'},
          {lbl:'RVSP',val:'Elevated (~55 mm Hg)',unit:'',ref:'Normal <35',cls:'rv-c'},
          {lbl:'LV function',val:'Normal (EF 60%)',unit:'underfilled',ref:'',cls:'rv-ok'},
          {lbl:'IVC',val:'Plethoric',unit:'>2.1 cm, <50% collapse',ref:'',cls:'rv-c'},
        ],'<strong>IMPRESSION:</strong> <span class="hl">Right ventricular (RV) strain — acute pressure overload</span> — characterized by RV dilation (RV/LV ratio >0.9), paradoxical septal motion (D-sign), moderate-to-severe tricuspid regurgitation, reduced RV systolic function (TAPSE 12 mm), and plethoric IVC. Findings consistent with <strong>acute cor pulmonale from massive pulmonary embolism</strong>. Requires urgent reperfusion therapy.') },
      // POCUS
      { id:'pocus', cat:'imaging', triggers:[/\bpocus\b/,/\bbedside echo\b/,/\bbedside ultrasound\b/,/\bpoint.?of.?care\b/],
        card: () => {
          const pocus = State.caseData.pocus;
          return `
            <div class="result-card">
              <div class="result-card-type rct-imaging"></div>
              <div class="result-card-inner">
                <div class="result-card-tag" style="color:var(--blue)">Imaging</div>
                <div class="result-card-name">POCUS — Bedside Ultrasound</div>
                <div class="pocus-body" style="padding:0;">
                  <div class="pocus-rows" style="margin-bottom:10px;">${pocus.rows.map(r => `<div class="pocus-row"><div class="pocus-k">${r.k}</div><div class="pocus-v">${r.v}</div></div>`).join('')}</div>
                  <div class="pocus-interp"><div class="pocus-interp-lbl">Interpretation</div><div class="pocus-interp-txt">${pocus.interp}</div></div>
                </div>
              </div>
            </div>
          `;
        }
      },
      // PROCEDURES
      { id:'central-line', cat:'procedure', triggers:[/\bcentral line\b/,/\bcentral access\b/,/\bcvc\b/,/\bijv\b/,/\bsubclavian\b/,/\bfemoral line\b/,/\btripl?e lumen\b/],
        card: () => resultCard('procedure','Procedure','Central Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Internal jugular or subclavian',unit:'',ref:'',cls:'rv-ok'},
        ],'Central line ordered. Fellow is gathering supplies and prepping the patient. Triple-lumen catheter will provide central venous access for medications and monitoring. Will be placed at bedside using ultrasound guidance and sterile technique.') },
      { id:'arterial-line', cat:'procedure', triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Radial artery (preferred)',unit:'',ref:'',cls:'rv-ok'},
        ],'Arterial line ordered. Fellow is gathering supplies and prepping the patient. A-line will provide continuous blood pressure monitoring and arterial blood gas access. Will be placed at bedside using ultrasound guidance.') },
      // CONSULTATIONS
      { id:'micu', cat:'consult', triggers:[/\bmicu\b/,/\bicu\b(?! )/,/\bcritical care\b/,/\bintensiv(e|ist)/],
        card: () => resultCard('consult','Consultation','MICU Consultation',[
          {lbl:'Status',val:'Consult placed',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Team',val:'MICU attending paged',unit:'',ref:'',cls:'rv-ok'},
        ],'MICU consult placed. Attending will evaluate for ICU admission criteria and assist with critical care management.') },
      { id:'pert', cat:'consult', triggers:[/\bpert\b/,/\bpe.?team\b/,/\bpe.?response\b/,/\bpulmonary.?embolism.?team\b/],
        card: () => resultCard('consult','Consultation','PERT Team Activation',[
          {lbl:'Status',val:'PERT activated',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Team',val:'Assembling now',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'ETA',val:'<10 minutes',unit:'',ref:'',cls:'rv-ok'},
        ],'PERT (Pulmonary Embolism Response Team) activated. Multidisciplinary team includes interventional cardiology, pulmonology, ICU, and cardiothoracic surgery. Will evaluate for catheter-directed thrombolysis vs systemic thrombolysis vs surgical embolectomy.') },
      commonEKG,
    ],

    'cc-3': [
      { id:'abg', cat:'lab', triggers:[/\babg\b/,/\barterial blood gas\b/,/\bpao2\b/,/\bph\b(?!ys)/],
        card: () => resultCard('lab','Lab','ABG (HFNC 60L FiO₂ 90%)',[
          {lbl:'pH',   val:'7.48',unit:'',     ref:'7.35–7.45',cls:'rv-a'},
          {lbl:'PaCO₂',val:'30', unit:'mm Hg',ref:'35–45',    cls:'rv-a'},
          {lbl:'PaO₂', val:'52', unit:'mm Hg',ref:'80–100',   cls:'rv-c'},
          {lbl:'P/F',  val:'58', unit:'mm Hg', ref:'>300 normal',cls:'rv-c'},
          {lbl:'HCO₃', val:'23', unit:'mEq/L',ref:'22–28',    cls:'rv-ok'},
        ],'') },
      { id:'cxr', cat:'imaging', triggers:[/\bcxr\b/,/\bchest.?x.?ray\b/,/\bchest radiograph\b/,/\bportable cxr\b/],
        card: () => resultCard('imaging','Imaging','Chest X-Ray (Portable)',[
          {lbl:'Infiltrates',val:'Diffuse bilateral',unit:'patchy opacities',ref:'',cls:'rv-c'},
          {lbl:'Distribution',val:'Bilateral',unit:'(both lungs)',ref:'',cls:'rv-c'},
          {lbl:'PTX',        val:'None',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Cardiomegaly',val:'None',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Effusion',   val:'None',unit:'',ref:'',cls:'rv-ok'},
        ],'') },
      { id:'cbc', cat:'lab', triggers:[/\bcbc\b/,/\bwbc\b/,/\bhemoglobin\b/],
        card: () => resultCard('lab','Lab','CBC',[
          {lbl:'WBC',      val:'14.0',unit:'K/µL',ref:'4.5–11',cls:'rv-a'},
          {lbl:'Hgb',      val:'13.2',unit:'g/dL',ref:'12–16',cls:'rv-ok'},
          {lbl:'Hct',      val:'40%', unit:'',    ref:'36–46',cls:'rv-ok'},
          {lbl:'Platelets',val:'185', unit:'K/µL',ref:'150–400',cls:'rv-ok'},
        ],'') },
      { id:'bmp', cat:'lab', triggers:[/\bbmp\b/,/\bcmp\b/,/\bbasic metabolic\b/,/\bcreatinine\b/,/\bcreat\b/],
        card: () => resultCard('lab','Lab','BMP',[
          {lbl:'Na',    val:'139',unit:'mEq/L',ref:'135–145',cls:'rv-ok'},
          {lbl:'K',     val:'3.9',unit:'mEq/L',ref:'3.5–5.0',cls:'rv-ok'},
          {lbl:'Creat', val:'0.9',unit:'mg/dL',ref:'0.6–1.1',cls:'rv-ok'},
          {lbl:'Glucose',val:'112',unit:'mg/dL',ref:'70–100',cls:'rv-a'},
        ],'') },
      { id:'iflu', cat:'lab', triggers:[/\binfluenza\b/,/\bflu\b(?! id)/,/\brespiratory panel\b/,/\brapid flu\b/,/\brpb\b/],
        card: () => resultCard('lab','Lab','Respiratory Viral Panel',[
          {lbl:'Influenza A',val:'POSITIVE',unit:'',ref:'Negative',cls:'rv-c'},
          {lbl:'Influenza B',val:'Negative',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'COVID-19',   val:'Negative',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'RSV',        val:'Negative',unit:'',ref:'',cls:'rv-ok'},
        ],'') },
      { id:'cultures', cat:'lab', triggers:[/\bblood cultures?\b/,/\bbc\b(?![\w])/,/\bcultures?\b/],
        card: () => resultCard('lab','Lab','Blood Cultures × 2',[
          {lbl:'Status',val:'Pending',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Gram stain',val:'Pending',unit:'',ref:'',cls:'rv-a'},
        ],'') },
      { id:'ivfluid', cat:'fluid', triggers:[/\blr\b(?![\w])/,/\blactated ringer\b/,/\bnormal saline\b/,/\bns\b(?![\w])/,/\bcrystalloid\b/,/\bbolus\b/,/\biv fluid\b/],
        card: (raw) => resultCard('fluid','Fluid','IV Fluid Order',[
          {lbl:'Ordered',val:extractFluidDetail(raw),unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Note',   val:'Conservative fluid strategy',unit:'',ref:'',cls:'rv-a'},
        ],'Fluid ordered. In ARDS, conservative fluid management after initial shock resuscitation is preferred (FACTT trial — +2.5 ventilator-free days with conservative strategy). Avoid fluid overload — worsens pulmonary edema and ventilator dependence.') },
      { id:'albumin', cat:'fluid', triggers:[/\balbumin\b/,/\b5% albumin\b/,/\b25% albumin\b/],
        card: (raw) => resultCard('fluid','⚠ Fluid','Albumin Order',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-a'},
          {lbl:'Type',val:'Albumin (colloid)',unit:'',ref:'',cls:'rv-a'},
        ],'<strong>⚠ Not recommended in ARDS:</strong> The SAFE trial showed no benefit of albumin vs crystalloids in general ICU patients. In ARDS specifically, the FACTT trial demonstrated that conservative fluid management (net negative or even) improves outcomes.<br/><br/><strong>Correct approach:</strong> Minimal crystalloid resuscitation initially, then conservative/restrictive strategy to avoid worsening pulmonary edema.') },
      { id:'ketamine', cat:'med', triggers:[/\bketamine\b/],
        card: () => resultCard('med','RSI Agent','Ketamine',[
          {lbl:'Status',val:'Drawn and ready',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'1.5 mg/kg IV',  unit:'= ~108 mg push',ref:'',cls:'rv-ok'},
        ],'Ketamine is the preferred induction agent for hemodynamically tenuous patients — maintains SVR and HR via sympathomimetic effect. Provides bronchodilation. Excellent choice here.') },
      { id:'rsi-drugs', cat:'med', triggers:[/\bsuccinylcholine\b/,/\brocuronium\b/,/\brsi\b/,/\brapid sequence\b/,/\bparalytic\b/,/\bneuromuscular\b/],
        card: () => resultCard('med','RSI Paralytic','RSI Agent',[
          {lbl:'Succinylcholine',val:'1.5 mg/kg IV',unit:'= ~108 mg',ref:'',cls:'rv-ok'},
          {lbl:'OR Rocuronium',  val:'1.2 mg/kg IV',unit:'= ~86 mg',ref:'',cls:'rv-ok'},
          {lbl:'Sugammadex',     val:'16 mg/kg',    unit:'reversal available',ref:'',cls:'rv-ok'},
        ],'RSI paralytic agent prepared. If using rocuronium, ensure sugammadex is immediately available for reversal in case of failed airway. Succinylcholine contraindicated in hyperkalemia — check potassium.') },
      { id:'preoxygenate', cat:'med', triggers:[/\bpre.?oxygenate\b/,/\bnrb\b/,/\bnon.rebreather\b/,/\bhfnc flush\b/,/\bhigh flow flush\b/,/\bapneic oxygenation\b/],
        card: () => resultCard('med','Airway Prep','Pre-Oxygenation',[
          {lbl:'HFNC flush',val:'Active',unit:'60L, FiO₂ 100% × 3 min',ref:'',cls:'rv-ok'},
          {lbl:'NRB overlay',val:'Applied',unit:'15L during prep',ref:'',cls:'rv-ok'},
          {lbl:'Apneic O₂',  val:'Plan in place',unit:'maintain HFNC during laryngoscopy',ref:'',cls:'rv-ok'},
        ],'Optimal pre-oxygenation strategy in place. HFNC flush provides FiO₂ approaching 1.0. Leave cannula in during laryngoscopy for apneic oxygenation — this extends safe apneic time significantly in obese patients.') },
      { id:'vent', cat:'procedure', triggers:[/\bvent\b/,/\bventilat\b/,/\bintubate\b/,/\bintubation\b/,/\bendotracheal\b/,/\bett\b/,/\blung protect\b/,/\bardsnet\b/,/\bpeep\b/,/\btidal vol\b/],
        card: () => resultCard('med','Ventilator','Post-Intubation Vent Setup',[
          {lbl:'Mode',  val:'Volume Control (AC)',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'VT',    val:'6 mL/kg × PBW',unit:'PBW = 45.5+2.3×(ht"-60)',ref:'NOT actual wt',cls:'rv-ok'},
          {lbl:'PBW (5\'4")',val:'54.7 kg',unit:'→ VT target 328 mL',ref:'',cls:'rv-ok'},
          {lbl:'Initial PEEP',val:'10',unit:'cm H₂O',ref:'ARDSnet table',cls:'rv-ok'},
          {lbl:'FiO₂',  val:'1.0',unit:'→ titrate to SpO₂ 88–95%',ref:'',cls:'rv-ok'},
          {lbl:'RR',    val:'20',unit:'/min initial',ref:'',cls:'rv-ok'},
          {lbl:'Pplat goal',val:'≤30',unit:'cm H₂O',ref:'Check within 30 min',cls:'rv-ok'},
        ],'ARDSnet lung-protective ventilation initiated. CRITICAL: VT must be based on PREDICTED body weight (PBW), not actual weight. With obesity, actual ≫ PBW — using actual weight causes volutrauma. Check plateau pressure immediately after intubation.') },
      { id:'sedation', cat:'med', triggers:[/\bpropofol\b/,/\bfentanyl\b/,/\bsedation\b/,/\banalgesia\b/,/\bmidazolam\b/,/\bversed\b/,/\banalgo.?sedation\b/,/\bpain.*sedation\b/],
        card: () => resultCard('med','Sedation/Analgesia','Post-Intubation Sedation',[
          {lbl:'Fentanyl',val:'25–50 mcg/hr',unit:'IV (analgesia first)',ref:'',cls:'rv-ok'},
          {lbl:'Propofol', val:'5–50 mcg/kg/min',unit:'IV titrate',ref:'',cls:'rv-ok'},
          {lbl:'Target RASS',val:'-1 to -2',unit:'(light sedation)',ref:'RASS 0 = awake',cls:'rv-ok'},
        ],'Analgesia-first approach (fentanyl) with propofol for comfort. Target light sedation (RASS -1 to -2) to allow daily awaking trials and spontaneous breathing trials. Avoid deep sedation — associated with prolonged ventilation.') },
      { id:'prone', cat:'med', triggers:[/\bprone\b/,/\bproning\b/,/\bprone.?position\b/],
        card: () => resultCard('med','Positioning','Prone Positioning',[
          {lbl:'Indication',val:'P/F <150 mm Hg',unit:'(this patient P/F ~58)',ref:'',cls:'rv-ok'},
          {lbl:'Protocol',  val:'≥16 hrs/day',   unit:'(PROSEVA)',ref:'',cls:'rv-ok'},
          {lbl:'Team',      val:'6+ staff needed',unit:'for safe turn',ref:'',cls:'rv-a'},
          {lbl:'Timing',    val:'Within 36 hrs of intubation',unit:'',ref:'',cls:'rv-ok'},
        ],'Prone positioning indicated — P/F ratio 58 is well below the 150 mm Hg threshold. PROSEVA trial (2013): 16% absolute mortality reduction in severe ARDS with prone ≥16 hrs/day. Coordinate with RT and nursing for safe prone turn.') },
      { id:'tamiflu', cat:'med', triggers:[/\boseltamivir\b/,/\btamiflu\b/,/\bflu treatment\b/,/\bantiviral\b/],
        card: () => resultCard('med','Antiviral','Oseltamivir',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'75 mg',unit:'PO/NG BID × 5 days',ref:'',cls:'rv-ok'},
          {lbl:'Note',  val:'Consider extended course',unit:'in ICU patients',ref:'',cls:'rv-a'},
        ],'Oseltamivir initiated for confirmed influenza A. May reduce duration/severity even when started late in severe cases. Continue throughout ICU stay.') },
      { id:'increase-peep', cat:'procedure', triggers:[/\bincrease.*peep\b/i,/\bpeep.*\d+/i,/\bpeep to \d+/i,/\braise peep\b/i,/\bhigher peep\b/i,/\bup.*peep\b/i,/\bpeep.*up\b/i],
        card: (raw) => resultCard('procedure','Ventilator Adjustment','PEEP Increase',[
          {lbl:'Order',val:'Increase PEEP',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Current',val:'10 cm H₂O',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Note',val:'RT will titrate',unit:'per protocol',ref:'',cls:'rv-ok'},
        ],'PEEP adjustment ordered. RT will increase PEEP in 2-3 cm H₂O increments while monitoring plateau pressure (<30 cm H₂O target), SpO₂, and hemodynamics. Higher PEEP in ARDS can improve oxygenation and recruit collapsed alveoli.') },
      { id:'increase-rr', cat:'procedure', triggers:[/\bincrease.*r\.?r\.?\b/i,/\bincrease.*respiratory rate\b/i,/\bincrease.*rate\b/i,/\br\.?r\.? to \d+/i,/\brate to \d+/i,/\braise.*rate\b/i,/\bhigher.*rate\b/i,/\bventilator rate\b/i],
        card: (raw) => resultCard('procedure','Ventilator Adjustment','Respiratory Rate Increase',[
          {lbl:'Order',val:'Increase respiratory rate',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Current',val:'20 breaths/min',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Note',val:'RT will adjust',unit:'monitor minute ventilation',ref:'',cls:'rv-ok'},
        ],'Respiratory rate adjustment ordered. RT will increase rate while monitoring minute ventilation, tidal volume, and arterial blood gases. In ARDS, higher RR may be needed to achieve adequate minute ventilation with lung-protective tidal volumes.') },
      { id:'decrease-fio2', cat:'procedure', triggers:[/\bdecrease.*fio2\b/i,/\blower.*fio2\b/i,/\bwean.*fio2\b/i,/\btitrate.*fio2\b/i,/\bfio2.*down\b/i,/\breduce.*fio2\b/i],
        card: (raw) => resultCard('procedure','Ventilator Adjustment','FiO₂ Weaning',[
          {lbl:'Order',val:'Wean FiO₂',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Current',val:'80%',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Target',val:'SpO₂ 88-95%',unit:'',ref:'',cls:'rv-ok'},
        ],'FiO₂ weaning ordered. RT will decrease FiO₂ in 10% decrements while maintaining SpO₂ goal 88-95%. In ARDS, prioritize PEEP optimization before aggressive FiO₂ weaning to avoid derecruitment.') },
      { id:'vent-adjustments', cat:'procedure', triggers:[/\badjust.*vent\b/i,/\bvent.*settings\b/i,/\bventilator.*changes\b/i,/\bchange.*vent\b/i,/\btitrate.*vent\b/i],
        card: (raw) => resultCard('procedure','Ventilator Management','Ventilator Adjustments',[
          {lbl:'Order',val:'Ventilator adjustments',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Current Settings',val:'Review with RT',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Goals',val:'Lung-protective strategy',unit:'Pplat <30, VT 6 mL/kg',ref:'',cls:'rv-ok'},
        ],'Ventilator adjustments ordered. RT will work with team to optimize settings while maintaining lung-protective ventilation. Consider ABG in 30 minutes after changes to assess response.') },
      { id:'duoneb', cat:'med', triggers:[/\bduoneb\b/,/\balbuterol\b/,/\bnebulizer\b/,/\bbronchodilator\b/,/\bipratropium\b/],
        card: () => resultCard('med','Bronchodilator','Albuterol Nebulizer',[
          {lbl:'Status',val:'Ordered',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Dose',  val:'2.5-5 mg',unit:'via nebulizer',ref:'',cls:'rv-ok'},
          {lbl:'Frequency',val:'Q4-6h PRN',unit:'',ref:'',cls:'rv-ok'},
        ],'Albuterol nebulizer treatment ordered. Bronchodilator for wheezing or bronchospasm. Respiratory therapy notified.') },
      // POCUS
      { id:'pocus', cat:'imaging', triggers:[/\bpocus\b/,/\bbedside echo\b/,/\bbedside ultrasound\b/,/\bpoint.?of.?care\b/],
        card: () => {
          const pocus = State.caseData.pocus;
          return `
            <div class="result-card">
              <div class="result-card-type rct-imaging"></div>
              <div class="result-card-inner">
                <div class="result-card-tag" style="color:var(--blue)">Imaging</div>
                <div class="result-card-name">POCUS — Bedside Ultrasound</div>
                <div class="pocus-body" style="padding:0;">
                  <div class="pocus-rows" style="margin-bottom:10px;">${pocus.rows.map(r => `<div class="pocus-row"><div class="pocus-k">${r.k}</div><div class="pocus-v">${r.v}</div></div>`).join('')}</div>
                  <div class="pocus-interp"><div class="pocus-interp-lbl">Interpretation</div><div class="pocus-interp-txt">${pocus.interp}</div></div>
                </div>
              </div>
            </div>
          `;
        }
      },
      // PROCEDURES
      { id:'central-line', cat:'procedure', triggers:[/\bcentral line\b/,/\bcentral access\b/,/\bcvc\b/,/\bijv\b/,/\bsubclavian\b/,/\bfemoral line\b/,/\btripl?e lumen\b/],
        card: () => resultCard('procedure','Procedure','Central Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Internal jugular or subclavian',unit:'',ref:'',cls:'rv-ok'},
        ],'Central line ordered. Fellow is gathering supplies and prepping the patient. Triple-lumen catheter will provide central venous access for medications and monitoring. Will be placed at bedside using ultrasound guidance and sterile technique.') },
      { id:'arterial-line', cat:'procedure', triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line Insertion',[
          {lbl:'Status',val:'Fellow setting up',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Site',val:'Radial artery (preferred)',unit:'',ref:'',cls:'rv-ok'},
        ],'Arterial line ordered. Fellow is gathering supplies and prepping the patient. A-line will provide continuous blood pressure monitoring and arterial blood gas access. Will be placed at bedside using ultrasound guidance.') },
      // CONSULTATIONS
      { id:'micu', cat:'consult', triggers:[/\bmicu\b/,/\bicu\b(?! )/,/\bcritical care\b/,/\bintensiv(e|ist)/],
        card: () => resultCard('consult','Consultation','MICU Consultation',[
          {lbl:'Status',val:'Consult placed',unit:'',ref:'',cls:'rv-ok'},
          {lbl:'Team',val:'MICU attending paged',unit:'',ref:'',cls:'rv-ok'},
        ],'MICU consult placed. Attending will evaluate for ICU admission criteria and assist with critical care management.') },
      commonEKG,
    ],

    // ── SEPSIS CASE 1 — Arthur Hayes ─────────────────────────────
    'ss-1': [
      // LABS — no interpretation notes; user interprets independently
      { id:'cbc', cat:'lab',
        triggers:[/\bcbc\b/,/\bcomplete blood count\b/,/\bwbc\b/,/\bhemoglobin\b/,/\bhgb\b/,/\bplatelets?\b(?! transfusion)/],
        card: () => resultCard('lab','Lab','CBC',
          [
            {lbl:'WBC',          val:'10.2',  unit:'K/µL',  ref:'4.5–11.0',  cls:'rv-a'},
            {lbl:'Bands',        val:'11%',   unit:'',      ref:'<5%',        cls:'rv-a'},
            {lbl:'Hgb',          val:'11.4',  unit:'g/dL',  ref:'13.5–17.5', cls:'rv-a'},
            {lbl:'Hct',          val:'34.2',  unit:'%',     ref:'41–53',      cls:'rv-a'},
            {lbl:'MCV',          val:'88',    unit:'fL',    ref:'80–100',     cls:'rv-ok'},
            {lbl:'Platelets',    val:'138',   unit:'K/µL',  ref:'150–400',    cls:'rv-a'},
          ],'')
      },
      { id:'bmp', cat:'lab',
        triggers:[/\bcmp\b/,/\bbmp\b/,/\bbasic metabolic\b/,/\bcomprehensive metabolic\b/,/\belectrolytes?\b/,/\blytes\b/,/\bcreatinine\b/,/\bcreat\b/,/\bbun\b/,/\bglucose\b/,/\brenal function\b/,/\bkidney function\b/],
        card: () => resultCard('lab','Lab','CMP (Comprehensive Metabolic Panel)',
          [
            {lbl:'Na',         val:'132',   unit:'mEq/L', ref:'135–145',  cls:'rv-a'},
            {lbl:'K',          val:'3.4',   unit:'mEq/L', ref:'3.5–5.0',  cls:'rv-a'},
            {lbl:'Cl',         val:'101',   unit:'mEq/L', ref:'96–106',   cls:'rv-ok'},
            {lbl:'CO₂',        val:'19',    unit:'mEq/L', ref:'22–29',    cls:'rv-a'},
            {lbl:'BUN',        val:'34',    unit:'mg/dL', ref:'7–25',     cls:'rv-a'},
            {lbl:'Creatinine', val:'1.9',   unit:'mg/dL', ref:'0.6–1.2',  cls:'rv-c'},
            {lbl:'Baseline Cr',val:'1.1',   unit:'mg/dL', ref:'(prior)',  cls:'rv-ok'},
            {lbl:'eGFR',       val:'~38',   unit:'mL/min',ref:'>60',      cls:'rv-c'},
            {lbl:'Glucose',    val:'108',   unit:'mg/dL', ref:'70–100',   cls:'rv-ok'},
            {lbl:'Ca',         val:'8.8',   unit:'mg/dL', ref:'8.5–10.5', cls:'rv-ok'},
            {lbl:'Total Protein',val:'6.4', unit:'g/dL',  ref:'6.3–8.2',  cls:'rv-ok'},
            {lbl:'Albumin',    val:'3.1',   unit:'g/dL',  ref:'3.5–5.0',  cls:'rv-a'},
            {lbl:'Total Bili', val:'1.6',   unit:'mg/dL', ref:'0.2–1.2',  cls:'rv-a'},
            {lbl:'Alk Phos',   val:'130',   unit:'U/L',   ref:'44–147',   cls:'rv-ok'},
            {lbl:'AST',        val:'48',    unit:'U/L',   ref:'10–40',    cls:'rv-a'},
            {lbl:'ALT',        val:'41',    unit:'U/L',   ref:'7–56',     cls:'rv-ok'},
          ],'')
      },
      { id:'lfts', cat:'lab',
        triggers:[/\blfts?\b/,/\bliver (panel|function|enzymes?)\b/,/\bast\b/,/\balt\b/,/\balk(aline)? phos\b/,/\bbilirubin\b/,/\bbili\b/],
        card: () => resultCard('lab','Lab','Liver Panel',
          [
            {lbl:'AST',        val:'48',  unit:'U/L',   ref:'10–40',   cls:'rv-a'},
            {lbl:'ALT',        val:'41',  unit:'U/L',   ref:'7–56',    cls:'rv-ok'},
            {lbl:'Alk Phos',   val:'130', unit:'U/L',   ref:'44–147',  cls:'rv-ok'},
            {lbl:'Total Bili', val:'1.6', unit:'mg/dL', ref:'0.2–1.2', cls:'rv-a'},
            {lbl:'Direct Bili',val:'0.5', unit:'mg/dL', ref:'0.0–0.3', cls:'rv-a'},
            {lbl:'Albumin',    val:'3.1', unit:'g/dL',  ref:'3.5–5.0', cls:'rv-a'},
            {lbl:'Total Protein',val:'6.4',unit:'g/dL', ref:'6.3–8.2', cls:'rv-ok'},
          ],'')
      },
      { id:'lactate', cat:'lab',
        triggers:[/\blactate\b/,/\blactic acid\b/],
        card: () => resultCard('lab','Lab','Lactate Level',
          [
            {lbl:'Lactate', val:'5.9', unit:'mmol/L', ref:'0.5–2.0', cls:'rv-c'},
          ],'')
      },
      { id:'procalcitonin', cat:'lab',
        triggers:[/\bprocalcitonin\b/,/\bpct\b(?![\w])/],
        card: () => resultCard('lab','Lab','Procalcitonin',
          [
            {lbl:'Procalcitonin', val:'1.8', unit:'ng/mL', ref:'<0.25', cls:'rv-c'},
          ],'')
      },
      { id:'coags', cat:'lab',
        triggers:[/\bcoags?\b/,/\bpt\b(?![\w])/,/\bptt\b/,/\binr\b/,/\bcoagulation\b/,/\bprothrombin\b/,/\bfibrinogen\b/],
        card: () => resultCard('lab','Lab','Coagulation Panel',
          [
            {lbl:'PT',        val:'13.2', unit:'sec',  ref:'11.0–13.5', cls:'rv-ok'},
            {lbl:'INR',       val:'1.1',  unit:'',     ref:'0.8–1.2',   cls:'rv-ok'},
            {lbl:'PTT',       val:'31',   unit:'sec',  ref:'25–35',     cls:'rv-ok'},
            {lbl:'Fibrinogen',val:'410',  unit:'mg/dL',ref:'200–400',   cls:'rv-a'},
          ],'')
      },
      { id:'cultures', cat:'lab',
        triggers:[/\bblood cultures?\b/,/\bbc\b(?![\w])/,/\bbcx\b/,/\bcultures?\b/],
        card: () => resultCard('lab','Lab','Blood Cultures × 2',
          [
            {lbl:'Set 1 — peripheral', val:'Pending (drawn)', unit:'', ref:'', cls:'rv-a'},
            {lbl:'Set 2 — peripheral', val:'Pending (drawn)', unit:'', ref:'', cls:'rv-a'},
            {lbl:'Collection time',    val:'19:34',           unit:'', ref:'', cls:'rv-ok'},
          ],'')
      },
      { id:'cdiff', cat:'lab',
        triggers:[/\bc\.?\s*diff\b/,/\bcdiff\b/,/\bclostridium\b/,/\bclostridioides\b/,/\bc diff pcr\b/,/\bstool culture\b/,/\bstool pcr\b/,/\bgdh\b/,/\bea\b.*\btoxin\b/],
        card: () => resultCard('lab','Lab','C. diff PCR',
          [
            {lbl:'C. diff PCR',  val:'PENDING',         unit:'', ref:'', cls:'rv-a'},
            {lbl:'Collection',   val:'Sample collected', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'TAT',          val:'2–4 hours',        unit:'', ref:'', cls:'rv-ok'},
          ],'')
      },
      { id:'ua', cat:'lab',
        triggers:[/\bua\b(?![\w])/,/\burinalysis\b/,/\burine cultures?\b/,/\burine cx\b/],
        card: () => resultCard('lab','Lab','Urinalysis + Culture',
          [
            {lbl:'Color',    val:'Dark yellow', unit:'',     ref:'',     cls:'rv-a'},
            {lbl:'Clarity',  val:'Cloudy',      unit:'',     ref:'Clear',cls:'rv-a'},
            {lbl:'Sp Gravity',val:'1.028',      unit:'',     ref:'1.003–1.030',cls:'rv-ok'},
            {lbl:'pH',       val:'5.5',         unit:'',     ref:'4.5–8',cls:'rv-ok'},
            {lbl:'WBC',      val:'5–10',        unit:'/hpf', ref:'<5',   cls:'rv-a'},
            {lbl:'RBC',      val:'2–5',         unit:'/hpf', ref:'<3',   cls:'rv-ok'},
            {lbl:'Bacteria', val:'Few',         unit:'',     ref:'None', cls:'rv-a'},
            {lbl:'Nitrite',  val:'Negative',    unit:'',     ref:'Neg',  cls:'rv-ok'},
            {lbl:'Leuk Est', val:'Trace',       unit:'',     ref:'Neg',  cls:'rv-a'},
            {lbl:'Culture',  val:'Pending',     unit:'',     ref:'',     cls:'rv-a'},
          ],'')
      },
      // IMAGING — interpretation notes kept
      { id:'ct-abdomen', cat:'imaging',
        triggers:[/\bct\b.*\b(abd|abdomen|pelvis|abdom)\b/,/\b(abd|abdomen|pelvis)\b.*\bct\b/,/\bct a\/p\b/,/\bct ap\b/,/\babdominal ct\b/,/\bcomputed tomography.*abd\b/],
        card: () => resultCard('imaging','Imaging','CT Abdomen/Pelvis (Non-Contrast)',
          [
            {lbl:'Transverse colon', val:'Markedly dilated — 9.2 cm',     unit:'', ref:'<6 cm', cls:'rv-c'},
            {lbl:'Colonic wall',     val:'Thinned, edematous',            unit:'', ref:'',       cls:'rv-c'},
            {lbl:'Pneumatosis',      val:'Focal intramural air — present',unit:'', ref:'None',   cls:'rv-c'},
            {lbl:'Pericolonic',      val:'Extensive fat stranding',       unit:'', ref:'',       cls:'rv-c'},
            {lbl:'Perforation',      val:'No free air — NOT YET perforated', unit:'', ref:'',   cls:'rv-a'},
            {lbl:'Free fluid',       val:'Small amount perihepatic',      unit:'', ref:'None',   cls:'rv-a'},
            {lbl:'Liver/Spleen',     val:'Unremarkable',                  unit:'', ref:'',       cls:'rv-ok'},
          ],'')
      },
      { id:'kub', cat:'imaging',
        triggers:[/\bkub\b/,/\babdominal x.?ray\b/,/\baxr\b/,/\bflat plate\b/,/\bplain film.*abd\b/,/\babdominal film\b/],
        card: () => resultCard('imaging','Imaging','KUB (Abdominal X-Ray)',
          [
            {lbl:'Colon — transverse', val:'Markedly dilated',      unit:'',   ref:'<6 cm',    cls:'rv-c'},
            {lbl:'Diameter',           val:'>9 cm at widest point', unit:'',   ref:'',          cls:'rv-c'},
            {lbl:'Haustral markings',  val:'Loss of haustra noted', unit:'',   ref:'Present',   cls:'rv-c'},
            {lbl:'Bowel wall',         val:'"Thumbprinting" present',unit:'',  ref:'Smooth',    cls:'rv-c'},
            {lbl:'Air-fluid levels',   val:'Present',               unit:'',   ref:'Absent',    cls:'rv-a'},
            {lbl:'Free air',           val:'No pneumoperitoneum',   unit:'',   ref:'',          cls:'rv-ok'},
            {lbl:'Small bowel',        val:'Mildly dilated loops',  unit:'',   ref:'',          cls:'rv-a'},
          ],'Marked non-obstructive colonic dilation exceeding 6 cm, predominantly in the transverse colon. Loss of haustral markings, air-fluid levels, and mucosal thumbprinting are present — consistent with severe colonic wall edema.')
      },
      { id:'cxr', cat:'imaging',
        triggers:[/\bcxr\b/,/\bchest.?x.?ray\b/,/\bchest radiograph\b/,/\bportable cxr\b/,/\bportable chest\b/],
        card: () => resultCard('imaging','Imaging','Chest X-Ray (Portable)',
          [
            {lbl:'Lungs',    val:'Clear bilaterally',         unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Pleural',  val:'No effusion',               unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Cardiac',  val:'Normal cardiac silhouette', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Mediastinum',val:'No widening',             unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Bones',    val:'No acute abnormality',      unit:'', ref:'', cls:'rv-ok'},
          ],'No acute cardiopulmonary process identified.')
      },
      // CONSULTATIONS
      { id:'micu-consult', cat:'consult',
        triggers:[/\bmicu\b/,/\bicu\b(?! )/,/\bcritical care\b/,/\bintensiv(e|ist)/,/\btransfer.*unit\b/,/\badmit.*icu\b/],
        card: () => resultCard('consult','Consultation','MICU Consultation',
          [
            {lbl:'Status', val:'Consult placed',    unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',   val:'MICU fellow paged', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'ETA',    val:'~15 minutes',       unit:'', ref:'', cls:'rv-ok'},
          ],'MICU consult placed. Attending will assess for ICU transfer criteria.\n\n2026 SSC (Rec 15): For adults with sepsis or septic shock requiring ICU admission, guidelines suggest admission within 6 hours.')
      },
      { id:'surgery-consult', cat:'consult',
        triggers:[/\bsurgery\b/,/\bsurgical\b/,/\bgen surg\b/,/\bgeneral surgery\b/,/\bsurg consult\b/,/\bcolectomy\b/],
        card: () => resultCard('consult','Consultation','Emergency General Surgery Consultation',
          [
            {lbl:'Status',   val:'⚠ URGENT consult placed',   unit:'', ref:'', cls:'rv-c'},
            {lbl:'Team',     val:'Surgery fellow paged STAT',  unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Reason',   val:'Toxic megacolon on CT',      unit:'', ref:'', cls:'rv-c'},
            {lbl:'ETA',      val:'Arriving within 15 minutes', unit:'', ref:'', cls:'rv-ok'},
          ],'Emergency surgery consult placed for toxic megacolon. Surgery will evaluate for subtotal colectomy with end ileostomy — indicated if clinical deterioration, perforation, or failure to improve with medical management within 24–48 hours. Keep patient NPO and on strict bowel rest.')
      },
      { id:'id-consult', cat:'consult',
        triggers:[/\binfectious disease\b/,/\bid consult\b/,/\binfect dis\b/,/\bid\b(?! ).*consult/],
        card: () => resultCard('consult','Consultation','Infectious Disease Consultation',
          [
            {lbl:'Status', val:'Consult placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',   val:'ID fellow paged',unit:'', ref:'', cls:'rv-ok'},
          ],'ID consult placed. Do not delay antibiotics waiting for ID to respond — start empiric broad-spectrum coverage now.')
      },
      { id:'central-line', cat:'procedure',
        triggers:[/\bcentral line\b/,/\bcentral venous\b/,/\bcvc\b/,/\bcvl\b/,/\btlc\b/,/\btriple lumen\b/,/\binternal jugular\b/,/\bij line\b/,/\bsubclavian\b/,/\bfemoral line\b/],
        card: () => resultCard('procedure','Procedure','Central Venous Line (CVC)',
          [
            {lbl:'Status',   val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',     val:'Internal jugular (preferred) or subclavian', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',     val:'Fellow to bedside for placement', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Indication',val:'Vasopressor administration, hemodynamic monitoring', unit:'', ref:'', cls:'rv-ok'},
          ],'Central venous access ordered. Required for reliable vasopressor delivery. Per 2026 SSC, peripheral vasopressor is acceptable while obtaining central access — do not delay norepinephrine initiation waiting for central line placement.')
      },
      { id:'arterial-line', cat:'procedure',
        triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line',
          [
            {lbl:'Status',    val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',      val:'Radial artery (preferred)', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',      val:'Fellow to bedside', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Indication',val:'Continuous BP monitoring, serial ABGs', unit:'', ref:'', cls:'rv-ok'},
          ],'Arterial line ordered. Provides beat-to-beat blood pressure monitoring and direct arterial access for ABGs. Recommended in septic shock requiring vasopressors.')
      },
      commonEKG,
    ],

    // ── SEPSIS CASE 2 — Valentina Reyes ──────────────────────────
    'ss-2': [
      { id:'central-line', cat:'procedure',
        triggers:[/\bcentral line\b/,/\bcentral venous\b/,/\bcvc\b/,/\bcvl\b/,/\btlc\b/,/\btriple lumen\b/,/\binternal jugular\b/,/\bij line\b/,/\bsubclavian\b/,/\bfemoral line\b/],
        card: () => resultCard('procedure','Procedure','Central Venous Line (CVC)',
          [
            {lbl:'Status',    val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',      val:'Internal jugular or subclavian', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',      val:'Fellow to bedside for placement', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Indication',val:'Vasopressor administration, CVP monitoring', unit:'', ref:'', cls:'rv-ok'},
          ],'Central line ordered. 2026 SSC: Peripheral vasopressor acceptable while obtaining central access — do not delay vasopressor initiation.')
      },
      { id:'arterial-line', cat:'procedure',
        triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line',
          [
            {lbl:'Status',    val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',      val:'Radial artery (preferred)', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Indication',val:'Continuous BP, serial ABGs', unit:'', ref:'', cls:'rv-ok'},
          ],'Arterial line ordered. Recommended in septic shock requiring vasopressors.')
      },
      commonEKG,
    ],

    // ── SEPSIS CASE 3 — Gloria Chen ──────────────────────────────
    'ss-3': [
      { id:'central-line', cat:'procedure',
        triggers:[/\bcentral line\b/,/\bcentral venous\b/,/\bcvc\b/,/\bcvl\b/,/\btlc\b/,/\btriple lumen\b/,/\binternal jugular\b/,/\bij line\b/,/\bsubclavian\b/,/\bfemoral line\b/],
        card: () => resultCard('procedure','Procedure','Central Venous Line (CVC)',
          [
            {lbl:'Status',    val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',      val:'Internal jugular (femoral acceptable given coagulopathy)', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Team',      val:'Fellow to bedside', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Note',      val:'Plt 42, INR 1.6 — increased bleeding risk', unit:'', ref:'', cls:'rv-a'},
          ],'Central line placed with bleeding precautions given Plt 42 and INR 1.6. Compressible site (femoral) may be preferred over non-compressible (subclavian) in coagulopathic patients.')
      },
      { id:'arterial-line', cat:'procedure',
        triggers:[/\barterial line\b/,/\ba.?line\b/,/\bart line\b/,/\bradial art\b/,/\bfemoral art\b/],
        card: () => resultCard('procedure','Procedure','Arterial Line',
          [
            {lbl:'Status',    val:'Order placed', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Site',      val:'Radial artery', unit:'', ref:'', cls:'rv-ok'},
            {lbl:'Note',      val:'Plt 42 — hold firm pressure after placement', unit:'', ref:'', cls:'rv-a'},
          ],'Arterial line ordered with coagulopathy precautions. Provides continuous BP monitoring and serial ABG access.')
      },
      commonEKG,
    ]
  };
  return catalogs[caseId] || [];
}

function resultCard(type, typeLabel, name, rows, note) {
  const typeCls = { lab:'rct-lab', imaging:'rct-imaging', ekg:'rct-ekg', fluid:'rct-fluid', med:'rct-med' }[type] || 'rct-lab';
  const tagColor = { lab:'var(--cyan)', imaging:'var(--blue)', ekg:'var(--green)', fluid:'var(--purple)', med:'var(--amber)' }[type] || 'var(--cyan)';
  return `
    <div class="result-card">
      <div class="result-card-type ${typeCls}"></div>
      <div class="result-card-inner">
        <div class="result-card-tag" style="color:${tagColor}">${typeLabel}</div>
        <div class="result-card-name">${name}</div>
        <div class="result-card-rows">
          ${rows.map(r => `
            <div class="rcr-row">
              <span class="rcr-label">${r.lbl}</span>
              <span class="rcr-val ${r.cls}">${r.val}</span>
              ${r.unit ? `<span class="rcr-unit">${r.unit}</span>` : ''}
              ${r.ref  ? `<span class="rcr-ref">${r.ref}</span>` : ''}
            </div>
          `).join('')}
        </div>
        ${note ? `<div class="result-card-note">${note}</div>` : ''}
      </div>
    </div>
  `;
}

function extractFluidDetail(orderText) {
  const m = orderText.match(/(\d+[\.,]?\d*\s*(?:ml|cc|liter|l|mg))/i);
  return m ? orderText.trim().substring(0,80) : orderText.trim().substring(0,80);
}

// Resolves dynamic tokens in prompt/narrative/vitalsMsg strings.
// Tokens are replaced at render time using live State values.
// Currently supported:
//   {{FLUID_L}}        → actual litres given, or "IV fluids" if nothing tracked
//   {{FLUID_ML}}       → actual mL given
//   {{ANTIBIOTIC}}     → specific antibiotic ordered, or "antibiotics" if not tracked
//   {{LACTATE_D2}}     → repeat lactate sentence if lactate was ordered; empty if not
//   {{BCX_LINE}}       → "Blood cultures from two peripheral sites are drawn. " if ordered, else ""
//   {{LACTATE_LINE}}   → "Lactate is sent. " if ordered, else ""
//   {{FLUID_LINE}}     → "XL IV crystalloid initiated. " if fluids ordered, else ""
//   {{ABX_LINE}}       → "Antibiotic started. " if ordered, else ""
//   {{ABX_REMINDER}}   → advisory note if antibiotics were NOT ordered, else ""
//   {{ATTENDING_QUOTE}} → contextual attending remark based on what was ordered
//   {{FLUID_AND_ABX}}  → summary phrase of fluid + antibiotic for vitalsMsg
function resolveTokens(text) {
  if (!text) return text;
  const fluidMl = State.totalFluidGiven || 0;
  const fluidsLStr = fluidMl > 0 ? (fluidMl / 1000).toFixed(1) + 'L' : 'IV fluids';
  const ml = String(fluidMl);
  const abx = State.lastOrderedAntibiotic || 'antibiotics';

  // Individual order lines — only include if that order was placed
  const bcxLine   = State.culturesOrdered        ? 'Blood cultures from two peripheral sites are drawn. ' : '';
  const lactLine  = State.lactateOrdered         ? 'Lactate is sent. '                                    : '';
  const fluidLine = fluidMl > 0                  ? (fluidMl/1000).toFixed(1) + 'L IV crystalloid initiated. ' : '';
  const abxLine   = State.lastOrderedAntibiotic  ? State.lastOrderedAntibiotic + ' started. '             : '';

  // Advisory if antibiotics were not ordered
  const abxReminder = State.lastOrderedAntibiotic ? '' :
    '\n\n<span class="hl">Note: IV antibiotics have not been ordered yet</span> — this is the most time-sensitive intervention in sepsis. Each hour of delay increases mortality by ~7–10%.';

  // Attending quote varies by whether antibiotics were ordered
  const attendingQuote = State.lastOrderedAntibiotic
    ? 'The attending: <em>"Good — the workup and the resuscitation have to run simultaneously. Don\'t wait for results before treating."</em>'
    : 'The attending: <em>"Good start on resuscitation — but we still need IV antibiotics. Don\'t wait for culture results to come back."</em>';

  // Fluid + antibiotic summary for vitalsMsg
  const fluidAndAbx = (() => {
    const f = fluidMl > 0 ? (fluidMl/1000).toFixed(1) + 'L LR' : null;
    const a = State.lastOrderedAntibiotic || null;
    if (f && a) return f + ' and ' + a;
    if (f)      return f;
    if (a)      return a;
    return 'initial management';
  })();

  // Repeat lactate sentence for decision2 prompt
  const lactateD2 = State.lactateOrdered
    ? 'Repeat lactate is 6.8 mmol/L — rising from 5.9. '
    : '';

  const fluidGiven = fluidMl > 0;

  // POCUS IVC result — depends on whether fluids were given
  const pocusVolResult = fluidGiven
    ? `<strong>Cardiac view:</strong> Hyperdynamic LV. No pericardial effusion.<br/><strong>IVC:</strong> Plethoric. Diameter 2.1 cm. <span class="hl"><30% inspiratory collapse</span> — consistent with elevated right-sided filling pressures.<br/><strong>Lung:</strong> Bilateral B-lines present at bases.<br/><br/>Assessment: <span class="hl">NOT significantly volume responsive</span>. Additional fluid boluses are unlikely to improve cardiac output and risk worsening pulmonary edema.`
    : `<strong>Cardiac view:</strong> Hyperdynamic LV. No pericardial effusion. Small underfilled ventricle.<br/><strong>IVC:</strong> Collapsible. Diameter 1.3 cm. <span class="hl">>60% inspiratory collapse with sniff test</span> — consistent with low right atrial pressure.<br/><strong>Lung:</strong> A-lines bilaterally — no pulmonary edema.<br/><br/>Assessment: <span class="hl">Volume responsive</span>. Patient likely to benefit from IV fluid resuscitation.`;

  const pocusVolMsg = fluidGiven
    ? `POCUS findings suggest the patient has received adequate or near-adequate volume. MAP remains ${fluidMl > 0 ? '62' : '63'} mm Hg — fluid alone will not correct the hypotension at this stage.`
    : `POCUS confirms significant hypovolemia. Initiate IV fluid resuscitation — target 30 mL/kg balanced crystalloid (LR preferred per 2026 SSC guidelines). Reassess after initial bolus.`;

  // PLR result — depends on whether fluids were given
  const plrVolResult = fluidGiven
    ? `Passive leg raise performed — patient supine, legs elevated to 45° for 60 seconds.<br/><br/>Heart rate: 88 → 89 bpm (no change)<br/>Systolic BP: 101 → 103 mm Hg (+2 mm Hg)<br/>Pulse pressure: no significant change (<5%)<br/><br/><span class="hl">Negative PLR — NOT fluid responsive.</span> A positive response requires ≥10% increase in pulse pressure or cardiac output. This patient will not significantly benefit from further fluid loading.`
    : `Passive leg raise performed — patient supine, legs elevated to 45° for 60 seconds.<br/><br/>Heart rate: 88 → 84 bpm<br/>Systolic BP: 101 → 113 mm Hg (+12 mm Hg)<br/>Pulse pressure: increased by 14%<br/><br/><span class="hl">Positive PLR — fluid responsive.</span> ≥10% increase in pulse pressure confirms volume responsiveness. Initiate IV fluid resuscitation.`;

  const plrVolMsg = fluidGiven
    ? `PLR confirms the patient is NOT significantly fluid responsive. Further volume loading is unlikely to improve perfusion. Consider vasopressor support.`
    : `PLR confirms fluid responsiveness. Initiate IV fluid resuscitation — 30 mL/kg balanced crystalloid. Reassess after initial bolus.`;

  return text
    .replace(/\{\{FLUID_L\}\}L/g, fluidsLStr)
    .replace(/\{\{FLUID_L\}\}/g, fluidMl > 0 ? (fluidMl / 1000).toFixed(1) : '—')
    .replace(/\{\{FLUID_ML\}\}/g, ml)
    .replace(/\{\{ANTIBIOTIC\}\}/g, abx)
    .replace(/\{\{LACTATE_D2\}\}/g, lactateD2)
    .replace(/\{\{BCX_LINE\}\}/g, bcxLine)
    .replace(/\{\{LACTATE_LINE\}\}/g, lactLine)
    .replace(/\{\{FLUID_LINE\}\}/g, fluidLine)
    .replace(/\{\{ABX_LINE\}\}/g, abxLine)
    .replace(/\{\{ABX_REMINDER\}\}/g, abxReminder)
    .replace(/\{\{ATTENDING_QUOTE\}\}/g, attendingQuote)
    .replace(/\{\{FLUID_AND_ABX\}\}/g, fluidAndAbx)
    .replace(/\{\{POCUS_VOL_RESULT\}\}/g, pocusVolResult)
    .replace(/\{\{POCUS_VOL_MSG\}\}/g, pocusVolMsg)
    .replace(/\{\{PLR_VOL_RESULT\}\}/g, plrVolResult)
    .replace(/\{\{PLR_VOL_MSG\}\}/g, plrVolMsg);
}

function extractFluidVolume(orderText) {
  const m = orderText.match(/(\d+(?:\.\d+)?)\s*(?:ml|cc)/i);
  if (m) return parseInt(m[1]);
  const l = orderText.match(/(\d+(?:\.\d+)?)\s*(?:liter|l\b)/i);
  if (l) return parseFloat(l[1]) * 1000;
  return 500; // default assume 500mL
}

// ── SUBMIT ORDERS — show results with staggered delay ─────────
// ── INTUBATION MEDICATION POPUP ──────────────────────────────────
function showIntubationMedsPopup(onComplete) {
  const caseId = State.caseData?.id;
  const patientWeight = State.caseData?.patient?.weight || 'unknown';
  
  // Get ideal body weight (IBW) for dosing - case specific
  let ibwInfo = '';
  if (caseId === 'cc-3') {
    ibwInfo = '<div style="padding:12px;background:var(--bg-3);border-left:3px solid var(--cyan);border-radius:4px;margin-bottom:16px;"><strong>Patient Weight Information:</strong><br/>• Actual Body Weight: 72 kg<br/>• <span style="color:var(--cyan)">Ideal Body Weight (IBW): 54.7 kg</span> (use for RSI dosing)<br/>• Height: 5\'4" (163 cm)</div>';
  }
  
  const modalHTML = `
    <div class="modal-overlay" id="intubation-meds-modal">
      <div class="modal-content" style="max-width:600px;">
        <div class="modal-header">
          <h3>Intubation Medications</h3>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:16px;">You ordered intubation. Please specify your RSI medications and sedation plan:</p>
          ${ibwInfo}
          <div style="margin-bottom:16px;">
            <label style="display:block;font-weight:600;margin-bottom:4px;">Induction Agent:</label>
            <textarea id="induction-med" rows="2" placeholder="e.g., Ketamine 2 mg/kg IV, Etomidate 0.3 mg/kg IV" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;"></textarea>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block;font-weight:600;margin-bottom:4px;">Paralytic:</label>
            <textarea id="paralytic-med" rows="2" placeholder="e.g., Rocuronium 1 mg/kg IV, Succinylcholine 1.5 mg/kg IV" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;"></textarea>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:block;font-weight:600;margin-bottom:4px;">Post-Intubation Sedation:</label>
            <textarea id="sedation-med" rows="2" placeholder="e.g., Propofol 20-50 mcg/kg/min, Fentanyl 50 mcg q1h PRN" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--primary" id="submit-intubation-meds">Continue →</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const submitBtn = $('submit-intubation-meds');
  submitBtn.addEventListener('click', () => {
    const induction = $('induction-med').value.trim();
    const paralytic = $('paralytic-med').value.trim();
    const sedation = $('sedation-med').value.trim();
    
    if (!induction || !paralytic || !sedation) {
      alert('Please specify all three medication categories.');
      return;
    }
    
    // Store the medications
    State.intubationMeds = { induction, paralytic, sedation };
    
    // Remove modal
    const modal = $('intubation-meds-modal');
    if (modal) modal.remove();
    
    if (onComplete) onComplete();
  });
}

// ── VENTILATOR SETTINGS POPUP ────────────────────────────────────
function showVentilatorSettingsPopup(onComplete) {
  const modalHTML = `
    <div class="modal-overlay" id="ventilator-settings-modal">
      <div class="modal-content" style="max-width:600px;">
        <div class="modal-header">
          <h3>Ventilator Settings</h3>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:16px;">Please specify your initial ventilator settings:</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-weight:600;margin-bottom:4px;">Mode:</label>
              <input type="text" id="vent-mode" placeholder="e.g., AC/VC, SIMV" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;">
            </div>
            <div>
              <label style="display:block;font-weight:600;margin-bottom:4px;">Tidal Volume:</label>
              <input type="text" id="vent-vt" placeholder="e.g., 330 mL, 6 mL/kg" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
            <div>
              <label style="display:block;font-weight:600;margin-bottom:4px;">Respiratory Rate:</label>
              <input type="text" id="vent-rr" placeholder="e.g., 20, 16" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;">
            </div>
            <div>
              <label style="display:block;font-weight:600;margin-bottom:4px;">PEEP:</label>
              <input type="text" id="vent-peep" placeholder="e.g., 10, 8" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <label style="display:block;font-weight:600;margin-bottom:4px;">FiO₂:</label>
              <input type="text" id="vent-fio2" placeholder="e.g., 80%, 100%" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--primary" id="submit-ventilator-settings">Complete Intubation →</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const submitBtn = $('submit-ventilator-settings');
  submitBtn.addEventListener('click', () => {
    const mode = $('vent-mode').value.trim();
    const vt = $('vent-vt').value.trim();
    const rr = $('vent-rr').value.trim();
    const peep = $('vent-peep').value.trim();
    const fio2 = $('vent-fio2').value.trim();
    
    if (!mode || !vt || !rr || !peep || !fio2) {
      alert('Please specify all ventilator parameters.');
      return;
    }
    
    // Store the user's original ventilator settings
    State.ventilatorSettings = { mode, vt, rr, peep, fio2 };
    
    // Validate settings for Case 3 (ARDS - lung-protective ventilation)
    const caseId = State.caseData?.id;
    let needsCorrection = false;
    
    if (caseId === 'cc-3') {
      // Check for lung-protective ventilation (6 mL/kg PBW)
      const vtLower = vt.toLowerCase();
      const rrNum = parseInt(rr);
      const peepNum = parseInt(peep);
      const fio2Num = parseInt(fio2.replace('%', ''));
      
      // Check if tidal volume is too high (not lung-protective)
      const isHighVT = vtLower.includes('8') || vtLower.includes('9') || vtLower.includes('10') || 
                       (parseInt(vt) > 400) || vtLower.includes('12 ml/kg') || vtLower.includes('10 ml/kg');
      
      // Check if using actual weight instead of PBW
      const notUsingPBW = !vtLower.includes('pbw') && !vtLower.includes('6 ml/kg') && 
                          !vtLower.includes('330') && parseInt(vt) !== 330;
      
      // Check if RR too low for ventilation
      const lowRR = rrNum < 16;
      
      // Check if PEEP too low for severe ARDS
      const lowPEEP = peepNum < 8;
      
      // Check if FiO2 suboptimal
      const lowFiO2 = fio2Num < 70;
      
      if (isHighVT || notUsingPBW || lowRR || lowPEEP || lowFiO2) {
        needsCorrection = true;
      }
    }
    
    // Remove modal
    const modal = $('ventilator-settings-modal');
    if (modal) modal.remove();
    
    // Show attending correction if needed
    if (needsCorrection) {
      showAttendingCorrection(() => {
        if (onComplete) onComplete();
      });
    } else {
      if (onComplete) onComplete();
    }
  });
}

// ── ATTENDING CORRECTION FOR VENTILATOR SETTINGS ─────────────────
function showAttendingCorrection(onComplete) {
  const correctionHTML = `
    <div class="modal-overlay" id="attending-correction-modal">
      <div class="modal-content" style="max-width:650px;">
        <div class="modal-header">
          <h3>⚕️ MICU Attending Intervention</h3>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:12px;"><strong>MICU Attending:</strong> <em>"I've reviewed your ventilator settings. For severe ARDS with influenza pneumonia, we need to optimize lung-protective ventilation to prevent ventilator-induced lung injury."</em></p>
          
          <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:16px;margin:16px 0;">
            <div style="font-weight:600;margin-bottom:12px;color:var(--cyan);">Attending Made the Following Adjustments:</div>
            <div style="display:grid;gap:8px;font-size:0.9rem;">
              <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                <span style="color:var(--text-dim);">Mode:</span>
                <span style="font-weight:600;">AC/VC</span>
              </div>
              <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                <span style="color:var(--text-dim);">Tidal Volume:</span>
                <span style="font-weight:600;">330 mL (6 mL/kg PBW)</span>
              </div>
              <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                <span style="color:var(--text-dim);">Respiratory Rate:</span>
                <span style="font-weight:600;">20 breaths/min</span>
              </div>
              <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                <span style="color:var(--text-dim);">PEEP:</span>
                <span style="font-weight:600;">10 cm H₂O</span>
              </div>
              <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                <span style="color:var(--text-dim);">FiO₂:</span>
                <span style="font-weight:600;">80%</span>
              </div>
            </div>
          </div>
          
          <div style="background:var(--bg-3);border-left:3px solid var(--cyan);padding:12px;margin-top:16px;font-size:0.875rem;">
            <div style="font-weight:600;margin-bottom:6px;">Key Teaching Points:</div>
            <ul style="margin:0;padding-left:20px;color:var(--text-dim);">
              <li><strong>VT 6 mL/kg PBW:</strong> Use predicted body weight, NOT actual weight</li>
              <li><strong>PEEP 10-14:</strong> Per ARDSnet FiO₂/PEEP table for severe ARDS</li>
              <li><strong>Plateau pressure &lt;30:</strong> Monitor to prevent barotrauma</li>
              <li><strong>Permissive hypercapnia:</strong> Accept pH ≥7.20, avoid increasing VT</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--primary" id="acknowledge-correction">Understood, Proceed to Reassessment →</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', correctionHTML);
  
  // Update State with corrected settings
  State.ventilatorSettings = {
    mode: 'AC/VC',
    vt: '330 mL (6 mL/kg PBW)',
    rr: '20',
    peep: '10',
    fio2: '80%'
  };
  State.attendingCorrectedVentilator = true;
  
  const acknowledgeBtn = $('acknowledge-correction');
  acknowledgeBtn.addEventListener('click', () => {
    const modal = $('attending-correction-modal');
    if (modal) modal.remove();
    if (onComplete) onComplete();
  });
}

function processOrdersAndShowResults(orderText, decisionKey, onAllDone) {
  const caseId = State.caseData.id;
  const catalog = getCaseResultCatalog(caseId);
  const lines = orderText.split('\n').filter(l => l.trim().length > 1);
  const lower    = orderText.toLowerCase();
  const expanded = normalizeMedicalOrder(lower);   // abbreviation-expanded version for matching

  // Check for intubation order
  const intubationOrdered = /\b(intubat(e|ed|ion|ing)?|rsi|secure airway|ett)\b/.test(lower);
  
  // For Cases 1 and 2, check if they tried HFNC before intubating
  if (intubationOrdered && (caseId === 'cc-1' || caseId === 'cc-2') && !State.triedHFNC) {
    // Show nurse prompt suggesting HFNC first
    showRNMsg(
      'Alternative Oxygenation Strategy',
      'Doctor, before we intubate, should we try high-flow nasal cannula first? The patient\'s oxygenation might improve with HFNC, and we could avoid intubation if it works.\n\nHFNC can deliver up to 60L/min with FiO₂ up to 100%, and it often improves oxygenation in patients with moderate hypoxemia.\n\nWould you like to try HFNC before proceeding with intubation?',
      'RN SUGGESTION'
    );
    // Don't process the intubation order - return early
    if (onAllDone) onAllDone();
    return;
  }
  
  // Check for oxygen orders to update vitals
  let oxygenUpdate = null;
  if (/\bhfnc\b|\bhigh.?flow\b/.test(lower)) {
    oxygenUpdate = 'HFNC';
    State.triedHFNC = true; // Track that HFNC was tried
  } else if (/\bbipap\b|\bcpap\b|\bniv\b/.test(lower)) {
    oxygenUpdate = 'BiPAP';
  } else if (/\bnasal cannula\b|\bnc\b|\b2l\b|\b4l\b|\b6l\b/.test(lower)) {
    oxygenUpdate = 'NC';
  } else if (/\bnrb\b|\bnon.?rebreather\b|\b15l\b/.test(lower)) {
    oxygenUpdate = 'NRB';
  }
  
  // Store oxygen update for later use in vitals
  if (oxygenUpdate) {
    State.currentOxygenDevice = oxygenUpdate;
  }

  // Track cumulative fluid volume (for Case 1 septic shock management)
  if (/\b(fluid|bolus|saline|lactated|ringer|lr|ns|crystalloid|lactated ringers|normal saline)\b/.test(expanded)) {
    const fluidVolume = extractFluidVolume(orderText);
    State.totalFluidGiven += fluidVolume;
    console.log(`Fluid ordered: ${fluidVolume}mL. Total fluid given: ${State.totalFluidGiven}mL`);
  }

  // Detect and store the specific antibiotic ordered for token resolution
  if (!State.lastOrderedAntibiotic || /\bantibiotic\b/.test(expanded)) {
    const abxMap = [
      { re: /\bmeropenem\b/,                                                       name: 'meropenem' },
      { re: /\bimipenem\b/,                                                        name: 'imipenem-cilastatin' },
      { re: /\bcefepime\b/,                                                        name: 'cefepime' },
      { re: /\bpiperacillin.?tazobactam\b|\bpip.?taz\b|\bpiperacillin\b|\bzosyn\b/,name: 'piperacillin-tazobactam (Zosyn)' },
      { re: /\bampicillin.?sulbactam\b|\bunasyn\b/,                               name: 'ampicillin-sulbactam (Unasyn)' },
      { re: /\bvancomycin\b/,                                                      name: 'vancomycin' },
      { re: /\bceftriaxone\b|\brocephin\b/,                                        name: 'ceftriaxone (Rocephin)' },
      { re: /\bceftazidime\b/,                                                     name: 'ceftazidime' },
      { re: /\bcefepime\b/,                                                        name: 'cefepime' },
      { re: /\baztreonam\b/,                                                       name: 'aztreonam' },
      { re: /\blevofloxacin\b|\blevaquin\b/,                                       name: 'levofloxacin' },
      { re: /\bciprofloxacin\b|\bcipro\b/,                                         name: 'ciprofloxacin' },
      { re: /\bmetronidazole\b|\bflagyl\b/,                                        name: 'metronidazole (Flagyl)' },
      { re: /\bdaptomycin\b/,                                                      name: 'daptomycin' },
      { re: /\blinezolid\b/,                                                       name: 'linezolid' },
      { re: /\bclindamycin\b|\bclinda\b/,                                         name: 'clindamycin' },
      { re: /\btrimethoprim.?sulfamethoxazole\b|\bbactrim\b|\btmp.?smx\b/,         name: 'TMP-SMX (Bactrim)' },
      { re: /\bbroad.?spectrum\b|\bantibiotic\b|\babx\b/,                          name: 'broad-spectrum antibiotics' },
    ];
    const match = abxMap.find(a => a.re.test(expanded));
    if (match) State.lastOrderedAntibiotic = match.name;
  }

  // Track whether lactate was ordered
  if (/\blactate\b|\blactic acid\b/.test(expanded)) {
    State.lactateOrdered = true;
  }

  // Track whether blood cultures were ordered
  if (/\bblood cultures?\b|\bbcx\b|\bblood cx\b|\bcultures?\b/.test(expanded)) {
    State.culturesOrdered = true;
  }

  // Track whether CT abdomen was ordered
  if (/\bct\b.*\b(abd|abdomen|pelvis|abdom|ap\b|a\/p)\b|\b(abd|abdomen|pelvis)\b.*\bct\b|\bct a\/p\b|\bct ap\b|\babdominal ct\b|\bcomputed tomography.*abd\b/.test(expanded)) {
    State.ctOrdered = true;
  }

  // Find which catalog items were triggered — check both raw and expanded text
  const triggered = catalog.filter(item =>
    item.triggers.some(re => re.test(lower) || re.test(expanded))
  );

  // Deduplicate by id
  const seen = new Set();
  const unique = triggered.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  
  // Track all orders ever ordered for end-of-case review
  unique.forEach(item => {
    State.allOrdersEverOrdered.add(item.id);
  });

  // Show result feed area
  const feedWrap = $('result-feed-wrap');
  const feedCards = $('result-feed-cards');
  if (!feedWrap || !feedCards) {
    if (onAllDone) onAllDone();
    return;
  }

  feedWrap.style.display = 'block';

  if (unique.length === 0) {
    feedCards.innerHTML = `<div class="processing-row"><div class="proc-dot"></div>No specific recognizable orders found. Check your order text — be specific (e.g., "CBC", "Lactate", "Norepinephrine 8 mcg/min").</div>`;
    setTimeout(() => { if (onAllDone) onAllDone(); }, 1500);
    return;
  }

  // Store recognized orders for bedside reassessment
  // Filter out fluids - only keep labs, imaging, diagnostics, and medications
  const newOrders = unique
    .filter(item => item.cat !== 'fluid')
    .map(item => {
      // Generate a friendly display name
      let displayName = item.id;
      
      // Map common IDs to display names
      const nameMap = {
        'ekg': '12-Lead EKG',
        'lactate': 'Lactate Level',
        'cbc': 'Complete Blood Count (CBC)',
        'bmp': 'Basic Metabolic Panel (BMP)',
        'culture': 'Blood Cultures',
        'chest-xray': 'Chest X-Ray',
        'ddimer': 'D-Dimer',
        'troponin': 'Troponin',
        'bnp': 'BNP',
        'abg': 'Arterial Blood Gas (ABG)',
        'cxr': 'Chest X-Ray',
        'ct': 'CT Scan',
        'echo': 'Echocardiogram',
        'pocus': 'POCUS (Bedside Ultrasound)',
        'ua': 'Urinalysis',
        'procalcitonin': 'Procalcitonin',
        'crp': 'C-Reactive Protein (CRP)',
        'esr': 'ESR',
        'coags': 'Coagulation Panel (PT/INR)',
        'type-screen': 'Type & Screen',
        'lft': 'Liver Function Tests (LFT)',
        'duoneb': 'Albuterol Nebulizer (DuoNeb)',
        'norepi': 'Norepinephrine',
        'vasopressin': 'Vasopressin',
        'epi': 'Epinephrine',
        'dopamine': 'Dopamine',
        'phenylephrine': 'Phenylephrine',
        'pip': 'Piperacillin-Tazobactam (Zosyn)',
        'vancomycin': 'Vancomycin',
        'ceftriaxone': 'Ceftriaxone',
        'meropenem': 'Meropenem',
        'azithromycin': 'Azithromycin',
        'heparin': 'Heparin',
        'propofol': 'Propofol',
        'fentanyl': 'Fentanyl',
        'midazolam': 'Midazolam',
        'ketamine': 'Ketamine',
        'etomidate': 'Etomidate',
        'rocuronium': 'Rocuronium',
        'vecuronium': 'Vecuronium',
        'hydrocortisone': 'Hydrocortisone'
      };
      
      displayName = nameMap[item.id] || item.id.toUpperCase();
      
      return {
        id: item.id,
        name: displayName,
        cat: item.cat,
        card: item.card,
        resultHTML: null
      };
    });
  
  // Append to existing orders (for decision2)
  State.recognizedOrders = [...(State.recognizedOrders || []), ...newOrders];

  // For Phase 4 decisions, just show acknowledgment - results will appear locked in bedside reassessment
  if (decisionKey) {
    feedCards.innerHTML = `<div class="processing-row"><div class="proc-dot"></div>Orders acknowledged. Processing ${unique.length} order${unique.length > 1 ? 's' : ''}...</div>`;
    console.log('[DEBUG] About to set timeout for callback. decisionKey:', decisionKey);
    setTimeout(() => { 
      console.log('[DEBUG] Timeout fired! Calling onAllDone callback...');
      if (onAllDone) {
        console.log('[DEBUG] onAllDone exists, executing it now');
        onAllDone();
        console.log('[DEBUG] onAllDone executed successfully');
      } else {
        console.error('[ERROR] onAllDone callback is undefined!');
      }
    }, 1000);
    return;
  }

  // For non-decision order entry (Phase 3 style), show results normally - display result cards
  feedCards.innerHTML = `<div class="processing-row" id="proc-indicator"><div class="proc-dot"></div>Processing ${unique.length} order${unique.length > 1 ? 's' : ''}…</div>`;


  // Stagger results at 600ms intervals
  let delay = 600;
  unique.forEach((item, idx) => {
    setTimeout(() => {
      // Remove processing indicator after first result
      if (idx === 0) {
        const pi = $('proc-indicator');
        if (pi) pi.remove();
      }
      // Find the raw line that triggered this item to pass to dynamic cards
      const rawLine = lines.find(l => item.triggers.some(re => re.test(l.toLowerCase()))) || '';
      const cardHTML = item.card(rawLine, caseId);
      const div = document.createElement('div');
      div.innerHTML = cardHTML;
      feedCards.appendChild(div.firstElementChild);
      // Scroll to show new result
      feedCards.lastElementChild && feedCards.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // After last result, call onAllDone
      if (idx === unique.length - 1) {
        setTimeout(() => { 
          if (intubationOrdered) {
            showIntubationMedsPopup(() => {
              showVentilatorSettingsPopup(() => {
                if (onAllDone) onAllDone();
              });
            });
          } else {
            if (onAllDone) onAllDone();
          }
        }, 800);
      }
    }, delay * (idx + 1));
  });
}

// ── GENERATE ORDERS REVIEW — what was ordered vs what was missed ─────────
function generateOrdersReview() {
  const ordered = State.allOrdersEverOrdered;
  const caseId = State.caseData?.id;
  
  // Define critical orders per case
  let criticalOrders = {};
  
  if (caseId === 'cc-1') {
    // Case 1: Septic Shock
    criticalOrders = {
      'Diagnostic': {
        'cultures': 'Blood cultures (before antibiotics)',
        'lactate': 'Lactate level',
        'cbc': 'Complete Blood Count',
        'bmp': 'Basic Metabolic Panel'
      },
      'Hemodynamic': {
        'ivfluid': 'IV fluid resuscitation (30 mL/kg)',
        'norepi': 'Norepinephrine (first-line vasopressor)'
      },
      'Antibiotics': {
        'vancomycin': 'Vancomycin',
        'piperacillin': 'Piperacillin-tazobactam or Ceftriaxone'
      },
      'Consultations': {
        'micu': 'MICU consultation'
      }
    };
  } else if (caseId === 'cc-2') {
    // Case 2: Massive PE
    criticalOrders = {
      'Diagnostic': {
        'ekg': '12-Lead EKG',
        'ddimer': 'D-Dimer',
        'troponin': 'Troponin',
        'bnp': 'BNP'
      },
      'Imaging': {
        'ctpa': 'CT Pulmonary Angiogram',
        'echo': 'Echocardiogram'
      },
      'Oxygen/Hemodynamic': {
        'norepi': 'Norepinephrine (avoid large fluid bolus)',
        'heparin': 'Heparin anticoagulation'
      },
      'Consultations': {
        'pert': 'PERT team activation',
        'micu': 'MICU consultation'
      }
    };
  } else if (caseId === 'cc-3') {
    // Case 3: ARDS/Influenza
    criticalOrders = {
      'Airway Management': {
        'intubation': 'Intubation (RSI)',
        'abg': 'Arterial Blood Gas'
      },
      'Ventilator': {
        'lung-protective': 'Lung-protective ventilation (6 mL/kg PBW)'
      },
      'Medications': {
        'sedation': 'Post-intubation sedation',
        'neuromuscular': 'Neuromuscular blockade (if needed)'
      }
    };
  }
  
  let html = '<div style="margin-top:20px;padding:16px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--r-sm);">';
  html += '<div style="font-weight:600;font-size:1.05rem;margin-bottom:12px;color:var(--text);">📋 Your Orders Review</div>';
  
  let foundOrdered = false;
  let foundMissed = false;
  
  // Build ordered section
  let orderedHTML = '';
  for (const [category, orders] of Object.entries(criticalOrders)) {
    const categoryOrders = [];
    for (const [id, name] of Object.entries(orders)) {
      let wasOrdered = ordered.has(id);
      
      // Handle aliases
      if (id === 'norepi') wasOrdered = wasOrdered || ordered.has('norepinephrine') || ordered.has('levophed') || ordered.has('levo');
      if (id === 'micu') wasOrdered = wasOrdered || ordered.has('icu') || ordered.has('critical care') || ordered.has('intensive care') || ordered.has('intensivist');
      if (id === 'pert') wasOrdered = wasOrdered || ordered.has('pe team') || ordered.has('pe-team') || ordered.has('pe response') || ordered.has('pulmonary embolism team');
      if (id === 'heparin') {
        // Check for heparin itself and common anticoagulation terms
        wasOrdered = wasOrdered || 
                    ordered.has('heparin') || 
                    ordered.has('anticoagulation') || 
                    ordered.has('anticoagulate') ||
                    ordered.has('lovenox') || 
                    ordered.has('enoxaparin') ||
                    ordered.has('lmwh');
      }
      if (id === 'vancomycin') wasOrdered = wasOrdered || ordered.has('vanco') || ordered.has('vanc');
      if (id === 'piperacillin') wasOrdered = wasOrdered || ordered.has('ceftriaxone') || ordered.has('pip-tazo') || ordered.has('pip') || ordered.has('zosyn') || ordered.has('piptaz');
      if (id === 'intubation') wasOrdered = wasOrdered || ordered.has('intubate') || ordered.has('rsi') || ordered.has('ett') || ordered.has('vent') || ordered.has('intubation');
      if (id === 'lung-protective') wasOrdered = wasOrdered || ordered.has('6 ml/kg') || ordered.has('pbw') || ordered.has('vent');
      if (id === 'sedation') wasOrdered = wasOrdered || ordered.has('propofol') || ordered.has('fentanyl') || ordered.has('midazolam') || ordered.has('versed') || ordered.has('sedation');
      if (id === 'neuromuscular') wasOrdered = wasOrdered || ordered.has('rocuronium') || ordered.has('vecuronium') || ordered.has('cisatracurium') || ordered.has('paralytic') || ordered.has('neuromuscular');
      if (id === 'ivfluid') wasOrdered = wasOrdered || ordered.has('fluid') || ordered.has('bolus') || ordered.has('ns') || ordered.has('lr') || ordered.has('saline');
      
      if (wasOrdered) {
        // Special handling for MICU if it was prompted
        if (id === 'micu' && State.micuPromptedNotOrdered) {
          categoryOrders.push(`<li style="color:var(--amber);">⚠ ${name} <span style="font-size:0.9em;font-style:italic;">(ordered after nurse prompt)</span></li>`);
        } else {
          categoryOrders.push(`<li style="color:var(--green);">✓ ${name}</li>`);
        }
        foundOrdered = true;
      }
    }
    if (categoryOrders.length > 0) {
      orderedHTML += `<div style="margin-top:8px;"><strong>${category}:</strong><ul style="margin:4px 0;padding-left:20px;">${categoryOrders.join('')}</ul></div>`;
    }
  }
  
  // Build missed section
  let missedHTML = '';
  for (const [category, orders] of Object.entries(criticalOrders)) {
    const categoryMissed = [];
    for (const [id, name] of Object.entries(orders)) {
      let wasOrdered = ordered.has(id);
      
      // Handle aliases (same as above)
      if (id === 'norepi') wasOrdered = wasOrdered || ordered.has('norepinephrine') || ordered.has('levophed') || ordered.has('levo');
      if (id === 'micu') wasOrdered = wasOrdered || ordered.has('icu') || ordered.has('critical care') || ordered.has('intensive care') || ordered.has('intensivist');
      if (id === 'pert') wasOrdered = wasOrdered || ordered.has('pe team') || ordered.has('pe-team') || ordered.has('pe response') || ordered.has('pulmonary embolism team');
      if (id === 'heparin') {
        // Check for heparin itself and common anticoagulation terms
        wasOrdered = wasOrdered || 
                    ordered.has('heparin') || 
                    ordered.has('anticoagulation') || 
                    ordered.has('anticoagulate') ||
                    ordered.has('lovenox') || 
                    ordered.has('enoxaparin') ||
                    ordered.has('lmwh');
      }
      if (id === 'vancomycin') wasOrdered = wasOrdered || ordered.has('vanco') || ordered.has('vanc');
      if (id === 'piperacillin') wasOrdered = wasOrdered || ordered.has('ceftriaxone') || ordered.has('pip-tazo') || ordered.has('pip') || ordered.has('zosyn') || ordered.has('piptaz');
      if (id === 'intubation') wasOrdered = wasOrdered || ordered.has('intubate') || ordered.has('rsi') || ordered.has('ett') || ordered.has('vent') || ordered.has('intubation');
      if (id === 'lung-protective') wasOrdered = wasOrdered || ordered.has('6 ml/kg') || ordered.has('pbw') || ordered.has('vent');
      if (id === 'sedation') wasOrdered = wasOrdered || ordered.has('propofol') || ordered.has('fentanyl') || ordered.has('midazolam') || ordered.has('versed') || ordered.has('sedation');
      if (id === 'neuromuscular') wasOrdered = wasOrdered || ordered.has('rocuronium') || ordered.has('vecuronium') || ordered.has('cisatracurium') || ordered.has('paralytic') || ordered.has('neuromuscular');
      if (id === 'ivfluid') wasOrdered = wasOrdered || ordered.has('fluid') || ordered.has('bolus') || ordered.has('ns') || ordered.has('lr') || ordered.has('saline');
      
      // Show MICU as missed if it was prompted (even if eventually ordered)
      if (id === 'micu' && State.micuPromptedNotOrdered) {
        categoryMissed.push(`<li style="color:var(--amber);">⚠ ${name} <span style="font-size:0.9em;font-style:italic;">(initially missed, added after prompt)</span></li>`);
        foundMissed = true;
      } else if (!wasOrdered) {
        categoryMissed.push(`<li style="color:var(--red);">✗ ${name}</li>`);
        foundMissed = true;
      }
    }
    if (categoryMissed.length > 0) {
      missedHTML += `<div style="margin-top:8px;"><strong>${category}:</strong><ul style="margin:4px 0;padding-left:20px;">${categoryMissed.join('')}</ul></div>`;
    }
  }
  
  if (foundOrdered) {
    html += '<div style="margin-top:8px;"><strong style="color:var(--green);">✓ What You Ordered:</strong>' + orderedHTML + '</div>';
  }
  
  if (foundMissed) {
    html += '<div style="margin-top:12px;"><strong style="color:var(--red);">✗ What You Missed:</strong>' + missedHTML + '</div>';
  }
  
  if (!foundOrdered && !foundMissed) {
    html += '<div style="margin-top:8px;color:var(--text-secondary);">No critical orders were recognized in this case.</div>';
  }
  
  html += '</div>';
  return html;
}

// ═══════════════════════════════════════════════════════════════
//  PHASE RENDERERS
// ═══════════════════════════════════════════════════════════════

function renderPhase1_Vignette() {
  buildPhaseTrack(5, 1);
  const c = State.caseData;
  $('sim-content').innerHTML = `
    ${patientStrip()}
    <div class="sim-card">
      <div class="sim-card-head"><span class="phase-badge pb-vignette">Phase 1 · Case Presentation</span><span class="sim-card-title">Initial Patient Vignette</span></div>
      <div class="sim-card-body">
        <div class="vignette">${c.vignette}</div>
        <div class="btn-row"><button class="btn btn--primary" id="p1-next">Hear from Nursing →</button></div>
      </div>
    </div>
  `;
  $('p1-next').addEventListener('click', renderPhase2_RN);
}

function renderPhase2_RN() {
  buildPhaseTrack(5, 2);
  const c = State.caseData;
  $('sim-content').innerHTML = `
    ${patientStrip()}
    <div class="sim-card">
      <div class="sim-card-head"><span class="phase-badge pb-rn">Phase 2 · Nursing Report</span><span class="sim-card-title">RN Handoff</span></div>
      <div class="sim-card-body">
        <div class="rn-box">
          <div class="rn-quote">${c.rnReport}</div>
          <div class="rn-cues">${c.rnCues.map(cue => `<div class="rn-cue">${cue}</div>`).join('')}</div>
        </div>
        <div class="btn-row">
          <button class="btn btn--primary" id="p2-next">Review Objective Data →</button>
          <button class="btn btn--secondary" id="p2-back">← Back</button>
        </div>
      </div>
    </div>
  `;
  $('p2-next').addEventListener('click', renderPhase3_Data);
  $('p2-back').addEventListener('click', renderPhase1_Vignette);
}

function renderPhase3_Data() {
  buildPhaseTrack(5, 3);
  const c = State.caseData;
  State.revealed = new Set();
  // Set current exam systems for bindExamButtons
  State.currentExamSystems = c.examSystems;
  $('sim-content').innerHTML = `
    ${patientStrip()}
    <div class="sim-card">
      <div class="sim-card-head"><span class="phase-badge pb-action">Phase 3 · Objective Data</span><span class="sim-card-title">Vitals & Physical Exam</span></div>
      <div class="sim-card-body">
        <div>
          <div class="sec-lbl">Vital Signs</div>
          ${vitalsTable(c.vitals)}
        </div>
        <div class="mt-20">
          <div class="sec-lbl">Physical Examination — Tap a system to examine</div>
          ${examGrid(c.examSystems)}
        </div>
        <div class="mt-20">
          <button class="btn btn--amber btn--full" id="pocus-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            Perform Bedside Ultrasound (POCUS)
          </button>
        </div>
        <div class="btn-row">
          <button class="btn btn--primary" id="p3-next">Proceed to Decision →</button>
          <button class="btn btn--secondary" id="p3-back">← Back</button>
        </div>
      </div>
    </div>
  `;
  bindExamButtons();
  
  // Bind POCUS button
  $('pocus-btn').addEventListener('click', () => {
    // Update video sources based on case type
    const artType = State.caseData?.artType || 'default';
    const video1 = $('pocus-video');
    const video2 = $('pocus-video-ivc');
    const label1 = document.querySelector('.pocus-video-item:nth-child(1) .pocus-video-label');
    const label2 = document.querySelector('.pocus-video-item:nth-child(2) .pocus-video-label');
    
    if (artType === 'pe') {
      // Case 2: Massive PE - use PE-specific videos
      if (video1) {
        video1.innerHTML = `
          <source src="PSS-PE-POCUS.mov" type="video/quicktime">
          <source src="PSS-PE-POCUS.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video1.load();
      }
      if (video2) {
        video2.innerHTML = `
          <source src="Apical_4-PE-POCUS.mov" type="video/quicktime">
          <source src="Apical_4-PE-POCUS.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video2.load();
      }
      if (label1) label1.textContent = 'PSAX View (RV dilation)';
      if (label2) label2.textContent = 'Apical 4 View (RV > LV)';
    } else if (artType === 'ards') {
      // Case 3: ARDS - use lung POCUS
      if (video1) {
        video1.innerHTML = `
          <source src="LUNG_POCUS.mov" type="video/quicktime">
          <source src="LUNG_POCUS.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video1.load();
      }
      if (video2) {
        video2.innerHTML = `
          <source src="POCUS-IVC-loop.mov" type="video/quicktime">
          <source src="POCUS-IVC-loop.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video2.load();
      }
      if (label1) label1.textContent = 'Lung View (B-lines)';
      if (label2) label2.textContent = 'IVC View';
    } else if (artType === 'sepsis1') {
      // Sepsis Case 1: Floor sepsis — cardiac + IVC views
      if (video1) {
        video1.innerHTML = `
          <source src="SS1-POCUS-Cardiac.mp4" type="video/mp4">
          <source src="SS1-POCUS-Cardiac.mov" type="video/quicktime">
          Your browser does not support the video tag.
        `;
        video1.load();
      }
      if (video2) {
        video2.innerHTML = `
          <source src="SS1-POCUS-IVC.mp4" type="video/mp4">
          <source src="SS1-POCUS-IVC.mov" type="video/quicktime">
          Your browser does not support the video tag.
        `;
        video2.load();
      }
      if (label1) label1.textContent = 'Cardiac View';
      if (label2) label2.textContent = 'IVC View';
    } else {
      // Default: Case 1 - use default videos
      if (video1) {
        video1.innerHTML = `
          <source src="pocus-loop.mov" type="video/quicktime">
          <source src="pocus-loop.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video1.load();
      }
      if (video2) {
        video2.innerHTML = `
          <source src="POCUS-IVC-loop.mov" type="video/quicktime">
          <source src="POCUS-IVC-loop.mp4" type="video/mp4">
          Your browser does not support the video tag.
        `;
        video2.load();
      }
      if (label1) label1.textContent = 'Cardiac View';
      if (label2) label2.textContent = 'IVC View';
    }
    
    openModal('modal-pocus');
    if (video1) video1.play();
    if (video2) video2.play();
  });
  
  $('p3-next').addEventListener('click', () => renderPhase4_Decision('decision1'));
  $('p3-back').addEventListener('click', renderPhase2_RN);
}

function renderPhase4_Decision(decisionKey) {
  buildPhaseTrack(5, 4);
  const c = State.caseData;

  // ── SS-1 TOXIC MEGACOLON GATE ─────────────────────────────────
  // If routing to decision_toxic but CT abdomen was never ordered,
  // the colon has been silently progressing toward perforation.
  // Trigger an immediate Code Blue — missed imaging led to missed diagnosis.
  if (decisionKey === 'decision_toxic' && c?.id === 'ss-1' && !State.ctOrdered) {
    const content = $('sim-content');
    if (content) {
      content.innerHTML = `
        ${patientStrip()}
        <div class="sim-card">
          <div class="sim-card-head">
            <span class="phase-badge" style="background:var(--red-bg);color:var(--red);border-color:var(--red);">⚠ CRITICAL DETERIORATION</span>
            <span class="sim-card-title" style="color:var(--red);">Patient Decompensating</span>
          </div>
          <div class="sim-card-body">
            <div class="vignette" style="border-left:4px solid var(--red);padding-left:16px;">
              <p>The RN calls urgently: <em>"Doctor — Mr. Hayes just screamed out in pain. His abdomen is completely rigid now. He's gone pale, diaphoretic, and his pressure dropped to 62/30. He's not responding to me — I don't have a pulse. I'm calling a Code Blue!"</em></p>
              <p style="color:var(--tx-2);font-size:13px;margin-top:8px;">No abdominal imaging was ordered. The CT abdomen was not performed. The toxic megacolon progressed to colonic perforation undetected.</p>
            </div>
          </div>
        </div>
      `;
    }

    showCodeBlueModal(
      () => { renderPhase4_Decision('decision_toxic_postrosc'); },
      {
        rhythm: 'Pulseless Electrical Activity (PEA — Septic + Obstructive)',
        overhead: 'Code Blue, Tower 3 Bed 14. Code Blue, Tower 3 Bed 14. General Surgery to Tower 3 Bed 14 STAT.',
        cause: '',
        monitor_phrase: 'Look at the monitor — PEA. Rigid, silent abdomen. No pulse on check. Begin CPR immediately.',
        hs_ts: [
          'Hypovolemia ← massive third-spacing from fecal peritonitis',
          'Hydrogen ion (severe metabolic acidosis from peritonitis)',
          'Hypoxia ← respiratory compromise from abdominal distension',
          'Tension from abdominal compartment syndrome — consider decompression',
          'Septic source uncontrolled — bowel perforation with fecal contamination'
        ],
        acls_specifics: [
          'Epinephrine 1mg IV q3–5 min — start immediately',
          'Aggressive IV resuscitation — massive fluid losses from peritonitis',
          'Broad-spectrum antibiotics covering gram-negatives AND anaerobes (pip-tazo or carbapenems)',
          'Emergency surgery activation during CPR — emergent laparotomy required',
          'After ROSC: emergent OR for subtotal colectomy',
          'CT abdomen should have been ordered in the initial workup'
        ],
        rosc_label: '✓ ROSC Achieved — Emergent Surgery Activation →'
      },
      () => { showNoROSCScreen(
        `Despite resuscitation efforts, Mr. Hayes did not achieve ROSC. The code was called.\n\nRoot cause: No CT abdomen was ordered, so the toxic megacolon was never identified. The dilated, thinned colon with intramural air perforated silently while management focused on hemodynamics alone.\n\nKey teaching: In any septic patient with a markedly distended, tympanitic abdomen and profuse diarrhea, abdominal imaging is a critical part of the workup — not optional.`
      ); }
    );
    return;
  }
  // ── END GATE ──────────────────────────────────────────────────

  // ── SS-1 POST-CODE PATH FLAGS ─────────────────────────────────
  // When arriving at decision2_postcode for ss-1 via ROSC, flag the
  // post-code path so downstream routing can skip volume assessment.
  // NOTE: ctOrdered is NOT set here — user must order imaging themselves.
  if (decisionKey === 'decision2_postcode' && c?.id === 'ss-1') {
    State.postCodePath = true;
  }

  // When on the post-code path, skip volume assessment and go straight to
  // the surgical management step (decision_toxic_postrosc).
  if (decisionKey === 'decision2_volassess' && State.postCodePath) {
    renderPhase4_Decision('decision_toxic_postrosc');
    return;
  }
  // ── END FLAGS ─────────────────────────────────────────────────

  // ── SS-1 DECISION_TOXIC PROMPT OVERRIDE ──────────────────────
  // If CT was ordered, show the radiologist call with findings.
  // If CT was NOT ordered, the missed-CT gate above already fired
  // and returned — so we only reach this point when ctOrdered is true.
  if (decisionKey === 'decision_toxic' && c?.id === 'ss-1') {
    const dec = c['decision_toxic'];
    if (dec && State.ctOrdered) {
      dec.prompt = 'The CT abdomen results are back. The radiologist calls you: "On Mr. Hayes\' CT we\'re seeing marked dilation of the transverse colon measuring 9.2 centimeters, thinning of the colonic wall, focal intramural air, and extensive pericolonic fat stranding. No free air at this time." Mr. Hayes\' abdomen is markedly distended and tympanitic. What are your next orders?';
    } else if (dec && !State.ctOrdered) {
      dec.prompt = 'Mr. Hayes is stabilizing hemodynamically but the RN calls you urgently: "His abdomen is getting worse — it\'s more distended than before and he\'s grimacing whenever I press on it. He\'s also having more loose watery stool. The attending is asking if we\'ve looked into what\'s going on with his belly." What are your next orders?';
    }
  }
  // ── END PROMPT OVERRIDE ───────────────────────────────────────
  const dec = c[decisionKey];
  if (!dec) { renderPhase3_Data(); return; }
  State.currentDecision = decisionKey;
  
  // If we're rendering decision1_7, it means MICU was prompted but not ordered initially
  if (decisionKey === 'decision1_7') {
    State.micuPromptedNotOrdered = true;
  }

  // Use updated exam if decision provides it, otherwise use case default
  const examSystems = dec.updatedExam || c.examSystems;
  
  // Reset revealed exam systems for this decision
  State.revealed = new Set();

  $('sim-content').innerHTML = `
    ${patientStrip()}
    ${dec.conditionAlert ? `<div class="sim-card"><div class="sim-card-head"><span class="phase-badge pb-alert">Condition Update</span><span class="sim-card-title">Patient Status Change</span></div><div class="sim-card-body">${conditionAlertBlock(dec)}${dec.vitals ? '<div class="mt-16"><div class="sec-lbl">Updated Vitals</div>' + vitalsTable(dec.vitals) + '</div>' : ''}</div></div>` : ''}
    ${dec.updatedExam ? `<div class="sim-card"><div class="sim-card-head"><span class="phase-badge pb-data">Current Status</span><span class="sim-card-title">Physical Examination</span></div><div class="sim-card-body"><div class="sec-lbl">Physical Exam — Tap a system to examine</div>${examGrid(examSystems)}</div></div>` : ''}
    <div class="sim-card">
      <div class="sim-card-head"><span class="phase-badge pb-branch">Phase 4 · Clinical Decision</span><span class="sim-card-title">${dec.title}</span></div>
      <div class="sim-card-body">
        <div class="vignette" style="margin-bottom:20px;">${resolveTokens(dec.prompt)}</div>
        ${ordersSection(decisionKey)}
      </div>
    </div>
  `;
  bindOrderPreview();
  bindDecisionSubmit(decisionKey);
  
  // Bind exam system clicks if updatedExam was shown
  if (dec.updatedExam) {
    examSystems.forEach(sys => {
      const card = document.querySelector(`[data-exam-key="${sys.key}"]`);
      if (card) {
        card.addEventListener('click', () => {
          if (!State.revealed.has(sys.key)) {
            State.revealed.add(sys.key);
            card.classList.add('revealed');
            const textEl = card.querySelector('.exam-card-text');
            if (textEl) textEl.textContent = sys.text;
          }
        });
      }
    });
  }
}

function bindDecisionSubmit(decisionKey) {
  const btn = $('submit-orders');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const ta = $('orders-ta');
    const text = ta ? ta.value : '';
    if (!text.trim()) {
      showRNMsg('No Orders Entered',
        'Please enter at least one order before submitting.\n\nExamples:\n• "Lactate, CBC, BMP"\n• "Blood cultures x2"\n• "30 mL/kg LR bolus IV"\n• "Norepinephrine 8 mcg/min IV"',
        'SYSTEM');
      return;
    }
    // Lock UI while processing
    if (ta) ta.disabled = true;
    btn.disabled = true;
    btn.textContent = 'Processing orders…';
    // Show order results, then fire branch logic
    processOrdersAndShowResults(text, decisionKey, () => {
      evaluateBranch(decisionKey, text);
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  BRANCH EVALUATION
// ═══════════════════════════════════════════════════════════════

function evaluateBranch(decisionKey, orderText) {
  console.log('[DEBUG] evaluateBranch called with:', { decisionKey, orderText });
  const c = State.caseData;
  console.log('[DEBUG] Case data:', c ? c.id : 'undefined');
  const dec = c[decisionKey];
  console.log('[DEBUG] Decision object:', dec ? 'exists' : 'undefined');
  const lower = orderText.toLowerCase();
  console.log('[DEBUG] Lowercase order text:', lower);

  // Special handling for Case 1 decision1_5: check cumulative fluid
  if (c.id === 'cc-1' && decisionKey === 'decision1_5') {
    const hasFluidOrder = /\b(fluid|bolus|saline|lactated|ringer|lr|ns|crystalloid|ml|liter|l\b)\b/.test(lower);
    const hasPressor = /\b(norepi|norepinephrine|levophed|pressor|vasopressor)\b/.test(lower);
    const hasMICU = /\b(micu|icu|critical care|consult)\b/.test(lower);
    
    // Check if total fluid now >= 2400mL (approximately 30 mL/kg for 82kg patient)
    const adequateFluidTotal = State.totalFluidGiven >= 2400;
    
    console.log(`Case 1 decision1_5 evaluation: Total fluid=${State.totalFluidGiven}mL, Adequate=${adequateFluidTotal}, HasPressor=${hasPressor}, HasMICU=${hasMICU}`);
    
    // If adequate total fluid AND has pressor/MICU → rescue-complete
    if (adequateFluidTotal && (hasPressor || hasMICU)) {
      const branch = dec.branches.find(b => b.id === 'rescue-complete');
      if (branch) {
        State.decisions.push({ decKey: decisionKey, branchId: branch.id, type: branch.type });
        renderBranchResult(decisionKey, branch);
        return;
      }
    }
    
    // If adequate total fluid but NO pressor → rescue-fluid-only
    if (adequateFluidTotal && hasFluidOrder && !hasPressor) {
      const branch = dec.branches.find(b => b.id === 'rescue-fluid-only');
      if (branch) {
        State.decisions.push({ decKey: decisionKey, branchId: branch.id, type: branch.type });
        renderBranchResult(decisionKey, branch);
        return;
      }
    }
    
    // If has pressor but not adequate fluid → rescue-pressor-only
    if (hasPressor && !adequateFluidTotal) {
      const branch = dec.branches.find(b => b.id === 'rescue-pressor-only');
      if (branch) {
        State.decisions.push({ decKey: decisionKey, branchId: branch.id, type: branch.type });
        renderBranchResult(decisionKey, branch);
        return;
      }
    }
    
    // If has MICU but not adequate fluid/pressor → rescue-micu-only
    if (hasMICU && !adequateFluidTotal && !hasPressor) {
      const branch = dec.branches.find(b => b.id === 'rescue-micu-only');
      if (branch) {
        State.decisions.push({ decKey: decisionKey, branchId: branch.id, type: branch.type });
        renderBranchResult(decisionKey, branch);
        return;
      }
    }
    
    // Otherwise fall through to rescue-incomplete
    const branch = dec.branches.find(b => b.id === 'rescue-incomplete');
    if (branch) {
      State.decisions.push({ decKey: decisionKey, branchId: branch.id, type: branch.type });
      renderBranchResult(decisionKey, branch);
      return;
    }
  }

  // Default branch matching logic for all other cases
  const lowerExp = normalizeMedicalOrder(lower); // expanded for branch matching
  let matched = dec.branches.find(b => {
    if (b.triggers.length === 0 && b.requires === 0) return false; // skip default for now
    if (b.excludes && b.excludes.length > 0) {
      if (b.excludes.some(ex => lower.includes(ex) || lowerExp.includes(ex))) return false;
    }
    // Handle both string and regex triggers — check raw AND expanded text
    const hits = b.triggers.filter(t => {
      if (t instanceof RegExp) {
        return t.test(lower) || t.test(lowerExp);
      } else {
        return lower.includes(t) || lowerExp.includes(t);
      }
    }).length;
    // count unique categories hit (simple: just count total matches ≥ requires)
    return hits >= b.requires;
  });

  if (!matched) {
    console.log('[DEBUG] No specific branch matched, looking for default branch');
    matched = dec.branches.find(b => b.requires === 0); // fallback to default
    console.log('[DEBUG] Default branch:', matched ? matched.id : 'not found');
  } else {
    console.log('[DEBUG] Branch matched:', matched.id);
  }

  State.decisions.push({ decKey: decisionKey, branchId: matched.id, type: matched.type });
  console.log('[DEBUG] About to check for intubation and render branch result');
  
  // Check if intubation was ordered and show popups before rendering result
  const intubationOrdered = /\b(intubat(e|ed|ion|ing)?|rsi|secure airway|ett)\b/.test(lower);
  if (intubationOrdered) {
    console.log('[DEBUG] Intubation detected, showing intubation popups');
    showIntubationMedsPopup(() => {
      showVentilatorSettingsPopup(() => {
        console.log('[DEBUG] Calling renderBranchResult after vent settings');
        renderBranchResult(decisionKey, matched);
      });
    });
  } else {
    console.log('[DEBUG] No intubation, calling renderBranchResult directly');
    renderBranchResult(decisionKey, matched);
  }
}

// ═══════════════════════════════════════════════════════════════
//  BRANCH RESULT RENDER
// ═══════════════════════════════════════════════════════════════

function renderBranchResult(decisionKey, branch) {
  buildPhaseTrack(5, 5);
  const c = State.caseData;

  // Show outcome block appended to sim-content
  const content = $('sim-content');

  // Remove old outcome if exists
  const old = document.getElementById('branch-result-block');
  if (old) old.remove();

  // Special handling for rescue-fluid-only: inject actual fluid total
  let narrative = branch.narrative;
  if (c.id === 'cc-1' && branch.id === 'rescue-fluid-only') {
    const totalLiters = ((State.totalFluidGiven || 2500) / 1000).toFixed(1);
    narrative = `You've now given additional fluid. Combined with your initial order, the patient has received approximately <span class="hl">${totalLiters}L total</span> (target: 30 mL/kg = ~2.5L for this 82 kg patient).<br/><br/>
    However, the patient remains hypotensive despite completing fluid resuscitation. MAP remains <65 mm Hg despite adequate volume. What's your next step?`;
  }
  narrative = resolveTokens(narrative);

  const block = CE('div');
  block.id = 'branch-result-block';
  block.innerHTML = `
    <div class="sim-card">
      <div class="sim-card-head"><span class="phase-badge pb-branch">Patient Response</span><span class="sim-card-title">${branch.headline}</span></div>
      <div class="sim-card-body">
        <div class="branch-outcome ${branch.type}">
          <div class="bo-label">${branch.label}</div>
          <div class="bo-text">${narrative}</div>
        </div>
        ${renderNextActions(decisionKey, branch)}
      </div>
    </div>
  `;
  content.appendChild(block);
  block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  bindNextActions(decisionKey, branch);
}

function showCaseCompletionScreen() {
  const content = $('sim-content');
  content.innerHTML = `
    <div class="phase4-container">
      <div class="decision-card">
        <div class="decision-header" style="background:linear-gradient(135deg, var(--green) 0%, var(--green-dk) 100%);">
          <div class="decision-title">Case Management Complete</div>
        </div>
        <div class="decision-body">
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:64px;margin-bottom:16px;">✓</div>
            <div style="font-size:20px;font-weight:600;color:var(--green);margin-bottom:12px;">Ongoing MICU Management</div>
            <div style="color:var(--tx-2);margin-bottom:32px;">
              The patient requires continued critical care management in the MICU. You've made key initial decisions regarding airway management, ventilator settings, and ARDS adjunctive therapies.
            </div>
            ${generateOrdersReview()}
            <div class="btn-row" style="justify-content:center;margin-top:32px;">
              <button class="btn btn--primary" id="btn-restart">Restart Case</button>
              <button class="btn btn--secondary" id="btn-cases">Select Another Case</button>
              <button class="btn btn--secondary" id="btn-home">Return Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Bind buttons
  const restartBtn = $('btn-restart');
  if (restartBtn) restartBtn.addEventListener('click', () => { State.revealed = new Set(); State.decisions = []; renderPhase1_Vignette(); });
  const casesBtn = $('btn-cases');
  if (casesBtn) casesBtn.addEventListener('click', () => { State.reset(); showScreen('screen-cases'); });
  const homeBtn = $('btn-home');
  if (homeBtn) homeBtn.addEventListener('click', () => { State.reset(); showScreen('screen-home'); });
  
  // Scroll to top
  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderNextActions(decisionKey, branch) {
  // Determine what happens next
  if (branch.endMsg !== undefined && branch.endMsg !== null) {
    // Terminal branch
    const iconClass = branch.endState === 'good' ? 'success' : 'concern';
    const iconChar = branch.endState === 'good' ? '✓' : '!';
    const summaryItems = (branch.decisions || []).map(d => `<div class="summary-item">${d}</div>`).join('');
    const ordersReview = generateOrdersReview(); // Add orders review
    return `
      <div class="mt-20">
        <div class="end-box">
          <div class="end-icon ${iconClass}">${iconChar}</div>
          <div class="end-title" style="color:var(--${branch.endState === 'good' ? 'green' : 'amber'})">${branch.endState === 'good' ? 'Case Complete' : 'Case Concluded'}</div>
          <div class="end-text">${resolveTokens(branch.endMsg)}</div>
          ${ordersReview}
          ${summaryItems ? `<div class="summary-box"><div class="summary-lbl">Your Decision Pathway</div>${summaryItems}</div>` : ''}
          <div class="btn-row" style="justify-content:center;">
            <button class="btn btn--primary" id="btn-restart">Restart Case</button>
            <button class="btn btn--secondary" id="btn-cases">Select Another Case</button>
            <button class="btn btn--secondary" id="btn-home">Return Home</button>
          </div>
        </div>
      </div>
    `;
  }

  // Has vital signs reveal button (for decision1)
  if (branch.showVitalsButton && branch.nextVitals) {
    return `
      <div class="btn-row mt-20">
        <button class="btn btn--primary" id="btn-show-vitals" data-next="${branch.nextDecision || ''}">Return to Bedside Management →</button>
      </div>
    `;
  }

  // Has a next decision
  const nextKey = branch.nextDecision;
  if (nextKey) {
    return `
      <div class="btn-row mt-20">
        <button class="btn btn--primary" id="btn-next-decision" data-next="${nextKey}">Continue to Next Decision →</button>
      </div>
    `;
  }

  // Fallback - case completion without specific next decision
  return `
    <div class="btn-row mt-20">
      <button class="btn btn--primary" id="btn-complete-case">Return to Bedside Management →</button>
    </div>
  `;
}

function bindNextActions(decisionKey, branch) {
  const showVitalsBtn = $('btn-show-vitals');
  if (showVitalsBtn) {
    showVitalsBtn.addEventListener('click', () => {
      // Check if we should show Code Blue modal first (Case 2)
      // Open POCUS video modal before proceeding if requested
    if (branch.showPocusModal) {
      const artType = State.caseData?.artType;
      const video1 = $('pocus-video');
      const video2 = $('pocus-video-ivc');
      const label1 = document.querySelector('.pocus-video-item:nth-child(1) .pocus-video-label');
      const label2 = document.querySelector('.pocus-video-item:nth-child(2) .pocus-video-label');
      if (artType === 'sepsis1' && video1 && video2) {
        video1.innerHTML = `<source src="SS1-POCUS-Cardiac.mp4" type="video/mp4"><source src="SS1-POCUS-Cardiac.mov" type="video/quicktime">`;
        video2.innerHTML = `<source src="SS1-POCUS-IVC.mp4" type="video/mp4"><source src="SS1-POCUS-IVC.mov" type="video/quicktime">`;
        video1.load(); video2.load();
        if (label1) label1.textContent = 'Cardiac View';
        if (label2) label2.textContent = 'IVC View';
      }
      openModal('modal-pocus');
      if (video1) video1.play().catch(()=>{});
      if (video2) video2.play().catch(()=>{});
    }

    if (branch.showCodeBlue) {
        // Build the no-ROSC handler
        const noROSCHandler = () => showNoROSCScreen(branch.noROSCMsg || null);

        showCodeBlueModal(() => {
          // After ROSC, check for MICU transfer or show vitals
          if (branch.showMICUTransfer) {
            showMICUTransferModal(() => {
              showVitalsAndProceed(branch);
            });
          } else {
            showVitalsAndProceed(branch);
          }
        }, branch.codeBlueConfig || null, noROSCHandler);
      } 
      // Check if we should show MICU transfer modal
      else if (branch.showMICUTransfer) {
        showMICUTransferModal(() => {
          showVitalsAndProceed(branch);
        });
      } else {
        showVitalsAndProceed(branch);
      }
    });
  }
  
  const nextBtn = $('btn-next-decision');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextKey = nextBtn.dataset.next;
      renderPhase4_Decision(nextKey);
    });
  }
  
  // Handle case completion button
  const completeBtn = $('btn-complete-case');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      showCaseCompletionScreen();
    });
  }
  
  const restartBtn = $('btn-restart');
  if (restartBtn) restartBtn.addEventListener('click', () => { State.revealed = new Set(); State.decisions = []; renderPhase1_Vignette(); });
  const casesBtn = $('btn-cases');
  if (casesBtn) casesBtn.addEventListener('click', () => { State.reset(); showScreen('screen-cases'); });
  const homeBtn = $('btn-home');
  if (homeBtn) homeBtn.addEventListener('click', () => { State.reset(); showScreen('screen-home'); });
}

// ═══════════════════════════════════════════════════════════════
//  MEDICATION DISPLAY METADATA & HELPER
// ═══════════════════════════════════════════════════════════════

// Medication display metadata for realistic ICU formatting
const MED_DISPLAY_INFO = {
  'norepi': {
    dose: '4-20 mcg/min',
    route: 'IV continuous',
    indication: 'First-line vasopressor for septic shock',
    monitoring: 'Titrate to MAP ≥65 mm Hg'
  },
  'norepinephrine': {
    dose: '4-20 mcg/min',
    route: 'IV continuous',
    indication: 'First-line vasopressor for septic shock',
    monitoring: 'Titrate to MAP ≥65 mm Hg'
  },
  'vasopressin': {
    dose: '0.03-0.04 units/min',
    route: 'IV continuous',
    indication: 'Adjunct vasopressor (VASST trial)',
    monitoring: 'Fixed dose, do not titrate'
  },
  'epinephrine': {
    dose: '2-10 mcg/min',
    route: 'IV continuous',
    indication: 'Refractory shock',
    monitoring: 'Alpha and beta effects'
  },
  'epi': {
    dose: '2-10 mcg/min',
    route: 'IV continuous',
    indication: 'Refractory shock',
    monitoring: 'Alpha and beta effects'
  },
  'vancomycin': {
    dose: '15-20 mg/kg IV loading',
    route: 'IV intermittent',
    indication: 'Gram-positive coverage',
    monitoring: 'Trough goal 15-20 mcg/mL',
    renalNote: 'Dose adjust for CrCl <50: extend interval to q12-24h'
  },
  'vanco': {
    dose: '15-20 mg/kg IV loading',
    route: 'IV intermittent',
    indication: 'Gram-positive coverage',
    monitoring: 'Trough goal 15-20 mcg/mL',
    renalNote: 'Dose adjust for CrCl <50: extend interval to q12-24h'
  },
  'piperacillin': {
    dose: '3.375 g IV q6h',
    route: 'IV intermittent',
    indication: 'Broad-spectrum coverage',
    monitoring: 'Extended infusion if available',
    renalNote: 'CrCl <40: reduce to q8h; <20: q12h'
  },
  'pip-tazo': {
    dose: '3.375 g IV q6h',
    route: 'IV intermittent',
    indication: 'Broad-spectrum coverage',
    monitoring: 'Extended infusion if available',
    renalNote: 'CrCl <40: reduce to q8h; <20: q12h'
  },
  'pip': {
    dose: '3.375 g IV q6h',
    route: 'IV intermittent',
    indication: 'Broad-spectrum coverage',
    monitoring: 'Extended infusion if available',
    renalNote: 'CrCl <40: reduce to q8h; <20: q12h'
  },
  'ceftriaxone': {
    dose: '2 g IV q24h',
    route: 'IV intermittent',
    indication: 'Third-generation cephalosporin',
    monitoring: 'Once daily dosing'
  },
  'meropenem': {
    dose: '1-2 g IV q8h',
    route: 'IV intermittent',
    indication: 'Carbapenem for resistant organisms',
    monitoring: 'Extended infusion preferred',
    renalNote: 'CrCl <50: reduce dose or extend interval'
  },
  'heparin': {
    dose: '80 units/kg bolus, then 18 units/kg/hr',
    route: 'IV continuous',
    indication: 'Therapeutic anticoagulation',
    monitoring: 'PTT goal 60-80 sec, check q6h'
  },
  'lovenox': {
    dose: '1 mg/kg SC q12h',
    route: 'Subcutaneous',
    indication: 'Therapeutic anticoagulation',
    monitoring: 'Anti-Xa if needed',
    renalNote: 'CrCl <30: reduce to 1 mg/kg q24h'
  },
  'propofol': {
    dose: '5-50 mcg/kg/min',
    route: 'IV continuous',
    indication: 'Sedation',
    monitoring: 'Titrate to RASS -2 to -3'
  },
  'fentanyl': {
    dose: '25-100 mcg/hr or PRN',
    route: 'IV continuous or intermittent',
    indication: 'Analgesia and sedation',
    monitoring: 'Assess pain and respiratory status'
  },
  'midazolam': {
    dose: '1-5 mg/hr',
    route: 'IV continuous',
    indication: 'Sedation',
    monitoring: 'Titrate to RASS target'
  },
  'ketamine': {
    dose: '1-2 mg/kg IV bolus',
    route: 'IV push',
    indication: 'RSI induction agent',
    monitoring: 'Maintains hemodynamics'
  },
  'etomidate': {
    dose: '0.3 mg/kg IV bolus',
    route: 'IV push',
    indication: 'RSI induction agent',
    monitoring: 'Minimal hemodynamic effects'
  },
  'rocuronium': {
    dose: '1-1.2 mg/kg IV bolus',
    route: 'IV push',
    indication: 'Neuromuscular blockade for intubation',
    monitoring: 'Duration 45-60 minutes'
  },
  'vecuronium': {
    dose: '0.1 mg/kg IV bolus',
    route: 'IV push',
    indication: 'Neuromuscular blockade for intubation',
    monitoring: 'Duration 45-60 minutes'
  },
  'hydrocortisone': {
    dose: '50 mg IV q6h',
    route: 'IV push or short infusion',
    indication: 'Vasopressor-refractory shock',
    monitoring: 'Stress-dose steroids'
  },
  'steroid': {
    dose: '50 mg IV q6h',
    route: 'IV push or short infusion',
    indication: 'Vasopressor-refractory shock',
    monitoring: 'Stress-dose steroids'
  },
  'duoneb': {
    dose: 'Albuterol 2.5 mg + Ipratropium 0.5 mg',
    route: 'Nebulizer',
    indication: 'Bronchodilation',
    monitoring: 'Can repeat q4-6h PRN'
  },
  'albuterol': {
    dose: '2.5-5 mg',
    route: 'Nebulizer',
    indication: 'Bronchodilation',
    monitoring: 'Can repeat q4-6h PRN'
  },
  'azithromycin': {
    dose: '500 mg IV/PO daily',
    route: 'IV or PO',
    indication: 'Atypical coverage',
    monitoring: 'QTc prolongation risk'
  }
};

// Helper function to format medication display
function formatMedicationDisplay(order, medStatus) {
  const medInfo = MED_DISPLAY_INFO[order.id] || {};
  
  // Determine current rate/status
  let statusLine = '';
  if (medStatus) {
    statusLine = `Currently: ${medStatus.val} ${medStatus.unit}`;
  } else if (medInfo.dose) {
    statusLine = `Dose: ${medInfo.dose}`;
  } else {
    statusLine = 'Ordered and being administered';
  }
  
  // Build detail lines
  let detailLines = [];
  if (medInfo.route) detailLines.push(`Route: ${medInfo.route}`);
  if (medInfo.indication) detailLines.push(`Indication: ${medInfo.indication}`);
  if (medInfo.monitoring) detailLines.push(`Monitoring: ${medInfo.monitoring}`);
  
  let detailText = detailLines.join(' • ');
  if (!detailText) {
    detailText = 'Medication infusing per protocol.';
  }
  
  // Add renal dosing note if present
  let renalNote = medInfo.renalNote ? `<div style="margin-top:6px; padding:6px; background:var(--bg-3); border-left:3px solid var(--amber); font-size:11px; color:var(--tx-2);">
    <strong style="color:var(--amber);">⚠ Renal Dosing:</strong> ${medInfo.renalNote}
  </div>` : '';
  
  return { statusLine, detailText, renalNote };
}

function showVitalsAndProceed(branch) {
  // Build a full Phase 3-style reassessment page with vital signs and physical exam
  const c = State.caseData;
  
  // Use updated exam if branch provides it, otherwise use original
  const examSystems = branch.updatedExam || c.examSystems;
  
  // Store current exam systems in State so bindExamButtons can use them
  State.currentExamSystems = examSystems;
  
  // Reset revealed exam systems for reassessment
  State.revealed = new Set();
  
  // Special handling for rescue-fluid-only: inject actual fluid total into vitalsMsg
  let vitalsMsg = branch.vitalsMsg;
  if (c.id === 'cc-1' && branch.id === 'rescue-fluid-only') {
    const totalLiters = ((State.totalFluidGiven || 2500) / 1000).toFixed(1);
    vitalsMsg = `After receiving ${totalLiters}L total fluid, BP has improved slightly to 84/48 mm Hg (MAP 60 mm Hg). However, MAP remains <65 mm Hg despite adequate fluid.<br/><br/>
    RN: <em>"We've now given ${totalLiters} liters total. His pressure is a little better but still low. What do you want to do next?"</em>`;
  }
  vitalsMsg = resolveTokens(vitalsMsg);
  
  // Build objective labs/imaging section from recognized orders
  let objectiveSection = '';
  let treatmentSection = '';
  
  // For Case 3, extract ABG values from nextVitals and create an ABG card
  const caseId = State.caseData?.id;
  if (caseId === 'cc-3' && branch.nextVitals) {
    const abgValues = {};
    branch.nextVitals.forEach(v => {
      if (v.lbl === 'pH') abgValues.pH = v.val;
      if (v.lbl === 'PaCO2') abgValues.PaCO2 = v.val;
      if (v.lbl === 'PaO2') abgValues.PaO2 = v.val;
      if (v.lbl === 'HCO3') abgValues.HCO3 = v.val;
      if (v.lbl === 'SaO2' || v.lbl === 'SaO₂') abgValues.SaO2 = v.val;
    });
    
    // Only create ABG card if we have ABG values
    if (Object.keys(abgValues).length > 0) {
      // Get FiO2 from ventilator settings or vitals
      const fio2Vital = branch.nextVitals.find(v => v.lbl === 'FiO2' || v.lbl === 'FiO₂');
      const fio2Label = fio2Vital ? `Ventilator FiO₂ ${fio2Vital.val}` : 'Ventilator';
      
      const abgCard = `
        <div class="objective-item unlocked">
          <div class="objective-item-header">
            <span class="objective-item-name">ABG (${fio2Label})</span>
            <span class="objective-item-badge" style="color:var(--green)">✓ Result</span>
          </div>
          <div class="objective-item-result">
            <div class="result-grid">
              <div class="result-row">
                <div class="rr-label">pH</div>
                <div class="rr-value ${parseFloat(abgValues.pH) < 7.35 ? 'vc' : 'vn'}">${abgValues.pH || '—'}</div>
                <div class="rr-ref">7.35-7.45</div>
              </div>
              <div class="result-row">
                <div class="rr-label">PaCO₂</div>
                <div class="rr-value ${parseFloat(abgValues.PaCO2) > 45 ? 'vc' : 'vn'}">${abgValues.PaCO2 || '—'}</div>
                <div class="rr-ref">35-45 mm Hg</div>
              </div>
              <div class="result-row">
                <div class="rr-label">PaO₂</div>
                <div class="rr-value ${parseFloat(abgValues.PaO2) < 80 ? 'vw' : 'vn'}">${abgValues.PaO2 || '—'}</div>
                <div class="rr-ref">80-100 mm Hg</div>
              </div>
              <div class="result-row">
                <div class="rr-label">HCO₃⁻</div>
                <div class="rr-value vn">${abgValues.HCO3 || '—'}</div>
                <div class="rr-ref">22-26 mEq/L</div>
              </div>
              ${abgValues.SaO2 ? `
                <div class="result-row">
                  <div class="rr-label">SaO₂</div>
                  <div class="rr-value vn">${abgValues.SaO2}</div>
                  <div class="rr-ref">≥95%</div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      
      objectiveSection = abgCard;
    }
  }
  
  if (State.recognizedOrders && State.recognizedOrders.length > 0) {
    // Separate medications from labs/imaging
    const medications = State.recognizedOrders.filter(order => order.cat === 'med');
    const labsImaging = State.recognizedOrders.filter(order => order.cat !== 'med');
    
    // Build treatment section for medications (no unlock needed)
    if (medications.length > 0) {
      const treatmentItems = medications.map((order, idx) => {
        // Get medication status from vitals if present
        const medStatus = branch.nextVitals?.find(v => 
          v.lbl?.toLowerCase().includes(order.id) || 
          (order.id === 'norepi' && v.lbl === 'Norepi') ||
          (order.id === 'vasopressin' && v.lbl === 'Vasopressin')
        );
        
        // Use helper function to format medication
        const { statusLine, detailText, renalNote } = formatMedicationDisplay(order, medStatus);
        
        return `
          <div class="treatment-item">
            <div class="treatment-name">${order.name}</div>
            <div class="treatment-status">${statusLine}</div>
            <div class="treatment-detail">${detailText}</div>
            ${renalNote}
          </div>
        `;
      }).join('');
      
      treatmentSection = treatmentItems;
    }
    
    // Add ventilator settings to treatment section if patient is intubated
    if (State.ventilatorSettings) {
      const ventSettings = State.ventilatorSettings;
      const ventItem = `
        <div class="treatment-item" style="background:linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%); border:2px solid var(--cyan); border-radius:8px; padding:16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div class="treatment-name" style="font-size:16px; font-weight:700; color:var(--cyan); margin-bottom:4px;">🫁 Mechanical Ventilator</div>
          <div class="treatment-status" style="color:var(--tx-2); font-size:13px; margin-bottom:12px;">Patient intubated and mechanically ventilated</div>
          <table class="vitals-tbl" style="width:100%; margin-top:0;">
            <thead>
              <tr>
                <th style="text-align:left;">Parameter</th>
                <th style="text-align:left;">Value</th>
                <th style="text-align:left;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mode</td>
                <td class="vn">${ventSettings.mode}</td>
                <td>Volume control</td>
              </tr>
              <tr>
                <td>Tidal Volume</td>
                <td class="vn">${ventSettings.vt}</td>
                <td>Lung-protective</td>
              </tr>
              <tr>
                <td>Respiratory Rate</td>
                <td class="vn">${ventSettings.rr}</td>
                <td>breaths/min</td>
              </tr>
              <tr>
                <td>PEEP</td>
                <td class="vn">${ventSettings.peep} cm H₂O</td>
                <td>Optimal for ARDS</td>
              </tr>
              <tr>
                <td>FiO₂</td>
                <td class="vw">${ventSettings.fio2}</td>
                <td>High oxygen</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      // Add ventilator at the beginning of treatment section
      treatmentSection = ventItem + (treatmentSection || '');
    }
    
    // Add procedures (central line, arterial line) to treatment section
    const procedures = State.recognizedOrders.filter(order => 
      order.cat === 'procedure' && (order.id === 'central-line' || order.id === 'arterial-line')
    );
    
    if (procedures.length > 0) {
      const procedureItems = procedures.map(proc => {
        const procDisplay = {
          'central-line': {
            emoji: '🔌',
            name: 'Central Venous Catheter',
            status: 'Placed and secured',
            detail: 'Triple-lumen catheter inserted. All ports functional. Sterile dressing applied.'
          },
          'arterial-line': {
            emoji: '📊',
            name: 'Arterial Line',
            status: 'Placed and transduced',
            detail: 'Radial arterial catheter inserted. Continuous BP monitoring active. Waveform adequate.'
          }
        };
        
        const info = procDisplay[proc.id];
        
        return `
          <div class="treatment-item" style="background:linear-gradient(135deg, var(--bg-2) 0%, var(--bg-3) 100%); border:2px solid var(--green); border-radius:8px; padding:16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div class="treatment-name" style="font-size:16px; font-weight:700; color:var(--green); margin-bottom:4px;">${info.emoji} ${info.name}</div>
            <div class="treatment-status" style="color:var(--tx-2); font-size:13px; margin-bottom:8px;">${info.status}</div>
            <div class="treatment-detail" style="color:var(--tx-3); font-size:12px;">${info.detail}</div>
          </div>
        `;
      }).join('');
      
      // Add procedures after ventilator but before medications
      treatmentSection = procedureItems + (treatmentSection || '');
    }
    
    // Build objective section for labs/imaging (with unlock)
    if (labsImaging.length > 0) {
      const labItems = labsImaging.map((order, idx) => {
        const isUnlocked = State.unlockedResults.has(order.id);
        const uniqueId = `result-${order.id}-${idx}`;
        
        if (isUnlocked) {
          // Show the actual result
          return `
            <div class="objective-item unlocked" id="${uniqueId}">
              <div class="objective-item-header">
                <span class="objective-item-name">${order.name}</span>
                <span class="objective-item-badge" style="color:var(--green)">✓ Unlocked</span>
              </div>
              <div class="objective-item-result">
                ${order.card ? order.card('', State.caseData?.id) : '<div class="result-pending">Result not available</div>'}
              </div>
            </div>
          `;
        } else {
          // Show locked state
          return `
            <div class="objective-item locked" id="${uniqueId}">
              <div class="objective-item-header">
                <span class="objective-item-name">${order.name}</span>
                <button class="btn btn--sm btn--secondary unlock-btn" data-order-id="${order.id}" data-item-id="${uniqueId}">
                  🔒 Unlock
                </button>
              </div>
            </div>
          `;
        }
      }).join('');
      
      objectiveSection = labItems;
    }
  }
  
  // Update vitals with oxygen device if ordered, and filter out vent settings
  let displayVitals = branch.nextVitals;
  
  // If patient is intubated, remove ventilator settings from vitals (they'll show in treatment section)
  if (State.ventilatorSettings && displayVitals) {
    displayVitals = displayVitals.filter(v => {
      const ventLabels = ['Mode', 'VT', 'RR', 'PEEP', 'FiO2', 'FiO₂', 'Pplat'];
      return !ventLabels.includes(v.lbl);
    });
  }
  
  // For Case 3, also remove ABG values from vitals (they'll show in labs section)
  if (caseId === 'cc-3' && displayVitals) {
    displayVitals = displayVitals.filter(v => {
      const abgLabels = ['pH', 'PaCO2', 'PaO2', 'HCO3', 'SaO2', 'SaO₂'];
      return !abgLabels.includes(v.lbl);
    });
  }
  
  if (State.currentOxygenDevice && displayVitals) {
    displayVitals = displayVitals.map(v => {
      if (v.lbl === 'SpO₂' || v.lbl === 'SpO2') {
        // Update oxygen device in unit field
        let deviceText = v.unit;
        let newSpO2 = v.val;
        const caseId = State.caseData?.id;
        
        if (State.currentOxygenDevice === 'HFNC') {
          deviceText = 'HFNC 60L';
          // Improve SpO2 for Cases 1 and 2 when HFNC is used
          if (caseId === 'cc-1' || caseId === 'cc-2') {
            // Parse current SpO2 value
            const currentSpO2 = parseInt(v.val);
            if (!isNaN(currentSpO2) && currentSpO2 < 94) {
              // Improve to 94-96% with HFNC
              newSpO2 = '94%';
            }
          }
        } else if (State.currentOxygenDevice === 'BiPAP') {
          deviceText = 'BiPAP';
        } else if (State.currentOxygenDevice === 'NC') {
          deviceText = '6L NC';
        } else if (State.currentOxygenDevice === 'NRB') {
          deviceText = 'NRB 15L';
        }
        return { ...v, val: newSpO2, unit: deviceText };
      }
      return v;
    });
  }
  
  $('sim-content').innerHTML = `
    ${patientStrip()}
    <div class="sim-card">
      <div class="sim-card-head">
        <span class="phase-badge pb-action">Bedside Reassessment</span>
        <span class="sim-card-title">30 Minutes After Intervention</span>
      </div>
      <div class="sim-card-body">
        
        <!-- Top row: Vitals (left) and Labs/Imaging (right) -->
        <div class="reassessment-grid">
          <div class="reassessment-col">
            <div class="sec-lbl">Updated Vital Signs</div>
            ${vitalsTable(displayVitals)}
          </div>
          
          ${objectiveSection ? `
            <div class="reassessment-col">
              <div class="sec-lbl">Objective Labs/Imaging</div>
              <div class="objective-results-container">
                ${objectiveSection}
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Bottom row: Treatment (full width) -->
        ${treatmentSection ? `
          <div style="margin-top:20px;">
            <div class="sec-lbl">Treatment</div>
            <div class="treatment-container">
              ${treatmentSection}
            </div>
          </div>
        ` : ''}
        
        <div class="mt-20">
          <div class="vignette" style="padding:16px;background:var(--bg-3);border-left:3px solid var(--cyan);border-radius:var(--r-sm);">
            ${vitalsMsg}
          </div>
        </div>
        
        <div class="mt-20">
          <div class="sec-lbl">Physical Examination — Tap a system to examine</div>
          ${examGrid(examSystems)}
        </div>
        
        <div class="btn-row">
          <button class="btn btn--primary" id="btn-proceed-decision2" data-next="${branch.nextDecision || ''}">Proceed to Next Orders →</button>
        </div>
      </div>
    </div>
  `;
  
  // Bind exam buttons
  bindExamButtons();
  
  // Bind unlock buttons for objective results
  bindUnlockButtons();
  
  // Scroll to top of new content
  const content = $('sim-content');
  if (content) {
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Bind the proceed button
  setTimeout(() => {
    const proceedBtn = $('btn-proceed-decision2');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        const nextKey = proceedBtn.dataset.next;
        if (nextKey) {
          renderPhase4_Decision(nextKey);
        } else {
          // No next decision - show completion screen
          showCaseCompletionScreen();
        }
      });
    }
  }, 100);
}

function bindUnlockButtons() {
  const unlockBtns = document.querySelectorAll('.unlock-btn');
  unlockBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = e.target.dataset.orderId;
      const itemId = e.target.dataset.itemId;
      
      // Mark as unlocked
      State.unlockedResults.add(orderId);
      
      // Find the order to get its result
      const order = State.recognizedOrders.find(o => o.id === orderId);
      if (!order) return;
      
      // Replace the locked item with unlocked content
      const itemEl = document.getElementById(itemId);
      if (itemEl) {
        itemEl.className = 'objective-item unlocked';
        itemEl.innerHTML = `
          <div class="objective-item-header">
            <span class="objective-item-name">${order.name}</span>
            <span class="objective-item-badge" style="color:var(--green)">✓ Unlocked</span>
          </div>
          <div class="objective-item-result">
            ${order.card ? order.card('', State.caseData?.id) : '<div class="result-pending">Result not available</div>'}
          </div>
        `;
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  CODE BLUE MODAL (Case 2)
// ═══════════════════════════════════════════════════════════════

function showCodeBlueModal(onROSC, config, onNoROSC) {

  // ── defaults (backward-compatible with CC-2 existing calls) ──
  const cfg = Object.assign({
    rhythm:        'Pulseless Electrical Activity (PEA)',
    overhead:      'Code Blue, ICU Bed 12. Code Blue, ICU Bed 12.',
    cause:         'Hemodynamic collapse from untreated shock',
    hs_ts:         ['Hypovolemia', 'Hypoxia', 'Hydrogen ion (acidosis)', 'Hypo/Hyperkalemia',
                    'Tension pneumothorax', 'Thrombosis (PE)', 'Tamponade', 'Toxins'],
    acls_specifics: ['Treat the underlying cause of arrest (H\'s and T\'s)'],
    monitor_phrase: 'Look at the monitor — the patient has lost pulse.',
    rosc_label:    '✓ ROSC Achieved — Return of Spontaneous Circulation →'
  }, config || {});

  const isVFib = cfg.rhythm.toLowerCase().includes('vfib') ||
                 cfg.rhythm.toLowerCase().includes('ventricular fibrillation') ||
                 cfg.rhythm.toLowerCase().includes('vf ') ||
                 cfg.rhythm.toLowerCase().includes('pulseless vt');

  const rhythmColor = isVFib ? 'var(--amber)' : 'var(--red)';
  const rhythmIcon  = isVFib ? '⚡' : '📉';

  const hsTsHtml = cfg.hs_ts.map(h =>
    `<li style="margin:3px 0;">${h}</li>`
  ).join('');

  const specificsHtml = cfg.acls_specifics.map(s =>
    `<li style="margin:3px 0;color:var(--amber);">${s}</li>`
  ).join('');

  const modal = CE('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-code-blue';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:620px;max-height:90vh;overflow-y:auto;">

      <!-- HEADER -->
      <div class="modal-head" style="background:var(--red-bg);border-color:var(--red);padding:20px 24px;">
        <div style="display:flex;align-items:center;gap:14px;width:100%;">
          <div style="width:56px;height:56px;flex-shrink:0;border-radius:50%;background:var(--red-bg);border:3px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:26px;animation:cb-pulse 1.2s ease-in-out infinite;">⚠️</div>
          <div>
            <div style="font-family:var(--font-h);font-size:11px;font-weight:700;letter-spacing:2px;color:var(--red);margin-bottom:4px;">🚨 CRITICAL EVENT</div>
            <div style="font-family:var(--font-h);font-size:22px;font-weight:700;color:var(--red);line-height:1.1;">CODE BLUE</div>
            <div style="font-size:13px;color:var(--tx-2);margin-top:2px;">Patient in Cardiac Arrest</div>
          </div>
        </div>
      </div>

      <div class="modal-body" style="padding:20px 24px;display:flex;flex-direction:column;gap:16px;">

        <!-- OVERHEAD PAGE -->
        <div style="background:var(--bg-3);border-left:4px solid var(--red);border-radius:6px;padding:14px 16px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--red);margin-bottom:6px;">📢 OVERHEAD PAGE</div>
          <div style="font-style:italic;color:var(--tx-1);font-size:14px;line-height:1.5;">"${cfg.overhead}"</div>
        </div>

        <!-- MONITOR ALERT -->
        <div style="background:var(--bg-3);border:2px solid ${rhythmColor};border-radius:8px;padding:14px 16px;text-align:center;">
          <div style="font-size:28px;margin-bottom:6px;">${rhythmIcon}</div>
          <div style="font-family:var(--font-h);font-size:15px;font-weight:700;color:${rhythmColor};margin-bottom:4px;">${cfg.monitor_phrase}</div>
          <div style="display:inline-block;background:var(--bg);border:1px solid ${rhythmColor};border-radius:4px;padding:6px 16px;font-family:var(--font-mono);font-size:13px;color:${rhythmColor};font-weight:600;margin-top:4px;">${cfg.rhythm}</div>
        </div>

        <!-- CAUSE -->
        ${cfg.cause ? `
        <div style="background:var(--bg-3);border-left:4px solid var(--amber);border-radius:6px;padding:12px 16px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--amber);margin-bottom:4px;">ROOT CAUSE</div>
          <div style="font-size:13px;color:var(--tx-1);">${cfg.cause}</div>
        </div>` : ''}

        <!-- ACLS ALGORITHM -->
        <div style="background:var(--bg-3);border-radius:8px;padding:16px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--cyan);margin-bottom:12px;">⚡ ACLS ALGORITHM — YOU ARE RUNNING THE CODE</div>

          <!-- CPR -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div style="background:var(--bg);border:1px solid var(--bd);border-radius:6px;padding:10px 12px;">
              <div style="font-size:10px;font-weight:700;color:var(--red);letter-spacing:1px;margin-bottom:4px;">CPR</div>
              <div style="font-size:12px;color:var(--tx-1);line-height:1.6;">Rate: <strong>100–120/min</strong><br/>Depth: <strong>≥2 inches</strong><br/>Full chest recoil<br/>Minimize interruptions</div>
            </div>
            <div style="background:var(--bg);border:1px solid var(--bd);border-radius:6px;padding:10px 12px;">
              <div style="font-size:10px;font-weight:700;color:var(--amber);letter-spacing:1px;margin-bottom:4px;">AIRWAY</div>
              <div style="font-size:12px;color:var(--tx-1);line-height:1.6;">BVM ventilation<br/>Ratio: <strong>30:2</strong> (no airway)<br/>or <strong>continuous CPR</strong> + 1 breath/6 sec (advanced airway)<br/>ETCO₂ target: >10 mm Hg</div>
            </div>
          </div>

          <!-- Rhythm-specific steps -->
          ${isVFib ? `
          <div style="background:rgba(233,165,53,0.1);border:1px solid var(--amber);border-radius:6px;padding:12px 14px;margin-bottom:10px;">
            <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:8px;">⚡ SHOCKABLE RHYTHM — VFib / Pulseless VT</div>
            <div style="font-size:12px;color:var(--tx-1);line-height:1.8;">
              1. <strong>Defibrillate immediately</strong> — 200J biphasic (or max monophasic)<br/>
              2. Resume CPR immediately × 2 min, then reassess<br/>
              3. IV/IO access → <strong>Epinephrine 1 mg IV q3–5 min</strong><br/>
              4. <strong>Amiodarone 300 mg IV</strong> (first dose) — after 2nd shock if refractory<br/>
              5. Amiodarone 150 mg IV (second dose if needed)<br/>
              6. Reassess rhythm after each 2-min CPR cycle
            </div>
          </div>
          ` : `
          <div style="background:rgba(224,79,79,0.1);border:1px solid var(--red);border-radius:6px;padding:12px 14px;margin-bottom:10px;">
            <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:8px;">📉 NON-SHOCKABLE RHYTHM — PEA / Asystole</div>
            <div style="font-size:12px;color:var(--tx-1);line-height:1.8;">
              1. <strong>CPR immediately</strong> — do NOT defibrillate<br/>
              2. <strong>Epinephrine 1 mg IV q3–5 min</strong> — give ASAP<br/>
              3. No routine role for atropine in PEA<br/>
              4. Reassess rhythm every 2 min<br/>
              5. <strong>Treat reversible causes (H's and T's)</strong> — this is the key intervention
            </div>
          </div>
          `}

          <!-- H's and T's -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
            <div style="background:var(--bg);border:1px solid var(--bd);border-radius:6px;padding:10px 12px;">
              <div style="font-size:10px;font-weight:700;color:var(--cyan);letter-spacing:1px;margin-bottom:6px;">H's & T's — REVERSIBLE CAUSES</div>
              <ul style="margin:0;padding-left:16px;font-size:12px;color:var(--tx-1);line-height:1.7;">
                ${hsTsHtml}
              </ul>
            </div>
            <div style="background:var(--bg);border:1px solid var(--amber);border-radius:6px;padding:10px 12px;">
              <div style="font-size:10px;font-weight:700;color:var(--amber);letter-spacing:1px;margin-bottom:6px;">THIS CASE — KEY INTERVENTION</div>
              <ul style="margin:0;padding-left:16px;font-size:12px;line-height:1.7;">
                ${specificsHtml}
              </ul>
            </div>
          </div>

          <!-- Post-ROSC -->
          <div style="background:rgba(63,157,224,0.08);border:1px solid var(--cyan);border-radius:6px;padding:10px 14px;">
            <div style="font-size:10px;font-weight:700;color:var(--cyan);letter-spacing:1px;margin-bottom:6px;">POST-ROSC CARE</div>
            <div style="font-size:12px;color:var(--tx-1);line-height:1.7;">
              Target <strong>SBP ≥90</strong> · <strong>SpO₂ 92–98%</strong> · <strong>MAP ≥65</strong><br/>
              12-lead ECG immediately (rule out STEMI)<br/>
              Consider targeted temperature management (TTM) if comatose<br/>
              Treat the cause that led to arrest
            </div>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="modal-foot" style="padding:16px 24px;display:flex;flex-direction:column;gap:10px;">
        <button class="btn btn--primary btn--full" id="code-blue-rosc" style="background:var(--green);border-color:var(--green);font-size:16px;padding:14px;letter-spacing:0.5px;">
          ${cfg.rosc_label}
        </button>
        <button class="btn btn--full" id="code-blue-no-rosc" style="background:var(--red-bg);border:2px solid var(--red);color:var(--red);font-size:14px;padding:12px;border-radius:var(--r-sm);cursor:pointer;font-family:var(--font-h);font-weight:600;letter-spacing:0.5px;">
          ✗ ROSC Not Achieved — Case Concluded
        </button>
      </div>
    </div>
  `;

  // Pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cb-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(224,79,79,0.4); }
      50% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(224,79,79,0); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(modal);
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    modal.remove();
    style.remove();
  };

  setTimeout(() => {
    const roscBtn = $('code-blue-rosc');
    if (roscBtn) {
      roscBtn.addEventListener('click', () => {
        closeModal();
        if (onROSC) onROSC();
      });
    }
    const noRoscBtn = $('code-blue-no-rosc');
    if (noRoscBtn) {
      noRoscBtn.addEventListener('click', () => {
        closeModal();
        if (onNoROSC) {
          onNoROSC();
        } else {
          showNoROSCScreen();
        }
      });
    }
  }, 100);
}

// ═══════════════════════════════════════════════════════════════
//  NO-ROSC TERMINAL SCREEN
// ═══════════════════════════════════════════════════════════════

function showNoROSCScreen(customMsg) {
  const c = State.caseData;
  const content = $('sim-content');
  if (!content) return;

  const msg = customMsg || `Despite prolonged resuscitation efforts, return of spontaneous circulation was not achieved. The team called the code after ${c?.patient?.name || 'the patient'} did not respond to ACLS interventions.`;

  content.innerHTML = `
    ${patientStrip()}
    <div class="sim-card">
      <div class="sim-card-head">
        <span class="phase-badge" style="background:var(--red-bg);color:var(--red);border-color:var(--red);">CODE BLUE — OUTCOME</span>
        <span class="sim-card-title" style="color:var(--red);">ROSC Not Achieved</span>
      </div>
      <div class="sim-card-body">
        <div class="end-box" style="border-color:var(--red);">
          <div class="end-icon" style="background:var(--red-bg);border-color:var(--red);color:var(--red);">✗</div>
          <div class="end-title" style="color:var(--red);">Case Concluded</div>
          <div class="end-text">${msg}</div>

          <div style="background:var(--bg-3);border-left:4px solid var(--red);border-radius:6px;padding:16px;margin:16px 0;text-align:left;">
            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--red);margin-bottom:10px;">DEBRIEF — WHAT LED TO THIS OUTCOME</div>
            <div style="font-size:13px;color:var(--tx-1);line-height:1.8;">
              <strong>Root cause:</strong> Inadequate initial sepsis management allowed progressive hemodynamic collapse.<br/><br/>
              The sepsis bundle must be initiated simultaneously — not sequentially:<br/>
              <ul style="margin:8px 0 0 18px;padding:0;line-height:1.9;">
                <li><strong>Blood cultures × 2</strong> before antibiotics</li>
                <li><strong>Lactate level</strong> — confirms hypoperfusion, guides resuscitation</li>
                <li><strong>30 mL/kg IV crystalloid</strong> within the first 3 hours</li>
                <li><strong>Broad-spectrum IV antibiotics</strong> within 1 hour of recognition</li>
                <li><strong>Vasopressor</strong> if MAP <65 despite adequate fluids</li>
              </ul>
              <br/>
              <span style="color:var(--amber);">Every hour of antibiotic delay in sepsis increases mortality by ~7–10%.</span>
            </div>
          </div>

          <div style="background:var(--bg-3);border-left:4px solid var(--cyan);border-radius:6px;padding:14px 16px;margin-bottom:16px;text-align:left;">
            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--cyan);margin-bottom:8px;">ACLS PEARL — PULSELESS SEPTIC PATIENT</div>
            <div style="font-size:12px;color:var(--tx-1);line-height:1.8;">
              In PEA arrest from septic shock, <strong>treating the underlying cause</strong> is the only definitive intervention.<br/>
              Epinephrine q3–5 min maintains perfusion pressure, but survival depends on:<br/>
              <ul style="margin:6px 0 0 18px;padding:0;line-height:1.8;">
                <li>IV antibiotics started <em>during</em> resuscitation</li>
                <li>Aggressive volume resuscitation during CPR</li>
                <li>Identification and reversal of H's and T's</li>
                <li>High-quality CPR: rate 100–120/min, depth ≥2 inches</li>
              </ul>
            </div>
          </div>

          <div class="btn-row" style="justify-content:center;">
            <button class="btn btn--primary" id="btn-restart-nrosc">Restart Case</button>
            <button class="btn btn--secondary" id="btn-cases-nrosc">Select Another Case</button>
            <button class="btn btn--secondary" id="btn-home-nrosc">Return Home</button>
          </div>
        </div>
      </div>
    </div>
  `;

  buildPhaseTrack(5, 4);

  const r = $('btn-restart-nrosc');
  if (r) r.addEventListener('click', () => { State.revealed = new Set(); State.decisions = []; renderPhase1_Vignette(); });
  const ca = $('btn-cases-nrosc');
  if (ca) ca.addEventListener('click', () => { State.reset(); renderCaseList(); showScreen('screen-cases'); });
  const h = $('btn-home-nrosc');
  if (h) h.addEventListener('click', () => { State.reset(); showScreen('screen-home'); });

  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════════════════════
//  MICU TRANSFER MODAL
// ═══════════════════════════════════════════════════════════════

function showMICUTransferModal(onContinue) {
  const modal = CE('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-micu-transfer';
  modal.innerHTML = `
    <div class="modal-box modal-sm">
      <div class="modal-head">
        <div>
          <span class="modal-tag">CARE TRANSITION</span>
          <h3 class="modal-title">Transfer to Medical ICU</h3>
        </div>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:var(--cyan-bg);border:2px solid var(--cyan);display:flex;align-items:center;justify-content:center;font-size:28px;">🏥</div>
          <div style="font-family:var(--font-h);font-size:19px;font-weight:700;color:var(--tx-1);margin-bottom:8px;">Patient Transferred to MICU</div>
          <div style="font-size:13px;color:var(--tx-2);line-height:1.7;">
            You are now part of the <strong style="color:var(--cyan);">Medical Intensive Care Unit team</strong>. This patient requires ICU-level monitoring and intervention.<br/><br/>
            Continue managing the patient's shock state with fluid resuscitation, vasopressor titration, labs, and supportive care.
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn--primary btn--full" id="micu-continue">Continue MICU Care →</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    const continueBtn = $('micu-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        modal.remove();
        if (onContinue) onContinue();
      });
    }
  }, 100);
}

// ═══════════════════════════════════════════════════════════════
//  RN MODAL
// ═══════════════════════════════════════════════════════════════

function showRNMsg(title, msg, tag = 'RN MESSAGE') {
  $('rn-tag').textContent = tag;
  $('rn-title').textContent = title;
  $('rn-body').innerHTML = `<div class="rn-from">Notification</div><div>${msg}</div>`;
  openModal('modal-rn');
}

// ═══════════════════════════════════════════════════════════════
//  APP INIT
// ═══════════════════════════════════════════════════════════════

function init() {
  // Critical Care module card
  const criticalCard = document.querySelector('.module-card--active[data-module="critical"]');
  if (criticalCard) {
    const go = () => {
      State.activeModule = 'critical';
      updateCasesHeader();
      renderCaseList();
      showScreen('screen-cases');
    };
    criticalCard.addEventListener('click', go);
    criticalCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }});
  }

  // Sepsis module card
  const sepsisCard = document.querySelector('.module-card--active[data-module="sepsis"]');
  if (sepsisCard) {
    const go = () => {
      State.activeModule = 'sepsis';
      updateCasesHeader();
      renderCaseList();
      showScreen('screen-cases');
    };
    sepsisCard.addEventListener('click', go);
    sepsisCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }});
  }

  // Nav buttons
  $('back-to-home').addEventListener('click', () => { State.reset(); showScreen('screen-home'); });
  $('back-to-cases').addEventListener('click', () => { State.reset(); renderCaseList(); showScreen('screen-cases'); });

  // Modal controls
  $('close-rn').addEventListener('click', () => closeModal('modal-rn'));
  $('rn-ok').addEventListener('click', () => closeModal('modal-rn'));
  $('close-branch').addEventListener('click', () => closeModal('modal-branch'));
  $('branch-ok').addEventListener('click', () => closeModal('modal-branch'));
  $('close-pocus').addEventListener('click', () => {
    closeModal('modal-pocus');
    const video1 = $('pocus-video');
    const video2 = $('pocus-video-ivc');
    if (video1) video1.pause();
    if (video2) video2.pause();
  });
  $('pocus-ok').addEventListener('click', () => {
    closeModal('modal-pocus');
    const video1 = $('pocus-video');
    const video2 = $('pocus-video-ivc');
    if (video1) video1.pause();
    if (video2) video2.pause();
  });

  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeAllModals(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });
}

function updateCasesHeader() {
  const isSepsis = State.activeModule === 'sepsis';
  const eyebrow = document.querySelector('.cases-eyebrow');
  const title   = document.querySelector('.cases-title');
  const sub     = document.querySelector('.cases-sub');
  const bc      = document.querySelector('#screen-cases .breadcrumb span');
  if (eyebrow) eyebrow.textContent = isSepsis ? 'SEPSIS SIMULATION · PGY-1' : 'CRITICAL CARE SIMULATION · Simulation';
  if (title)   title.textContent   = isSepsis ? 'Choose a Scenario'         : 'Choose a Scenario';
  if (sub)     sub.textContent     = isSepsis
    ? 'Three sepsis scenarios focused on early recognition, antibiotic selection, vasopressors, and escalation decisions.'
    : 'Your management decisions create different patient responses. There are multiple possible pathways through each case.';
  if (bc)      bc.textContent      = isSepsis ? 'Sepsis'                    : 'Critical Care';
}

document.addEventListener('DOMContentLoaded', init);
