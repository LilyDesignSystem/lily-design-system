<svelte:head>
  <title>Tutorials — Lily Design System</title>
  <meta
    name="description"
    content="Step-by-step Lily tutorials: your first component, styling, ready-made themes, and preference helpers — for HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Learn Lily, step by step</h1>
  <p class="hero-tagline">
    No prior Lily knowledge needed. Every tutorial builds the same small
    thing — an accessible, styled form — in about 10 minutes, so you can
    compare frameworks apples-to-apples. Then go deeper with theming and
    user preferences.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Before you start</h2>
  <p>You need surprisingly little:</p>
  <ul>
    <li>
      <strong>For the HTML tutorial</strong> — just a browser and a text
      editor. No install, no build step, no account.
    </li>
    <li>
      <strong>For Svelte, React, Vue, Angular, or Nunjucks</strong> —
      <a href="https://git-scm.com/">git</a>, Node 22 or later, and pnpm 10
      or later.
    </li>
    <li>
      <strong>For Blazor</strong> — git and the
      <a href="https://dotnet.microsoft.com/">.NET SDK</a> 8 or later.
    </li>
  </ul>
  <p>
    If Lily's headless approach is new to you, don't worry — each tutorial
    explains what's happening as you go, and every step shows the exact code
    to copy.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">The learning path</p>
    <h2>Four steps from zero to shipped</h2>
  </header>
  <div class="prose" style="margin: 0 auto;">
    <ol>
      <li>
        <strong>Your first component</strong> (~5 minutes) — pick your
        framework below, get the code, and render a Button.
      </li>
      <li>
        <strong>Compose and style</strong> (~5 minutes) — build a labelled
        form and style it against the kebab-case class hooks (part of each
        framework tutorial).
      </li>
      <li>
        <strong>Theme it</strong> (~15 minutes) — swap your hand-written CSS
        for one of the 45 ready-made themes, then let users switch at
        runtime: <a href="/tutorials/theming/">theming tutorial</a>.
      </li>
      <li>
        <strong>Respect preferences</strong> (~15 minutes) — add language and
        text-size selection with the preference helpers:
        <a href="/tutorials/helpers/">helpers tutorial</a>.
      </li>
    </ol>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Steps 1 and 2</p>
    <h2>Pick your framework</h2>
  </header>
  <div class="card-grid">
    <a class="card" href="/tutorials/html/">
      <h3 class="card-heading">HTML</h3>
      <p class="card-description">No build step, no install — copy semantic HTML with the class hooks and go.</p>
      <p class="card-meta">~10 minutes · easiest start</p>
    </a>
    <a class="card" href="/tutorials/svelte/">
      <h3 class="card-heading">Svelte</h3>
      <p class="card-description">Svelte 5 runes, snippets, and <code>bind:value</code> two-way binding.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/react/">
      <h3 class="card-heading">React</h3>
      <p class="card-description">Function components with <code>value</code> + <code>onChange</code> and rest-prop spread.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/vue/">
      <h3 class="card-heading">Vue</h3>
      <p class="card-description">Vue 3 single-file components with <code>v-model</code> support.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/angular/">
      <h3 class="card-heading">Angular</h3>
      <p class="card-description">Angular 20 standalone components with signal inputs and <code>[(value)]</code>.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/blazor/">
      <h3 class="card-heading">Blazor</h3>
      <p class="card-description">Razor components with parameters, <code>ChildContent</code>, and bUnit tests.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/nunjucks/">
      <h3 class="card-heading">Nunjucks</h3>
      <p class="card-description">Server-rendered macros for Eleventy and any Node templating pipeline.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
  </div>
  <p class="prose" style="margin: 0 auto;">
    Can't decide? Start with <a href="/tutorials/html/">HTML</a> — it teaches
    the class-hook contract that every other framework shares, and there is
    nothing to install.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Steps 3 and 4</p>
    <h2>Go deeper</h2>
  </header>
  <div class="card-grid">
    <a class="card" href="/tutorials/theming/">
      <h3 class="card-heading">Theming</h3>
      <p class="card-description">
        Link one of 45 ready-made themes — NHS, GOV.UK, USWDS, light, dark,
        and more — override it with your own CSS, and add runtime theme
        switching with the theme-select helper.
      </p>
      <p class="card-meta">~15 minutes</p>
    </a>
    <a class="card" href="/tutorials/helpers/">
      <h3 class="card-heading">Preference helpers</h3>
      <p class="card-description">
        Give users control of language and text size with locale-select and
        text-size-select: native selects with persistence, SSR safety, and
        automatic RTL detection.
      </p>
      <p class="card-meta">~15 minutes</p>
    </a>
  </div>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>After the tutorials</h2>
  <ul>
    <li>
      Browse the <a href="/components/">component catalog</a> — every
      component documents its props, ARIA contract, and keyboard behaviour.
    </li>
    <li>
      Clone an <a href="/examples/">example app</a> to see all the pieces
      working together with full styling.
    </li>
    <li>
      Stuck? The <a href="/help/">help page</a> has troubleshooting, an FAQ,
      and ways to reach a human. Something confusing in a tutorial is a bug —
      <a href="https://github.com/LilyDesignSystem">open an issue</a> and
      we'll fix the tutorial.
    </li>
  </ul>
</section>
