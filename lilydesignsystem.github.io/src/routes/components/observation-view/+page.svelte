<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Observation View</h1>\n<p>ObservationView is a headless read-only display of one clinical observation or test result: its value, unit, interpretation flag and reference range. It renders as a <code>&lt;span&gt;</code>. It shows what the consumer&#39;s code decided, and computes no flag and no range.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem term=&quot;Potassium&quot;&gt;\n    &lt;ObservationView\n      value=&quot;5.9&quot;\n      unit=&quot;mmol/L&quot;\n      interpretation=&quot;H&quot;\n      flagLabel=&quot;High&quot;\n      range=&quot;3.5–5.3&quot;\n    /&gt;\n  &lt;/SummaryListItem&gt;\n  &lt;SummaryListItem term=&quot;Sodium&quot;&gt;\n    &lt;ObservationView\n      status=&quot;not-recorded&quot;\n      statusLabel=&quot;Not recorded&quot;\n    /&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (optional) — the value, formatted by the consumer</li>\n<li><code>unit</code>: string (optional) — the unit, such as <code>mmol/L</code></li>\n<li><code>interpretation</code>: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as <code>data-interpretation</code></li>\n<li><code>flagLabel</code>: string (optional) — the flag in words (&quot;High&quot;); required when the flag is not normal</li>\n<li><code>range</code>: string (optional) — the reference range as text</li>\n<li><code>ranges</code>: { label, text }[] (optional) — further named reference ranges (&quot;Critical&quot;, &quot;below 2.5&quot;), each its own <code>-range</code> part with a <code>-range-label</code> (openEHR <code>other_reference_ranges</code>)</li>\n<li><code>meterValue</code>, <code>meterMin</code>, <code>meterMax</code>: number (optional) — with all three, an <code>aria-hidden</code> native <code>&lt;meter class=&quot;observation-view-meter&quot;&gt;</code> shows where the value sits; <code>meterLow</code>, <code>meterHigh</code> and <code>meterOptimum</code> (optional) mark the reference range and best value for the theme. It is the picture of the words, never the only signal: the value, range and flag stay text. No meter for a missing result</li>\n<li><code>previousValue</code>: string (optional) — a superseded value, shown in a <code>&lt;del class=&quot;observation-view-previous-value&quot;&gt;</code> so a reader who saw it knows it changed</li>\n<li><code>previousLabel</code>: string (optional; required with <code>previousValue</code>) — the consumer&#39;s words for it (&quot;was 5.1 until 3 Nov&quot;), since a screen reader may not announce <code>&lt;del&gt;</code></li>\n<li><code>status</code>: &quot;final&quot; | &quot;registered&quot; | &quot;preliminary&quot; | &quot;amended&quot; | &quot;corrected&quot; | &quot;entered-in-error&quot; | &quot;cancelled&quot; | &quot;unknown&quot; | &quot;masked&quot; | &quot;not-recorded&quot; | &quot;unavailable&quot; | &quot;not-applicable&quot; (optional) — default <code>final</code>, rendered as <code>data-status</code></li>\n<li><code>statusLabel</code>: string (required for any status but <code>final</code>) — the words for the status; without them no value is shown</li>\n<li><code>showWithdrawn</code>: boolean (optional) — default <code>false</code>; in an authorised history view, shows an <code>entered-in-error</code> result&#39;s former value struck through after its words</li>\n<li><code>label</code>: string (optional) — hidden text naming the observation, when no visible caption does</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>: a <code>&lt;span&gt;</code> cannot be named, so <code>label</code> renders as hidden text in a <code>screen-reader-span</code>. The flag is text, so a screen reader hears it</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a laboratory result or a vital sign with its unit and reference range.</li>\n<li>Use in a results table, a patient summary or a trend view, beside a <code>sparkline</code> of earlier values.</li>\n<li>Use when a result can be missing, preliminary or abnormal, and each must read differently.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a measurement with no clinical interpretation — use <code>measurement-instance-view</code>.</li>\n<li>Do not use to edit a value — use <code>number-input</code> with <code>field</code>.</li>\n<li>Do not use for a computed score — use <code>early-warning-score-view</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.observation-view</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.observation-view</code>, <code>.observation-view-value</code>, <code>.observation-view-unit</code>, <code>.observation-view-flag</code>, <code>.observation-view-range</code>, <code>.observation-view-status</code>, and the <code>[data-interpretation]</code> and <code>[data-status]</code> attributes.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, and the value and unit are joined by a no-break space</li>\n<li>An interpretation code renders as <code>data-interpretation</code> and its consumer label as text</li>\n<li><code>not-recorded</code> and <code>unavailable</code> render different words and no value; <code>cancelled</code> and <code>masked</code> replace the value with their words; <code>amended</code>, <code>corrected</code> and <code>entered-in-error</code> show the value with their words</li>\n<li>A missing <code>flagLabel</code> for an abnormal code, or a missing <code>statusLabel</code>, raises a development warning</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Separate new results from earlier ones, and show a trend: clinicians often look for a significant change, not the range, because some patients sit outside it permanently.</li>\n<li>Keep one display for a result whatever system it came from.</li>\n<li>Flag text comes from the consumer, translated; never show the code itself to a person.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li><p>Renders <code>&lt;span class=&quot;observation-view&quot;&gt;</code> with parts <code>observation-view-value</code>, <code>-unit</code>, <code>-flag</code>, <code>-range</code> and <code>-status</code></p>\n</li>\n<li><p><code>interpretation</code> is a FHIR v3 ObservationInterpretation code (<code>N</code>, <code>L</code>, <code>H</code>, <code>LL</code>, <code>HH</code>, <code>A</code>, …), rendered as <code>data-interpretation</code> and never as text</p>\n</li>\n<li><p><code>flagLabel</code> is the flag in the consumer&#39;s words; it is required whenever the flag is not normal, so the meaning is never colour alone (a development warning says so)</p>\n</li>\n<li><p><code>status</code> is a FHIR R4 Observation status (<code>final</code>, <code>registered</code>, <code>preliminary</code>, <code>amended</code>, <code>corrected</code>, <code>entered-in-error</code>, <code>cancelled</code>, <code>unknown</code>), or <code>masked</code>, <code>not-recorded</code>, <code>unavailable</code> or <code>not-applicable</code>, rendered as <code>data-status</code>. <code>registered</code>, <code>cancelled</code>, <code>masked</code>, <code>not-recorded</code>, <code>unavailable</code> and <code>not-applicable</code> show <code>statusLabel</code> instead of the value, so a missing result is never blank or a dash; the others show it beside the value. A result that is not final and has no <code>statusLabel</code> shows no value</p>\n</li>\n<li><p>An <code>entered-in-error</code> result shows only its words. With <code>showWithdrawn</code>, for an authorised history view, the former value follows them in <code>&lt;del class=&quot;observation-view-withdrawn-value&quot;&gt;</code>, with no flag, range or meter</p>\n</li>\n<li><p>A withheld or withdrawn result renders no <code>data-interpretation</code>, flag, range, meter or earlier value, whatever it is given; the service must still withhold a restricted value before sending it</p>\n</li>\n<li><p>The value and unit are joined by a no-break space, so they never wrap apart</p>\n</li>\n<li><p>It never infers an interpretation: with no <code>interpretation</code> there is no flag and no <code>data-interpretation</code>, even when a range is given, so a result whose range is missing or still loading is never shown as normal.</p>\n</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>measurement-instance-view</code> — a read-only display of a measurement value and unit</li>\n<li><code>sparkline</code> — a small inline chart showing a data trend</li>\n<li><code>summary-list-item</code> — one key-value pair in a summary list</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>FHIR Observation: <a href=\"https://hl7.org/fhir/observation.html\">https://hl7.org/fhir/observation.html</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md</a></li>\n<li>Adopter guide on the website, with translations: <a href=\"https://lilydesignsystem.com/patterns/healthcare/\">https://lilydesignsystem.com/patterns/healthcare/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"observation-view\" data-interpretation=\"H\" data-status=\"final\"><span class=\"screen-reader-span\">Potassium </span><span class=\"observation-view-value\">5.9</span>&#160;<span class=\"observation-view-unit\">mmol/L</span> <span class=\"observation-view-flag\">High</span> <span class=\"observation-view-range\">3.5–5.3</span></span>";
  const svelteSource: string = "// In your Svelte component:\nimport ObservationView from \"lily-design-system-svelte-headless/components/ObservationView/ObservationView.svelte\";\n\n<ObservationView>\n  <!-- content -->\n</ObservationView>\n";
  const usageCode: string = "<SummaryList>\n  <SummaryListItem term=\"Potassium\">\n    <ObservationView\n      value=\"5.9\"\n      unit=\"mmol/L\"\n      interpretation=\"H\"\n      flagLabel=\"High\"\n      range=\"3.5–5.3\"\n    />\n  </SummaryListItem>\n  <SummaryListItem term=\"Sodium\">\n    <ObservationView\n      status=\"not-recorded\"\n      statusLabel=\"Not recorded\"\n    />\n  </SummaryListItem>\n</SummaryList>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Observation View — Lily Design System</title>
  <meta name="description" content="ObservationView is a headless read-only display of one clinical observation or test result: its value, unit, interpretation flag and reference range. It renders as a &lt;span&gt;. It shows what the consumer's code decided, and computes no flag and no range." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/observation-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: observation-view</li>
      <li>PascalCase: ObservationView</li>
      <li>Description: a read-only display of a clinical observation or test result, with its unit, reference range and interpretation flag</li>
      <li>Purpose: Shows a clinical observation or test result, with its unit, reference range and interpretation flag as read-only text, so it is displayed one way wherever it appears. Use the input to collect it.</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .observation-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role and no <code>aria-label</code>: a <code>&lt;span&gt;</code> cannot be named, so <code>label</code> renders as hidden text in a <code>screen-reader-span</code>. The flag is text, so a screen reader hears it</li>
    </ul>
    <ul>
      <li>It never infers an interpretation: with no <code>interpretation</code> there is no flag and no <code>data-interpretation</code>, even when a range is given, so a result whose range is missing or still loading is never shown as normal (spec/lessons/openmrs item 1)</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (optional) — the value, formatted by the consumer</li>
      <li><code>unit</code>: string (optional) — the unit, such as <code>mmol/L</code></li>
      <li><code>interpretation</code>: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as <code>data-interpretation</code></li>
      <li><code>flagLabel</code>: string (optional) — the flag in words ("High"); required when the flag is not normal</li>
      <li><code>range</code>: string (optional) — the reference range as text</li>
      <li><code>ranges</code>: &#123; label, text &#125;[] (optional) — further named reference ranges ("Critical", "below 2.5"), each its own <code>-range</code> part with a <code>-range-label</code> (openEHR <code>other_reference_ranges</code>)</li>
      <li><code>meterValue</code>, <code>meterMin</code>, <code>meterMax</code>: number (optional) — with all three, an <code>aria-hidden</code> native <code>&lt;meter class="observation-view-meter"&gt;</code> shows where the value sits; <code>meterLow</code>, <code>meterHigh</code> and <code>meterOptimum</code> (optional) mark the reference range and best value for the theme. It is the picture of the words, never the only signal: the value, range and flag stay text. No meter for a missing result <code>meterScale(value, low?, high?, units?)</code> in the <code>clinical-format</code> module (C# <code>ClinicalFormat.MeterScale</code>) works out <code>meterMin</code>, <code>meterMax</code>, <code>meterLow</code> and <code>meterHigh</code> from a value and its reference range: half a range beyond each end of a two-sided range, zero to half as far again for a one-sided one, always wide enough to hold the value, and nothing (so no meter) only when there is no value or no range; a non-numeric value or end, a reversed range, a bound not above zero, or two different units throws a <code>MeterScaleError</code> (C# <code>MeterScaleException</code>) with a <code>reason</code>, never a quiet fallback (2026-11-21, P42-T8; 2026-11-22, checked arithmetic).</li>
      <li><code>previousValue</code>: string (optional) — a superseded value, shown in a <code>&lt;del class="observation-view-previous-value"&gt;</code> so a reader who saw it knows it changed</li>
      <li><code>previousLabel</code>: string (optional; required with <code>previousValue</code>) — the consumer's words for it ("was 5.1 until 3 Nov"), since a screen reader may not announce <code>&lt;del&gt;</code></li>
      <li><code>status</code>: "final" | "registered" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "unknown" | "masked" | "not-recorded" | "unavailable" | "not-applicable" (optional) — default <code>final</code>, rendered as <code>data-status</code></li>
      <li><code>statusLabel</code>: string (required for any status but <code>final</code>) — the words for the status; without them no value is shown</li>
      <li><code>showWithdrawn</code>: boolean (optional) — default <code>false</code>; in an authorised history view, shows an <code>entered-in-error</code> result's former value struck through after its words</li>
      <li><code>label</code>: string (optional) — hidden text naming the observation, when no visible caption does</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
