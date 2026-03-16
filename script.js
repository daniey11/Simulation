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
          headline: 'Critical interventions missing',
          narrative: `You ordered diagnostic studies but did not address the immediate hemodynamic instability. The patient's condition is worsening.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',    val: '136',   unit: 'bpm',    st: 'vc' },
            { lbl: 'BP',    val: '68/34', unit: 'mm Hg',  st: 'vc' },
            { lbl: 'MAP',   val: '45',    unit: 'mm Hg',  st: 'vc' },
            { lbl: 'SpO₂',  val: '87%',   unit: '10L NRB',st: 'vc' },
            { lbl: 'GCS',   val: '8',     unit: '/15',    st: 'vc' },
            { lbl: 'UO',    val: '0 mL',  unit: 'last hr',st: 'vc' },
          ],
          vitalsMsg: `The patient is rapidly deteriorating. MAP 45 mm Hg. HR 136. GCS 8 — unresponsive. Anuria developed.<br/><br/>RN calls overhead: <em>"Urgent! BP is crashing and patient is unresponsive. We need help NOW!"</em>`,
          nextDecision: null,
          endState: 'bad',
          endMsg: `<strong>Critical Management Failure:</strong><br/>
          • Patient presented with shock (MAP <65) but hemodynamic support was not initiated<br/>
          • Diagnostic tests alone do not treat shock<br/>
          • Immediate priorities: 30 mL/kg fluid bolus, norepinephrine if MAP remains <65, MICU consultation<br/>
          • Delayed resuscitation leads to irreversible end-organ damage<br/><br/>
          <strong>Remember:</strong> "Time is tissue" — hemodynamic stabilization cannot wait for lab results. Treat shock aggressively and immediately.`,
          decisions: ['Failed to initiate hemodynamic support', 'Critical delay in resuscitation', 'Review shock management priorities'],
          updatedExam: [
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'<span class="hl">Severely altered. GCS 8. Unresponsive to voice, responds only to painful stimuli.</span>' },
            { icon:'👁️', lbl:'General', key:'gen',     text:'Critically ill-appearing. Cold, mottled skin. Cyanotic.' },
            { icon:'👄', lbl:'HEENT',   key:'heent',   text:'Dry mucous membranes. Flat neck veins.' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Severe tachycardia (HR 136). Weak, thready pulses. Cold extremities.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Crackles right lower lobe. Shallow, rapid breathing.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Distended, rigid (concerning for bowel ischemia in shock).' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'<span class="hl">Cold, mottled extremities. No palpable peripheral pulses. Cap refill >5 sec.</span>' }
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
            { lbl: 'HR',    val: '105',       unit: 'bpm',      st: 'va' },
            { lbl: 'BP',    val: '92/54',     unit: 'mm Hg',    st: 'va' },
            { lbl: 'SpO2',  val: '94%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'va' },
            { lbl: 'GCS',   val: '13/15',     unit: '',         st: 'va' },
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
          label: '⚠ INAPPROPRIATE TIDAL VOLUME',
          type: 'bad',
          triggers: ['intubat','rsi','8 ml/kg','430','450','500','high tidal'],
          requires: 2,
          excludes: ['6 ml/kg','328','330','pbw','lung protective'],
          headline: 'High tidal volume ordered — volutrauma risk',
          narrative: `You intubated but ordered <span class="hl">high tidal volume</span> based on actual body weight instead of PBW.<br/><br/>
          You ordered VT 430 mL (6 mL/kg × 72 kg actual weight).<br/><br/>
          <strong>Common error:</strong> Tidal volume must be based on <span class="hl">Predicted Body Weight (PBW)</span>.<br/>
          For 5'4" female: PBW = 45.5 + 2.3 × (64 − 60) = <span class="hl">54.7 kg</span><br/>
          Correct VT = 6 × 54.7 = <span class="hl">328 mL</span><br/><br/>
          Post-intubation: Plateau pressure 34 cm H₂O (dangerously high). Ventilator alarming "high pressure."`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'VT',    val: '430 mL',    unit: '7.9 mL/kg',st: 'vc' },
            { lbl: 'Pplat', val: '34',        unit: 'cm H2O',   st: 'vc' },
            { lbl: 'SpO2',  val: '85%',       unit: 'FiO2 100%',st: 'vc' },
            { lbl: 'BP',    val: '82/48',     unit: 'mm Hg',    st: 'vc' },
          ],
          vitalsMsg: `<strong>Key learning:</strong> ARDS requires lung-protective ventilation:<br/>
          • VT 6 mL/kg PBW (NOT actual body weight)<br/>
          • Pplat <30 cm H₂O<br/>
          • Permissive hypercapnia acceptable (pH ≥7.20)<br/><br/>
          RT: <em>"We need to reduce the tidal volume immediately to 328 mL."</em>`,
          updatedExam: [
            { icon:'😴', lbl:'General', key:'gen',     text:'Intubated and sedated. RASS -2. Ventilator alarming "high pressure". Patient appears uncomfortable.' },
            { icon:'🧠', lbl:'Neuro',   key:'neuro',   text:'Sedated on propofol. RASS -2. Pupils equal and reactive. Moving all extremities.' },
            { icon:'🫁', lbl:'Lungs',   key:'lungs',   text:'Intubated. Equal bilateral breath sounds. Diffuse crackles. High plateau pressure on ventilator (34 cm H₂O).' },
            { icon:'❤️', lbl:'Cardiac', key:'cardiac', text:'Tachycardic, hypotensive. Likely from high intrathoracic pressure reducing venous return.' },
            { icon:'🫃', lbl:'Abdomen', key:'abd',     text:'Soft, mildly distended from high airway pressures. OG tube in place.' },
            { icon:'🦵', lbl:'Extrem',  key:'ext',     text:'Warm. No edema. Pulses present but weak.' }
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
          label: '⚠ NO AIRWAY INTERVENTION',
          type: 'bad',
          triggers: ['increase oxygen','nrb','more oxygen','continue'],
          requires: 1,
          excludes: ['intubat','rsi','bipap','cpap','niv'],
          headline: 'Airway management not addressed',
          narrative: `You escalated oxygen without securing the airway. This patient has:<br/>
          • Severe hypoxemic respiratory failure<br/>
          • HFNC failure (SpO₂ 84% on max flow)<br/>
          • Work of breathing with accessory muscles<br/>
          • Tiring and unable to sustain effort<br/><br/>
          <span class="hl">This is a clear intubation indication.</span> Delaying leads to crash intubation with worse outcomes.`,
          showVitalsButton: true,
          nextVitals: [
            { lbl: 'HR',   val: '152',    unit: 'bpm',      st: 'vc' },
            { lbl: 'BP',   val: '68/40',  unit: 'mm Hg',    st: 'vc' },
            { lbl: 'SpO2', val: '72%',    unit: 'NRB 15L',  st: 'vc' },
            { lbl: 'GCS',  val: '6',      unit: '/15',      st: 'vc' },
            { lbl: 'RR',   val: '6',      unit: 'gasping',  st: 'vc' },
          ],
          vitalsMsg: `Patient is now bradypneic and unresponsive. Code blue is called within the MICU.<br/><br/><strong>Urgent airway management required.</strong><br/><br/>Early controlled intubation when HFNC failure was evident would have prevented this deterioration.`,
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
            { lbl: 'HR',    val: '105',       unit: 'bpm',      st: 'va' },
            { lbl: 'BP',    val: '92/54',     unit: 'mm Hg',    st: 'va' },
            { lbl: 'SpO2',  val: '94%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'va' },
            { lbl: 'GCS',   val: '13/15',     unit: '',         st: 'va' },
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
            { lbl: 'HR',    val: '108',       unit: 'bpm',      st: 'va' },
            { lbl: 'BP',    val: '118/72',    unit: 'mm Hg',    st: 'va' },
            { lbl: 'SpO2',  val: '92%',       unit: '',         st: 'vw' },
            { lbl: 'Temp',  val: '38.5',      unit: '°C',       st: 'va' },
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
            { lbl: 'HR',    val: '110',       unit: 'bpm',      st: 'va' },
            { lbl: 'BP',    val: '115/70',    unit: 'mm Hg',    st: 'va' },
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
            { lbl: 'HR',    val: '112',       unit: 'bpm',      st: 'va' },
            { lbl: 'BP',    val: '116/74',    unit: 'mm Hg',    st: 'va' },
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
        { lbl: 'Temp',  val: '38.3°C',    unit: '',         st: 'va' },
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
  }
};

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

const State = {
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
  grid.innerHTML = CASES.map((c, i) => {
    const art = ARTS[c.artType];
    return `
      <div class="case-card" data-idx="${i}" tabindex="0" role="button" aria-label="Launch ${c.title}">
        <div class="case-card-art" style="${art.bg}">${art.svg}</div>
        <div class="case-card-body">
          <div class="case-title-text">${c.title}</div>
          <div class="case-blurb">${c.blurb}</div>
          <span class="case-tag">Advanced</span>
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
  State.caseData = CASES[idx];
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

function classifyOrderLine(line) {
  const l = line.toLowerCase().trim();
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
  const lower = orderText.toLowerCase();

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
  if (/\b(fluid|bolus|saline|lactated|ringer|lr|ns|crystalloid)\b/.test(lower)) {
    const fluidVolume = extractFluidVolume(orderText);
    State.totalFluidGiven += fluidVolume;
    console.log(`Fluid ordered: ${fluidVolume}mL. Total fluid given: ${State.totalFluidGiven}mL`);
  }

  // Find which catalog items were triggered
  const triggered = catalog.filter(item => 
    item.triggers.some(re => re.test(lower))
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
        <div class="vignette" style="margin-bottom:20px;">${dec.prompt}</div>
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
  let matched = dec.branches.find(b => {
    if (b.triggers.length === 0 && b.requires === 0) return false; // skip default for now
    if (b.excludes && b.excludes.length > 0) {
      if (b.excludes.some(ex => lower.includes(ex))) return false;
    }
    // Handle both string and regex triggers
    const hits = b.triggers.filter(t => {
      if (t instanceof RegExp) {
        return t.test(lower);
      } else {
        return lower.includes(t);
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
          <div class="end-text">${branch.endMsg}</div>
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
      if (branch.showCodeBlue) {
        showCodeBlueModal(() => {
          // After ROSC, check for MICU transfer or show vitals
          if (branch.showMICUTransfer) {
            showMICUTransferModal(() => {
              showVitalsAndProceed(branch);
            });
          } else {
            showVitalsAndProceed(branch);
          }
        });
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

function showCodeBlueModal(onROSC) {
  const modal = CE('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-code-blue';
  modal.innerHTML = `
    <div class="modal-box modal-sm">
      <div class="modal-head" style="background:var(--red-bg);border-color:var(--red);">
        <div>
          <span class="modal-tag" style="background:var(--red);color:var(--bg);">CRITICAL EVENT</span>
          <h3 class="modal-title" style="color:var(--red);">Code Blue Activation</h3>
        </div>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="width:80px;height:80px;margin:0 auto 16px;border-radius:50%;background:var(--red-bg);border:3px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:36px;animation:pulse 1.5s ease-in-out infinite;">
            ⚠️
          </div>
          <div style="font-family:var(--font-h);font-size:22px;font-weight:700;color:var(--red);margin-bottom:12px;">Patient in Cardiac Arrest</div>
          <div style="font-size:15px;color:var(--tx-1);line-height:1.8;text-align:left;background:var(--bg-3);padding:16px;border-radius:8px;border-left:4px solid var(--red);">
            <strong style="color:var(--red);">Overhead Page:</strong> <em>"Code Blue, ICU Bed 12. Code Blue, ICU Bed 12."</em><br/><br/>
            The patient has lost pulse and is unresponsive. The code team is performing high-quality CPR. You are running the code.<br/><br/>
            <strong style="color:var(--amber);">Follow ACLS Algorithm:</strong>
            <ul style="margin:8px 0 0 20px;padding:0;">
              <li>CPR: 30 compressions, 2 breaths</li>
              <li>Assess rhythm every 2 minutes</li>
              <li>Epinephrine 1mg IV q3-5min</li>
              <li>Treat reversible causes (H's and T's)</li>
              <li>Consider thrombolytics for massive PE</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn--primary btn--full" id="code-blue-rosc" style="background:var(--green);border-color:var(--green);font-size:17px;padding:14px;">
          ✓ ROSC Achieved (Return of Spontaneous Circulation) →
        </button>
      </div>
    </div>
  `;
  
  // Add pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(modal);
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    const roscBtn = $('code-blue-rosc');
    if (roscBtn) {
      roscBtn.addEventListener('click', () => {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        modal.remove();
        style.remove();
        if (onROSC) onROSC();
      });
    }
  }, 100);
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
  // Home → cases
  document.querySelectorAll('.module-card--active').forEach(card => {
    const go = () => { renderCaseList(); showScreen('screen-cases'); };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }});
  });

  // Locked module
  document.querySelectorAll('.module-card--locked').forEach(card => {
    card.addEventListener('click', () => {
      showRNMsg('Module Locked', 'The Sepsis Simulation is currently in development. Check back soon.', 'SYSTEM');
    });
  });

  // Nav buttons
  $('back-to-home').addEventListener('click', () => { State.reset(); showScreen('screen-home'); });
  $('back-to-cases').addEventListener('click', () => { State.reset(); showScreen('screen-cases'); });

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

document.addEventListener('DOMContentLoaded', init);
