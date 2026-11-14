<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Allergy Record List</h1>\n<p>AllergyRecordList is a headless list of a patient&#39;s allergies and intolerances. It renders as a <code>&lt;ul&gt;</code>. Its status is required, because &quot;no known allergies&quot;, &quot;allergies not recorded&quot; and &quot;allergies unavailable&quot; are different facts, and an empty list could be read as any of them.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AllergyRecordList\n  status=&quot;known&quot;\n  statusLabel=&quot;Known allergies&quot;\n&gt;\n  &lt;AllergyRecordListItem\n    substance=&quot;Penicillin&quot;\n    reaction=&quot;Anaphylaxis&quot;\n    severity=&quot;severe&quot;\n    severityLabel=&quot;Severe&quot;\n  /&gt;\n&lt;/AllergyRecordList&gt;\n\n&lt;AllergyRecordList\n  status=&quot;none-known&quot;\n  statusLabel=&quot;No known allergies&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>status</code>: &quot;known&quot; | &quot;none-known&quot; | &quot;not-recorded&quot; | &quot;unavailable&quot; (required) — rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (required) — the status in words; names the list, and is its one item unless status is <code>known</code></li>\n<li><code>label</code>: string (optional) — the accessible name, when it should differ from <code>statusLabel</code></li>\n<li><code>children</code>: slot (optional) — <code>allergy-record-list-item</code> items</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>A <code>&lt;ul&gt;</code> named by <code>aria-label</code> (the status words, or <code>label</code>). The status is text, never an icon or a colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a patient&#39;s allergies in a patient banner, summary or prescribing screen.</li>\n<li>Use whenever the absence of allergies must be distinguished from allergies not being recorded.</li>\n<li>Use with <code>medical-banner-box-for-danger</code> to keep known allergies prominent.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a general list — use <code>bullet-list</code> or <code>description-list</code>.</li>\n<li>Do not use to edit allergies — use a <code>form</code> with <code>field</code> and <code>text-input</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.allergy-record-list</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.allergy-record-list</code>, <code>.allergy-record-list-status</code>, and the <code>[data-status]</code> attribute (for example, the strongest emphasis on <code>known</code>).</p>\n<h2>Testing</h2>\n<ul>\n<li>Each status renders its words; for statuses other than <code>known</code> they are the one item</li>\n<li>The list is named by its status</li>\n<li>A missing status raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Show when each allergy record was last updated, and link to the full record.</li>\n<li>Do not show clinical information such as allergies to people who should not see it; that is the consumer&#39;s access control.</li>\n<li>Never abbreviate the status words.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;ul class=&quot;allergy-record-list&quot;&gt;</code> with <code>data-status</code> and <code>aria-label</code></li>\n<li><code>status</code> is required: <code>known</code>, <code>none-known</code>, <code>not-recorded</code> or <code>unavailable</code></li>\n<li>For any status but <code>known</code>, <code>statusLabel</code> is the list&#39;s one item, <code>li.allergy-record-list-status</code>, so the list is never blank</li>\n<li>Holds <code>allergy-record-list-item</code> children for status <code>known</code></li>\n<li>A missing <code>status</code> or <code>statusLabel</code> raises a development warning</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>allergy-record-list-item</code> — one allergy or intolerance in an allergy list</li>\n<li><code>medical-banner-box-for-danger</code> — a medical record banner box for danger information</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR AllergyIntolerance: <a href=\"https://hl7.org/fhir/allergyintolerance.html\">https://hl7.org/fhir/allergyintolerance.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"allergy-record-list\" data-status=\"known\" aria-label=\"Known allergies\"><li class=\"allergy-record-list-item\" data-severity=\"severe\"><span class=\"allergy-record-list-item-substance\">Penicillin</span> <span class=\"allergy-record-list-item-reaction\">Anaphylaxis</span> <span class=\"allergy-record-list-item-severity\">Severe</span></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport AllergyRecordList from \"lily-design-system-svelte-headless/components/AllergyRecordList/AllergyRecordList.svelte\";\n\n<AllergyRecordList>\n  <!-- content -->\n</AllergyRecordList>\n";
  const usageCode: string = "<AllergyRecordList\n  status=\"known\"\n  statusLabel=\"Known allergies\"\n>\n  <AllergyRecordListItem\n    substance=\"Penicillin\"\n    reaction=\"Anaphylaxis\"\n    severity=\"severe\"\n    severityLabel=\"Severe\"\n  />\n</AllergyRecordList>\n\n<AllergyRecordList\n  status=\"none-known\"\n  statusLabel=\"No known allergies\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>AllergyRecordList — Lily Design System</title>
  <meta name="description" content="AllergyRecordList is a headless list of a patient's allergies and intolerances. It renders as a &lt;ul&gt;. Its status is required, because &quot;no known allergies&quot;, &quot;allergies not recorded&quot; and &quot;allergies unavailable&quot; are different facts, and an empty list could be read as any of them." />
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
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;ul&gt;</li>
      <li>CSS class: .allergy-record-list</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>A <code>&lt;ul&gt;</code> named by <code>aria-label</code> (the status words, or <code>label</code>). The status is text, never an icon or a colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>status</code>: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (required) — the status in words; names the list, and is its one item unless status is <code>known</code></li>
      <li><code>label</code>: string (optional) — the accessible name, when it should differ from <code>statusLabel</code></li>
      <li><code>children</code>: slot (optional) — <code>allergy-record-list-item</code> items</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
