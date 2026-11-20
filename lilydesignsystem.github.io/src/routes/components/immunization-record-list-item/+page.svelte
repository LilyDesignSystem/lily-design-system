<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Immunization Record List Item</h1>\n<p>ImmunizationRecordListItem is one immunization in an immunization record list, with vaccine, date, dose and status. It renders as a <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ImmunizationRecordListItem\n  vaccine=&quot;MMR vaccine&quot;\n  occurrence=&quot;2025-09-12&quot;\n  occurrenceLabel=&quot;12 Sep 2025&quot;\n  doseNumberLabel=&quot;Dose 2 of 2&quot;\n  status=&quot;completed&quot;\n  statusLabel=&quot;Given&quot;\n  lotNumber=&quot;AB1234&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>subjectLabel</code>: string (optional) -- whose record it is, when it is not the patient&#39;s (&quot;Mother&quot;, &quot;Fetus 1&quot;); rendered first as <code>-subject</code>, so a relative&#39;s history is never read as the patient&#39;s</li>\n<li><code>vaccine</code>: string (required) — the vaccine given; never truncated</li>\n<li><code>occurrence</code>: string (optional) — when it was given, for &lt;time datetime&gt;</li>\n<li><code>occurrenceLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>doseNumberLabel</code>: string (optional) — the dose in words (&quot;Dose 2 of 2&quot;)</li>\n<li><code>status</code>: &quot;completed&quot; | &quot;entered-in-error&quot; | &quot;not-done&quot; (optional) — FHIR Immunization status; rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>\n<li><code>lotNumber</code>: string (optional) — the vaccine&#39;s lot number</li>\n<li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>immunization-record-list</code> for each entry.</li>\n<li>Use when the entry&#39;s statuses and dates matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a <code>immunization-record-list</code>.</li>\n<li>Do not use for &quot;none known&quot; or &quot;not recorded&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.immunization-record-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.immunization-record-list-item</code> and its parts, and <code>[data-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, each status as text and as <code>data-*</code>, dates as <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n<li>A status without words raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;immunization-record-list-item&quot;&gt;</code> with parts <code>-vaccine</code>, <code>-occurrence</code>, <code>-dose-number</code>, <code>-status</code>, <code>-lot-number</code></li>\n<li><code>status</code> (<code>completed</code>, <code>entered-in-error</code>, <code>not-done</code>) renders as <code>data-status</code>, and <code>statusLabel</code> as text; a <code>status</code> without words raises a development warning</li>\n<li><code>-occurrence</code> is a <code>&lt;time datetime&gt;</code>, shown only when its label is given</li>\n<li>The vaccine is never truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>immunization-record-list</code> — a list of a patient&#39;s immunizations, whose status is never blank</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>FHIR Immunization: <a href=\"https://hl7.org/fhir/R4/immunization.html\">https://hl7.org/fhir/R4/immunization.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"immunization-record-list\" data-status=\"known\" aria-label=\"Immunizations\"><li class=\"immunization-record-list-item\" data-status=\"completed\"><span class=\"immunization-record-list-item-vaccine\">MMR vaccine</span> <time class=\"immunization-record-list-item-occurrence\" datetime=\"2025-09-12\">12 Sep 2025</time> <span class=\"immunization-record-list-item-dose-number\">Dose 2 of 2</span> <span class=\"immunization-record-list-item-status\">Given</span> <span class=\"immunization-record-list-item-lot-number\">AB1234</span></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport ImmunizationRecordListItem from \"lily-design-system-svelte-headless/components/ImmunizationRecordListItem/ImmunizationRecordListItem.svelte\";\n\n<ImmunizationRecordListItem>\n  <!-- content -->\n</ImmunizationRecordListItem>\n";
  const usageCode: string = "<ImmunizationRecordListItem\n  vaccine=\"MMR vaccine\"\n  occurrence=\"2025-09-12\"\n  occurrenceLabel=\"12 Sep 2025\"\n  doseNumberLabel=\"Dose 2 of 2\"\n  status=\"completed\"\n  statusLabel=\"Given\"\n  lotNumber=\"AB1234\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Immunization Record List Item — Lily Design System</title>
  <meta name="description" content="ImmunizationRecordListItem is one immunization in an immunization record list, with vaccine, date, dose and status. It renders as a &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/immunization-record-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: immunization-record-list-item</li>
      <li>PascalCase: ImmunizationRecordListItem</li>
      <li>Description: one immunization in an immunization record list, with vaccine, date, dose and status</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .immunization-record-list-item</li>
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
      <li><code>vaccine</code>: string (required) — the vaccine given; never truncated</li>
      <li><code>occurrence</code>: string (optional) — when it was given, for &lt;time datetime&gt;</li>
      <li><code>occurrenceLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>doseNumberLabel</code>: string (optional) — the dose in words ("Dose 2 of 2")</li>
      <li><code>status</code>: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>
      <li><code>lotNumber</code>: string (optional) — the vaccine's lot number</li>
      <li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
