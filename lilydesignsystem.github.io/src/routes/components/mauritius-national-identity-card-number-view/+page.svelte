<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Mauritius National Identity Card Number View</h1>\n<p>MauritiusNationalIdentityCardNumberView is a headless read-only display of Mauritius&#39;s National Identity Card number, Mauritius&#39;s government-issued personal identifier. It renders as a <code>&lt;span&gt;</code> with an accessible label. It is the read-only companion to MauritiusNationalIdentityCardNumberInput.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem term=&quot;National Identity Card number&quot;&gt;\n    &lt;MauritiusNationalIdentityCardNumberView\n      label=&quot;National Identity Card number&quot;\n      value=&quot;{value}&quot;\n    /&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (default: &quot;&quot;) — the identifier to display</li>\n<li><code>label</code>: string (optional) — hidden text naming the value, in a <code>.screen-reader-span</code>. Leave it out when a visible caption names the value</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;span&gt;</code></li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA on the root: a plain <code>&lt;span&gt;</code> cannot be named. A visible caption names the value, or <code>label</code> renders as hidden text in a <code>.screen-reader-span</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to display a stored National Identity Card number from Mauritius read-only.</li>\n<li>Use in summary lists, patient records, audit logs, or detail views.</li>\n<li>Use when the identifier should not be editable in the current context.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for editing identifiers — use <code>mauritius-national-identity-card-number-input</code> instead.</li>\n<li>Do not use for general text display — use a <code>&lt;span&gt;</code> directly.</li>\n<li>Do not use for other countries&#39; identifiers — use the corresponding country-specific view.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS. The consumer provides all styling targeting the <code>.mauritius-national-identity-card-number-view</code> class hook.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify renders a <code>&lt;span&gt;</code> with the correct class</li>\n<li>Verify the <code>value</code> prop is rendered as text content</li>\n<li>Verify <code>label</code> renders as hidden text, and that the root has no <code>aria-label</code></li>\n</ul>\n<h2>Domain Knowledge</h2>\n<p>Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters&#39; positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.</p>\n<p><strong>Where to find it:</strong> Printed on the National Identity Card, and given at birth registration.</p>\n<h2>Security and privacy</h2>\n<p>A national identifier is personal data, and often a key to other records.</p>\n<ul>\n<li>The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.</li>\n<li>Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.</li>\n<li>Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>mauritius-national-identity-card-number-input</code> — an input for entering Mauritius&#39;s National Identity Card number</li>\n<li><code>summary-list-item</code> — one key-value pair in a summary list</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.mu.nid\">python-stdnum: stdnum.mu.nid</a></li>\n<li><a href=\"https://en.wikipedia.org/wiki/List_of_national_identity_card_policies_by_country\">List of national identity card policies by country</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;span&gt;</code></li>\n<li>Format: Fourteen characters: the first letter of the surname at birth, the date of birth as DDMMYY, a six-digit serial and a check character. The check character comes from the alphabet 0-9A-Z: sum each of the first thirteen characters&#39; positions in that alphabet times the weights 14 down to 2, and take the character at (17 - sum) modulo 17.</li>\n<li>Provides accessible name via the <code>label</code> prop</li>\n<li>Companion to MauritiusNationalIdentityCardNumberInput</li>\n</ul>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"mauritius-national-identity-card-number-view\" aria-label=\"a read-only display of Mauritius's National Identity Card number\">MauritiusNationalIdentityCardNumberView</div>";
  const svelteSource: string = "// In your Svelte component:\nimport MauritiusNationalIdentityCardNumberView from \"lily-design-system-svelte-headless/components/MauritiusNationalIdentityCardNumberView/MauritiusNationalIdentityCardNumberView.svelte\";\n\n<MauritiusNationalIdentityCardNumberView>\n  <!-- content -->\n</MauritiusNationalIdentityCardNumberView>\n";
  const usageCode: string = "<MauritiusNationalIdentityCardNumberView label=\"MauritiusNationalIdentityCardNumberView example\"\n  >Content</MauritiusNationalIdentityCardNumberView\n>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Mauritius National Identity Card Number View — Lily Design System</title>
  <meta name="description" content="MauritiusNationalIdentityCardNumberView is a headless read-only display of Mauritius's National Identity Card number, Mauritius's government-issued personal identifier. It renders as a &lt;span&gt; with an accessible label. It is the read-only companion to MauritiusNationalIdentityCardNumberInput." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/mauritius-national-identity-card-number-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: mauritius-national-identity-card-number-view</li>
      <li>PascalCase: MauritiusNationalIdentityCardNumberView</li>
      <li>Description: a read-only display of Mauritius's National Identity Card number</li>
      <li>Purpose: Shows Mauritius's National Identity Card number as read-only text, so it is displayed one way wherever it appears. Use the input to collect it.</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .mauritius-national-identity-card-number-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No ARIA. A plain <code>&lt;span&gt;</code> cannot be named: <code>aria-label</code> is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional <code>label</code> renders as hidden text</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (default: "") — the identifier to display</li>
      <li><code>label</code>: string (optional) — hidden text naming the value, in a <code>.screen-reader-span</code>. Leave it out when a visible caption names the value</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
