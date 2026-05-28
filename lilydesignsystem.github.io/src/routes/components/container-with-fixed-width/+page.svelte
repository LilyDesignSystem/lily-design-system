<script lang="ts">
  const html: string = "<h1>Container With Fixed Width</h1>\n\n<p>A container with a fixed maximum width centers its children horizontally and caps the content area at a configurable breakpoint, giving long-form text and page layouts a comfortable reading width on wide displays.</p>\n\n<p>Use it for the outermost layout wrapper around article body text, marketing sections, or any content area that should stop expanding past a chosen maximum width.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with <code>class=\"container-with-fixed-width\"</code></li>\n<li>Applies inline style <code>max-width: {maxWidth}; margin-inline: auto;</code> so the container centers itself within its parent</li>\n<li>Sets <code>data-max-width={maxWidth}</code> for consumer CSS hooks</li>\n<li>Does not impose padding, background, or any other visual treatment</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>maxWidth</code>: string (default: \"1200px\") -- max-width CSS value</li>\n<li><code>children</code>: slot -- the wrapped content</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Default 1200px wrapper:</p>\n\n<pre><code class=\"language-html\">&lt;ContainerWithFixedWidth&gt;\n  &lt;Article&gt;...&lt;/Article&gt;\n&lt;/ContainerWithFixedWidth&gt;</code></pre>\n\n<p>Custom narrower wrapper for prose:</p>\n\n<pre><code class=\"language-html\">&lt;ContainerWithFixedWidth maxWidth=\"720px\"&gt;\n  &lt;BodyText&gt;...&lt;/BodyText&gt;\n&lt;/ContainerWithFixedWidth&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- this is a structural layout container.</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None — purely structural. Use a landmark element (Header, Main, Footer) inside if a landmark is required.</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use as the outermost layout wrapper to constrain reading width.</li>\n<li>Use to center page content on wide viewports.</li>\n<li>Use when the content area should never exceed a chosen breakpoint.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for full-bleed sections (use ContainerWithFluidWidth instead).</li>\n<li>Do not use as the only horizontal padding mechanism — combine with a fluid-width container or padding utility for edge spacing on small screens.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>The component supplies only the centering and max-width behavior via inline styles and a class hook. All padding, background, border, and shadow styling is the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>Consumer CSS may target the <code>container-with-fixed-width</code> class or the <code>data-max-width</code> attribute to add padding or other treatment:</p>\n\n<pre><code class=\"language-css\">.container-with-fixed-width {\n  padding-inline: 1rem;\n}</code></pre>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>container-with-fixed-width</code></li>\n<li>Verify the inline style includes <code>max-width: {maxWidth}</code> and <code>margin-inline: auto</code></li>\n<li>Verify the <code>data-max-width</code> attribute matches the <code>maxWidth</code> prop</li>\n<li>Verify children content is rendered</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Choose <code>maxWidth</code> based on optimal line length for the content type. 65–75 characters per line is a common reading-width target.</li>\n<li><strong>Developers</strong>: Combine with horizontal padding (either via consumer CSS on this element or a parent fluid container) so content does not sit flush against the viewport edge on narrow screens.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>container</code> — a generic block-level content container</li>\n<li><code>container-with-fluid-width</code> — a full-width content wrapper with horizontal padding</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width</li>\n<li>MDN margin-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"container-with-fixed-width\" aria-label=\"a centered content wrapper with a fixed max-width breakpoint\">ContainerWithFixedWidth</div>";
  const svelteSource: string = "// In your Svelte component:\nimport ContainerWithFixedWidth from \"lily-design-system-svelte-headless/components/ContainerWithFixedWidth/ContainerWithFixedWidth.svelte\";\n\n<ContainerWithFixedWidth>\n  <!-- content -->\n</ContainerWithFixedWidth>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Container With Fixed Width — Lily Design System</title>
  <meta name="description" content="A container with a fixed maximum width centers its children horizontally and caps the content area at a configurable breakpoint, giving long-form text and page layouts a comfortable reading width o..." />
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

