<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Numeric Rating Scale Picker</h1>\n<p>NumericRatingScalePicker is a headless 0 to 10 rating, such as a numeric pain rating scale: a <code>&lt;fieldset&gt;</code> whose <code>&lt;legend&gt;</code> names the question, one native radio per whole number, and the consumer&#39;s words for each end. Lily ships no anchor words and is not a validated instrument; the wording and its validation are the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;NumericRatingScalePicker\n  label=&quot;How bad is your pain now?&quot;\n  minLabel=&quot;No pain&quot;\n  maxLabel=&quot;Worst pain imaginable&quot;\n  name=&quot;pain&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) — the question, rendered as the <code>&lt;legend&gt;</code></li>\n<li><code>min</code>: number (optional) — the lowest value, default 0</li>\n<li><code>max</code>: number (optional) — the highest value, default 10</li>\n<li><code>minLabel</code>: string (optional) — the words for the lowest value</li>\n<li><code>maxLabel</code>: string (optional) — the words for the highest value</li>\n<li><code>value</code>: string (optional) — the chosen value (bindable or controlled)</li>\n<li><code>name</code>: string (optional) — the radios&#39; form name, default <code>rating</code></li>\n<li><code>required</code>: boolean (optional) — the form needs an answer</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves into the group, to the chosen radio or the first</td>\n</tr>\n<tr>\n<td>Arrow keys</td>\n<td>Move to the next or previous number and choose it</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li>A native <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>; each radio is named by its number; the end radios are described by the anchor words</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a 0 to 10 numeric rating, such as pain intensity, with anchor words at each end.</li>\n<li>Use where each number must be its own choice, reachable by keyboard.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a Net Promoter Score — use <code>net-promoter-score-picker</code>.</li>\n<li>Do not use for a face scale — faces need a licensed instrument; <code>five-face-rating-picker</code> is a satisfaction scale, not a pain scale.</li>\n<li>Do not use for a free number — use <code>number-input</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.numeric-rating-scale-picker</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.numeric-rating-scale-picker</code> and its parts.</p>\n<h2>Testing</h2>\n<ul>\n<li>The legend names the group, and there is one radio per number</li>\n<li>The end radios are described by the anchor words</li>\n<li>The arrow keys move and choose</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Use the exact wording of the instrument your service has validated, translated by the people who validated it.</li>\n<li>Do not colour the numbers from green to red; meaning must not be colour alone.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;fieldset class=&quot;numeric-rating-scale-picker&quot;&gt;</code> with a <code>&lt;legend&gt;</code>, and one radio per number from <code>min</code> (default 0) to <code>max</code> (default 10)</li>\n<li><code>minLabel</code> and <code>maxLabel</code> are shown and linked to the end radios with <code>aria-describedby</code></li>\n<li><code>required</code> makes the group need an answer (on the first radio, as native radio groups do)</li>\n<li>Form reset restores the first value</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>net-promoter-score-picker</code> — a picker for selecting a 0-10 Net Promoter Score</li>\n<li><code>radio-group</code> — a group of radio inputs</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Spec: spec/healthcare-ui/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"numeric-rating-scale-picker\"><legend class=\"numeric-rating-scale-picker-legend\">How bad is your pain now?</legend><span class=\"numeric-rating-scale-picker-min-label\" id=\"nrs-demo-min\">No pain</span><span class=\"numeric-rating-scale-picker-options\"><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"0\" aria-describedby=\"nrs-demo-min\"> 0</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"1\"> 1</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"2\"> 2</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"3\"> 3</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"4\"> 4</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"5\"> 5</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"6\"> 6</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"7\"> 7</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"8\"> 8</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"9\"> 9</label><label class=\"numeric-rating-scale-picker-option\"><input type=\"radio\" name=\"pain\" value=\"10\" aria-describedby=\"nrs-demo-max\"> 10</label></span><span class=\"numeric-rating-scale-picker-max-label\" id=\"nrs-demo-max\">Worst pain imaginable</span></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport NumericRatingScalePicker from \"lily-design-system-svelte-headless/components/NumericRatingScalePicker/NumericRatingScalePicker.svelte\";\n\n<NumericRatingScalePicker>\n  <!-- content -->\n</NumericRatingScalePicker>\n";
  const usageCode: string = "<NumericRatingScalePicker\n  label=\"How bad is your pain now?\"\n  minLabel=\"No pain\"\n  maxLabel=\"Worst pain imaginable\"\n  name=\"pain\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>NumericRatingScalePicker — Lily Design System</title>
  <meta name="description" content="NumericRatingScalePicker is a headless 0 to 10 rating, such as a numeric pain rating scale: a &lt;fieldset&gt; whose &lt;legend&gt; names the question, one native radio per whole number, and the consumer's words for each end. Lily ships no anchor words and is not a validated instrument; the wording and its v…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/numeric-rating-scale-picker/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: numeric-rating-scale-picker</li>
      <li>PascalCase: NumericRatingScalePicker</li>
      <li>Description: a picker for a 0 to 10 rating, such as pain, with the consumer's words at each end</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .numeric-rating-scale-picker</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>A native <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>; each radio is named by its number; the end radios are described by the anchor words</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves into the group, to the chosen radio or the first; the arrow keys move and choose (native radios)</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) — the question, rendered as the <code>&lt;legend&gt;</code></li>
      <li><code>min</code>: number (optional) — the lowest value, default 0</li>
      <li><code>max</code>: number (optional) — the highest value, default 10</li>
      <li><code>minLabel</code>: string (optional) — the words for the lowest value</li>
      <li><code>maxLabel</code>: string (optional) — the words for the highest value</li>
      <li><code>value</code>: string (optional) — the chosen value (bindable or controlled)</li>
      <li><code>name</code>: string (optional) — the radios' form name, default <code>rating</code></li>
      <li><code>required</code>: boolean (optional) — the form needs an answer</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
