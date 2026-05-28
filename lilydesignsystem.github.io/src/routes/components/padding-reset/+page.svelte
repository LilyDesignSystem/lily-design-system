<script lang="ts">
  const html: string = "<h1>Padding Reset</h1>\n\n<p>A container that resets padding inside fluid-width containers. PaddingReset uses negative margins to counteract parent padding, allowing content to extend edge-to-edge.</p>\n\n<p>This headless component uses a <code>&lt;div&gt;</code> element as a presentational container with no ARIA semantics.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Resets horizontal padding when content needs to break out of a padded container</li>\n<li>Useful inside fluid-width ContentBlock elements</li>\n<li>Uses negative margins to counteract parent padding</li>\n<li>Inspired by Reuters Graphics PaddingReset component</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>children</code>: slot (required) -- content</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;ContentBlock width=\"fluid\"&gt;\n  &lt;PaddingReset&gt;\n    &lt;img src=\"full-bleed.jpg\" alt=\"Full bleed image\" /&gt;\n  &lt;/PaddingReset&gt;\n&lt;/ContentBlock&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;ArticleLayout&gt;\n  &lt;ContentBlock width=\"fluid\"&gt;\n    &lt;PaddingReset&gt;\n      &lt;video src=\"hero-video.mp4\" autoplay muted loop&gt;\n        Your browser does not support the video tag.\n      &lt;/video&gt;\n    &lt;/PaddingReset&gt;\n  &lt;/ContentBlock&gt;\n&lt;/ArticleLayout&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None -- presentational container</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside fluid ContentBlock when content needs to extend edge-to-edge</li>\n<li>Use for full-bleed images, videos, or backgrounds within padded containers</li>\n<li>Use when you need to counteract inherited padding for specific content</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside fluid containers</li>\n<li>Do not use when the parent container has no padding to reset</li>\n<li>Do not use as a general-purpose layout reset</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides a <code>&lt;div&gt;</code> element for padding reset, with zero visual styling. The consumer is responsible for all CSS including negative margins, overflow handling, and responsive behavior.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.padding-reset</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>padding-reset</code></li>\n<li>Verify child content slots are rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use PaddingReset sparingly for full-bleed content like hero images, maps, or edge-to-edge data visualizations.</li>\n<li><strong>Developers</strong>: Set negative margins in your CSS to match the parent container's padding. Ensure overflow is handled correctly to prevent horizontal scrollbars.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>container</code> — a generic block-level content container</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Reuters Graphics PaddingReset component</li>\n<li>Documentation: index.md</li>\n<li>CSS class: .padding-reset in css-style-sheet-template.css</li>\n<li>HTML headless: lily-design-system-html-headless/components/padding-reset.html</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"padding-reset\" aria-label=\"a container that resets padding inside fluid-width containers\">PaddingReset</div>";
  const svelteSource: string = "// In your Svelte component:\nimport PaddingReset from \"lily-design-system-svelte-headless/components/PaddingReset/PaddingReset.svelte\";\n\n<PaddingReset>\n  <!-- content -->\n</PaddingReset>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Padding Reset — Lily Design System</title>
  <meta name="description" content="A container that resets padding inside fluid-width containers. PaddingReset uses negative margins to counteract parent padding, allowing content to extend edge-to-edge." />
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

