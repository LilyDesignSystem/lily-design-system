<script lang="ts">
  const html: string = "<h1>Autosuggest</h1>\n\n<p>A text input that proposes matching options as users type, helping people find an item from a long list without browsing the whole list.</p>\n\n<p>The component implements the WAI-ARIA Combobox pattern: a single-line <code>&lt;input&gt;</code> is paired with a popup <code>&lt;ul role=\"listbox\"&gt;</code> that appears when there are suggestions and disappears when the user picks one or dismisses it. The consumer owns the matching logic — Autosuggest emits the typed query, the consumer returns a fresh list of suggestions, and the component handles focus, keyboard navigation, and ARIA wiring.</p>\n\n<p>Use it for searches over large or remote datasets (countries, services, contacts, products) where typing should narrow the field, but where the user is also free to enter free-form text that may not appear in the suggestion list.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Implements the WAI-ARIA Combobox pattern (combobox + listbox + option) atop a text <code>&lt;input&gt;</code></li>\n<li>Suggestions are produced by the consumer via the <code>onInput</code> callback (which receives the typed query and returns a list of options)</li>\n<li>Selecting a suggestion sets the input value and closes the listbox</li>\n<li>Supports two-way binding on the <code>value</code> prop</li>\n<li>Listbox is rendered only when there are suggestions and the input is focused</li>\n<li>Closing happens on Escape, click outside, blur, or successful selection</li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible name for the input</td></tr>\n<tr><td><code>value</code></td><td>string</td><td>\"\"</td><td>Bindable input value</td></tr>\n<tr><td><code>suggestions</code></td><td>array of <code>{ value: string; label: string }</code></td><td>[]</td><td>Current suggestions to show</td></tr>\n<tr><td><code>onInput</code></td><td>(query: string) =&gt; void</td><td>—</td><td>Fired when the typed value changes; consumer recomputes suggestions</td></tr>\n<tr><td><code>onSelect</code></td><td>(value: string) =&gt; void</td><td>—</td><td>Fired when the user selects a suggestion</td></tr>\n<tr><td><code>placeholder</code></td><td>string</td><td>—</td><td>Placeholder text</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the wrapper <code>&lt;div&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Autosuggest label=\"Find a service\" suggestions={current} onInput={handleQuery} onSelect={handleSelect} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Down arrow: open the listbox / move highlight to the next option</li>\n<li>Up arrow: move highlight to the previous option</li>\n<li>Enter: select the highlighted option</li>\n<li>Escape: close the listbox without selecting</li>\n<li>Home / End: jump to the first / last option (when listbox is open)</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"combobox\"</code> on the wrapper, <code>aria-expanded</code> toggled to reflect listbox visibility</li>\n<li><code>aria-controls</code> on the input references the listbox id</li>\n<li><code>aria-activedescendant</code> on the input references the currently highlighted option</li>\n<li><code>role=\"listbox\"</code> on the suggestion list, <code>role=\"option\"</code> on each suggestion</li>\n<li>Selected option has <code>aria-selected=\"true\"</code></li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Searching long lists of options where typing narrows the choices (e.g. countries, services, contacts)</li>\n<li>Implementing search-as-you-type with server-driven results</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>Combobox</code> when you want a permanent dropdown that may also accept typed values</li>\n<li>Use <code>Select</code> for short, fixed lists of options</li>\n<li>Use <code>MentionsInput</code> for at-mentions inside a textarea</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.autosuggest</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>combobox</code> — input with a permanent dropdown filter</li>\n<li><code>select</code> — native select dropdown</li>\n<li><code>mentions-input</code> — at-mention autocomplete inside a textarea</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/combobox/\">WAI-ARIA Combobox pattern</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"autosuggest\" aria-label=\"a text input that proposes matching options as users type\">Autosuggest</div>";
  const svelteSource: string = "// In your Svelte component:\nimport Autosuggest from \"lily-design-system-svelte-headless/components/Autosuggest/Autosuggest.svelte\";\n\n<Autosuggest>\n  <!-- content -->\n</Autosuggest>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Autosuggest — Lily Design System</title>
  <meta name="description" content="A text input that proposes matching options as users type, helping people find an item from a long list without browsing the whole list." />
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

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/autosuggest/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: autosuggest</li>
      <li>PascalCase: Autosuggest</li>
      <li>Description: a text input that proposes matching options as users type</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .autosuggest</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="combobox"</code> on the wrapper, <code>aria-expanded</code> toggled to reflect listbox visibility</li>
      <li><code>aria-controls</code> on the input references the listbox id</li>
      <li><code>aria-activedescendant</code> on the input references the currently highlighted option</li>
      <li><code>role="listbox"</code> on the suggestion list, <code>role="option"</code> on each suggestion</li>
      <li>Selected option has <code>aria-selected="true"</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Down arrow: open the listbox / move highlight to the next option</li>
      <li>Up arrow: move highlight to the previous option</li>
      <li>Enter: select the highlighted option</li>
      <li>Escape: close the listbox without selecting</li>
      <li>Home / End: jump to the first / last option (when listbox is open)</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) (default: —) — Accessible name for the input</li>
      <li><code>value</code>: string (default: "") — Bindable input value</li>
      <li><code>suggestions</code>: array of <code>&#123; value: string; label: string &#125;</code> (default: []) — Current suggestions to show</li>
      <li><code>onInput</code>: (query: string) =&gt; void (default: —) — Fired when the typed value changes; consumer recomputes suggestions</li>
      <li><code>onSelect</code>: (value: string) =&gt; void (default: —) — Fired when the user selects a suggestion</li>
      <li><code>placeholder</code>: string (default: —) — Placeholder text</li>
      <li><code>...restProps</code>: HTML attributes (default: —) — Spread onto the wrapper <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
