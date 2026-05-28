<script lang="ts">
  const html: string = "<h1>Table TH</h1>\n\n<p>TableTH is a headless component that renders a <code>&lt;th scope=\"col\"&gt;</code> element — a column header cell — intended to live inside a TableRow within TableHead.</p>\n\n<p>Use this component to label the columns of a table.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;th&gt;</code> element with <code>scope=\"col\"</code> by default</li>\n<li>Accepts <code>className</code> for CSS class targeting</li>\n<li>Accepts optional <code>colspan</code> / <code>rowspan</code> for grouped header cells</li>\n<li>Accepts an alternative <code>scope</code> (e.g. <code>\"colgroup\"</code> for grouped headers)</li>\n<li>Renders header text via children</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;th&gt;</code> element</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (default: <code>\"\"</code>) -- CSS class appended to the base <code>table-th</code> class</li>\n<li><code>colspan</code>: number (optional) -- number of columns this header cell spans</li>\n<li><code>rowspan</code>: number (optional) -- number of rows this header cell spans</li>\n<li><code>scope</code>: <code>\"col\" | \"row\" | \"colgroup\" | \"rowgroup\"</code> (default: <code>\"col\"</code>) -- header scope</li>\n<li><code>children</code>: optional -- header cell content</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;th&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Table label=\"Users\"&gt;\n  &lt;TableHead&gt;\n    &lt;TableRow&gt;\n      &lt;TableTH&gt;Name&lt;/TableTH&gt;\n      &lt;TableTH&gt;Email&lt;/TableTH&gt;\n    &lt;/TableRow&gt;\n  &lt;/TableHead&gt;\n  &lt;TableBody&gt;\n    &lt;TableRow&gt;\n      &lt;TableTD&gt;Alice&lt;/TableTD&gt;\n      &lt;TableTD&gt;alice@example.com&lt;/TableTD&gt;\n    &lt;/TableRow&gt;\n  &lt;/TableBody&gt;\n&lt;/Table&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None. Header cells are not interactive.</p>\n\n<h2>ARIA</h2>\n\n<p><code>scope=\"col\"</code> associates the header with its column for assistive technologies. Use <code>scope=\"colgroup\"</code> together with <code>colspan</code> for grouped column headers.</p>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>For column header cells in the header row of a table</li>\n<li>For grouped header cells via <code>colspan</code> / <code>rowspan</code></li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for data cells -- use TableTD for <code>&lt;td&gt;</code> elements</li>\n<li>Do not use for column-wide styling hooks via <code>&lt;colgroup&gt;</code> / <code>&lt;col&gt;</code> -- write those directly inside Table</li>\n<li>Do not use outside of a Table -- use DataTableTD for DataTable, CalendarTableTD for CalendarTable, etc.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders a <code>&lt;th&gt;</code> element. The consumer provides all visual styling.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.table-th</code> class for targeting.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;th&gt;</code> element</li>\n<li>Verify <code>scope=\"col\"</code> is the default</li>\n<li>Verify <code>colspan</code> / <code>rowspan</code> are applied when set</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>TableTH is a child of TableRow within TableHead, following the Table pattern: Table &gt; TableHead/TableBody/TableFoot &gt; TableRow &gt; TableTH/TableTD.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>table</code> — a table with rows and columns &lt;table&gt;</li>\n<li><code>table-body</code> — a table interactive grid tbody &lt;tbody&gt;</li>\n<li><code>table-foot</code> — a table interactive grid tfoot &lt;tfoot&gt;</li>\n<li><code>table-head</code> — a table interactive grid thead &lt;thead&gt;</li>\n<li><code>table-row</code> — a table interactive grid row &lt;tr&gt;</li>\n<li><code>table-td</code> — a table interactive grid data cell &lt;td&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<th class=\"table-th\">Column heading</th>";
  const svelteSource: string = "// In your Svelte component:\nimport TableTH from \"lily-design-system-svelte-headless/components/TableTH/TableTH.svelte\";\n\n<TableTH>\n  <!-- TableTH content -->\n</TableTH>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Table TH — Lily Design System</title>
  <meta name="description" content="TableTH is a headless component that renders a &lt;th scope=&quot;col&quot;&gt; element — a column header cell — intended to live inside a TableRow within TableHead." />
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

