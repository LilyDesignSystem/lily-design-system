<svelte:head>
  <title>Lily Design System and GOV.UK Design System — Lily Design System</title>
  <meta name="description" content="GOV.UK Design System is the Government Digital Service's styled kit for government services; Lily is an independent, unstyled catalog. How to choose." />
</svelte:head>

<section class="page-intro">
  <h1>Lily Design System and GOV.UK Design System</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p class="lead">The GOV.UK Design System is the Government Digital Service's styled kit of styles, components and patterns for government services, while Lily Design System is an independent, unstyled catalog of 582 components that takes GOV.UK only as a visual reference. This matters because a service that must look and behave like GOV.UK needs the real thing, and Lily has never been audited and has one maintainer. You choose GOV.UK Frontend when you are building a government service, and Lily when you are not bound to the GOV.UK look and want one contract across several frameworks.</p>

  <h2>Who owns it and who stands behind it</h2>
  <p>The GOV.UK Design System home page says it is maintained by the GOV.UK Design System team at the Government Digital Service, and the govuk-frontend README says "GOV.UK Frontend is maintained by a team at Government Digital Service." Questions go to that team by email or Slack, and the README notes that the team cannot monitor the repository outside office hours (10am to 4pm, UK time). It also says contributions are welcome from anyone, and the design system site has open GitHub discussions and a roadmap.</p>
  <p>Lily is maintained by one unpaid person, and Lily's own COMPARE.md says so under "where the alternatives are stronger". It lists "Actual GOV.UK or NHS compliance" as a case where govuk-frontend is the right choice: it is the real thing, maintained by the organisation that owns it. Lily's GOV.UK theme takes visual reference only and carries no endorsement. If you need a named public body behind your front end, Lily cannot offer that.</p>

  <h2>What you install, and what is in the box</h2>
  <p>GOV.UK Frontend is a styled package. Its documentation says it "provides the elements developers need to create consistent, easy to use, fast and secure government services". The recommended install is npm, and the alternative is copying precompiled CSS, JavaScript and asset files into your project. For CSS, you can link the precompiled <code>govuk-frontend.min.css</code> with no Sass, or use <code>@use</code> in a Sass build to take all styles or only parts (base, core, objects, components, utilities, overrides). The pages I read say <code>@import</code> is planned for deprecation in a v6.x release and unavailable from v7.0.0. The pages also list a Sass API and a JavaScript API reference. Nunjucks is described there as an option for generating the HTML of pages and components. I could not load the dedicated npm and Nunjucks install pages (both returned 404 at the addresses I tried), so I cannot describe them further.</p>
  <p>Lily is the opposite: the headless libraries ship semantic markup, ARIA, focus management and keyboard behaviour, with no stylesheet, font or icon. Styling comes from your own CSS, or from one of 57 reference theme stylesheets in <code>themes/</code>, one of which is <code>united-kingdom-government-digital-service.css</code>. That theme is built against Lily's class hooks, not against GOV.UK's markup, so it is not a drop-in replacement for govuk-frontend. Lily's migration guide says it is "a naming and structure map, not a compatibility layer".</p>

  <h2>How far you may change the look</h2>
  <p>GOV.UK's Styles page sets rules for people who style things by hand: follow existing GOV.UK conventions, do not assign new meanings to colours, do not change the style of buttons and do not adjust the thickness of borders on form inputs. When you use GOV.UK Frontend or the Prototype Kit, it says the coded examples need no additional styling. The Styles page lists Page template, Layout, Spacing, Typography (including a Typeface section), Colour and Images. I did not find the page text for the typeface, so I make no claim about the font or about brand and logo restrictions; the get started page I read does not mention them.</p>
  <p>Lily makes no visual decisions at all in its headless layer and forbids colours, font declarations and breakpoints there. That gives you freedom to build any look, and it also means you must design, style and check every visual detail yourself. The cost is real: with GOV.UK you get a finished, consistent look, with Lily you get structure and behaviour and have to supply the rest.</p>

  <h2>Frameworks and distribution</h2>
  <p>From the pages I read, GOV.UK Frontend is distributed as CSS, JavaScript, assets and Nunjucks templates, installed from npm or copied in. Its documentation index lists JavaScript behaviour for components such as Accordion, Button and FileUpload. The pages I fetched did not state any support for React, Vue, Angular or Svelte, so I do not claim that GOV.UK has or lacks such wrappers.</p>
  <p>Lily implements the same catalog in eight headless libraries (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks, plus Web Components with 547 of the 582 components) and Alpine.js markup snippets. There are matching example apps and helper packages per framework. If your team works in Blazor or Angular, or switches framework between projects, that coverage is the main reason to look at Lily. Packages publish to npm and NuGet from the monorepo.</p>

  <h2>Components and patterns</h2>
  <p>At the time I read it the GOV.UK components page lists 37 components, among them Accordion, Date input, Exit this page, Language navigation, Password input, Service navigation, Task list and Warning text. The patterns page lists 30 patterns in three groups: Ask users for, Help users to, and Pages. It describes patterns as "best practice design solutions for specific user-focused tasks and page types", often using one or more components. Examples include Addresses, Check answers, Create accounts, Question pages and Service unavailable pages.</p>
  <p>Lily's catalog is far larger, at 582 components, and includes charts, data grids and 140 national identifier input and view components. Size is not quality: a system with a few dozen components has usually earned each one through production use. Lily's own survey of 428 component rows (compare/compare.tsv) finds 76 rows that match a GOV.UK component. Lily's column in that survey is 428 by construction, because the rows were built from Lily's catalog, so that figure shows Lily's breadth and says nothing about quality. Lily has no equivalent of GOV.UK's written pattern guidance, which rests on research with government services.</p>

  <h2>Accessibility evidence</h2>
  <p>The GOV.UK accessibility page I read names no WCAG version or level; it speaks only of "public sector accessibility regulations". It says using the design system does not by itself make a service accessible, and that a service needs "additional research, design, development and testing work". It points to an accessibility strategy and an accessibility statement about GOV.UK Frontend and its documentation sites. The pages I fetched did not describe audit methods or assistive technology testing, so I cannot say what testing GDS carries out.</p>
  <p>Lily targets WCAG 2.2 AAA and follows WAI-ARIA Authoring Practices 1.2, runs automated axe-core checks on its example apps, and has never had an independent audit. It cannot give you a conformance statement or VPAT. For a service that must publish an accessibility statement, the choice of components is only part of the work, and that holds for either system.</p>

  <h2>Languages, Welsh and licences</h2>
  <p>GOV.UK has a Language navigation component for switching between languages, with Welsh as its example (shown as "Cymraeg"). It states "The component does not translate content" and that you must "create, test and maintain content for all the languages you offer". Components use English by default but "include methods to translate text within them". For languages written right to left, such as Arabic, it says "you'll need to make changes to components and layouts", with no detailed guidance on the page I read.</p>
  <p>Lily ships no English strings in components: every label is a prop, and it provides 64 per-locale label packs for its grid-like helpers (63 are unreviewed machine drafts) and Unicode CLDR time zone names. It inherits direction from your <code>dir</code> attribute. Those translations need review by native speakers, and no Welsh service standard stands behind them.</p>
  <p>On licences, govuk-frontend code is MIT "unless stated otherwise", and the site's content is under the Open Government Licence v3.0 except where otherwise stated, and is Crown copyright. Lily is offered under a choice of MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause. Both are free to use.</p>

  <h2>Sources</h2>
  <ul>
    <li><a href="https://design-system.service.gov.uk/">GOV.UK Design System home page</a></li>
    <li><a href="https://design-system.service.gov.uk/get-started/">Get started</a></li>
    <li><a href="https://design-system.service.gov.uk/styles/">Styles</a></li>
    <li><a href="https://design-system.service.gov.uk/components/">Components</a></li>
    <li><a href="https://design-system.service.gov.uk/components/language-navigation/">Language navigation</a></li>
    <li><a href="https://design-system.service.gov.uk/patterns/">Patterns</a></li>
    <li><a href="https://design-system.service.gov.uk/accessibility/">Accessibility</a></li>
    <li><a href="https://frontend.design-system.service.gov.uk/">GOV.UK Frontend documentation</a></li>
    <li><a href="https://frontend.design-system.service.gov.uk/import-css/">Import CSS</a></li>
    <li><a href="https://github.com/alphagov/govuk-frontend">govuk-frontend README</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/COMPARE.md">Lily COMPARE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/docs/migrating/govuk.md">Lily migration guide for GOV.UK Frontend</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/themes/united-kingdom-government-digital-service.css">Lily GOV.UK GDS theme</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/compare/compare.tsv">Lily comparison survey (comparisons.tsv)</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/components.tsv">Lily component catalog (components.tsv)</a></li>
  </ul>

  <p><a href="/compare/">All comparisons</a></p>
</section>
