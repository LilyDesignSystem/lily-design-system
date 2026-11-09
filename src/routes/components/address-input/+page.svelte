<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>AddressInput</h1>\n<p>A labelled group for capturing a postal address: a <code>&lt;div role=&quot;group&quot;&gt;</code> named by <code>label</code>, holding the consumer&#39;s own fields, each with its <code>autocomplete</code> token so browsers, password managers and platform autofill can fill them from the user&#39;s saved addresses.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.</p>\n<p>Address shapes are national: the order runs largest to smallest in Japan, China and Korea and smallest to largest in\nmost of Europe and the Americas; some countries have no postal code, others no street names. So the component decides\nno fields: put one <code>&lt;textarea autocomplete=&quot;street-address&quot;&gt;</code> inside it, which suits every country, or the structured\nfields the address&#39;s country uses, in that country&#39;s order. Postcode lookup and suggestion dropdowns are the consumer&#39;s;\nfor typeahead, compose with <code>Autosuggest</code> or <code>Combobox</code> inside the group.</p>\n<p>It is the one <code>-input</code> component whose root is not an <code>&lt;input&gt;</code> (an exception to the suffix table): an address is\nseveral values, and one <code>&lt;input&gt;</code> cannot hold a structured address.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AddressInput label=&quot;Delivery address&quot;&gt;\n  &lt;label for=&quot;street&quot;&gt;Street&lt;/label&gt;\n  &lt;input\n    id=&quot;street&quot;\n    autocomplete=&quot;address-line1&quot;\n  /&gt;\n  &lt;label for=&quot;town&quot;&gt;Town or city&lt;/label&gt;\n  &lt;input\n    id=&quot;town&quot;\n    autocomplete=&quot;address-level2&quot;\n  /&gt;\n  &lt;label for=&quot;postcode&quot;&gt;Postal code&lt;/label&gt;\n  &lt;input\n    id=&quot;postcode&quot;\n    autocomplete=&quot;postal-code&quot;\n  /&gt;\n&lt;/AddressInput&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>The group&#39;s accessible name, on <code>aria-label</code></td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot (required)</td>\n<td>—</td>\n<td>The labelled address fields</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None of its own: Tab moves through the consumer&#39;s fields, which keep native input behaviour</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> and <code>aria-label</code> (from <code>label</code>) name the set of fields, announced as the user enters it</li>\n<li>Each field has its own visible <code>&lt;label&gt;</code>; the consumer sets <code>aria-invalid</code> and <code>aria-errormessage</code> on a field that fails validation</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Capturing a postal address as part of a contact or delivery form, in one field or several</li>\n<li>Building a postcode lookup widget where the consumer wires the lookup logic externally</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>PostalCodeInput</code> alone when only a postal code is needed</li>\n<li>Use <code>Combobox</code> or <code>Autosuggest</code> when you want a typeahead dropdown of results</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n<h2>Styles</h2>\n<p>The component renders with <code>.address-input</code> as the root class. No default styles are included.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>text-input</code> — single-line text input without address-specific autocomplete</li>\n<li><code>autosuggest</code> — text input with proposed matching options</li>\n<li><code>postal-code-input</code> — postal/ZIP code input with format validation</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#group\">WAI-ARIA group role</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete\">MDN autocomplete attribute</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;div role=&quot;group&quot;&gt;</code> named by <code>label</code> through <code>aria-label</code></li>\n<li>The consumer supplies the fields as children, each with its own <code>&lt;label&gt;</code> and <code>autocomplete</code> token (<code>street-address</code>, <code>address-line1</code>, <code>address-level2</code>, <code>postal-code</code>, <code>country-name</code>, …)</li>\n<li>No value of its own: each field is a form control, so the form submits and resets them</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;div&gt;</code></li>\n<li>All text content (the group label, the field labels, error messages) comes from the consumer</li>\n</ul>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"address-input\" role=\"group\" aria-label=\"Delivery address\"><label class=\"label\" for=\"demo-street\">Street</label><input id=\"demo-street\" autocomplete=\"address-line1\" /><label class=\"label\" for=\"demo-town\">Town or city</label><input id=\"demo-town\" autocomplete=\"address-level2\" /><label class=\"label\" for=\"demo-postcode\">Postal code</label><input id=\"demo-postcode\" autocomplete=\"postal-code\" /></div>";
  const svelteSource: string = "// In your Svelte component:\nimport AddressInput from \"lily-design-system-svelte-headless/components/AddressInput/AddressInput.svelte\";\n\n<AddressInput>\n  <!-- content -->\n</AddressInput>\n";
  const usageCode: string = "<AddressInput label=\"Delivery address\">\n  <label for=\"street\">Street</label>\n  <input\n    id=\"street\"\n    autocomplete=\"address-line1\"\n  />\n  <label for=\"town\">Town or city</label>\n  <input\n    id=\"town\"\n    autocomplete=\"address-level2\"\n  />\n  <label for=\"postcode\">Postal code</label>\n  <input\n    id=\"postcode\"\n    autocomplete=\"postal-code\"\n  />\n</AddressInput>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>AddressInput — Lily Design System</title>
  <meta name="description" content="A labelled group for capturing a postal address: a &lt;div role=&quot;group&quot;&gt; named by label, holding the consumer's own fields, each with its autocomplete token so browsers, password managers and platform autofill can fill them from the user's saved addresses." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/address-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: address-input</li>
      <li>PascalCase: AddressInput</li>
      <li>Description: an input for searching or manually entering an address</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt; with role="group"</li>
      <li>CSS class: .address-input</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> + <code>aria-label</code> (from <code>label</code>) names the set of fields</li>
      <li>Each field has its own visible <code>&lt;label&gt;</code>; the consumer sets <code>aria-invalid</code> and <code>aria-errormessage</code> on a field that fails validation</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions of its own; Tab moves through the consumer's fields</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) (default: —) — The group's accessible name, on <code>aria-label</code></li>
      <li><code>children</code>: slot (required) (default: —) — The labelled address fields</li>
      <li><code>...restProps</code>: HTML attributes (default: —) — Spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
