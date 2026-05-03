<svelte:head>
  <title>Help — Lily Design System</title>
  <meta
    name="description"
    content="Get started with Lily: install the headless package for your framework, copy a component, style it, ship it."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Help</p>
  <h1>Getting started with Lily</h1>
  <p class="hero-tagline">
    Pick a framework, clone the headless repo or the example app, and start
    composing your own pages.
  </p>
</section>

<nav aria-label="On this page" class="prose" style="margin: 0 auto;">
  <p><strong>On this page:</strong></p>
  <ul>
    <li><a href="#install">Install</a></li>
    <li><a href="#use-headless">Use a headless component</a></li>
    <li><a href="#use-styled">Use a styled example</a></li>
    <li><a href="#styling">Styling and design tokens</a></li>
    <li><a href="#a11y">Accessibility</a></li>
    <li><a href="#i18n">Internationalization</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#contributing">Contributing</a></li>
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
    <li><code>lily-design-system-nunjucks-headless</code> — <code>pnpm install</code></li>
    <li><code>lily-design-system-blazor-headless</code> — <code>dotnet build</code> (in progress)</li>
  </ul>
  <p>
    Lily is being released bit-by-bit; npm/PyPI/NuGet packaging is on the
    roadmap. For now, treat the source as the source of truth and copy what you
    need.
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

  <h3>Nunjucks</h3>
  <pre><code>{`{% from "components/button/macro.njk" import button %}

{{ button({ text: "Save", type: "button" }) }}`}</code></pre>
</section>

<section class="section prose" id="use-styled" style="margin: 0 auto;">
  <h2>Use a styled example</h2>
  <p>
    The example apps include CSS, routes, and full demo pages. The fastest way
    to experiment is to start the SvelteKit, Next, Nuxt, or Eleventy example
    app and view the demo at <code>/components</code>.
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
    default focus ring that conflicts with your design.
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
</section>

<section class="section prose" id="testing" style="margin: 0 auto;">
  <h2>Testing</h2>
  <p>Each framework subproject ships its own tests using its idiomatic stack:</p>
  <ul>
    <li><strong>HTML</strong>: WebDriverIO running real browsers.</li>
    <li><strong>Svelte</strong>: Vitest + <code>@testing-library/svelte</code>.</li>
    <li><strong>React</strong>: Vitest + <code>@testing-library/react</code>.</li>
    <li><strong>Vue</strong>: Vitest + <code>@testing-library/vue</code>.</li>
    <li><strong>Nunjucks</strong>: Vitest with a render helper.</li>
    <li><strong>Blazor</strong>: bUnit (planned).</li>
  </ul>
  <p>
    Tests use <strong>Vitest's built-in matchers only</strong> — never
    <code>jest-dom</code> matchers. This keeps the test suites portable.
  </p>
</section>

<section class="section prose" id="contributing" style="margin: 0 auto;">
  <h2>Contributing</h2>
  <p>Lily is brand-new and welcomes collaboration. The most useful contributions right now are:</p>
  <ul>
    <li>New components (especially patterns from established design systems).</li>
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

<section class="section prose" id="faq" style="margin: 0 auto;">
  <h2>FAQ</h2>

  <details class="faq-item">
    <summary>Why headless instead of styled?</summary>
    <p>
      Pre-styled components are convenient — until they don't match your brand.
      Headless components are slightly more work up front but give you total
      control over the visual design. The example apps show one way to style
      them; you can take that or replace it entirely.
    </p>
  </details>

  <details class="faq-item">
    <summary>Why so many components?</summary>
    <p>
      Lily aims to cover the patterns most apps need without forcing you to build
      them from scratch. The catalog draws from a dozen established design
      systems plus original work — see <a href="/about/#inspirations">About</a>.
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
      Not yet. The headless repos are intended to be cloned and used directly,
      or vendored into your project. npm/PyPI/NuGet publishing is on the
      roadmap.
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
