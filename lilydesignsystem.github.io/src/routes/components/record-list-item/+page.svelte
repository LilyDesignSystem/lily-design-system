<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Record List Item</h1>\n<p>RecordListItem is one record in a record list, with its status and last update around the consumer&#39;s content. It renders as a <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;RecordListItem\n  status=&quot;final&quot;\n  statusLabel=&quot;Final&quot;\n  updated=&quot;2026-11-03&quot;\n  updatedLabel=&quot;Updated 3 Nov 2026&quot;\n&gt;\n  Blood pressure 128/82 mmHg\n&lt;/RecordListItem&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>subjectLabel</code>: string (optional) -- whose record it is, when it is not the patient&#39;s (&quot;Mother&quot;, &quot;Fetus 1&quot;); rendered first as <code>-subject</code>, so a relative&#39;s history is never read as the patient&#39;s</li>\n<li><code>children</code>: slot — the record itself, written by the consumer</li>\n<li><code>status</code>: string (optional) — the record&#39;s status, as the consumer&#39;s code; rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>\n<li><code>updated</code>: string (optional) — when the record was last updated</li>\n<li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n<li><code>entryState</code>: <code>&quot;withheld&quot;</code> | <code>&quot;entered-in-error&quot;</code> (optional) -- a withheld record shows only <code>entryStateLabel</code>, never its content; one entered in error keeps its content struck through in <code>&lt;del class=&quot;record-list-item-entry&quot;&gt;</code>, with <code>entryStateLabel</code>. Rendered as <code>data-entry-state</code>; neither is ever silently removed (spec/lessons/zoblocks)</li>\n<li><code>entryStateLabel</code>: string -- that state in the consumer&#39;s words, in <code>-entry-state</code>; required with <code>entryState</code> (a development warning says so)</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; every status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>record-list</code> for each entry.</li>\n<li>Use when the entry&#39;s statuses and dates matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a <code>record-list</code>.</li>\n<li>Do not use for &quot;none known&quot; or &quot;not recorded&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.record-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.record-list-item</code> and its parts, and <code>[data-status]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, each status as text and as <code>data-*</code>, dates as <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n<li>A status without words raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Take every word from your own translation, including the status words; Lily ships none.</li>\n<li>Map FHIR codes to these values in your code; Lily does not read FHIR resources.</li>\n<li>Format dates with <code>Intl.DateTimeFormat</code>, with the month as text so they cannot be read two ways.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;record-list-item&quot;&gt;</code> with parts <code>-status</code>, <code>-updated</code></li>\n<li><code>status</code> (the consumer&#39;s code) renders as <code>data-status</code>, and <code>statusLabel</code> as text; a <code>status</code> without words raises a development warning</li>\n<li><code>-updated</code> is a <code>&lt;time datetime&gt;</code>, shown only when its label is given</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>record-list</code> — a list of records from one section of a patient&#39;s record, whose status is never blank</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>IPS Composition section: <a href=\"https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html\">https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"record-list\" data-status=\"known\" aria-label=\"Vital signs\"><li class=\"record-list-item\" data-status=\"final\">Blood pressure 128/82 mmHg <span class=\"record-list-item-status\">Final</span> <time class=\"record-list-item-updated\" datetime=\"2026-11-03\">Updated 3 Nov 2026</time></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport RecordListItem from \"lily-design-system-svelte-headless/components/RecordListItem/RecordListItem.svelte\";\n\n<RecordListItem>\n  <!-- content -->\n</RecordListItem>\n";
  const usageCode: string = "<RecordListItem\n  status=\"final\"\n  statusLabel=\"Final\"\n  updated=\"2026-11-03\"\n  updatedLabel=\"Updated 3 Nov 2026\"\n>\n  Blood pressure 128/82 mmHg\n</RecordListItem>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Record List Item — Lily Design System</title>
  <meta name="description" content="RecordListItem is one record in a record list, with its status and last update around the consumer's content. It renders as a &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/record-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: record-list-item</li>
      <li>PascalCase: RecordListItem</li>
      <li>Description: one record in a record list, with its status and last update around the consumer's content</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .record-list-item</li>
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
      <li><code>children</code>: slot — the record itself, written by the consumer</li>
      <li><code>status</code>: string (optional) — the record's status, as the consumer's code; rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (optional; required when <code>status</code> is set) — the status in words</li>
      <li><code>updated</code>: string (optional) — when the record was last updated</li>
      <li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it; the <code>&lt;time&gt;</code> shows only when set</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
      <li><code>entryState</code>: <code>"withheld"</code> | <code>"entered-in-error"</code> (optional) -- a withheld record shows only <code>entryStateLabel</code>, never its content; one entered in error keeps its content struck through in <code>&lt;del class="record-list-item-entry"&gt;</code>, with <code>entryStateLabel</code>. Rendered as <code>data-entry-state</code>; neither is ever silently removed (spec/lessons/zoblocks)</li>
      <li><code>entryStateLabel</code>: string -- that state in the consumer's words, in <code>-entry-state</code>; required with <code>entryState</code> (a development warning says so)</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
