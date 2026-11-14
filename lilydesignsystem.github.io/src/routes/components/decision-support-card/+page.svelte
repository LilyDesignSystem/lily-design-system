<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Decision Support Card</h1>\n<p>DecisionSupportCard is a headless clinical decision support card in the shape of a CDS Hooks card: a one-line summary, an urgency indicator, the source of the guidance, optional detail, suggestions, links, and a way to dismiss it with a reason. CDS Hooks leaves rendering to the host system; this is that rendering, with no styling.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;DecisionSupportCard\n  summary=&quot;Penicillin allergy recorded&quot;\n  indicator=&quot;critical&quot;\n  indicatorLabel=&quot;Critical&quot;\n  sourceLabel=&quot;Local formulary&quot;\n  suggestions={[{ id: &quot;cancel&quot;, label: &quot;Cancel amoxicillin&quot;, isRecommended: true }]}\n  dismissLabel=&quot;Dismiss&quot;\n  overrideReasons={[{ code: &quot;aware&quot;, display: &quot;Patient tolerated before&quot; }]}\n  overrideReasonLabel=&quot;Reason for dismissing&quot;\n  overrideReasonPlaceholder=&quot;Choose a reason&quot;\n&gt;\n  &lt;p&gt;Amoxicillin is a penicillin.&lt;/p&gt;\n&lt;/DecisionSupportCard&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>summary</code>: string (required) — the one-sentence summary (CDS Hooks: under 140 characters); names the card</li>\n<li><code>indicator</code>: &quot;info&quot; | &quot;warning&quot; | &quot;critical&quot; (required) — rendered as <code>data-indicator</code></li>\n<li><code>indicatorLabel</code>: string (required) — the indicator in words</li>\n<li><code>sourceLabel</code>: string (required) — where the guidance comes from</li>\n<li><code>sourceHref</code>: string (optional) — a link to the source</li>\n<li><code>suggestions</code>: { id, label, isRecommended? }[] (optional) — each a button</li>\n<li><code>links</code>: { label, href }[] (optional) — links to more information</li>\n<li><code>dismissLabel</code>: string (optional) — the dismiss button&#39;s text; no button without it</li>\n<li><code>overrideReasons</code>: { code, display }[] (optional) — when given, dismissing asks for one</li>\n<li><code>overrideReasonLabel</code>: string (optional) — the reason select&#39;s label</li>\n<li><code>overrideReasonPlaceholder</code>: string (optional) — the text of the select&#39;s empty first option</li>\n<li><code>label</code>: string (optional) — the accessible name, when it should differ from the summary</li>\n<li><code>children</code>: slot (optional) — the detail</li>\n<li><code>onSuggestion</code>: callback (optional) — called with the chosen suggestion&#39;s id</li>\n<li><code>onDismiss</code>: callback (optional) — called with the chosen reason&#39;s code, or none when no reasons are offered</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves to the next control in the card</td>\n</tr>\n<tr>\n<td>Enter / Space</td>\n<td>Activates a suggestion or the dismiss button</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> with <code>aria-label</code> from the summary (or <code>label</code>). Not a landmark and not a live region. <code>aria-invalid</code> on the reason select when a dismissal is refused</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a CDS Hooks card or any rule-based advice beside the task it concerns.</li>\n<li>Use when advice can be accepted with one action or dismissed with a reason.</li>\n<li>Use for information and warnings inline, and inside an <code>alert-dialog</code> only for critical items.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a page-wide message — use <code>banner</code> or <code>alert</code>.</li>\n<li>Do not use for patient-facing care advice — use <code>care-card</code>.</li>\n<li>Do not make every card interrupt; that is how alert fatigue starts.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.decision-support-card</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.decision-support-card</code> and its parts, and <code>[data-indicator]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>The card is a group named by its summary and is not a live region</li>\n<li>Enter and Space choose a suggestion</li>\n<li>Dismissing without a reason is refused when reasons are offered, and focus moves to the select</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Tier interruption by severity: information inline, a warning visible without blocking, only critical interrupting (AHRQ).</li>\n<li>Remove a card when the hook it answered is triggered again; the consumer owns that.</li>\n<li>Record the outcome (accepted, overridden with a reason) through CDS Hooks feedback; the consumer owns that too.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;div class=&quot;decision-support-card&quot; role=&quot;group&quot;&gt;</code> named by its summary, with <code>data-indicator</code> (<code>info</code>, <code>warning</code>, <code>critical</code>)</li>\n<li>The indicator is also text (<code>indicatorLabel</code>), so urgency is never colour alone</li>\n<li>Suggestions are real buttons; the consumer applies them and enforces CDS Hooks&#39; <code>selectionBehavior</code></li>\n<li>Dismissing is a form: when <code>overrideReasons</code> are given the reason select is required, and a dismissal without one is refused (the select is marked <code>aria-invalid</code> and focused). The static catalogs (HTML, Nunjucks, Alpine) rely on the browser&#39;s own validation</li>\n<li>Not a live region: whether a critical card interrupts is the consumer&#39;s choice</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>alert-dialog</code> — a modal dialog for urgent messages requiring acknowledgment</li>\n<li><code>care-card</code> — a medical care instruction card with urgency levels</li>\n<li><code>medication-view</code> — a medicine with its strength, form, route and frequency</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>CDS Hooks 2.0, Card: <a href=\"https://cds-hooks.hl7.org/2.0/\">https://cds-hooks.hl7.org/2.0/</a></li>\n<li>AHRQ PSNet primer, alert fatigue: <a href=\"https://psnet.ahrq.gov/primer/alert-fatigue\">https://psnet.ahrq.gov/primer/alert-fatigue</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"decision-support-card\" role=\"group\" aria-label=\"Penicillin allergy recorded\" data-indicator=\"critical\"><p class=\"decision-support-card-header\"><span class=\"decision-support-card-indicator\">Critical</span> <span class=\"decision-support-card-summary\">Penicillin allergy recorded</span></p><div class=\"decision-support-card-detail\"><p>Amoxicillin is a penicillin.</p></div><p class=\"decision-support-card-source\"><a href=\"#\">Local formulary</a></p><div class=\"decision-support-card-suggestions\"><button type=\"button\" class=\"decision-support-card-suggestion\" data-recommended=\"true\">Cancel amoxicillin</button></div><form class=\"decision-support-card-override\"><label class=\"decision-support-card-override-label\">Reason for dismissing <select class=\"decision-support-card-override-reason\" name=\"overrideReason\" required><option value=\"\">Choose a reason</option><option value=\"error\">Allergy recorded in error</option></select></label><button type=\"submit\" class=\"decision-support-card-dismiss\">Dismiss</button></form></div>";
  const svelteSource: string = "// In your Svelte component:\nimport DecisionSupportCard from \"lily-design-system-svelte-headless/components/DecisionSupportCard/DecisionSupportCard.svelte\";\n\n<DecisionSupportCard>\n  <!-- content -->\n</DecisionSupportCard>\n";
  const usageCode: string = "<DecisionSupportCard\n  summary=\"Penicillin allergy recorded\"\n  indicator=\"critical\"\n  indicatorLabel=\"Critical\"\n  sourceLabel=\"Local formulary\"\n  suggestions={[{ id: \"cancel\", label: \"Cancel amoxicillin\", isRecommended: true }]}\n  dismissLabel=\"Dismiss\"\n  overrideReasons={[{ code: \"aware\", display: \"Patient tolerated before\" }]}\n  overrideReasonLabel=\"Reason for dismissing\"\n  overrideReasonPlaceholder=\"Choose a reason\"\n>\n  <p>Amoxicillin is a penicillin.</p>\n</DecisionSupportCard>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>DecisionSupportCard — Lily Design System</title>
  <meta name="description" content="DecisionSupportCard is a headless clinical decision support card in the shape of a CDS Hooks card: a one-line summary, an urgency indicator, the source of the guidance, optional detail, suggestions, links, and a way to dismiss it with a reason. CDS Hooks leaves rendering to the host system; this …" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/decision-support-card/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: decision-support-card</li>
      <li>PascalCase: DecisionSupportCard</li>
      <li>Description: a clinical decision support card with a summary, urgency indicator, source, suggestions and override reasons</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .decision-support-card</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> with <code>aria-label</code> from the summary (or <code>label</code>). Not a landmark and not a live region. <code>aria-invalid</code> on the reason select when a dismissal is refused</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves through the source link, suggestions, links, the reason select and the dismiss button; Enter or Space activates a suggestion or the dismiss button</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>summary</code>: string (required) — the one-sentence summary (CDS Hooks: under 140 characters); names the card</li>
      <li><code>indicator</code>: "info" | "warning" | "critical" (required) — rendered as <code>data-indicator</code></li>
      <li><code>indicatorLabel</code>: string (required) — the indicator in words</li>
      <li><code>sourceLabel</code>: string (required) — where the guidance comes from</li>
      <li><code>sourceHref</code>: string (optional) — a link to the source</li>
      <li><code>suggestions</code>: &#123; id, label, isRecommended? &#125;[] (optional) — each a button</li>
      <li><code>links</code>: &#123; label, href &#125;[] (optional) — links to more information</li>
      <li><code>dismissLabel</code>: string (optional) — the dismiss button's text; no button without it</li>
      <li><code>overrideReasons</code>: &#123; code, display &#125;[] (optional) — when given, dismissing asks for one</li>
      <li><code>overrideReasonLabel</code>: string (optional) — the reason select's label</li>
      <li><code>overrideReasonPlaceholder</code>: string (optional) — the text of the select's empty first option</li>
      <li><code>label</code>: string (optional) — the accessible name, when it should differ from the summary</li>
      <li><code>children</code>: slot (optional) — the detail</li>
      <li><code>onSuggestion</code>: callback (optional) — called with the chosen suggestion's id</li>
      <li><code>onDismiss</code>: callback (optional) — called with the chosen reason's code, or none when no reasons are offered</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
