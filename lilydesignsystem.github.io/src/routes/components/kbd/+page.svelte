<script lang="ts">
  const html: string = "<h1>Kbd</h1>\n\n<p>Kbd is a headless component that renders a <code>&lt;kbd&gt;</code> element to display keyboard shortcuts and key combinations in a styled inline element. It semantically marks up user keyboard input.</p>\n\n<p>Use this component to display keyboard shortcuts, key combinations, or individual key references in documentation, tooltips, or help text.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a native <code>&lt;kbd&gt;</code> HTML element for semantic keyboard input markup</li>\n<li>Accepts <code>className</code> for CSS class targeting</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;kbd&gt;</code> element for consumer customization</li>\n<li>Children slot renders the key label text</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (default: <code>\"\"</code>) -- CSS class name for the element</li>\n<li><code>children</code>: slot (required) -- the key label text content</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;kbd&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Key combination for copy:</p>\n\n<pre><code class=\"language-html\">&lt;Kbd&gt;Ctrl&lt;/Kbd&gt; + &lt;Kbd&gt;C&lt;/Kbd&gt;</code></pre>\n\n<p>Inline shortcut reference in help text:</p>\n\n<pre><code class=\"language-html\">Press &lt;Kbd&gt;Enter&lt;/Kbd&gt; to submit the form.</code></pre>\n\n<p>Menu item with keyboard shortcut:</p>\n\n<pre><code class=\"language-html\">&lt;MenuItem&gt;\n  Save\n  &lt;span class=\"shortcut\"&gt;&lt;Kbd&gt;Ctrl&lt;/Kbd&gt; + &lt;Kbd&gt;S&lt;/Kbd&gt;&lt;/span&gt;\n&lt;/MenuItem&gt;</code></pre>\n\n<p>Multi-key shortcut in a keyboard shortcuts panel:</p>\n\n<pre><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem&gt;\n    &lt;dt&gt;Open command palette&lt;/dt&gt;\n    &lt;dd&gt;&lt;Kbd&gt;Ctrl&lt;/Kbd&gt; + &lt;Kbd&gt;Shift&lt;/Kbd&gt; + &lt;Kbd&gt;P&lt;/Kbd&gt;&lt;/dd&gt;\n  &lt;/SummaryListItem&gt;\n  &lt;SummaryListItem&gt;\n    &lt;dt&gt;Toggle sidebar&lt;/dt&gt;\n    &lt;dd&gt;&lt;Kbd&gt;Ctrl&lt;/Kbd&gt; + &lt;Kbd&gt;B&lt;/Kbd&gt;&lt;/dd&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None. Kbd is a passive display element.</p>\n\n<h2>ARIA</h2>\n\n<p>No ARIA attributes needed. The <code>&lt;kbd&gt;</code> element has built-in semantics for keyboard input.</p>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display keyboard shortcuts, key combinations, or key references.</li>\n<li>Use in documentation, help text, tooltips, or command palettes.</li>\n<li>Use in application menus where shortcuts are shown alongside menu items.</li>\n<li>Use in onboarding flows to teach users keyboard shortcuts.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for code snippets or programming syntax -- use Code or CodeBlock instead.</li>\n<li>Do not use for general emphasis -- use <code>&lt;strong&gt;</code> or <code>&lt;em&gt;</code> instead.</li>\n<li>Do not use for non-keyboard input such as mouse actions or gestures.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders a <code>&lt;kbd&gt;</code> element. The consumer provides all visual styling including borders, backgrounds, padding, border-radius, and font styling to create a keycap appearance.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.kbd</code> class for targeting. Common styling includes a keycap appearance with borders, shadows, and monospace font.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;kbd&gt;</code> element</li>\n<li>Verify children content is rendered</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Style Kbd elements to look like physical keycaps with borders, subtle shadows, and rounded corners. Use a monospace font for consistency.</li>\n<li><strong>Developers</strong>: Nest <code>&lt;Kbd&gt;</code> elements for key combinations (e.g., <code>&lt;Kbd&gt;Ctrl&lt;/Kbd&gt; + &lt;Kbd&gt;C&lt;/Kbd&gt;</code>). Use the <code>&lt;kbd&gt;</code> semantic for screen readers.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>code</code> — an inline code span for displaying short code snippets within surrounding text</li>\n<li><code>code-block</code> — a block of formatted code with optional line numbers and line highlighting</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<kbd class=\"kbd\">Ctrl</kbd> + <kbd class=\"kbd\">S</kbd>";
  const svelteSource: string = "// In your Svelte component:\nimport Kbd from \"lily-design-system-svelte-headless/components/Kbd/Kbd.svelte\";\n\n<Kbd>\n  <!-- content -->\n</Kbd>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Kbd — Lily Design System</title>
  <meta name="description" content="Kbd is a headless component that renders a &lt;kbd&gt; element to display keyboard shortcuts and key combinations in a styled inline element. It semantically marks up user keyboard input." />
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

