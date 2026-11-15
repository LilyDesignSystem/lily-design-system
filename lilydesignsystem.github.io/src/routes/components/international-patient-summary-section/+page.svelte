<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>International Patient Summary Section</h1>\n<p>One section of an <a href=\"../international-patient-summary/\">International Patient Summary</a>: a <code>&lt;section&gt;</code> named by its heading,\ncarrying the section&#39;s key, its LOINC code, its status and whether the IPS requires it. The entries are yours, usually a\nrecord list; the status is never blank; the document author&#39;s narrative can follow in a disclosure.</p>\n<p><strong>Status:</strong> experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;InternationalPatientSummarySection\n  section=&quot;problems&quot;\n  heading=&quot;Problem list&quot;\n  status=&quot;not-recorded&quot;\n  statusLabel=&quot;Not recorded&quot;\n&gt;\n  {#snippet narrative()}&lt;p&gt;No problems were recorded at discharge.&lt;/p&gt;{/snippet}\n&lt;/InternationalPatientSummarySection&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>section</code>: string (required) -- the IPS section key: <code>medications</code>, <code>allergies</code>, <code>problems</code>, <code>immunizations</code>, <code>results</code>,\n<code>procedures</code>, <code>devices</code>, <code>vital-signs</code>, <code>past-illness</code>, <code>functional-status</code>, <code>plan-of-care</code>, <code>social-history</code>, <code>pregnancy</code>,\n<code>advance-directives</code>, <code>alerts</code>, <code>patient-story</code>, or your own</li>\n<li><code>heading</code>: string (required) -- the heading</li>\n<li><code>headingLevel</code>: 2 to 6 (default: 2)</li>\n<li><code>status</code>: <code>known</code> | <code>none-known</code> | <code>not-recorded</code> | <code>unavailable</code> | <code>omitted</code> (default: <code>known</code>)</li>\n<li><code>statusLabel</code>: string -- the status in words; required for any status but <code>known</code></li>\n<li><code>code</code>: string (optional) -- the LOINC code</li>\n<li><code>required</code>: boolean (optional) -- override whether the IPS requires the section</li>\n<li><code>id</code>: string (optional) -- the element id</li>\n<li><code>idPrefix</code>: string (default: &quot;international-patient-summary&quot;) -- the same as its summary&#39;s; the default <code>id</code> is <code>{idPrefix}-{section}</code></li>\n<li><code>narrative</code>: slot (optional), <code>narrativeLabel</code>: string, <code>narrativeOpen</code>: boolean (default: false) -- the author&#39;s narrative</li>\n<li><code>children</code>: slot (optional) -- the entries</li>\n<li><code>...restProps</code>: any additional HTML attributes spread onto the section</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None of its own: the narrative&#39;s summary is native (Tab, then Enter or Space)</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>A <code>&lt;section&gt;</code> named by its heading: a region landmark</li>\n<li>The status is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside an <code>InternationalPatientSummary</code>, one per section of the document.</li>\n<li>Use when a section&#39;s emptiness must be told apart: none known, not recorded, unavailable, or missing from the document.</li>\n<li>Use to show the author&#39;s narrative beside the structured entries.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside a patient summary -- use a plain <code>&lt;section&gt;</code> with a heading, or <a href=\"../card/\">Card</a>.</li>\n<li>Do not use to say a list is empty -- the record lists carry their own status; use the section status for the section.</li>\n</ul>\n<h2>Headless</h2>\n<p>It renders the section&#39;s structure, data attributes and status words. Your entries and narrative are rendered as given.</p>\n<h2>Styles</h2>\n<p>Class hooks: <code>.international-patient-summary-section</code> and its <code>-heading</code>, <code>-status</code> and <code>-narrative</code> parts. Style a missing\nsection with <code>[data-status=&quot;omitted&quot;]</code> and a required one with <code>[data-required]</code>; always with the words, never instead of them.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify a <code>&lt;section&gt;</code> named by its heading, with <code>data-section</code>, <code>data-code</code>, <code>data-status</code> and <code>data-required</code></li>\n<li>Verify the status words for every status but <code>known</code></li>\n<li>Verify the narrative&#39;s <code>&lt;details&gt;</code> and its <code>open</code> state</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Developers</strong>: Open the narrative when a section has a narrative but no structured entries, so nothing is hidden.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;section id aria-labelledby&gt;</code> with an <code>hN</code> heading (<code>headingLevel</code>, default 2)</li>\n<li><code>data-section</code> (the key), <code>data-code</code> (the LOINC code, from the IPS registry unless given), <code>data-status</code> (default <code>known</code>) and\n<code>data-required=&quot;true&quot;</code> for the medication summary, allergies and problem list</li>\n<li>For any status but <code>known</code>, <code>statusLabel</code> is shown under the heading</li>\n<li>The narrative, when given, follows the entries in a <code>&lt;details&gt;</code>, open when <code>narrativeOpen</code></li>\n<li><code>id</code> defaults to <code>international-patient-summary-{section}</code>, the id the root&#39;s contents link to</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>international-patient-summary</code> — the whole summary</li>\n<li><code>allergy-record-list</code> and the other record lists — the entries</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>IPS Composition sections: <a href=\"https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html\">https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<section class=\"international-patient-summary-section\" id=\"international-patient-summary-problems\" aria-labelledby=\"international-patient-summary-problems-heading\" data-section=\"problems\" data-code=\"11450-4\" data-status=\"not-recorded\" data-required=\"true\"><h2 id=\"international-patient-summary-problems-heading\" class=\"international-patient-summary-section-heading\"> Problem list </h2><p class=\"international-patient-summary-section-status\">Not recorded</p><details class=\"international-patient-summary-section-narrative\"><summary>Narrative from the document</summary><p>No problems were recorded at discharge.</p></details></section>";
  const svelteSource: string = "// In your Svelte component:\nimport InternationalPatientSummarySection from \"lily-design-system-svelte-headless/components/InternationalPatientSummarySection/InternationalPatientSummarySection.svelte\";\n\n<InternationalPatientSummarySection>\n  <!-- content -->\n</InternationalPatientSummarySection>\n";
  const usageCode: string = "<InternationalPatientSummarySection\n  section=\"problems\"\n  heading=\"Problem list\"\n  status=\"not-recorded\"\n  statusLabel=\"Not recorded\"\n>\n  {#snippet narrative()}<p>No problems were recorded at discharge.</p>{/snippet}\n</InternationalPatientSummarySection>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>International Patient Summary Section — Lily Design System</title>
  <meta name="description" content="One section of an International Patient Summary: a &lt;section&gt; named by its heading," />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/international-patient-summary-section/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: international-patient-summary-section</li>
      <li>PascalCase: InternationalPatientSummarySection</li>
      <li>Description: one section of an International Patient Summary, with its LOINC code and a status that is never blank</li>
      <li>Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;section&gt;</li>
      <li>Naming exception: <code>-section</code> is not in the suffix table; it renders <code>&lt;section&gt;</code>, the element its name says</li>
      <li>CSS class: .international-patient-summary-section</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>&lt;section&gt;</code> named by its heading through <code>aria-labelledby</code>: a region landmark</li>
      <li>The status is text, never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None of its own: the narrative's <code>&lt;details&gt;</code> is native</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>section</code>: string (required) -- the IPS section key, such as <code>allergies</code></li>
      <li><code>heading</code>: string (required) -- the heading, the consumer's words</li>
      <li><code>headingLevel</code>: 2 to 6 (default: 2)</li>
      <li><code>status</code>: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" (default: "known")</li>
      <li><code>statusLabel</code>: string -- the status in words; required for any status but <code>known</code></li>
      <li><code>code</code>: string (optional) -- the LOINC code; default the IPS code for the key</li>
      <li><code>required</code>: boolean (optional) -- default whether the IPS requires the section</li>
      <li><code>id</code>: string (optional) -- default <code>international-patient-summary-&#123;section&#125;</code></li>
      <li><code>idPrefix</code>: string (default: "international-patient-summary") -- the same as its summary's; the default <code>id</code> is <code>&#123;idPrefix&#125;-&#123;section&#125;</code></li>
      <li><code>narrative</code>: slot (optional) -- the author's narrative</li>
      <li><code>narrativeLabel</code>: string -- the narrative's summary; required with <code>narrative</code></li>
      <li><code>narrativeOpen</code>: boolean (default: false) -- open the narrative, as when the section has no structured entries</li>
      <li><code>children</code>: slot (optional) -- the entries</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the section</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
