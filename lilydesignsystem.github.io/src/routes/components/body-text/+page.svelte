<script lang="ts">
  const html: string = "<h1>Body Text</h1>\n\n<p>A body text is a rendered text block within a content width container. It wraps article body content for consistent typography targeting by the consumer's stylesheet.</p>\n\n<p>This headless component uses a <code>&lt;div&gt;</code> element to wrap body text content such as paragraphs, lists, and other block-level elements.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;div&gt;</code> element as container</li>\n<li>Wraps body text content for consistent typography targeting</li>\n<li>Consumer applies typography styles via <code>.body-text</code> class</li>\n<li>Intended to be used inside ContentBlock for width constraint</li>\n<li>Inspired by Reuters Graphics BodyText component</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>children</code>: slot (required) -- text content (paragraphs, lists, etc.)</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;ContentBlock width=\"normal\"&gt;\n  &lt;BodyText&gt;\n    &lt;p&gt;First paragraph of article body text.&lt;/p&gt;\n    &lt;p&gt;Second paragraph with more detail.&lt;/p&gt;\n  &lt;/BodyText&gt;\n&lt;/ContentBlock&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;BodyText&gt;\n  &lt;p&gt;The research findings indicate a significant shift in consumer behavior\n  over the past decade.&lt;/p&gt;\n  &lt;ul&gt;\n    &lt;li&gt;Online purchases increased by 45%&lt;/li&gt;\n    &lt;li&gt;In-store visits declined by 20%&lt;/li&gt;\n  &lt;/ul&gt;\n  &lt;p&gt;These trends are expected to continue into the next quarter.&lt;/p&gt;\n&lt;/BodyText&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;BodyText&gt;\n  &lt;p&gt;Healthcare providers across the region reported improved patient outcomes\n  following the implementation of the new protocol.&lt;/p&gt;\n  &lt;blockquote&gt;\n    &lt;p&gt;\"The results exceeded our expectations,\" said Dr. Smith.&lt;/p&gt;\n  &lt;/blockquote&gt;\n&lt;/BodyText&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>None -- semantic content comes from child elements (<code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;blockquote&gt;</code>, etc.)</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use for article body text that needs consistent typography styling</li>\n<li>Use inside editorial layouts to wrap running text content</li>\n<li>Use in combination with ContentBlock for width-constrained body text</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for standalone headings or captions -- use Headline or Caption</li>\n<li>Do not use for navigation or interactive content</li>\n<li>Do not use for short inline text -- this is for block-level body content</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides a <code>&lt;div&gt;</code> container for body text content, with zero visual styling. The consumer is responsible for all CSS including font family, font size, line height, paragraph spacing, list styling, blockquote formatting, and responsive typography.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.body-text</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>body-text</code></li>\n<li>Verify child content is rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use appropriate line height and measure (characters per line) for readability. Ensure sufficient contrast between text and background. Consider responsive font sizing.</li>\n<li><strong>Developers</strong>: Use semantic HTML elements within BodyText (paragraphs, lists, blockquotes). Do not nest BodyText components. Pair with ContentBlock for width constraint.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>blockquote</code> — a block-level quotation with optional source citation</li>\n<li><code>section-heading</code> — a styled heading introducing a major content section, with optional eyebrow and subtitle</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element\">MDN HTML elements reference</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"body-text\" aria-label=\"a rendered text block within a content width container\">BodyText</div>";
  const svelteSource: string = "// In your Svelte component:\nimport BodyText from \"lily-design-system-svelte-headless/components/BodyText/BodyText.svelte\";\n\n<BodyText>\n  <!-- content -->\n</BodyText>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Body Text — Lily Design System</title>
  <meta name="description" content="A body text is a rendered text block within a content width container. It wraps article body content for consistent typography targeting by the consumer's stylesheet." />
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

