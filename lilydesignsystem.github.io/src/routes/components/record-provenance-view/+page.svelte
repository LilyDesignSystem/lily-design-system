<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Record Provenance View</h1>\n<p>RecordProvenanceView is a headless read-only display of where a record came from: who wrote it, its source, when the thing it records happened and when it was recorded, its version, and whether it is signed or still only on this device. It renders as a <code>&lt;span&gt;</code> of parts, each in the consumer&#39;s words, with the states as <code>data-*</code> attributes.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;RecordProvenanceView\n  attestation=&quot;pending&quot;\n  attestationLabel=&quot;Awaiting signature&quot;\n  source=&quot;device&quot;\n  sourceLabel=&quot;From a blood pressure monitor&quot;\n  authorLabel=&quot;Dr A Patel&quot;\n  recorded=&quot;2026-11-03T09:00&quot;\n  recordedLabel=&quot;Recorded 09:00&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>attestation</code>: &quot;signed&quot; | &quot;pending&quot; | &quot;unsigned&quot; | &quot;amended&quot; | &quot;deleted&quot; (optional) — whether the record is signed; rendered as <code>data-attestation</code></li>\n<li><code>attestationLabel</code>: string (required with <code>attestation</code>) — that state in words (&quot;Awaiting signature&quot;)</li>\n<li><code>sync</code>: &quot;pending&quot; | &quot;failed&quot; (optional) — &quot;pending&quot; is saved on this device and not yet sent, &quot;failed&quot; could not be sent; rendered as <code>data-sync</code></li>\n<li><code>syncLabel</code>: string (required with <code>sync</code>) — that state in words</li>\n<li><code>source</code>: string (optional) — where the record came from, as the consumer&#39;s code (&quot;clinic&quot;, &quot;device&quot;, &quot;patient-reported&quot;, &quot;external&quot;, &quot;extracted&quot;); rendered as <code>data-source</code></li>\n<li><code>sourceLabel</code>: string (optional) — that source in words (&quot;From a blood pressure monitor&quot;)</li>\n<li><code>authorLabel</code>: string (optional) — who wrote or recorded it (&quot;Dr A Patel&quot;)</li>\n<li><code>observed</code>, <code>observedLabel</code>: string (optional) — when the thing recorded happened (ISO 8601, as <code>datetime</code>) and the consumer&#39;s words for it</li>\n<li><code>recorded</code>, <code>recordedLabel</code>: string (optional) — when it was recorded, the same way</li>\n<li><code>versionLabel</code>: string (optional) — the version in words (&quot;Version 3&quot;)</li>\n<li><code>label</code>: string (optional) — hidden text naming the provenance</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use beside a note, result or record whose signature state matters: a draft, a note awaiting a countersignature, an amended entry.</li>\n<li>Use for imported, device or patient-reported values, so a reader knows where they came from.</li>\n<li>Use in offline-capable apps for work saved on the device and not yet sent.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a record&#39;s review date alone — use <code>review-date</code>.</li>\n<li>Do not use for a list of versions — use <code>timeline-list</code> with a <code>diff</code>.</li>\n<li>Do not use for a person&#39;s identity — use the patient banner composition.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.record-provenance-view</code> class hook and its parts, and every word and every state.</p>\n<h2>Styles</h2>\n<p><code>.record-provenance-view</code>, its parts, and <code>[data-attestation]</code>, <code>[data-sync]</code>, <code>[data-source]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>The parts render in order, states first, each in the consumer&#39;s words</li>\n<li>An unsigned record shows its own state and words</li>\n<li>A state without words warns in development</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Say plainly what is not yet true: &quot;Awaiting signature&quot;, &quot;Not sent: saved on this device&quot;.</li>\n<li>Keep the observed and recorded times apart; a value entered today about last week is last week&#39;s value.</li>\n<li>Mark machine-extracted values as such (<code>source=&quot;extracted&quot;</code>) until a person has reviewed them.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;span class=&quot;record-provenance-view&quot;&gt;</code> with one part per fact given, signature and sync states first: <code>-attestation</code>, <code>-sync</code>, <code>-source</code>, <code>-author</code>, <code>-observed</code>, <code>-recorded</code>, <code>-version</code></li>\n<li><code>attestation</code>, <code>sync</code> and <code>source</code> render as <code>data-attestation</code>, <code>data-sync</code> and <code>data-source</code>; a state without words raises a development warning</li>\n<li>Observed-at and recorded-at are separate <code>&lt;time&gt;</code> parts, so a document&#39;s date is never read as the observation&#39;s</li>\n<li>A part with no words is left out</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>review-date</code> — when a record was last reviewed</li>\n<li><code>timeline-list</code> — a sequence of events, such as a record&#39;s versions</li>\n<li><code>record-list-item</code> — one record in a record list</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>openEHR AUDIT_DETAILS, ATTESTATION, FEEDER_AUDIT: <a href=\"https://specifications.openehr.org/releases/RM/latest/common.html\">https://specifications.openehr.org/releases/RM/latest/common.html</a></li>\n<li>FHIR Provenance: <a href=\"https://hl7.org/fhir/provenance.html\">https://hl7.org/fhir/provenance.html</a></li>\n<li>Spec: spec/lessons/openehr/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"record-provenance-view\" data-attestation=\"pending\" data-source=\"device\"><span class=\"record-provenance-view-attestation\">Awaiting signature</span> <span class=\"record-provenance-view-source\">From a blood pressure monitor</span> <span class=\"record-provenance-view-author\">Dr A Patel</span> <time class=\"record-provenance-view-recorded\" datetime=\"2026-11-03T09:00\">Recorded 09:00</time></span>";
  const svelteSource: string = "// In your Svelte component:\nimport RecordProvenanceView from \"lily-design-system-svelte-headless/components/RecordProvenanceView/RecordProvenanceView.svelte\";\n\n<RecordProvenanceView>\n  <!-- content -->\n</RecordProvenanceView>\n";
  const usageCode: string = "<RecordProvenanceView\n  attestation=\"pending\"\n  attestationLabel=\"Awaiting signature\"\n  authorLabel=\"Dr A Patel\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Record Provenance View — Lily Design System</title>
  <meta name="description" content="RecordProvenanceView is a headless read-only display of where a record came from: who wrote it, its source, when the thing it records happened and when it was recorded, its version, and whether it is signed or still only on this device. It renders as a &lt;span&gt; of parts, each in the consumer's word…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/record-provenance-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: record-provenance-view</li>
      <li>PascalCase: RecordProvenanceView</li>
      <li>Description: who recorded a record, where it came from and whether it is signed, in the consumer's words</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .record-provenance-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>attestation</code>: "signed" | "pending" | "unsigned" | "amended" | "deleted" (optional) — whether the record is signed; rendered as <code>data-attestation</code></li>
      <li><code>attestationLabel</code>: string (required with <code>attestation</code>) — that state in words ("Awaiting signature")</li>
      <li><code>sync</code>: "pending" | "failed" (optional) — "pending" is saved on this device and not yet sent, "failed" could not be sent; rendered as <code>data-sync</code></li>
      <li><code>syncLabel</code>: string (required with <code>sync</code>) — that state in words</li>
      <li><code>source</code>: string (optional) — where the record came from, as the consumer's code ("clinic", "device", "patient-reported", "external", "extracted"); rendered as <code>data-source</code></li>
      <li><code>sourceLabel</code>: string (optional) — that source in words ("From a blood pressure monitor")</li>
      <li><code>authorLabel</code>: string (optional) — who wrote or recorded it ("Dr A Patel")</li>
      <li><code>observed</code>, <code>observedLabel</code>: string (optional) — when the thing recorded happened (ISO 8601, as <code>datetime</code>) and the consumer's words for it</li>
      <li><code>recorded</code>, <code>recordedLabel</code>: string (optional) — when it was recorded, the same way</li>
      <li><code>versionLabel</code>: string (optional) — the version in words ("Version 3")</li>
      <li><code>label</code>: string (optional) — hidden text naming the provenance</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
