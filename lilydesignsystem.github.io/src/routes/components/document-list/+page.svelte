<script lang="ts">
  const html: string = "<h1>DocumentList</h1>\n\n<p>A list displaying documents with titles and metadata.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;ol&gt;</code> of <code>DocumentListItem</code> children</li>\n<li>Used to list downloadable or related documents (PDFs, attachments, references)</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;ol&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td><code>DocumentListItem</code> children</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;ol&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;DocumentList&gt;\n  &lt;DocumentListItem title=\"Annual report 2025\" href=\"/docs/annual-2025.pdf\" type=\"PDF\" size=\"1.2 MB\" /&gt;\n  &lt;DocumentListItem title=\"Statement of accounts\" href=\"/docs/accounts-2025.pdf\" type=\"PDF\" size=\"540 KB\" /&gt;\n&lt;/DocumentList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions on the list itself</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native ordered list semantics</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Displaying a list of attachments, downloads, or related documents on a page</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>CollectionList</code> for general content collections (articles, products)</li>\n<li>Use <code>DataTable</code> when document metadata needs sortable columns</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.document-list</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>document-list-item</code> — child item</li>\n<li><code>collection-list</code> — generic content collection</li>\n<li><code>download-button</code> — single download link styled as a button</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol\">MDN ol element</a></li>\n</ul>";
</script>

<svelte:head>
  <title>DocumentList — Lily Design System</title>
  <meta name="description" content="A list displaying documents with titles and metadata." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>
