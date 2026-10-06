<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>MultiSelect</h1>\n<p>MultiSelect is a headless wrapper over the native <code>&lt;select multiple&gt;</code>. The bindable <code>value</code> is an array of the selected option values. It uses the browser&#39;s own listbox, keyboard and selection model.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a native <code>&lt;select multiple&gt;</code> with <code>aria-label={label}</code></li>\n<li><code>value</code> is a <code>string[]</code> of selected option values, two-way bindable</li>\n<li>Optional <code>size</code> sets the number of visible rows</li>\n<li>Children are <code>Option</code> elements</li>\n<li>Supports <code>required</code> and <code>disabled</code></li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;select&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>\n<li><code>value</code>: string[] (default: <code>[]</code>) -- bindable selected values</li>\n<li><code>size</code>: number (optional) -- visible rows</li>\n<li><code>required</code>: boolean (default: <code>false</code>)</li>\n<li><code>disabled</code>: boolean (default: <code>false</code>)</li>\n<li><code>children</code>: slot (required) -- <code>Option</code> elements</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;select&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;MultiSelect label=&quot;Toppings&quot; bind:value={toppings} size={4}&gt;\n  &lt;Option value=&quot;cheese&quot;&gt;Cheese&lt;/Option&gt;\n  &lt;Option value=&quot;olives&quot;&gt;Olives&lt;/Option&gt;\n  &lt;Option value=&quot;onion&quot;&gt;Onion&lt;/Option&gt;\n&lt;/MultiSelect&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Arrow Up / Arrow Down: moves the active option (native); Shift+Arrow extends the selection (native)</li>\n<li>Ctrl/Cmd+Click and Ctrl/Cmd+Space: toggle one option (native, platform-dependent)</li>\n<li>Native only: no keyboard handling is added</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> -- accessible name; the <code>&lt;select multiple&gt;</code> is exposed as a listbox with multiple selection</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when the user picks a handful of options from a known list and a native control is acceptable.</li>\n<li>Use for filters and tag assignment where searching is not needed.</li>\n<li>Use when you want native keyboard, form submission and mobile pickers.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a single choice -- use <code>select</code>.</li>\n<li>Do not use for two to five visible options where checkboxes are clearer -- use <code>checkbox-group</code>.</li>\n<li>Do not use when users must search a long list -- use <code>combobox</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders a native <code>&lt;select multiple&gt;</code>. Selected-option appearance is largely controlled by the browser; the consumer styles the box and size.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via the <code>.multi-select</code> class.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the root is a <code>&lt;select multiple&gt;</code> with class <code>multi-select</code></li>\n<li>Verify it is exposed as a listbox with the <code>label</code> name</li>\n<li>Verify an initial array <code>value</code> selects the matching options</li>\n<li>Verify several options can be selected</li>\n<li>Verify <code>size</code>, <code>required</code>, <code>disabled</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Native multi-selects are hard to discover (modifier keys). Add helper text, or prefer <code>checkbox-group</code> for short lists.</li>\n<li><strong>Developers</strong>: The value is an array; serialise it for submission yourself or rely on repeated form fields with <code>name</code>.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>select</code> — single-choice native select</li>\n<li><code>multi-select-with-extras</code> — the same control with content before and after</li>\n<li><code>checkbox-group</code> — several visible checkboxes</li>\n<li><code>combobox</code> — searchable choice</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>MDN select element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select</a></li>\n<li>WAI-ARIA Listbox Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/listbox/\">https://www.w3.org/WAI/ARIA/apg/patterns/listbox/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<select class=\"multi-select\" multiple size=\"4\" aria-label=\"Choose toppings\"><option value=\"cheese\">Cheese</option><option value=\"onion\">Onion</option><option value=\"olives\">Olives</option><option value=\"peppers\">Peppers</option></select>";
  const svelteSource: string = "// In your Svelte component:\nimport MultiSelect from \"lily-design-system-svelte-headless/components/MultiSelect/MultiSelect.svelte\";\n\n<MultiSelect>\n  <!-- content -->\n</MultiSelect>\n";
  const usageCode: string = "<MultiSelect label=\"Toppings\" bind:value={toppings} size={4}>\n  <Option value=\"cheese\">Cheese</Option>\n  <Option value=\"olives\">Olives</Option>\n  <Option value=\"onion\">Onion</Option>\n</MultiSelect>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MultiSelect — Lily Design System</title>
  <meta name="description" content="MultiSelect is a headless wrapper over the native &lt;select multiple&gt;. The bindable value is an array of the selected option values. It uses the browser's own listbox, keyboard and selection model." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/multi-select/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: multi-select</li>
      <li>PascalCase: MultiSelect</li>
      <li>Description: a native select that lets the user choose several options at once</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;select&gt;</li>
      <li>CSS class: .multi-select</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label=&#123;label&#125;</code> -- accessible name; the <code>&lt;select multiple&gt;</code> is exposed as a listbox with multiple selection</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Arrow Up / Arrow Down: moves the active option (native); Shift+Arrow extends the selection (native)</li>
      <li>Ctrl/Cmd+Click and Ctrl/Cmd+Space: toggle one option (native, platform-dependent)</li>
      <li>Native only: no keyboard handling is added</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>
      <li><code>value</code>: string[] (default: <code>[]</code>) -- bindable selected values</li>
      <li><code>size</code>: number (optional) -- visible rows</li>
      <li><code>required</code>: boolean (default: <code>false</code>)</li>
      <li><code>disabled</code>: boolean (default: <code>false</code>)</li>
      <li><code>children</code>: slot (required) -- <code>Option</code> elements</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;select&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
