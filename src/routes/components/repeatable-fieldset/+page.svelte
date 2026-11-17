<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Repeatable Fieldset</h1>\n<p>RepeatableFieldset is the &quot;add another&quot; pattern: a question answered with a list of identical groups of fields, such as each medicine a person takes or each address they have lived at, where the person adds and removes groups. It renders a <code>&lt;fieldset&gt;</code> holding one <code>&lt;fieldset&gt;</code> per item, each with a legend and a remove button, and an add button. The items are the consumer&#39;s data; the component adds, removes, numbers the legends in the consumer&#39;s words, and moves focus.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;RepeatableFieldset\n  legend=&quot;Medicines&quot;\n  bind:items=&quot;{medicines}&quot;\n  newItem=&quot;{()&quot;\n  =&quot;&quot;\n&gt;\n  ({ name: &quot;&quot; })} itemLegend={(n) =&gt; `Medicine ${n}`} addLabel=&quot;Add another medicine&quot;\n  removeLabel={(n) =&gt; `Remove medicine ${n}`} min={1} &gt; {#snippet item(medicine, index)}\n  &lt;label for=&quot;{`medicine-${index}`}&quot;&gt;Name&lt;/label&gt;\n  &lt;input\n    id=&quot;{`medicine-${index}`}&quot;\n    bind:value=&quot;{medicine.name}&quot;\n  /&gt;\n  {/snippet}\n&lt;/RepeatableFieldset&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>legend</code>: string (required) — names the whole group (&quot;Medicines&quot;)</li>\n<li><code>items</code>: T[] (two-way) — the consumer&#39;s items</li>\n<li><code>newItem</code>: () =&gt; T (required) — makes a new item when the add button is pressed</li>\n<li><code>itemLegend</code>: (number) =&gt; string (required) — each item&#39;s legend (&quot;Medicine 2&quot;); numbers start at 1</li>\n<li><code>addLabel</code>: string (required) — the add button&#39;s text (&quot;Add another medicine&quot;)</li>\n<li><code>removeLabel</code>: (number) =&gt; string (required) — each remove button&#39;s text (&quot;Remove medicine 2&quot;)</li>\n<li><code>min</code>: number (default 0) — the fewest items; remove buttons are left out at the minimum</li>\n<li><code>max</code>: number (optional) — the most items; the add button is disabled at the maximum</li>\n<li><code>addedLabel</code>, <code>removedLabel</code>: (number) =&gt; string (optional) — announced politely after an add or a remove</li>\n<li><code>item</code>: slot (required) — one item&#39;s fields, given the item and its index (<code>renderItem</code> in React, an <code>&lt;ng-template&gt;</code> in Angular, <code>ItemTemplate</code> in Blazor, a <code>&lt;template&gt;</code> child in Web Components)</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the outer <code>&lt;fieldset&gt;</code></li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves through each item&#39;s fields, its remove button, then the add button</td>\n</tr>\n<tr>\n<td>Enter, Space</td>\n<td>Press the focused add or remove button</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li>The outer <code>&lt;legend&gt;</code> names the group; each item&#39;s <code>&lt;legend&gt;</code> names it, announced with its fields</li>\n<li><code>role=&quot;status&quot;</code> announces an add or a remove politely, in the consumer&#39;s words</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when a question has a list of answers and each answer has several fields: medicines, addresses, previous names, dependants.</li>\n<li>Use for an openEHR or FHIR element that may repeat (occurrences <code>0..*</code>).</li>\n<li>Use with <code>min</code> when at least one answer is required.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a list of single values — use <code>tag-input-div</code> or <code>checkbox-group</code>.</li>\n<li>Do not use for a fixed number of groups — write the <code>fieldset</code>s directly.</li>\n<li>Do not use for editing rows of a table — use the <code>data-grid</code> helper.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.repeatable-fieldset</code> class hook and its parts, and every word.</p>\n<h2>Styles</h2>\n<p><code>.repeatable-fieldset</code>, <code>.repeatable-fieldset-item</code>, <code>.repeatable-fieldset-item-legend</code>, <code>.repeatable-fieldset-remove</code>, <code>.repeatable-fieldset-add</code>, <code>.repeatable-fieldset-status</code>, and <code>[data-count]</code>, <code>[data-index]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Add appends an item, renumbers, announces and focuses the new item&#39;s first field</li>\n<li>Remove takes out that item, keeps the others&#39; values and focuses the add button</li>\n<li><code>min</code> and <code>max</code> limit the count</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Name each remove button for its item (&quot;Remove medicine 2&quot;), not just &quot;Remove&quot;.</li>\n<li>Give fields within an item ids from a stable key, not only the index, if items can be removed from the middle.</li>\n<li>With a server round trip, keep the typed values when the page comes back one item longer.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;fieldset class=&quot;repeatable-fieldset&quot;&gt;</code> with a <code>&lt;legend&gt;</code>, one <code>&lt;fieldset class=&quot;repeatable-fieldset-item&quot;&gt;</code> per item with a <code>-item-legend</code> and a <code>-remove</code> button, a <code>-add</code> button, and an optional <code>-status</code> region</li>\n<li>Adding appends <code>newItem()</code>; removing takes out that item, so the others keep their values</li>\n<li>Legends and remove labels are functions of the item&#39;s number, so the words are always the consumer&#39;s</li>\n<li>Focus moves to the new item&#39;s first field on add and to the add button on remove; Blazor focuses the new item&#39;s fieldset (<code>tabindex=&quot;-1&quot;</code>) instead, since it uses no JS interop</li>\n<li><code>min</code> and <code>max</code> limit the count</li>\n<li>HTML and Nunjucks render the server round trip: the buttons submit the form as <code>{name}-add</code> and <code>{name}-remove</code> (with the item&#39;s index), and the server returns the page one item longer or shorter</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>fieldset</code> — a group of related fields with a legend</li>\n<li><code>field</code> — one labelled field with its hint and error</li>\n<li><code>tag-input-div</code> — a list of single values a person adds to</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Ministry of Justice design patterns, add another: <a href=\"https://design-patterns.service.justice.gov.uk/components/add-another/\">https://design-patterns.service.justice.gov.uk/components/add-another/</a></li>\n<li>WAI Forms Tutorial, grouping controls: <a href=\"https://www.w3.org/WAI/tutorials/forms/grouping/\">https://www.w3.org/WAI/tutorials/forms/grouping/</a></li>\n<li>Spec: spec/lessons/openehr/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"repeatable-fieldset\" data-count=\"1\"><legend>Medicines</legend><fieldset class=\"repeatable-fieldset-item\" data-index=\"0\"><legend class=\"repeatable-fieldset-item-legend\">Medicine 1</legend><label for=\"demo-medicine-0\">Name</label> <input id=\"demo-medicine-0\" name=\"medicine-0\" value=\"Aspirin\"> <button type=\"button\" class=\"repeatable-fieldset-remove\">Remove medicine 1</button></fieldset><button type=\"button\" class=\"repeatable-fieldset-add\">Add another medicine</button></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport RepeatableFieldset from \"lily-design-system-svelte-headless/components/RepeatableFieldset/RepeatableFieldset.svelte\";\n\n<RepeatableFieldset>\n  <!-- content -->\n</RepeatableFieldset>\n";
  const usageCode: string = "<RepeatableFieldset legend=\"Medicines\" bind:items newItem={() => ({ name: \"\" })} itemLegend={(n) => `Medicine ${n}`} addLabel=\"Add another medicine\" removeLabel={(n) => `Remove medicine ${n}`}>{#snippet item(medicine, index)}…{/snippet}</RepeatableFieldset>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Repeatable Fieldset — Lily Design System</title>
  <meta name="description" content="RepeatableFieldset is the &quot;add another&quot; pattern: a question answered with a list of identical groups of fields, such as each medicine a person takes or each address they have lived at, where the person adds and removes groups. It renders a &lt;fieldset&gt; holding one &lt;fieldset&gt; per item, each with a l…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/repeatable-fieldset/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: repeatable-fieldset</li>
      <li>PascalCase: RepeatableFieldset</li>
      <li>Description: a group of identical fieldsets that a person adds to and removes from ("add another")</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .repeatable-fieldset</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>The outer <code>&lt;legend&gt;</code> names the group, and each item's <code>&lt;legend&gt;</code> names it, announced with its fields</li>
      <li><code>role="status"</code> announces the change politely, in the consumer's words</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves through each item's fields, its remove button, then the add button; each button is native</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>legend</code>: string (required) — names the whole group ("Medicines")</li>
      <li><code>items</code>: T[] (two-way) — the consumer's items</li>
      <li><code>newItem</code>: () =&gt; T (required) — makes a new item when the add button is pressed</li>
      <li><code>itemLegend</code>: (number) =&gt; string (required) — each item's legend ("Medicine 2"); numbers start at 1</li>
      <li><code>addLabel</code>: string (required) — the add button's text ("Add another medicine")</li>
      <li><code>removeLabel</code>: (number) =&gt; string (required) — each remove button's text ("Remove medicine 2")</li>
      <li><code>min</code>: number (default 0) — the fewest items; remove buttons are left out at the minimum</li>
      <li><code>max</code>: number (optional) — the most items; the add button is disabled at the maximum</li>
      <li><code>addedLabel</code>, <code>removedLabel</code>: (number) =&gt; string (optional) — announced politely after an add or a remove</li>
      <li><code>item</code>: slot (required) — one item's fields, given the item and its index (<code>renderItem</code> in React, an <code>&lt;ng-template&gt;</code> in Angular, <code>ItemTemplate</code> in Blazor, a <code>&lt;template&gt;</code> child in Web Components)</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the outer <code>&lt;fieldset&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
