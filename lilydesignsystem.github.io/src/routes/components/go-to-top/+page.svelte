<script lang="ts">
  const html: string = "<h1>GoToTop</h1>\n\n<p>A link that returns users to the top of a long page. Typically rendered as a fixed or sticky element near the bottom-right of the viewport on long-scrolling pages.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;a&gt;</code> linking to an in-page anchor (default <code>#top</code>)</li>\n<li>Native anchor behaviour means the link works with no JavaScript and respects <code>prefers-reduced-motion</code> automatically</li>\n<li>Consumers may add smooth-scroll JavaScript on top without breaking the keyboard / no-JS fallback</li>\n<li>Visible text is required so screen readers announce a meaningful destination; consumers may override with <code>aria-label</code> for icon-only variants</li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>href</code></td><td><code>string</code></td><td><code>#top</code></td><td>Anchor target on the current page</td></tr>\n<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Visible link text. Required.</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;a&gt;</code> element</td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;GoToTop label=\"Back to top\" href=\"#top\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab: moves focus onto the link</li>\n<li>Enter: activates the link, scrolling focus to the target</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native anchor accessibility — the visible text plus the destination provide the accessible name</li>\n<li>Consumers may override the accessible name with <code>aria-label</code> when the visible text is decorative</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Long content pages where users need a quick way to return to the page top</li>\n<li>Article and guidance pages where the header is far above the fold</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Pages that fit within a single viewport — a back-to-top control adds visual noise without value</li>\n<li>Use <code>BackLink</code> to navigate back to a parent or previous page (different intent)</li>\n<li>Use <code>GoToPreviousSection</code> / <code>GoToNextSection</code> for adjacent-section navigation</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML (<code>&lt;a href=\"#…\"&gt;</code>) with no styling. Consumers position and style the link (often as a fixed/sticky button-like control), and may layer smooth-scroll behaviour with JavaScript.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.go-to-top</code> as the root class. No default styles are included — consumers handle positioning, appearance, and any animation.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>back-link</code> — navigate to a parent or previous page</li>\n<li><code>go-to-previous-section</code> / <code>go-to-next-section</code> — adjacent-section navigation within a page</li>\n<li><code>skip-link</code> — keyboard-only \"skip to main content\" link</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a\">MDN anchor element</a></li>\n<li><a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/\">WAI-ARIA Authoring Practices: landmarks</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"go-to-top\" aria-label=\"a link that returns users to the top of a long page\">GoToTop</div>";
  const svelteSource: string = "// In your Svelte component:\nimport GoToTop from \"lily-design-system-svelte-headless/components/GoToTop/GoToTop.svelte\";\n\n<GoToTop>\n  <!-- content -->\n</GoToTop>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>GoToTop — Lily Design System</title>
  <meta name="description" content="A link that returns users to the top of a long page. Typically rendered as a fixed or sticky element near the bottom-right of the viewport on long-scrolling pages." />
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

