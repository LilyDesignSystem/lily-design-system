<svelte:head>
  <title>About — Lily Design System</title>
  <meta
    name="description"
    content="What Lily is, the principles behind it, and the design systems it draws inspiration from."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">About</p>
  <h1>What is Lily?</h1>
  <p class="hero-tagline">
    A free, open-source, accessible-first design system that meets you where you
    code — and gets out of your way when you don't need it.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>The short version</h2>
  <p>
    Lily is a catalog of <strong>web components</strong>, each implemented in
    seven headless flavors (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks)
    plus a set of batteries-included example apps that show how to style them.
  </p>
  <p>
    The headless versions ship <em>zero CSS</em>. They give you semantic HTML, ARIA
    roles and states, keyboard support, and i18n-friendly props. You bring the
    visual design.
  </p>

  <h2>Design principles</h2>

  <h3>Accessible</h3>
  <p>
    Every component starts from semantic HTML. ARIA is layered on only where the
    HTML alone can't express the pattern. Components target
    <strong>WCAG 2.2 AAA</strong> — colors, spacing, focus, and keyboard
    navigation are all considered.
  </p>

  <h3>Composable</h3>
  <p>
    Lily favors small, single-purpose components that snap together. Compound
    patterns appear over and over:
  </p>
  <ul>
    <li><code>Nav → List → ListItem</code> — for breadcrumbs, contents lists, accordion menus, tree menus, and pagination</li>
    <li><code>Form → Field → Input</code> — for any form layout with labels, hints, and errors</li>
    <li><code>Table → Head/Body/Foot → Row → Data</code> — for tables, calendars, gantt charts, and kanban boards</li>
    <li><code>Bar → BarButton</code> — for tool bars, tab bars, task bars, action bars, and menu bars</li>
    <li><code>Picker → PickerButton</code> — for color pickers, rating pickers, theme pickers</li>
  </ul>

  <h3>Internationalizable</h3>
  <p>
    Not a single user-facing string is hardcoded. Labels, placeholders, error
    messages, button text — all parameters. Drop in your own translation system
    and Lily speaks any language you do.
  </p>

  <h3>Headless</h3>
  <p>
    Headless components have <strong>no CSS</strong>, no
    <code>&lt;style&gt;</code> blocks, no design tokens you didn't opt into. They
    expose a single kebab-case class name on each root element so you can target
    them however you like — semantic CSS, Tailwind, CSS-in-JS, your call.
  </p>

  <h3>Batteries-included examples</h3>
  <p>
    The example apps show how to style the components for real use — what design
    tokens to set, what variations to add, how to compose pages. They are full
    SvelteKit, Next.js, Nuxt, Blazor, and Eleventy apps, not just sandboxes.
  </p>

  <h2 id="inspirations">Inspirations</h2>
  <p>
    Lily draws patterns and language from a deliberately broad set of design
    systems:
  </p>
  <ul>
    <li><a href="https://service-manual.nhs.uk/design-system">NHS UK Design System</a></li>
    <li><a href="https://design-system.service.gov.uk/">GOV.UK Design System</a></li>
    <li><a href="https://designsystem.digital.gov/">U.S. Web Design System (USWDS)</a></li>
    <li><a href="https://github.com/ONSdigital/design-system">ONSdigital design system</a></li>
    <li><a href="https://designsystemau.org/">Design System AU (Australian Government)</a></li>
    <li><a href="https://protocol.mozilla.org/">Mozilla Protocol</a></li>
    <li><a href="https://spectrum.adobe.com/">Adobe Spectrum</a></li>
    <li><a href="https://ant.design/">Ant Design</a></li>
    <li><a href="https://design.wonderflow.ai/">Wonderflow Wanda</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a></li>
    <li><a href="https://github.com/reuters-graphics/graphics-components">Reuters graphics components</a></li>
  </ul>

  <h2>License</h2>
  <p>
    Lily is multi-licensed under <strong>BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0</strong>.
    Pick whichever license fits your project. If none of those work, get in touch.
  </p>

  <h2>Contact</h2>
  <p>
    Project lead: Joel Parker Henderson —
    <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>.
  </p>
  <p>
    Found a bug, have an idea, want to contribute a component? Open an issue or
    a pull request on
    <a href="https://github.com/LilyDesignSystem">GitHub</a>.
  </p>

  <div class="callout">
    <p style="margin: 0;">
      <strong>Status:</strong> Lily is brand-new work and we welcome
      collaboration, guidance, and feedback. Things will move and evolve.
    </p>
  </div>
</section>
