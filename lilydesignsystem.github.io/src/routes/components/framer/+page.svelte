<script lang="ts">
  const html: string = "<h1>Framer</h1>\n\n<p>A container for framed content display with a decorative border, used to visually frame screenshots, artwork, or embedded content.</p>\n\n<p>This headless component uses a <code>&lt;div&gt;</code> element with an optional <code>aria-label</code> for semantic framing of visual content.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;div&gt;</code> element as a frame container</li>\n<li>Supports optional <code>aria-label</code> when the frame has semantic meaning</li>\n<li>Consumer provides frame styling (border, shadow, background)</li>\n<li>Can be used for screenshots, artwork, embedded content</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the framed content</li>\n<li><code>children</code>: slot (required) -- framed content</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Framer label=\"Screenshot of the application dashboard\"&gt;\n  &lt;img src=\"screenshot.png\" alt=\"Dashboard showing metrics\" /&gt;\n&lt;/Framer&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;Framer label=\"Artwork: Sunset over the mountains\"&gt;\n  &lt;img src=\"painting.jpg\" alt=\"Oil painting of a sunset over a mountain range\" /&gt;\n&lt;/Framer&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;Framer&gt;\n  &lt;iframe src=\"https://example.com/embed\" title=\"Interactive demo\"&gt;&lt;/iframe&gt;\n&lt;/Framer&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- presentational wrapper; interactive children handle their own keyboard interactions</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Optional <code>aria-label</code> when frame has semantic meaning; otherwise presentational</li>\n<li>When <code>label</code> is provided, the container is labeled for assistive technology</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to visually frame screenshots, artwork, or embedded content</li>\n<li>Use to provide a consistent decorative border around visual media</li>\n<li>Use to group and visually distinguish embedded or quoted visual content from surrounding page content</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for photos with captions -- use Figure</li>\n<li>Do not use as a generic card -- use Card</li>\n<li>Do not use for layout containers -- use Panel or other layout components</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides a <code>&lt;div&gt;</code> element with an optional <code>aria-label</code> for framing content, with zero visual styling. The consumer is responsible for all CSS including borders, shadows, padding, background color, and responsive sizing.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.framer</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>framer</code></li>\n<li>Verify <code>aria-label</code> is applied when <code>label</code> prop is provided</li>\n<li>Verify <code>aria-label</code> is omitted when <code>label</code> prop is not provided</li>\n<li>Verify child content is rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Design frame styles that complement the content without distracting from it. Consider using subtle borders and shadows. Ensure frame styling works well at different viewport sizes.</li>\n<li><strong>Developers</strong>: Only provide a <code>label</code> prop when the frame adds semantic meaning beyond decoration. For purely decorative frames, omit the label to avoid unnecessary verbosity for screen reader users. Ensure framed images have their own <code>alt</code> text.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>card</code> — a grouped content container with header, body, and footer areas</li>\n<li><code>panel</code> — a generic content panel with optional heading</li>\n<li><code>aspect-ratio-container</code> — a container that maintains a fixed aspect ratio</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://github.com/reuters-graphics/graphics-components\">Reuters Graphics Framer component</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"framer\" aria-label=\"a container for framed content display with decorative border\">Framer</div>";
  const svelteSource: string = "// In your Svelte component:\nimport Framer from \"lily-design-system-svelte-headless/components/Framer/Framer.svelte\";\n\n<Framer>\n  <!-- content -->\n</Framer>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Framer — Lily Design System</title>
  <meta name="description" content="A container for framed content display with a decorative border, used to visually frame screenshots, artwork, or embedded content." />
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

