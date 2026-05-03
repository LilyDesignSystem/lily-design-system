<svelte:head>
  <title>Examples — Lily Design System</title>
  <meta
    name="description"
    content="Worked example apps that show how to style Lily components in HTML, Svelte, React, Vue, Blazor, and Eleventy."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Examples</p>
  <h1>See Lily in real apps</h1>
  <p class="hero-tagline">
    Six worked example projects show how to take the headless components, layer
    on styling, and ship a real website. Pick the framework you use.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Batteries-included</p>
    <h2>Demo apps with full CSS and routing</h2>
  </header>

  <div class="card-grid">
    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-html-css-js-examples">
      <h3 class="card-heading">HTML JavaScript</h3>
      <p class="card-description">
        Plain HTML pages, vanilla JavaScript, no build tools. Drops into any
        static host — perfect for tiny sites and progressive enhancement.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples">
      <h3 class="card-heading">Svelte + SvelteKit</h3>
      <p class="card-description">
        SvelteKit app using Svelte 5 runes. Component routes, file-based
        routing, and a styled storybook of every component.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-react-next-examples">
      <h3 class="card-heading">React + Next.js</h3>
      <p class="card-description">
        Next.js 15 app showing each component in context, with TypeScript
        throughout and demo pages for compound patterns.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-vue-nuxt-examples">
      <h3 class="card-heading">Vue + Nuxt.js</h3>
      <p class="card-description">
        Nuxt 3 app. <code>&lt;script setup&gt;</code> and the Composition API
        across every demo route.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-blazor-web-examples">
      <h3 class="card-heading">Blazor Web</h3>
      <p class="card-description">
        Blazor Web app with Razor components. Server- and WebAssembly-friendly,
        with .NET 10 baseline.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>

    <a class="card" href="https://github.com/LilyDesignSystem/lily-design-system-nunjucks-eleventy-examples">
      <h3 class="card-heading">Nunjucks + Eleventy</h3>
      <p class="card-description">
        Eleventy site using Nunjucks macros. Ideal for content-heavy static
        sites that still want a real component system.
      </p>
      <p class="card-meta">→ View on GitHub</p>
    </a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">What's inside</p>
    <h2>Every example app has the same shape</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>To make framework-hopping feel familiar, every example app provides:</p>
    <ul>
      <li>A welcome route at <code>/</code> that introduces the project.</li>
      <li>A components index at <code>/components</code> that lists every component.</li>
      <li>A demo page per component at <code>/components/&lt;component&gt;</code>.</li>
      <li>Real CSS — not abstract design tokens — so you can crib styles directly.</li>
      <li>Working keyboard navigation and focus management out of the box.</li>
    </ul>

    <h3>Need to see how a single component is styled?</h3>
    <p>
      Open the relevant example app, navigate to
      <code>/components/&lt;name&gt;</code>, and copy the markup and CSS into your
      own project. The example apps deliberately use plain CSS (or near-plain) so
      you can adapt them to any system you prefer.
    </p>

    <h3>Want headless instead?</h3>
    <p>
      Pair any of the example apps with their corresponding <em>headless</em>
      package — those publish the same components without any CSS, ready for
      your own design tokens.
    </p>
    <p>
      <a class="button button-primary" href="/components/">Browse the catalog →</a>
      <a class="button button-secondary" href="/help/">Read the setup guide</a>
    </p>
  </div>
</section>
