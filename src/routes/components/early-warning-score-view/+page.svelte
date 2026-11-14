<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Early Warning Score View</h1>\n<p>EarlyWarningScoreView is a headless read-only display of an early warning score: the scoring system&#39;s name, the score, its band and the escalation it calls for. It renders as a <code>&lt;span&gt;</code>. It is display only and computes nothing.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;EarlyWarningScoreView\n  system=&quot;NEWS2&quot;\n  score=&quot;{7}&quot;\n  band=&quot;high&quot;\n  bandLabel=&quot;High&quot;\n  escalation=&quot;Urgent response&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>score</code>: string | number (required) — the score the consumer computed</li>\n<li><code>system</code>: string (optional) — the scoring system&#39;s name, such as NEWS2</li>\n<li><code>band</code>: string (optional) — the consumer&#39;s band key, rendered as <code>data-band</code></li>\n<li><code>bandLabel</code>: string (optional) — the band in words; required with <code>band</code></li>\n<li><code>escalation</code>: string (optional) — what to do</li>\n<li><code>label</code>: string (optional) — hidden text naming the value</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text. The band is text, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show an early warning score your own validated code computed.</li>\n<li>Use on an observations chart, a ward board or a handover summary.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not expect it to compute a score — it never will.</li>\n<li>Do not use for a laboratory result — use <code>observation-view</code>.</li>\n<li>Do not use for a general gauge — use <code>gauge-chart</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.early-warning-score-view</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.early-warning-score-view</code> and its parts, and <code>[data-band]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Each part renders, and <code>band</code> renders as <code>data-band</code></li>\n<li>A band with no words raises a development warning</li>\n<li>It contains no scoring code (review)</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Name the scoring system, since bands and escalation differ between them.</li>\n<li>NEWS2 is not for under-16s or pregnancy; use the score your population needs.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;span class=&quot;early-warning-score-view&quot;&gt;</code> with parts <code>-system</code>, <code>-score</code>, <code>-band</code> and <code>-escalation</code></li>\n<li><code>band</code> is the consumer&#39;s key, rendered as <code>data-band</code>; <code>bandLabel</code> is its words and is required with it (a development warning says so)</li>\n<li>Computes nothing: scoring systems differ by country and population, and scoring is the consumer&#39;s validated code</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>observation-view</code> — a clinical observation or result</li>\n<li><code>gauge-chart</code> — a dial chart showing one value within a range</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Spec: spec/healthcare-ui/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"early-warning-score-view\" data-band=\"high\"><span class=\"early-warning-score-view-system\">NEWS2</span> <span class=\"early-warning-score-view-score\">7</span> <span class=\"early-warning-score-view-band\">High</span> <span class=\"early-warning-score-view-escalation\">Urgent response</span></span>";
  const svelteSource: string = "// In your Svelte component:\nimport EarlyWarningScoreView from \"lily-design-system-svelte-headless/components/EarlyWarningScoreView/EarlyWarningScoreView.svelte\";\n\n<EarlyWarningScoreView>\n  <!-- content -->\n</EarlyWarningScoreView>\n";
  const usageCode: string = "<EarlyWarningScoreView\n  system=\"NEWS2\"\n  score=\"{7}\"\n  band=\"high\"\n  bandLabel=\"High\"\n  escalation=\"Urgent response\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>EarlyWarningScoreView — Lily Design System</title>
  <meta name="description" content="EarlyWarningScoreView is a headless read-only display of an early warning score: the scoring system's name, the score, its band and the escalation it calls for. It renders as a &lt;span&gt;. It is display only and computes nothing." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/early-warning-score-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: early-warning-score-view</li>
      <li>PascalCase: EarlyWarningScoreView</li>
      <li>Description: a read-only display of an early warning score, with its band and escalation text</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .early-warning-score-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text. The band is text, never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>score</code>: string | number (required) — the score the consumer computed</li>
      <li><code>system</code>: string (optional) — the scoring system's name, such as NEWS2</li>
      <li><code>band</code>: string (optional) — the consumer's band key, rendered as <code>data-band</code></li>
      <li><code>bandLabel</code>: string (optional) — the band in words; required with <code>band</code></li>
      <li><code>escalation</code>: string (optional) — what to do</li>
      <li><code>label</code>: string (optional) — hidden text naming the value</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
