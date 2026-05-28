<script lang="ts">
  const html: string = "<h1>SharePage</h1>\n\n<p>A labeled group of share controls — typically email, copy-link, and one or two social platforms — letting readers send the current page to others without leaving it.</p>\n\n<p>The component is a thin headless wrapper: it renders a <code>role=\"group\"</code> container with an accessible label, then renders one button or link per configured service. Social platforms render as anchors that open the platform's share endpoint with the URL and title pre-filled; copy-link renders as a <code>&lt;button&gt;</code> that calls the Clipboard API (with a textarea-select fallback for older browsers) and announces success via an <code>aria-live=\"polite\"</code> region. The list of services is configurable so consumers can add, remove, or reorder share targets to match their audience.</p>\n\n<p>For mobile-first contexts where the OS share sheet is preferable, prefer the native Web Share API (<code>navigator.share</code>) over this component.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a labeled group of share buttons (or links) for the current page URL</li>\n<li>Each share target (e.g. email, Twitter/X, Facebook, copy-link) is rendered as a <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code> depending on the action</li>\n<li>The list of <code>services</code> is configurable; consumers wire each service's share URL or copy-to-clipboard handler</li>\n<li>Includes a copy-link button that uses the Clipboard API; falls back to a textarea-and-select fallback when the API is unavailable</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;div&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible label for the share group (e.g. \"Share this page\")</td></tr>\n<tr><td><code>url</code></td><td>string (required)</td><td>—</td><td>URL to share</td></tr>\n<tr><td><code>title</code></td><td>string</td><td>—</td><td>Page title shared alongside the URL</td></tr>\n<tr><td><code>services</code></td><td>array of <code>{ id: string; label: string; href?: string; onClick?: () =&gt; void }</code></td><td>[email, copy, x, facebook]</td><td>Services to render</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;div&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;SharePage label=\"Share this page\" url={pageUrl} title={pageTitle} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab cycles through each share control</li>\n<li>Enter or Space activates the focused control (native button behaviour)</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Wrapper has <code>role=\"group\"</code> with <code>aria-label</code> so the share controls are announced as a related set</li>\n<li>Each share control has its own <code>aria-label</code> (e.g. \"Share on email\")</li>\n<li>The copy-link button announces success via a transient <code>aria-live=\"polite\"</code> region</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Allowing users to share an article, service page, or piece of guidance via email or social platforms</li>\n<li>Providing a quick \"copy link\" button on long-form content</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use the platform's native Web Share API (<code>navigator.share</code>) for mobile-first contexts when a unified share sheet is preferable</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.share-page</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>clipboard-copy-button</code> — single copy-to-clipboard action</li>\n<li><code>button-group</code> — grouped action buttons</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API\">MDN Clipboard API</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API\">MDN Web Share API</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"share-page\" aria-label=\"a component for sharing the page on social media\">SharePage</div>";
  const svelteSource: string = "// In your Svelte component:\nimport SharePage from \"lily-design-system-svelte-headless/components/SharePage/SharePage.svelte\";\n\n<SharePage>\n  <!-- content -->\n</SharePage>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>SharePage — Lily Design System</title>
  <meta name="description" content="A labeled group of share controls — typically email, copy-link, and one or two social platforms — letting readers send the current page to others without leaving it." />
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

