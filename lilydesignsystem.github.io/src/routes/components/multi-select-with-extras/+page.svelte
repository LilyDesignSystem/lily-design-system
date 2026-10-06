<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>MultiSelectWithExtras</h1>\n<p>MultiSelectWithExtras wraps a native <code>&lt;select multiple&gt;</code> in a <code>&lt;div&gt;</code> with optional <code>before</code> and <code>after</code> slots, for adornments such as a label, count, or clear button. It mirrors <code>select-with-extras</code> for multiple selection.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a wrapper <code>&lt;div&gt;</code> containing the optional <code>before</code> slot, a native <code>&lt;select multiple&gt;</code>, then the optional <code>after</code> slot</li>\n<li><code>aria-label={label}</code> is on the <code>&lt;select&gt;</code>, not the wrapper</li>\n<li><code>value</code> is a <code>string[]</code>, two-way bindable</li>\n<li><code>before</code> / <code>after</code> render only when provided</li>\n<li>Supports <code>size</code>, <code>required</code>, <code>disabled</code> on the select</li>\n<li>Spreads <code>restProps</code> onto the wrapper <code>&lt;div&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class on the wrapper</li>\n<li><code>label</code>: string (required) -- accessible name for the select</li>\n<li><code>value</code>: string[] (default: <code>[]</code>) -- bindable selected values</li>\n<li><code>size</code>: number (optional) -- visible rows</li>\n<li><code>required</code>: boolean (default: <code>false</code>)</li>\n<li><code>disabled</code>: boolean (default: <code>false</code>)</li>\n<li><code>children</code>: slot (required) -- <code>Option</code> elements</li>\n<li><code>before</code>: slot (optional) -- content before the select</li>\n<li><code>after</code>: slot (optional) -- content after the select</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the wrapper <code>&lt;div&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;MultiSelectWithExtras label=&quot;Departments&quot; bind:value={departments} size={5}&gt;\n  {#snippet before()}&lt;span&gt;Filter by&lt;/span&gt;{/snippet}\n  &lt;Option value=&quot;a&quot;&gt;Cardiology&lt;/Option&gt;\n  &lt;Option value=&quot;b&quot;&gt;Neurology&lt;/Option&gt;\n  {#snippet after()}&lt;button type=&quot;button&quot;&gt;Clear&lt;/button&gt;{/snippet}\n&lt;/MultiSelectWithExtras&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Native select keyboard behaviour only: Arrow keys move, Shift+Arrow extends selection, Tab moves focus</li>\n<li>Interactive content in <code>before</code> / <code>after</code> has its own native keyboard behaviour</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> -- on the <code>&lt;select multiple&gt;</code>, provides its accessible name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when a multiple-choice select needs an adjacent label, count, or action.</li>\n<li>Use for filter bars where the control sits with related buttons.</li>\n<li>Use when you want the native control but a stable wrapper element for layout.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use without extras -- use <code>multi-select</code>.</li>\n<li>Do not use for a single choice -- use <code>select-with-extras</code>.</li>\n<li>Do not use when users must search -- use <code>combobox</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders a <code>&lt;div&gt;</code> wrapper and a native <code>&lt;select multiple&gt;</code>. The consumer decides layout and all appearance of the adornments.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via the <code>.multi-select-with-extras</code> class on the wrapper.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify wrapper <code>&lt;div&gt;</code> with class <code>multi-select-with-extras</code> containing a <code>&lt;select multiple&gt;</code></li>\n<li>Verify <code>aria-label</code> is on the select, not the wrapper</li>\n<li>Verify <code>before</code> and <code>after</code> render around the select in order</li>\n<li>Verify array <code>value</code> selects options</li>\n<li>Verify <code>size</code>, <code>required</code>, <code>disabled</code> reach the select</li>\n<li>Verify rest props land on the wrapper</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Place extras so the control keeps a clear programmatic and visual label.</li>\n<li><strong>Developers</strong>: Anything in <code>before</code>/<code>after</code> that acts as a label should be associated explicitly or the <code>label</code> prop kept as the accessible name.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>multi-select</code> — the control alone</li>\n<li><code>select-with-extras</code> — single-choice equivalent</li>\n<li><code>checkbox-group</code> — visible checkboxes</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>MDN select element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"multi-select-with-extras\"><input type=\"text\" aria-label=\"Filter toppings\" placeholder=\"Search...\" /><select multiple size=\"4\" aria-label=\"Choose toppings\"><option value=\"cheese\">Cheese</option><option value=\"onion\">Onion</option><option value=\"olives\">Olives</option><option value=\"peppers\">Peppers</option></select></div>";
  const svelteSource: string = "// In your Svelte component:\nimport MultiSelectWithExtras from \"lily-design-system-svelte-headless/components/MultiSelectWithExtras/MultiSelectWithExtras.svelte\";\n\n<MultiSelectWithExtras>\n  <!-- content -->\n</MultiSelectWithExtras>\n";
  const usageCode: string = "<MultiSelectWithExtras label=\"Departments\" bind:value={departments} size={5}>\n  {#snippet before()}<span>Filter by</span>{/snippet}\n  <Option value=\"a\">Cardiology</Option>\n  <Option value=\"b\">Neurology</Option>\n  {#snippet after()}<button type=\"button\">Clear</button>{/snippet}\n</MultiSelectWithExtras>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MultiSelectWithExtras — Lily Design System</title>
  <meta name="description" content="MultiSelectWithExtras wraps a native &lt;select multiple&gt; in a &lt;div&gt; with optional before and after slots, for adornments such as a label, count, or clear button. It mirrors select-with-extras for multiple selection." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/multi-select-with-extras/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: multi-select-with-extras</li>
      <li>PascalCase: MultiSelectWithExtras</li>
      <li>Description: a multiple-choice select with content before and after it</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .multi-select-with-extras</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label=&#123;label&#125;</code> -- on the <code>&lt;select multiple&gt;</code>, provides its accessible name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Native select keyboard behaviour only: Arrow keys move, Shift+Arrow extends selection, Tab moves focus</li>
      <li>Interactive content in <code>before</code> / <code>after</code> has its own native keyboard behaviour</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class on the wrapper</li>
      <li><code>label</code>: string (required) -- accessible name for the select</li>
      <li><code>value</code>: string[] (default: <code>[]</code>) -- bindable selected values</li>
      <li><code>size</code>: number (optional) -- visible rows</li>
      <li><code>required</code>: boolean (default: <code>false</code>)</li>
      <li><code>disabled</code>: boolean (default: <code>false</code>)</li>
      <li><code>children</code>: slot (required) -- <code>Option</code> elements</li>
      <li><code>before</code>: slot (optional) -- content before the select</li>
      <li><code>after</code>: slot (optional) -- content after the select</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the wrapper <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
