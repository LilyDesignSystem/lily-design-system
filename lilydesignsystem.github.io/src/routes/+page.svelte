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
  <p class="hero-eyebrow">Free · Open source · Accessible</p>
  <h1>Build products faster.</h1>
  <p class="hero-tagline">
    Lily gives you {LILY_COMPONENTS.length} headless components for HTML, Svelte,
    React, Vue, Angular, Blazor, and Nunjucks. You bring the CSS — the
    semantics, keyboard behaviour, accessibility, and internationalization
    are already done.
  </p>
  <div class="button-row">
    <a class="button button-primary" href="/tutorials/">Start the tutorial</a>
    <a class="button button-secondary" href="/components/">Browse {LILY_COMPONENTS.length} components</a>
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
    <p class="section-heading-eyebrow">The problem</p>
    <h2>Stop fighting your component library</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>
      You know how this goes. You adopt a styled component library, and the
      buttons don't quite match your brand — so you override. The overrides
      break on the next upgrade — so you fork. Two years in, you own a patched
      copy of someone else's design decisions, and the accessibility
      underneath got damaged along the way.
    </p>
    <p>
      Lily is not another look for your app. It's the groundwork under
      <em>your</em> look. Every component ships zero CSS, freeing you to style
      it exactly the way your brand needs — while the parts that are genuinely
      hard to get right stay done:
    </p>
    <pre><code>{`<!-- What Lily renders: semantic HTML, correct ARIA, one class hook -->
<button class="button" type="button">Save</button>`}</code></pre>
    <pre><code>{`/* What you write: any CSS you like — there is nothing to override */
.button {
  background: rebeccapurple;
  color: #fff;
  border-radius: 9999px;
}`}</code></pre>
    <p>
      One stable class hook per component. Zero CSS shipped. Your styles
      always win — no <code>!important</code>, no specificity wars, no fork.
    </p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Quick start</p>
    <h2>Try Lily in 30 seconds</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p><strong>1. Copy a component.</strong> No install, no build step — Lily's HTML flavour is plain markup:</p>
    <pre><code>{`<form class="form">
  <div class="field">
    <label class="label" for="name">Full name</label>
    <input class="text-input" type="text" id="name" name="name" required />
  </div>
  <button class="button" type="submit">Save</button>
</form>`}</code></pre>

    <p><strong>2. Style the class hooks.</strong> Each component carries one kebab-case class — that's the whole contract:</p>
    <pre><code>{`.button     { background: #2563eb; color: #fff; padding: 0.75rem 1.5rem; }
.text-input { border: 2px solid #6b7280; padding: 0.5rem 0.75rem; }
.label      { font-weight: 600; }`}</code></pre>

    <p><strong>3. In a hurry? Link a ready-made theme instead.</strong> One stylesheet and the same markup lights up — NHS, GOV.UK, USWDS, dark, nord, and 40 more:</p>
    <pre><code>{`<link rel="stylesheet" href="/themes/dark.css" />`}</code></pre>

    <p>
      Prefer Svelte, React, Vue, Angular, Blazor, or Nunjucks? The same
      components exist in each, with the same class hooks and prop names.
    </p>
    <p style="text-align: center; margin-top: 2rem;">
      <a class="button button-primary" href="/tutorials/">Follow the 10-minute tutorial for your framework →</a>
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
        Learn Lily step by step: render your first component, style it, theme
        it, and add language and text-size preferences — in whichever of the
        seven frameworks you use.
      </p>
      <p class="card-meta">Start here — about 10 minutes</p>
    </a>
    <a class="card" href="/components/">
      <h3 class="card-heading">Component catalog</h3>
      <p class="card-description">
        Save time with {LILY_COMPONENTS.length} reusable, accessible
        components — each documented with props, ARIA contract, keyboard
        interactions, and a live demo.
      </p>
      <p class="card-meta">{LILY_COMPONENTS.length} components, searchable</p>
    </a>
    <a class="card" href="/examples/">
      <h3 class="card-heading">Example apps</h3>
      <p class="card-description">
        See the whole system working end to end: seven complete, styled
        reference applications — SvelteKit, Next.js, Nuxt, Angular + Analog,
        Blazor Web, Eleventy, and plain HTML+CSS+JS.
      </p>
      <p class="card-meta">Clone one and explore</p>
    </a>
    <a class="card" href="/help/">
      <h3 class="card-heading">Help</h3>
      <p class="card-description">
        Get unstuck fast: setup guides, styling and theming reference,
        troubleshooting, FAQ, and how to reach a human who reads every
        message.
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
        No baked-in fonts, colors, spacing, or breakpoints — allowing your
        CSS to be the design system's look from day one. Hand-written styles,
        Tailwind utilities, or one of Lily's 45 reference themes all work.
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

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">An honest checklist</p>
    <h2>Is Lily right for you?</h2>
  </header>

  <div class="card-grid">
    <div class="card">
      <h3 class="card-heading">Lily is for you if…</h3>
      <ul style="color: var(--lily-text-muted); margin: 0; padding-left: 1.25rem;">
        <li>You have a design of your own — or want one — and refuse to fight a library for it.</li>
        <li>Accessibility is a requirement, not a nice-to-have.</li>
        <li>Your product ships in more than one language.</li>
        <li>Your organisation uses more than one framework — or might someday.</li>
        <li>You build public-sector or healthcare services and want NHS / GOV.UK / USWDS patterns and themes out of the box.</li>
      </ul>
    </div>
    <div class="card">
      <h3 class="card-heading">Lily is not for you if…</h3>
      <ul style="color: var(--lily-text-muted); margin: 0; padding-left: 1.25rem;">
        <li>You want polished, pre-styled components with zero CSS work — a styled library like DaisyUI or Ant Design will get you there quicker.</li>
        <li>You need a large-vendor support contract behind your UI layer.</li>
        <li>You're happy inside one framework's own ecosystem and its first-party library already fits your brand.</li>
      </ul>
      <p class="card-meta" style="margin-top: 1rem;">
        Still unsure? See our honest <a href="/comparisons/">comparison against 17 design systems</a>.
      </p>
    </div>
  </div>
</section>

<section class="section prose" style="margin: 0 auto;" aria-label="Common questions">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Questions?</p>
    <h2>Good questions, quick answers</h2>
  </header>

  <details class="faq-item">
    <summary>Headless… so my components will look unstyled?</summary>
    <p>
      Only until you add CSS — which is the point: nothing ships that you'd
      have to undo. Write your own styles against the class hooks, or link one
      of the 45 ready-made themes and be fully styled in one line. (This
      accordion is a native <code>&lt;details&gt;</code>, styled exactly that
      way.)
    </p>
  </details>

  <details class="faq-item">
    <summary>Is Lily really free?</summary>
    <p>
      Yes. Free and open source under your choice of BSD, MIT, Apache-2.0,
      GPL-2.0, or GPL-3.0. No pro tier, no seat licenses, no telemetry.
    </p>
  </details>

  <details class="faq-item">
    <summary>Which frameworks can I use Lily with?</summary>
    <p>
      HTML (no framework at all), Svelte, React, Vue, Angular, Blazor, and
      Nunjucks — the same {LILY_COMPONENTS.length} components in each. And
      because the contract is just class hooks on semantic HTML, your CSS
      works unchanged across all of them.
    </p>
  </details>

  <details class="faq-item">
    <summary>How mature is Lily?</summary>
    <p>
      Lily is young and moving fast — expect additions more than breakages,
      but pin what you ship. Everything is developed in the open: the
      specification, tests, roadmap, and audits are all in the repos. Honest
      feedback shapes the roadmap more than anything else.
    </p>
  </details>

  <p style="text-align: center; margin-top: 1.5rem;">
    <a href="/help/#faq">More questions answered on the help page →</a>
  </p>
</section>

<section class="section prose" style="margin: 0 auto;" aria-label="What's new">
  <h2>What's new</h2>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Version 0.6.0 — July 2026.</strong> Tooling hardening and
      release hygiene: catalog cross-checks in <code>bin/test</code>,
      regenerated example-app registries, link checking, and CI. The
      theme-select and locale-select helpers reach 0.2.0.
      <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md">Read the changelog →</a>
    </p>
  </div>
</section>
