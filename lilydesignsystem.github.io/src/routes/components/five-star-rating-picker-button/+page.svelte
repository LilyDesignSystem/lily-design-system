<script lang="ts">
  const html: string = "<h1>Five Star Rating Picker Button</h1>\n\n<p>A five-star rating picker button is an individual button within a FiveStarRatingPicker that represents one star level on a 1-5 scale. When clicked, it selects that star rating value. The component uses <code>aria-pressed</code> to indicate the currently selected state, making it accessible to screen readers and keyboard users.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders as a <code>&lt;button&gt;</code> element with <code>aria-pressed</code> for toggle state</li>\n<li>Designed to be used inside a FiveStarRatingPicker component</li>\n<li>Each button represents one of five star levels (1-5)</li>\n<li>The <code>selected</code> prop controls <code>aria-pressed</code> to indicate the active selection</li>\n<li>The <code>label</code> prop provides the accessible name via <code>aria-label</code> (e.g., \"1 star\", \"3 stars\")</li>\n<li>Spreads <code>...restProps</code> onto the <code>&lt;button&gt;</code> element for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>value</code>: string (required) -- the star rating value this button represents (e.g., \"1\", \"2\", \"3\", \"4\", \"5\")</li>\n<li><code>selected</code>: boolean (default: false) -- whether this button is currently selected</li>\n<li><code>label</code>: string (required) -- accessible label for the button (e.g., \"1 star\", \"2 stars\", \"5 stars\")</li>\n<li><code>onclick</code>: callback -- handler called when the button is clicked</li>\n<li><code>...restProps</code>: any -- additional HTML attributes spread onto the <code>&lt;button&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;FiveStarRatingPicker label=\"Rate this product\"&gt;\n    &lt;FiveStarRatingPickerButton value=\"1\" label=\"1 star\" onclick={handleClick} /&gt;\n    &lt;FiveStarRatingPickerButton value=\"2\" label=\"2 stars\" onclick={handleClick} /&gt;\n    &lt;FiveStarRatingPickerButton value=\"3\" label=\"3 stars\" selected onclick={handleClick} /&gt;\n    &lt;FiveStarRatingPickerButton value=\"4\" label=\"4 stars\" onclick={handleClick} /&gt;\n    &lt;FiveStarRatingPickerButton value=\"5\" label=\"5 stars\" onclick={handleClick} /&gt;\n&lt;/FiveStarRatingPicker&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab: Focus the button</li>\n<li>Enter / Space: Activate the button to select this rating</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-pressed</code> -- indicates whether this button is the currently selected rating (<code>true</code> when selected, <code>false</code> otherwise)</li>\n<li><code>aria-label</code> -- provides the accessible name for the button (e.g., \"3 stars\")</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use inside FiveStarRatingPicker to represent one star level in the rating scale.</li>\n<li>Use when each star needs individual styling, icons, or interactive behavior.</li>\n<li>Use to provide custom star shapes, colors, or hover effects for each level.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use outside of a FiveStarRatingPicker -- it requires the parent picker for group semantics.</li>\n<li>Do not use as a standalone toggle button -- use ToggleButton instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a <code>&lt;button&gt;</code> with <code>aria-pressed</code> and <code>aria-label</code> for accessible toggle state. The consumer provides all visual styling including star icons, colors, sizing, and pressed/unpressed visual states.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.five-star-rating-picker-button</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;button&gt;</code> element with class <code>five-star-rating-picker-button</code></li>\n<li>Verify aria-label` -- provides the accessible name for the button (e.g., \"3 stars\")</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Ensure the pressed and unpressed states are visually distinct, with sufficient color contrast for both states. Consider animation on press.</li>\n<li><strong>Developers</strong>: Always provide a descriptive <code>label</code> prop (e.g., \"3 stars\") so screen readers announce the rating level clearly.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>five-star-rating-picker</code> — a picker for selecting a 1-5 star rating using radio buttons</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<button class=\"five-star-rating-picker-button\" role=\"radio\" aria-checked=\"false\">★</button>";
  const svelteSource: string = "// In your Svelte component:\nimport FiveStarRatingPickerButton from \"lily-design-system-svelte-headless/components/FiveStarRatingPickerButton/FiveStarRatingPickerButton.svelte\";\n\n<FiveStarRatingPickerButton>FiveStarRatingPickerButton</FiveStarRatingPickerButton>\n";
  const usageCode: string = "<script lang=\"ts\">\n    import FiveStarRatingPickerButton from \"./FiveStarRatingPickerButton.svelte\";\n    let rating = $state(0);\n    const stars = [\n        { value: 1, label: \"1 star\" },\n        { value: 2, label: \"2 stars\" },\n        { value: 3, label: \"3 stars\" },\n        { value: 4, label: \"4 stars\" },\n        { value: 5, label: \"5 stars\" },\n    ];\n<\/script>\n\n<div role=\"group\" aria-label=\"Rate this\">\n    {#each stars as s}\n        <FiveStarRatingPickerButton\n            value={s.value}\n            label={s.label}\n            selected={rating === s.value}\n            onclick={() => (rating = s.value)}\n        />\n    {/each}\n</div>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Five Star Rating Picker Button — Lily Design System</title>
  <meta name="description" content="A five-star rating picker button is an individual button within a FiveStarRatingPicker that represents one star level on a 1-5 scale. When clicked, it selects that star rating value. The component ..." />
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

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/five-star-rating-picker-button/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: five-star-rating-picker-button</li>
      <li>PascalCase: FiveStarRatingPickerButton</li>
      <li>Description: a picker button for selecting a 1-5 star rating using radio buttons</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;button&gt;</li>
      <li>CSS class: .five-star-rating-picker-button</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-pressed</code> -- indicates whether this button is the currently selected rating (<code>true</code> when selected, <code>false</code> otherwise)</li>
      <li><code>aria-label</code> -- provides the accessible name for the button (e.g., "3 stars")</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab: Focus the button</li>
      <li>Enter / Space: Activate the button to select this rating</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (required) -- the star rating value this button represents (e.g., "1", "2", "3", "4", "5")</li>
      <li><code>selected</code>: boolean (default: false) -- whether this button is currently selected</li>
      <li><code>label</code>: string (required) -- accessible label for the button (e.g., "1 star", "2 stars", "5 stars")</li>
      <li><code>onclick</code>: callback -- handler called when the button is clicked</li>
      <li><code>...restProps</code>: any -- additional HTML attributes spread onto the <code>&lt;button&gt;</code> element</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
