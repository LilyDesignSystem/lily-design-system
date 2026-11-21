<script lang="ts">
  const repo = 'https://github.com/LilyDesignSystem/lily-design-system/blob/main';

  const figures = [
    { n: '661', what: 'components in the catalogue', src: '/components/', label: 'Browse the catalogue' },
    { n: '63', what: 'reference themes, each a plain CSS file', src: '/en-001/colours/', label: 'See them on the colours page' },
    { n: '64', what: 'language label packs (63 are unreviewed drafts)', src: '/label-packs/', label: 'Label packs' },
    { n: '99.6%', what: 'line coverage of the shared logic, the Svelte catalogue and the Blazor catalogue (13,344 of 13,397 lines, measured 21 November 2026)', src: `${repo}/docs/coverage.md`, label: 'The coverage report' },
    { n: '10', what: 'frameworks and runtimes: HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks, Solid, Web Components and Alpine.js', src: '/getting-started/', label: 'Getting started' }
  ];

  const clinical = [
    ['Patient banner pattern', 'Identifiers shown, never hidden or truncated, with a stated deceased state.'],
    ['Observation view', 'A value, unit, reference range, flag in words and status, with an optional meter that is never the only signal.'],
    ['Record lists', 'Allergies, medications, problems, immunisations, procedures and devices, each with a stated “none known”, “not recorded” or “unavailable”.'],
    ['Medication view', 'Name (tall man letters supported), strength, form, route and frequency, never cut off.'],
    ['Early warning score view and age view', 'Display only: Lily never computes a score or an age for you.'],
    ['Formatting helpers', 'Quantities, ranges, partial dates and proportions through `Intl`, refusing a missing locale.'],
    ['FHIR field mapping', 'Which FHIR element shows up in which prop, for the main resources.']
  ];

  const compare = [
    ['An official identity and the authority of your own organisation', 'Stronger in an official system. Lily ships no identity at all, by design.'],
    ['Research-backed service patterns for your own services', 'Stronger in an official system, which is built from your organisation’s research.'],
    ['A named team to ask and a support route', 'Stronger in an official system. Lily has one maintainer and no support contract today.'],
    ['Breadth: 661 components, eight and more frameworks', 'Stronger in Lily, which covers forms, charts, grids, calendars, editors and clinical displays.'],
    ['Choosing a look (63 themes) and re-colouring without a fork', 'Stronger in Lily: themes are plain CSS and a brand overlay is a few lines.'],
    ['Worldwide use (any language, direction, calendar, identifier)', 'Stronger in Lily, which has no regional defaults and ships 64 label packs, though most are unreviewed.'],
    ['Published quality evidence (tests, coverage, accessibility sweeps)', 'Lily publishes the figures and says what they do not cover.']
  ];

  const gaps = [
    'No independent accessibility audit has been done. The accessibility statement is self-assessed.',
    'Screen-reader behaviour is mostly untested by people; automated tests check markup, not what is announced.',
    '63 of the 64 label packs, including the Welsh pack, are machine drafts that no native speaker has reviewed.',
    'One maintainer and no support contract. Plan for continuity: pin versions, and be ready to fork.',
    'Lily is not an official design system, and cannot claim to be.',
    'Lily has no clinical logic. It does not compute a score, a dose or a reference range, and it is not a medical device.'
  ];

  const examples = [
    ['/en-001/examples/health-care-dental-access/', 'Dental access'],
    ['/en-001/examples/health-care-test-requests/', 'Test requests'],
    ['/en-001/examples/health-care-pharmacies/', 'Pharmacies'],
    ['/en-001/examples/health-care-prescriptions/', 'Prescriptions'],
    ['/en-001/examples/health-care-continuous-patient-monitoring/', 'Continuous patient monitoring'],
    ['/en-001/examples/health-care-shared-medicines/', 'Shared medicines'],
    ['/en-001/examples/health-care-vaccinations/', 'Vaccinations, in English and Welsh'],
    ['/examples/welsh-clinical-portal/', 'A clinician’s results screen'],
    ['/examples/epic-emr-patient-summary-overview-vital-signs/', 'A chart summary with vital signs']
  ];
</script>

<svelte:head>
  <title>Lily for public-sector health — Lily Design System</title>
  <meta
    name="description"
    content="What Lily offers a public-sector health team: measured figures, clinical display components, working examples, an honest list of what is not yet proved, and a way to try it in an afternoon."
  />
</svelte:head>

<section class="page-intro">
  <h1>Lily for public-sector health</h1>
  <p class="page-intro-tagline">
    Build health and care services faster, show clinical information more safely, and have evidence to hand when
    someone asks how you know. Try Lily alongside what you use today, without removing anything.
  </p>
</section>

<section class="prose">
  <h2>What you get</h2>
  <div class="card-grid">
    <div class="card">
      <h3 class="card-heading">Faster to build</h3>
      <p class="card-description">Forms, grids, charts and clinical displays that already exist, tested, in your own framework.</p>
    </div>
    <div class="card">
      <h3 class="card-heading">Safer to show</h3>
      <p class="card-description">Every status written in words, nothing truncated, nothing blank, no value that reads as normal by omission.</p>
    </div>
    <div class="card">
      <h3 class="card-heading">Easier to defend</h3>
      <p class="card-description">Published figures, an honest list of gaps, and an assurance pack that says what exists.</p>
    </div>
  </div>

  <h2>The figures, and where they come from</h2>
  <p>Each number links to the page or generated report it comes from, so you can check it.</p>
  <div class="scroll" role="region" aria-label="Measured figures" tabindex="0">
    <table>
      <caption>Figures about Lily and their sources</caption>
      <thead><tr><th scope="col">Figure</th><th scope="col">What it counts</th><th scope="col">Source</th></tr></thead>
      <tbody>
        {#each figures as f (f.n)}
          <tr><th scope="row">{f.n}</th><td>{f.what}</td><td><a href={f.src}>{f.label}</a></td></tr>
        {/each}
      </tbody>
    </table>
  </div>
  <p>Coverage says which lines a test ran, not that it checked them; the repository also runs mutation and property tests on its shared logic.</p>

  <h2>What there is for clinical interfaces</h2>
  <div class="scroll" role="region" aria-label="Clinical components" tabindex="0">
    <table>
      <caption>Clinical display components and helpers</caption>
      <thead><tr><th scope="col">Component</th><th scope="col">What it does</th></tr></thead>
      <tbody>
        {#each clinical as c (c[0])}<tr><th scope="row">{c[0]}</th><td>{c[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>
  <p>
    The <a href={`${repo}/docs/patterns/healthcare/index.md`}>healthcare guide</a> sets out the rules in full and what Lily
    will not do.
  </p>

  <h2>Working examples</h2>
  <p>Every person, place and number is invented. Choose a theme in the header and the same page changes.</p>
  <ul>
    {#each examples as e (e[0])}<li><a href={e[0]}>{e[1]}</a></li>{/each}
  </ul>

  <h2>A fair comparison</h2>
  <p>
    An official, organisation-owned design system and Lily solve different problems. This is where each is stronger, from
    Lily’s point of view; check it against your own needs.
  </p>
  <div class="scroll" role="region" aria-label="Comparison" tabindex="0">
    <table>
      <caption>What matters, and where each approach is stronger</caption>
      <thead><tr><th scope="col">What matters to you</th><th scope="col">Where it stands</th></tr></thead>
      <tbody>
        {#each compare as c (c[0])}<tr><th scope="row">{c[0]}</th><td>{c[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>
  <p>Most teams will use both: an official system for identity and service patterns, Lily for the components it does not cover.</p>

  <h2>What is not yet proved</h2>
  <ul>
    {#each gaps as g (g)}<li>{g}</li>{/each}
  </ul>
  <p>
    The <a href="/en-001/accessibility-statement/">accessibility statement</a> and the
    <a href={`${repo}/docs/assurance/index.md`}>assurance pack</a> keep this list up to date, with a task for each gap.
  </p>

  <h2>Try it in an afternoon</h2>
  <ol>
    <li>Pick one screen, for example a results table or a medicines list.</li>
    <li>Rebuild it from Lily components in your framework. Start at <a href="/getting-started/">getting started</a>.</li>
    <li>Choose a theme; write your own words; test it with a keyboard and the screen reader your users have.</li>
    <li>Show it to a clinician and a person who uses assistive technology. Ask what is missing.</li>
    <li>Decide the next step with the <a href={`${repo}/docs/migrating/government-design-system.md`}>migration guide</a>, which treats adoption as
      “alongside first, then migrate”.</li>
  </ol>

  <h2>Who uses it</h2>
  <p>
    No adopters are listed yet, and we will not list one without its permission. If you use Lily in a health or care
    service, or are trying it, <a href="https://github.com/LilyDesignSystem/lily-design-system/issues">tell us</a>.
  </p>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
</style>
