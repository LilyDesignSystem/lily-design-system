<script lang="ts">
  const html: string = "<h1>Affix</h1>\n\n<p>An affix is a wrapper that pins its content to a viewport position while the page scrolls, using CSS <code>position: sticky</code> as the headless behavior.</p>\n\n<p>Use it for sidebars, table-of-contents, action bars, or any block that must remain visible while the user scrolls past long-form content.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div class=\"affix\"&gt;</code> with inline <code>position: sticky</code> style</li>\n<li>Uses <code>top: {offsetTop}px</code> when <code>offsetTop</code> is provided</li>\n<li>Uses <code>bottom: {offsetBottom}px</code> when <code>offsetBottom</code> is provided</li>\n<li>Defaults to <code>top: 0</code> if neither offset is provided</li>\n<li>Sets <code>data-offset-top</code> and <code>data-offset-bottom</code> for consumer CSS hooks</li>\n<li>Purely structural — no ARIA semantics required</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>offsetTop</code>: number (px, optional) -- distance from top edge when affixed</li>\n<li><code>offsetBottom</code>: number (px, optional) -- distance from bottom edge when affixed</li>\n<li><code>children</code>: slot -- the content to pin</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Pin a sidebar 16 pixels from the top of the viewport:</p>\n\n<pre><code class=\"language-html\">&lt;Affix offsetTop={16}&gt;\n  &lt;nav&gt;...&lt;/nav&gt;\n&lt;/Affix&gt;</code></pre>\n\n<p>Pin a footer action bar 0 pixels from the bottom:</p>\n\n<pre><code class=\"language-html\">&lt;Affix offsetBottom={0}&gt;\n  &lt;div role=\"toolbar\"&gt;...&lt;/div&gt;\n&lt;/Affix&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None — the affix is a passive layout wrapper.</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None — purely structural; consumer-supplied content carries any roles.</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to keep a navigation sidebar, action bar, or summary in view while the user scrolls.</li>\n<li>Use when CSS <code>position: sticky</code> semantics fit the design.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for content that should overlay the viewport regardless of scroll — use a floating panel or float button.</li>\n<li>Do not use as a substitute for <code>position: fixed</code> overlays — affix relies on sticky scroll context.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>Renders a <code>&lt;div&gt;</code> with inline <code>position: sticky</code> style. The repaint, scroll behavior, and any animation, shadow, or backdrop treatment are entirely the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>Consumer CSS targets the <code>affix</code> class. Provide a <code>z-index</code> if the affix must stack above other content, and a backdrop or shadow on the affixed state if a visual cue is desired.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>affix</code></li>\n<li>Verify <code>style</code> includes <code>position: sticky</code></li>\n<li>Verify <code>style</code> includes <code>top: {offsetTop}px</code> when <code>offsetTop</code> is set</li>\n<li>Verify <code>style</code> includes <code>bottom: {offsetBottom}px</code> when <code>offsetBottom</code> is set</li>\n<li>Verify <code>data-offset-top</code> and <code>data-offset-bottom</code> are emitted when provided</li>\n<li>Verify children render inside the affix container</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Reserve enough viewport space so the affixed content does not obscure interactive elements. Provide a clear visual boundary when the element is sticky.</li>\n<li><strong>Developers</strong>: Remember that <code>position: sticky</code> requires an ancestor scrolling container without <code>overflow: hidden</code>. Provide JS-based fallbacks only when sticky is insufficient.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>sticky-promo-banner</code> — a fixed-position promotional banner with a dismiss button</li>\n<li><code>float-button</code> — a floating action button anchored to a viewport corner</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN position: sticky: https://developer.mozilla.org/docs/Web/CSS/position#sticky</li>\n<li>Ant Design Affix: https://ant.design/components/affix</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"affix\" aria-label=\"a wrapper that pins its content to a viewport position while the page scrolls\">Affix</div>";
  const svelteSource: string = "// In your Svelte component:\nimport Affix from \"lily-design-system-svelte-headless/components/Affix/Affix.svelte\";\n\n<Affix>\n  <!-- content -->\n</Affix>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Affix — Lily Design System</title>
  <meta name="description" content="An affix is a wrapper that pins its content to a viewport position while the page scrolls, using CSS position: sticky as the headless behavior." />
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

