<script lang="ts">
  const html: string = "<h1>Table Foot</h1>\n\n<p>TableFoot is a headless component that renders a <code>&lt;tfoot&gt;</code> element within a table. It groups footer rows that provide summary or aggregate information.</p>\n\n<p>Use this component within a Table to define the footer section, typically for totals or summary data.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;tfoot&gt;</code> element for table footer group semantics</li>\n<li>Accepts <code>className</code> for CSS class targeting</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;tfoot&gt;</code> element for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (default: <code>\"\"</code>) -- CSS class name for the footer group</li>\n<li><code>children</code>: slot (required) -- footer rows, typically TableRow components</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;tfoot&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Table label=\"Budget\"&gt;\n  &lt;TableFoot&gt;\n    &lt;TableRow&gt;\n      &lt;TableTD&gt;Total&lt;/TableTD&gt;\n      &lt;TableTD&gt;$1,000&lt;/TableTD&gt;\n    &lt;/TableRow&gt;\n  &lt;/TableFoot&gt;\n&lt;/Table&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>Standard table keyboard interactions.</p>\n\n<h2>ARIA</h2>\n\n<p>No additional ARIA attributes. Footer semantics are provided by the <code>&lt;tfoot&gt;</code> element.</p>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside Table to wrap footer rows containing totals or summary information</li>\n<li>Use when a table needs aggregate data such as sums, averages, or counts at the bottom</li>\n<li>Use to provide a visually distinct footer section that screen readers can navigate to</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside of a Table -- use DataTableFoot for DataTable or CalendarTableFoot for CalendarTable</li>\n<li>Do not use for column headings -- use TableHead instead</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders a <code>&lt;tfoot&gt;</code> element. The consumer provides all visual styling.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.table-foot</code> class for targeting.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;tfoot&gt;</code> element</li>\n<li>Verify children content is rendered</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>TableFoot is a child of Table, following the Table pattern: Table &gt; TableHead/TableBody/TableFoot &gt; TableRow &gt; TableTD.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>table</code> — a table with rows and columns &lt;table&gt;</li>\n<li><code>table-body</code> — a table interactive grid tbody &lt;tbody&gt;</li>\n<li><code>table-head</code> — a table interactive grid thead &lt;thead&gt;</li>\n<li><code>table-row</code> — a table interactive grid row &lt;tr&gt;</li>\n<li><code>table-td</code> — a table interactive grid data cell &lt;td&gt;</li>\n<li><code>table-th</code> — a table interactive grid column &lt;th&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<tfoot class=\"table-foot\"><tr class=\"table-row\"><td class=\"table-td\">Footer</td></tr></tfoot>";
  const svelteSource: string = "// In your Svelte component:\nimport TableFoot from \"lily-design-system-svelte-headless/components/TableFoot/TableFoot.svelte\";\n\n<TableFoot>\n  <!-- TableFoot content -->\n</TableFoot>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Table Foot — Lily Design System</title>
  <meta name="description" content="TableFoot is a headless component that renders a &lt;tfoot&gt; element within a table. It groups footer rows that provide summary or aggregate information." />
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

