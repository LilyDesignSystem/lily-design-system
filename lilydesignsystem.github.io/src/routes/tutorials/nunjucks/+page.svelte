<svelte:head>
  <title>Nunjucks tutorial — Lily Design System</title>
  <meta name="description" content="Build accessible, styled, server-rendered pages with Lily's Nunjucks macros — ideal for Eleventy." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Nunjucks tutorial</h1>
  <p class="hero-tagline">
    Server-rendered macros for Eleventy, Express, or any Node templating
    pipeline — the GOV.UK-style approach, with Lily's catalog and class hooks.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small server-rendered contact form — labelled input, submit button,
    zero JavaScript payload — first bare, then styled, in about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need git, Node 22 or later, and pnpm 10 or later. Any Nunjucks
    pipeline works — Eleventy, Express, or plain Nunjucks.
  </p>

  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-nunjucks-headless
cd lily-design-system-nunjucks-headless
pnpm install
pnpm test        # vitest rendering every macro`}</code></pre>
  <p>
    Each component is a directory in <code>components/</code> with a
    <code>macro.njk</code>, its test, and its docs — for example
    <code>components/button/macro.njk</code>. Point your Nunjucks loader at
    <code>components/</code> (in Eleventy, add it to the includes path) and
    import what you need.
  </p>

  <h2>Step 2 — Your first component</h2>
  <pre><code>{`{% from "components/button/macro.njk" import button %}

{{ button({ text: "Save", type: "submit" }) }}`}</code></pre>
  <p>
    Renders <code>&lt;button class="button" type="submit"&gt;Save&lt;/button&gt;</code>.
    Macros take a single params object: <code>text</code> (escaped) or
    <code>html</code> (raw), <code>type</code>, <code>label</code> for an
    <code>aria-label</code>, and a class hook appender.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`{% from "components/form/macro.njk" import form %}
{% from "components/label/macro.njk" import label %}
{% from "components/text-input/macro.njk" import textInput %}
{% from "components/button/macro.njk" import button %}

<form class="form" method="post">
  <div class="field">
    {{ label({ for: "name", text: "Full name" }) }}
    {{ textInput({ id: "name", name: "name", required: true }) }}
  </div>
  {{ button({ text: "Save", type: "submit" }) }}
</form>`}</code></pre>
  <p>
    Because everything renders on the server, there is no hydration and no
    JavaScript payload — just semantic HTML with the class hooks.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> load the page and the form looks
      plain — that's correct! No CSS has shipped yet. But press
      <kbd>Tab</kbd>: focus moves through every control, the label is
      announced, and submit works. The behaviour is done; the look is yours,
      and it's next.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>
    Style the hooks — <code>.button</code>, <code>.text-input</code>,
    <code>.label</code>, <code>.field</code> — in your stylesheet, or link a
    ready-made theme in your base layout:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/united-kingdom-government-digital-service.css" />`}</code></pre>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">Nunjucks + Eleventy example app</a> builds the
    full catalog as a static site with per-component demo pages:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-nunjucks-eleventy-examples
cd lily-design-system-nunjucks-eleventy-examples
pnpm install && pnpm run dev`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — including the Eleventy cookie pattern for no-flash SSR theme switching.</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — props, ARIA, and keyboard per component.</li>
  </ul>
  <p>
    Stuck, or was a step confusing? That's a bug in the tutorial — check the
    <a href="/help/#troubleshooting">troubleshooting guide</a> or
    <a href="https://github.com/LilyDesignSystem">open an issue</a>.
  </p>
</section>
