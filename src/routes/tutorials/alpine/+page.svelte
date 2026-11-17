<svelte:head>
  <title>Alpine.js tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's Alpine.js headless snippets and one plugin." />
</svelte:head>

<section class="page-intro">
  <h1>Alpine.js tutorial</h1>
  <p class="page-intro-tagline">
    Lily for Alpine is HTML snippets you paste into your page, plus one
    plugin that gives the interactive ones their keyboard and state.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small settings form: two labelled fields, a switch, and a save button,
    with real keyboard and screen-reader behaviour, first bare, then styled,
    in about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need Node.js and a page that already loads Alpine.js 3. Alpine has no
    component model, so a Lily component here is markup you copy, not an
    import.
  </p>

  <h2>Step 1 — Install and register the plugin</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npm install alpinejs @lilydesignsystem/alpine-headless`}</code></pre>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<` + `script type="module">
  import Alpine from "alpinejs";
  import lily from "@lilydesignsystem/alpine-headless/plugin";
  Alpine.plugin(lily);
  Alpine.start();
</` + `script>`}</code></pre>
  <p>
    The plugin registers one <code>Alpine.data()</code> behaviour per
    interactive component, named <code>lily</code> plus the component's name:
    <code>lilySwitchButton</code>, <code>lilyTabs</code>,
    <code>lilyCombobox</code>. The snippets for every component are in the
    package's <code>components/</code> folder, each with a header comment
    giving its element, class hook, keys and ARIA.
  </p>

  <h2>Step 2 — Your first component</h2>
  <p>Most components are plain markup and need nothing from the plugin:</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<button class="button" type="submit">Save</button>`}</code></pre>
  <p>An interactive one adds its behaviour with <code>x-data</code> and binds it with <code>x-bind</code>:</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<button
  class="switch-button"
  x-data="lilySwitchButton(false)"
  x-bind="button"
  aria-label="Email me about appointments"
>
  Email me about appointments
</button>`}</code></pre>
  <p>
    The behaviour gives it <code>role="switch"</code> and keeps
    <code>aria-checked</code> in step as Enter, Space or a click toggles it.
    The words are yours: Lily never supplies a label.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<form class="form" aria-label="Settings">
  <div class="field">
    <label class="label" for="name">Full name</label>
    <input class="text-input" type="text" id="name" name="name" autocomplete="name" required />
  </div>
  <div class="field">
    <label class="label" for="email">Email</label>
    <input class="email-input" type="email" id="email" name="email" autocomplete="email" required />
  </div>
  <button
    class="switch-button"
    type="button"
    x-data="lilySwitchButton(true)"
    x-bind="button"
    aria-label="Email me about appointments"
  >
    Email me about appointments
  </button>
  <button class="button" type="submit">Save</button>
</form>`}</code></pre>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> open the page and press
      <kbd>Tab</kbd>. Focus moves through both fields, the switch and the
      button. On the switch, <kbd>Space</kbd> toggles it, and a screen reader
      says "switch, on" or "off". It looks plain, which is right: the look is
      next.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>Link one of the 63 ready-made themes, which target the same class hooks:</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<link rel="stylesheet" href="/themes/light.css" />`}</code></pre>
  <p>Or write your own CSS against the hooks and the state the behaviour sets:</p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`.switch-button[aria-checked="true"] { background: var(--color-primary); }
.switch-button:focus-visible { outline: 2px solid var(--lily-focus-ring); outline-offset: 2px; }`}</code></pre>
  <p>
    Style the ARIA state, not a class of your own: then the look can never
    disagree with what a screen reader hears.
  </p>

  <h2>Step 5 — See it all working</h2>
  <ul>
    <li>
      The Alpine.js example app, <code>lily-design-system-alpine-examples</code>,
      shows every component styled: <code>pnpm install &amp;&amp; pnpm run build</code>.
    </li>
    <li>
      Six helpers ship for Alpine: the data grid, kanban board, calendar,
      Gantt chart and the Markdown and Org editors
      (<code>@lilydesignsystem/alpine-*</code>).
    </li>
  </ul>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/training/">Training</a> — eight modules, each with an exercise and a self-check.</li>
    <li><a href="/tutorials/forms/">Accessible forms</a> — errors, an error summary and focus.</li>
    <li><a href="/tutorials/theming/">Theming</a> — runtime theme switching.</li>
    <li><a href="/components/">Component catalog</a> — the full reference.</li>
  </ul>
</section>
