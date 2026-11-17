<svelte:head>
  <title>Web Components tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's native custom elements, with no framework." />
</svelte:head>

<section class="page-intro">
  <h1>Web Components tutorial</h1>
  <p class="page-intro-tagline">
    Native custom elements with no framework runtime. Each renders a real
    <code>&lt;button&gt;</code> or <code>&lt;input&gt;</code> in the light DOM,
    so forms, CSS and <code>querySelector</code> work as on hand-written HTML.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small contact form with labelled fields and a submit button, wired with
    a few lines of script, first bare, then styled, in about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need Node.js and a bundler or any setup that resolves bare module
    imports. The catalog covers 602 of the 637 components; the table
    sub-elements and a few list-item families are left out, because an
    autonomous custom element cannot stand in for a <code>&lt;tr&gt;</code>
    or an <code>&lt;li&gt;</code>.
  </p>

  <h2>Step 1 — Install and register</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`npm install @lilydesignsystem/web-components-headless`}</code></pre>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<` + `script type="module">
  import "@lilydesignsystem/web-components-headless";
</` + `script>`}</code></pre>
  <p>
    Importing the package defines every element, each named
    <code>lily-</code> plus the component's slug:
    <code>&lt;lily-button&gt;</code>, <code>&lt;lily-text-input&gt;</code>,
    <code>&lt;lily-range-fieldset&gt;</code>.
  </p>

  <h2>Step 2 — Your first component</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<lily-button type="submit">Send</lily-button>`}</code></pre>
  <p>
    The element renders a real <code>&lt;button class="button"&gt;</code>
    inside itself, so Enter, Space and the button role are native. Attributes
    you add pass through to that inner element.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<lily-form label="Contact us">
  <lily-field label="Full name" required>
    <lily-text-input label="Full name" name="name" autocomplete="name" required></lily-text-input>
  </lily-field>
  <lily-field label="Email" required>
    <lily-email-input label="Email" name="email" required></lily-email-input>
  </lily-field>
  <lily-button type="submit">Send</lily-button>
</lily-form>

<` + `script type="module">
  const form = document.querySelector("lily-form form");
  form.addEventListener("submit", () => {
    const data = new FormData(form);
    console.log(Object.fromEntries(data));
  });
</` + `script>`}</code></pre>
  <p>
    <code>&lt;lily-form&gt;</code> prevents the page navigation and lets the
    <code>submit</code> event bubble, so your script decides what happens.
    The inputs are genuine form controls, so <code>FormData</code> reads them.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> press <kbd>Tab</kbd> through the form,
      then submit it: the console shows <code>name</code> and
      <code>email</code>. Leave a field empty and the browser's own
      <code>required</code> check stops the submit.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>
    The class hooks sit on the inner elements, so the 63 themes and your own
    CSS target them as on plain HTML:
  </p>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<link rel="stylesheet" href="/themes/light.css" />

<style>
  .button { padding: 0.75rem 1.5rem; }
  lily-field { display: block; margin-block-end: 1rem; }
</style>`}</code></pre>
  <p>
    There is no shadow DOM to pierce: nothing is hidden from your stylesheet
    or from assistive technology.
  </p>

  <h2>Step 5 — See it all working</h2>
  <ul>
    <li>Every element has a story: <code>pnpm run storybook</code> in <code>lily-design-system-web-components-headless</code>.</li>
    <li>
      The helpers ship as custom elements too:
      <code>&lt;lily-theme-picker&gt;</code>, the data grid, the calendar and
      the others (<code>@lilydesignsystem/web-components-*</code>).
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
