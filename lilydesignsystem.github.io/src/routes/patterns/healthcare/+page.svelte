<!--
  The healthcare adopter guide, from docs/patterns/healthcare/index.md (tasks.md P27-T10). Keep the two in step: edit
  the Markdown, then this page, then run bin/extract-site-pages; the translations in src/lib/pages/patterns-healthcare/
  are unreviewed machine drafts and must follow.
-->
<svelte:head>
  <title>Healthcare user interfaces — Lily Design System</title>
  <meta
    name="description"
    content="A guide for teams building clinical software with Lily: what Lily provides and what it leaves to you, alert tiering, wrong-patient safeguards, the patient banner, results, medicines, dates and dashboards."
  />
</svelte:head>

<section class="page-intro">
  <h1 id="healthcare-title">Healthcare user interfaces</h1>
  <p class="page-intro-tagline">
    A guide for teams building clinical software with Lily: clinical portals, results and reporting, prescribing and
    medicines administration, decision support and hospital dashboards.
  </p>
  <p>
    Translations of this page are unreviewed machine drafts. <a href="/patterns/healthcare/#healthcare-title"
      >The English page</a
    > is the authoritative version.
  </p>
</section>

<section class="prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2>What Lily does, and what it does not</h2>
  <p>
    Lily gives you display contracts: semantic markup, ARIA, keyboard behaviour and class hooks for the things clinical
    screens repeat. It does not give you clinical logic, clinical content or a regulatory claim.
  </p>
  <div role="region" aria-labelledby="healthcare-provides" tabindex="0" style="overflow-x: auto;">
    <table style="min-inline-size: 40rem;">
      <caption id="healthcare-provides">What Lily provides, and what you provide</caption>
      <thead>
        <tr>
          <th>Lily provides</th>
          <th>You provide</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><a href="/components/observation-view/">observation-view</a>: a value, unit, flag in words, range, and missing states</td>
          <td>The value, the flag decision, the reference range</td>
        </tr>
        <tr>
          <td><a href="/components/allergy-record-list/">allergy-record-list</a> and <a href="/components/allergy-record-list-item/">allergy-record-list-item</a>: a status that is never blank</td>
          <td>The allergy record and its terminology</td>
        </tr>
        <tr>
          <td><a href="/components/medication-view/">medication-view</a>: name, strength, form, route and frequency, none truncated</td>
          <td>The drug data, the tall man segments, the formatted strength</td>
        </tr>
        <tr>
          <td><a href="/components/decision-support-card/">decision-support-card</a>: the CDS Hooks card shape</td>
          <td>The rules, the suggestion actions, recording the outcome</td>
        </tr>
        <tr>
          <td><a href="/components/early-warning-score-view/">early-warning-score-view</a>: a score, band and escalation, displayed</td>
          <td>The scoring system and its validated calculation</td>
        </tr>
        <tr>
          <td><a href="/components/age-view/">age-view</a> and <code>ageParts()</code>: an age in units suited to it</td>
          <td>The words for the units (<code>Intl.DurationFormat</code> or your own labels)</td>
        </tr>
        <tr>
          <td><code>formatQuantity()</code>: 5 mg, never 5.0 mg; 0.5 mg, never .5 mg</td>
          <td>The number, the unit and the locale</td>
        </tr>
        <tr>
          <td>The patient banner composition</td>
          <td>Every label and value, and who may see clinical information</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    <strong>Regulation.</strong> Software that computes a score, a centile, a dose or a drug interaction is usually a
    medical device. Lily computes none of these, on purpose. If your product is regulated, you own its usability
    engineering file (IEC 62366-1, the FDA's human factors guidance, EU MDR). Lily's tests, its self-assessed
    accessibility conformance report and its screen-reader matrix can be evidence in that file; none of them is a
    conformance claim, and the matrix has no results yet.
  </p>

  <h2>Alerts: interrupt only for what is critical</h2>
  <p>
    Alert fatigue is a safety problem: when every alert interrupts, people dismiss them all. AHRQ's guidance is to tier
    alerts by severity and make only the severe ones interruptive.
  </p>
  <ul>
    <li><strong>Information</strong> (<code>indicator="info"</code>): inline, beside the task, a decision-support card in the page.</li>
    <li><strong>Warning</strong> (<code>indicator="warning"</code>): visible without blocking, the same card, styled to stand out; no modal.</li>
    <li>
      <strong>Critical</strong> (<code>indicator="critical"</code>): put the card inside an alert dialog, and offer
      <code>overrideReasons</code> so dismissing it asks for a reason.
    </li>
    <li>
      A decision-support card is never a live region by itself. Announce a new critical card by moving focus into the
      dialog, not by <code>aria-live</code>.
    </li>
    <li>Remove a card when the event it answered happens again, and record each outcome (accepted, or overridden with its reason).</li>
  </ul>

  <h2>Wrong-patient errors: identify, do not restrict</h2>
  <ul>
    <li>
      Show two identifiers wherever a patient's data appears: the name with the date of birth, and the national
      identifier with its view component (The Joint Commission, Quick Safety 45).
    </li>
    <li>Use the patient banner on every screen that acts on one patient's record, and keep it visible.</li>
    <li>Before an action on a record other than the one in the banner, confirm it with the name, date of birth and identifier.</li>
    <li>
      An entry about someone other than the patient (a parent's history, a fetus, a donor) says whose it is first, in words: give
      the record items a <code>subjectLabel</code> ("Mother"), so a relative's diagnosis is never read as the patient's (openEHR
      <code>PARTY_RELATED</code>, FHIR <code>FamilyMemberHistory</code>).
    </li>
    <li>
      Do not limit how many records a clinician may open: a randomised trial of 3,356 clinicians (JAMA, 2019) found that
      it did not reduce wrong-patient orders, and people work around it.
    </li>
    <li>
      A menu of actions on one record names that record first, with <code>subjectLabel</code> on <code>context-menu</code> or
      <code>dropdown-menu</code> ("Ada Lovelace, blood pressure 3 Nov"): a non-interactive first part that is also the menu's
      accessible name.
    </li>
    <li>
      Tier each action by what it does, and make the tier visible before it runs. <strong>Routine</strong> (view, print) runs at
      once. <strong>Documented</strong> says what it will write to the record ("Adds a note to the encounter").
      <strong>Clinical</strong> (discontinue, cancel an order) asks a second time, in an <code>alert-dialog</code> whose confirming
      button is the verb ("Discontinue"), never "OK" or "Yes". <strong>Disclosive</strong> (break the glass, share outside the care
      team) asks for a reason first and records it.
    </li>
    <li>
      When several records are open (tabs, windows, split panes), every tab's visible text and accessible name include the
      patient's name and a second identifier, the active panel repeats the banner, and no action applies to a patient other than
      its panel's.
    </li>
    <li>
      Show the location records will be attributed to (the ward, clinic or facility chosen at sign-in) as text in the page header,
      and make changing it an explicit action.
    </li>
    <li>
      Show the active visit, or "No active visit", in the banner. A form that needs a visit says so and offers to start one,
      rather than failing when it is saved.
    </li>
  </ul>

  <h2>The patient banner</h2>
  <p>
    The composition is documented with <a href="/components/medical-banner/">medical-banner</a>, with a working page at
    <code>/patient-banner</code> in the SvelteKit example app:
  </p>
  <ul>
    <li>two identifiers, and the age beside the date of birth;</li>
    <li>allergies through an allergy list, so "no known allergies", "not recorded" and "unavailable" never look alike;</li>
    <li>a missing value is words ("Not known"), never a question mark, a dash or an empty cell;</li>
    <li>a deceased patient: <code>data-deceased</code> for the theme, and a visible line of text, never colour alone;</li>
    <li>no field truncated, clipped or hidden at any width; it wraps.</li>
    <li>
      patient flags ("Needs an interpreter", "Infection risk") are a labelled <code>tag-group</code> of words, never icons or colour
      alone, and stay visible when the banner wraps.
    </li>
  </ul>

  <h2>Results</h2>
  <ul>
    <li>One display for a result, whatever system it came from: the observation view.</li>
    <li>
      The flag is words from your translation (<code>flagLabel</code>), with the FHIR interpretation code as
      <code>data-interpretation</code> for the theme.
    </li>
    <li>
      Separate new results from earlier ones, and show a trend (a sparkline, or a line chart with its data table):
      clinicians look for a significant change, not only the range.
    </li>
    <li>A result that was never recorded and one that is unavailable are different states, with different words.</li>
    <li>
      Unknown is not normal. A result whose reference range is missing, still loading or unreadable has no interpretation and says
      so; <code>observation-view</code> never infers one, so a result with a range and no <code>interpretation</code> shows no flag.
    </li>
    <li>
      An off-scale result is the instrument's limit with a comparator ("&gt; 33.3 mmol/L": <code>formatQuantity</code> with
      <code>"&gt;"</code>) and your critical flag, never a bare number. An approximate value keeps its ≈ (<code>"~"</code>).
    </li>
    <li>Give further named ranges ("Critical: below 2.5") as <code>ranges</code>, each its own part.</li>
    <li>
      A corrected or amended result keeps the value it replaced, in a <code>&lt;del&gt;</code>, with your words for when it changed
      (<code>previousValue</code>, <code>previousLabel</code>), so a clinician who read the old value knows it changed.
    </li>
    <li>
      An interval reading says its width and function ("Mean, 24 hours"), and a reading's state and method ("Sitting, large cuff")
      are visible text beside it, never only a tooltip (openEHR <code>INTERVAL_EVENT</code>, <code>state</code>,
      <code>protocol</code>).
    </li>
    <li>
      A trend needs comparable points: draw no line below your minimum, break the line where the method or assay changed, and say
      direction and meaning in words ("falling, improving").
    </li>
    <li>
      Vitals entered in one unit system may show the other beside them as your text ("70 kg (154 lb)"); Lily converts nothing, so
      state your rounding. Enter a quantity with <code>quantity-input-div</code>, whose number takes each unit's limits.
    </li>
    <li>
      A growth chart is a <code>line-chart</code> with your centile lines as series, the child's points and its data table of age
      and value; Lily computes no centile and ships no growth reference.
    </li>
  </ul>

  <h2>Medicines</h2>
  <ul>
    <li>
      Generic names in lower case, except tall man letters from the FDA and ISMP lists or your country's (Australia and
      Canada publish their own). Mark them in <code>nameSegments</code>; Lily never guesses them.
    </li>
    <li>Write the strength with <code>formatQuantity</code>: no trailing zero, a leading zero, a no-break space before the unit.</li>
    <li>
      Keep a result's comparator: <code>formatQuantity(5, "mmol/L", locale, "&lt;")</code> writes "&lt;5 mmol/L". FHIR's
      <code>Quantity.comparator</code> is written &lt;, ≤, ≥ or &gt;; dropping it turns "less than 5" into "5".
    </li>
    <li>Write mL, never cc, and avoid every abbreviation on ISMP's error-prone list.</li>
    <li>Never truncate a medicine's name or dose.</li>
  </ul>

  <h2>Dates and times</h2>
  <ul>
    <li>Write the month as text so a date cannot be read two ways (<code>Intl.DateTimeFormat</code> with <code>month: "short"</code>).</li>
    <li>
      Choose the clock on purpose: pass <code>hourCycle</code> explicitly. The NHS asks for the 24-hour clock; that is a
      UK rule, not a worldwide one, so Lily never picks it for you.
    </li>
    <li>Ages follow the Common User Interface bands through <code>ageParts()</code>; a service with another convention passes its own words.</li>
    <li>
      A date known only to the month or year stays that way: ask for it with <code>date-field</code>
      <code>precision="month"</code> or <code>"year"</code>, store <code>2019-03</code> or <code>2019</code>, and write it with
      <code>formatPartialDate()</code>. Never invent a day.
    </li>
    <li>
      A length of time is <code>duration-view</code>, a <code>&lt;time datetime="P3DT4H"&gt;</code> holding your words, from
      <code>durationParts()</code> and <code>Intl.DurationFormat</code>.
    </li>
  </ul>

  <h2>Dashboards</h2>
  <ul>
    <li>
      A ward board or command-centre screen updates often. Never announce each change: keep one polite summary region
      ("3 beds free, 2 discharges due") and let people read the board.
    </li>
    <li>Every state on a board (bed clean, occupied, blocked) is text or a <code>data-*</code> state with words, never colour alone.</li>
    <li>
      Nothing blinks (WCAG 2.2.2, 2.3.1), and a board that updates on a timer has a pause control or updates only when asked;
      updates never move focus. An overdue entry says so in words ("Waiting over 20 minutes") with <code>data-overdue</code>.
    </li>
    <li>A count or rate shows its denominator ("12 of 68") and links to the list behind it.</li>
    <li>
      A list or timeline says what it is a view of: what it shows, its order and window, what is hidden and why, and which sources
      did not answer. An empty list from a source that did not answer is not proof that nothing exists.
    </li>
    <li>
      A reminder list is a <code>record-list</code> whose items carry a due date (<code>review-date</code>) and a due state in
      words, with <code>data-due</code>; the rule that produced it is yours.
    </li>
  </ul>

  <h2>Forms</h2>
  <ul>
    <li>
      A question answered "yes", "no" or "not asked" is a <code>radio-group</code> of three answers, none chosen at first, never a
      checkbox: a checkbox cannot tell "denied" from "never asked". A review of systems is one <code>fieldset</code> per body
      system, and an "all others absent" button sets only the unanswered ones.
    </li>
    <li>
      A question with a list of answers (medicines, addresses) is a <code>repeatable-fieldset</code>: an item is added or removed,
      focus follows, and each remove button is named for its item.
    </li>
    <li>
      A number with a decimal comma: show it with <code>Intl.NumberFormat</code> and, where <code>type="number"</code> does not
      accept the comma, take it in a text field with <code>inputmode="decimal"</code> and parse it in your code. Never change a
      value the person typed, even to clamp it to a range: an out-of-range value is an error they can see.
    </li>
    <li>
      A long list that renders only part of its options at a time sets <code>aria-setsize</code> and <code>aria-posinset</code> on
      each option, and remembers that find-in-page cannot see the rest.
    </li>
  </ul>

  <h2>Records, notes and their provenance</h2>
  <ul>
    <li>
      Say what a list or a grid is a view of, before its rows: its window and order, what it leaves out and why, and which sources
      did not answer ("Last 12 months, newest first. The GP record did not answer."). Give <code>record-list</code> and
      <code>timeline-list</code> a <code>coverageLabel</code>, and the <code>data-grid</code> helper its <code>coverageLabel</code>.
      An empty list from a source that did not answer says so in words, so it is never read as "nothing recorded".
    </li>
    <li>
      Say where a record came from and whether it is final with <code>record-provenance-view</code>: signed, awaiting a signature,
      amended, saved on this device and not yet sent. An unsigned draft must never look signed.
    </li>
    <li>An entry about someone else (a parent, a fetus, a donor) says whose it is first, with the record items' <code>subjectLabel</code>.</li>
    <li>
      A withheld entry stays in the list with your words ("Restricted: not available to you"), and an entry made in error stays
      struck through with "Entered in error": give <code>record-list-item</code> or <code>timeline-list-item</code> an
      <code>entryState</code> and an <code>entryStateLabel</code>. Never remove either silently, since a gap is read as "nothing
      happened".
    </li>
    <li>
      In a clinical note, mark each passage's source (typed, dictated, template, copied forward, generated) with
      <code>data-source</code> and visible words, so copied or generated text is never taken for today's examination.
    </li>
    <li>
      A section that cannot load is <code>unavailable</code> in your words, with a retry button; a technical code, if shown at all,
      sits behind a disclosure. A failure caused by a person's action is announced, with the value the record now holds; a failure
      on page load is not.
    </li>
    <li>
      An order's history is a <code>timeline-list</code>, one item per step (planned, scheduled, active, suspended, completed,
      cancelled) with its time and reason, and the current state also on the item.
    </li>
  </ul>

  <h2>From FHIR to Lily</h2>
  <p>
    Lily does not read FHIR resources; your code maps them to Lily's props. These tables map the HL7 FHIR International Patient
    Summary (IPS 2.0.1, FHIR R4). The code mapping is a suggestion: your clinical safety review decides it, and the words for every
    state are your own.
  </p>
  <div role="region" aria-labelledby="healthcare-sections" tabindex="0" style="overflow-x: auto;">
    <table style="min-inline-size: 40rem;">
      <caption id="healthcare-sections">IPS sections and the Lily components for them</caption>
      <thead>
        <tr>
          <th>IPS section</th>
          <th>Lily</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Allergies and intolerances (<code>48765-2</code>)</td>
          <td><a href="/components/allergy-record-list/">allergy-record-list</a> and its items</td>
        </tr>
        <tr>
          <td>Medication summary (<code>10160-0</code>)</td>
          <td><a href="/components/medication-record-list/">medication-record-list</a>, each item holding a <a href="/components/medication-view/">medication-view</a></td>
        </tr>
        <tr>
          <td>Problem list (<code>11450-4</code>)</td>
          <td><a href="/components/problem-record-list/">problem-record-list</a> and its items</td>
        </tr>
        <tr>
          <td>Immunizations (<code>11369-6</code>)</td>
          <td><a href="/components/immunization-record-list/">immunization-record-list</a> and its items</td>
        </tr>
        <tr>
          <td>Results (<code>30954-2</code>)</td>
          <td><a href="/components/observation-view/">observation-view</a>, in a data table or summary list</td>
        </tr>
        <tr>
          <td>History of procedures (<code>47519-4</code>)</td>
          <td><a href="/components/procedure-record-list/">procedure-record-list</a> and its items</td>
        </tr>
        <tr>
          <td>Medical devices (<code>46264-8</code>)</td>
          <td><a href="/components/device-record-list/">device-record-list</a> and its items</td>
        </tr>
        <tr>
          <td>Alerts (<code>104605-1</code>)</td>
          <td>Warning text or an alert, never behind a collapsed control</td>
        </tr>
        <tr>
          <td>Any other section</td>
          <td><a href="/components/record-list/">record-list</a> and its items</td>
        </tr>
        <tr>
          <td>A required section the document leaves out</td>
          <td>The section's list with <code>status="omitted"</code></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div role="region" aria-labelledby="healthcare-codes" tabindex="0" style="overflow-x: auto;">
    <table style="min-inline-size: 40rem;">
      <caption id="healthcare-codes">FHIR codes and the Lily values for them</caption>
      <thead>
        <tr>
          <th>FHIR</th>
          <th>Lily</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>emptyReason</code> <code>nilknown</code></td>
          <td>The list's <code>status="none-known"</code></td>
        </tr>
        <tr>
          <td><code>emptyReason</code> <code>notasked</code>, <code>notstarted</code></td>
          <td><code>status="not-recorded"</code></td>
        </tr>
        <tr>
          <td><code>emptyReason</code> <code>unavailable</code>, <code>withheld</code>, <code>closed</code></td>
          <td><code>status="unavailable"</code>, with words that say which</td>
        </tr>
        <tr>
          <td>The IPS codes <code>no-known-allergies</code>, <code>no-known-medications</code> and the like</td>
          <td><code>status="none-known"</code></td>
        </tr>
        <tr>
          <td>The IPS codes <code>no-allergy-info</code>, <code>no-medication-info</code> and the like</td>
          <td><code>status="not-recorded"</code></td>
        </tr>
        <tr>
          <td><code>AllergyIntolerance.criticality</code></td>
          <td><code>criticality</code>, apart from a reaction's <code>severity</code></td>
        </tr>
        <tr>
          <td><code>clinicalStatus</code>, <code>verificationStatus</code></td>
          <td>The same props on the allergy and problem items, with the same codes</td>
        </tr>
        <tr>
          <td><code>MedicationStatement.status</code></td>
          <td>The medication item's <code>status</code></td>
        </tr>
        <tr>
          <td><code>Dosage.text</code></td>
          <td><code>medication-view</code> <code>dosageText</code></td>
        </tr>
        <tr>
          <td><code>Observation.status</code></td>
          <td><code>observation-view</code> <code>status</code>, with the same codes</td>
        </tr>
        <tr>
          <td><code>Observation.dataAbsentReason</code> <code>masked</code></td>
          <td><code>status="masked"</code></td>
        </tr>
        <tr>
          <td><code>dataAbsentReason</code> <code>not-applicable</code></td>
          <td><code>status="not-applicable"</code> (also on the record lists)</td>
        </tr>
        <tr>
          <td><code>Quantity.comparator</code></td>
          <td><code>formatQuantity(value, unit, locale, comparator)</code></td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    Map an <code>entered-in-error</code> record to its <code>entered-in-error</code> status, with words, rather than dropping it
    silently: whether to show it at all is your service's decision.
  </p>

  <h2>From openEHR to Lily</h2>
  <p>
    Lily does not read openEHR compositions either. The mapping for openEHR Reference Model data types and codes, as a suggestion
    your clinical safety review decides:
  </p>
  <div role="region" aria-labelledby="healthcare-openehr" tabindex="0" style="overflow-x: auto;">
    <table style="min-inline-size: 40rem;">
      <caption id="healthcare-openehr">openEHR data types and codes, and the Lily values for them</caption>
      <thead>
        <tr>
          <th>openEHR</th>
          <th>Lily</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>DV_QUANTITY</code> (entry)</td>
          <td><code>quantity-input-div</code>; units as UCUM codes with your words</td>
        </tr>
        <tr>
          <td><code>DV_QUANTITY</code> (display), <code>magnitude_status</code></td>
          <td><code>observation-view</code> with <code>formatQuantity(value, unit, locale, comparator)</code> (<code>~</code> is ≈)</td>
        </tr>
        <tr>
          <td><code>DV_ORDERED.normal_status</code> <code>HHH</code>, <code>HH</code>, <code>H</code>, <code>L</code>, <code>LL</code>, <code>LLL</code></td>
          <td><code>observation-view</code> <code>interpretation</code>: FHIR <code>HU</code>, <code>HH</code>, <code>H</code>, <code>L</code>, <code>LL</code>, <code>LU</code></td>
        </tr>
        <tr>
          <td><code>other_reference_ranges</code> with a <code>meaning</code></td>
          <td><code>observation-view</code> <code>ranges</code></td>
        </tr>
        <tr>
          <td><code>DV_DATE</code> partial (year, year and month)</td>
          <td><code>date-field</code> <code>precision</code>; <code>formatPartialDate()</code>; <code>date-time-view</code></td>
        </tr>
        <tr>
          <td><code>DV_DURATION</code></td>
          <td><code>duration-view</code> with <code>durationParts()</code></td>
        </tr>
        <tr>
          <td><code>DV_PROPORTION</code></td>
          <td><code>formatProportion()</code> inside <code>observation-view</code></td>
        </tr>
        <tr>
          <td><code>DV_ORDINAL</code>, <code>DV_SCALE</code></td>
          <td>a <code>radio-group</code> whose labels carry the number and its words</td>
        </tr>
        <tr>
          <td><code>DV_CODED_TEXT</code></td>
          <td>the coded values pattern below</td>
        </tr>
        <tr>
          <td><code>DV_BOOLEAN</code></td>
          <td><code>checkbox-input</code>, only when "not asked" cannot happen</td>
        </tr>
        <tr>
          <td><code>ELEMENT.null_flavour</code> <code>253</code> unknown, <code>271</code> no information</td>
          <td><code>status="not-recorded"</code> or <code>"unavailable"</code>, with words that say which</td>
        </tr>
        <tr>
          <td><code>null_flavour</code> <code>272</code> masked</td>
          <td><code>observation-view</code> <code>status="masked"</code></td>
        </tr>
        <tr>
          <td><code>null_flavour</code> <code>273</code> not applicable</td>
          <td><code>status="not-applicable"</code></td>
        </tr>
        <tr>
          <td><code>PARTY_RELATED</code> subject</td>
          <td><code>subjectLabel</code> on the record items</td>
        </tr>
        <tr>
          <td><code>AUDIT_DETAILS</code>, <code>ATTESTATION</code>, <code>FEEDER_AUDIT</code></td>
          <td><code>record-provenance-view</code></td>
        </tr>
        <tr>
          <td>Instruction State Machine steps</td>
          <td>a <code>timeline-list</code> of steps, with the current state on the item</td>
        </tr>
        <tr>
          <td>an archetype item with occurrences <code>0..*</code></td>
          <td><code>repeatable-fieldset</code></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>Coded values</h2>
  <ul>
    <li>Show <code>Coding.display</code>; if there is none, <code>CodeableConcept.text</code>; if neither, <code>system|code</code>. Never an empty cell.</li>
    <li>Offer a control that reveals the code system and code beside each value, such as a toggle button that says "Show codes". Hidden codes stay out of the reading order until shown.</li>
    <li>Mark clinical text with the document's language (<code>lang</code>), which may differ from the interface's. Translate the interface; never translate the clinical content.</li>
    <li>Lily ships no terminology: no SNOMED CT, LOINC, ATC or UCUM lookups. Write what the document says. The SvelteKit example's <code>/patient-summary</code> page shows the pattern.</li>
  </ul>

  <h2>What Lily will not do</h2>
  <ul>
    <li>Compute an early warning score, a growth centile, a dose or a reference range.</li>
    <li>Ship a drug database, a tall man list, or SNOMED CT, ICD, LOINC or UCUM codes.</li>
    <li>Reproduce a licensed instrument (Wong-Baker FACES) or another body's design (the NEWS2 chart).</li>
    <li>Limit the number of records open at once.</li>
    <li>Infer an interpretation from a range, convert a unit, or parse a relative date ("next Tuesday").</li>
    <li>Use a switch for "yes, no or unknown": ARIA's <code>switch</code> has no third state, so it is three radios.</li>
  </ul>
  <p>
    The research, sources and decisions behind this guide are in
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md">spec/healthcare-ui</a>.
  </p>
</section>
