<script lang="ts">
  const html: string = "<h1>Theme View</h1>\n\n<p>ThemeView is a headless component that displays the current theme name as inline text. It renders the theme value in a <code>&lt;span&gt;</code> element with an accessible label, making the current theme selection readable by screen readers.</p>\n\n<p>This component is commonly paired with ThemeSelect in an Input/View pattern. While ThemeSelect allows the user to select a theme, ThemeView displays the currently active theme. It is useful in settings panels, status bars, or anywhere the current theme needs to be communicated visually and programmatically.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;span&gt;</code> element containing the theme value as text content</li>\n<li>Uses <code>aria-label</code> to provide an accessible name for the displayed value</li>\n<li>Both <code>label</code> and <code>value</code> are required props</li>\n<li>Spreads <code>restProps</code> onto the span for consumer customization</li>\n<li>pattern: standard props destructuring with typed props</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (required) -- accessible name for the display element via <code>aria-label</code></li>\n<li><code>value</code>: string (required) -- the current theme name to display as text content</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;span&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Display the current theme in a settings summary:</p>\n\n<pre><code class=\"language-html\">&lt;ThemeView label=\"Current theme\" value=\"dark\" /&gt;</code></pre>\n\n<p>In a summary list alongside other preferences:</p>\n\n<pre><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem&gt;\n    &lt;dt&gt;Theme&lt;/dt&gt;\n    &lt;dd&gt;&lt;ThemeView label=\"Current theme\" value={currentTheme} /&gt;&lt;/dd&gt;\n  &lt;/SummaryListItem&gt;\n  &lt;SummaryListItem&gt;\n    &lt;dt&gt;Language&lt;/dt&gt;\n    &lt;dd&gt;English&lt;/dd&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;</code></pre>\n\n<p>In a status bar showing the active theme:</p>\n\n<pre><code class=\"language-html\">&lt;footer&gt;\n  &lt;ThemeView label=\"Active theme\" value={theme} data-theme={theme} /&gt;\n&lt;/footer&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- this component is a passive display element with no interactive behavior.</p>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label={label}</code> -- provides an accessible name describing what the displayed value represents</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display the current theme in read-only format in settings summaries and status bars.</li>\n<li>Use in confirmation screens where the user has just selected a theme and needs to see it confirmed.</li>\n<li>Use when displaying the active theme alongside other user preferences.</li>\n<li>Use in admin panels to show the theme assigned to a user or organisation.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when users need to select or change the theme -- use <a href=\"../theme-select/\">ThemeSelect</a> instead.</li>\n<li>Do not use for general-purpose text display -- use a <code>&lt;span&gt;</code> or <a href=\"../badge/\">Badge</a> instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a <code>&lt;span&gt;</code> element with <code>aria-label</code> for accessible read-only theme display. The consumer provides all visual styling, including typography, color, and layout.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.theme-view</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>theme-view</code></li>\n<li>Verify aria-label={label}` -- provides an accessible name describing what the displayed value represents</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Style the theme name to visually reflect the current theme (e.g., dark text for dark mode label) so users can confirm at a glance.</li>\n<li><strong>Developers</strong>: Keep the <code>value</code> prop in sync with the actual applied theme so the display is always accurate.</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>ThemeView is the read-only display counterpart to ThemeSelect. Use ThemeView to show the current theme, and pair it with ThemeSelect for editing.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>theme-select</code> — a select dropdown for choosing a theme</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"theme-view\" role=\"img\" aria-label=\"Current theme: Light\">Light</span>";
  const svelteSource: string = "// In your Svelte component:\nimport ThemeView from \"lily-design-system-svelte-headless/components/ThemeView/ThemeView.svelte\";\n\n<ThemeView label=\"Label\" value=\"Sample value\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Theme View — Lily Design System</title>
  <meta name="description" content="ThemeView is a headless component that displays the current theme name as inline text. It renders the theme value in a &lt;span&gt; element with an accessible label, making the current theme selection re..." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <pre style="overflow-x: auto; padding: 1rem; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/theme-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: theme-view</li>
      <li>PascalCase: ThemeView</li>
      <li>Description: a read-only display of the current theme</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .theme-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label=&#123;label&#125;</code> -- provides an accessible name describing what the displayed value represents</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions — this is a passive element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- accessible name for the display element via <code>aria-label</code></li>
      <li><code>value</code>: string (required) -- the current theme name to display as text content</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;span&gt;</code> element</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
