<script lang="ts">
  const html: string = "<h1>Container With Fluid Width</h1>\n\n<p>A container with fluid width spans the full width of its parent and applies configurable horizontal padding, providing edge spacing for full-bleed sections without imposing a maximum width.</p>\n\n<p>Use it for hero sections, banners, and any layout area that should stretch across the viewport while keeping content from sitting flush against the screen edge.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with <code>class=\"container-with-fluid-width\"</code></li>\n<li>Applies inline style <code>width: 100%; padding-inline: {paddingInline};</code></li>\n<li>Sets <code>data-padding-inline={paddingInline}</code> for consumer CSS hooks</li>\n<li>Does not center children or constrain width — pair with <code>ContainerWithFixedWidth</code> inside if needed</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>paddingInline</code>: string (default: \"1rem\") -- horizontal padding CSS value</li>\n<li><code>children</code>: slot -- the wrapped content</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Default 1rem padding:</p>\n\n<pre><code class=\"language-html\">&lt;ContainerWithFluidWidth&gt;\n  &lt;Hero&gt;...&lt;/Hero&gt;\n&lt;/ContainerWithFluidWidth&gt;</code></pre>\n\n<p>Larger inline padding:</p>\n\n<pre><code class=\"language-html\">&lt;ContainerWithFluidWidth paddingInline=\"2rem\"&gt;\n  &lt;Banner&gt;...&lt;/Banner&gt;\n&lt;/ContainerWithFluidWidth&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- this is a structural layout container.</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None — purely structural.</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use for full-bleed page sections that span the entire viewport width.</li>\n<li>Use as a wrapper around fixed-width containers to provide edge padding.</li>\n<li>Use when content backgrounds (color, image) need to extend edge-to-edge.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when content must be capped at a max-width (use ContainerWithFixedWidth).</li>\n<li>Do not use as a generic flex/grid layout (use FlexStack or Grid).</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>Provides only the full-width plus inline-padding behavior via inline styles. Backgrounds, borders, vertical spacing, and any other visual treatment are the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>Consumers may target the <code>container-with-fluid-width</code> class for backgrounds, section spacing, or responsive padding overrides.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>container-with-fluid-width</code></li>\n<li>Verify the inline style includes <code>width: 100%</code> and <code>padding-inline: {paddingInline}</code></li>\n<li>Verify the <code>data-padding-inline</code> attribute matches the <code>paddingInline</code> prop</li>\n<li>Verify children content is rendered</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use a padding scale that holds up across breakpoints; consider responsive overrides via consumer CSS for narrower viewports.</li>\n<li><strong>Developers</strong>: Compose <code>ContainerWithFluidWidth</code> (background and edge padding) around <code>ContainerWithFixedWidth</code> (content width cap) for the common full-bleed-with-centered-content pattern.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>container</code> — a generic block-level content container</li>\n<li><code>container-with-fixed-width</code> — a centered content wrapper with a fixed max-width breakpoint</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"container-with-fluid-width\" aria-label=\"a full-width content wrapper with horizontal padding\">ContainerWithFluidWidth</div>";
  const svelteSource: string = "// In your Svelte component:\nimport ContainerWithFluidWidth from \"lily-design-system-svelte-headless/components/ContainerWithFluidWidth/ContainerWithFluidWidth.svelte\";\n\n<ContainerWithFluidWidth>\n  <!-- content -->\n</ContainerWithFluidWidth>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Container With Fluid Width — Lily Design System</title>
  <meta name="description" content="A container with fluid width spans the full width of its parent and applies configurable horizontal padding, providing edge spacing for full-bleed sections without imposing a maximum width." />
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

