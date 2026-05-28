<script lang="ts">
  const html: string = "<h1>Grail Layout Bottom Footer</h1>\n\n<p>GrailLayoutBottomFooter is a headless container for the bottom footer section of a GrailLayout. It spans the full width of the layout and typically contains copyright, links, or site-wide footer content.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;footer&gt;</code> element for the bottom footer section</li>\n<li>Spreads <code>restProps</code> onto the div for consumer customization</li>\n<li>No styles applied; consumer provides all styling</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>children</code>: slot (required) -- content to render inside the bottom footer section</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;div&gt;</code> element</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside GrailLayout as the full-width bottom footer area.</li>\n<li>Use to contain copyright notices, site-wide links, or legal information.</li>\n<li>Use when the page layout requires a persistent footer spanning the full width below the sidebar and main content.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside GrailLayout -- use Footer for standalone page footers.</li>\n<li>Do not use for inline content summaries -- use a Panel or Card instead.</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;GrailLayout&gt;\n  &lt;GrailLayoutTopHeader&gt;...&lt;/GrailLayoutTopHeader&gt;\n  &lt;GrailLayoutLeftAside&gt;...&lt;/GrailLayoutLeftAside&gt;\n  &lt;GrailLayoutCenterMain&gt;...&lt;/GrailLayoutCenterMain&gt;\n  &lt;GrailLayoutRightAside&gt;...&lt;/GrailLayoutRightAside&gt;\n  &lt;GrailLayoutBottomFooter&gt;\n    &lt;Footer /&gt;\n  &lt;/GrailLayoutBottomFooter&gt;\n&lt;/GrailLayout&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive landmark container</li>\n<li>Focusable descendants follow native tab order</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native <code>&lt;footer&gt;</code> exposes a <code>contentinfo</code> landmark when used as the top-level page footer so screen readers can navigate to it via landmark navigation</li>\n<li>Implicit <code>contentinfo</code> role from the <code>&lt;footer&gt;</code> element when used as a top-level landmark</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.grail-layout-bottom-footer</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;footer&gt;</code> element with class <code>grail-layout-bottom-footer</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>GrailLayoutBottomFooter is used as a child of GrailLayout. Place a semantic <code>&lt;footer&gt;</code> element inside for proper accessibility.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>grail-layout</code> — a responsive web design structure with header, left aside, center main, right aside, footer</li>\n<li><code>grail-layout-center-main</code> — grail layout center main content with &lt;main&gt; tag</li>\n<li><code>grail-layout-left-aside</code> — grail layout left aside sidebar with &lt;aside&gt; tag</li>\n<li><code>grail-layout-right-aside</code> — grail layout right aside sidebar with &lt;aside&gt; tag</li>\n<li><code>grail-layout-top-header</code> — grail layout top header full width with &lt;header&gt; tag</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<footer class=\"grail-layout-bottom-footer\">Footer</footer>";
  const svelteSource: string = "// In your Svelte component:\nimport GrailLayoutBottomFooter from \"lily-design-system-svelte-headless/components/GrailLayoutBottomFooter/GrailLayoutBottomFooter.svelte\";\n\n<GrailLayoutBottomFooter>\n  <!-- content -->\n</GrailLayoutBottomFooter>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Grail Layout Bottom Footer — Lily Design System</title>
  <meta name="description" content="GrailLayoutBottomFooter is a headless container for the bottom footer section of a GrailLayout. It spans the full width of the layout and typically contains copyright, links, or site-wide footer co..." />
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

