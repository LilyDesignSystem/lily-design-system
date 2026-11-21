<script lang="ts">
  const principles = [
    ['Continued business justification', 'Adopting Lily is a business case: fewer hours on common components, fewer accessibility defects, cheaper rebrands. Measure it in a pilot, and stop if it does not pay.'],
    ['Learn from experience', 'Each component records known limitations; keep your own lessons beside them.'],
    ['Defined roles and responsibilities', 'Name who owns the theme, who owns the content and wording, and who owns accessibility testing.'],
    ['Manage by stages', 'Adopt in stages: one journey, then one component family at a time. Each stage ends with a decision.'],
    ['Manage by exception', 'Set tolerances: a stage continues while tests pass and the pilot stays within its effort. Escalate when it does not.'],
    ['Focus on products', 'Each component has a written contract and acceptance criteria. Use them as product descriptions.'],
    ['Tailor to suit the project', 'Adopt only what you need. One component or one theme is a valid project.']
  ];
  const tools = [
    ['Plan stages and work packages', 'The Gantt chart helper, with dependencies and an optional critical path.'],
    ['Track work through states', 'The kanban board helper; cards move by drag and by a keyboard move menu, never by drag alone.'],
    ['Show milestones and reviews', 'The calendar helper, with week, rolling four-week and month views.'],
    ['Log risks and issues', 'The data grid helper: sortable, filterable, exportable, with a keyboard model.'],
    ['Report progress', 'Charts and statistics components, always with a text equivalent or table.']
  ];
</script>

<svelte:head>
  <title>Lily and PRINCE2 — Lily Design System</title>
  <meta
    name="description"
    content="How a PRINCE2 project can adopt Lily, with a stage plan, a business case, a risk list and the project-management helpers Lily ships."
  />
</svelte:head>

<section class="page-intro">
  <h1>Lily and PRINCE2</h1>
  <p class="page-intro-tagline">
    If you run projects with a defined method, adopting a design system is itself a small project. This page shows how
    Lily fits a controlled, staged, product-focused approach, and offers its project-management components for your own tools.
  </p>
</section>

<section class="prose">
  <h2>About PRINCE2</h2>
  <p>
    PRINCE2 is a project management method built on principles, people, practices, processes and the project context. Its
    seventh edition (2023) keeps that structure, adds a chapter on people, and brings in digital and data, commercial and
    sustainability material. The principles are the test of whether a project is really run under the method.
  </p>
  <p>
    We do not reproduce the method. Read it from the publisher, <a href="https://www.peoplecert.org/news-and-announcements/2023/new-prince2-7">PeopleCert</a>,
    and check any detail against the official guidance. PRINCE2® is a registered trademark of its owner; this page is an independent
    view and is not endorsed by, or affiliated with, the publisher. The principles below are paraphrased in short form.
  </p>

  <h2>Why a developer or project manager should try Lily</h2>
  <ul>
    <li>It reduces the amount of product to be built: the common components already exist, with tests.</li>
    <li>Its quality evidence is published, so a quality plan can point at it.</li>
    <li>It can be adopted in small, reversible stages, which suits a controlled project.</li>
    <li>Its project-management components (Gantt, kanban, calendar, grid) can be used inside your own tooling.</li>
  </ul>

  <h2>The principles, applied to adopting Lily</h2>
  <div class="scroll" role="region" aria-label="PRINCE2 principles and Lily" tabindex="0">
    <table>
      <caption>PRINCE2 principles and how an adoption project can use them</caption>
      <thead><tr><th scope="col">Principle</th><th scope="col">For an adoption project</th></tr></thead>
      <tbody>
        {#each principles as r (r[0])}<tr><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>

  <h2>A stage plan you can copy</h2>
  <ol>
    <li><strong>Start up.</strong> Name the sponsor, the owner of the theme, and the owner of accessibility testing. Agree the tolerance for the pilot.</li>
    <li><strong>Stage 1: pilot.</strong> One journey rebuilt with Lily components. Exit when its tests pass, it works with a keyboard and a screen reader, and effort stayed in tolerance.</li>
    <li><strong>Stage 2: first family.</strong> Move forms (or navigation). Keep the old components until the last use is gone.</li>
    <li><strong>Further stages.</strong> One family each, with a stage boundary decision after each.</li>
    <li><strong>Close.</strong> Record the benefits (hours, defects, accessibility results) against the business case, and the lessons.</li>
  </ol>

  <h2>Risks to put in your register</h2>
  <div class="scroll" role="region" aria-label="Risks of adopting Lily" tabindex="0">
    <table>
      <caption>Risks of adoption, with a suggested response</caption>
      <thead><tr><th scope="col">Risk</th><th scope="col">Suggested response</th></tr></thead>
      <tbody>
        <tr><th scope="row">One maintainer and no support contract</th><td>Pin versions, keep a copy, and be ready to fork; the licences allow it.</td></tr>
        <tr><th scope="row">No independent accessibility audit</th><td>Commission your own audit of your service; test with your users’ assistive technology.</td></tr>
        <tr><th scope="row">Translations are unreviewed drafts</th><td>Have a native speaker review every language you ship.</td></tr>
        <tr><th scope="row">The theme does not match the brand</th><td>Allow design time for a brand overlay and check its contrast.</td></tr>
        <tr><th scope="row">The team has to learn new components</th><td>Start with one family and a worked example; keep the stages short.</td></tr>
      </tbody>
    </table>
  </div>
  <p>The <a href="/en-001/accessibility-statement/">accessibility statement</a> and the <a href="/quality/">quality page</a> say what is and is not verified.</p>

  <h2>Project-management components you can use</h2>
  <div class="scroll" role="region" aria-label="Project management helpers" tabindex="0">
    <table>
      <caption>Needs of a project and the Lily helper for each</caption>
      <thead><tr><th scope="col">Need</th><th scope="col">Lily helper</th></tr></thead>
      <tbody>
        {#each tools as r (r[0])}<tr><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>
  <p>See them working in the <a href="/demo/svelte/">dashboard demonstration</a>.</p>

  <h2>Where it does not help</h2>
  <ul>
    <li>Lily is not a project management method or tool; the helpers are components, not a planning system.</li>
    <li>It does not do your business case, governance or assurance for you; see the <a href="/en-001/styles/">style guide</a> and the repository’s assurance pack for what exists.</li>
  </ul>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
</style>
