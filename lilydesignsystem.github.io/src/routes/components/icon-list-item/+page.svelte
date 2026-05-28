<script lang="ts">
  const html: string = "<h1>Icon List Item</h1>\n\n<p>An icon list item is one entry in an <code>icon-list</code>, with an optional leading icon slot and the item text content.</p>\n\n<p>Use it inside <code>IconList</code> to render a list of statements that each begin with a visual marker (check, arrow, dot, etc.).</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a native <code>&lt;li&gt;</code> element with class <code>icon-list-item</code></li>\n<li><code>icon</code> slot/snippet/ReactNode is optional — when supplied it renders inside <code>&lt;span class=\"icon-list-item-icon\" aria-hidden=\"true\"&gt;</code></li>\n<li>The icon span is decorative; the item text remains the accessible content</li>\n<li>Item text content renders inside <code>&lt;span class=\"icon-list-item-text\"&gt;</code></li>\n<li>Pass-through attributes are forwarded to the root <code>&lt;li&gt;</code></li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>This component is part of the <code>*List</code> <code>*ListItem</code> composition pattern. It must be a child of <code>IconList</code>.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>icon</code>: slot/snippet/ReactNode (optional) -- leading icon content</li>\n<li><code>children</code>: slot -- text content of the item</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Item with check-mark icon:</p>\n\n<pre><code class=\"language-html\">&lt;IconListItem&gt;\n  {#snippet icon()}&lt;CheckIcon /&gt;{/snippet}\n  Free shipping on every order\n&lt;/IconListItem&gt;</code></pre>\n\n<p>Plain item with no icon:</p>\n\n<pre><code class=\"language-html\">&lt;IconListItem&gt;\n  Cancel anytime\n&lt;/IconListItem&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab: moves focus to interactive descendants (links, buttons) within the item</li>\n<li>The item itself is not interactive</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Implicit <code>listitem</code> role from <code>&lt;li&gt;</code> element</li>\n<li>The icon span has <code>aria-hidden=\"true\"</code> so it is excluded from the accessibility tree</li>\n<li>The text span carries the accessible content of the item</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use as a child of <code>IconList</code> to render a single statement with a leading icon.</li>\n<li>Use when the same icon is repeated for each item in the list.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside an <code>IconList</code>.</li>\n<li>Do not use for navigation list items — use a <code>*ListItem</code> from a navigation composition.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>Renders the structural skeleton — <code>&lt;li&gt;</code> with two inner <code>&lt;span&gt;</code> elements. Visual size, alignment, and color of the icon and text are entirely the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>Consumer CSS targets the <code>icon-list-item</code> class plus the inner <code>icon-list-item-icon</code> and <code>icon-list-item-text</code> classes for fine-grained control.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders an <code>&lt;li&gt;</code> element with class <code>icon-list-item</code></li>\n<li>Verify the icon span renders only when the <code>icon</code> slot is provided</li>\n<li>Verify the icon span has <code>aria-hidden=\"true\"</code></li>\n<li>Verify the icon span has class <code>icon-list-item-icon</code></li>\n<li>Verify the text span has class <code>icon-list-item-text</code></li>\n<li>Verify children render inside the text span</li>\n<li>Verify additional HTML attributes pass through to the root <code>&lt;li&gt;</code></li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use a single icon style across all items in a list. Keep the icon size compact relative to the text.</li>\n<li><strong>Developers</strong>: Treat the icon as decorative. Do not place meaningful information only inside the icon — repeat it in the text.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>icon-list</code> — an ordered list of icon list item components</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>US Web Design System Icon List: https://designsystem.digital.gov/components/icon-list/</li>\n<li>HTML <code>&lt;li&gt;</code>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li</li>\n<li>WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"icon-list-item\" aria-label=\"one item in an icon list with a leading icon slot\">IconListItem</div>";
  const svelteSource: string = "// In your Svelte component:\nimport IconListItem from \"lily-design-system-svelte-headless/components/IconListItem/IconListItem.svelte\";\n\n<IconListItem>\n  <!-- IconListItem content -->\n</IconListItem>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Icon List Item — Lily Design System</title>
  <meta name="description" content="An icon list item is one entry in an icon-list, with an optional leading icon slot and the item text content." />
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

