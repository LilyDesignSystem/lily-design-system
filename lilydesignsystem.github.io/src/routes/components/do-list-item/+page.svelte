<script lang="ts">
  const html: string = "<h1>Do List Item</h1>\n\n<p>A single item within a DoList. Renders a semantic <code>&lt;li&gt;</code> element representing one recommended action or best practice. This component is designed to be placed inside a DoList <code>&lt;ul&gt;</code>, providing proper list item semantics for do/don't guidance patterns.</p>\n\n<p>The consumer provides the content through the children slot. The component is intentionally minimal, serving as a semantic wrapper that can be styled by the consumer.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders as a semantic <code>&lt;li&gt;</code> element for use within a DoList <code>&lt;ul&gt;</code></li>\n<li>All content is provided through the children slot</li>\n<li>Spreads <code>...restProps</code> onto the <code>&lt;li&gt;</code> element for consumer customization</li>\n<li>Should be placed inside a DoList component for valid HTML</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>children</code>: slot (required) -- list item content describing a recommended action</li>\n<li><code>...restProps</code>: Any additional HTML attributes spread onto the <code>&lt;li&gt;</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;DoList heading=\"Do\"&gt;\n  &lt;DoListItem&gt;cover blisters that are likely to burst with a soft plaster or dressing&lt;/DoListItem&gt;\n  &lt;DoListItem&gt;wash your hands before touching a burst blister&lt;/DoListItem&gt;\n  &lt;DoListItem&gt;allow the fluid in a burst blister to drain before covering it with a plaster or dressing&lt;/DoListItem&gt;\n&lt;/DoList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None directly -- standard list item with no interactive behavior</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Semantic <code>&lt;li&gt;</code> provides implicit <code>listitem</code> role</li>\n<li>Inherits list context from the parent DoList <code>&lt;ul&gt;</code></li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside DoList to represent one encouraged action or best practice.</li>\n<li>Use with lowercase text that describes the action directly, without prefixing with \"do\".</li>\n<li>Use when each guidance item needs individual styling or interactive behavior.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside of DoList -- it has no standalone meaning and requires a parent <code>&lt;ul&gt;</code> container.</li>\n<li>Do not use for discouraged actions -- use DontListItem inside DontList instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a semantic <code>&lt;li&gt;</code> element that inherits list context from its parent DoList. It handles proper list item semantics. The consumer provides all visual styling, icons, and content for the individual item.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.do-list-item</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;li&gt;</code> element with class <code>do-list-item</code></li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Keep each item to a single, clear sentence. Use consistent visual markers (e.g., check marks) across all do-list items.</li>\n<li><strong>Developers</strong>: Always place DoListItem inside a DoList component for valid HTML structure. Use <code>restProps</code> to add custom data attributes or event handlers.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>do-list</code> — a guideline list of encouraged do-list-item components</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"do-list\"><li class=\"do-list-item\">Do use semantic HTML</li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport DoListItem from \"lily-design-system-svelte-headless/components/DoListItem/DoListItem.svelte\";\n\n<DoListItem>\n  <!-- DoListItem content -->\n</DoListItem>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Do List Item — Lily Design System</title>
  <meta name="description" content="A single item within a DoList. Renders a semantic &lt;li&gt; element representing one recommended action or best practice. This component is designed to be placed inside a DoList &lt;ul&gt;, providing proper l..." />
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

