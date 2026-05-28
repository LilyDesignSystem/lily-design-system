<script lang="ts">
  const html: string = "<h1>DescriptionListItem</h1>\n\n<p>One key-value pair in a description list using dt and dd elements.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> wrapping a <code>&lt;dt&gt;</code> (term) and a <code>&lt;dd&gt;</code> (description) so each item is a single styling unit while preserving native list semantics</li>\n<li>Per HTML5, wrapping <code>&lt;dt&gt;</code>/<code>&lt;dd&gt;</code> pairs in a <code>&lt;div&gt;</code> inside <code>&lt;dl&gt;</code> is valid</li>\n<li>Term and description text come through props or slots</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;div&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>term</code></td><td>string (required)</td><td>—</td><td>Term shown in the <code>&lt;dt&gt;</code></td></tr>\n<tr><td><code>description</code></td><td>string</td><td>—</td><td>Description shown in the <code>&lt;dd&gt;</code> (when no children slot)</td></tr>\n<tr><td><code>children</code></td><td>slot</td><td>—</td><td>Custom description content (overrides <code>description</code>)</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;div&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;DescriptionListItem term=\"Email\" description=\"user@example.com\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>&lt;dt&gt;</code> and <code>&lt;dd&gt;</code> retain their native term/description semantics inside the wrapper</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>As a child of <code>DescriptionList</code></li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>SummaryListItem</code> when the row also needs an inline change link</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.description-list-item</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>description-list</code> — parent list</li>\n<li><code>summary-list-item</code> — change-link summary list item</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt\">MDN dt element</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd\">MDN dd element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"description-list-item\" aria-label=\"one key-value pair in a description list using dt and dd elements\">DescriptionListItem</div>";
  const svelteSource: string = "// In your Svelte component:\nimport DescriptionListItem from \"lily-design-system-svelte-headless/components/DescriptionListItem/DescriptionListItem.svelte\";\n\n<DescriptionListItem>\n  <!-- DescriptionListItem content -->\n</DescriptionListItem>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>DescriptionListItem — Lily Design System</title>
  <meta name="description" content="One key-value pair in a description list using dt and dd elements." />
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

