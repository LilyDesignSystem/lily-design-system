<svelte:head>
  <title>Theming tutorial — Lily Design System</title>
  <meta name="description" content="Theme Lily three ways: link one of 45 ready-made themes, override it with your CSS, and add runtime theme switching with the theme-select helper." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Theming</h1>
  <p class="hero-tagline">
    Lily components carry stable class hooks and zero CSS — so a theme is
    just a stylesheet. This tutorial goes from "link one file" to "let the
    user switch themes at runtime, persisted".
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Step 1 — Link a ready-made theme</h2>
  <p>
    The <a href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes">themes/</a>
    directory ships 45 standalone stylesheets. Copy them into your app's
    static assets and link one:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-england-for-patients.css" />`}</code></pre>
  <p>Highlights of the set:</p>
  <ul>
    <li>
      <strong>Public sector</strong> — NHS England / Scotland / Wales, each
      in patient-facing and practitioner-facing variants; GOV.UK
      (<code>united-kingdom-government-digital-service</code>); USWDS
      (<code>united-states-web-design-system</code>).
    </li>
    <li><strong>Vendor-inspired</strong> — <code>adobe-spectrum</code>, <code>mozilla-protocol</code>.</li>
    <li>
      <strong>General purpose</strong> — <code>light</code>, <code>dark</code>,
      <code>nord</code>, <code>dracula</code>, <code>wireframe</code>,
      <code>corporate</code>, <code>synthwave</code>, and many more.
    </li>
  </ul>

  <h2>Step 2 — Override anything</h2>
  <p>
    Theme selectors are wrapped in <code>:where(...)</code>, which has zero
    specificity — so any rule you write wins, no <code>!important</code>
    needed:
  </p>
  <pre><code>{`/* After the theme link: your brand button, everything else themed */
.button {
  background: #7c3aed;
  border-radius: 9999px;
}`}</code></pre>

  <h2>Step 3 — Runtime switching with theme-select</h2>
  <p>
    The <code>theme-select</code> helper is a native
    <code>&lt;select&gt;</code> that owns the whole theme lifecycle: it loads
    the chosen stylesheet by swapping one managed <code>&lt;link&gt;</code>
    (only the active theme is ever fetched), sets
    <code>data-theme="&#123;slug&#125;"</code> on the document, and optionally
    persists to <code>localStorage</code>. Svelte shown here; React, Vue,
    Angular, HTML, Nunjucks, and Blazor ports match contract-for-contract:
  </p>
  <!-- `<` + `script>` keeps the literal tag out of the Svelte compiler's view. -->
  <pre><code>{`<` + `script>
  import ThemeSelect from "lily-design-system-svelte-theme-select";
</` + `script>

<ThemeSelect
  label="Theme"
  themesUrl="/themes/"
  themes={["light", "dark", "nord", "wireframe"]}
  storageKey="my-app-theme"
/>`}</code></pre>
  <p>
    That's the whole integration. Keyboard behaviour is the native select's;
    the control itself is headless (class hook
    <code>.theme-select</code>), so it picks up whatever theme is active.
  </p>

  <h2>Step 4 — React to the theme in your own CSS</h2>
  <p>
    Because the helper sets <code>data-theme</code> on the document root,
    your own styles can branch on it:
  </p>
  <pre><code>{`[data-theme="dark"] .site-logo { filter: invert(1); }`}</code></pre>

  <h2>Notes for server rendering</h2>
  <p>
    The helper performs all DOM writes inside the framework's mount/effect
    lifecycle, so it is SSR-safe by construction. To avoid a first-paint
    flash, render the initial theme's <code>&lt;link&gt;</code> and
    <code>data-theme</code> on the server (for example from a cookie) — the
    Svelte helper repo ships a runnable SvelteKit cookie example, and the
    other catalogs document the same pattern for their stacks.
  </p>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — the same pattern for language and text size.</li>
    <li>
      Contribute a theme — each is one standalone stylesheet targeting the
      class hooks; see <a href="/help/#contributing">contributing</a>.
    </li>
  </ul>
</section>
