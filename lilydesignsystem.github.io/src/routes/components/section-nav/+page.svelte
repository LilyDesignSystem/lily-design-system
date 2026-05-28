<script lang="ts">
  const html: string = "<h1>SectionNav</h1>\n\n<p>A navigation container for section navigation links.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;nav&gt;</code> landmark with <code>aria-label</code> to identify it (e.g. \"In this section\")</li>\n<li>Wraps a <code>SectionList</code> of <code>SectionListItem</code> containing <code>SectionLink</code> children</li>\n<li>Companion components: <code>SectionList</code>, <code>SectionListItem</code>, <code>SectionLink</code></li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;nav&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible label for the navigation landmark</td></tr>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>The <code>SectionList</code> and its children</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;nav&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;SectionNav label=\"In this section\"&gt;\n  &lt;SectionList&gt;\n    &lt;SectionListItem&gt;&lt;SectionLink href=\"/section-a\"&gt;Section A&lt;/SectionLink&gt;&lt;/SectionListItem&gt;\n    &lt;SectionListItem&gt;&lt;SectionLink href=\"/section-b\" current&gt;Section B&lt;/SectionLink&gt;&lt;/SectionListItem&gt;\n  &lt;/SectionList&gt;\n&lt;/SectionNav&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab moves focus through the contained links</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>&lt;nav&gt;</code> element is a navigation landmark</li>\n<li><code>aria-label</code> (from <code>label</code>) names the landmark</li>\n<li><code>aria-current=\"page\"</code> should be applied by the consumer to the current <code>SectionLink</code></li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Showing a sibling-page menu for a content section (typically rendered as a left-side or top sub-navigation)</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>BreadcrumbNav</code> for hierarchical position navigation</li>\n<li>Use <code>ContentsNav</code> for in-page anchor links</li>\n<li>Use <code>NavigationMenu</code> for global site navigation</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.section-nav</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>section-list</code> — list element used inside <code>SectionNav</code></li>\n<li><code>section-list-item</code> — list item</li>\n<li><code>section-link</code> — individual link</li>\n<li><code>contents-nav</code> — in-page anchor navigation</li>\n<li><code>breadcrumb-nav</code> — hierarchical breadcrumb</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav\">MDN nav element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"section-nav\" aria-label=\"a navigation container for section navigation links\">SectionNav</div>";
  const svelteSource: string = "// In your Svelte component:\nimport SectionNav from \"lily-design-system-svelte-headless/components/SectionNav/SectionNav.svelte\";\n\n<SectionNav label=\"Navigation\">\n  <!-- nav children -->\n</SectionNav>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>SectionNav — Lily Design System</title>
  <meta name="description" content="A navigation container for section navigation links." />
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

