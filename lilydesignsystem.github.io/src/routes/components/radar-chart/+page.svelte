<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>RadarChart</h1>\n<p>A headless wrapper for a chart plotting several axes from a shared centre as a polygon. Use it for comparing one item across several quantitative axes that share a scale, such as a skills profile.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.</p>\n<p>The component renders a <code>&lt;figure&gt;</code> holding a <code>&lt;div class=&quot;radar-chart-graphic&quot; role=&quot;img&quot; aria-label&gt;</code> around an inline <code>&lt;svg&gt;</code> that the consumer draws, names the figure with <code>aria-label</code> (from <code>label</code>), and lets the consumer reference a longer description or a real data <code>&lt;table&gt;</code> through <code>aria-describedby</code>. The component draws nothing and ships no scales, colours or animation; it exists to give every chart in the catalog the same accessible, stylable shell.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;figure class=&quot;radar-chart {class}&gt;</code> containing the children</li>\n<li>The consumer supplies the <code>&lt;svg&gt;</code> (and any legend or caption markup)</li>\n<li><code>restProps</code> — including <code>aria-describedby</code> — spread onto the <code>&lt;figure&gt;</code></li>\n<li>No internal state, no drawing, no data handling</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Accessible name</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot (required)</td>\n<td>—</td>\n<td>The consumer-drawn inline <code>&lt;svg&gt;</code></td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;figure&gt;</code>, e.g. <code>aria-describedby</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;RadarChart label=&quot;Radar Chart of example data&quot; aria-describedby=&quot;radar-chart-data&quot;&gt;\n  &lt;svg viewBox=&quot;0 0 100 100&quot;&gt;…&lt;/svg&gt;\n&lt;/RadarChart&gt;\n&lt;table id=&quot;radar-chart-data&quot;&gt;…&lt;/table&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. The chart is a single image to assistive technology.</li>\n<li>A referenced data table follows native table behaviour.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;img&quot;</code> exposes the chart as one image (its children are presentational)</li>\n<li><code>aria-label</code> provides the accessible name</li>\n<li><code>aria-describedby</code> (consumer-supplied) references the description or data table</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Comparing one item across several quantitative axes that share a scale, such as a skills profile</li>\n<li>When the chart needs the catalog&#39;s standard accessible shell and a stable class hook</li>\n<li>When a real data table accompanies the drawing as the accessible alternative</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>BarChart</code> or <code>ColumnChart</code> — easier to read when exact comparison matters</li>\n<li>Use <code>LineChart</code> — values that change over a continuous axis</li>\n<li>Use <code>DataTable</code> — precise values for many axes</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the figure element, the image role and the name. It decides no geometry, scale, colour, legend or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.radar-chart</code> for the figure and style the supplied <code>&lt;svg&gt;</code> from consumer CSS. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;figure&gt;</code> with class <code>radar-chart</code> and a <code>.radar-chart-graphic</code> child with <code>role=&quot;img&quot;</code></li>\n<li><code>label</code> sets <code>aria-label</code></li>\n<li><code>aria-describedby</code> and other rest props reach the figure</li>\n<li>The consumer svg renders inside the figure</li>\n</ul>\n<h2>Advice</h2>\n<p>Pass the radial <code>&lt;svg&gt;</code> (axes, rings, polygon) as children. Describe the axes and values in text or a data table referenced by <code>aria-describedby</code>.</p>\n<p>Because <code>role=&quot;img&quot;</code> makes descendants presentational, never put interactive controls inside the figure; place legends and toggles next to it.</p>\n<h2>Data table alternative (added 2026-10-05)</h2>\n<p>The graphic is wrapped in <code>&lt;div class=&quot;radar-chart-graphic&quot; role=&quot;img&quot; aria-label&gt;</code>; <code>role=&quot;img&quot;</code> is <strong>not</strong> on the <code>&lt;figure&gt;</code> any more. The optional <code>dataTable</code> (a snippet in Svelte, a prop in React, a named slot in Vue, a projected <code>[dataTable]</code> element in Angular, a <code>DataTable</code> render fragment in Blazor, <code>params.dataTable</code> in Nunjucks, a <code>slot=&quot;data-table&quot;</code> child in Web Components) renders the accessible table in <code>&lt;div class=&quot;radar-chart-data-table&quot;&gt;</code>, a <strong>sibling</strong> of the graphic and never inside it: <code>role=&quot;img&quot;</code> makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above).</p>\n<h2>Related components</h2>\n<ul>\n<li><code>bar-chart</code></li>\n<li><code>column-chart</code></li>\n<li><code>line-chart</code></li>\n<li><code>data-table</code></li>\n<li><code>graphic-block</code> — chart wrapper with title and notes</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure\">MDN figure element</a></li>\n<li><a href=\"https://www.w3.org/WAI/tutorials/images/complex/\">W3C WAI: Complex images</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<figure class=\"radar-chart\"><div class=\"radar-chart-graphic\" role=\"img\" aria-label=\"Skills radar across five axes\"><svg viewBox=\"0 0 120 80\" width=\"240\" height=\"160\" aria-hidden=\"true\" focusable=\"false\"><polygon points=\"60,10 105,40 88,70 32,70 15,40\" fill=\"none\" stroke=\"currentColor\" stroke-opacity=\"0.25\"/><polygon points=\"60,22 92,42 78,62 40,60 28,42\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"currentColor\"/></svg></div><div class=\"radar-chart-data-table\"><table><caption>Skill scores</caption><tbody><tr><th scope=\"row\">Five axes</th><td>Scored from 0 to 10</td></tr></tbody></table></div></figure>";
  const svelteSource: string = "// In your Svelte component:\nimport RadarChart from \"lily-design-system-svelte-headless/components/RadarChart/RadarChart.svelte\";\n\n<RadarChart>\n  <!-- content -->\n</RadarChart>\n";
  const usageCode: string = "<RadarChart label=\"Radar Chart of example data\" aria-describedby=\"radar-chart-data\">\n  <svg viewBox=\"0 0 100 100\">…</svg>\n</RadarChart>\n<table id=\"radar-chart-data\">…</table>\n";
  const variants: { title: string; html: string }[] = [{"title":"Graphic only (no data table)","html":"<figure class=\"radar-chart\"><div class=\"radar-chart-graphic\" role=\"img\" aria-label=\"Skills radar across five axes\"><svg viewBox=\"0 0 120 80\" width=\"240\" height=\"160\" aria-hidden=\"true\" focusable=\"false\"><polygon points=\"60,10 105,40 88,70 32,70 15,40\" fill=\"none\" stroke=\"currentColor\" stroke-opacity=\"0.25\"/><polygon points=\"60,22 92,42 78,62 40,60 28,42\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"currentColor\"/></svg></div></figure>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>RadarChart — Lily Design System</title>
  <meta name="description" content="A headless wrapper for a chart plotting several axes from a shared centre as a polygon. Use it for comparing one item across several quantitative axes that share a scale, such as a skills profile." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/radar-chart/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: radar-chart</li>
      <li>PascalCase: RadarChart</li>
      <li>Description: a chart plotting several axes from a shared centre as a polygon</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;figure&gt;</li>
      <li>CSS class: .radar-chart</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="img"</code> exposes the chart as a single image</li>
      <li><code>aria-label</code> and <code>aria-describedby</code> provide the accessible name and description</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions on the chart</li>
      <li>A data table (when rendered) follows native table keyboard behaviour</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name</li>
      <li><code>children</code>: slot (required) -- the inline <code>&lt;svg&gt;</code></li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;figure&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
