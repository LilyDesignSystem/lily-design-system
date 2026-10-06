<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>CalendarMonthTable</h1>\n<p>A calendar grid for a grid of the days of one month: week rows by seven day columns. It is a structural wrapper on a <code>&lt;table role=&quot;grid&quot;&gt;</code> with <code>data-view=&quot;month&quot;</code>: the consumer supplies the head, body and rows using the existing <code>CalendarTable*</code> sub-elements, and owns every date, locale format and cell.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.</p>\n<p>CalendarMonthTable is one of five calendar views alongside <code>CalendarTable</code> (the general-purpose grid). The component adds only a view-specific base class (<code>calendar-month-table</code>) and the <code>data-view</code> hook, so one stylesheet rule can lay out all five and views can be swapped without changing cell markup. Grid shape for this view: week rows by seven day columns; each cell is one day.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;table class=&quot;calendar-month-table {class}&quot; role=&quot;grid&quot; aria-label={label} data-view=&quot;month&quot;&gt;</code></li>\n<li>Renders a <code>&lt;caption&gt;</code> when <code>caption</code> is provided</li>\n<li>Reuses <code>CalendarTableHead</code>, <code>CalendarTableBody</code>, <code>CalendarTableFoot</code>, <code>CalendarTableRow</code>, <code>CalendarTableTH</code> and <code>CalendarTableTD</code> — there are no <code>CalendarMonthTable*</code> sub-elements</li>\n<li>No internal state; the consumer owns locale formatting (use <code>Intl.DateTimeFormat</code>) and cell content</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;table&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Accessible name describing the period shown, e.g. a month (e.g. &quot;January 2025&quot;)</td>\n</tr>\n<tr>\n<td><code>caption</code></td>\n<td>string</td>\n<td>—</td>\n<td>Visible <code>&lt;caption&gt;</code> text</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot (required)</td>\n<td>—</td>\n<td>Head, body and foot sections</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;table&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;CalendarMonthTable label=&quot;January 2025&quot;&gt;\n  &lt;CalendarTableHead&gt;\n    &lt;CalendarTableRow&gt;&lt;CalendarTableTH scope=&quot;col&quot;&gt;…&lt;/CalendarTableTH&gt;&lt;/CalendarTableRow&gt;\n  &lt;/CalendarTableHead&gt;\n  &lt;CalendarTableBody&gt;\n    &lt;CalendarTableRow&gt;&lt;CalendarTableTD&gt;…&lt;/CalendarTableTD&gt;&lt;/CalendarTableRow&gt;\n  &lt;/CalendarTableBody&gt;\n&lt;/CalendarMonthTable&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>—</td>\n<td>None built-in. The consumer implements APG grid navigation: arrow keys move between cells, Home/End jump within a row, Enter/Space select</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;grid&quot;</code> identifies the table as an interactive grid</li>\n<li><code>aria-label</code> (from <code>label</code>) names the period shown</li>\n<li><code>data-view=&quot;month&quot;</code> is for consumer CSS and JS, not assistive technology</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Showing a grid of the days of one month: week rows by seven day columns</li>\n<li>Scheduling, booking and planner views that switch between periods</li>\n<li>When several calendar views share one stylesheet and need a stable <code>data-view</code> hook</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>CalendarTable</code> when the view is not specifically month-scoped</li>\n<li>Use <code>CalendarRangePicker</code> to choose a date range, or <code>DateInput</code> to enter a single date</li>\n<li>Use <code>DataTable</code> for tabular data that is not a calendar</li>\n<li>Use <code>GanttTable</code> for tasks laid out across a time axis</li>\n</ul>\n<h2>Headless</h2>\n<p>The component decides semantics only: the table element, the grid role, the name and the view hook. It decides nothing about layout, colour, today/selected styling, or which dates appear.</p>\n<h2>Styles</h2>\n<p>Target <code>.calendar-month-table</code> or <code>[data-view=&quot;month&quot;]</code> for view-specific layout. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;table&gt;</code> with <code>role=&quot;grid&quot;</code> and class <code>calendar-month-table</code></li>\n<li><code>label</code> sets <code>aria-label</code>; <code>data-view</code> is <code>month</code></li>\n<li><code>caption</code> renders a <code>&lt;caption&gt;</code> only when provided</li>\n<li>Children and rest props are passed through</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Format every date with <code>Intl.DateTimeFormat</code> in the consumer; pass the already-formatted period as <code>label</code>.</li>\n<li>Give every cell an accessible name that includes its full date, not just the day number.</li>\n<li>Provide an obvious way to reach neighbouring periods (previous / next buttons outside the grid).</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>calendar-table</code> — the general-purpose calendar grid and its sub-elements</li>\n<li><code>CalendarWeekTable</code> for a closer look at one week</li>\n<li><code>calendar-range-picker</code> / <code>date-input</code> — typing a single date</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/grid/\">WAI-ARIA APG: Grid pattern</a></li>\n<li><a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/\">WAI-ARIA APG: Date picker dialog example</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<table class=\"calendar-month-table\" role=\"grid\" aria-label=\"October 2026\" data-view=\"month\"><thead class=\"calendar-table-head\"><tr class=\"calendar-table-row\"><th class=\"calendar-table-th\">Mon</th><th class=\"calendar-table-th\">Tue</th><th class=\"calendar-table-th\">Wed</th><th class=\"calendar-table-th\">Thu</th><th class=\"calendar-table-th\">Fri</th><th class=\"calendar-table-th\">Sat</th><th class=\"calendar-table-th\">Sun</th></tr></thead><tbody class=\"calendar-table-body\"><tr class=\"calendar-table-row\"><td class=\"calendar-table-td\"></td><td class=\"calendar-table-td\"></td><td class=\"calendar-table-td\"></td><td class=\"calendar-table-td\">1</td><td class=\"calendar-table-td\">2</td><td class=\"calendar-table-td\">3</td><td class=\"calendar-table-td\">4</td></tr><tr class=\"calendar-table-row\"><td class=\"calendar-table-td\">5</td><td class=\"calendar-table-td\">6</td><td class=\"calendar-table-td\">7</td><td class=\"calendar-table-td\">8</td><td class=\"calendar-table-td\">9</td><td class=\"calendar-table-td\">10</td><td class=\"calendar-table-td\">11</td></tr></tbody></table>";
  const svelteSource: string = "// In your Svelte component:\nimport CalendarMonthTable from \"lily-design-system-svelte-headless/components/CalendarMonthTable/CalendarMonthTable.svelte\";\n\n<CalendarMonthTable>\n  <!-- content -->\n</CalendarMonthTable>\n";
  const usageCode: string = "<CalendarMonthTable label=\"January 2025\">\n  <CalendarTableHead>\n    <CalendarTableRow><CalendarTableTH scope=\"col\">…</CalendarTableTH></CalendarTableRow>\n  </CalendarTableHead>\n  <CalendarTableBody>\n    <CalendarTableRow><CalendarTableTD>…</CalendarTableTD></CalendarTableRow>\n  </CalendarTableBody>\n</CalendarMonthTable>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>CalendarMonthTable — Lily Design System</title>
  <meta name="description" content="A calendar grid for a grid of the days of one month: week rows by seven day columns. It is a structural wrapper on a &lt;table role=&quot;grid&quot;&gt; with data-view=&quot;month&quot;: the consumer supplies the head, body and rows using the existing CalendarTable sub-elements, and owns every date, locale format and cell." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/calendar-month-table/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: calendar-month-table</li>
      <li>PascalCase: CalendarMonthTable</li>
      <li>Description: a calendar grid showing the days of one month: week rows by seven day columns</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;table&gt;</li>
      <li>CSS class: .calendar-month-table</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="grid"</code> -- identifies the table as an interactive grid widget</li>
      <li><code>aria-label=&#123;label&#125;</code> -- provides an accessible name describing the period</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions built in — the consumer implements grid navigation</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name describing the period shown, applied via <code>aria-label</code></li>
      <li><code>caption</code>: string (optional) -- visible caption</li>
      <li><code>children</code>: slot (required) -- table sections and rows</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;table&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
