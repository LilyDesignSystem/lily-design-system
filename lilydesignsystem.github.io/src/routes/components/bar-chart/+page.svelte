<script lang="ts">
  const html: string = "<h1>BarChart</h1>\n\n<p>A categorical visualization with bars running horizontally, used to compare a measured value across a set of named categories. Horizontal orientation works particularly well when category labels are long or numerous, since each label sits on its own row and stays legible without rotation.</p>\n\n<p>The component is a headless wrapper around an inline <code>&lt;svg&gt;</code>: it renders a <code>&lt;figure role=\"img\"&gt;</code> containing the bars, names the figure via <code>aria-label</code> (from <code>label</code>), and references an extended <code>description</code> and an optional <code>dataTable</code> slot via <code>aria-describedby</code>. The data table is the canonical accessible alternative — screen readers and exports both benefit from a real <code>&lt;table&gt;</code> rendering of the same numbers, and Lily encourages always providing it.</p>\n\n<p>For the same comparison with vertical bars (better for short labels and time-ordered categories) use <code>ColumnChart</code>. For trends over continuous data use <code>LineChart</code> or <code>AreaChart</code>. For tiny inline summaries use <code>Sparkline</code>.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;figure role=\"img\"&gt;</code> containing an inline <code>&lt;svg&gt;</code> rendering of horizontal bars</li>\n<li>Data is supplied as <code>categories</code> (each with a label and value)</li>\n<li>Bars run horizontally; values are read along the x-axis</li>\n<li>An optional accessible data table is rendered via the <code>dataTable</code> slot</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;figure&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible name</td></tr>\n<tr><td><code>description</code></td><td>string</td><td>—</td><td>Extended description</td></tr>\n<tr><td><code>categories</code></td><td>array of <code>{ label: string; value: number }</code></td><td>[]</td><td>Categories to plot</td></tr>\n<tr><td><code>dataTable</code></td><td>slot</td><td>—</td><td>Optional fallback <code>&lt;table&gt;</code></td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;figure&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;BarChart label=\"Top services by usage\" categories={topServices} description=\"Usage counts for the top 10 services\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions on the rendered bars</li>\n<li>Data table (when rendered) follows native table keyboard behaviour</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"img\"</code> exposes the chart as a single image</li>\n<li><code>aria-label</code> and <code>aria-describedby</code> provide the accessible name and description</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Comparing many categorical values where category labels are long (horizontal bars give labels more room)</li>\n<li>Ranking lists</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>ColumnChart</code> (vertical bars) when category labels are short and you have many time-series-like categories</li>\n<li>Use <code>LineChart</code> for continuous data</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.bar-chart</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>column-chart</code> — vertical column equivalent</li>\n<li><code>line-chart</code> / <code>area-chart</code> — continuous-data alternatives</li>\n<li><code>graphic-block</code> — chart wrapper with title/notes</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure\">MDN figure element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"bar-chart\" aria-label=\"a horizontal bar chart visualization for displaying data\">BarChart</div>";
  const svelteSource: string = "// In your Svelte component:\nimport BarChart from \"lily-design-system-svelte-headless/components/BarChart/BarChart.svelte\";\n\n<BarChart>\n  <!-- content -->\n</BarChart>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>BarChart — Lily Design System</title>
  <meta name="description" content="A categorical visualization with bars running horizontally, used to compare a measured value across a set of named categories. Horizontal orientation works particularly well when category labels ar..." />
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

