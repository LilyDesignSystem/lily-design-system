<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Allergy Record List Item</h1>\n<p>AllergyRecordListItem is one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status. It renders as a <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AllergyRecordListItem\n  substance=&quot;Penicillin&quot;\n  reaction=&quot;Anaphylaxis&quot;\n  severity=&quot;severe&quot;\n  severityLabel=&quot;Severe&quot;\n  criticality=&quot;high&quot;\n  criticalityLabel=&quot;High risk&quot;\n  clinicalStatus=&quot;active&quot;\n  clinicalStatusLabel=&quot;Active&quot;\n  verificationStatus=&quot;confirmed&quot;\n  verificationStatusLabel=&quot;Confirmed&quot;\n  typeLabel=&quot;Allergy&quot;\n  categoryLabel=&quot;Medication&quot;\n  updated=&quot;2026-11-03&quot;\n  updatedLabel=&quot;Updated 3 Nov 2026&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>subjectLabel</code>: string (optional) -- whose record it is, when it is not the patient&#39;s (&quot;Mother&quot;, &quot;Fetus 1&quot;); rendered first as <code>-subject</code>, so a relative&#39;s history is never read as the patient&#39;s</li>\n<li><code>substance</code>: string (required) — what the patient reacts to; never truncated</li>\n<li><code>reaction</code>: string (optional) — the manifestation</li>\n<li><code>severity</code>: &quot;mild&quot; | &quot;moderate&quot; | &quot;severe&quot; (optional) — the reaction&#39;s severity (FHIR reaction.severity); rendered as <code>data-severity</code></li>\n<li><code>severityLabel</code>: string (optional; required when <code>severity</code> is set) — the severity in words</li>\n<li><code>criticality</code>: &quot;low&quot; | &quot;high&quot; | &quot;unable-to-assess&quot; (optional) — the risk of a future reaction (FHIR criticality), not the severity of a past one; rendered as <code>data-criticality</code></li>\n<li><code>criticalityLabel</code>: string (optional; required when <code>criticality</code> is set) — the criticality in words</li>\n<li><code>clinicalStatus</code>: &quot;active&quot; | &quot;inactive&quot; | &quot;resolved&quot; (optional) — FHIR clinicalStatus; rendered as <code>data-clinical-status</code></li>\n<li><code>clinicalStatusLabel</code>: string (optional; required when <code>clinicalStatus</code> is set) — the clinicalStatus in words</li>\n<li><code>verificationStatus</code>: &quot;unconfirmed&quot; | &quot;presumed&quot; | &quot;confirmed&quot; | &quot;refuted&quot; | &quot;entered-in-error&quot; (optional) — FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as <code>data-verification-status</code></li>\n<li><code>verificationStatusLabel</code>: string (optional; required when <code>verificationStatus</code> is set) — the verificationStatus in words</li>\n<li><code>typeLabel</code>: string (optional) — allergy or intolerance, in words (FHIR type)</li>\n<li><code>categoryLabel</code>: string (optional) — food, medication, environment or biologic, in words (FHIR category)</li>\n<li><code>updated</code>: string (optional) — when the record was last updated</li>\n<li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>allergy-record-list</code> for each entry.</li>\n<li>Use when the entry&#39;s statuses and dates matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a <code>allergy-record-list</code>.</li>\n<li>Do not use for &quot;none known&quot; or &quot;not recorded&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.allergy-record-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.allergy-record-list-item</code> and its parts, and <code>[data-severity]</code>, <code>[data-criticality]</code>, <code>[data-clinical-status]</code>, <code>[data-verification-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, each status as text and as <code>data-*</code>, dates as <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n<li>A status without words raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;allergy-record-list-item&quot;&gt;</code> with parts <code>-substance</code>, <code>-reaction</code>, <code>-severity</code>, <code>-criticality</code>, <code>-clinical-status</code>, <code>-verification-status</code>, <code>-type</code>, <code>-category</code>, <code>-updated</code></li>\n<li><code>severity</code> (<code>mild</code>, <code>moderate</code>, <code>severe</code>) renders as <code>data-severity</code>, and <code>severityLabel</code> as text; a <code>severity</code> without words raises a development warning</li>\n<li><code>criticality</code> (<code>low</code>, <code>high</code>, <code>unable-to-assess</code>) renders as <code>data-criticality</code>, and <code>criticalityLabel</code> as text; a <code>criticality</code> without words raises a development warning</li>\n<li><code>clinicalStatus</code> (<code>active</code>, <code>inactive</code>, <code>resolved</code>) renders as <code>data-clinical-status</code>, and <code>clinicalStatusLabel</code> as text; a <code>clinicalStatus</code> without words raises a development warning</li>\n<li><code>verificationStatus</code> (<code>unconfirmed</code>, <code>presumed</code>, <code>confirmed</code>, <code>refuted</code>, <code>entered-in-error</code>) renders as <code>data-verification-status</code>, and <code>verificationStatusLabel</code> as text; a <code>verificationStatus</code> without words raises a development warning</li>\n<li><code>-updated</code> is a <code>&lt;time datetime&gt;</code>, shown only when its label is given</li>\n<li>The substance is never truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>allergy-record-list</code> — a list of a patient&#39;s allergies and intolerances, whose status is never blank</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR AllergyIntolerance: <a href=\"https://hl7.org/fhir/allergyintolerance.html\">https://hl7.org/fhir/allergyintolerance.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"allergy-record-list\" data-status=\"known\" aria-label=\"Known allergies\"><li class=\"allergy-record-list-item\" data-severity=\"severe\" data-criticality=\"high\" data-clinical-status=\"active\" data-verification-status=\"confirmed\"><span class=\"allergy-record-list-item-substance\">Penicillin</span> <span class=\"allergy-record-list-item-reaction\">Anaphylaxis</span> <span class=\"allergy-record-list-item-severity\">Severe</span> <span class=\"allergy-record-list-item-criticality\">High risk</span> <span class=\"allergy-record-list-item-clinical-status\">Active</span> <span class=\"allergy-record-list-item-verification-status\">Confirmed</span> <span class=\"allergy-record-list-item-type\">Allergy</span> <span class=\"allergy-record-list-item-category\">Medication</span> <time class=\"allergy-record-list-item-updated\" datetime=\"2026-11-03\">Updated 3 Nov 2026</time></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport AllergyRecordListItem from \"lily-design-system-svelte-headless/components/AllergyRecordListItem/AllergyRecordListItem.svelte\";\n\n<AllergyRecordListItem>\n  <!-- content -->\n</AllergyRecordListItem>\n";
  const usageCode: string = "<AllergyRecordListItem\n  substance=\"Penicillin\"\n  reaction=\"Anaphylaxis\"\n  severity=\"severe\"\n  severityLabel=\"Severe\"\n  criticality=\"high\"\n  criticalityLabel=\"High risk\"\n  clinicalStatus=\"active\"\n  clinicalStatusLabel=\"Active\"\n  verificationStatus=\"confirmed\"\n  verificationStatusLabel=\"Confirmed\"\n  typeLabel=\"Allergy\"\n  categoryLabel=\"Medication\"\n  updated=\"2026-11-03\"\n  updatedLabel=\"Updated 3 Nov 2026\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Allergy Record List Item — Lily Design System</title>
  <meta name="description" content="AllergyRecordListItem is one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status. It renders as a &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/allergy-record-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: allergy-record-list-item</li>
      <li>PascalCase: AllergyRecordListItem</li>
      <li>Description: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .allergy-record-list-item</li>
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
      <li><code>subjectLabel</code>: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as <code>-subject</code>, so a relative's history is never read as the patient's</li>
      <li><code>substance</code>: string (required) — what the patient reacts to; never truncated</li>
      <li><code>reaction</code>: string (optional) — the manifestation</li>
      <li><code>severity</code>: "mild" | "moderate" | "severe" (optional) — the reaction's severity (FHIR reaction.severity); rendered as <code>data-severity</code></li>
      <li><code>severityLabel</code>: string (optional; required when <code>severity</code> is set) — the severity in words</li>
      <li><code>criticality</code>: "low" | "high" | "unable-to-assess" (optional) — the risk of a future reaction (FHIR criticality), not the severity of a past one; rendered as <code>data-criticality</code></li>
      <li><code>criticalityLabel</code>: string (optional; required when <code>criticality</code> is set) — the criticality in words</li>
      <li><code>clinicalStatus</code>: "active" | "inactive" | "resolved" (optional) — FHIR clinicalStatus; rendered as <code>data-clinical-status</code></li>
      <li><code>clinicalStatusLabel</code>: string (optional; required when <code>clinicalStatus</code> is set) — the clinicalStatus in words</li>
      <li><code>verificationStatus</code>: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as <code>data-verification-status</code></li>
      <li><code>verificationStatusLabel</code>: string (optional; required when <code>verificationStatus</code> is set) — the verificationStatus in words</li>
      <li><code>typeLabel</code>: string (optional) — allergy or intolerance, in words (FHIR type)</li>
      <li><code>categoryLabel</code>: string (optional) — food, medication, environment or biologic, in words (FHIR category)</li>
      <li><code>updated</code>: string (optional) — when the record was last updated</li>
      <li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
