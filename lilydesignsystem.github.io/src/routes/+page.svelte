<script lang="ts">
  import { LILY_COMPONENTS } from '$lib/components';
</script>

<svelte:head>
  <title>Lily Design System</title>
  <meta
    name="description"
    content="Lily is a free, open-source, accessible, headless design system with {LILY_COMPONENTS.length} components across HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks."
  />
</svelte:head>

<section class="hero">
  <img
    class="hero-logo"
    src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
    alt=""
    aria-hidden="true"
  />
  <p class="hero-eyebrow">Free, open source, accessible</p>
  <h1>Build products faster.</h1>
  <p class="hero-tagline">
    Lily is a free design system with headless components for HTML, Svelte,
    React, Vue, Angular, Blazor, and Nunjucks. Bring your own styles — keep
    accessibility and internationalization built in.
  </p>
  <div class="button-row">
    <a class="button button-primary" href="/tutorials/">Start learning</a>
    <a class="button button-secondary" href="/components/">Browse components</a>
  </div>
</section>

<section class="section" aria-label="Lily by the numbers">
  <div class="stat-row">
    <div class="stat">
      <span class="stat-value">{LILY_COMPONENTS.length}</span>
      <span class="stat-label">components</span>
    </div>
    <div class="stat">
      <span class="stat-value">7</span>
      <span class="stat-label">frameworks</span>
    </div>
    <div class="stat">
      <span class="stat-value">45</span>
      <span class="stat-label">ready-made themes</span>
    </div>
    <div class="stat">
      <span class="stat-value">AAA</span>
      <span class="stat-label">WCAG 2.2 target</span>
    </div>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Quick start</p>
    <h2>Try Lily in 30 seconds</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>Pick the framework you use. Browse the source. Copy a component. Style it.</p>
    <p>
      Each component is a single file — no runtime, no compiler magic, no design
      tokens you didn't ask for. Headless components export semantic HTML with the
      kebab-case class name; you write the CSS.
    </p>

    <pre><code>{`<!-- HTML headless: Button -->
<button class="button" type="button" aria-label="Save">
  Save
</button>`}</code></pre>

    <pre><code>{`// React headless: Button
import Button from "lily-design-system-react-headless/components/Button";

<Button onClick={save}>Save</Button>`}</code></pre>

    <p style="text-align: center; margin-top: 2rem;">
      <a class="button button-primary" href="/tutorials/">Follow the tutorial for your framework →</a>
    </p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Learn</p>
    <h2>Find your path</h2>
  </header>

  <div class="card-grid">
    <a class="card" href="/tutorials/">
      <h3 class="card-heading">Tutorials</h3>
      <p class="card-description">
        Step-by-step guides: your first component, styling it, theming with the
        45 ready-made themes, and adding language and text-size preferences —
        in HTML, Svelte, React, Vue, Angular, Blazor, or Nunjucks.
      </p>
      <p class="card-meta">Start here if Lily is new to you</p>
    </a>
    <a class="card" href="/components/">
      <h3 class="card-heading">Component catalog</h3>
      <p class="card-description">
        Every component documented with description, props, ARIA contract,
        keyboard interactions, and a live demo — searchable and filterable.
      </p>
      <p class="card-meta">{LILY_COMPONENTS.length} components</p>
    </a>
    <a class="card" href="/examples/">
      <h3 class="card-heading">Example apps</h3>
      <p class="card-description">
        Seven complete, styled reference applications — SvelteKit, Next.js,
        Nuxt, Angular + Analog, Blazor Web, Eleventy, and plain HTML+CSS+JS —
        showing the whole system working end to end.
      </p>
      <p class="card-meta">Clone one and explore</p>
    </a>
    <a class="card" href="/help/">
      <h3 class="card-heading">Help</h3>
      <p class="card-description">
        Setup guides, styling and theming reference, accessibility and i18n
        contracts, troubleshooting, FAQ, and how to reach a human.
      </p>
      <p class="card-meta">Answers and support</p>
    </a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Why headless?</p>
    <h2>Your design. Our groundwork.</h2>
  </header>

  <div class="card-grid">
    <div class="card">
      <h3 class="card-heading">Own every pixel</h3>
      <p class="card-description">
        No baked-in fonts, colors, spacing, or breakpoints. Each component
        renders semantic HTML with one stable class hook — your CSS does the
        rest, whether that's hand-written styles, Tailwind, or one of Lily's
        45 reference themes.
      </p>
    </div>
    <div class="card">
      <h3 class="card-heading">Accessibility you don't rebuild</h3>
      <p class="card-description">
        WCAG 2.2 AAA is the target. Semantic elements, ARIA states, keyboard
        contracts, and focus behaviour ship inside every component and are
        verified by per-framework test suites and axe-core baselines.
      </p>
    </div>
    <div class="card">
      <h3 class="card-heading">No lock-in</h3>
      <p class="card-description">
        The same catalog in seven frameworks with the same class names and
        prop conventions. Switch stacks, mix stacks, or migrate gradually —
        your CSS and your knowledge carry over.
      </p>
    </div>
  </div>

  <p style="text-align: center; margin-top: 2rem;">
    <a class="button button-secondary" href="/why/">Read the full case for Lily →</a>
  </p>
</section>
