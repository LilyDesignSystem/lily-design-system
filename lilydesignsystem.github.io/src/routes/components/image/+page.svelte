<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Image</h1>\n<p>An image component displays visual content such as photographs, illustrations, or diagrams within an interface. The Image component provides a headless wrapper that ensures proper accessibility through required alt text. For a caption, put it in a <code>figure</code> with a <code>caption</code>.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>The component renders a plain <code>&lt;img&gt;</code> element; a caption belongs to the <code>figure</code> around it, as a <code>caption</code>, which associates the two for assistive technology. The component also supports native lazy loading for performance optimization.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;image\n  src=&quot;/images/stretch-marks.jpg&quot;\n  alt=&quot;Close-up of a person&#39;s skin showing pink and silver stretch marks across the abdomen&quot;\n/&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;figure&gt;\n  &lt;image\n    src=&quot;/images/chickenpox-rash.jpg&quot;\n    alt=&quot;Small red spots on a child&#39;s chest and arms, typical of chickenpox&quot;\n  /&gt;\n  &lt;caption&gt;\n    Chickenpox starts with small, itchy spots. They can appear anywhere on the body.\n  &lt;/caption&gt;\n&lt;/figure&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;!-- Lazy-loaded image below the fold --&gt;\n&lt;image\n  src=&quot;/images/physiotherapy-exercise.jpg&quot;\n  alt=&quot;A person performing a seated hamstring stretch with one leg extended&quot;\n  loading=&quot;lazy&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>src</code>: string (required) -- the image source URL</li>\n<li><code>alt</code>: string (required) -- alternative text describing the image for screen readers and when the image fails to load</li>\n<li><code>loading</code>: &quot;lazy&quot; | &quot;eager&quot; (optional) -- controls the native browser loading behavior</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the root element</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None -- this component is a passive content element. Images are not interactive by default.</p>\n<h2>ARIA</h2>\n<ul>\n<li><code>alt=&quot;...&quot;</code> -- provides the accessible name for the image, required for all non-decorative images</li>\n<li><code>figure</code> and <code>caption</code> (a <code>&lt;figcaption&gt;</code>) -- wrap the image when it needs a caption; the browser associates the two</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when an image meets a genuine user need, such as helping users identify a health condition or understand a procedure</li>\n<li>Use with descriptive alt text that conveys the same information as the image</li>\n<li>Use with a caption (via Figure and Caption) to explain what users should conclude from the image</li>\n<li>Use when users with access needs like dyslexia benefit from visual content alongside text</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use decorative images that add no informational value -- they frustrate users, especially on transactional pages; use a CSS background image instead</li>\n<li>Do not use images containing embedded text -- screen readers cannot read text within images</li>\n<li>Do not arrange images side-by-side in a gallery layout -- stack vertically so users do not miss content</li>\n<li>Do not use when the information can be conveyed equally well through text alone</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component provides an <code>&lt;img&gt;</code> element with required <code>alt</code> text, and native <code>loading</code> attribute support. The consumer provides all visual styling including sizing, borders, rounded corners, and responsive behavior.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.image</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders an <code>&lt;img&gt;</code> element with class <code>image</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Define consistent aspect ratios and sizing for images across the application. Provide placeholder or skeleton states for slow-loading images.</li>\n<li><strong>Developers</strong>: Always write meaningful <code>alt</code> text that describes the image content. Use <code>loading=&quot;lazy&quot;</code> for below-the-fold images to improve page performance.</li>\n<li><strong>Consumer CSS, three rules for <code>.image</code></strong>: <code>display: block</code> removes the small gap under an inline image (the line&#39;s baseline space); <code>max-inline-size: 100%</code> stops the image overflowing its container on narrow screens; <code>block-size: auto</code> keeps the aspect ratio when the width is limited. The component ships none of these, so add them in your own stylesheet.</li>\n<li><strong>Explicit <code>width</code> and <code>height</code> attributes</strong>: set both on the image, in pixels, to the file&#39;s real dimensions. The browser uses them to reserve the right space before the file arrives, so the page does not shift as images load (the Cumulative Layout Shift measure). With <code>block-size: auto</code> above, the attributes set the aspect ratio only and the image still scales. Pass them through the rest props.</li>\n<li>For several sources, art direction or modern formats with a fallback, use <code>Picture</code>.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a plain <code>&lt;img&gt;</code> element; for a caption, wrap it in <code>figure</code> with a <code>caption</code></li>\n<li>The <code>alt</code> prop is required to enforce accessibility</li>\n<li>Rest props are spread onto the <code>&lt;img&gt;</code> element</li>\n<li>Supports the native <code>loading</code> attribute for lazy/eager loading control</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>image-input</code> — a graphical submit button that displays an image &lt;input type=\"image\"&gt;</li>\n<li><code>image-file-input</code> — an input for selecting image files with preview</li>\n<li><code>picture</code> — a responsive image wrapper that lets the browser choose among several sources</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI Images Tutorial: <a href=\"https://www.w3.org/WAI/tutorials/images/\">https://www.w3.org/WAI/tutorials/images/</a></li>\n<li>HTML figure element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<img class=\"image\" alt=\"Placeholder image\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect fill='%23e5e7eb' width='200' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EImage%3C/text%3E%3C/svg%3E\" />";
  const svelteSource: string = "// In your Svelte component:\nimport Image from \"lily-design-system-svelte-headless/components/Image/Image.svelte\";\n\n<Image>\n  <!-- content -->\n</Image>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import Image from \"./Image.svelte\";\n<\/script>\n\n<Image\n  src=\"/photo.jpg\"\n  alt=\"A sunset over the ocean\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Image — Lily Design System</title>
  <meta name="description" content="An image component displays visual content such as photographs, illustrations, or diagrams within an interface. The Image component provides a headless wrapper that ensures proper accessibility through required alt text. For a caption, put it in a figure with a caption." />
</svelte:head>

<article class="component-page component-page-intro prose" style="max-width: 64rem; margin: 0 auto; padding: 0.5rem 1rem 1rem;">
  {@html intro}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show demo markup</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{demoHtml}</code></pre>
  </details>
  {#each variants as variant (variant.title)}
    <h3 style="margin-top: 1.5rem;">{variant.title}</h3>
    <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html variant.html}</div>
    <details style="margin-top: 0.5rem;">
      <summary style="cursor: pointer; font-weight: 600;">Show markup</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{variant.html}</code></pre>
    </details>
  {/each}
  {#if usageCode}
    <details style="margin-top: 1.5rem;" open>
      <summary style="cursor: pointer; font-weight: 600;">Usage example</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{usageCode}</code></pre>
    </details>
  {/if}
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

{#if usage}
<article class="component-page component-page-usage prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html usage}
</article>
{/if}

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html rest}
</article>

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/image/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: image</li>
      <li>PascalCase: Image</li>
      <li>Description: an image element with alt text</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;img&gt;</li>
      <li>CSS class: .image</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>alt="..."</code> -- provides the accessible name for the image, required for all non-decorative images</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions — this is a passive element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>src</code>: string (required) -- the image source URL</li>
      <li><code>alt</code>: string (required) -- alternative text describing the image for screen readers and when the image fails to load</li>
      <li><code>loading</code>: "lazy" | "eager" (optional) -- controls the native browser loading behavior</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;img&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
