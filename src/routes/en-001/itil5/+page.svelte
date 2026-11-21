<script lang="ts">
  const productLed = [
    ['Treat the design system as a product', 'Versioned packages, a changelog, a roadmap and a published quality page, so the users of your components can plan upgrades.'],
    ['Ship features faster', 'Components, themes and examples are ready, so the product team spends its time on what makes the product different.'],
    ['Measure adoption and quality', 'Coverage figures, mutation scores and accessibility sweeps are generated and published, not asserted.'],
    ['Keep one experience across products', 'One theme and one set of tokens across several products, each with its own brand overlay.']
  ];
  const serviceLed = [
    ['Self-service request portals', 'Forms with an error summary that takes focus, labelled fields, and a status the user can read in words.'],
    ['Incident and status communication', 'Notifications, status lights and banners that announce what changed, with text as well as colour.'],
    ['Service catalogue and knowledge base', 'Searchable lists, contents navigation and cards that make a catalogue easy to scan with a keyboard.'],
    ['Operational dashboards and queues', 'A data grid, a kanban board, a calendar and a Gantt chart for queues, changes and schedules.'],
    ['Global and multilingual service desks', 'No built-in English: every label is yours, with label packs in 64 languages as a starting point (63 are unreviewed drafts).']
  ];
</script>

<svelte:head>
  <title>Lily and ITIL — Lily Design System</title>
  <meta
    name="description"
    content="Where Lily helps teams doing product-led and service-led work, and how to try it."
  />
</svelte:head>

<section class="page-intro">
  <h1>Lily and ITIL 5</h1>
  <p class="page-intro-tagline">
    Service management is about the value people get from products and services, and much of that value reaches
    them through an interface. Lily is a way to make that interface consistent, accessible and cheap to change.
  </p>
</section>

<section class="prose">
  <h2>About ITIL (Version 5)</h2>
  <p>
    ITIL (Version 5) was released by its publisher in February 2026. In the publisher’s and trainers’ summaries, it
    moves the framework from managing services to managing <em>products and services together</em>, through a
    product and service lifecycle model that joins discovery, design, delivery, operation and improvement. Commentators
    also point to new material on the experience of the people involved and on governing AI. Much of the earlier structure,
    such as the guiding principles and the management practices, is reported as continuing.
  </p>
  <p>
    We do not reproduce the framework. Read it from its publisher at <a href="https://www.peoplecert.org/itil-version-5-explained">PeopleCert</a>
    and the ITIL architects’ <a href="https://itil.com/Itil-News-and-Announcements/itil-version-5-foundation-whats-new-guide">what’s new guide</a>,
    and check any detail you rely on against the official publication. ITIL® is a registered trademark of its owner; this page
    is an independent view and is not endorsed by, or affiliated with, the publisher.
  </p>

  <h2>Why a developer should try Lily</h2>
  <ul>
    <li>It removes a class of recurring work: the forms, tables and navigation that every service needs.</li>
    <li>It makes the user’s experience of a service accessible by default, which is a quality attribute you can test.</li>
    <li>It keeps the service’s look in a theme, so a rebrand or a new tenant does not touch the components.</li>
  </ul>

  <h2>Product-led work</h2>
  <p>
    When a team owns a product, the interface is part of what it ships. Lily helps the team treat that interface like any
    other product asset.
  </p>
  <div class="scroll" role="region" aria-label="Product-led work and Lily" tabindex="0">
    <table>
      <caption>Product-led needs and what Lily offers</caption>
      <thead><tr><th scope="col">Need</th><th scope="col">What Lily offers</th></tr></thead>
      <tbody>
        {#each productLed as r (r[0])}<tr><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>

  <h2>Service-led work</h2>
  <p>
    When a team runs a service, the interface is how users request, understand and trust it. These are the screens a
    service usually needs, and the components Lily has for each.
  </p>
  <div class="scroll" role="region" aria-label="Service-led work and Lily" tabindex="0">
    <table>
      <caption>Service-led needs and what Lily offers</caption>
      <thead><tr><th scope="col">Need</th><th scope="col">What Lily offers</th></tr></thead>
      <tbody>
        {#each serviceLed as r (r[0])}<tr><th scope="row">{r[0]}</th><td>{r[1]}</td></tr>{/each}
      </tbody>
    </table>
  </div>

  <h2>Across the lifecycle</h2>
  <p>
    A product and service lifecycle runs from discovery to improvement. The table is a way to think about where an
    interface library helps; it is not part of the framework.
  </p>
  <div class="scroll" role="region" aria-label="Lifecycle stages and Lily" tabindex="0">
    <table>
      <caption>Lifecycle stages and where Lily helps</caption>
      <thead><tr><th scope="col">Stage</th><th scope="col">Where Lily helps</th></tr></thead>
      <tbody>
        <tr><th scope="row">Discover</th><td>Prototype a screen from real components and show it to users in an afternoon.</td></tr>
        <tr><th scope="row">Design</th><td>Choose a theme, set tokens, and write the words; the keyboard and screen-reader behaviour is already decided.</td></tr>
        <tr><th scope="row">Deliver</th><td>Parity across frameworks and strict tests give you a steady base for continuous delivery.</td></tr>
        <tr><th scope="row">Operate</th><td>Status, notification and dashboard components for the people who run the service.</td></tr>
        <tr><th scope="row">Improve</th><td>Known limitations per component, and quality figures you can track over time.</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Try it</h2>
  <ol>
    <li>Pick one request form or one status page in a service you run.</li>
    <li>Rebuild it from Lily components in your own framework (<a href="/getting-started/">getting started</a>).</li>
    <li>Choose a theme and a language; give the form to a keyboard-only user and a screen-reader user.</li>
    <li>Record what changed in effort, defects and user feedback, and decide on the next step.</li>
  </ol>

  <h2>Where it does not help</h2>
  <ul>
    <li>Lily is not a service management tool. It has no ticketing, workflow engine or configuration database.</li>
    <li>It does not replace your own governance, or an assessment of your service.</li>
    <li>It has one maintainer and no support contract today; plan for that. See the <a href="/en-001/accessibility-statement/">accessibility statement</a> for what is and is not verified.</li>
  </ul>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
</style>
