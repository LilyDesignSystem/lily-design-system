<script lang="ts">
  const html: string = "<h1>SectionLink</h1>\n\n<p>One section link in the navigation.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;a&gt;</code> linking to a section page</li>\n<li>When <code>current</code> is true, sets <code>aria-current=\"page\"</code> to mark the active section</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;a&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>href</code></td><td>string (required)</td><td>—</td><td>Link target</td></tr>\n<tr><td><code>current</code></td><td>boolean</td><td>false</td><td>Whether this link represents the current page</td></tr>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>Link text</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;a&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;SectionLink href=\"/section-a\" current&gt;Section A&lt;/SectionLink&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab moves focus onto the link</li>\n<li>Enter activates the link (native browser behaviour)</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native anchor accessibility</li>\n<li><code>aria-current=\"page\"</code> when <code>current</code> is true</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>As the clickable element inside <code>SectionListItem</code></li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>BreadcrumbLink</code>, <code>ContentsLink</code>, <code>PaginationLink</code>, or <code>TreeLink</code> in their respective navs</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.section-link</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>section-nav</code> — landmark wrapper</li>\n<li><code>section-list</code> / <code>section-list-item</code> — structural ancestors</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current\">MDN aria-current</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"section-link\" aria-label=\"one section link in the navigation\">SectionLink</div>";
  const svelteSource: string = "// In your Svelte component:\nimport SectionLink from \"lily-design-system-svelte-headless/components/SectionLink/SectionLink.svelte\";\n\n<SectionLink>SectionLink</SectionLink>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>SectionLink — Lily Design System</title>
  <meta name="description" content="One section link in the navigation." />
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

