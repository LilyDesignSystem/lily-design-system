<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Mauritius National Identity Card Number Input</h1>\n<p>MauritiusNationalIdentityCardNumberInput is a headless input for entering Mauritius&#39;s National Identity Card number, Mauritius&#39;s government-issued personal identifier. It renders as <code>&lt;input type=&quot;text&quot;&gt;</code> with <code>autocomplete=&quot;off&quot;</code> to protect sensitive identifiers. It is the editable companion to MauritiusNationalIdentityCardNumberView.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Field\n  label=&quot;National Identity Card number&quot;\n  required\n&gt;\n  &lt;MauritiusNationalIdentityCardNumberInput\n    label=&quot;National Identity Card number&quot;\n    value=&quot;{value}&quot;\n    required\n  /&gt;\n  &lt;Hint\n    &gt;Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a\n    six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum\n    each of the first thirteen characters&#39; positions in that alphabet times the weights 14 down to\n    2, and take the character at (17 - sum) modulo 17.&lt;/Hint\n  &gt;\n  &lt;ErrorMessage&gt;Please enter a valid National Identity Card number&lt;/ErrorMessage&gt;\n&lt;/Field&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) — accessible label via <code>aria-label</code></li>\n<li><code>value</code>: string (default: &quot;&quot;) — bindable input value</li>\n<li><code>required</code>: boolean (default: false) — form validation</li>\n<li><code>disabled</code>: boolean (default: false) — disabled state</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;input&gt;</code></li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> — provides accessible name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use in forms collecting Mauritius&#39;s National Identity Card number.</li>\n<li>Use in administrative or national-id workflows where the identifier is required.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for displaying read-only identifiers — use <code>mauritius-national-identity-card-number-view</code> instead.</li>\n<li>Do not use for general text input — use <code>text-input</code> instead.</li>\n<li>Do not use for other countries&#39; identifiers — use the corresponding country-specific input.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS. The consumer provides all styling targeting the <code>.mauritius-national-identity-card-number-input</code> class hook.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify renders an <code>&lt;input&gt;</code> with the correct class and <code>type=&quot;text&quot;</code></li>\n<li>Verify <code>aria-label</code> is set from the <code>label</code> prop</li>\n<li>Verify <code>autocomplete=&quot;off&quot;</code></li>\n<li>Verify value binding works</li>\n</ul>\n<h2>Domain Knowledge</h2>\n<p>Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters&#39; positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.</p>\n<p><strong>Where to find it:</strong> Printed on the National Identity Card, and given at birth registration.</p>\n<h2>Security and privacy</h2>\n<p>A national identifier is personal data, and often a key to other records.</p>\n<ul>\n<li>The input renders <code>autocomplete=&quot;off&quot;</code>, so the browser neither saves nor offers the value, and <code>spellcheck=&quot;false&quot;</code>, so an enhanced spellchecker does not send it to a cloud service. <code>bin/check-identifier-inputs</code> keeps both in all nine catalogs.</li>\n<li>Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.</li>\n<li>The component stores nothing. Do not keep the value in <code>localStorage</code>, <code>sessionStorage</code> or a cookie; submit it in the body of a POST over HTTPS.</li>\n<li>A format or checksum check proves the number is well formed, not that it belongs to the person entering it.</li>\n<li>The page decides who may see it: the input does not mask what is typed. Use the matching <code>-view</code> to show it back, masked as the service requires.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>mauritius-national-identity-card-number-view</code> — a read-only display of Mauritius&#39;s National Identity Card number</li>\n<li><code>text-input</code> — a single-line text input field &lt;input type=\"text\"&gt;</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid\">python-stdnum: stdnum.mu.nid</a></li>\n<li><a href=\"https://en.wikipedia.org/wiki/List_of_national_identity_card_policies_by_country\">List of national identity card policies by country</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;input type=&quot;text&quot;&gt;</code></li>\n<li>Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters&#39; positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.</li>\n<li><code>autocomplete=&quot;off&quot;</code> to protect sensitive identifiers</li>\n<li>Supports two-way binding on the <code>value</code> prop</li>\n<li>Companion to MauritiusNationalIdentityCardNumberView</li>\n</ul>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"mauritius-national-identity-card-number-input\" aria-label=\"an input for entering Mauritius's National Identity Card number\">MauritiusNationalIdentityCardNumberInput</div>";
  const svelteSource: string = "// In your Svelte component:\nimport MauritiusNationalIdentityCardNumberInput from \"lily-design-system-svelte-headless/components/MauritiusNationalIdentityCardNumberInput/MauritiusNationalIdentityCardNumberInput.svelte\";\n\n<MauritiusNationalIdentityCardNumberInput>\n  <!-- content -->\n</MauritiusNationalIdentityCardNumberInput>\n";
  const usageCode: string = "<MauritiusNationalIdentityCardNumberInput label=\"MauritiusNationalIdentityCardNumberInput example\"\n  >Content</MauritiusNationalIdentityCardNumberInput\n>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Mauritius National Identity Card Number Input — Lily Design System</title>
  <meta name="description" content="MauritiusNationalIdentityCardNumberInput is a headless input for entering Mauritius's National Identity Card number, Mauritius's government-issued personal identifier. It renders as &lt;input type=&quot;text&quot;&gt; with autocomplete=&quot;off&quot; to protect sensitive identifiers. It is the editable companion to Mauri…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/mauritius-national-identity-card-number-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: mauritius-national-identity-card-number-input</li>
      <li>PascalCase: MauritiusNationalIdentityCardNumberInput</li>
      <li>Description: an input for entering Mauritius's National Identity Card number</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;input&gt;</li>
      <li>CSS class: .mauritius-national-identity-card-number-input</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
      <li><code>required</code> and <code>disabled</code> states conveyed to assistive technology</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Standard text input keyboard behavior</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) — accessible label via aria-label</li>
      <li><code>value</code>: string (default: "") — bindable input value</li>
      <li><code>required</code>: boolean (default: false) — form validation</li>
      <li><code>disabled</code>: boolean (default: false) — disabled state</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
