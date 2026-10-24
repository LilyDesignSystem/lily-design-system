<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>ConvertDiv</h1>\n<p>A group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows.</p>\n<p>The root of a converter: a labelled group holding a <code>ConvertFromDiv</code> (the value and unit to convert from) and a <code>ConvertIntoDiv</code> (the value and unit to convert into). The consumer does the arithmetic and supplies any rates. The component decides no layout, performs no arithmetic, fetches no rates and carries no strings of its own.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ConvertDiv label=&quot;Currency converter&quot;&gt;\n  &lt;ConvertFromDiv&gt;\n    &lt;ConvertFromValueDiv&gt;\n      &lt;label for=&quot;from-value&quot;&gt;Amount&lt;/label&gt;\n      &lt;input id=&quot;from-value&quot; type=&quot;text&quot; inputmode=&quot;decimal&quot; value=&quot;100&quot; /&gt;\n    &lt;/ConvertFromValueDiv&gt;\n    &lt;ConvertFromUnitDiv&gt;\n      &lt;label for=&quot;from-unit&quot;&gt;From&lt;/label&gt;\n      &lt;select id=&quot;from-unit&quot;&gt;&lt;option value=&quot;USD&quot;&gt;US dollars&lt;/option&gt;&lt;option value=&quot;EUR&quot;&gt;Euros&lt;/option&gt;&lt;/select&gt;\n    &lt;/ConvertFromUnitDiv&gt;\n  &lt;/ConvertFromDiv&gt;\n  &lt;ConvertIntoDiv&gt;\n    &lt;ConvertIntoValueDiv&gt;\n      &lt;label for=&quot;into-value&quot;&gt;Converted&lt;/label&gt;\n      &lt;input id=&quot;into-value&quot; type=&quot;text&quot; inputmode=&quot;decimal&quot; value=&quot;92.10&quot; readonly /&gt;\n    &lt;/ConvertIntoValueDiv&gt;\n    &lt;ConvertIntoUnitDiv&gt;\n      &lt;label for=&quot;into-unit&quot;&gt;Into&lt;/label&gt;\n      &lt;select id=&quot;into-unit&quot;&gt;&lt;option value=&quot;EUR&quot;&gt;Euros&lt;/option&gt;&lt;option value=&quot;USD&quot;&gt;US dollars&lt;/option&gt;&lt;/select&gt;\n    &lt;/ConvertIntoUnitDiv&gt;\n  &lt;/ConvertIntoDiv&gt;\n&lt;/ConvertDiv&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>label</code></td>\n<td>string</td>\n<td>— (required)</td>\n<td>Accessible name of the group, set as <code>aria-label</code></td>\n</tr>\n<tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The content</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None of its own; Tab moves through the consumer&#39;s controls in source order</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> with <code>aria-label</code> from <code>label</code>; the label names the whole converter, for example &quot;Currency converter&quot;</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>A converter between two units of one kind: currency, length, mass, temperature, time zone</li>\n<li>A calculator-style form where one value is derived from another</li>\n<li>Anywhere the pair of value-and-unit controls must be announced as one group</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Form</code> + <code>Field</code> — for ordinary input with no derived value</li>\n<li>Use <code>MeasurementInstanceInput</code> — for one measurement with its unit, nothing to convert into</li>\n<li>Use <code>Select</code> — for choosing a unit without any converted value</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no layout (side by side, stacked, an arrow or equals sign between the sides), no colour, no number formatting and no motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.convert-div</code>. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;div&gt;</code> with the base class <code>convert-div</code> and appends the consumer class</li>\n<li><code>label</code> becomes <code>aria-label</code> and the root has <code>role=&quot;group&quot;</code></li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Conversion belongs to the consumer: keep the rates, rounding and <code>Intl.NumberFormat</code> formatting in your own code, and give the converted value a live-region or <code>&lt;output&gt;</code> if it should be announced when it changes. Format and parse numbers with the user&#39;s locale; accept the decimal separator the locale uses.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;div role=&quot;group&quot;&gt;</code> with the base class <code>convert-div</code> first, then the consumer class</li>\n<li><code>label</code> is required: a group without a name is not announced usefully</li>\n<li><code>restProps</code> spread onto the root; no internal state</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>convert-from-div</code></li>\n<li><code>convert-into-div</code></li>\n<li><code>form</code></li>\n<li><code>field</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#group\">WAI-ARIA group role</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output\">MDN <code>&lt;output&gt;</code> element</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"convert-div\" role=\"group\" aria-label=\"Currency converter\"><div class=\"convert-from-div\"><div class=\"convert-from-value-div\"><label for=\"convert-from-value\">Amount</label> <input id=\"convert-from-value\" type=\"text\" inputmode=\"decimal\" value=\"100\"></div><div class=\"convert-from-unit-div\"><label for=\"convert-from-unit\">From</label> <select id=\"convert-from-unit\"><option value=\"USD\">US dollars</option><option value=\"EUR\">Euros</option></select></div></div><div class=\"convert-into-div\"><div class=\"convert-into-value-div\"><label for=\"convert-into-value\">Converted</label> <input id=\"convert-into-value\" type=\"text\" inputmode=\"decimal\" value=\"92.10\" readonly></div><div class=\"convert-into-unit-div\"><label for=\"convert-into-unit\">Into</label> <select id=\"convert-into-unit\"><option value=\"EUR\">Euros</option><option value=\"USD\">US dollars</option></select></div></div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport ConvertDiv from \"lily-design-system-svelte-headless/components/ConvertDiv/ConvertDiv.svelte\";\n\n<ConvertDiv>\n  <!-- content -->\n</ConvertDiv>\n";
  const usageCode: string = "<ConvertDiv label=\"Currency converter\">\n  <ConvertFromDiv>\n    <ConvertFromValueDiv>\n      <label for=\"from-value\">Amount</label>\n      <input id=\"from-value\" type=\"text\" inputmode=\"decimal\" value=\"100\" />\n    </ConvertFromValueDiv>\n    <ConvertFromUnitDiv>\n      <label for=\"from-unit\">From</label>\n      <select id=\"from-unit\"><option value=\"USD\">US dollars</option><option value=\"EUR\">Euros</option></select>\n    </ConvertFromUnitDiv>\n  </ConvertFromDiv>\n  <ConvertIntoDiv>\n    <ConvertIntoValueDiv>\n      <label for=\"into-value\">Converted</label>\n      <input id=\"into-value\" type=\"text\" inputmode=\"decimal\" value=\"92.10\" readonly />\n    </ConvertIntoValueDiv>\n    <ConvertIntoUnitDiv>\n      <label for=\"into-unit\">Into</label>\n      <select id=\"into-unit\"><option value=\"EUR\">Euros</option><option value=\"USD\">US dollars</option></select>\n    </ConvertIntoUnitDiv>\n  </ConvertIntoDiv>\n</ConvertDiv>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ConvertDiv — Lily Design System</title>
  <meta name="description" content="A group that converts a value from one unit into another, such as dollars into euros or miles into kilometres." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/convert-div/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: convert-div</li>
      <li>PascalCase: ConvertDiv</li>
      <li>Description: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres</li>
      <li>Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .convert-div</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> and <code>aria-label</code> from the required <code>label</code> prop</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None of its own</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- Accessible name of the group (<code>aria-label</code>)</li>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>children</code>: slot -- The content</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
