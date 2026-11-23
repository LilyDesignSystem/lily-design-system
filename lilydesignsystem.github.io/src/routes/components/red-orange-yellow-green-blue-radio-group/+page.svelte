<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Red Orange Yellow Green Blue Radio Group</h1>\n<p>RedOrangeYellowGreenBlueRadioGroup is a headless <code>&lt;fieldset role=&quot;radiogroup&quot;&gt;</code> for choosing a five-level colour status, holding the <code>RedOrangeYellowGreenBlueRadioInput</code> radios the consumer composes, with whatever labels and layout the consumer writes. It replaces the earlier <code>red-orange-yellow-green-blue-picker</code> (removed 2026-11-15).</p>\n<p><strong>Status:</strong> experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;RedOrangeYellowGreenBlueRadioGroup label=&quot;Risk level&quot;&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;red&quot;\n    label=&quot;Severe&quot;\n    name=&quot;status&quot;\n  /&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;orange&quot;\n    label=&quot;High&quot;\n    name=&quot;status&quot;\n  /&gt;\n  &lt;RedOrangeYellowGreenBlueRadioInput\n    value=&quot;yellow&quot;\n    label=&quot;Moderate&quot;\n    name=&quot;status&quot;\n    checked\n  /&gt;\n&lt;/RedOrangeYellowGreenBlueRadioGroup&gt;\n</code></pre>\n<p>It renders:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;fieldset\n  class=&quot;red-orange-yellow-green-blue-radio-group&quot;\n  role=&quot;radiogroup&quot;\n  aria-label=&quot;Risk level&quot;\n&gt;\n  &lt;input\n    class=&quot;red-orange-yellow-green-blue-radio-input&quot;\n    type=&quot;radio&quot;\n    aria-label=&quot;Severe&quot;\n    name=&quot;status&quot;\n    value=&quot;red&quot;\n    data-value=&quot;red&quot;\n  /&gt;\n  …\n&lt;/fieldset&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) -- accessible name for the group</li>\n<li><code>children</code>: slot (required) -- the <code>RedOrangeYellowGreenBlueRadioInput</code> elements</li>\n<li><code>...restProps</code>: any additional HTML attributes spread onto the fieldset</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Tab: focus the checked radio, or the first if none is checked</li>\n<li>ArrowDown / ArrowRight: move to and check the next radio</li>\n<li>ArrowUp / ArrowLeft: move to and check the previous radio</li>\n<li>Space: check the focused radio</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;radiogroup&quot;</code> on the <code>&lt;fieldset&gt;</code>, named by <code>aria-label</code></li>\n<li>Each radio is named by its own <code>label</code>, so a status or rating is never shown by colour alone (WCAG 1.4.1)</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when the consumer wants to lay out, order or label the options themselves, for example with a visible <code>&lt;label&gt;</code> beside each radio.</li>\n<li>Use inside a form, where the native radios submit the chosen value under one <code>name</code>.</li>\n<li>Use when a form reset must restore the starting choice without any script.</li>\n<li>Use when the options need extra content between them, such as a description under each one.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use when more than one option may be chosen -- use <a href=\"../checkbox-group/\">CheckboxGroup</a> instead.</li>\n<li>Do not use for a read-only display -- use <a href=\"../red-orange-yellow-green-blue-view/\">RedOrangeYellowGreenBlueView</a> instead.</li>\n<li>Do not use for a plain set of choices with no status or rating meaning -- use <a href=\"../radio-group/\">RadioGroup</a> instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>The RedOrangeYellowGreenBlueRadioGroup headless component provides a <code>&lt;fieldset&gt;</code> with <code>role=&quot;radiogroup&quot;</code> and <code>aria-label</code>. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any colour coding.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.red-orange-yellow-green-blue-radio-group</code> class for targeting; each radio carries <code>.red-orange-yellow-green-blue-radio-input</code> and <code>data-value</code>. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;fieldset&gt;</code> element with class <code>red-orange-yellow-green-blue-radio-group</code> and <code>role=&quot;radiogroup&quot;</code></li>\n<li>Verify the group is named by <code>aria-label</code></li>\n<li>Verify the consumer&#39;s radios render inside it</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Give every option visible text as well as its colour or icon; colour alone fails people with colour vision deficiencies.</li>\n<li><strong>Developers</strong>: Give every <code>RedOrangeYellowGreenBlueRadioInput</code> the same <code>name</code>, so the browser treats them as one group for the arrow keys and form submission.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;fieldset&gt;</code> with <code>role=&quot;radiogroup&quot;</code> and <code>aria-label</code></li>\n<li>The consumer supplies one <code>RedOrangeYellowGreenBlueRadioInput</code> per value (<code>red</code>, <code>orange</code>, <code>yellow</code>, <code>green</code>, <code>blue</code>); the group renders no option text of its own</li>\n<li>Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state</li>\n<li>Spreads <code>restProps</code> onto the fieldset, so <code>disabled</code>, <code>id</code> or <code>data-*</code> pass through</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>red-orange-yellow-green-blue-radio-input</code> — a radio input for one choice of a five-level color status &lt;input type=\"radio\"&gt;</li>\n<li><code>red-orange-yellow-green-blue-view</code> — the read-only display</li>\n<li><code>radio-group</code> — the general radio group</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Radio Group Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/radio/\">https://www.w3.org/WAI/ARIA/apg/patterns/radio/</a></li>\n<li>Traffic Light Rating System: <a href=\"https://en.wikipedia.org/wiki/Traffic_light_rating_system\">https://en.wikipedia.org/wiki/Traffic_light_rating_system</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"red-orange-yellow-green-blue-radio-group\" role=\"radiogroup\" aria-label=\"Risk level\"><label class=\"label\" for=\"demo-red-orange-yellow-green-blue-g-0\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-g-0\" name=\"demo-risk\" aria-label=\"Severe\" value=\"red\" data-value=\"red\" /> Severe</label><label class=\"label\" for=\"demo-red-orange-yellow-green-blue-g-1\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-g-1\" name=\"demo-risk\" aria-label=\"High\" value=\"orange\" data-value=\"orange\" /> High</label><label class=\"label\" for=\"demo-red-orange-yellow-green-blue-g-2\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-g-2\" name=\"demo-risk\" aria-label=\"Moderate\" value=\"yellow\" data-value=\"yellow\" checked /> Moderate</label><label class=\"label\" for=\"demo-red-orange-yellow-green-blue-g-3\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-g-3\" name=\"demo-risk\" aria-label=\"Low\" value=\"green\" data-value=\"green\" /> Low</label><label class=\"label\" for=\"demo-red-orange-yellow-green-blue-g-4\"><input class=\"red-orange-yellow-green-blue-radio-input\" type=\"radio\" id=\"demo-red-orange-yellow-green-blue-g-4\" name=\"demo-risk\" aria-label=\"Minimal\" value=\"blue\" data-value=\"blue\" /> Minimal</label></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport RedOrangeYellowGreenBlueRadioGroup from \"lily-design-system-svelte-headless/components/RedOrangeYellowGreenBlueRadioGroup/RedOrangeYellowGreenBlueRadioGroup.svelte\";\n\n<RedOrangeYellowGreenBlueRadioGroup>\n  <!-- content -->\n</RedOrangeYellowGreenBlueRadioGroup>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import RedOrangeYellowGreenBlueRadioGroup from \"./RedOrangeYellowGreenBlueRadioGroup.svelte\";\n<\/script>\n\n<RedOrangeYellowGreenBlueRadioGroup label=\"Size\">\n  <label\n    ><input\n      type=\"radio\"\n      name=\"size\"\n      value=\"s\"\n    /> Small</label\n  >\n  <label\n    ><input\n      type=\"radio\"\n      name=\"size\"\n      value=\"m\"\n    /> Medium</label\n  >\n  <label\n    ><input\n      type=\"radio\"\n      name=\"size\"\n      value=\"l\"\n    /> Large</label\n  >\n</RedOrangeYellowGreenBlueRadioGroup>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Red Orange Yellow Green Blue Radio Group — Lily Design System</title>
  <meta name="description" content="RedOrangeYellowGreenBlueRadioGroup is a headless &lt;fieldset role=&quot;radiogroup&quot;&gt; for choosing a five-level colour status, holding the RedOrangeYellowGreenBlueRadioInput radios the consumer composes, with whatever labels and layout the consumer writes. It replaces the earlier red-orange-yellow-green-…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/red-orange-yellow-green-blue-radio-group/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: red-orange-yellow-green-blue-radio-group</li>
      <li>PascalCase: RedOrangeYellowGreenBlueRadioGroup</li>
      <li>Description: a fieldset radio group for selecting a five-level color status</li>
      <li>Purpose: Asks for one of five coloured statuses, each named in words.</li>
      <li>Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .red-orange-yellow-green-blue-radio-group</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="radiogroup"</code> -- on the <code>&lt;fieldset&gt;</code>, identifies the group as a set of radio buttons</li>
      <li><code>aria-label=&#123;label&#125;</code> -- the group's accessible name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab: focus the checked radio, or the first if none is checked</li>
      <li>ArrowDown / ArrowRight: move to and check the next radio</li>
      <li>ArrowUp / ArrowLeft: move to and check the previous radio</li>
      <li>Space: check the focused radio</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- accessible name for the group, applied via <code>aria-label</code></li>
      <li><code>children</code>: slot (required) -- the <code>RedOrangeYellowGreenBlueRadioInput</code> elements</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the fieldset</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
