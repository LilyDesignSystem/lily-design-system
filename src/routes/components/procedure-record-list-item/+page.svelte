<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Procedure Record List Item</h1>\n<p>ProcedureRecordListItem is one procedure in a procedure record list, with its status and when it was performed. It renders as a <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ProcedureRecordListItem\n  procedure=&quot;Appendectomy&quot;\n  status=&quot;completed&quot;\n  statusLabel=&quot;Completed&quot;\n  performed=&quot;2018-04-22&quot;\n  performedLabel=&quot;22 Apr 2018&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>procedure</code>: string (required) — the procedure; never truncated</li>\n<li><code>status</code>: &quot;preparation&quot; | &quot;in-progress&quot; | &quot;not-done&quot; | &quot;on-hold&quot; | &quot;stopped&quot; | &quot;completed&quot; | &quot;entered-in-error&quot; | &quot;unknown&quot; (optional) — FHIR Procedure status; rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>\n<li><code>performed</code>: string (optional) — when it was performed, for &lt;time datetime&gt;</li>\n<li><code>performedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>procedure-record-list</code> for each entry.</li>\n<li>Use when the entry&#39;s statuses and dates matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a <code>procedure-record-list</code>.</li>\n<li>Do not use for &quot;none known&quot; or &quot;not recorded&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.procedure-record-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.procedure-record-list-item</code> and its parts, and <code>[data-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, each status as text and as <code>data-*</code>, dates as <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n<li>A status without words raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;procedure-record-list-item&quot;&gt;</code> with parts <code>-procedure</code>, <code>-status</code>, <code>-performed</code></li>\n<li><code>status</code> (<code>preparation</code>, <code>in-progress</code>, <code>not-done</code>, <code>on-hold</code>, <code>stopped</code>, <code>completed</code>, <code>entered-in-error</code>, <code>unknown</code>) renders as <code>data-status</code>, and <code>statusLabel</code> as text; a <code>status</code> without words raises a development warning</li>\n<li><code>-performed</code> is a <code>&lt;time datetime&gt;</code>, shown only when its label is given</li>\n<li>The procedure is never truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>procedure-record-list</code> — a list of a patient&#39;s procedures, whose status is never blank</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR Procedure: <a href=\"https://hl7.org/fhir/R4/procedure.html\">https://hl7.org/fhir/R4/procedure.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"procedure-record-list\" data-status=\"known\" aria-label=\"Procedures\"><li class=\"procedure-record-list-item\" data-status=\"completed\"><span class=\"procedure-record-list-item-procedure\">Appendectomy</span> <span class=\"procedure-record-list-item-status\">Completed</span> <time class=\"procedure-record-list-item-performed\" datetime=\"2018-04-22\">22 Apr 2018</time></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport ProcedureRecordListItem from \"lily-design-system-svelte-headless/components/ProcedureRecordListItem/ProcedureRecordListItem.svelte\";\n\n<ProcedureRecordListItem>\n  <!-- content -->\n</ProcedureRecordListItem>\n";
  const usageCode: string = "<ProcedureRecordListItem\n  procedure=\"Appendectomy\"\n  status=\"completed\"\n  statusLabel=\"Completed\"\n  performed=\"2018-04-22\"\n  performedLabel=\"22 Apr 2018\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Procedure Record List Item — Lily Design System</title>
  <meta name="description" content="ProcedureRecordListItem is one procedure in a procedure record list, with its status and when it was performed. It renders as a &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/procedure-record-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: procedure-record-list-item</li>
      <li>PascalCase: ProcedureRecordListItem</li>
      <li>Description: one procedure in a procedure record list, with its status and when it was performed</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .procedure-record-list-item</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>procedure</code>: string (required) — the procedure; never truncated</li>
      <li><code>status</code>: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown" (optional) — FHIR Procedure status; rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>
      <li><code>performed</code>: string (optional) — when it was performed, for &lt;time datetime&gt;</li>
      <li><code>performedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
