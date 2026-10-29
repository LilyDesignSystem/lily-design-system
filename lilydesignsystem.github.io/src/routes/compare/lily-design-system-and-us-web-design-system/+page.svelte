<svelte:head>
  <title>Lily Design System and U.S. Web Design System — Lily Design System</title>
  <meta name="description" content="USWDS is a styled US federal design system with a conformance report and public-domain code; Lily is an unstyled, multi-framework catalog with no audit." />
</svelte:head>

<section class="page-intro">
  <h1>Lily Design System and U.S. Web Design System</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p class="lead">The U.S. Web Design System (USWDS) is a styled, Sass-and-utility-class toolkit run by a US federal agency with a published accessibility conformance report and public-domain code, whereas Lily Design System is an unstyled catalog of 582 components across eight headless framework libraries, maintained independently and never audited. This matters because USWDS gives a federal team a recognised, evidenced starting point with a fixed look, while Lily leaves every visual decision and every framework choice to you but cannot hand an auditor a report. Choose USWDS when you build a US government service and need its look, its guidance and its conformance evidence; choose Lily when you need the same accessible markup in several frameworks and will do your own styling and audit.</p>

  <h2>Who runs it and who stands behind it</h2>
  <p>USWDS describes itself as a product of the General Services Administration's Technology Transformation Services, "maintained by the Digital Services Division". It began in 2015, built by 18F and the U.S. Digital Service, and its about page says it operated "under the guidance of an advisory board" of staff from several agencies. It is also "an active open source community of government engineers, content specialists, and designers", with contributors inside and outside government, and says it supports "dozens of agencies and nearly 200 sites". The about page does not say how USWDS is funded.</p>
  <p>Lily Design System has one maintainer and no sponsoring institution, a fact its own comparison document states plainly. There is no vendor, support contract or service level behind it. For a team that needs to name an organisation that will still maintain the system in five years, a government-run project with an advisory board is a stronger answer than one person.</p>

  <h2>What you install, and what you have to build</h2>
  <p>USWDS ships as an npm package, <code>@uswds/uswds</code>, with a prebuilt <code>dist</code> folder (<code>uswds.min.css</code>, <code>uswds.min.js</code>, <code>uswds-init.min.js</code>) or Sass source. Its developer guide describes a compile step using <code>@uswds/compile</code> and Gulp, and says "Browsers can't read native Sass files, so these files need to be compiled into CSS." The README mentions React, Angular, Webpack and Twig in examples, and the compile guide refers to web components such as <code>&lt;usa-banner&gt;</code>, but the pages I read do not list officially supported framework packages.</p>
  <p>Lily is a set of framework libraries instead: HTML, Svelte, React, Vue, Angular, Blazor and Nunjucks, plus Web Components (a subset) and Alpine.js snippets, each implementing the same catalog under the same class names. They contain no CSS, so installing one gives you correct markup, ARIA and keyboard behaviour and nothing visible. If your team already has a framework, Lily is written for it. If your team wants a working, styled page the day it installs the package, USWDS gets you there faster.</p>

  <h2>How it is styled</h2>
  <p>USWDS is opinionated about appearance. Its design tokens are a limited set of predefined values: colour, typesetting, spacing units, flex, opacity, order, shadow and z-index. You set them in Sass settings, read them through functions such as <code>color('red')</code> and <code>units(1)</code>, and apply them in markup through utility classes such as <code>margin-top-2</code> or <code>.border-red</code>. Utilities cover layout grid, colour, margin and padding, borders, fonts, display, flex and more, and can be switched on or off with settings like <code>$output-these-utilities</code>.</p>
  <p>Lily has no utility classes and no Sass. Each component carries a stable kebab-case class name and you write CSS, or use a framework such as Tailwind, against it. Lily ships 57 reference theme stylesheets, using custom properties such as <code>--theme-color-primary</code>; one of them, <code>united-states-web-design-system.css</code>, takes its visual reference from USWDS. It is a look-alike for convenience, not an endorsement, and it does not make Lily components USWDS components. If you want the genuine USWDS markup and styling, use USWDS itself.</p>

  <h2>Accessibility commitments and evidence</h2>
  <p>USWDS states the legal baseline as Section 508, which "incorporated the Web Content Accessibility Guidelines (WCAG) 2.0 Level AA", and says it works toward WCAG 2.1 AA, meets as many WCAG 2.2 criteria as it can, and "intend[s] to incrementally work toward AAA compliance". It used the VPAT 2.5 template to produce an accessibility conformance report covering 44 components of USWDS 3.11.0, assessed in March 2025 and published in May 2025; the page marks per-component conformance status as "in progress". Its testing combines Pa11y and aXe on every code change with manual keyboard, zoom, touch and screen-reader testing (it names VoiceOver and JAWS). It also says that using its components "does not guarantee an accessible service".</p>
  <p>Lily targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring Practices, and it runs automated axe checks at AA across its example apps. It has never been independently audited and publishes no VPAT. Lily's comparison document lists USWDS among the systems to use when you need an accessibility conformance statement. Lily's higher stated target is an intention, not evidence; USWDS's lower stated target comes with a report you can show a procurement officer.</p>

  <h2>Component scope, templates and language guidance</h2>
  <p>The USWDS components overview page lists 47 components (the home page says 48), grouped as navigation, buttons, content, feedback and forms, plus 3 patterns (create a user profile, complete a complex form, select a language) and 5 page templates (404 page, documentation page, landing page, authentication pages, form templates). Those patterns and templates are real strengths for government services, where the same few pages recur. It includes a language selector component whose guidance covers when to use it, setting the HTML <code>lang</code> attribute and marking passages in other languages; the page I read does not address right-to-left text or plain language.</p>
  <p>Lily's catalog is far wider: 582 components, including charts, a data grid, Gantt, kanban and calendar helpers, and 140 national identifier input and view components. Lily's own survey, covering 428 rows, matches 123 rows to a USWDS component; Lily is at 428 of 428 by construction, because the survey was built from Lily's catalog, so that figure shows breadth of catalog, not quality. In Lily, every user-facing string is supplied by the consumer, there is no built-in English, and locale pickers set <code>lang</code> and <code>dir</code>. That supports right-to-left and many languages, but it also means Lily gives no content guidance of its own.</p>

  <h2>Licence</h2>
  <p>USWDS's README says most of the project is in the public domain under the CC0 1.0 Universal dedication. Its <code>LICENSE.md</code> says "A few parts of this project are not in the public domain": Google Material Icons and Roboto Mono fall under Apache 2.0, the Source Sans Pro, Merriweather and Public Sans fonts under the SIL Open Font License 1.1, and some files under the MIT licence or CC0. You can use it without conditions, apart from those few parts.</p>
  <p>Lily is licensed, at your option, under any of MIT, Apache 2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause, with custom terms available on request. It bundles no fonts or icon sets. Both are free to use commercially, but USWDS's public-domain dedication is the simpler position, and Lily's multi-licence choice is the more flexible one.</p>

  <h2>Sources</h2>
  <ul>
    <li><a href="https://designsystem.digital.gov/">U.S. Web Design System home page</a></li>
    <li><a href="https://designsystem.digital.gov/about/">USWDS about page</a></li>
    <li><a href="https://designsystem.digital.gov/components/overview/">USWDS components overview</a></li>
    <li><a href="https://designsystem.digital.gov/components/language-selector/">USWDS language selector</a></li>
    <li><a href="https://designsystem.digital.gov/design-tokens/">USWDS design tokens</a></li>
    <li><a href="https://designsystem.digital.gov/utilities/">USWDS utilities</a></li>
    <li><a href="https://designsystem.digital.gov/documentation/accessibility/">USWDS accessibility documentation</a></li>
    <li><a href="https://designsystem.digital.gov/documentation/getting-started/developers/phase-two-compile/">USWDS developer guide: compile</a></li>
    <li><a href="https://github.com/uswds/uswds">USWDS GitHub repository (README)</a></li>
    <li><a href="https://github.com/uswds/uswds/blob/develop/LICENSE.md">USWDS LICENSE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/components.tsv">Lily components.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/COMPARE.md">Lily COMPARE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/compare/compare.tsv">Lily comparisons.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/themes/united-states-web-design-system.css">Lily united-states-web-design-system.css</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/LICENSE.md">Lily LICENSE.md</a></li>
  </ul>
  <p><a href="/compare/">All comparisons</a></p>
</section>
