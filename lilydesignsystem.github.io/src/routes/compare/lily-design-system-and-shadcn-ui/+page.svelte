<svelte:head>
  <title>Lily Design System and shadcn/ui — Lily Design System</title>
  <meta name="description" content="shadcn/ui puts component source in your project through a CLI and registry; Lily publishes headless packages across eight frameworks. How to choose." />
</svelte:head>

<section class="page-intro">
  <h1>Lily Design System and shadcn/ui</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p class="lead">shadcn/ui is a code distribution platform that copies styled component source into your project through a command-line tool, while Lily Design System publishes unstyled, accessible components as packages for eight frameworks and leaves every visual decision to you. The difference matters because it decides who maintains the component code, how much design you get on day one, and which frameworks you can use. Choose shadcn/ui when you want a good-looking, editable React-based starting point quickly, and choose Lily when you need one accessibility and naming contract across several frameworks or a design-free base for your own look.</p>

  <h2>Code you copy versus packages you install</h2>
  <p>shadcn/ui's documentation says "This is not a component library. It is how you build your component library." You run a CLI, and the component source lands in your repository. Its docs list the commands <code>init</code>, <code>add</code>, <code>view</code>, <code>search</code>, <code>build</code>, <code>migrate</code> and <code>eject</code>, among others, and by default <code>add</code> does not overwrite files that already exist.</p>
  <p>Lily's main route is the reverse: each headless library is a package you install, with the components as its public surface. Lily can also be copied, and its own example apps do exactly that: <code>bin/sync-example-components</code> keeps four example apps' copies of every component identical to their headless library. But Lily has no command that copies a component into your project, and Lily's own review of the field (<code>COMPARE.md</code>) concludes that shadcn's tooling for copying is better.</p>

  <h2>Who owns the code and who carries upgrades</h2>
  <p>shadcn/ui's "Open Code" principle says "The top layer of your component code is open for modification", so you edit the component rather than override its styles or wrap it. The cost is on your side: once you have edited a copied file, there is no package version to bump. The CLI docs describe a <code>--diff</code> option on <code>add</code> and an <code>--overwrite</code> flag, but they describe no update workflow beyond that. You decide, file by file, what to take from upstream.</p>
  <p>With a Lily package, you upgrade by changing a version number, and a fix to a keyboard handler reaches you without a merge. The trade is that you cannot edit the source in place without forking it. Lily is also one maintainer and has never been independently audited, so a package dependency on Lily carries a different risk than a copy you fully control.</p>

  <h2>What each is built on, and how it is styled</h2>
  <p>shadcn/ui's changelog says its newer components are "available for Base UI, React Aria and Radix across all eight styles", which shows that it supports more than one primitive library underneath. The pages I read do not say which is the default for a new project or how you choose, and they do not state that Tailwind CSS is required, although the theming docs map tokens to Tailwind utilities such as <code>bg-background</code> and the <code>components.json</code> docs have a Tailwind section. Treat the Tailwind and primitive-library choices as something to confirm in its documentation before you commit.</p>
  <p>The components arrive with "beautiful defaults": considered default styles that look good alone and together. Lily has no styling opinion in its headless layer. It ships semantic HTML, ARIA, focus management and keyboard behaviour, plus a stable kebab-case class hook on every element, and no CSS framework dependency. Its <code>themes/</code> directory holds 57 reference stylesheets, but those are references, not a design language. If you want something that looks finished this week, shadcn/ui does more for you.</p>

  <h2>Framework coverage</h2>
  <p>shadcn/ui's installation page lists Next.js, Vite, TanStack Start, Laravel, React Router and Astro, plus a manual setup. Its registry page says a registry "works with any framework, not only React", and its home page says it "works with your favorite frameworks". The pages I read do not name the component frameworks (React, Vue, Svelte and so on) its own components are written for. Its <code>components.json</code> has an <code>rsc</code> option for React Server Components, which suggests a React centre of gravity, but I could not confirm that from the docs.</p>
  <p>Lily publishes the same catalogue as full headless libraries for HTML, Svelte, React, Vue, Angular, Blazor and Nunjucks, plus a Web Components library covering 547 of the 582 components and an Alpine.js set of markup snippets with one plugin. If your organisation mixes frameworks, or uses .NET (Blazor) or server-rendered Nunjucks templates, that is the main practical reason to prefer Lily.</p>

  <h2>Catalogue size, theming and the registry format</h2>
  <p>shadcn/ui's components page lists 66 components, from Accordion to Typography, including newer ones such as Trace, Code Block and Questionnaire. Lily's <code>components.tsv</code> has 582 rows. That count is not a measure of quality: Lily counts every table part, identifier input and chart as its own entry, and a larger catalogue is also more to keep correct. In Lily's own survey (<code>compare/compare.tsv</code>, 428 rows), 152 rows match a shadcn/ui component, and Lily covers all 428 by construction, because the survey is built from Lily's catalogue. So that figure shows where shadcn/ui overlaps Lily, not who has more.</p>
  <p>Theming in shadcn/ui is CSS variables: semantic tokens such as <code>background</code>, <code>foreground</code> and <code>primary</code> under <code>:root</code> and <code>.dark</code>, with <code>oklch()</code> colour values and a single <code>--radius</code> base. You can host your own registry, and the docs mention private and authenticated registries, so a team can distribute its own components the same way. Lily themes are plain stylesheets that target the class hooks, swapped at runtime by its <code>theme-picker</code>, and it has no installable registry. Lily's planned lessons from a related review (<code>spec/coss-ui-lessons</code>) include per-component JSON manifests, and the docs site already publishes <code>/r/slug.json</code> manifests, but Lily has no CLI that installs from them.</p>

  <h2>AI-readiness, accessibility and internationalisation</h2>
  <p>shadcn/ui describes itself as "AI-Ready": "Open code for LLMs to read, understand, and improve." Because the source is in your repository, a coding assistant can read and change it directly. Lily approaches the same goal from the documentation side: every component has an <code>AGENTS.md</code> with its HTML tag, ARIA and keyboard contract, and the repository publishes <code>llms.txt</code> and <code>llms.json</code>. Neither side has shown that its approach produces better results from an assistant.</p>
  <p>shadcn/ui calls its components "accessible", but the pages I read give no conformance target, audit or test results, and the components page says nothing about the primitives' accessibility. On internationalisation, the pages I read cover right-to-left layout ("first-class support for right-to-left (RTL) layouts", with automatic transformation only for projects made with <code>shadcn create</code> and the newer styles) and do not mention translation or locale formatting. Lily targets WCAG 2.2 AAA with automated AA checks and no independent audit, and it takes every visible string as a prop, with 64 label packs for the data-heavy helpers, 63 of them unreviewed machine drafts.</p>

  <h2>Licence and maintainers</h2>
  <p>shadcn/ui is MIT licensed, with the copyright held by shadcn (2023), and its GitHub page showed about 126.8k stars on 28 October 2026. Its docs home page says it is built by shadcn at Vercel. A copy-in model pairs well with a permissive licence, since the code becomes part of your project.</p>
  <p>Lily is released under a choice of licences (MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause) and is maintained by one person. If your procurement process needs a vendor, a support contract or a conformance statement, neither project offers one in the pages I read, and a large, widely used project is a lower adoption risk than a new one.</p>

  <h2>Sources</h2>
  <ul>
    <li><a href="https://ui.shadcn.com/docs">shadcn/ui documentation</a></li>
    <li><a href="https://ui.shadcn.com/docs/installation">shadcn/ui installation</a></li>
    <li><a href="https://ui.shadcn.com/docs/cli">shadcn/ui CLI</a></li>
    <li><a href="https://ui.shadcn.com/docs/components">shadcn/ui components</a></li>
    <li><a href="https://ui.shadcn.com/docs/components-json">shadcn/ui components.json</a></li>
    <li><a href="https://ui.shadcn.com/docs/theming">shadcn/ui theming</a></li>
    <li><a href="https://ui.shadcn.com/docs/registry">shadcn/ui registry</a></li>
    <li><a href="https://ui.shadcn.com/docs/rtl">shadcn/ui RTL</a></li>
    <li><a href="https://ui.shadcn.com/docs/changelog">shadcn/ui changelog</a></li>
    <li><a href="https://github.com/shadcn-ui/ui">shadcn-ui/ui on GitHub</a></li>
    <li><a href="https://github.com/shadcn-ui/ui/blob/main/LICENSE.md">shadcn-ui/ui LICENSE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/COMPARE.md">Lily COMPARE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/compare/compare.tsv">Lily compare/compare.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/components.tsv">Lily components.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/bin/sync-example-components">Lily bin/sync-example-components</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/AGENTS/lily.md">Lily AGENTS/lily.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/spec/coss-ui-lessons/index.md">Lily spec/coss-ui-lessons/index.md</a></li>
  </ul>

  <p><a href="/compare/">All comparisons</a></p>
</section>
