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
          <td><a href="/components/allergy-list/">allergy-list</a> and <a href="/components/allergy-list-item/">allergy-list-item</a>: a status that is never blank</td>
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
      Do not limit how many records a clinician may open: a randomised trial of 3,356 clinicians (JAMA, 2019) found that
      it did not reduce wrong-patient orders, and people work around it.
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
  </ul>

  <h2>Medicines</h2>
  <ul>
    <li>
      Generic names in lower case, except tall man letters from the FDA and ISMP lists or your country's (Australia and
      Canada publish their own). Mark them in <code>nameSegments</code>; Lily never guesses them.
    </li>
    <li>Write the strength with <code>formatQuantity</code>: no trailing zero, a leading zero, a no-break space before the unit.</li>
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
  </ul>

  <h2>Dashboards</h2>
  <ul>
    <li>
      A ward board or command-centre screen updates often. Never announce each change: keep one polite summary region
      ("3 beds free, 2 discharges due") and let people read the board.
    </li>
    <li>Every state on a board (bed clean, occupied, blocked) is text or a <code>data-*</code> state with words, never colour alone.</li>
  </ul>

  <h2>What Lily will not do</h2>
  <ul>
    <li>Compute an early warning score, a growth centile, a dose or a reference range.</li>
    <li>Ship a drug database, a tall man list, or SNOMED CT, ICD, LOINC or UCUM codes.</li>
    <li>Reproduce a licensed instrument (Wong-Baker FACES) or another body's design (the NEWS2 chart).</li>
    <li>Limit the number of records open at once.</li>
  </ul>
  <p>
    The research, sources and decisions behind this guide are in
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md">spec/healthcare-ui</a>.
  </p>
</section>
