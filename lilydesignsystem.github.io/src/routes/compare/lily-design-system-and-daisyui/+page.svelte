<svelte:head>
  <title>Lily Design System and DaisyUI — Lily Design System</title>
  <meta name="description" content="DaisyUI is a styled Tailwind CSS plugin of semantic class names; Lily ships unstyled, accessible components across frameworks. How they differ." />
</svelte:head>

<section class="page-intro">
  <h1>Lily Design System and DaisyUI</h1>
</section>

<section class="section prose" style="margin: 0 auto;">
  <p class="lead">DaisyUI is a Tailwind CSS plugin that gives you finished, styled components through class names such as btn and card, while Lily ships framework components with no CSS and keeps its themes in separate stylesheets. This matters because daisyUI decides how your interface looks and leaves behaviour to you, whereas Lily decides markup, keyboard behaviour and accessible names and leaves the look to you. Choose daisyUI when you already use Tailwind and want a good-looking interface quickly; choose Lily when you want the same accessible components across several frameworks without adopting a CSS framework.</p>

  <h2>A Tailwind plugin with styled class names versus components with no CSS</h2>
  <p>DaisyUI is installed as a Tailwind plugin. Its install page says you need Node.js and Tailwind CSS, then run <code>npm i -D daisyui@latest</code> and add <code>@plugin "daisyui";</code> after <code>@import "tailwindcss";</code> in your CSS. Its own llms.txt tells an AI agent to use Tailwind CSS 4 with daisyUI 5. What you write is ordinary HTML with class names; the Button page lists <code>btn</code> with colour, style, size and modifier classes such as <code>btn-primary</code>, <code>btn-outline</code>, <code>btn-sm</code> and <code>btn-wide</code>. Its home page says "Pure CSS. No JS dependency" and counts 68 components and 600+ utility classes.</p>
  <p>Lily's headless libraries ship no stylesheet at all. A component gives you the most specific semantic element, a stable kebab-case class hook such as <code>button</code> or <code>breadcrumb-nav</code>, ARIA, and focus and keyboard behaviour; the visual decisions are yours. The root specification rules out a Tailwind dependency or utility classes. The consequence is practical: with daisyUI, adding one class gives you a finished button; with Lily, you get the right element and behaviour and must supply, or choose, the styling. Lily does ship styling as a separate, optional layer: the example apps and 57 reference theme stylesheets.</p>
  <p>DaisyUI is also easier to use outside a build step in one respect: its CDN page describes a plain stylesheet link (the full <code>daisyui.css</code> is stated as 63kB compressed, plus the Tailwind browser script), and it documents <code>include</code>, <code>exclude</code> and <code>prefix</code> options so you can ship only some components. Lily has nothing equivalent yet: each theme file carries the whole component stylesheet, and its own review of daisyUI lists a build-only-what-you-use slicer as planned, not built.</p>

  <h2>How themes work: token-only on data-theme versus separate stylesheets</h2>
  <p>In daisyUI, themes are sets of CSS variables. Its themes page says <code>light</code> and <code>dark</code> are enabled by default, <code>themes: all</code> enables all 35 built-in themes, and a theme is applied with <code>data-theme="name"</code> on <code>&lt;html&gt;</code> or on any element, with unlimited nesting. A custom theme is a <code>daisyui/theme</code> plugin block that sets <code>--color-*</code> variables plus radius, size, border, depth and noise values; there is also a theme generator on the site. The components themselves come from one shared stylesheet, so a section of a page can be switched to another theme.</p>
  <p>Lily's themes descend from daisyUI's. Lily's own review records that 35 of its 57 <code>themes/</code> files are daisyUI-derived and credited in their headers, and the rest cover NHS England, Scotland and Wales variants, GOV.UK, USWDS, Carbon, Fluent, Primer and others. The difference is structure. Each Lily theme file carries its token block and then the component rules for the whole catalog, and selects the document root, so a theme applies to the whole page, not to a subtree. The review measured every file at about 134 KB with an identical component section. Splitting this into one shared component sheet and token-only theme files, so themes can be scoped and nested as daisyUI's can, is item 1 of that review and is unchecked; nothing in the repo shows it built.</p>
  <p>Lily does have a runtime theme picker helper that swaps the stylesheet and sets <code>data-theme</code> in eight frameworks. DaisyUI's themes page describes a theme-controller approach and CSS-only switching; this page did not document a persistence mechanism, so do not assume either way.</p>

  <h2>Framework coverage and what JavaScript behaviour you get</h2>
  <p>DaisyUI says it is "Framework agnostic" and "Works on all frameworks", and its install page links guides for Vite, Next.js, Nuxt, Astro, Laravel, Rails, Django, Angular and WordPress, among others. That works because it is only CSS: you write the markup yourself in whichever framework you use. The trade-off appears in the component pages. The modal page says the recommended native <code>&lt;dialog&gt;</code> is opened with <code>ID.showModal()</code>, so JavaScript is required for that variant; the popover and legacy checkbox variants need none. Its llms.txt says the countdown "requires JavaScript to update the text" and the calendar needs a third-party library (Cally, React Day Picker or Vanilla Calendar Pro).</p>
  <p>Lily ships the same 582-component catalog as real components in seven framework libraries (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks), a Web Components library that covers 547 of the 582 components it was built for, and Alpine.js markup snippets with one plugin. Focus, open and closed state and keyboard movement are part of the components, not something you wire up. The cost is that you adopt a component library in a specific framework, and Lily's count is larger than daisyUI's partly because it includes things daisyUI does not try to be, such as 140 national identifier inputs and viewers and chart components.</p>

  <h2>Accessibility and keyboard behaviour</h2>
  <p>DaisyUI does not make accessibility its headline: the home page makes no explicit accessibility claims. Where its component pages speak to it, they are specific and honest. The modal page says the native dialog "is accessible" and closes with Esc, while the legacy checkbox and anchor variants have no Esc support or background locking, and the page does not document focus trapping, focus return or ARIA beyond <code>role="dialog"</code> in legacy examples. The dropdown page describes a focus-based dropdown on a <code>div</code> with <code>tabindex="0"</code> and <code>role="button"</code>, closing "when focus is lost", and does not document arrow-key navigation or Escape. The Button page explains that <code>btn-disabled</code> is only visual and must be paired with <code>tabindex="-1"</code>, <code>role="button"</code> and <code>aria-disabled="true"</code>.</p>
  <p>Lily targets WCAG 2.2 AAA and follows WAI-ARIA Authoring Practices for keyboard patterns, with a documented keyboard contract per component. Be clear about what that means: Lily has never been independently audited, runs automated axe-core checks, and its own COMPARE.md says it has shipped green test suites over real defects. DaisyUI has not been audited either as far as these pages state. The honest reading is that Lily is built around keyboard and ARIA behaviour as its main job while daisyUI leaves much of it to you, but neither offers a conformance statement.</p>

  <h2>AI tooling: Blueprint, a skill and llms.txt versus a link map</h2>
  <p>DaisyUI is well ahead here. Its home page lists an llms.txt, a UI design MCP server called Blueprint, a UI design agent skill and plugins for several coding assistants. Its llms.txt is not a link map but a very long skill file with rules for an agent, including to use only current class names and semantic colours and to use <code>primary</code> once per page. Each component page offers Open in ChatGPT, Open in Claude, a Markdown version and the raw CSS source. Blueprint is a paid product: its page lists $22 per month, $45 per quarter and $600 lifetime, with six tools run in a fixed order.</p>
  <p>Lily publishes an llms.txt and llms.json as a curated map of the project, Claude skills for each framework layer, and per-component Markdown on its docs site. Lily's review of daisyUI lists a rules file, per-page AI links and a read-only MCP server as planned work, and its acceptance criteria for them are unchecked. A search of the repo finds no MCP server script and no <code>.mcp.json</code>, so Lily has no equivalent of Blueprint today. Lily's would be free and read-only if built.</p>

  <h2>Size, licence and maintainers</h2>
  <p>The daisyUI home page lists 68 components, 35 themes and 600+ utility classes. The GitHub licence file begins "MIT License" with "Copyright (c) 2020 Pouya Saadeghi", although the home page links the licence without naming it. The repository page shows about 42.7k stars, and the site credits Pouya Saadeghi as creator, says it is built by the community and links sponsors. It is a mature, widely used project with a large community.</p>
  <p>Lily lists 582 components in its catalog, 57 themes and one maintainer, with a first commit in August 2025. Its licence is a multi-licence SPDX expression (MIT, Apache-2.0, GPL-2.0-only, GPL-3.0-only or BSD-3-Clause), and it has no plugin ecosystem or community to speak of. In Lily's own 428-row survey of component equivalents, 194 rows match a daisyUI component, the most of any system compared; Lily scores 428 of 428 by construction, because the survey is built from Lily's catalog. That tells you daisyUI covers much of the same ground, not that the two are equal in maturity.</p>

  <h2>Sources</h2>
  <ul>
    <li><a href="https://daisyui.com/">daisyUI home page</a></li>
    <li><a href="https://daisyui.com/docs/install/">daisyUI install</a></li>
    <li><a href="https://daisyui.com/docs/themes/">daisyUI themes</a></li>
    <li><a href="https://daisyui.com/docs/config/">daisyUI config</a></li>
    <li><a href="https://daisyui.com/docs/cdn/">daisyUI CDN</a></li>
    <li><a href="https://daisyui.com/components/">daisyUI components index</a></li>
    <li><a href="https://daisyui.com/components/button/">daisyUI Button</a></li>
    <li><a href="https://daisyui.com/components/modal/">daisyUI Modal</a></li>
    <li><a href="https://daisyui.com/components/dropdown/">daisyUI Dropdown</a></li>
    <li><a href="https://daisyui.com/llms.txt">daisyUI llms.txt</a></li>
    <li><a href="https://daisyui.com/blueprint/">daisyUI Blueprint</a></li>
    <li><a href="https://daisyui.com/docs/editor/">daisyUI AI and editor page</a></li>
    <li><a href="https://github.com/saadeghi/daisyui">daisyUI on GitHub</a></li>
    <li><a href="https://raw.githubusercontent.com/saadeghi/daisyui/master/LICENSE">daisyUI LICENSE</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/spec/daisyui-lessons/index.md">Lily: daisyUI lessons</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/COMPARE.md">Lily: COMPARE.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/components.tsv">Lily: components.tsv</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/tasks.md">Lily: tasks.md</a></li>
    <li><a href="https://github.com/lilydesignsystem/lily-design-system/blob/main/AGENTS/headless.md">Lily: headless rules</a></li>
  </ul>

  <p><a href="/compare/">All comparisons</a></p>
</section>
