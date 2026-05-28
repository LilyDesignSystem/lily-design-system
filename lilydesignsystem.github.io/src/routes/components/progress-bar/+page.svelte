<script lang="ts">
  const html: string = "<h1>ProgressBar</h1>\n\n<p>A horizontal progress indicator.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with <code>role=\"progressbar\"</code> and ARIA value attributes</li>\n<li>Accepts <code>value</code>, <code>min</code>, and <code>max</code> props for the current and bounding values</li>\n<li>Sets <code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code>, and <code>aria-label</code></li>\n<li>Differs from <code>Progress</code> (which renders a native <code>&lt;progress&gt;</code> element) — <code>ProgressBar</code> is a div-based composition for cases where the native element does not provide enough styling control</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (required) — accessible name set on <code>aria-label</code></li>\n<li><code>value</code>: number (required) — current value</li>\n<li><code>min</code>: number (default: 0) — minimum value</li>\n<li><code>max</code>: number (default: 100) — maximum value</li>\n<li><code>className</code>: string (optional) — extra CSS classes appended to <code>progress-bar</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;ProgressBar label=\"Upload progress\" value={42} max={100} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive status indicator</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"progressbar\"</code> identifies the element as a progress indicator</li>\n<li><code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code> expose the current and bounding values</li>\n<li><code>aria-label</code> provides an accessible name</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>For determinate progress where the current value falls within a known range (file upload, form completion, multi-step task).</li>\n<li>When the consumer needs full control over the bar visualization (custom track, fill animation, segmented styles) — pick this over <code>Progress</code> whose native <code>&lt;progress&gt;</code> element is harder to style.</li>\n<li>When you need to expose progress state to assistive technology via ARIA value attributes.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when progress is indeterminate (loading without a known endpoint) — use <code>ProgressSpinner</code> instead.</li>\n<li>Do not use as a circular indicator — use <code>ProgressCircle</code>.</li>\n<li>Do not use to display a measured value within a known range that is not progress (e.g. battery, disk usage) — use <code>Meter</code>.</li>\n<li>Do not use when the native <code>&lt;progress&gt;</code> element is sufficient — use <code>Progress</code> for less custom styling needs.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.progress-bar</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>progress</code> — a horizontal progress bar showing completion</li>\n<li><code>progress-circle</code> — a circular progress indicator</li>\n<li><code>progress-spinner</code> — an indeterminate spinning progress indicator</li>\n<li><code>meter</code> — a gauge displaying a scalar value within a known range</li>\n<li><code>loading</code> — a loading indicator, such as text, or image, or animation</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Documentation: index.md</li>\n<li>CSS class: <code>.progress-bar</code> in css-style-sheet-template.css</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"42\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"Upload progress\" style=\"background:#e5e7eb;height:1rem;border-radius:0.25rem;\"><div style=\"width:42%;background:#2563eb;height:100%;border-radius:0.25rem;\"></div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport ProgressBar from \"lily-design-system-svelte-headless/components/ProgressBar/ProgressBar.svelte\";\n\n<ProgressBar>\n  <!-- list children -->\n</ProgressBar>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ProgressBar — Lily Design System</title>
  <meta name="description" content="A horizontal progress indicator." />
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

