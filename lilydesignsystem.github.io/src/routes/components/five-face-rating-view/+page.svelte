<script lang="ts">
  const html: string = "<h1>Five Face Rating View</h1>\n\n<p>A read-only five-face rating display that shows a text label corresponding to a rating value from 1 to 5. This is the display-only companion to FiveFaceRatingInput, used for showing previously submitted ratings in summaries, review lists, or dashboard displays.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;span&gt;</code> with <code>role=\"img\"</code> to indicate it represents a visual rating</li>\n<li>Uses derived value to look up the face label from the <code>labels</code> array based on the <code>value</code></li>\n<li>Exposes <code>data-value</code> attribute for consumer CSS or testing</li>\n<li>Default labels are \"Very bad\", \"Bad\", \"Okay\", \"Good\", \"Very good\" -- customizable via the <code>labels</code> prop</li>\n<li>Spreads <code>restProps</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>value</code>: number (required) -- rating value (1-5) to display</li>\n<li><code>label</code>: string (required) -- accessible description via <code>aria-label</code></li>\n<li><code>labels</code>: string[] (default: <code>[\"Very bad\", \"Bad\", \"Okay\", \"Good\", \"Very good\"]</code>) -- text labels for each face</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;span&gt;</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;FiveFaceRatingView value={4} label=\"Patient satisfaction: Good\" /&gt;</code></pre>\n\n<p>In a feedback summary:</p>\n\n<pre><code class=\"language-html\">&lt;SummaryList label=\"Survey results\"&gt;\n    &lt;SummaryListItem&gt;\n        &lt;dt&gt;Satisfaction&lt;/dt&gt;\n        &lt;dd&gt;&lt;FiveFaceRatingView value={3} label=\"Satisfaction rating: Okay\" /&gt;&lt;/dd&gt;\n    &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- this component is a passive, read-only display.</p>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"img\"</code> -- indicates the span represents a visual/graphic element (the face rating)</li>\n<li><code>aria-label=\"...\"</code> -- provides an accessible description of the rating for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display a previously submitted satisfaction rating as a text label in review summaries, dashboards, or feedback lists.</li>\n<li>Use when the rating should be read-only and not editable by the user.</li>\n<li>Use in patient feedback reports or satisfaction survey results.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when the user needs to select or change a rating -- use FiveFaceRatingPicker instead.</li>\n<li>Do not use for star-based display -- use FiveStarRatingView instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides semantic HTML with <code>role=\"img\"</code> and <code>aria-label</code> for accessible read-only rating display. The consumer provides all visual styling, including typography, colors, and any face/emoji iconography.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.five-face-rating-view</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>five-face-rating-view</code></li>\n<li>Verify role=\"img\"` -- indicates the span represents a visual/graphic element (the face rating)</li>\n<li>Verify aria-label=\"...\"` -- provides an accessible description of the rating for screen readers</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Ensure the visual treatment clearly communicates that this is a display-only element, not an interactive control. Use color or iconography that matches the rating sentiment.</li>\n<li><strong>Developers</strong>: Pair this component with FiveFaceRatingPicker for edit scenarios. Customize the <code>labels</code> prop when the default face labels do not match your application's rating scale.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>five-face-rating-picker</code> — a picker for selecting a 1-5 satisfaction rating using face labels</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA <code>img</code> role: https://www.w3.org/WAI/ARIA/apd/roles/img/</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"five-face-rating-view\" role=\"img\" aria-label=\"Satisfied\">\ud83d\ude0a</span>";
  const svelteSource: string = "// In your Svelte component:\nimport FiveFaceRatingView from \"lily-design-system-svelte-headless/components/FiveFaceRatingView/FiveFaceRatingView.svelte\";\n\n<FiveFaceRatingView label=\"Label\" value=\"Sample value\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Five Face Rating View — Lily Design System</title>
  <meta name="description" content="A read-only five-face rating display that shows a text label corresponding to a rating value from 1 to 5. This is the display-only companion to FiveFaceRatingInput, used for showing previously subm..." />
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

