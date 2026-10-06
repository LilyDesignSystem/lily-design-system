<script lang="ts">
  const html: string = "<h1>Kanban Table Head</h1>\n\n<p>A Kanban table head provides a header row for a Kanban board, containing column headings that label each workflow stage (e.g., \"To Do\", \"In Progress\", \"Done\"). It renders as a <code>&lt;div&gt;</code> with appropriate ARIA attributes and is designed to be used as a child of a KanbanTable component. The header establishes the visual and semantic structure for the columns below it.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders as a <code>&lt;div&gt;</code> for the Kanban board header area</li>\n<li>Contains column heading elements that label each workflow stage</li>\n<li>Consumer provides heading content through the children slot, typically a row of heading elements</li>\n<li>Spreads <code>...restProps</code> onto the <code>&lt;div&gt;</code> element for consumer customization</li>\n<li>No internal state -- purely a structural wrapper</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>children</code>: slot (required) -- column heading content for each workflow stage</li>\n<li><code>...restProps</code>: any -- additional HTML attributes spread onto the <code>&lt;div&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Kanban board header with three workflow stages:</p>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;KanbanTable label=\"Sprint board\"&gt;\n    &lt;KanbanTableHead&gt;\n        &lt;KanbanTableRow&gt;\n            &lt;KanbanTableTD&gt;To Do&lt;/KanbanTableTD&gt;\n            &lt;KanbanTableTD&gt;In Progress&lt;/KanbanTableTD&gt;\n            &lt;KanbanTableTD&gt;Done&lt;/KanbanTableTD&gt;\n        &lt;/KanbanTableRow&gt;\n    &lt;/KanbanTableHead&gt;\n    &lt;KanbanTableBody&gt;\n        ...\n    &lt;/KanbanTableBody&gt;\n&lt;/KanbanTable&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- passive container for heading elements. Keyboard interaction depends on interactive elements within the header content provided by the consumer.</p>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>No explicit ARIA roles required -- the headings within provide their own semantic structure</li>\n<li>Column headings should use appropriate heading levels (e.g., <code>&lt;h3&gt;</code>) for proper document outline</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside KanbanTable to provide column headings that label each workflow stage.</li>\n<li>Use when users need clear, visible labels for board columns such as \"To Do\", \"In Progress\", \"Done\".</li>\n<li>Use to establish the visual and semantic structure for the columns below it.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside of a KanbanTable parent -- use TableHead or DataTableHead for general tables.</li>\n<li>Do not use for footer summaries -- use KanbanTableFoot instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a structural header wrapper for Kanban board column headings. It outputs a <code>&lt;div&gt;</code> container where the consumer places heading elements. The consumer provides all visual styling, including heading typography, alignment, and column width coordination.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.kanban-table-head</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;thead&gt;</code> element with class <code>kanban-table-head</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Align column headings with their corresponding body columns and use consistent typography so the board structure is immediately clear.</li>\n<li><strong>Developers</strong>: Use appropriate heading levels (e.g., <code>&lt;h3&gt;</code>) inside the header to maintain proper document outline and screen reader navigation.</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>KanbanTableHead is a child of KanbanTable, appearing before KanbanTableBody. It is part of the KanbanTable compound component pattern.</p>\n\n<pre tabindex=\"0\"><code>KanbanTable → KanbanTableHead + KanbanTableBody + KanbanTableFoot\n                └→ column headings</code></pre>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>kanban-table</code> — a kanban board table interactive grid for organizing items by status &lt;table&gt;</li>\n<li><code>kanban-table-body</code> — a kanban board table interactive grid tbody for organizing items by status &lt;tbody&gt;</li>\n<li><code>kanban-table-foot</code> — a kanban board table interactive grid tfoot for organizing items by status &lt;tfoot&gt;</li>\n<li><code>kanban-table-row</code> — a kanban board table interactive grid row for organizing items by status &lt;tr&gt;</li>\n<li><code>kanban-table-td</code> — kanban board table interactive grid data cell for organizing items by status &lt;td&gt;</li>\n<li><code>kanban-table-th</code> — a kanban board table interactive grid header cell for organizing items by status &lt;th&gt;</li>\n<li><code>table</code> — a table with rows and columns &lt;table&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<thead class=\"kanban-table-head\"><tr class=\"kanban-table-row\"><th class=\"kanban-table-th\">Status</th></tr></thead>";
  const svelteSource: string = "// In your Svelte component:\nimport KanbanTableHead from \"lily-design-system-svelte-headless/components/KanbanTableHead/KanbanTableHead.svelte\";\n\n<KanbanTableHead>\n  <!-- KanbanTableHead content -->\n</KanbanTableHead>\n";
  const usageCode: string = "<script lang=\"ts\">\n    import KanbanTable from \"../KanbanTable/KanbanTable.svelte\";\n    import KanbanTableHead from \"./KanbanTableHead.svelte\";\n    import KanbanTableBody from \"../KanbanTableBody/KanbanTableBody.svelte\";\n    import KanbanTableRow from \"../KanbanTableRow/KanbanTableRow.svelte\";\n    import KanbanTableTD from \"../KanbanTableTD/KanbanTableTD.svelte\";\n<\/script>\n\n<KanbanTable label=\"Board\">\n    <KanbanTableHead>\n        <KanbanTableRow>\n            <th scope=\"col\">To Do</th>\n            <th scope=\"col\">In Progress</th>\n            <th scope=\"col\">Done</th>\n        </KanbanTableRow>\n    </KanbanTableHead>\n    <KanbanTableBody>\n        <KanbanTableRow>\n            <KanbanTableTD>Task A</KanbanTableTD>\n            <KanbanTableTD>Task B</KanbanTableTD>\n            <KanbanTableTD>Task C</KanbanTableTD>\n        </KanbanTableRow>\n    </KanbanTableBody>\n</KanbanTable>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Kanban Table Head — Lily Design System</title>
  <meta name="description" content="A Kanban table head provides a header row for a Kanban board, containing column headings that label each workflow stage (e.g., &quot;To Do&quot;, &quot;In Progress&quot;, &quot;Done&quot;). It renders as a &lt;div&gt; with appropriat..." />
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
    <summary style="cursor: pointer; font-weight: 600;">Show demo markup</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{demoHtml}</code></pre>
  </details>
  {#each variants as variant (variant.title)}
    <h3 style="margin-top: 1.5rem;">{variant.title}</h3>
    <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html variant.html}</div>
    <details style="margin-top: 0.5rem;">
      <summary style="cursor: pointer; font-weight: 600;">Show markup</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{variant.html}</code></pre>
    </details>
  {/each}
  {#if usageCode}
    <details style="margin-top: 1.5rem;" open>
      <summary style="cursor: pointer; font-weight: 600;">Usage example</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{usageCode}</code></pre>
    </details>
  {/if}
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/kanban-table-head/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: kanban-table-head</li>
      <li>PascalCase: KanbanTableHead</li>
      <li>Description: a kanban board table interactive grid thead for organizing items by status &lt;thead&gt;</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;thead&gt;</li>
      <li>CSS class: .kanban-table-head</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No explicit ARIA roles required -- the headings within provide their own semantic structure</li>
      <li>Column headings should use appropriate heading levels (e.g., <code>&lt;h3&gt;</code>) for proper document outline</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions — this is a passive element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>children</code>: slot (required) -- column heading content for each workflow stage</li>
      <li><code>...restProps</code>: any -- additional HTML attributes spread onto the <code>&lt;div&gt;</code> element</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
