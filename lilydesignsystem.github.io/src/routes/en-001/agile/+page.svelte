<script lang="ts">
  const values = [
    {
      value: 'People and their interactions over processes and tools',
      lily: 'A shared vocabulary lets designers, developers and testers say the same thing: a component name, a token, a class hook. Conversations start from the real component, not from a screenshot.'
    },
    {
      value: 'Working software over comprehensive documentation',
      lily: 'Every component page has a live demo and a real usage example. The documentation is generated from, and tested against, the code, so it cannot drift far from what works.'
    },
    {
      value: 'Customer collaboration over contract negotiation',
      lily: 'Stakeholders can open a working page and change the theme, language and text size themselves, so feedback is about the real thing early, not about a specification later.'
    },
    {
      value: 'Responding to change over following a plan',
      lily: 'A brand change is a theme or an overlay of a few lines, not a rewrite. Components carry no colour, spacing or type, so a visual decision can change late and cheaply.'
    }
  ];

  const principles = [
    {
      p: 'Deliver early and continuously',
      lily: 'Start with one page and one theme. Add a component family at a time. Nothing needs to be adopted all at once.'
    },
    {
      p: 'Welcome changing requirements',
      lily: 'Tokens, themes and brand overlays keep visual change away from the components.'
    },
    {
      p: 'Deliver working software frequently',
      lily: 'Copy a worked example (a form, a data table, a dashboard) and have a testable page the same day.'
    },
    {
      p: 'Business people and developers work together daily',
      lily: 'The same example pages serve both: a product owner reads the page, a developer reads its markup.'
    },
    {
      p: 'Build around motivated people and trust them',
      lily: 'Plain HTML, CSS and your own framework. No new build system and no new language to learn.'
    },
    {
      p: 'Face-to-face is the best conversation',
      lily: 'A demo page you can share on a call settles a design argument faster than a document.'
    },
    {
      p: 'Working software is the measure of progress',
      lily: 'Progress is a page that works, passes its tests and can be used with a keyboard.'
    },
    {
      p: 'Sustainable pace',
      lily: 'Accessibility, keyboard behaviour and internationalisation are done once in the component, not re-done per team under deadline.'
    },
    {
      p: 'Continuous attention to technical excellence and good design',
      lily: 'Semantic HTML first, ARIA only where needed, strict tests and a documented contract for each component.'
    },
    {
      p: 'Simplicity: the art of maximising the work not done',
      lily: 'No stylesheet to maintain, no icon library to curate, no framework lock-in. You write less.'
    },
    {
      p: 'Self-organising teams make the best designs',
      lily: 'A team owns its theme and its overlay. Nothing forces one look on every team.'
    },
    {
      p: 'Reflect and adjust regularly',
      lily: 'Each component records known limitations, so a retrospective starts from a list, not from memory.'
    }
  ];
</script>

<svelte:head>
  <title>Lily and agile — Lily Design System</title>
  <meta
    name="description"
    content="How the values and principles of the Agile Manifesto show up in Lily, and a way to try Lily in a single sprint."
  />
</svelte:head>

<section class="page-intro">
  <h1>Lily and agile</h1>
  <p class="page-intro-tagline">
    If your team works in short cycles, the part of the interface that slows you down is usually the part nobody wants
    to re-decide every sprint: forms, tables, navigation, accessibility. Lily decides those once so the team can
    spend its sprint on the product.
  </p>
</section>

<section class="prose">
  <h2>Why try it</h2>
  <ul>
    <li><strong>Faster first increment.</strong> A working, accessible page from components and a theme, in an afternoon.</li>
    <li><strong>Cheaper change.</strong> Visual change lives in a theme, so a late brand decision is not a late rewrite.</li>
    <li><strong>Less rework.</strong> Keyboard, screen-reader and language support are in the components, so they do not reappear as defects at the end.</li>
    <li><strong>No lock-in.</strong> It is plain markup with class hooks. You can adopt one component and stop.</li>
  </ul>

  <h2>The four values</h2>
  <p>
    The Agile Manifesto (2001) states four values: this over that, where the second still has value, but the first has
    more. We paraphrase them here; read the original at <a href="https://agilemanifesto.org/">agilemanifesto.org</a>.
  </p>
  <div class="scroll" role="region" aria-label="Agile values and Lily" tabindex="0">
    <table>
      <caption>The four values and what Lily does with each</caption>
      <thead><tr><th scope="col">Value</th><th scope="col">In Lily</th></tr></thead>
      <tbody>
        {#each values as v (v.value)}
          <tr><th scope="row">{v.value}</th><td>{v.lily}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>The twelve principles</h2>
  <p>The principles are paraphrased in short form below. The full text is on the manifesto’s own site.</p>
  <div class="scroll" role="region" aria-label="Agile principles and Lily" tabindex="0">
    <table>
      <caption>The twelve principles and what Lily does with each</caption>
      <thead><tr><th scope="col">Principle</th><th scope="col">In Lily</th></tr></thead>
      <tbody>
        {#each principles as p (p.p)}
          <tr><th scope="row">{p.p}</th><td>{p.lily}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Try it in one sprint</h2>
  <ol>
    <li><strong>Day 1.</strong> Pick one story that needs a form or a table. Open its component page and the matching example, and choose a theme with the picker.</li>
    <li><strong>Day 2.</strong> Install the headless package for your framework and render the component. Compare it with the live demo.</li>
    <li><strong>Day 3.</strong> Add your own wording (every string is a prop) and check it with a keyboard only.</li>
    <li><strong>Review.</strong> Show the page to the product owner. Ask: what did this save, and what was missing?</li>
    <li><strong>Retrospective.</strong> Decide whether to adopt another family. Record the decision.</li>
  </ol>
  <p>
    Start at <a href="/getting-started/">getting started</a>, then see the <a href="/components/">components</a> and the
    <a href="/en-001/templates/">page templates</a>.
  </p>

  <h2>Where it does not help</h2>
  <ul>
    <li>Lily is not a process. It does not run your ceremonies or manage your backlog.</li>
    <li>It does not do user research. A component that works for one audience may not suit yours.</li>
    <li>A team with a strict brand needs design time to write its theme or overlay.</li>
  </ul>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
</style>
