<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>Nihon Kojin Bango View</h1>\n<p>NihonKojinBangoView is a headless read-only display of Japan&#39;s Individual Number / My Number (マイナンバー), Japan&#39;s government-issued personal identifier. It renders as a <code>&lt;span&gt;</code> with an accessible label. It is the read-only companion to NihonKojinBangoInput.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;span&gt;</code></li>\n<li>Format: Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).</li>\n<li>Provides accessible name via the <code>label</code> prop</li>\n<li>Companion to NihonKojinBangoInput</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (default: &quot;&quot;) — the identifier to display</li>\n<li><code>label</code>: string (required) — accessible label via <code>aria-label</code></li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;span&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem term=&quot;Individual Number / My Number (マイナンバー)&quot;&gt;\n    &lt;NihonKojinBangoView label=&quot;Individual Number / My Number (マイナンバー)&quot; value={value} /&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;\n</code></pre>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> — provides the accessible name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to display a stored Japan Individual Number / My Number (マイナンバー) read-only.</li>\n<li>Use in summary lists, patient records, audit logs, or detail views.</li>\n<li>Use when the identifier should not be editable in the current context.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for editing identifiers — use <code>nihon-kojin-bango-input</code> instead.</li>\n<li>Do not use for general text display — use a <code>&lt;span&gt;</code> directly.</li>\n<li>Do not use for other countries&#39; identifiers — use the corresponding country-specific view.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS. The consumer provides all styling targeting the <code>.nihon-kojin-bango-view</code> class hook.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify renders a <code>&lt;span&gt;</code> with the correct class</li>\n<li>Verify the <code>value</code> prop is rendered as text content</li>\n<li>Verify <code>aria-label</code> is set from the <code>label</code> prop</li>\n</ul>\n<h2>Domain Knowledge</h2>\n<p>Twelve digits, issued to every resident of Japan since 2016. The twelfth digit is a check digit: the first eleven digits are each multiplied by a position-dependent weight (6,5,4,3,2 for positions 1-5; 7,6,5,4,3,2 for positions 6-11), summed, taken Modulus-11, and the remainder subtracted from 11 (remainders of 0 or 1 both yield a check digit of 0).</p>\n<p><strong>Where to find it:</strong> Printed on the Individual Number Card (マイナンバーカード) and the paper Notification Card, and required when enrolling in Japan&#39;s National Health Insurance (国民健康保険).</p>\n<h2>Related components</h2>\n<ul>\n<li><code>nihon-kojin-bango-input</code> — an input for entering Japan&#39;s Individual Number / My Number (マイナンバー)</li>\n<li><code>summary-list-item</code> — one key-value pair in a summary list</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Wikipedia: <a href=\"https://en.wikipedia.org/wiki/Individual_Number\">Individual Number</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"nihon-kojin-bango-view\" aria-label=\"a read-only display of Japan's Individual Number (My Number)\">NihonKojinBangoView</div>";
  const svelteSource: string = "// In your Svelte component:\nimport NihonKojinBangoView from \"lily-design-system-svelte-headless/components/NihonKojinBangoView/NihonKojinBangoView.svelte\";\n\n<NihonKojinBangoView>\n  <!-- content -->\n</NihonKojinBangoView>\n";
  const usageCode: string = "<NihonKojinBangoView label=\"NihonKojinBangoView example\">Content</NihonKojinBangoView>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>NihonKojinBangoView — Lily Design System</title>
  <meta name="description" content="NihonKojinBangoView is a headless read-only display of Japan's Individual Number / My Number (マイナンバー), Japan's government-issued personal identifier. It renders as a &lt;span&gt; with an accessible label. It is the read-only companion to NihonKojinBangoInput." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/nihon-kojin-bango-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: nihon-kojin-bango-view</li>
      <li>PascalCase: NihonKojinBangoView</li>
      <li>Description: a read-only display of Japan's Individual Number / My Number (マイナンバー)</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .nihon-kojin-bango-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (default: "") — the identifier to display</li>
      <li><code>label</code>: string (required) — accessible name via <code>aria-label</code></li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
