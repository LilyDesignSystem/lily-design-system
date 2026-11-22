<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>International Patient Summary</h1>\n<p>An International Patient Summary (IPS) is &quot;a minimal and non-exhaustive patient summary dataset, specialty-agnostic,\ncondition-independent, but readily usable by clinicians for the cross-border unscheduled care of a patient&quot; (HL7 FHIR IPS,\nISO 27269). <code>InternationalPatientSummary</code> lays one out for a clinician: the patient banner, a contents navigation, the\nsections in the document&#39;s order, and the document&#39;s details. It is structure only: Lily parses no FHIR. Your app reads the\ndocument and renders each section&#39;s entries with the record lists; this component holds them together and makes sure a\nrequired section is never silently missing.</p>\n<p><strong>Status:</strong> experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;InternationalPatientSummary\n  label=&quot;Patient summary&quot;\n  contentsLabel=&quot;Contents&quot;\n  omittedLabel=&quot;Section missing from document&quot;\n  requiredHeadings={{\n    medications: &quot;Medication summary&quot;,\n    allergies: &quot;Allergies and intolerances&quot;,\n    problems: &quot;Problem list&quot;,\n  }}\n  sections={[\n    { key: &quot;allergies&quot;, heading: &quot;Allergies and intolerances&quot; },\n    { key: &quot;problems&quot;, heading: &quot;Problem list&quot;, status: &quot;none-known&quot; },\n  ]}\n&gt;\n  &lt;InternationalPatientSummarySection\n    section=&quot;allergies&quot;\n    heading=&quot;Allergies and intolerances&quot;\n  &gt;\n    &lt;AllergyRecordList\n      status=&quot;known&quot;\n      statusLabel=&quot;Allergies&quot;\n    &gt;\n      &lt;AllergyRecordListItem\n        substance=&quot;Penicillin&quot;\n        criticality=&quot;high&quot;\n        criticalityLabel=&quot;High risk&quot;\n      /&gt;\n    &lt;/AllergyRecordList&gt;\n  &lt;/InternationalPatientSummarySection&gt;\n  &lt;InternationalPatientSummarySection\n    section=&quot;problems&quot;\n    heading=&quot;Problem list&quot;\n    status=&quot;none-known&quot;\n    statusLabel=&quot;No known problems&quot;\n  /&gt;\n&lt;/InternationalPatientSummary&gt;\n</code></pre>\n<p>The medication summary is missing from the document, so the component adds it, after the problem list:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;section\n  class=&quot;international-patient-summary-section&quot;\n  id=&quot;international-patient-summary-medications&quot;\n  aria-labelledby=&quot;international-patient-summary-medications-heading&quot;\n  data-section=&quot;medications&quot;\n  data-code=&quot;10160-0&quot;\n  data-status=&quot;omitted&quot;\n  data-required=&quot;true&quot;\n&gt;\n  &lt;h2\n    id=&quot;international-patient-summary-medications-heading&quot;\n    class=&quot;international-patient-summary-section-heading&quot;\n  &gt;\n    Medication summary\n  &lt;/h2&gt;\n  &lt;p class=&quot;international-patient-summary-section-status&quot;&gt;Section missing from document&lt;/p&gt;\n&lt;/section&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) -- the article&#39;s accessible name</li>\n<li><code>sections</code>: <code>{ key, heading, status?, id? }[]</code> (default: <code>[]</code>) -- the sections you render, in document order</li>\n<li><code>requiredHeadings</code>: <code>{ medications, allergies, problems }</code> (required) -- headings for an added, missing required section</li>\n<li><code>omittedLabel</code>: string (required) -- the words an added section shows</li>\n<li><code>contentsLabel</code>: string (optional) -- names the contents navigation; without it there is none</li>\n<li><code>headingLevel</code>: 2 to 6 (default: 2) -- the heading level of an added section</li>\n<li><code>idPrefix</code>: string (default: &quot;international-patient-summary&quot;) -- section ids are <code>{idPrefix}-{key}</code>; give each summary on a page its own, and pass the same to its sections</li>\n<li><code>banner</code>: slot (optional) -- the patient banner</li>\n<li><code>details</code>: slot (optional) -- the document&#39;s details (title, date, authors, custodian, IPS version)</li>\n<li><code>children</code>: slot (optional) -- the <code>InternationalPatientSummarySection</code> elements</li>\n<li><code>...restProps</code>: any additional HTML attributes spread onto the article</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None of its own. Tab reaches the contents links and each narrative&#39;s summary; Enter follows a link and Enter or Space opens a\nnarrative (native behaviour)</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>&lt;article aria-label&gt;</code>: a self-contained document, named</li>\n<li><code>&lt;nav aria-label&gt;</code>: the contents</li>\n<li>Each section is a region named by its heading, so a screen reader can list and jump to them</li>\n<li>Every status is words, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a patient summary received from another service or country, such as an IPS from a FHIR server or a SMART Health Link.</li>\n<li>Use when a clinician needs the required sections (medications, allergies, problems) every time, even when the document lacks one.</li>\n<li>Use for any summary built on the IPS section model, with your own section renderers inside.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for one list on its own -- use <a href=\"../allergy-record-list/\">AllergyRecordList</a> or another record list directly.</li>\n<li>Do not use for the patient identity strip alone -- use the patient banner pattern on <a href=\"../medical-banner/\">MedicalBanner</a>.</li>\n<li>Do not use for an editable record -- this is a read-only view; use <a href=\"../form/\">Form</a> and its fields.</li>\n<li>Do not use for a non-clinical document -- use <a href=\"../article-layout/\">ArticleLayout</a> with headings and <a href=\"../contents-nav/\">ContentsNav</a>.</li>\n</ul>\n<h2>Headless</h2>\n<p>The component renders the structure, the contents links and the added omitted sections. It reads no FHIR, makes no clinical\ndecision and ships no words: every heading and status is yours, and the narrative is yours to sanitise.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. Class hooks: <code>.international-patient-summary</code> and its <code>-banner</code>, <code>-contents</code>, <code>-sections</code>\nand <code>-details</code> parts; each contents <code>li</code> has <code>data-section</code> and <code>data-status</code>. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify an <code>&lt;article&gt;</code> named by <code>label</code></li>\n<li>Verify a missing required section is added with <code>data-status=&quot;omitted&quot;</code>, the given heading and <code>omittedLabel</code></li>\n<li>Verify the contents follow the given order, then the added sections, and link to the section ids</li>\n<li>Verify the banner comes first and the details last</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Clinicians and designers</strong>: Keep the danger box (high-criticality allergies, active alerts) in the banner, never behind a\ncollapsed control.</li>\n<li><strong>Developers</strong>: Pass <code>sections</code> from the same data you render, so the contents and the sections cannot disagree. Sanitise the\nauthor&#39;s narrative before you render it. Say in your footer that the viewer is not a medical device, if that is so.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders an <code>&lt;article&gt;</code> named by <code>label</code>, holding the banner, the contents <code>&lt;nav&gt;</code>, the sections and the document details, each\nin its own part (<code>-banner</code>, <code>-contents</code>, <code>-sections</code>, <code>-details</code>)</li>\n<li>Takes <code>sections</code> as plain data (<code>key</code>, <code>heading</code>, <code>status</code>, <code>id</code>) in the document&#39;s order; the contents navigation is built from it</li>\n<li>The IPS requires three sections: medication summary, allergies and intolerances, problem list. For each one <code>sections</code> lacks,\nthe component adds an <code>international-patient-summary-section</code> with <code>status=&quot;omitted&quot;</code>, your heading from <code>requiredHeadings</code>\nand your <code>omittedLabel</code> (&quot;Section missing from document&quot;), after the given sections, with a contents link to it</li>\n<li>Section ids default to <code>international-patient-summary-{key}</code>, on both the link and the section, so they agree without wiring</li>\n<li>The registry of the sixteen IPS 2.0.1 sections, with their LOINC codes and levels, is exported as <code>IPS_SECTIONS</code> (with\n<code>ipsContents</code>, <code>ipsMissingRequired</code>, <code>ipsSectionCode</code>) by the TypeScript catalogs</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>international-patient-summary-section</code> — one section, with its LOINC code and status</li>\n<li><code>allergy-record-list</code>, <code>medication-record-list</code>, <code>problem-record-list</code>, <code>immunization-record-list</code>, <code>procedure-record-list</code>,\n<code>device-record-list</code>, <code>record-list</code> — the sections&#39; entries</li>\n<li><code>observation-view</code> — results and vital signs in a <code>data-table</code></li>\n<li><code>medical-banner</code> — the patient banner</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>IPS Implementation Guide (HL7 FHIR, 2.0.1): <a href=\"https://hl7.org/fhir/uv/ips/\">https://hl7.org/fhir/uv/ips/</a></li>\n<li>ISO 27269:2025 Health informatics — International patient summary</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<article class=\"international-patient-summary\" aria-label=\"Patient summary\"><div class=\"international-patient-summary-banner\"></div><nav class=\"international-patient-summary-contents\" aria-label=\"Contents\"><ol><li data-section=\"allergies\" data-status=\"known\"><a href=\"#international-patient-summary-allergies\">Allergies and intolerances</a></li><li data-section=\"problems\" data-status=\"none-known\"><a href=\"#international-patient-summary-problems\">Problem list</a></li><li data-section=\"medications\" data-status=\"omitted\"><a href=\"#international-patient-summary-medications\">Medication summary</a></li></ol></nav><div class=\"international-patient-summary-sections\"><section class=\"international-patient-summary-section\" id=\"international-patient-summary-allergies\" aria-labelledby=\"international-patient-summary-allergies-heading\" data-section=\"allergies\" data-code=\"48765-2\" data-status=\"known\" data-required=\"true\"><h2 id=\"international-patient-summary-allergies-heading\" class=\"international-patient-summary-section-heading\"> Allergies and intolerances </h2></section><section class=\"international-patient-summary-section\" id=\"international-patient-summary-problems\" aria-labelledby=\"international-patient-summary-problems-heading\" data-section=\"problems\" data-code=\"11450-4\" data-status=\"none-known\" data-required=\"true\"><h2 id=\"international-patient-summary-problems-heading\" class=\"international-patient-summary-section-heading\"> Problem list </h2><p class=\"international-patient-summary-section-status\">No known problems</p></section><section class=\"international-patient-summary-section\" id=\"international-patient-summary-medications\" aria-labelledby=\"international-patient-summary-medications-heading\" data-section=\"medications\" data-code=\"10160-0\" data-status=\"omitted\" data-required=\"true\"><h2 id=\"international-patient-summary-medications-heading\" class=\"international-patient-summary-section-heading\"> Medication summary </h2><p class=\"international-patient-summary-section-status\">Section missing from document</p></section></div><div class=\"international-patient-summary-details\"></div></article>";
  const svelteSource: string = "// In your Svelte component:\nimport InternationalPatientSummary from \"lily-design-system-svelte-headless/components/InternationalPatientSummary/InternationalPatientSummary.svelte\";\n\n<InternationalPatientSummary>\n  <!-- content -->\n</InternationalPatientSummary>\n";
  const usageCode: string = "<InternationalPatientSummary\n  label=\"Patient summary\"\n  contentsLabel=\"Contents\"\n  omittedLabel=\"Section missing from document\"\n  requiredHeadings={{\n    medications: \"Medication summary\",\n    allergies: \"Allergies and intolerances\",\n    problems: \"Problem list\",\n  }}\n  sections={[\n    { key: \"allergies\", heading: \"Allergies and intolerances\" },\n    { key: \"problems\", heading: \"Problem list\", status: \"none-known\" },\n  ]}\n>\n  <InternationalPatientSummarySection\n    section=\"allergies\"\n    heading=\"Allergies and intolerances\"\n  >\n    <AllergyRecordList\n      status=\"known\"\n      statusLabel=\"Allergies\"\n    >\n      <AllergyRecordListItem\n        substance=\"Penicillin\"\n        criticality=\"high\"\n        criticalityLabel=\"High risk\"\n      />\n    </AllergyRecordList>\n  </InternationalPatientSummarySection>\n  <InternationalPatientSummarySection\n    section=\"problems\"\n    heading=\"Problem list\"\n    status=\"none-known\"\n    statusLabel=\"No known problems\"\n  />\n</InternationalPatientSummary>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>International Patient Summary — Lily Design System</title>
  <meta name="description" content="An International Patient Summary (IPS) is &quot;a minimal and non-exhaustive patient summary dataset, specialty-agnostic," />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/international-patient-summary/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: international-patient-summary</li>
      <li>PascalCase: InternationalPatientSummary</li>
      <li>Description: an International Patient Summary (HL7 FHIR IPS) laid out for a clinician: patient banner, contents, sections and document details, never silently missing a required section</li>
      <li>Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;article&gt;</li>
      <li>Naming exception: no suffix; the root of a document view is an <code>&lt;article&gt;</code>, a self-contained composition</li>
      <li>CSS class: .international-patient-summary</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>&lt;article&gt;</code> named by <code>aria-label</code> — a self-contained document</li>
      <li><code>&lt;nav aria-label=&#123;contentsLabel&#125;&gt;</code> — the contents</li>
      <li>Each section is a <code>&lt;section&gt;</code> named by its heading (<code>aria-labelledby</code>), so it is a region landmark a screen reader can list</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None of its own: links and the narrative's <code>&lt;details&gt;</code> are native</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- the article's accessible name</li>
      <li><code>sections</code>: &#123; key, heading, status?, id? &#125;[] (default: []) -- the sections the consumer renders, in document order</li>
      <li><code>requiredHeadings</code>: &#123; medications, allergies, problems &#125; (required) -- headings for an added, missing required section. A missing required section with no heading here throws an <code>IpsSectionsError</code> (a <code>RangeError</code>, reason <code>heading</code>; <code>IpsSectionsException</code> in Blazor), never an empty heading</li>
      <li><code>omittedLabel</code>: string (required) -- the words an added section shows, such as "Section missing from document"</li>
      <li><code>contentsLabel</code>: string (optional) -- names the contents navigation; without it there is none</li>
      <li><code>headingLevel</code>: 2 to 6 (default: 2) -- the heading level of an added section</li>
      <li><code>idPrefix</code>: string (default: "international-patient-summary") -- section ids are <code>&#123;idPrefix&#125;-&#123;key&#125;</code>; give each summary on a page its own, and pass the same to its sections</li>
      <li><code>banner</code>: slot (optional) -- the patient banner composition</li>
      <li><code>details</code>: slot (optional) -- the document's details</li>
      <li><code>children</code>: slot (optional) -- the <code>international-patient-summary-section</code> elements</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the article</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
