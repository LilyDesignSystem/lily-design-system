<svelte:head>
  <title>Help — Lily Design System</title>
  <meta
    name="description"
    content="Get started with Lily: install the headless package for your framework, copy a component, style it, theme it, ship it. Troubleshooting, FAQ, and support."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Help</p>
  <h1>Getting started with Lily</h1>
  <p class="hero-tagline">
    Pick a framework, clone the headless repo or the example app, and start
    composing your own pages. Prefer a guided path? Start with the
    <a href="/tutorials/">tutorials</a>.
  </p>
</section>

<nav aria-label="On this page" class="prose" style="margin: 0 auto;">
  <p><strong>On this page:</strong></p>
  <ul>
    <li><a href="#install">Install</a></li>
    <li><a href="#use-headless">Use a headless component</a></li>
    <li><a href="#use-styled">Use a styled example</a></li>
    <li><a href="#styling">Styling and design tokens</a></li>
    <li><a href="#themes">Ready-made themes</a></li>
    <li><a href="#helpers">Preference helpers</a></li>
    <li><a href="#a11y">Accessibility</a></li>
    <li><a href="#i18n">Internationalization</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#troubleshooting">Troubleshooting</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#community">Community and support</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
</nav>

<section class="section prose" id="install" style="margin: 0 auto;">
  <h2>Install</h2>
  <p>
    Lily is published as separate Git repos per framework. The fastest way to try
    it is to clone the headless repo for your stack:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless
cd lily-design-system-react-headless
pnpm install`}</code></pre>
  <p>The same pattern works for the other frameworks:</p>
  <ul>
    <li><code>lily-design-system-html-headless</code> — no install needed; copy <code>.html</code> files</li>
    <li><code>lily-design-system-svelte-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-react-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-vue-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-angular-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-nunjucks-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-blazor-headless</code> — <code>dotnet build</code></li>
  </ul>
  <p>
    The headless libraries are designed to be cloned or vendored — treat the
    source as the source of truth and copy what you need. The
    <a href="#helpers">preference helpers</a> additionally ship as installable
    packages with a build and publish pipeline (npm for the JS frameworks,
    NuGet for Blazor).
  </p>
</section>

<section class="section prose" id="use-headless" style="margin: 0 auto;">
  <h2>Use a headless component</h2>
  <p>
    Headless components ship semantic HTML, ARIA, and props — but no CSS. Here's
    a Button in each framework:
  </p>

  <h3>HTML</h3>
  <pre><code>{`<button class="button" type="button" aria-label="Save">
  Save
</button>`}</code></pre>

  <h3>Svelte</h3>
  <!-- The Svelte compiler scans literal `<script>`/`</script>` even inside template
       literals, so we concatenate `<` + `script>` to render the tags as plain text
       in the rendered code sample without triggering the parser. -->
  <pre><code>{`<` + `script>
  import Button from "lily-design-system-svelte-headless/components/Button/Button.svelte";
</` + `script>

<Button onclick={save}>Save</Button>`}</code></pre>

  <h3>React</h3>
  <pre><code>{`import Button from "lily-design-system-react-headless/components/Button";

<Button onClick={save}>Save</Button>`}</code></pre>

  <h3>Vue</h3>
  <!-- See note above the Svelte sample for why `<` + `script setup>` is split. -->
  <pre><code>{`<` + `script setup>
  import Button from "lily-design-system-vue-headless/components/Button.vue";
</` + `script>

<Button @click="save">Save</Button>`}</code></pre>

  <h3>Angular</h3>
  <pre><code>{`import { Button } from "lily-design-system-angular-headless";

@Component({
  imports: [Button],
  template: \`<lily-button (click)="save()">Save</lily-button>\`,
})`}</code></pre>

  <h3>Blazor</h3>
  <pre><code>{`<Button OnClick="Save">Save</Button>`}</code></pre>

  <h3>Nunjucks</h3>
  <pre><code>{`{% from "components/button/macro.njk" import button %}

{{ button({ text: "Save", type: "button" }) }}`}</code></pre>
</section>

<section class="section prose" id="use-styled" style="margin: 0 auto;">
  <h2>Use a styled example</h2>
  <p>
    The example apps include CSS, routes, and full demo pages. The fastest way
    to experiment is to start the SvelteKit, Next, Nuxt, Analog, or Eleventy
    example app and view the demo at <code>/components</code>.
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples
cd lily-design-system-svelte-sveltekit-examples
pnpm install
pnpm run dev`}</code></pre>
  <p>
    Then open <code>http://localhost:5173</code> and browse <code>/components</code>.
  </p>
</section>

<section class="section prose" id="styling" style="margin: 0 auto;">
  <h2>Styling and design tokens</h2>
  <p>
    Each component renders with a single kebab-case class on its root element.
    For example, <code>&lt;Button&gt;</code> renders <code>&lt;button class="button"&gt;</code>.
    Style it however you like:
  </p>
  <pre><code>{`.button {
  background: var(--my-primary);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
.button:hover { background: var(--my-primary-hover); }`}</code></pre>
  <p>The default Lily color palette (used in the example apps) is:</p>
  <ul>
    <li>Primary: <code>#2563eb</code></li>
    <li>Danger: <code>#dc2626</code></li>
    <li>Warning: <code>#f59e0b</code></li>
    <li>Success: <code>#16a34a</code></li>
    <li>Page background: <code>#f9fafb</code></li>
    <li>Card background: <code>#ffffff</code></li>
  </ul>
  <p>
    These are suggestions, not requirements. Replace them with your own brand
    palette and Lily comes along happily.
  </p>
</section>

<section class="section prose" id="themes" style="margin: 0 auto;">
  <h2>Ready-made themes</h2>
  <p>
    Don't want to write CSS from scratch? Lily ships
    <strong>45 standalone reference themes</strong> in the
    <a href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes">themes/</a>
    directory. Each is one stylesheet targeting the Lily class hooks — link it
    and you're styled:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/united-kingdom-government-digital-service.css" />`}</code></pre>
  <p>The set covers:</p>
  <ul>
    <li>
      <strong>Public sector</strong> — NHS England, NHS Scotland, and NHS Wales
      (patient-facing and practitioner-facing variants each), GOV.UK GDS, and
      the U.S. Web Design System.
    </li>
    <li><strong>Vendor-inspired</strong> — Adobe Spectrum, Mozilla Protocol.</li>
    <li>
      <strong>General purpose</strong> — light, dark, nord, dracula, wireframe,
      and thirty-odd more.
    </li>
  </ul>
  <p>
    Theme selectors use <code>:where(...)</code>, so your own CSS always wins
    on specificity. Pair them with the <code>theme-select</code> helper below
    for runtime switching, or follow the
    <a href="/tutorials/theming/">theming tutorial</a>.
  </p>
</section>

<section class="section prose" id="helpers" style="margin: 0 auto;">
  <h2>Preference helpers</h2>
  <p>
    Each framework has a companion <code>*-helpers</code> catalog with three
    small packages that each own one user preference end to end — selection,
    DOM application, and optional <code>localStorage</code> persistence. Each
    renders a native <code>&lt;select&gt;</code>, is SSR-safe, and ships no CSS:
  </p>
  <ul>
    <li>
      <strong>theme-select</strong> — loads theme stylesheets at runtime by
      swapping a managed <code>&lt;link&gt;</code>, and sets
      <code>data-theme</code> on the document.
    </li>
    <li>
      <strong>locale-select</strong> — sets <code>lang</code> and
      <code>dir</code> (with automatic RTL detection) so your i18n library
      can follow; performs no translation itself.
    </li>
    <li>
      <strong>text-size-select</strong> — sets <code>data-text-size</code> on
      the document; your CSS maps each value to font sizing.
    </li>
  </ul>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-helpers`}</code></pre>
  <p>
    The Svelte catalog is the canonical reference; React, Vue, Angular, HTML,
    Nunjucks, and Blazor ports match it contract-for-contract. See the
    <a href="/tutorials/helpers/">helpers tutorial</a>.
  </p>
</section>

<section class="section prose" id="a11y" style="margin: 0 auto;">
  <h2>Accessibility</h2>
  <p>Components target <strong>WCAG 2.2 AAA</strong>. They follow these patterns:</p>
  <ul>
    <li>Semantic HTML elements over generic <code>&lt;div&gt;</code>s.</li>
    <li><code>&lt;label for="id"&gt;</code> linking labels to inputs.</li>
    <li><code>aria-labelledby</code> / <code>aria-describedby</code> for cross-references.</li>
    <li><code>aria-invalid</code> + <code>aria-errormessage</code> for error states.</li>
    <li><code>role="alert"</code> and <code>aria-live</code> for dynamic content.</li>
    <li><code>aria-pressed</code>, <code>aria-expanded</code>, <code>aria-current</code> for state.</li>
    <li>Roving <code>tabindex</code> for grids.</li>
  </ul>
  <p>
    Focus indicators are intentionally consumer-supplied — Lily never paints a
    default focus ring that conflicts with your design. The example apps hold
    a clean axe-core baseline across their routes.
  </p>
</section>

<section class="section prose" id="i18n" style="margin: 0 auto;">
  <h2>Internationalization</h2>
  <p>
    Every label, placeholder, error message, and button text is a prop. There
    are no hardcoded strings. Drop in your translation framework of choice —
    Paraglide, i18next, vue-i18n, react-intl, .resx files, anything.
  </p>
  <p>
    For dates, numbers, and currencies, the components accept pre-formatted
    strings: you format with <code>Intl.DateTimeFormat</code> /
    <code>Intl.NumberFormat</code> / your preferred library and pass the result.
  </p>
  <p>
    The <code>locale-select</code> helper signals the chosen locale to your
    i18n library by setting <code>lang</code> and <code>dir</code> on the
    document root.
  </p>
</section>

<section class="section prose" id="testing" style="margin: 0 auto;">
  <h2>Testing</h2>
  <p>Each framework subproject ships its own tests using its idiomatic stack:</p>
  <ul>
    <li><strong>HTML</strong>: WebDriverIO running real browsers.</li>
    <li><strong>Svelte</strong>: Vitest + <code>@testing-library/svelte</code>.</li>
    <li><strong>React</strong>: Vitest + <code>@testing-library/react</code>.</li>
    <li><strong>Vue</strong>: Vitest + <code>@testing-library/vue</code>.</li>
    <li><strong>Angular</strong>: Vitest + TestBed (via the Analog Vite plugin).</li>
    <li><strong>Nunjucks</strong>: Vitest with a render helper.</li>
    <li><strong>Blazor</strong>: bUnit.</li>
  </ul>
  <p>
    Tests use <strong>Vitest's built-in matchers only</strong> — never
    <code>jest-dom</code> matchers. This keeps the test suites portable.
    The example apps add Playwright end-to-end suites, axe-core accessibility
    baselines, and a responsive viewport sweep.
  </p>
</section>

<section class="section prose" id="troubleshooting" style="margin: 0 auto;">
  <h2>Troubleshooting</h2>

  <details class="faq-item">
    <summary>A component renders but looks unstyled</summary>
    <p>
      That's headless working as intended — no CSS ships with the component.
      Either write CSS against the component's kebab-case class (shown on
      every <a href="/components/">catalog page</a>) or link one of the
      <a href="#themes">45 ready-made themes</a>.
    </p>
  </details>

  <details class="faq-item">
    <summary>My CSS doesn't seem to apply over a theme</summary>
    <p>
      It should — theme selectors are wrapped in <code>:where(...)</code>,
      which has zero specificity. If a rule still loses, check that your
      stylesheet loads after the theme's <code>&lt;link&gt;</code> and that
      the selector actually matches the component's class hook.
    </p>
  </details>

  <details class="faq-item">
    <summary>pnpm install fails with a peer or version error</summary>
    <p>
      Use a current pnpm (v10+) and Node 22+. Each repo pins its framework
      versions in <code>package.json</code>; if your global toolchain is
      older, <code>pnpm env use --global lts</code> is the quickest fix.
    </p>
  </details>

  <details class="faq-item">
    <summary>Screen reader announces the wrong name for a control</summary>
    <p>
      Check the component's required <code>label</code> prop — components
      that lack visible text require one, and consumer-supplied
      <code>aria-label</code> / <code>aria-labelledby</code> passed through
      rest-props intentionally win over the built-in wiring. Each catalog
      page documents the component's ARIA contract.
    </p>
  </details>

  <details class="faq-item">
    <summary>The theme-select helper doesn't switch stylesheets</summary>
    <p>
      Confirm <code>themesUrl</code> points at a directory the browser can
      fetch (serve the <code>themes/</code> files as static assets) and that
      the theme slugs in your <code>themes</code> prop match the file names.
      The helper swaps the <code>href</code> of one managed
      <code>&lt;link data-lily-theme-select&gt;</code> — inspect it in
      devtools to see the URL being requested.
    </p>
  </details>

  <details class="faq-item">
    <summary>Something else is broken</summary>
    <p>
      Open an issue with a minimal reproduction on the relevant repo at
      <a href="https://github.com/LilyDesignSystem">github.com/LilyDesignSystem</a> —
      or see <a href="#community">community and support</a>.
    </p>
  </details>
</section>

<section class="section prose" id="contributing" style="margin: 0 auto;">
  <h2>Contributing</h2>
  <p>Lily is young and welcomes collaboration. The most useful contributions right now are:</p>
  <ul>
    <li>New components (especially patterns from established design systems).</li>
    <li>New themes — each is one standalone stylesheet, a well-scoped first PR.</li>
    <li>Better example styling — show off what's possible.</li>
    <li>Translations of example app strings.</li>
    <li>Bug reports with a minimal reproduction.</li>
    <li>Accessibility audits with screen readers and assistive tech.</li>
  </ul>
  <p>
    Open issues and PRs against the relevant repo at
    <a href="https://github.com/LilyDesignSystem">github.com/LilyDesignSystem</a>.
  </p>
</section>

<section class="section prose" id="community" style="margin: 0 auto;">
  <h2>Community and support</h2>
  <ul>
    <li>
      <strong>Questions and bug reports</strong> — open an issue on the
      relevant repo at
      <a href="https://github.com/LilyDesignSystem">github.com/LilyDesignSystem</a>.
    </li>
    <li>
      <strong>Email</strong> — the maintainer reads
      <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>
      and welcomes collaboration, guidance, and feedback.
    </li>
    <li>
      <strong>Mirrors</strong> — Lily is also pushed to
      <a href="https://codeberg.org/LilyDesignSystem">Codeberg</a> and
      <a href="https://gitlab.com/LilyDesignSystem">GitLab</a>, so you can
      participate from the forge you prefer.
    </li>
    <li>
      <strong>Conduct</strong> — the project follows a standard code of
      conduct; be kind, assume good faith.
    </li>
  </ul>
</section>

<section class="section prose" id="faq" style="margin: 0 auto;">
  <h2>FAQ</h2>

  <details class="faq-item">
    <summary>Why headless instead of styled?</summary>
    <p>
      Pre-styled components are convenient — until they don't match your brand.
      Headless components are slightly more work up front but give you total
      control over the visual design. The example apps and the 45 themes show
      ways to style them; you can take those or replace them entirely.
      The longer argument is on <a href="/why/">Why Lily</a>.
    </p>
  </details>

  <details class="faq-item">
    <summary>Why so many components?</summary>
    <p>
      Lily aims to cover the patterns most apps need without forcing you to build
      them from scratch — including deep cuts like national identifier inputs
      and editorial scrollytelling. The catalog draws from a dozen established
      design systems plus original work — see <a href="/about/">About</a>.
    </p>
  </details>

  <details class="faq-item">
    <summary>Can I use Lily with Tailwind?</summary>
    <p>
      Yes. Each component exposes a single kebab-case root class plus a
      consumer-provided <code>className</code> / <code>class</code>. Layer
      Tailwind utilities on top however you like.
    </p>
  </details>

  <details class="faq-item">
    <summary>Can I use Lily with semantic CSS frameworks like DaisyUI?</summary>
    <p>
      Yes. The kebab-case class names on the root element work as semantic CSS
      hooks. Pair Lily with a semantic framework and you get pre-styled
      components that still respect ARIA and i18n.
    </p>
  </details>

  <details class="faq-item">
    <summary>Is there an npm package?</summary>
    <p>
      The <a href="#helpers">preference helpers</a> ship as packages with an
      npm/NuGet publish pipeline. The headless component libraries are
      designed to be cloned or vendored — the source is the deliverable, so
      you can read, trim, and own exactly what you ship. Registry publishing
      for the headless libraries remains on the roadmap.
    </p>
  </details>

  <details class="faq-item">
    <summary>Why multi-licensed?</summary>
    <p>
      Different projects have different license needs. BSD and MIT are
      permissive, Apache-2.0 has a patent grant, and the GPL options support
      copyleft. Choose whichever fits your situation.
    </p>
  </details>

  <details class="faq-item">
    <summary>How do I report a bug or request a feature?</summary>
    <p>
      Open an issue on the relevant GitHub repo, or email
      <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>.
    </p>
  </details>
</section>
