<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Problem Record List Item</h1>\n<p>ProblemRecordListItem is one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution. It renders as a <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ProblemRecordListItem\n  condition=&quot;Type 2 diabetes&quot;\n  clinicalStatus=&quot;active&quot;\n  clinicalStatusLabel=&quot;Active&quot;\n  verificationStatus=&quot;confirmed&quot;\n  verificationStatusLabel=&quot;Confirmed&quot;\n  severityLabel=&quot;Moderate&quot;\n  onset=&quot;2019-06-01&quot;\n  onsetLabel=&quot;Since June 2019&quot;\n  abatement=&quot;2024-01-15&quot;\n  abatementLabel=&quot;Resolved 15 Jan 2024&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>condition</code>: string (required) — the problem or condition; never truncated</li>\n<li><code>clinicalStatus</code>: &quot;active&quot; | &quot;recurrence&quot; | &quot;relapse&quot; | &quot;inactive&quot; | &quot;remission&quot; | &quot;resolved&quot; (optional) — FHIR Condition clinicalStatus; rendered as <code>data-clinical-status</code></li>\n<li><code>clinicalStatusLabel</code>: string (optional; required when <code>clinicalStatus</code> is set) — the clinicalStatus in words</li>\n<li><code>verificationStatus</code>: &quot;unconfirmed&quot; | &quot;provisional&quot; | &quot;differential&quot; | &quot;confirmed&quot; | &quot;refuted&quot; | &quot;entered-in-error&quot; (optional) — FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as <code>data-verification-status</code></li>\n<li><code>verificationStatusLabel</code>: string (optional; required when <code>verificationStatus</code> is set) — the verificationStatus in words</li>\n<li><code>severityLabel</code>: string (optional) — the severity in words</li>\n<li><code>onset</code>: string (optional) — when it began, for &lt;time datetime&gt;</li>\n<li><code>onsetLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>abatement</code>: string (optional) — when it resolved, for &lt;time datetime&gt;</li>\n<li><code>abatementLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>problem-record-list</code> for each entry.</li>\n<li>Use when the entry&#39;s statuses and dates matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a <code>problem-record-list</code>.</li>\n<li>Do not use for &quot;none known&quot; or &quot;not recorded&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.problem-record-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.problem-record-list-item</code> and its parts, and <code>[data-clinical-status]</code>, <code>[data-verification-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, each status as text and as <code>data-*</code>, dates as <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n<li>A status without words raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;problem-record-list-item&quot;&gt;</code> with parts <code>-condition</code>, <code>-clinical-status</code>, <code>-verification-status</code>, <code>-severity</code>, <code>-onset</code>, <code>-abatement</code></li>\n<li><code>clinicalStatus</code> (<code>active</code>, <code>recurrence</code>, <code>relapse</code>, <code>inactive</code>, <code>remission</code>, <code>resolved</code>) renders as <code>data-clinical-status</code>, and <code>clinicalStatusLabel</code> as text; a <code>clinicalStatus</code> without words raises a development warning</li>\n<li><code>verificationStatus</code> (<code>unconfirmed</code>, <code>provisional</code>, <code>differential</code>, <code>confirmed</code>, <code>refuted</code>, <code>entered-in-error</code>) renders as <code>data-verification-status</code>, and <code>verificationStatusLabel</code> as text; a <code>verificationStatus</code> without words raises a development warning</li>\n<li><code>-onset</code>, <code>-abatement</code> are each a <code>&lt;time datetime&gt;</code>, shown only when its label is given</li>\n<li>The condition is never truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>problem-record-list</code> — a list of a patient&#39;s problems and conditions, whose status is never blank</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR Condition: <a href=\"https://hl7.org/fhir/R4/condition.html\">https://hl7.org/fhir/R4/condition.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"problem-record-list\" data-status=\"known\" aria-label=\"Problems\"><li class=\"problem-record-list-item\" data-clinical-status=\"active\" data-verification-status=\"confirmed\"><span class=\"problem-record-list-item-condition\">Type 2 diabetes</span> <span class=\"problem-record-list-item-clinical-status\">Active</span> <span class=\"problem-record-list-item-verification-status\">Confirmed</span> <span class=\"problem-record-list-item-severity\">Moderate</span> <time class=\"problem-record-list-item-onset\" datetime=\"2019-06-01\">Since June 2019</time> <time class=\"problem-record-list-item-abatement\" datetime=\"2024-01-15\">Resolved 15 Jan 2024</time></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport ProblemRecordListItem from \"lily-design-system-svelte-headless/components/ProblemRecordListItem/ProblemRecordListItem.svelte\";\n\n<ProblemRecordListItem>\n  <!-- content -->\n</ProblemRecordListItem>\n";
  const usageCode: string = "<ProblemRecordListItem\n  condition=\"Type 2 diabetes\"\n  clinicalStatus=\"active\"\n  clinicalStatusLabel=\"Active\"\n  verificationStatus=\"confirmed\"\n  verificationStatusLabel=\"Confirmed\"\n  severityLabel=\"Moderate\"\n  onset=\"2019-06-01\"\n  onsetLabel=\"Since June 2019\"\n  abatement=\"2024-01-15\"\n  abatementLabel=\"Resolved 15 Jan 2024\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Problem Record List Item — Lily Design System</title>
  <meta name="description" content="ProblemRecordListItem is one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution. It renders as a &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/problem-record-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: problem-record-list-item</li>
      <li>PascalCase: ProblemRecordListItem</li>
      <li>Description: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .problem-record-list-item</li>
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
      <li><code>condition</code>: string (required) — the problem or condition; never truncated</li>
      <li><code>clinicalStatus</code>: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved" (optional) — FHIR Condition clinicalStatus; rendered as <code>data-clinical-status</code></li>
      <li><code>clinicalStatusLabel</code>: string (optional; required when <code>clinicalStatus</code> is set) — the clinicalStatus in words</li>
      <li><code>verificationStatus</code>: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as <code>data-verification-status</code></li>
      <li><code>verificationStatusLabel</code>: string (optional; required when <code>verificationStatus</code> is set) — the verificationStatus in words</li>
      <li><code>severityLabel</code>: string (optional) — the severity in words</li>
      <li><code>onset</code>: string (optional) — when it began, for &lt;time datetime&gt;</li>
      <li><code>onsetLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>abatement</code>: string (optional) — when it resolved, for &lt;time datetime&gt;</li>
      <li><code>abatementLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
