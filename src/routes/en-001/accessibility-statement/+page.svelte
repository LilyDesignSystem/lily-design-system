<svelte:head>
  <title>Accessibility statement — Lily Design System</title>
  <meta
    name="description"
    content="How accessible this website is, what is known to fall short, how to get content in another format, and how to report a problem."
  />
</svelte:head>

<section class="page-intro">
  <h1>Accessibility statement</h1>
  <p class="page-intro-tagline">
    This statement covers the Lily Design System website at lilydesignsystem.com. It was prepared on 21 November 2026.
  </p>
</section>

<section class="prose">
  <h2>What you should be able to do</h2>
  <p>We want as many people as possible to use this site. You should be able to:</p>
  <ul>
    <li>change colours, contrast and fonts using the theme and text-size controls in the header, or your own browser and device settings;</li>
    <li>zoom in to 400 percent without text spilling off the screen or content needing sideways scrolling;</li>
    <li>use every page with a keyboard alone, starting from the “Skip to main content” link;</li>
    <li>use the site with a screen reader, speech recognition or switch access;</li>
    <li>read the site in a right-to-left language with the page mirrored.</li>
  </ul>

  <h2>How accessible this site is</h2>
  <p>
    The standard we aim for is WCAG 2.2 level AAA. We say we <em>aim for</em> it, not that we meet it: no independent
    audit has been carried out, so we do not claim conformance at any level. The <a href="/accessibility/">accessibility page</a>
    sets out exactly what is checked, by what, and what is not checked by anything.
  </p>
  <p><strong>What is checked.</strong> Automated tests assert each component’s roles, names and keyboard behaviour. Example pages
    are swept with an automated accessibility checker, and are tested for horizontal scrolling at 320 CSS pixels.</p>

  <h2>What we know falls short</h2>
  <ul>
    <li><strong>Screen readers.</strong> Behaviour with VoiceOver, NVDA, JAWS and TalkBack has been tested only in part. Automated tests check markup, not what is announced.</li>
    <li><strong>Enhanced contrast (AAA).</strong> Some themes do not reach 7:1 for all text. The light and dark themes are required to reach 4.5:1; other themes are a reader’s choice, and their results are published on the <a href="/en-001/colours/">colours page</a>.</li>
    <li><strong>Translations.</strong> Sixty-three of the 64 language label packs are machine drafts that a native speaker has not reviewed, so wording read by a screen reader may be wrong.</li>
    <li><strong>Live demonstrations.</strong> Some demonstration pages update on their own, such as the patient monitoring example. They have a control to pause updates, but we have not tested every combination of assistive technology with them.</li>
    <li><strong>Documents.</strong> Some older Markdown documents in the source repository link to external sites we do not control.</li>
  </ul>

  <h2>Content in another format</h2>
  <p>
    Every page is plain HTML. Many pages also have a Markdown version, which is the same text without the layout. If you
    need something in another form, such as large print, easy read or audio, open an issue and say what you need. We will
    reply, and where we can make it, we will.
  </p>

  <h2>Report a problem</h2>
  <p>
    If something on this site does not work for you, tell us at
    <a href="https://github.com/LilyDesignSystem/lily-design-system/issues">the issue tracker</a>, or use the contact
    details on the <a href="/accessibility/">accessibility page</a>. “I could not operate this with the keyboard” is a
    complete report. You do not need to name a WCAG criterion. Please say which page, which browser and which assistive
    technology you were using, if you know.
  </p>

  <h2>If you are not happy with our reply</h2>
  <p>
    This is a volunteer-run, open-source project and is not a public sector body, so no statutory accessibility
    regulation applies to it directly. If you are in a country with an accessibility regulator and you want to raise a
    concern about a public-sector service that uses Lily, contact that service and its regulator.
  </p>

  <h2>Our plans</h2>
  <ul>
    <li>An independent accessibility audit is the first planned use of any project funding.</li>
    <li>Screen-reader sessions across the main widgets, with the results published.</li>
    <li>Native-speaker review of the language packs, starting with those whose scripts and reading directions differ most.</li>
  </ul>

  <p>
    <strong>This statement was last reviewed on 21 November 2026.</strong> It will be reviewed again when the site changes
    in a way that affects accessibility, and at least once a year.
  </p>
</section>
