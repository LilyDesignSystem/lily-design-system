<svelte:head>
  <title>How the pieces fit — Lily Design System</title>
  <meta
    name="description"
    content="The layers of Lily and what each owns: headless components, helpers, themes, examples, and skills — and when to reach for each."
  />
</svelte:head>

<section class="page-intro">
  <h1>How the pieces fit</h1>
  <p class="page-intro-tagline">
    Lily is a stack of layers. Each owns one job and nothing else, so you can
    adopt one without the others.
  </p>
</section>

<section class="prose">
  <h2>The layers</h2>
  <ul>
    <li>
      <strong>Catalog</strong> — 571 named components in
      <code>components.tsv</code>, each with a slug, a root HTML element, ARIA
      and a keyboard contract. It is the shared vocabulary every other layer
      is built from. Reach for it to learn what exists and what it is called.
    </li>
    <li>
      <strong>Headless</strong> — the catalog as unstyled, accessible
      components in your framework: HTML, Svelte, React, Vue, Angular, Blazor,
      Nunjucks, Web Components and Alpine.js. It owns semantic markup, ARIA,
      focus and keyboard behaviour; it owns no colour, spacing or text. Reach
      for it when you build your own interface.
    </li>
    <li>
      <strong>Helpers</strong> — packages that each own one whole interaction:
      the pickers (theme, locale, text size, motion, share, search, links,
      menu, settings, date and time), <code>picker-bar</code>, and the data
      grid, kanban board, calendar, Gantt chart and filter. Reach for a helper
      when the interaction is the product, not just a part.
    </li>
    <li>
      <strong>Themes</strong> — 57 plain stylesheets that dress the class
      hooks. Reach for one to see the components styled, or as the start of
      your own.
    </li>
    <li>
      <strong>Examples</strong> — complete styled apps, one per framework,
      with a live page for every component. Reach for them to see the system
      working end to end before you commit.
    </li>
    <li>
      <strong>Skills</strong> — instructions for AI coding agents, one set per
      framework layer. Reach for them when an agent writes the code.
    </li>
  </ul>

  <h2>Which one do I need?</h2>
  <ul>
    <li>I want to try it: open an <a href="/examples/">example</a>.</li>
    <li>I am building an interface: use the headless package for my framework, then a theme or my own CSS.</li>
    <li>I need a date field, a language switch or a data grid: use that helper.</li>
    <li>I want an agent to write it: install the skill for my framework.</li>
  </ul>
  <p>
    The rules each layer follows are in the
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/index.md">specification</a>.
  </p>
</section>
