<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Allergy List Item</h1>\n<p>AllergyListItem is one allergy or intolerance in an <code>allergy-list</code>: the substance, the reaction, the severity and when the record was last updated. It renders as an <code>&lt;li&gt;</code>. Every word is the consumer&#39;s.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AllergyListItem\n  substance=&quot;Penicillin&quot;\n  reaction=&quot;Anaphylaxis&quot;\n  severity=&quot;severe&quot;\n  severityLabel=&quot;Severe&quot;\n  updated=&quot;2026-11-03&quot;\n  updatedLabel=&quot;Updated 3 Nov 2026&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>substance</code>: string (required) — what the patient reacts to</li>\n<li><code>reaction</code>: string (optional) — the manifestation</li>\n<li><code>severity</code>: &quot;mild&quot; | &quot;moderate&quot; | &quot;severe&quot; (optional) — rendered as <code>data-severity</code></li>\n<li><code>severityLabel</code>: string (optional) — the severity in words</li>\n<li><code>updated</code>: string (optional) — when the record was last updated, for <code>&lt;time datetime&gt;</code></li>\n<li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it</li>\n<li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA beyond the native <code>&lt;li&gt;</code>; severity is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use inside <code>allergy-list</code> for each recorded allergy or intolerance.</li>\n<li>Use when severity and the date of the record matter to the reader.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use outside an <code>allergy-list</code>.</li>\n<li>Do not use for a status such as &quot;no known allergies&quot; — that is the list&#39;s <code>status</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.allergy-list-item</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.allergy-list-item</code> and its parts, and <code>[data-severity]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, the date as a <code>&lt;time datetime&gt;</code></li>\n<li>Only the given parts render</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Write the substance as the consumer&#39;s terminology names it; do not shorten it.</li>\n<li>Format the date with <code>Intl.DateTimeFormat</code>, with the month as text so it is unambiguous.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;li class=&quot;allergy-list-item&quot;&gt;</code> with parts <code>-substance</code>, <code>-reaction</code>, <code>-severity</code> and <code>-updated</code></li>\n<li><code>severity</code> (<code>mild</code>, <code>moderate</code>, <code>severe</code>, the FHIR AllergyIntolerance reaction severity) renders as <code>data-severity</code>, and its words as text</li>\n<li><code>-updated</code> is a <code>&lt;time datetime&gt;</code>, shown only when <code>updatedLabel</code> is given</li>\n<li>The substance is never truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>allergy-list</code> — a list of a patient&#39;s allergies and intolerances</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>FHIR AllergyIntolerance: <a href=\"https://hl7.org/fhir/allergyintolerance.html\">https://hl7.org/fhir/allergyintolerance.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"allergy-list\" data-status=\"known\" aria-label=\"Known allergies\"><li class=\"allergy-list-item\" data-severity=\"severe\"><span class=\"allergy-list-item-substance\">Penicillin</span> <span class=\"allergy-list-item-reaction\">Anaphylaxis</span> <span class=\"allergy-list-item-severity\">Severe</span> <time class=\"allergy-list-item-updated\" datetime=\"2026-11-03\">Updated 3 Nov 2026</time></li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport AllergyListItem from \"lily-design-system-svelte-headless/components/AllergyListItem/AllergyListItem.svelte\";\n\n<AllergyListItem>\n  <!-- content -->\n</AllergyListItem>\n";
  const usageCode: string = "<AllergyListItem\n  substance=\"Penicillin\"\n  reaction=\"Anaphylaxis\"\n  severity=\"severe\"\n  severityLabel=\"Severe\"\n  updated=\"2026-11-03\"\n  updatedLabel=\"Updated 3 Nov 2026\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>AllergyListItem — Lily Design System</title>
  <meta name="description" content="AllergyListItem is one allergy or intolerance in an allergy-list: the substance, the reaction, the severity and when the record was last updated. It renders as an &lt;li&gt;. Every word is the consumer's." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/allergy-list-item/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: allergy-list-item</li>
      <li>PascalCase: AllergyListItem</li>
      <li>Description: one allergy or intolerance in an allergy list, with substance, reaction, severity and last update</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;li&gt;</li>
      <li>CSS class: .allergy-list-item</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No ARIA beyond the native <code>&lt;li&gt;</code>; severity is text, never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>substance</code>: string (required) — what the patient reacts to</li>
      <li><code>reaction</code>: string (optional) — the manifestation</li>
      <li><code>severity</code>: "mild" | "moderate" | "severe" (optional) — rendered as <code>data-severity</code></li>
      <li><code>severityLabel</code>: string (optional) — the severity in words</li>
      <li><code>updated</code>: string (optional) — when the record was last updated, for <code>&lt;time datetime&gt;</code></li>
      <li><code>updatedLabel</code>: string (optional) — that date as the consumer writes it</li>
      <li><code>children</code>: slot (optional) — anything else, such as a link to the full record</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
