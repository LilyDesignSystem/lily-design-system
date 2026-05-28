<script lang="ts">
  const html: string = "<h1>Kanban Table Row</h1>\n\n<p>KanbanTableRow is a headless component that renders a <code>&lt;tr&gt;</code> element within a kanban board table. It represents a single row containing kanban items across status columns.</p>\n\n<p>Use this component within KanbanTableHead, KanbanTableBody, or KanbanTableFoot to define rows of kanban board items.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;tr&gt;</code> element for table row semantics</li>\n<li>Accepts <code>className</code> for CSS class targeting</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;tr&gt;</code> element for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (default: <code>\"\"</code>) -- CSS class name for the row</li>\n<li><code>children</code>: slot (required) -- row cells, typically KanbanTableTD components</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;tr&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Row of kanban items across status columns:</p>\n\n<pre><code class=\"language-html\">&lt;KanbanTableBody&gt;\n    &lt;KanbanTableRow&gt;\n        &lt;KanbanTableTD label=\"Fix login bug\"&gt;Fix login bug&lt;/KanbanTableTD&gt;\n        &lt;KanbanTableTD label=\"Add dashboard\"&gt;Add dashboard&lt;/KanbanTableTD&gt;\n        &lt;KanbanTableTD label=\"Setup CI/CD\"&gt;Setup CI/CD&lt;/KanbanTableTD&gt;\n    &lt;/KanbanTableRow&gt;\n&lt;/KanbanTableBody&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>Standard table row keyboard interactions.</p>\n\n<h2>ARIA</h2>\n\n<p>No additional ARIA attributes. Row semantics are provided by the <code>&lt;tr&gt;</code> element.</p>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside KanbanTableHead, KanbanTableBody, or KanbanTableFoot to define a row of kanban items.</li>\n<li>Use to group KanbanTableTD cells that represent items across status columns.</li>\n<li>Use for each horizontal row of content in the kanban board.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside of a KanbanTable context -- use TableRow or DataTableRow for general tables.</li>\n<li>Do not use for column headings directly -- place heading content inside KanbanTableTD within the row.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders a <code>&lt;tr&gt;</code> element. The consumer provides all visual styling.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.kanban-table-row</code> class for targeting.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;tr&gt;</code> element</li>\n<li>Verify children content is rendered</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use visual separators between rows for clarity. Consider hover states for interactive rows.</li>\n<li><strong>Developers</strong>: Place KanbanTableRow within KanbanTableHead, KanbanTableBody, or KanbanTableFoot.</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>KanbanTableRow is a child of KanbanTableHead/KanbanTableBody/KanbanTableFoot, following the Table pattern: KanbanTable &gt; KanbanTableHead/KanbanTableBody/KanbanTableFoot &gt; KanbanTableRow &gt; KanbanTableTD.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>kanban-table</code> — a kanban board table interactive grid for organizing items by status &lt;table&gt;</li>\n<li><code>kanban-table-body</code> — a kanban board table interactive grid tbody for organizing items by status &lt;tbody&gt;</li>\n<li><code>kanban-table-foot</code> — a kanban board table interactive grid tfoot for organizing items by status &lt;tfoot&gt;</li>\n<li><code>kanban-table-head</code> — a kanban board table interactive grid thead for organizing items by status &lt;thead&gt;</li>\n<li><code>kanban-table-td</code> — kanban board table interactive grid data cell for organizing items by status &lt;td&gt;</li>\n<li><code>kanban-table-th</code> — a kanban board table interactive grid header cell for organizing items by status &lt;th&gt;</li>\n<li><code>table</code> — a table with rows and columns &lt;table&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<tr class=\"kanban-table-row\"><td class=\"kanban-table-td\">Task 1</td></tr>";
  const svelteSource: string = "// In your Svelte component:\nimport KanbanTableRow from \"lily-design-system-svelte-headless/components/KanbanTableRow/KanbanTableRow.svelte\";\n\n<KanbanTableRow>\n  <!-- KanbanTableRow content -->\n</KanbanTableRow>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Kanban Table Row — Lily Design System</title>
  <meta name="description" content="KanbanTableRow is a headless component that renders a &lt;tr&gt; element within a kanban board table. It represents a single row containing kanban items across status columns." />
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

