<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>ConvertFromDiv</h1>\n<p>The source side of a conversion, holding the value and unit to convert from.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows.</p>\n<p>The source side of a converter: a plain wrapper for a <code>ConvertFromValueDiv</code> and a <code>ConvertFromUnitDiv</code>. The component decides no layout, performs no arithmetic, fetches no rates and carries no strings of its own.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ConvertDiv label=&quot;Currency converter&quot;&gt;\n  &lt;ConvertFromDiv&gt;\n    &lt;ConvertFromValueDiv&gt;\n      &lt;label for=&quot;from-value&quot;&gt;Amount&lt;/label&gt;\n      &lt;input id=&quot;from-value&quot; type=&quot;text&quot; inputmode=&quot;decimal&quot; value=&quot;100&quot; /&gt;\n    &lt;/ConvertFromValueDiv&gt;\n    &lt;ConvertFromUnitDiv&gt;\n      &lt;label for=&quot;from-unit&quot;&gt;From&lt;/label&gt;\n      &lt;select id=&quot;from-unit&quot;&gt;&lt;option value=&quot;USD&quot;&gt;US dollars&lt;/option&gt;&lt;option value=&quot;EUR&quot;&gt;Euros&lt;/option&gt;&lt;/select&gt;\n    &lt;/ConvertFromUnitDiv&gt;\n  &lt;/ConvertFromDiv&gt;\n  &lt;ConvertIntoDiv&gt;\n    &lt;ConvertIntoValueDiv&gt;\n      &lt;label for=&quot;into-value&quot;&gt;Converted&lt;/label&gt;\n      &lt;input id=&quot;into-value&quot; type=&quot;text&quot; inputmode=&quot;decimal&quot; value=&quot;92.10&quot; readonly /&gt;\n    &lt;/ConvertIntoValueDiv&gt;\n    &lt;ConvertIntoUnitDiv&gt;\n      &lt;label for=&quot;into-unit&quot;&gt;Into&lt;/label&gt;\n      &lt;select id=&quot;into-unit&quot;&gt;&lt;option value=&quot;EUR&quot;&gt;Euros&lt;/option&gt;&lt;option value=&quot;USD&quot;&gt;US dollars&lt;/option&gt;&lt;/select&gt;\n    &lt;/ConvertIntoUnitDiv&gt;\n  &lt;/ConvertIntoDiv&gt;\n&lt;/ConvertDiv&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The content</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None of its own; Tab moves through the consumer&#39;s controls in source order</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA attributes of its own; the consumer&#39;s label and control inside it carry the name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Giving CSS a stable hook for this part of a converter</li>\n<li>Keeping the label and control of this part together as one layout box</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>ConvertDiv</code> — for the whole converter, it carries the group role and name</li>\n<li>Use <code>Field</code> — for a single standalone form control outside a converter</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no layout (side by side, stacked, an arrow or equals sign between the sides), no colour, no number formatting and no motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.convert-from-div</code>. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;div&gt;</code> with the base class <code>convert-from-div</code> and appends the consumer class</li>\n<li>Has no <code>role</code> and no <code>aria-label</code></li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Conversion belongs to the consumer: keep the rates, rounding and <code>Intl.NumberFormat</code> formatting in your own code, and give the converted value a live-region or <code>&lt;output&gt;</code> if it should be announced when it changes. Format and parse numbers with the user&#39;s locale; accept the decimal separator the locale uses.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;div&gt;</code> with the base class <code>convert-from-div</code> first, then the consumer class</li>\n<li>Nothing else: no role, no <code>aria-label</code>, because a role-less <code>&lt;div&gt;</code> is not allowed an accessible name</li>\n<li><code>restProps</code> spread onto the root; no internal state</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>convert-div</code></li>\n<li><code>convert-from-value-div</code></li>\n<li><code>convert-from-unit-div</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#group\">WAI-ARIA group role</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output\">MDN <code>&lt;output&gt;</code> element</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"convert-from-div\"><div class=\"convert-from-value-div\"><label for=\"convert-from-value\">Amount</label> <input id=\"convert-from-value\" type=\"text\" inputmode=\"decimal\" value=\"100\"></div><div class=\"convert-from-unit-div\"><label for=\"convert-from-unit\">From</label> <select id=\"convert-from-unit\"><option value=\"USD\">US dollars</option><option value=\"EUR\">Euros</option></select></div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport ConvertFromDiv from \"lily-design-system-svelte-headless/components/ConvertFromDiv/ConvertFromDiv.svelte\";\n\n<ConvertFromDiv>\n  <!-- content -->\n</ConvertFromDiv>\n";
  const usageCode: string = "<ConvertDiv label=\"Currency converter\">\n  <ConvertFromDiv>\n    <ConvertFromValueDiv>\n      <label for=\"from-value\">Amount</label>\n      <input id=\"from-value\" type=\"text\" inputmode=\"decimal\" value=\"100\" />\n    </ConvertFromValueDiv>\n    <ConvertFromUnitDiv>\n      <label for=\"from-unit\">From</label>\n      <select id=\"from-unit\"><option value=\"USD\">US dollars</option><option value=\"EUR\">Euros</option></select>\n    </ConvertFromUnitDiv>\n  </ConvertFromDiv>\n  <ConvertIntoDiv>\n    <ConvertIntoValueDiv>\n      <label for=\"into-value\">Converted</label>\n      <input id=\"into-value\" type=\"text\" inputmode=\"decimal\" value=\"92.10\" readonly />\n    </ConvertIntoValueDiv>\n    <ConvertIntoUnitDiv>\n      <label for=\"into-unit\">Into</label>\n      <select id=\"into-unit\"><option value=\"EUR\">Euros</option><option value=\"USD\">US dollars</option></select>\n    </ConvertIntoUnitDiv>\n  </ConvertIntoDiv>\n</ConvertDiv>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ConvertFromDiv — Lily Design System</title>
  <meta name="description" content="The source side of a conversion, holding the value and unit to convert from." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/convert-from-div/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: convert-from-div</li>
      <li>PascalCase: ConvertFromDiv</li>
      <li>Description: the source side of a conversion, holding the value and unit to convert from</li>
      <li>Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .convert-from-div</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No ARIA attributes; the consumer's own label and control carry the name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None of its own</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>children</code>: slot -- The content</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
