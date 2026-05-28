<script lang="ts">
  const html: string = "<h1>GoToNextSection</h1>\n\n<p>A link that takes users to the next section of the current page.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;a&gt;</code> with class <code>go-to-next-section</code> linking to a section anchor on the same page</li>\n<li>Accepts a <code>href</code> prop pointing at the next section's anchor (e.g. <code>#section-3</code>)</li>\n<li>Accepts a <code>label</code> prop for the visible link text</li>\n<li>Companion to <code>GoToPreviousSection</code> and <code>GoToTop</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>href</code>: string (required) — anchor URL of the next section, typically <code>#section-id</code></li>\n<li><code>label</code>: string (required) — visible link text</li>\n<li><code>className</code>: string (optional) — extra CSS classes appended to <code>go-to-next-section</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;GoToNextSection href=\"#section-3\" label=\"Next section: Implementation\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab: moves focus onto the link</li>\n<li>Enter: navigates to the linked anchor (native browser behavior)</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native anchor accessibility — the <code>href</code> provides the destination, the link text provides the accessible name</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>On long single-page documents where users benefit from sequential navigation between adjacent sections.</li>\n<li>Together with <code>GoToPreviousSection</code> to give readers symmetric forward/back movement at the end of each section.</li>\n<li>When section anchor IDs are stable enough to link to.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use to navigate between separate pages — use a regular link or breadcrumb pattern.</li>\n<li>Do not use as the primary on-page navigation for an article — use <code>ContentsNav</code> or <code>SectionNav</code> instead.</li>\n<li>Do not use when there is no logical \"next\" section (e.g. on the last section of a page).</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.go-to-next-section</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>go-to-previous-section</code> — a link that takes users to the previous section of the current page</li>\n<li><code>go-to-top</code> — a link that returns users to the top of a long page</li>\n<li><code>section-nav</code> — a navigation container for section navigation links</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Documentation: index.md</li>\n<li>CSS class: <code>.go-to-next-section</code> in css-style-sheet-template.css</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<a class=\"go-to-next-section\" href=\"#section-3\" aria-label=\"Next section: Implementation\">Next: Implementation \u2192</a>";
  const svelteSource: string = "// In your Svelte component:\nimport GoToNextSection from \"lily-design-system-svelte-headless/components/GoToNextSection/GoToNextSection.svelte\";\n\n<GoToNextSection>\n  <!-- content -->\n</GoToNextSection>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>GoToNextSection — Lily Design System</title>
  <meta name="description" content="A link that takes users to the next section of the current page." />
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

