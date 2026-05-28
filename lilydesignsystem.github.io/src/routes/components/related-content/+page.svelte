<script lang="ts">
  const html: string = "<h1>RelatedContent</h1>\n\n<p>A complementary <code>&lt;aside&gt;</code> placed beside or after a piece of content, listing links to articles, guides, or service pages that the reader may want to look at next.</p>\n\n<p>The component renders the aside as a labelled landmark — its required heading is wired up via <code>aria-labelledby</code> — so screen reader users can navigate into and out of it as a discrete region. The link list itself is the consumer's responsibility: pass any markup through the children slot, whether that is a plain <code>&lt;ul&gt;</code>, <code>ContentsLink</code> items, or a richer composition. Heading level is configurable so the aside fits the page outline (e.g. <code>&lt;h2&gt;</code> next to the article body, <code>&lt;h3&gt;</code> inside a sidebar section).</p>\n\n<p>Use it for \"you might also be interested in…\" patterns. For in-page section navigation use <code>ContentsNav</code>, and for the page's primary side navigation use <code>Sidebar</code>.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;aside&gt;</code> with a heading and a list of related links</li>\n<li>Heading level is configurable via <code>headingLevel</code> (default <code>&lt;h2&gt;</code>)</li>\n<li>Links are passed via the <code>children</code> slot; consumers compose them with <code>&lt;a&gt;</code> or <code>ContentsLink</code> etc.</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;aside&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>title</code></td><td>string (required)</td><td>—</td><td>Heading text</td></tr>\n<tr><td><code>headingLevel</code></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>2</td><td>Heading level</td></tr>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>Related links</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;aside&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;RelatedContent title=\"Related guidance\"&gt;\n  &lt;ul&gt;\n    &lt;li&gt;&lt;a href=\"/guide-a\"&gt;Guide A&lt;/a&gt;&lt;/li&gt;\n    &lt;li&gt;&lt;a href=\"/guide-b\"&gt;Guide B&lt;/a&gt;&lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/RelatedContent&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Native anchor keyboard behaviour for each link</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>&lt;aside&gt;</code> is a complementary landmark and is announced as such by screen readers</li>\n<li><code>aria-labelledby</code> ties the aside to its heading</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Surfacing supporting links beside or after a piece of content (articles, service pages, guides)</li>\n<li>Encouraging onward navigation without competing with the primary action</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>ContentsNav</code> for in-page section navigation</li>\n<li>Use <code>Sidebar</code> for full sidebar navigation</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.related-content</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>contents-nav</code> — in-page section navigation</li>\n<li><code>sidebar</code> — full sidebar nav</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside\">MDN aside element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"related-content\" aria-label=\"a section providing links to related or supporting information\">RelatedContent</div>";
  const svelteSource: string = "// In your Svelte component:\nimport RelatedContent from \"lily-design-system-svelte-headless/components/RelatedContent/RelatedContent.svelte\";\n\n<RelatedContent>\n  <!-- content -->\n</RelatedContent>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>RelatedContent — Lily Design System</title>
  <meta name="description" content="A complementary &lt;aside&gt; placed beside or after a piece of content, listing links to articles, guides, or service pages that the reader may want to look at next." />
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

