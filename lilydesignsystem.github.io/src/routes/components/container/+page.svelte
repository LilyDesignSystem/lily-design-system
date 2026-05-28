<script lang="ts">
  const html: string = "<h1>Container</h1>\n\n<p>A generic block-level content container.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> element with class <code>container</code></li>\n<li>Accepts <code>className</code> for additional CSS classes</li>\n<li>Accepts a <code>children</code> slot for arbitrary content</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;div&gt;</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (optional) — extra CSS classes appended to <code>container</code></li>\n<li><code>children</code>: slot — content rendered inside the container</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Container&gt;\n  &lt;p&gt;Content&lt;/p&gt;\n&lt;/Container&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive container</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>No specific ARIA — this is a generic container with no implied role</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>As a neutral wrapper around a section of related content where you want a single styling hook but no semantic meaning.</li>\n<li>When you need a hook for consumer CSS (margins, padding, background) without committing to a fixed or fluid layout policy.</li>\n<li>As the building block other layout components are composed from.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when a fixed reading width is required — use <code>container-with-fixed-width</code> instead.</li>\n<li>Do not use when full-bleed horizontal padding is required — use <code>container-with-fluid-width</code> instead.</li>\n<li>Do not use as a substitute for a semantic landmark — use <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;footer&gt;</code>, or <code>&lt;section&gt;</code> (or the corresponding Lily components) when the content has a clear role.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.container</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>container-with-fixed-width</code> — a centered content wrapper with a fixed max-width breakpoint</li>\n<li><code>container-with-fluid-width</code> — a full-width content wrapper with horizontal padding</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Documentation: index.md</li>\n<li>CSS class: <code>.container</code> in css-style-sheet-template.css</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"container\"><p>Container holds arbitrary block-level content.</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Container from \"lily-design-system-svelte-headless/components/Container/Container.svelte\";\n\n<Container>\n  <!-- content -->\n</Container>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Container — Lily Design System</title>
  <meta name="description" content="A generic block-level content container." />
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

