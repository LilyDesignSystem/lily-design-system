<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Medication Record List</h1>\n<p>MedicationRecordList is a list of a patient&#39;s medicines, whose status is never blank. It renders as a <code>&lt;ul&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;MedicationRecordList\n  status=&quot;known&quot;\n  statusLabel=&quot;Current medicines&quot;\n&gt;\n  &lt;MedicationRecordListItem\n    status=&quot;active&quot;\n    statusLabel=&quot;Active&quot;\n    effective=&quot;2025-03-03&quot;\n    effectiveLabel=&quot;Since 3 Mar 2025&quot;\n    &gt;ramipril 5 mg capsule, oral, once a day&lt;/MedicationRecordListItem\n  &gt;\n&lt;/MedicationRecordList&gt;\n\n&lt;MedicationRecordList\n  status=&quot;none-known&quot;\n  statusLabel=&quot;No known medicines&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>status</code>: &quot;known&quot; | &quot;none-known&quot; | &quot;not-recorded&quot; | &quot;unavailable&quot; | &quot;omitted&quot; | &quot;not-applicable&quot; (required) — rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (required) — the status in words; names the list, and is its one item unless status is <code>known</code></li>\n<li><code>label</code>: string (optional) — the accessible name, when it should differ from <code>statusLabel</code></li>\n<li><code>conflictLabel</code>: string (optional) — your words for a list that says none are known and holds an entry, shown instead of <code>statusLabel</code>; the list never says both</li>\n<li><code>children</code>: slot (optional) — <code>medication-record-list-item</code> items</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>A <code>&lt;ul&gt;</code> named by <code>aria-label</code>; the status is text, never an icon or a colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a patient&#39;s medicines, wherever a missing list could be misread.</li>\n<li>Use with <code>none-known</code>, <code>not-recorded</code>, <code>unavailable</code> or <code>omitted</code> when there is nothing to list: each is a different fact.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not leave the list empty for &quot;none&quot;: set <code>status</code> instead.</li>\n<li>Do not use for a list that is not part of a patient&#39;s record — use <code>list</code> or <code>summary-list</code>.</li>\n<li>For another part of the record, use its own record list, or <code>record-list</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.medication-record-list</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.medication-record-list</code>, <code>.medication-record-list-status</code> and <code>[data-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each of the five statuses renders its consumer text; <code>known</code> renders only its items</li>\n<li><code>label</code> overrides the accessible name</li>\n<li>A missing status raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>When <code>status</code> is <code>none-known</code> and the list holds an entry, the list never says both: the entry stays, and <code>conflictLabel</code>, your words for the conflict (&quot;This list also says none are known. Check the source record.&quot;), replaces <code>statusLabel</code> as the item and the name. Without it, the status words go. An entry that is refuted or entered in error does not count.</li>\n<li>Renders <code>&lt;ul class=&quot;medication-record-list&quot;&gt;</code> named by <code>aria-label</code> (<code>label</code>, else <code>statusLabel</code>)</li>\n<li><code>status</code> is required and renders as <code>data-status</code>: <code>known</code>, <code>none-known</code>, <code>not-recorded</code>, <code>unavailable</code>, <code>omitted</code>, <code>not-applicable</code></li>\n<li>For any status but <code>known</code>, <code>statusLabel</code> is the list&#39;s one item, <code>li.medication-record-list-status</code>, so the list is never blank</li>\n<li>Holds <code>medication-record-list-item</code> items when the status is <code>known</code></li>\n<li>A missing <code>status</code> or <code>statusLabel</code> raises a development warning (Svelte, React, Vue, Angular)</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>medication-record-list-item</code> — one medicine in a medication record list, with its status and when it applies</li>\n<li><code>record-list</code> and the other record lists — the same status contract for each part of a record</li>\n</ul>\n<h2>Known limitations</h2>\n<ul>\n<li>In Svelte, React, Solid, Vue and Angular the entries are read from the page, so HTML from a server shows the status as given until the script runs. Nunjucks and Blazor decide on the server. In HTML and Alpine the markup is yours: write <code>data-status=&quot;conflict&quot;</code> and your words.</li>\n<li>In Blazor and Compose only Lily&#39;s own items are counted.</li>\n<li>An entry about someone other than the patient counts.</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR MedicationStatement: <a href=\"https://hl7.org/fhir/R4/medicationstatement.html\">https://hl7.org/fhir/R4/medicationstatement.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"medication-record-list\" data-status=\"known\" aria-label=\"Current medicines\"><li class=\"medication-record-list-item\" data-status=\"active\">ramipril 5 mg capsule, oral, once a day <span class=\"medication-record-list-item-status\">Active</span> <time class=\"medication-record-list-item-effective\" datetime=\"2025-03-03\">Since 3 Mar 2025</time></li></ul><ul class=\"medication-record-list\" data-status=\"none-known\" aria-label=\"No known medicines\"><li class=\"medication-record-list-status\">No known medicines</li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport MedicationRecordList from \"lily-design-system-svelte-headless/components/MedicationRecordList/MedicationRecordList.svelte\";\n\n<MedicationRecordList>\n  <!-- content -->\n</MedicationRecordList>\n";
  const usageCode: string = "<MedicationRecordList\n  status=\"known\"\n  statusLabel=\"Current medicines\"\n>\n  <MedicationRecordListItem\n    status=\"active\"\n    statusLabel=\"Active\"\n    effective=\"2025-03-03\"\n    effectiveLabel=\"Since 3 Mar 2025\"\n    >ramipril 5 mg capsule, oral, once a day</MedicationRecordListItem\n  >\n</MedicationRecordList>\n\n<MedicationRecordList\n  status=\"none-known\"\n  statusLabel=\"No known medicines\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Medication Record List — Lily Design System</title>
  <meta name="description" content="MedicationRecordList is a list of a patient's medicines, whose status is never blank. It renders as a &lt;ul&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/medication-record-list/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: medication-record-list</li>
      <li>PascalCase: MedicationRecordList</li>
      <li>Description: a list of a patient's medicines, whose status is never blank</li>
      <li>Purpose: Lists a patient's medicines, and never leaves the status blank.</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;ul&gt;</li>
      <li>CSS class: .medication-record-list</li>
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
      <li><code>conflictLabel</code>: string (optional) — your words for a list that says none are known and holds an entry, shown instead of <code>statusLabel</code>; the list never says both</li>
      <li><code>children</code>: slot (optional) — <code>medication-record-list-item</code> items</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
