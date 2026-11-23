<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Allergy Record List</h1>\n<p>AllergyRecordList is a list of a patient&#39;s allergies and intolerances, whose status is never blank. It renders as a <code>&lt;ul&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AllergyRecordList\n  status=&quot;known&quot;\n  statusLabel=&quot;Known allergies&quot;\n&gt;\n  &lt;AllergyRecordListItem\n    substance=&quot;Penicillin&quot;\n    reaction=&quot;Anaphylaxis&quot;\n    severity=&quot;severe&quot;\n    severityLabel=&quot;Severe&quot;\n    criticality=&quot;high&quot;\n    criticalityLabel=&quot;High risk&quot;\n    clinicalStatus=&quot;active&quot;\n    clinicalStatusLabel=&quot;Active&quot;\n    verificationStatus=&quot;confirmed&quot;\n    verificationStatusLabel=&quot;Confirmed&quot;\n    typeLabel=&quot;Allergy&quot;\n    categoryLabel=&quot;Medication&quot;\n    updated=&quot;2026-11-03&quot;\n    updatedLabel=&quot;Updated 3 Nov 2026&quot;\n  /&gt;\n&lt;/AllergyRecordList&gt;\n\n&lt;AllergyRecordList\n  status=&quot;none-known&quot;\n  statusLabel=&quot;No known allergies&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>status</code>: &quot;known&quot; | &quot;none-known&quot; | &quot;not-recorded&quot; | &quot;unavailable&quot; | &quot;omitted&quot; | &quot;not-applicable&quot; (required) — rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (required) — the status in words; names the list, and is its one item unless status is <code>known</code></li>\n<li><code>label</code>: string (optional) — the accessible name, when it should differ from <code>statusLabel</code></li>\n<li><code>children</code>: slot (optional) — <code>allergy-record-list-item</code> items</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>A <code>&lt;ul&gt;</code> named by <code>aria-label</code>; the status is text, never an icon or a colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a patient&#39;s allergies, wherever a missing list could be misread.</li>\n<li>Use with <code>none-known</code>, <code>not-recorded</code>, <code>unavailable</code> or <code>omitted</code> when there is nothing to list: each is a different fact.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not leave the list empty for &quot;none&quot;: set <code>status</code> instead.</li>\n<li>Do not use for a list that is not part of a patient&#39;s record — use <code>list</code> or <code>summary-list</code>.</li>\n<li>For another part of the record, use its own record list, or <code>record-list</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.allergy-record-list</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.allergy-record-list</code>, <code>.allergy-record-list-status</code> and <code>[data-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each of the five statuses renders its consumer text; <code>known</code> renders only its items</li>\n<li><code>label</code> overrides the accessible name</li>\n<li>A missing status raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;ul class=&quot;allergy-record-list&quot;&gt;</code> named by <code>aria-label</code> (<code>label</code>, else <code>statusLabel</code>)</li>\n<li><code>status</code> is required and renders as <code>data-status</code>: <code>known</code>, <code>none-known</code>, <code>not-recorded</code>, <code>unavailable</code>, <code>omitted</code>, <code>not-applicable</code></li>\n<li>For any status but <code>known</code>, <code>statusLabel</code> is the list&#39;s one item, <code>li.allergy-record-list-status</code>, so the list is never blank</li>\n<li>Holds <code>allergy-record-list-item</code> items when the status is <code>known</code></li>\n<li>A missing <code>status</code> or <code>statusLabel</code> raises a development warning (Svelte, React, Vue, Angular)</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>allergy-record-list-item</code> — one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status</li>\n<li><code>record-list</code> and the other record lists — the same status contract for each part of a record</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>FHIR AllergyIntolerance: <a href=\"https://hl7.org/fhir/allergyintolerance.html\">https://hl7.org/fhir/allergyintolerance.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"allergy-record-list\" data-status=\"known\" aria-label=\"Known allergies\"><li class=\"allergy-record-list-item\" data-severity=\"severe\" data-criticality=\"high\" data-clinical-status=\"active\" data-verification-status=\"confirmed\"><span class=\"allergy-record-list-item-substance\">Penicillin</span> <span class=\"allergy-record-list-item-reaction\">Anaphylaxis</span> <span class=\"allergy-record-list-item-severity\">Severe</span> <span class=\"allergy-record-list-item-criticality\">High risk</span> <span class=\"allergy-record-list-item-clinical-status\">Active</span> <span class=\"allergy-record-list-item-verification-status\">Confirmed</span> <span class=\"allergy-record-list-item-type\">Allergy</span> <span class=\"allergy-record-list-item-category\">Medication</span> <time class=\"allergy-record-list-item-updated\" datetime=\"2026-11-03\">Updated 3 Nov 2026</time></li></ul><ul class=\"allergy-record-list\" data-status=\"none-known\" aria-label=\"No known allergies\"><li class=\"allergy-record-list-status\">No known allergies</li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport AllergyRecordList from \"lily-design-system-svelte-headless/components/AllergyRecordList/AllergyRecordList.svelte\";\n\n<AllergyRecordList>\n  <!-- content -->\n</AllergyRecordList>\n";
  const usageCode: string = "<AllergyRecordList\n  status=\"known\"\n  statusLabel=\"Known allergies\"\n>\n  <AllergyRecordListItem\n    substance=\"Penicillin\"\n    reaction=\"Anaphylaxis\"\n    severity=\"severe\"\n    severityLabel=\"Severe\"\n    criticality=\"high\"\n    criticalityLabel=\"High risk\"\n    clinicalStatus=\"active\"\n    clinicalStatusLabel=\"Active\"\n    verificationStatus=\"confirmed\"\n    verificationStatusLabel=\"Confirmed\"\n    typeLabel=\"Allergy\"\n    categoryLabel=\"Medication\"\n    updated=\"2026-11-03\"\n    updatedLabel=\"Updated 3 Nov 2026\"\n  />\n</AllergyRecordList>\n\n<AllergyRecordList\n  status=\"none-known\"\n  statusLabel=\"No known allergies\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Allergy Record List — Lily Design System</title>
  <meta name="description" content="AllergyRecordList is a list of a patient's allergies and intolerances, whose status is never blank. It renders as a &lt;ul&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/allergy-record-list/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: allergy-record-list</li>
      <li>PascalCase: AllergyRecordList</li>
      <li>Description: a list of a patient's allergies and intolerances, whose status is never blank</li>
      <li>Purpose: Lists a patient's allergies and intolerances, and never leaves the status blank.</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;ul&gt;</li>
      <li>CSS class: .allergy-record-list</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>A <code>&lt;ul&gt;</code> named by <code>aria-label</code>; the status is text, never an icon or a colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>status</code>: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (required) — the status in words; names the list, and is its one item unless status is <code>known</code></li>
      <li><code>label</code>: string (optional) — the accessible name, when it should differ from <code>statusLabel</code></li>
      <li><code>children</code>: slot (optional) — <code>allergy-record-list-item</code> items</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
