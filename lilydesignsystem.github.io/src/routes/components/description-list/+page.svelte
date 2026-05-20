<script lang="ts">
  const html: string = "<h1>DescriptionList</h1>\n\n<p>A definition list displaying information in key-value format &lt;dl&gt;.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a native <code>&lt;dl&gt;</code> element with <code>DescriptionListItem</code> children</li>\n<li>Each child wraps a <code>&lt;dt&gt;</code> term and one or more <code>&lt;dd&gt;</code> descriptions</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;dl&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td><code>DescriptionListItem</code> children</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;dl&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;DescriptionList&gt;\n  &lt;DescriptionListItem term=\"Date of birth\" description=\"14 January 1990\" /&gt;\n  &lt;DescriptionListItem term=\"Address\" description=\"1 Example Road, London\" /&gt;\n&lt;/DescriptionList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive content list</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native <code>&lt;dl&gt;</code> semantics describe a list of associated terms and descriptions</li>\n<li>Screen readers announce the term/description relationship</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Displaying read-only details (profile information, summary metadata) where each value is paired with a label</li>\n<li>Glossaries, definitions, FAQs in a structured format</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>SummaryList</code> when each row also needs an inline change/edit action</li>\n<li>Use <code>DataTable</code> for tabular data with column headers shared across rows</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.description-list</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>description-list-item</code> — child term/description pair</li>\n<li><code>summary-list</code> — change-link summary list</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl\">MDN dl element</a></li>\n</ul>";
</script>

<svelte:head>
  <title>DescriptionList — Lily Design System</title>
  <meta name="description" content="A definition list displaying information in key-value format &lt;dl&gt;." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>
