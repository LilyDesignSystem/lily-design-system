<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Quantity Input Div</h1>\n<p>QuantityInputDiv is a headless input for a quantity: a number and its unit, such as a weight in kilograms or pounds. It renders a labelled group holding a number input and a unit <code>&lt;select&gt;</code>, and each unit carries its own limits, so &quot;0 to 300 kg&quot; and &quot;0 to 660 lb&quot; are both enforced by the browser. It converts nothing.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;QuantityInputDiv\n  label=&quot;Weight&quot;\n  magnitudeLabel=&quot;Amount&quot;\n  unitLabel=&quot;Unit&quot;\n  name=&quot;weight&quot;\n  units={[\n    { value: &quot;kg&quot;, label: &quot;kilograms&quot;, min: 0, max: 300, step: 0.1 },\n    { value: &quot;[lb_av]&quot;, label: &quot;pounds&quot;, min: 0, max: 660, step: 0.1 },\n  ]}\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) — the group&#39;s name (&quot;Weight&quot;)</li>\n<li><code>magnitudeLabel</code>: string (required) — the number input&#39;s label (&quot;Amount&quot;)</li>\n<li><code>unitLabel</code>: string (required when there is more than one unit) — the unit select&#39;s label (&quot;Unit&quot;)</li>\n<li><code>units</code>: { value, label, min?, max?, step? }[] (required) — the units offered, in the consumer&#39;s words; the first is the default</li>\n<li><code>magnitude</code>: string (default &quot;&quot;) — the number as typed; two-way</li>\n<li><code>unit</code>: string (default: the first unit) — the unit chosen; two-way</li>\n<li><code>name</code>: string (optional) — base name for <code>{name}-magnitude</code> and <code>{name}-unit</code></li>\n<li><code>required</code>, <code>disabled</code>: boolean (default false)</li>\n<li><code>id</code>: string (optional) — base id</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves between the number and the unit</td>\n</tr>\n<tr>\n<td>Arrow keys</td>\n<td>Change the number by its step, or the unit, natively</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> with <code>aria-label</code> names the pair; each control has a visible <code>&lt;label for&gt;</code></li>\n<li>A single unit is linked to the number by <code>aria-describedby</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a measured quantity a person enters with its unit: a weight, a height, a dose, a volume.</li>\n<li>Use where the allowed range depends on the unit, so the limits follow the choice.</li>\n<li>Use with one unit to show the unit beside the number and submit it with the form.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a plain count with no unit — use <code>number-input</code>.</li>\n<li>Do not use to show a measured value — use <code>observation-view</code> or <code>measurement-instance-view</code>.</li>\n<li>Do not use to choose a unit system for a whole page — use <code>measurement-system-input</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.quantity-input-div</code> class hook and its <code>-magnitude</code> and <code>-unit</code> parts, and every word.</p>\n<h2>Styles</h2>\n<p><code>.quantity-input-div</code>, <code>.quantity-input-div-magnitude</code>, <code>.quantity-input-div-unit</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>The number takes the chosen unit&#39;s limits and keeps its value when the unit changes</li>\n<li>One unit is text linked by <code>aria-describedby</code>, with a hidden field</li>\n<li>The fields are named from <code>name</code>, and a form reset restores both values</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Use UCUM codes as unit values (<code>kg</code>, <code>[lb_av]</code>, <code>mmol/L</code>) and the reader&#39;s words as labels.</li>\n<li>Lily converts nothing: if the record needs one unit, convert in your code and say so to the reader.</li>\n<li>A browser&#39;s <code>type=&quot;number&quot;</code> does not accept a decimal comma everywhere; for a locale that writes one, see the healthcare guide&#39;s formatted-number pattern.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;div class=&quot;quantity-input-div&quot; role=&quot;group&quot; aria-label&gt;</code> with a labelled <code>&lt;input type=&quot;number&quot; class=&quot;quantity-input-div-magnitude&quot; inputmode=&quot;decimal&quot;&gt;</code> and, for more than one unit, a labelled <code>&lt;select class=&quot;quantity-input-div-unit&quot;&gt;</code></li>\n<li>Each unit has its own <code>min</code>, <code>max</code> and <code>step</code>; the number takes the chosen unit&#39;s limits</li>\n<li>With one unit, the unit is text linked to the number by <code>aria-describedby</code>, and a hidden field submits it</li>\n<li>Nothing is converted: changing the unit keeps the number as typed</li>\n<li>The fields are <code>{name}-magnitude</code> and <code>{name}-unit</code>; a form reset restores both</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>number-input</code> — a number with no unit</li>\n<li><code>measurement-unit-input</code> — a unit on its own</li>\n<li><code>observation-view</code> — a measured value shown with its unit and range</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>openEHR DV_QUANTITY: <a href=\"https://specifications.openehr.org/releases/RM/latest/data_types.html\">https://specifications.openehr.org/releases/RM/latest/data_types.html</a></li>\n<li>UCUM: <a href=\"https://ucum.org/\">https://ucum.org/</a></li>\n<li>WAI Forms Tutorial, grouping controls: <a href=\"https://www.w3.org/WAI/tutorials/forms/grouping/\">https://www.w3.org/WAI/tutorials/forms/grouping/</a></li>\n<li>Spec: spec/lessons/openehr/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"quantity-input-div\" role=\"group\" aria-label=\"Weight\"><label for=\"demo-weight-magnitude\">Amount</label> <input class=\"quantity-input-div-magnitude\" id=\"demo-weight-magnitude\" name=\"weight-magnitude\" type=\"number\" inputmode=\"decimal\" min=\"0\" max=\"300\" step=\"0.1\"> <label for=\"demo-weight-unit\">Unit</label> <select class=\"quantity-input-div-unit\" id=\"demo-weight-unit\" name=\"weight-unit\"><option value=\"kg\" selected>kilograms</option><option value=\"[lb_av]\">pounds</option></select></div>";
  const svelteSource: string = "// In your Svelte component:\nimport QuantityInputDiv from \"lily-design-system-svelte-headless/components/QuantityInputDiv/QuantityInputDiv.svelte\";\n\n<QuantityInputDiv>\n  <!-- content -->\n</QuantityInputDiv>\n";
  const usageCode: string = "<QuantityInputDiv label=\"Weight\" magnitudeLabel=\"Amount\" unitLabel=\"Unit\" {units} bind:magnitude bind:unit />\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Quantity Input Div — Lily Design System</title>
  <meta name="description" content="QuantityInputDiv is a headless input for a quantity: a number and its unit, such as a weight in kilograms or pounds. It renders a labelled group holding a number input and a unit &lt;select&gt;, and each unit carries its own limits, so &quot;0 to 300 kg&quot; and &quot;0 to 660 lb&quot; are both enforced by the browser. I…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/quantity-input-div/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: quantity-input-div</li>
      <li>PascalCase: QuantityInputDiv</li>
      <li>Description: a quantity entered as a number and a unit, each unit with its own limits</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .quantity-input-div</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> with <code>aria-label</code> names the pair; each control has a visible <code>&lt;label for&gt;</code></li>
      <li>A single unit is linked by <code>aria-describedby</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves between the number and the unit; each is a native control</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) — the group's name ("Weight")</li>
      <li><code>magnitudeLabel</code>: string (required) — the number input's label ("Amount")</li>
      <li><code>unitLabel</code>: string (required when there is more than one unit) — the unit select's label ("Unit")</li>
      <li><code>units</code>: &#123; value, label, min?, max?, step? &#125;[] (required) — the units offered, in the consumer's words; the first is the default</li>
      <li><code>magnitude</code>: string (default "") — the number as typed; two-way</li>
      <li><code>unit</code>: string (default: the first unit) — the unit chosen; two-way</li>
      <li><code>name</code>: string (optional) — base name for <code>&#123;name&#125;-magnitude</code> and <code>&#123;name&#125;-unit</code></li>
      <li><code>required</code>, <code>disabled</code>: boolean (default false)</li>
      <li><code>id</code>: string (optional) — base id</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
