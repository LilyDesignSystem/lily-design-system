<script lang="ts">
  const html: string = "<h1>MockupPhoneLandscape</h1>\n\n<p>A box area that looks like a mobile phone in landscape orientation.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> element with class <code>mockup-phone-landscape</code></li>\n<li>Accepts a <code>children</code> slot for the screen content rendered inside the device frame</li>\n<li>Companion to <code>MockupPhonePortrait</code> for portrait orientation</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;div&gt;</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>className</code>: string (optional) — extra CSS classes appended to <code>mockup-phone-landscape</code></li>\n<li><code>children</code>: slot — content rendered inside the simulated phone screen</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;MockupPhoneLandscape&gt;\n  &lt;img src=\"screenshot-landscape.png\" alt=\"App screen\" /&gt;\n&lt;/MockupPhoneLandscape&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive decorative container</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>No specific ARIA — decorative wrapper. Apply <code>role=\"img\"</code> on the inner image if needed</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>In marketing pages, documentation, or component galleries to frame a screenshot or video as a horizontally-held phone — useful for video, games, or split-screen UI.</li>\n<li>When a portrait frame would crop or distort wide content; the landscape frame preserves the wide aspect ratio.</li>\n<li>Alongside <code>MockupPhonePortrait</code> to show both orientations of the same app or screen.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use to frame portrait-oriented screenshots — use <code>MockupPhonePortrait</code>.</li>\n<li>Do not use to render an actual interactive device frame — this is a decorative wrapper, not a viewport emulator.</li>\n<li>Do not use for tablet content — use <code>MockupTabletLandscape</code> or <code>MockupTabletPortrait</code>.</li>\n<li>Do not use for desktop browser screenshots — use <code>MockupBrowser</code> or <code>MockupWindow</code>.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML. The consumer provides all visual styling. No CSS, animations, or layout are included — the consumer composes those.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.mockup-phone-landscape</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>mockup-browser</code> — a box area that looks like a web browser</li>\n<li><code>mockup-laptop</code> — a box area that looks like a laptop computer</li>\n<li><code>mockup-phone-portrait</code> — a box area that looks like a mobile phone</li>\n<li><code>mockup-shell</code> — a box area that looks like a terminal shell</li>\n<li><code>mockup-tablet-landscape</code> — a box area that looks like a tablet computer in landscape mode</li>\n<li><code>mockup-tablet-portrait</code> — a box area that looks like a tablet computer in portrait mode</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Documentation: index.md</li>\n<li>CSS class: <code>.mockup-phone-landscape</code> in css-style-sheet-template.css</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"mockup-phone-landscape\" role=\"img\" aria-label=\"App screen mockup\"><div style=\"padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:12px;text-align:center;min-height:80px;\">MockupPhoneLandscape Preview</div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport MockupPhoneLandscape from \"lily-design-system-svelte-headless/components/MockupPhoneLandscape/MockupPhoneLandscape.svelte\";\n\n<MockupPhoneLandscape>\n  <!-- content -->\n</MockupPhoneLandscape>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MockupPhoneLandscape — Lily Design System</title>
  <meta name="description" content="A box area that looks like a mobile phone in landscape orientation." />
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

