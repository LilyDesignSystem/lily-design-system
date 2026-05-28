<script lang="ts">
  const html: string = "<h1>Color Input</h1>\n\n<p>A color input wraps the native HTML <code>&lt;input type=\"color\"&gt;</code> element, providing a browser-native color picker with accessible labeling. The value is always a hex color string (e.g., \"#ff0000\"). This component is useful in settings panels, theme editors, or any interface where users need to select a color.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a native <code>&lt;input type=\"color\"&gt;</code> element for browser-native color picking</li>\n<li>Supports two-way binding of the hex color string</li>\n<li>Provides <code>aria-label</code> for screen reader accessibility since native color inputs have no visible label</li>\n<li>Supports <code>disabled</code>, <code>name</code>, and <code>id</code> for form integration</li>\n<li>Spreads <code>restProps</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>value</code>: string (default: <code>\"#000000\"</code>) -- current hex color string, two-way bindable via <code>value</code></li>\n<li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>\n<li><code>disabled</code>: boolean (default: <code>false</code>) -- whether the input is disabled</li>\n<li><code>name</code>: string (default: <code>undefined</code>) -- form field name</li>\n<li><code>id</code>: string (default: <code>undefined</code>) -- element ID</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;input&gt;</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;ColorInput label=\"Background color\" value={color} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- keyboard behavior is provided by the browser-native color input.</p>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label=\"...\"</code> -- provides an accessible name for the color input since it has no visible <code>&lt;label&gt;</code> element</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use when users need to select a colour value using the native browser colour picker.</li>\n<li>Use for theme customisation, settings panels, or design tool configuration.</li>\n<li>Use for simple hex colour selection where a full custom picker is unnecessary.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use when you need a custom colour palette -- use ColorPicker for a two-dimensional saturation and brightness board.</li>\n<li>Do not use for preset colour choices -- use RadioGroup or SegmentGroup with colour swatches, or a group of ColorPickerButton components.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless ColorInput component provides a native <code>&lt;input type=\"color\"&gt;</code> with <code>aria-label</code> for accessible naming, two-way binding on the hex value, and support for <code>disabled</code> and form attributes. The consumer provides all visual styling including the swatch display size, border treatment, and any surrounding label or helper text layout.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.color-input</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;input&gt;</code> element with class <code>color-input</code></li>\n<li>Verify aria-label=\"...\"<code> -- provides an accessible name for the color input since it has no visible </code>&lt;label&gt;` element</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Ensure the color swatch is large enough to be easily identifiable and clickable. Consider showing the hex value alongside the swatch for precision.</li>\n<li><strong>Developers</strong>: The value is always a 7-character hex string (e.g., \"#ff0000\"). Use the native color picker for broad browser support, and pair with a visible label element when needed.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>color-picker</code> — a two-dimensional board for picking colors by hue and saturation</li>\n<li><code>color-picker-button</code> — a button showing a color swatch in a color picker</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN <code>&lt;input type=\"color\"&gt;</code>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<label class=\"label\" for=\"demo-input\">Label</label><input class=\"color-input\" type=\"color\" id=\"demo-input\" aria-label=\"ColorInput\" />";
  const svelteSource: string = "// In your Svelte component:\nimport ColorInput from \"lily-design-system-svelte-headless/components/ColorInput/ColorInput.svelte\";\n\n<ColorInput label=\"Label\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Color Input — Lily Design System</title>
  <meta name="description" content="A color input wraps the native HTML &lt;input type=&quot;color&quot;&gt; element, providing a browser-native color picker with accessible labeling. The value is always a hex color string (e.g., &quot;#ff0000&quot;). This co..." />
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

