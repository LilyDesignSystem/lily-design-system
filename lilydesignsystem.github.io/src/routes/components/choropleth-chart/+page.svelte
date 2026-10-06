<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ChoroplethChart</h1>\n<p>A headless wrapper for a map chart that shades regions by the value of a measure. It gives the drawing the catalog&#39;s standard accessible shell: a named image plus an optional data-table alternative.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The component renders a <code>&lt;figure&gt;</code> holding a <code>&lt;div class=&quot;choropleth-chart-graphic&quot; role=&quot;img&quot; aria-label&gt;</code> around an inline <code>&lt;svg&gt;</code> that the consumer draws, and an optional sibling <code>&lt;div class=&quot;choropleth-chart-data-table&quot;&gt;</code> for the accessible table. The component draws nothing and ships no scales, colours or animation.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;figure class=&quot;choropleth-chart {class}&quot;&gt;</code> containing the image wrapper and, when supplied, the data-table wrapper</li>\n<li>The consumer supplies the <code>&lt;svg&gt;</code> (and any legend markup that belongs inside the image)</li>\n<li><code>restProps</code> spread onto the <code>&lt;figure&gt;</code></li>\n<li>No internal state, no drawing, no data handling</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (optional)</td>\n<td>—</td>\n<td>Accessible name of the image wrapper</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot (required)</td>\n<td>—</td>\n<td>The consumer-drawn inline <code>&lt;svg&gt;</code></td>\n</tr>\n<tr>\n<td><code>dataTable</code></td>\n<td>slot (optional)</td>\n<td>—</td>\n<td>The accessible table alternative, rendered outside <code>role=&quot;img&quot;</code></td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;figure&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ChoroplethChart label=&quot;Describe the chart&quot;&gt;\n  &lt;svg viewBox=&quot;0 0 100 100&quot;&gt;…&lt;/svg&gt;\n  {#snippet dataTable()}\n    &lt;table&gt;&lt;caption&gt;Values&lt;/caption&gt;…&lt;/table&gt;\n  {/snippet}\n&lt;/ChoroplethChart&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None on the graphic. The chart is a single image to assistive technology.</li>\n<li>The data table follows native table behaviour.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;img&quot;</code> on the graphic wrapper exposes the chart as one image (its children are presentational)</li>\n<li><code>aria-label</code> provides the accessible name</li>\n<li>The data table is outside <code>role=&quot;img&quot;</code> so assistive technology can read it</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>A measure compared across regions such as countries, counties or postcodes</li>\n<li>Showing geographic patterns at a glance</li>\n<li>When a real data table accompanies the drawing as the accessible alternative</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>TileMap</code> — a map with pins or a map of places rather than shaded regions</li>\n<li>Use <code>BarChart</code> — when exact comparison between regions matters more than geography</li>\n<li>Use a table — when the user needs to look up a specific region</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the figure element, the image role, the name and the table placement. It decides no geometry, scale, colour, legend or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.choropleth-chart</code> for the figure, <code>.choropleth-chart-graphic</code> for the image wrapper and <code>.choropleth-chart-data-table</code> for the table wrapper. Style the supplied <code>&lt;svg&gt;</code> from consumer CSS. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;figure&gt;</code> with class <code>choropleth-chart</code> and a <code>.choropleth-chart-graphic</code> child with <code>role=&quot;img&quot;</code></li>\n<li><code>label</code> sets <code>aria-label</code></li>\n<li>The consumer svg renders inside the image wrapper</li>\n<li>The data table renders in a <code>.choropleth-chart-data-table</code> sibling, outside <code>role=&quot;img&quot;</code>, only when supplied</li>\n<li>Rest props reach the figure</li>\n</ul>\n<h2>Advice</h2>\n<p>Pass the shaded regions as <code>&lt;svg&gt;</code> paths. Region size misleads (large, sparse regions dominate), so give every region and its value in the data table and never rely on colour alone.</p>\n<p>Because <code>role=&quot;img&quot;</code> makes descendants presentational, never put interactive controls inside the graphic; place legends and toggles next to it.</p>\n<h2>Data table alternative (added 2026-10-05)</h2>\n<p>The graphic is wrapped in <code>&lt;div class=&quot;choropleth-chart-graphic&quot; role=&quot;img&quot; aria-label&gt;</code>; <code>role=&quot;img&quot;</code> is <strong>not</strong> on the <code>&lt;figure&gt;</code>. The optional <code>dataTable</code> (a snippet in Svelte, a prop in React, a named slot in Vue, a projected <code>[dataTable]</code> element in Angular, a <code>DataTable</code> render fragment in Blazor, <code>params.dataTable</code> in Nunjucks, a <code>slot=&quot;data-table&quot;</code> child in Web Components) renders the accessible table in <code>&lt;div class=&quot;choropleth-chart-data-table&quot;&gt;</code>, a <strong>sibling</strong> of the graphic and never inside it: <code>role=&quot;img&quot;</code> makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, which always renders an empty wrapper because it cannot detect projected content).</p>\n<h2>Related components</h2>\n<ul>\n<li><code>tile-map</code></li>\n<li><code>bar-chart</code></li>\n<li><code>heatmap-chart</code></li>\n<li><code>graphic-block</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure\">MDN figure element</a></li>\n<li><a href=\"https://www.w3.org/WAI/tutorials/images/complex/\">W3C WAI: Complex images</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<figure class=\"choropleth-chart\"><div class=\"choropleth-chart-graphic\" role=\"img\" aria-label=\"Choropleth chart: four regions shaded by value\"><svg viewBox=\"0 0 120 80\" width=\"240\" height=\"160\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"10\" y=\"10\" width=\"45\" height=\"30\" fill=\"currentColor\" fill-opacity=\"0.9\"/><rect x=\"58\" y=\"10\" width=\"45\" height=\"30\" fill=\"currentColor\" fill-opacity=\"0.4\"/><rect x=\"10\" y=\"43\" width=\"45\" height=\"28\" fill=\"currentColor\" fill-opacity=\"0.6\"/><rect x=\"58\" y=\"43\" width=\"45\" height=\"28\" fill=\"currentColor\" fill-opacity=\"0.2\"/></svg></div><div class=\"choropleth-chart-data-table\"><table><caption>Value by region</caption><tbody><tr><th scope=\"row\">North</th><td>High</td></tr><tr><th scope=\"row\">East</th><td>Low-medium</td></tr><tr><th scope=\"row\">West</th><td>Medium-high</td></tr><tr><th scope=\"row\">South</th><td>Low</td></tr></tbody></table></div></figure>";
  const svelteSource: string = "// In your Svelte component:\nimport ChoroplethChart from \"lily-design-system-svelte-headless/components/ChoroplethChart/ChoroplethChart.svelte\";\n\n<ChoroplethChart>\n  <!-- content -->\n</ChoroplethChart>\n";
  const usageCode: string = "<ChoroplethChart label=\"Describe the chart\">\n  <svg viewBox=\"0 0 100 100\">…</svg>\n  {#snippet dataTable()}\n    <table><caption>Values</caption>…</table>\n  {/snippet}\n</ChoroplethChart>\n";
  const variants: { title: string; html: string }[] = [{"title":"Graphic only (no data table)","html":"<figure class=\"choropleth-chart\"><div class=\"choropleth-chart-graphic\" role=\"img\" aria-label=\"Choropleth chart: four regions shaded by value\"><svg viewBox=\"0 0 120 80\" width=\"240\" height=\"160\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"10\" y=\"10\" width=\"45\" height=\"30\" fill=\"currentColor\" fill-opacity=\"0.9\"/><rect x=\"58\" y=\"10\" width=\"45\" height=\"30\" fill=\"currentColor\" fill-opacity=\"0.4\"/><rect x=\"10\" y=\"43\" width=\"45\" height=\"28\" fill=\"currentColor\" fill-opacity=\"0.6\"/><rect x=\"58\" y=\"43\" width=\"45\" height=\"28\" fill=\"currentColor\" fill-opacity=\"0.2\"/></svg></div></figure>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ChoroplethChart — Lily Design System</title>
  <meta name="description" content="A headless wrapper for a map chart that shades regions by the value of a measure. It gives the drawing the catalog's standard accessible shell: a named image plus an optional data-table alternative." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/choropleth-chart/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: choropleth-chart</li>
      <li>PascalCase: ChoroplethChart</li>
      <li>Description: a map chart that shades regions by the value of a measure</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;figure&gt;</li>
      <li>CSS class: .choropleth-chart</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="img"</code> on the graphic wrapper exposes the chart as a single image</li>
      <li><code>aria-label</code> provides the accessible name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions on the chart</li>
      <li>A data table (when rendered) follows native table keyboard behaviour</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>label</code>: string (optional) -- accessible name</li>
      <li><code>children</code>: slot (required) -- the inline <code>&lt;svg&gt;</code></li>
      <li><code>dataTable</code>: slot (optional) -- the accessible table alternative</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;figure&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
