<script lang="ts">
  const html: string = "<h1>SectionListItem</h1>\n\n<p>One section navigation item.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;li&gt;</code> containing a <code>SectionLink</code></li>\n<li>Used inside <code>SectionList</code></li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;li&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>Typically a single <code>SectionLink</code></td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;li&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;SectionListItem&gt;&lt;SectionLink href=\"/a\"&gt;A&lt;/SectionLink&gt;&lt;/SectionListItem&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions on the list item itself; the inner link receives focus</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native <code>&lt;li&gt;</code> semantics</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>As a child of <code>SectionList</code> enumerating section navigation links</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use the appropriate <code>*ListItem</code> for other navigation patterns (e.g. <code>BreadcrumbListItem</code>)</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.section-list-item</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>section-list</code> — parent list</li>\n<li><code>section-link</code> — link inside the item</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li\">MDN li element</a></li>\n</ul>";
</script>

<svelte:head>
  <title>SectionListItem — Lily Design System</title>
  <meta name="description" content="One section navigation item." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>
