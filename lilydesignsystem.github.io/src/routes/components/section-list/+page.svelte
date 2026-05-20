<script lang="ts">
  const html: string = "<h1>SectionList</h1>\n\n<p>A list of section navigation items.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;ol&gt;</code> containing <code>SectionListItem</code> children</li>\n<li>Used inside <code>SectionNav</code> to enumerate the section's pages</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;ol&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td><code>SectionListItem</code> elements</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;ol&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;SectionList&gt;\n  &lt;SectionListItem&gt;&lt;SectionLink href=\"/a\"&gt;A&lt;/SectionLink&gt;&lt;/SectionListItem&gt;\n  &lt;SectionListItem&gt;&lt;SectionLink href=\"/b\" current&gt;B&lt;/SectionLink&gt;&lt;/SectionListItem&gt;\n&lt;/SectionList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions on the list itself</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native ordered list semantics announce the count of items</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>As the list element inside a <code>SectionNav</code></li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>BreadcrumbList</code>, <code>ContentsList</code>, <code>PaginationList</code>, or <code>TreeList</code> in their respective navs</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.section-list</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>section-nav</code> — parent landmark</li>\n<li><code>section-list-item</code> — child list item</li>\n<li><code>section-link</code> — link rendered inside each list item</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol\">MDN ol element</a></li>\n</ul>";
</script>

<svelte:head>
  <title>SectionList — Lily Design System</title>
  <meta name="description" content="A list of section navigation items." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>
