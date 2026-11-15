<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Red Orange Yellow Green Blue Radio Input</h1>\n<p>RedOrangeYellowGreenBlueRadioInput is a headless native <code>&lt;input type=&quot;radio&quot;&gt;</code> for one choice of a five-level colour status, used inside a <a href=\"../red-orange-yellow-green-blue-radio-group/\">RedOrangeYellowGreenBlueRadioGroup</a>. It is the radio counterpart of <a href=\"../red-orange-yellow-green-blue-picker-button/\">RedOrangeYellowGreenBluePickerButton</a>: where the picker button is a toggle <code>&lt;button&gt;</code> with <code>aria-pressed</code>, this is a real radio, so the group gets native arrow keys, form submission and form reset.</p>\n<p><strong>Status:</strong> experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;RedOrangeYellowGreenBlueRadioGroup label=&quot;Risk level&quot;&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;red&quot;\n    label=&quot;Severe&quot;\n    name=&quot;status&quot;\n  /&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;orange&quot;\n    label=&quot;High&quot;\n    name=&quot;status&quot;\n  /&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;yellow&quot;\n    label=&quot;Moderate&quot;\n    name=&quot;status&quot;\n    checked\n  /&gt;\n&lt;/RedOrangeYellowGreenBlueRadioGroup&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (required) -- the status or rating this radio stands for (<code>red</code>, <code>orange</code>, <code>yellow</code>, <code>green</code>, <code>blue</code>), also exposed as <code>data-value</code></li>\n<li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>\n<li><code>name</code>: string (default: <code>undefined</code>) -- radio group name</li>\n<li><code>checked</code>: boolean (default: <code>false</code>) -- whether this radio starts checked</li>\n<li><code>disabled</code>: boolean (default: <code>false</code>) -- whether this radio is disabled</li>\n<li><code>...restProps</code>: any additional HTML attributes spread onto the input</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Tab: focus the checked radio in the group, or the first if none is checked</li>\n<li>ArrowDown / ArrowRight: move to and check the next radio</li>\n<li>ArrowUp / ArrowLeft: move to and check the previous radio</li>\n<li>Space: check the focused radio</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> names the radio; the native radio role and checked state need no ARIA</li>\n<li>The label carries the option&#39;s words, so the choice is never colour or an icon alone (WCAG 1.4.1)</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside a <code>RedOrangeYellowGreenBlueRadioGroup</code>, one radio per value.</li>\n<li>Use when a form must submit the chosen value without script.</li>\n<li>Use when consumer CSS should draw each option from <code>data-value</code>.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use as a toggle outside a radio group -- use <a href=\"../red-orange-yellow-green-blue-picker-button/\">RedOrangeYellowGreenBluePickerButton</a> instead.</li>\n<li>Do not use when a ready-made group is enough -- use <a href=\"../red-orange-yellow-green-blue-picker/\">RedOrangeYellowGreenBluePicker</a>, which renders its own radios.</li>\n<li>Do not use for an option with no status or rating meaning -- use <a href=\"../radio-input/\">RadioInput</a> instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>The RedOrangeYellowGreenBlueRadioInput headless component renders a native radio with <code>aria-label</code> and <code>data-value</code>. The consumer provides all visual styling.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.red-orange-yellow-green-blue-radio-input</code> class for targeting; style each option with <code>[data-value]</code>. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders an <code>&lt;input type=&quot;radio&quot;&gt;</code> with class <code>red-orange-yellow-green-blue-radio-input</code></li>\n<li>Verify <code>aria-label</code>, <code>name</code>, <code>checked</code> and <code>disabled</code></li>\n<li>Verify <code>data-value</code> matches the value</li>\n<li>Verify Tab reaches it and Space checks it</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Pair every colour or icon with words; colour alone is not enough.</li>\n<li><strong>Developers</strong>: Give every radio in the group the same <code>name</code>, and a visible <code>&lt;label&gt;</code> where the layout allows one.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a native <code>&lt;input type=&quot;radio&quot;&gt;</code> with <code>aria-label</code></li>\n<li>Sets <code>data-value</code> to its value, so consumer CSS can colour or draw each option (<code>.red-orange-yellow-green-blue-radio-input[data-value=&quot;red&quot;]</code>)</li>\n<li>No two-way binding: the checked state is the browser&#39;s, and <code>checked</code> sets where it starts</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>red-orange-yellow-green-blue-radio-group</code> — a fieldset radio group for selecting a five-level color status</li>\n<li><code>red-orange-yellow-green-blue-picker-button</code> — the toggle-button counterpart</li>\n<li><code>radio-input</code> — the general radio input</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Radio Group Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/radio/\">https://www.w3.org/WAI/ARIA/apg/patterns/radio/</a></li>\n<li>MDN input type=&quot;radio&quot;: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<label class=\"label\" for=\"demo-red-orange-yellow-green-blue-i-0\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-i-0\" name=\"demo-risk\" aria-label=\"Moderate\" value=\"yellow\" data-value=\"yellow\" checked /> Moderate</label>";
  const svelteSource: string = "// In your Svelte component:\nimport RedOrangeYellowGreenBlueRadioInput from \"lily-design-system-svelte-headless/components/RedOrangeYellowGreenBlueRadioInput/RedOrangeYellowGreenBlueRadioInput.svelte\";\n\n<RedOrangeYellowGreenBlueRadioInput>\n  <!-- content -->\n</RedOrangeYellowGreenBlueRadioInput>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import RedOrangeYellowGreenBlueRadioInput from \"./RedOrangeYellowGreenBlueRadioInput.svelte\";\n<\/script>\n\n<RedOrangeYellowGreenBlueRadioInput\n  label=\"Option A\"\n  name=\"choice\"\n  value=\"a\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Red Orange Yellow Green Blue Radio Input — Lily Design System</title>
  <meta name="description" content="RedOrangeYellowGreenBlueRadioInput is a headless native &lt;input type=&quot;radio&quot;&gt; for one choice of a five-level colour status, used inside a RedOrangeYellowGreenBlueRadioGroup. It is the radio counterpart of RedOrangeYellowGreenBluePickerButton: where the picker button is a toggle &lt;button&gt; with aria-…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/red-orange-yellow-green-blue-radio-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: red-orange-yellow-green-blue-radio-input</li>
      <li>PascalCase: RedOrangeYellowGreenBlueRadioInput</li>
      <li>Description: a radio input for one choice of a five-level color status &lt;input type="radio"&gt;</li>
      <li>Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;input&gt;</li>
      <li>CSS class: .red-orange-yellow-green-blue-radio-input</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label=&#123;label&#125;</code> -- the radio's accessible name, the option's words, so meaning is never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>**Tab**: Moves focus to the checked radio in the group (or the first if none is checked)</li>
      <li>**Arrow Up / Arrow Left**: Moves to and checks the previous radio in the group</li>
      <li>**Arrow Down / Arrow Right**: Moves to and checks the next radio in the group</li>
      <li>**Space**: Checks the focused radio</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (required) -- the status or rating this radio stands for (<code>red</code>, <code>orange</code>, <code>yellow</code>, <code>green</code>, <code>blue</code>), also exposed as <code>data-value</code></li>
      <li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>
      <li><code>name</code>: string (default: <code>undefined</code>) -- radio group name</li>
      <li><code>checked</code>: boolean (default: <code>false</code>) -- whether this radio starts checked</li>
      <li><code>disabled</code>: boolean (default: <code>false</code>) -- whether this radio is disabled</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the input</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
