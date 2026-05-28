<script lang="ts">
  const html: string = "<h1>Masonry</h1>\n\n<p>A masonry container arranges variable-height children in vertical columns using CSS multi-column layout, producing a Pinterest-style staggered grid without requiring JavaScript-based positioning.</p>\n\n<p>Use it for image galleries, photo packs, card boards, and any collection of items whose heights differ and where you want the layout to fill column gaps naturally.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with <code>class=\"masonry\"</code></li>\n<li>Applies inline style <code>column-count: {columns}; column-gap: {gap};</code></li>\n<li>Sets <code>data-columns={columns}</code> for consumer CSS hooks</li>\n<li>Children should set <code>break-inside: avoid</code> (or <code>page-break-inside: avoid</code>) via consumer CSS to prevent splits across columns</li>\n<li>Source order determines fill order (top-down within each column)</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>columns</code>: number (default: 3) -- number of columns</li>\n<li><code>gap</code>: string (default: \"1rem\") -- gap CSS value</li>\n<li><code>children</code>: slot -- masonry items</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Default three-column masonry:</p>\n\n<pre><code class=\"language-html\">&lt;Masonry&gt;\n  &lt;Card&gt;...&lt;/Card&gt;\n  &lt;Card&gt;...&lt;/Card&gt;\n  &lt;Card&gt;...&lt;/Card&gt;\n&lt;/Masonry&gt;</code></pre>\n\n<p>Two columns with larger gap:</p>\n\n<pre><code class=\"language-html\">&lt;Masonry columns={2} gap=\"2rem\"&gt;\n  &lt;PhotoPack&gt;...&lt;/PhotoPack&gt;\n  &lt;PhotoPack&gt;...&lt;/PhotoPack&gt;\n&lt;/Masonry&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- this is a layout container; focusable children manage their own keyboard behavior.</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None — purely structural.</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use for grids of variable-height items where uniform rows are not required.</li>\n<li>Use for galleries, photo packs, and card boards where natural column packing reads better than a strict grid.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when items must align across rows (use Grid).</li>\n<li>Do not use when item order across rows must be strictly left-to-right (CSS columns flow top-down within each column, which can be surprising).</li>\n<li>Do not use for one-dimensional stacks (use FlexStack).</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>Provides only the column-count layout via inline styles. Item-level break-inside behavior, sizing, and visual treatment are the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>A typical consumer adds <code>break-inside: avoid</code> to direct children:</p>\n\n<pre><code class=\"language-css\">.masonry &gt; * {\n  break-inside: avoid;\n  margin-bottom: 1rem;\n}</code></pre>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>masonry</code></li>\n<li>Verify inline style sets <code>column-count</code> to the <code>columns</code> prop</li>\n<li>Verify inline style sets <code>column-gap</code> to the <code>gap</code> prop</li>\n<li>Verify <code>data-columns</code> attribute matches the <code>columns</code> prop</li>\n<li>Verify children content is rendered</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: CSS-columns masonry flows top-down within each column. If left-to-right reading order matters, use Grid instead.</li>\n<li><strong>Developers</strong>: Always pair Masonry with <code>break-inside: avoid</code> on the items so cards do not split across columns. Consider responsive overrides on <code>column-count</code> for narrow viewports.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>grid</code> — a CSS grid layout container with configurable columns and gap</li>\n<li><code>flex-stack</code> — a flex layout container for vertical or horizontal stacking with consistent gap</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN column-count: https://developer.mozilla.org/en-US/docs/Web/CSS/column-count</li>\n<li>MDN break-inside: https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"masonry\" aria-label=\"a masonry layout container for variable-height items\">Masonry</div>";
  const svelteSource: string = "// In your Svelte component:\nimport Masonry from \"lily-design-system-svelte-headless/components/Masonry/Masonry.svelte\";\n\n<Masonry>\n  <!-- content -->\n</Masonry>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Masonry — Lily Design System</title>
  <meta name="description" content="A masonry container arranges variable-height children in vertical columns using CSS multi-column layout, producing a Pinterest-style staggered grid without requiring JavaScript-based positioning." />
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

