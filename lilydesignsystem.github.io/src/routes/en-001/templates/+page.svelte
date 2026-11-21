<script lang="ts">
  import StylesNav from '#lib/components/StylesNav.svelte';

  const templates = [
    {
      name: 'Content page',
      use: 'Articles, guidance, documentation and any page that is mostly reading.',
      regions: ['Skip link', 'Header with navigation', 'Main: one h1, sections', 'Footer'],
      live: { href: '/en-001/styles/', label: 'This page is one' }
    },
    {
      name: 'Dashboard',
      use: 'Several panels of live information that a person scans and acts on.',
      regions: ['Header with pickers', 'Left rail of destinations', 'Main: one panel at a time', 'Right rail of actions', 'Footer'],
      live: { href: '/demo/svelte/', label: 'Open the dashboard demo' }
    },
    {
      name: 'Clinical workspace',
      use: 'A record opened for a task: a patient banner, record tabs and dense tables.',
      regions: ['Task bar', 'Patient banner (always visible)', 'Record tabs', 'Panel with filterable table', 'Tool row'],
      live: { href: '/examples/welsh-clinical-portal/', label: 'Open a results screen' }
    },
    {
      name: 'Chart summary',
      use: 'A patient’s chart as a set of cards: tasks, trends, team and plan.',
      regions: ['Application bar', 'Patient sidebar', 'Chart tabs and sub-tabs', 'Cards in a responsive grid'],
      live: { href: '/examples/epic-emr-patient-summary-overview-vital-signs/', label: 'Open a chart summary' }
    },
    {
      name: 'Worklist',
      use: 'A list of people or items to work through, with actions above and status columns.',
      regions: ['Toolbar of actions', 'List chooser', 'Table with status columns', 'Legend for marks'],
      live: { href: '/examples/epic-emr-patient-surgical-specialty/', label: 'Open a patient list' }
    }
  ];

  const skeleton = `<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header> <!-- brand, navigation, pickers --> </header>
  <main id="main">
    <h1>Page title</h1>
    <!-- sections and components -->
  </main>
  <footer> <!-- links, legal --> </footer>
</body>`;
</script>

<svelte:head>
  <title>Templates — Lily Design System</title>
  <meta
    name="description"
    content="Whole-page structures built from Lily components: content pages, dashboards and clinical workspaces."
  />
</svelte:head>

<section class="page-intro">
  <h1>Templates</h1>
  <p class="page-intro-tagline">
    A template shows how components, layout and a theme work together on a whole page. Start from the one that is
    closest to your task, then change the content, not the structure.
  </p>
</section>

<section class="prose">
  <StylesNav current="templates" />

  <h2>What a template gives you</h2>
  <ul>
    <li>A skip link, landmarks and one <code>h1</code>, in the right order.</li>
    <li>Regions that collapse sensibly at 320 pixels.</li>
    <li>A place for the picker bar, so readers choose theme, language and text size.</li>
    <li>Examples you can open, inspect and copy.</li>
  </ul>

  <h2>Every page has three parts</h2>
  <ol>
    <li><strong>Top</strong>: skip link, header, navigation. The same across a service.</li>
    <li><strong>Main</strong>: the page’s own content, one <code>main</code> landmark.</li>
    <li><strong>Bottom</strong>: footer and supporting links.</li>
  </ol>
  <pre><code>{skeleton}</code></pre>

  <h2>Choose a template</h2>
  <div class="card-grid">
    {#each templates as t (t.name)}
      <div class="card">
        <h3 class="card-heading">{t.name}</h3>
        <p class="card-description">{t.use}</p>
        <ul class="regions">
          {#each t.regions as r (r)}<li>{r}</li>{/each}
        </ul>
        <p class="card-meta"><a href={t.live.href}>{t.live.label}</a></p>
      </div>
    {/each}
  </div>

  <h2>Rules for every template</h2>
  <ul>
    <li>The skip link is the first focusable element, and the first thing a keyboard user can reach.</li>
    <li>Landmarks are used once each, and labelled when repeated (two navigations are named).</li>
    <li>A bar fixed to an edge sets <code>--lily-fixed-bar-block-start</code> or <code>-end</code>, so focus is never hidden under it.</li>
    <li>Content is never cut off at 320 pixels; wide tables scroll inside their own region.</li>
    <li>All visible text is supplied by the page, so it can be translated, and the page honours the reader’s language direction.</li>
    <li>A page whose job is a record (a patient, a case) keeps the identifying banner visible and in words.</li>
  </ul>

  <h2>Make it yours</h2>
  <p>
    Choose a theme, add a brand overlay for your colours, supply your own logo as a link to the home page, and swap in
    your content. The templates carry no logo and no brand text of their own.
  </p>

  <div class="callout">
    <p>The example pages use invented people and data. Nothing in them is clinical advice.</p>
  </div>
</section>

<style>
  .regions {
    margin: 0 0 0.75rem;
    padding-inline-start: 1.25rem;
    font-size: 0.875rem;
  }
</style>
