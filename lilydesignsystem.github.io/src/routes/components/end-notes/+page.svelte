<script lang="ts">
  const html: string = "<h1>End Notes</h1>\n\n<p>An end notes section contains titled endnote items at the end of an article. It is used for methodology, sources, credits, corrections, and other supplementary information.</p>\n\n<p>This headless component uses a <code>&lt;section&gt;</code> element with an <code>aria-label</code> to create a labeled landmark region for endnote content.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;section&gt;</code> element for landmark semantics</li>\n<li><code>aria-label</code> describes the endnotes section for screen readers (default: \"End notes\")</li>\n<li>Each endnote item can have a title and body</li>\n<li>Used for methodology, sources, credits, corrections</li>\n<li>Inspired by Reuters Graphics EndNotes component</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (default: \"End notes\") -- accessible label for the section</li>\n<li><code>children</code>: slot (required) -- endnote content items</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;EndNotes label=\"Notes and methodology\"&gt;\n  &lt;div&gt;\n    &lt;h3&gt;Methodology&lt;/h3&gt;\n    &lt;p&gt;Data was collected from...&lt;/p&gt;\n  &lt;/div&gt;\n  &lt;div&gt;\n    &lt;h3&gt;Sources&lt;/h3&gt;\n    &lt;p&gt;Reuters reporting, government data&lt;/p&gt;\n  &lt;/div&gt;\n&lt;/EndNotes&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;EndNotes&gt;\n  &lt;div&gt;\n    &lt;h3&gt;Credits&lt;/h3&gt;\n    &lt;p&gt;Photography by John Doe. Graphics by Jane Smith.&lt;/p&gt;\n  &lt;/div&gt;\n&lt;/EndNotes&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;EndNotes label=\"Corrections and clarifications\"&gt;\n  &lt;div&gt;\n    &lt;h3&gt;Correction&lt;/h3&gt;\n    &lt;p&gt;An earlier version of this article misstated the year. It has been corrected.&lt;/p&gt;\n  &lt;/div&gt;\n&lt;/EndNotes&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Implicit <code>region</code> role from <code>&lt;section&gt;</code> element with <code>aria-label</code></li>\n<li><code>aria-label</code> -- describes the endnotes section for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use at the end of articles for methodology, sources, credits, corrections</li>\n<li>Use when supplementary information needs to be grouped in a labeled section</li>\n<li>Use for editorial transparency about data sources and methods</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for footnotes within body text -- use Footnote component</li>\n<li>Do not use for inline citations -- use Citation component</li>\n<li>Do not use for general page footers -- use Footer component</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides a <code>&lt;section&gt;</code> element with <code>aria-label</code> for landmark navigation, with zero visual styling. The consumer is responsible for all CSS including spacing, typography, borders or dividers between endnote items, and responsive layout.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.end-notes</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;section&gt;</code> element with class <code>end-notes</code></li>\n<li>Verify <code>aria-label</code> is applied (default: \"End notes\")</li>\n<li>Verify child content slots are rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Visually distinguish endnotes from body content with spacing or dividers. Use smaller text or muted colors to indicate supplementary status. Group related endnotes logically.</li>\n<li><strong>Developers</strong>: Always provide a descriptive <code>label</code> prop for screen reader landmark navigation. Use appropriate heading levels within endnote items that follow the page heading hierarchy.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>footnote</code> — a footnote reference and content element</li>\n<li><code>citation</code> — a citation acknowledges the relevance of a work of another to the topic of discussion</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element\">MDN HTML elements reference</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"end-notes\" aria-label=\"a section of titled endnote items at the end of an article\">EndNotes</div>";
  const svelteSource: string = "// In your Svelte component:\nimport EndNotes from \"lily-design-system-svelte-headless/components/EndNotes/EndNotes.svelte\";\n\n<EndNotes>\n  <!-- content -->\n</EndNotes>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>End Notes — Lily Design System</title>
  <meta name="description" content="An end notes section contains titled endnote items at the end of an article. It is used for methodology, sources, credits, corrections, and other supplementary information." />
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

