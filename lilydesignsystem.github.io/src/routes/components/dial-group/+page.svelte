<script lang="ts">
  const html: string = "<h1>DialGroup</h1>\n\n<p>A dial group is a container for multiple dial components, providing semantic grouping for related rotary controls. Dial groups are used when several dials need to be presented and operated together, such as audio mixing controls or multi-parameter adjustments.</p>\n\n<p>This headless component uses a <code>&lt;div&gt;</code> element with <code>role=\"group\"</code> and an <code>aria-label</code> to provide accessible grouping semantics for the contained dial components.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;div&gt;</code> element with <code>role=\"group\"</code> to semantically group dials</li>\n<li><code>aria-label</code> describes the group purpose</li>\n<li>Renders child dial components in source order</li>\n<li>Consumer controls layout and spacing via CSS</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (required) -- accessible label for the dial group</li>\n<li><code>children</code>: slot -- dial components</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Audio mixer with volume, bass, and treble controls:</p>\n\n<pre><code class=\"language-html\">&lt;DialGroup label=\"Audio controls\"&gt;\n  &lt;Dial label=\"Volume\" value={volume} min={0} max={100} /&gt;\n  &lt;Dial label=\"Bass\" value={bass} min={0} max={100} /&gt;\n  &lt;Dial label=\"Treble\" value={treble} min={0} max={100} /&gt;\n&lt;/DialGroup&gt;</code></pre>\n\n<p>HVAC control panel:</p>\n\n<pre><code class=\"language-html\">&lt;DialGroup label=\"Climate controls\"&gt;\n  &lt;Dial label=\"Temperature\" value={temperature} min={16} max={30} step={0.5} /&gt;\n  &lt;Dial label=\"Fan speed\" value={fanSpeed} min={1} max={5} /&gt;\n&lt;/DialGroup&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None at the group level -- individual dials handle their own keyboard interactions</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"group\"</code> -- semantically groups the contained dials</li>\n<li><code>aria-label</code> -- describes the purpose of the group</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to group multiple dial controls together, such as an audio mixer or multi-parameter control panel.</li>\n<li>Use when multiple dials share a common purpose and should be perceived as a group by assistive technology.</li>\n<li>Use for equalizer interfaces, multi-channel audio controls, or multi-axis configuration panels.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for a single dial -- render Dial directly without a group wrapper.</li>\n<li>Do not use for linear slider groups -- use multiple Slider components instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides <code>role=\"group\"</code> with <code>aria-label</code> for accessible grouping, with zero visual styling. The consumer is responsible for all CSS including layout direction, spacing, alignment, and responsive behavior.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.dial-group</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>dial-group</code></li>\n<li>Verify <code>role=\"group\"</code> is present</li>\n<li>Verify <code>aria-label</code> is applied</li>\n<li>Verify child dial components are rendered</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Arrange dials in a logical order that reflects their relationship. Use consistent sizing and spacing within the group.</li>\n<li><strong>Developers</strong>: Always provide a descriptive <code>label</code> prop that conveys the group's purpose to screen readers.</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>DialGroup is a container for Dial components.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>dial</code> — a rotary dial control for selecting a value</li>\n<li><code>slider</code> — a draggable control for selecting a value along a track</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div\">MDN div element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"dial-group\"><div class=\"dial\" role=\"slider\" aria-valuenow=\"30\" aria-label=\"Bass\">30</div><div class=\"dial\" role=\"slider\" aria-valuenow=\"70\" aria-label=\"Treble\">70</div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport DialGroup from \"lily-design-system-svelte-headless/components/DialGroup/DialGroup.svelte\";\n\n<DialGroup>\n  <!-- list children -->\n</DialGroup>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>DialGroup — Lily Design System</title>
  <meta name="description" content="A dial group is a container for multiple dial components, providing semantic grouping for related rotary controls. Dial groups are used when several dials need to be presented and operated together..." />
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

