<script lang="ts">
  const html: string = "<h1>LineChart</h1>\n\n<p>A continuous-data visualization that connects ordered points with line segments, emphasising the shape of the trend rather than its magnitude. The standard choice for showing change over time — temperatures, prices, response times — and for comparing the trend of multiple series side by side.</p>\n\n<p>The component is a headless wrapper around an inline <code>&lt;svg&gt;</code>: it renders a <code>&lt;figure role=\"img\"&gt;</code> containing the chart, names the figure via <code>aria-label</code> (from <code>label</code>), and references an extended <code>description</code> and an optional <code>dataTable</code> slot via <code>aria-describedby</code>. The data table is the canonical accessible alternative — screen readers and exports both benefit from a real <code>&lt;table&gt;</code> rendering of the same numbers, and Lily encourages always providing it.</p>\n\n<p>When the cumulative magnitude beneath the line matters more than the shape, use <code>AreaChart</code>. For categorical comparison use <code>BarChart</code> or <code>ColumnChart</code>. For tiny inline trends use <code>Sparkline</code>.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;figure role=\"img\"&gt;</code> containing an inline <code>&lt;svg&gt;</code> rendering of one or more line series</li>\n<li>Data is supplied as <code>series</code> (each a sequence of <code>{ x, y }</code> points)</li>\n<li>Lines are interpolated between points; markers are optional</li>\n<li>An optional accessible data table is rendered via the <code>dataTable</code> slot</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;figure&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible name</td></tr>\n<tr><td><code>description</code></td><td>string</td><td>—</td><td>Extended description</td></tr>\n<tr><td><code>series</code></td><td>array of series</td><td>[]</td><td>Each series is <code>{ name: string; points: { x: number; y: number }[] }</code></td></tr>\n<tr><td><code>dataTable</code></td><td>slot</td><td>—</td><td>Optional fallback <code>&lt;table&gt;</code></td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;figure&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;LineChart label=\"CPU usage over time\" series={cpuSeries} description=\"CPU% over the last hour\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions on the rendered lines</li>\n<li>Data table (when rendered) follows native table keyboard behaviour</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"img\"</code> exposes the chart as a single image</li>\n<li><code>aria-label</code> and <code>aria-describedby</code> provide the accessible name and description</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Showing trends over time, especially when only the line shape (not magnitude under it) matters</li>\n<li>Comparing multiple series of continuous data</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>AreaChart</code> to emphasise magnitude (area under the line)</li>\n<li>Use <code>BarChart</code> or <code>ColumnChart</code> for discrete categorical comparisons</li>\n<li>Use <code>Sparkline</code> for tiny inline trends</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.line-chart</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>area-chart</code> — area under the line</li>\n<li><code>scatter-chart</code> — relationship between two variables</li>\n<li><code>bar-chart</code> / <code>column-chart</code> — categorical alternatives</li>\n<li><code>sparkline</code> — inline tiny trend</li>\n<li><code>graphic-block</code> — chart wrapper with title/notes</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure\">MDN figure element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"line-chart\" aria-label=\"a line chart visualization connecting data points to display data\">LineChart</div>";
  const svelteSource: string = "// In your Svelte component:\nimport LineChart from \"lily-design-system-svelte-headless/components/LineChart/LineChart.svelte\";\n\n<LineChart>\n  <!-- content -->\n</LineChart>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>LineChart — Lily Design System</title>
  <meta name="description" content="A continuous-data visualization that connects ordered points with line segments, emphasising the shape of the trend rather than its magnitude. The standard choice for showing change over time — tem..." />
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

