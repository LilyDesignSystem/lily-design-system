<svelte:head>
  <title>Lily Design System and DHCW Design System — Lily Design System</title>
  <meta name="description" content="DHCW is a small, styled NHS Wales design system in private beta; Lily is a large unstyled component catalog in eight frameworks, with NHS Wales themes." />
</svelte:head>

<section class="page-intro">
  <h1>Lily Design System and DHCW Design System</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p class="lead">The DHCW Design System is a small, finished, styled NHS Wales system of 28 components in private beta, whereas Lily Design System is a 607-component unstyled catalog in eight frameworks that treats the NHS Wales look as one of 63 themes. This matters because the first gives a Welsh health service a ready visual identity and official standing but only HTML and Nunjucks, while the second gives breadth and framework choice but no organisation behind it and no outside accessibility audit. Choose DHCW if you build an NHS Wales service in plain HTML or Nunjucks and want its look and page templates, and choose Lily if you need a framework other than those or components DHCW does not have.</p>

  <h2>Who is behind it, and how mature it is</h2>
  <p>The DHCW Design System is published by Digital Health and Care Wales. Its home page is labelled "Beta" and announces a "private beta release" dated 23 October 2026, and its terms of use call it "a new service" for which DHCW is responsible for content, maintenance and operation. It sets out nine design principles, a contact address (design.system@wales.nhs.uk) and an accessibility statement. That is the backing of a public body, which matters if your procurement or governance asks who owns the thing you depend on.</p>
  <p>Lily has one maintainer. Its own MAINTAINERS.md says "The bus factor of this project is one", that no organisation stands behind it and that no legal entity is a party to it. Lily is also not affiliated with or endorsed by NHS Wales or DHCW. Lily is much larger, but size is not the same as support.</p>
  <p>Neither site is old. DHCW's is weeks old and in private beta, so expect its components, colours and wording to change. The site itself has small inconsistencies, for example a summary-list example that shows "Change" links without the visually hidden text its own guidance asks for. Lily's maturity is a different problem: a lot of surface, written quickly, tested mostly by its own automated checks.</p>

  <h2>What you install: HTML and Nunjucks, or eight framework libraries</h2>
  <p>DHCW documents each component as HTML with an <code>nhsw-</code> class prefix and as a Nunjucks macro, for example <code>nhswHeader</code> and <code>nhswDateInput</code>. Its colour tokens are Sass variables named <code>$nhswales-*</code>. Its site-navigation overflow variant needs a script called <code>nhsw-behaviours.js</code>. Lily adopted the idea as an overflow mode of its navigation menu, with links that simply wrap when scripts are off. The pages I read name no npm package, no version and no source repository, so I cannot tell you how a team installs and updates it. The terms of use do say that "The code in the design system is available under the MIT licence."</p>
  <p>Lily's catalog is implemented as headless libraries for HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks and Web Components (as custom elements, with a handful of components excluded by architecture), plus an Alpine.js set of markup snippets and one plugin. The same component names and class hooks appear in each. If your service is in React, Angular or Blazor, DHCW gives you markup to translate by hand, whereas Lily gives you a component. The cost is more moving parts: Lily has many packages, and its components ship no CSS at all.</p>

  <h2>Styled out of the box, or unstyled with a theme</h2>
  <p>DHCW is a styled system. It gives you navy <code>#1B365D</code> buttons, a link colour of <code>#005AA8</code>, a yellow <code>#FFEB3B</code> focus colour, Roboto with an Arial fallback ("Default to Arial if Roboto is not available"), a stated type scale from 48 px headings to 14 px small text, breakpoints at 320, 641, 769 and 990 px, and eight inline SVG icons. It also offers page templates: public-facing ones for patients and carers, and dashboard templates for staff with left-hand navigation. A team using it gets a recognisable NHS Wales page with little design work. Its colours page lists no dark mode or alternative theme.</p>
  <p>Lily's components carry no colour, font or spacing, so the page looks like nothing until you add CSS. It ships 63 reference theme stylesheets, two of which are NHS Wales themes (for patients and for practitioners). Those themes took their link, hover, visited and active colours from the DHCW site after the 23 October 2026 beta, with the navy, gold rail and yellow focus alongside. They are an independent implementation against Lily's class hooks, not DHCW code, and not endorsed by it. If you want the DHCW look on Lily, the theme gives you a head start, but DHCW's own CSS is the authority and a theme can lag it.</p>

  <h2>Scope: 28 components against 583</h2>
  <p>DHCW lists 28 components, from action link and back link through date input, file upload, header, summary list, tabs and warning callouts. That is a deliberately small set for forms and content pages. It also documents a patient header (a section with its own <code>nhsw-patient-header</code> classes). Lily has no single patient-header component; since 2026-10-29 it documents a patient banner as a composition of a labelled section, a description list and the national identifier view components, with the rule that no field is truncated or hidden at a narrow width. Its date input guidance is adapted from the GOV.UK Design System, and says "Never automatically move users between the day, month and year fields."</p>
  <p>Lily's catalog (components.tsv) has 607 rows, including data grids, charts, calendars, Gantt and kanban helpers and 164 national identifier components. Lily's own comparison survey has 429 rows, and 53 of them match a DHCW component. By construction Lily covers all 429, because the survey is built from Lily's catalog, so that count says nothing about quality. For a typical NHS Wales form-and-content service, 28 components may be all you need, and a smaller set is easier to learn and to review.</p>

  <h2>Accessibility evidence and Welsh-language support</h2>
  <p>DHCW's accessibility statement says "This website is compliant with the Web Content Accessibility Guidelines 2.2 AA standard", based on internal testing of "a representative sample of pages, components and functionality" in October 2026, and gives an address for reporting problems and a ten-working-day response time. Its component pages cite specific WCAG 2.2 criteria, for example 2.4.11 (focus not obscured) for its navigation menu. It also has errors: its tag page says colour pairs meet 1.4.3 "Contrast Enhanced", and 1.4.3 is the minimum-contrast criterion. Lily targets WCAG 2.2 AAA and runs automated AA checks with axe-core, but it has never been audited, and COMPARE.md says so. Both claims rest on internal testing. Neither is an independent audit.</p>
  <p>Welsh is where the two differ most in practice. DHCW's fourth principle is "Design services in Welsh and English" and says "Treat those who speak Welsh equally with those who speak English." But the pages I read say little about how: the accessibility statement does not mention Welsh, the typography page has nothing on text expansion, and the header, date input and page-template pages give no bilingual guidance. A principle is not a component behaviour. Lily's rule is that components hold no hardcoded strings, so every label is yours to supply in Welsh. Lily's NHS Wales themes include a <code>:lang(cy)</code> block, its responsive tests lengthen labels by 30 percent with <code>lang="cy"</code>, and its docs site has a Welsh translation. These are modest, but they are things you can read and run. DHCW is a Welsh service and Lily is not: Lily's target is every country, region and federation, so its themes for NHS Wales are a few of many, and none of its components may assume one country's conventions.</p>

  <h2>Licence</h2>
  <p>DHCW's terms of use say its code is under the MIT licence. Its content, such as guidance text and images, is under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">United Kingdom (UK) Open Government License (OGL) version 3 for Public Sector Information</a>. The OGL lets you copy, adapt and use the content commercially if you acknowledge the source, so reusing DHCW's wording needs an attribution line. Lily's own code is under a choice of five licences (MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause).</p>

  <h2>Sources</h2>
  <ul>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/">DHCW Design System home</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/design-principles.html">Design principles</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/">Components</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/header.html">Header</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/date-input.html">Date input</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/tag.html">Tag</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/site-navigation.html">Site navigation</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/summary-list.html">Summary list</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/colours.html">Colours</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/typography.html">Typography</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/layout.html">Layout</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/styles/icons.html">Icons</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/patterns/page-templates.html">Page templates</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/accessibility-statement.html">Accessibility statement</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/contact-us.html">Contact us</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/terms-of-use.html">Terms of use</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/privacy-policy.html">Privacy policy</a></li>
    <li><a href="https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/cookie-policy.html">Cookie policy</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/COMPARE.md">Lily COMPARE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/MAINTAINERS.md">Lily MAINTAINERS.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/components.tsv">Lily components.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/compare/compare.tsv">Lily comparisons.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/spec/dhcw-design-system-lessons/index.md">Lily spec: DHCW lessons</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/spec/internationalization/index.md">Lily spec: internationalization</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/AGENTS/theme.md">Lily AGENTS/theme.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/themes/united-kingdom-national-health-service-wales-for-patients.css">Lily NHS Wales patients theme</a></li>
  </ul>

  <p><a href="/compare/">All comparisons</a></p>
</section>
