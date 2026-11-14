<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Medication View</h1>\n<p>MedicationView is a headless read-only display of a medicine: its name, strength, form, route and frequency, each in its own part and none ever truncated. It renders as a <code>&lt;span&gt;</code>. Lily ships no drug data and no tall man list.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;MedicationView\n  nameSegments={[{ text: &quot;hydr&quot; }, { text: &quot;ALAZINE&quot;, tallMan: true }]}\n  strength=&quot;25 mg&quot;\n  form=&quot;tablet&quot;\n  route=&quot;oral&quot;\n  frequency=&quot;twice daily&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>name</code>: string (optional) — the name as plain text</li>\n<li><code>nameSegments</code>: { text, tallMan? }[] (optional) — the name in parts, with tall man letters marked; used instead of <code>name</code></li>\n<li><code>strength</code>: string (optional) — the strength, formatted by the consumer</li>\n<li><code>form</code>: string (optional) — the dose form</li>\n<li><code>route</code>: string (optional) — the route</li>\n<li><code>frequency</code>: string (optional) — how often</li>\n<li><code>label</code>: string (optional) — hidden text naming the value</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text. Each part is text</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a prescribed or administered medicine.</li>\n<li>Use in a medication list, an administration chart or a decision-support card.</li>\n<li>Use wherever look-alike, sound-alike names need tall man letters.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use to prescribe — use a <code>form</code> with its own validated fields.</li>\n<li>Do not use for a non-medicine product — use plain text.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.medication-view</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.medication-view</code> and its parts; make <code>.medication-view-tall-man</code> bold, never colour alone.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders</li>\n<li>Only the consumer&#39;s segments are marked tall man</li>\n<li>A name with capitals, such as <code>HCl</code>, is not marked</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Generic names in lower case except tall man letters, from the FDA and ISMP lists or your country&#39;s (Australia and Canada publish their own).</li>\n<li>Write mL, never cc; avoid the abbreviations on ISMP&#39;s error-prone list.</li>\n<li>Never truncate a medicine name; let it wrap.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;span class=&quot;medication-view&quot;&gt;</code> with parts <code>-name</code>, <code>-strength</code>, <code>-form</code>, <code>-route</code> and <code>-frequency</code></li>\n<li>Tall man letters come from the consumer as marked segments of the name (<code>nameSegments</code>), each marked part rendered as <code>.medication-view-tall-man</code>; nothing is marked automatically</li>\n<li>The strength arrives formatted by the consumer: <code>formatQuantity</code> writes <code>5 mg</code>, never <code>5.0 mg</code>, and <code>0.5 mg</code>, never <code>.5 mg</code></li>\n<li>No part is ever truncated</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>observation-view</code> — a clinical observation or result</li>\n<li><code>decision-support-card</code> — a clinical decision support card</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>ISMP guidelines for electronic communication of medication information: <a href=\"https://online.ecri.org/hubfs/ISMP/Resources/ISMP_Electronic_Guidelines.pdf\">https://online.ecri.org/hubfs/ISMP/Resources/ISMP_Electronic_Guidelines.pdf</a></li>\n<li>ISMP Canada TALLman principles: <a href=\"https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf\">https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"medication-view\"><span class=\"medication-view-name\">hydr<span class=\"medication-view-tall-man\">ALAZINE</span></span> <span class=\"medication-view-strength\">25&#160;mg</span> <span class=\"medication-view-form\">tablet</span> <span class=\"medication-view-route\">oral</span> <span class=\"medication-view-frequency\">twice daily</span></span>";
  const svelteSource: string = "// In your Svelte component:\nimport MedicationView from \"lily-design-system-svelte-headless/components/MedicationView/MedicationView.svelte\";\n\n<MedicationView>\n  <!-- content -->\n</MedicationView>\n";
  const usageCode: string = "<MedicationView\n  nameSegments={[{ text: \"hydr\" }, { text: \"ALAZINE\", tallMan: true }]}\n  strength=\"25 mg\"\n  form=\"tablet\"\n  route=\"oral\"\n  frequency=\"twice daily\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MedicationView — Lily Design System</title>
  <meta name="description" content="MedicationView is a headless read-only display of a medicine: its name, strength, form, route and frequency, each in its own part and none ever truncated. It renders as a &lt;span&gt;. Lily ships no drug data and no tall man list." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/medication-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: medication-view</li>
      <li>PascalCase: MedicationView</li>
      <li>Description: a read-only display of a medicine, with its name, strength, form, route and frequency</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .medication-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text. Each part is text</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>name</code>: string (optional) — the name as plain text</li>
      <li><code>nameSegments</code>: &#123; text, tallMan? &#125;[] (optional) — the name in parts, with tall man letters marked; used instead of <code>name</code></li>
      <li><code>strength</code>: string (optional) — the strength, formatted by the consumer</li>
      <li><code>form</code>: string (optional) — the dose form</li>
      <li><code>route</code>: string (optional) — the route</li>
      <li><code>frequency</code>: string (optional) — how often</li>
      <li><code>label</code>: string (optional) — hidden text naming the value</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
