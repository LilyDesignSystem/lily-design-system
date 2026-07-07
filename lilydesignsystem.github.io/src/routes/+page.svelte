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
  <h1>Build your web designs faster.</h1>
  <p class="hero-tagline">
    Lily is a free open-source design system with
    hundreds of components. Lily provides versions for HTML, Svelte, React,
    Vue, Angular, Blazor, and Nunjucks. Lily provides headless versions
    where you can bring your own CSS, and also provides styled examples.
  </p>
  <div class="button-row">
    <a class="button button-primary" href="/tutorials/">Start the tutorial</a>
    <a class="button button-secondary" href="/components/">Browse headless components</a>
    <a class="button button-secondary" href="/examples/">Explore styled examples</a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">The idea</p>
    <h2>Your design, from day one</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>
      Your team has ideas about how your product should look. Lily provides
      semantic elements, ARIA states, keyboard contracts, focus
      management, and more - and you can style all the components as you wish.
    </p>
    <pre><code>{`<!-- What Lily renders: semantic HTML, correct ARIA, one class hook -->
<button class="button" type="button">Save</button>`}</code></pre>
    <pre><code>{`/* What you write: any CSS you like — it applies directly, first try */
.button {
  background: rebeccapurple;
  color: #fff;
  border-radius: 9999px;
}`}</code></pre>
    <p>
      One stable class hook per component. Zero CSS shipped. Your styles
      apply cleanly and stay cleanly yours.
    </p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Quick start</p>
    <h2>Try Lily in 30 seconds</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p><strong>1. Copy a component.</strong> Lily's HTML flavour is plain markup — paste it straight into any page, zero install, zero build step:</p>
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
    <p class="section-heading-eyebrow">See it in action</p>
    <h2>Seven styled example apps, yours to explore and adjust</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>
      Curious what Lily looks like fully dressed? Seven complete example apps
      show the} components live and
      styled — one app per framework: plain HTML+CSS+JS, SvelteKit, Next.js,
      Nuxt, Angular + Analog, Blazor Web, and Nunjucks + Eleventy.
    </p>
    <p>
      Each app is a warm, working reference: a searchable catalog at
      <code>/components</code>, a live demo page for every component, and
      composed pages — dashboards, contact forms, settings, task boards —
      showing the pieces working together. Best of all, the stylesheets
      target the same class hooks you'll use, so you can copy any of the CSS
      straight into your own project and adjust it as you wish. It's all
      free, open source, and made to be remixed.
    </p>
    <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples
cd lily-design-system-svelte-sveltekit-examples
pnpm install && pnpm run dev`}</code></pre>
    <p style="text-align: center; margin-top: 2rem;">
      <a class="button button-secondary" href="/examples/">Explore all seven example apps →</a>
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
        Blazor Web, Eleventy, and plain HTML+CSS+JS — with CSS you're
        welcome to copy and adjust.
      </p>
      <p class="card-meta">Clone one and explore</p>
    </a>
    <a class="card" href="/help/">
      <h3 class="card-heading">Help</h3>
      <p class="card-description">
        Find answers fast: setup guides, styling and theming reference,
        troubleshooting, FAQ, and how to reach a friendly human who reads
        every message.
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
        Every font, color, spacing, and breakpoint decision belongs to you —
        your CSS is the design system's look from day one. Hand-written
        styles, Tailwind utilities, or one of Lily's 45 reference themes all
        work beautifully.
      </p>
    </div>
    <div class="card">
      <h3 class="card-heading">Accessibility, ready-made</h3>
      <p class="card-description">
        WCAG 2.2 AAA is the target. Semantic elements, ARIA states, keyboard
        contracts, and focus behaviour ship inside every component and are
        verified by per-framework test suites and axe-core baselines.
      </p>
    </div>
    <div class="card">
      <h3 class="card-heading">Freedom to move</h3>
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

<section class="section prose" style="margin: 0 auto;">
  <header class="section-heading">
    <p class="section-heading-eyebrow">A quick fit check</p>
    <h2>Lily shines when…</h2>
  </header>

  <ul>
    <li>You have a design of your own — or want one — and want a library that honours it everywhere.</li>
    <li>Accessibility is a day-one requirement for your product.</li>
    <li>Your product ships in more than one language.</li>
    <li>Your organisation uses more than one framework — or might someday.</li>
    <li>You build public-sector or healthcare services and want NHS / GOV.UK / USWDS patterns and themes out of the box.</li>
  </ul>
  <p>
    Weighing your options? We keep an honest, component-by-component
    <a href="/comparisons/">comparison against 17 design systems</a> — styled
    and headless, commercial and public-sector — so you can choose with
    confidence.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;" aria-label="Common questions">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Questions?</p>
    <h2>Good questions, quick answers</h2>
  </header>

  <details class="faq-item">
    <summary>Headless… so my components arrive unstyled?</summary>
    <p>
      Yes — and that's the gift: everything you write applies directly, and
      every visual decision is yours. Style the class hooks yourself, or link
      one of the 45 ready-made themes and be fully styled in one line. (This
      accordion is a native <code>&lt;details&gt;</code>, styled exactly that
      way.)
    </p>
  </details>

  <details class="faq-item">
    <summary>Is Lily really free?</summary>
    <p>
      Yes! Free and open source under your choice of BSD, MIT, Apache-2.0,
      GPL-2.0, or GPL-3.0. Every component, every theme, and every helper is
      included — yours, forever.
    </p>
  </details>

  <details class="faq-item">
    <summary>Which frameworks can I use Lily with?</summary>
    <p>
      Plain HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks — the
      same {LILY_COMPONENTS.length} components in each. And because the
      contract is simply class hooks on semantic HTML, your CSS carries over
      to every one of them.
    </p>
  </details>

  <details class="faq-item">
    <summary>How mature is Lily?</summary>
    <p>
      Lily is young and growing fast — expect a steady stream of additions,
      and pin versions for a calm upgrade cadence. Everything is developed in
      the open: the specification, tests, roadmap, and audits all live in the
      repos. Your feedback shapes the roadmap more than anything else.
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
