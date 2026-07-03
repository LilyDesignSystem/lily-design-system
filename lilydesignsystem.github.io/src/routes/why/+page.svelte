<svelte:head>
  <title>Why Lily — Lily Design System</title>
  <meta
    name="description"
    content="The case for Lily: headless components you style yourself, WCAG 2.2 AAA accessibility built in, no hardcoded strings, seven frameworks, one catalog, free forever."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Why Lily</p>
  <h1>The case for Lily</h1>
  <p class="hero-tagline">
    Lily hands you the hard parts — semantics, accessibility, keyboard
    behaviour, internationalization — and leaves the look entirely,
    happily, to you.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Start from your design</h2>
  <p>
    Your team already knows how your product should look. Lily starts from
    exactly that place: it supplies the parts that are genuinely hard to get
    right and expensive to re-do — the correct semantic element, the ARIA
    states, the keyboard contract, focus management — and leaves every
    visual decision entirely, joyfully, yours. Your CSS is the design
    system's look, from day one.
  </p>
  <p>
    Because every component carries a stable class hook and pure structure,
    your styling stays cleanly yours through every upgrade — and the
    accessibility underneath keeps working, version after version.
  </p>

  <h2>What Lily commits to</h2>
  <ul>
    <li>
      <strong>Accessible by default.</strong> WCAG 2.2 AAA is the target for
      every component. Patterns follow the WAI-ARIA Authoring Practices;
      every interactive component is keyboard-operable with a documented
      contract; the example apps hold a clean axe-core baseline.
    </li>
    <li>
      <strong>Internationalizable by construction.</strong> Every user-facing
      string — each label, error, and announcement — is a prop with stable
      names across frameworks, so translation flows naturally. RTL and bidirectional text
      inherit from your <code>dir</code>. Locale-aware components take the
      locale as a prop, always explicitly.
    </li>
    <li>
      <strong>One catalog, seven frameworks.</strong> The same 490 components
      with the same class hooks and prop conventions in HTML, Svelte, React,
      Vue, Angular, Blazor, and Nunjucks. Your CSS and your team's knowledge
      transfer across stacks.
    </li>
    <li>
      <strong>CSS-strategy agnostic.</strong> One stable kebab-case class per
      component root. Semantic CSS, Tailwind utilities, CSS-in-JS, or one of
      the 45 ready-made themes — Lily welcomes them all and stays gracefully
      out of the way.
    </li>
    <li>
      <strong>Free, forever, on your terms.</strong> Open source under your
      choice of BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0. No pro tier, no
      seat licenses, no telemetry.
    </li>
  </ul>

  <h2>Depth where it matters</h2>
  <p>
    Beyond the usual buttons and dialogs, the catalog reaches further than
    most:
  </p>
  <ul>
    <li>
      <strong>Public-sector patterns</strong> researched from the NHS UK,
      GOV.UK, USWDS, and ONS design systems — error summaries, warning
      callouts, summary lists, phase banners, skip links.
    </li>
    <li>
      <strong>80 national personal identifier components</strong> covering
      healthcare, national-ID, tax, and passport identifiers across 30+
      countries, each documenting its format and validation algorithm.
    </li>
    <li>
      <strong>Editorial and scrollytelling primitives</strong> adapted from
      Reuters Graphics — article layouts, scrollers, timelines, tile maps.
    </li>
    <li>
      <strong>Preference helpers</strong> — small packages that own one user
      preference end to end: theme switching (with runtime stylesheet
      loading), language, and text size. Each is a native
      <code>&lt;select&gt;</code> with persistence and SSR safety built in.
    </li>
  </ul>

  <h2>Themes for the public sector, out of the box</h2>
  <p>
    Lily ships 45 standalone reference themes that target its class hooks
    directly: NHS England, NHS Scotland, and NHS Wales (each in
    patient-facing and practitioner-facing variants), GOV.UK, USWDS, Adobe
    Spectrum and Mozilla Protocol inspired palettes, and a set of
    general-purpose light and dark themes. Link one stylesheet and a
    government-grade look is on; the <code>theme-select</code> helper swaps
    them at runtime.
  </p>

  <h2>How Lily compares</h2>
  <p>
    We keep an honest, component-by-component
    <a href="/comparisons/">comparison against 17 design systems</a> —
    styled and headless, commercial and public-sector. Where another library
    is a better fit for you, the comparison will show it; Lily learns from
    all of them and cites its inspirations in the open.
  </p>

  <h2>Who's behind it</h2>
  <p>
    Lily is a young, independent open-source project that welcomes
    collaboration, guidance, and feedback — see
    <a href="/about/">About</a> for the story and the inspirations.
    Everything — the specification, the tests, the roadmap, even the audit
    tooling — is in the open at
    <a href="https://github.com/LilyDesignSystem">github.com/LilyDesignSystem</a>.
  </p>

  <h2>Help Lily grow</h2>
  <p>If Lily is useful to you, the most valuable things you can do:</p>
  <ul>
    <li>
      <strong>Star and share.</strong> Star the
      <a href="https://github.com/LilyDesignSystem/lily-design-system">main repo</a>
      and show a colleague the <a href="/components/">catalog</a> — awareness
      is the scarcest resource a young project has.
    </li>
    <li>
      <strong>Build something and tell us.</strong> Real-world usage reports —
      what worked, what could be smoother — shape the roadmap more than
      anything else.
    </li>
    <li>
      <strong>Audit accessibility.</strong> Screen-reader passes (VoiceOver,
      NVDA, JAWS) on the <a href="/examples/">example apps</a> are gold; file
      what you find.
    </li>
    <li>
      <strong>Contribute a theme or a translation.</strong> Both are
      self-contained, well-scoped first contributions.
    </li>
    <li>
      <strong>Share what you find, with a minimal reproduction,</strong> on
      the relevant repo, or email
      <a href="mailto:joel@joelparkerhenderson.com">joel@joelparkerhenderson.com</a>.
    </li>
  </ul>

  <div class="button-row" style="margin-top: 2rem;">
    <a class="button button-primary" href="/tutorials/">Start the tutorial</a>
    <a class="button button-secondary" href="https://github.com/LilyDesignSystem">Star on GitHub</a>
  </div>
</section>
