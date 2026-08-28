<svelte:head>
  <title>Accessibility — Lily Design System</title>
  <meta
    name="description"
    content="Lily's accessibility statement: what targeting WCAG 2.2 AAA means here — what is verified, by what, what is not verified by anything, and how to report a problem."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Accessibility</p>
  <h1>What “targets WCAG 2.2 AAA” means here</h1>
  <p class="hero-tagline">
    The word <em>targets</em> is deliberate. This page says precisely what is
    verified, by what, what is not verified by anything, and what we intend to
    do about the gap. Lily never claims WCAG “compliance” — no audit supports
    it.
  </p>
</section>

<section class="prose">
  <h2>Verified, continuously</h2>
  <ul>
    <li>
      Every component's canonical semantic element, ARIA attributes, and class
      hooks — asserted by per-framework unit suites (15,000+ cases across
      seven frameworks).
    </li>
    <li>
      Every one of the 491 component demo pages is axe-clean (WCAG 2.0/2.1
      A+AA and 2.2 AA rule sets) — the full-catalog sweep, first baselined
      2026-08-27, plus per-app baselines on home, catalog, and composed
      routes in all seven example apps.
    </li>
    <li>
      Keyboard contracts per interactive component, documented in each
      component's canonical metadata and exercised by the suites; the five
      helper packages additionally run real-browser Playwright specs.
    </li>
    <li>
      WCAG 2.2 target-size floors and overflow guards in all 45 themes;
      skip-link, landmarks, and no horizontal overflow at four viewports per
      app; <code>lang</code>/<code>dir</code> application including the RTL
      flip.
    </li>
  </ul>

  <h2>Not verified by anything</h2>
  <ul>
    <li>
      <strong>No conformance audit has ever been performed.</strong> No VPAT,
      no certification. Automated tooling covers a minority of WCAG success
      criteria.
    </li>
    <li>
      AAA-specific criteria (enhanced contrast, and others) are design
      intents, not verified properties; the axe rule sets run A/AA. There is
      no dedicated high-contrast theme yet.
    </li>
    <li>
      <strong>Screen-reader behaviour is largely untested.</strong> The suites
      assert ARIA attributes, not what VoiceOver, NVDA, or JAWS announce —
      and this project has shipped green suites over real defects more than
      once, each written up in the changelog precisely because the suites
      could not see them.
    </li>
  </ul>

  <h2>What we intend to do about it</h2>
  <p>
    An independent accessibility audit is the first named use of any project
    funding, and the scope an auditor needs is already prepared. Until then,
    screen-reader reports are the contribution this project wants most:
    “component X announces Y, which is wrong because Z” is directly
    actionable.
  </p>

  <h2>Report a problem</h2>
  <p>
    Open an issue at
    <a href="https://github.com/LilyDesignSystem/lily-design-system"
      >github.com/LilyDesignSystem/lily-design-system</a
    >
    or email
    <a href="mailto:joel@joelparkerhenderson.com"
      >joel@joelparkerhenderson.com</a
    >. Naming a WCAG criterion helps but is not required — “I couldn't operate
    X with the keyboard” is a complete report.
  </p>
  <p>
    The full statement, with the verification table and its review history,
    lives in the repository:
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/accessibility-statement.md"
      >docs/accessibility-statement.md</a
    >.
  </p>
</section>
