<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Age View</h1>\n<p>AgeView is a headless read-only display of a person&#39;s age, in the consumer&#39;s words. It renders as a <code>&lt;span&gt;</code>. The TypeScript libraries export <code>ageParts()</code>, which gives the age in units suited to it (minutes for a newborn, weeks and days for an infant, years and months for a child, years for an adult), and <code>toIsoDuration()</code>.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;AgeView\n  label=&quot;Age&quot;\n  value=&quot;3 weeks 2 days&quot;\n  duration=&quot;P23D&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (required) — the age as the consumer writes it</li>\n<li><code>duration</code>: string (optional) — the same age as an ISO 8601 duration, rendered as <code>data-duration</code></li>\n<li><code>label</code>: string (optional) — hidden text naming the value</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use beside a date of birth in a patient banner.</li>\n<li>Use where an infant&#39;s age in weeks or a child&#39;s in years and months matters clinically.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a date — use <code>date-time-view</code>.</li>\n<li>Do not use for a duration that is not an age — use plain text or <code>&lt;time&gt;</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.age-view</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.age-view</code> and <code>[data-duration]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>The words and <code>data-duration</code> render</li>\n<li><code>ageParts()</code> returns the right units at every band boundary (shared tests)</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>The unit bands follow the NHS Common User Interface; another convention can ignore <code>ageParts()</code> and pass its own words.</li>\n<li>Show the age beside the date of birth, not instead of it.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;span class=&quot;age-view&quot;&gt;</code> with the consumer&#39;s words</li>\n<li><code>duration</code> is the same age as an ISO 8601 duration, rendered as <code>data-duration</code></li>\n<li>Writes no words for units: the consumer formats <code>ageParts()</code> with <code>Intl.DurationFormat</code> or its own labels</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>date-time-view</code> — a read-only display of a date and time</li>\n<li><code>medical-banner</code> — a prominent message bar with medical information</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Intl.DurationFormat: <a href=\"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat\">https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat</a></li>\n<li>Spec: spec/healthcare-ui/index.md</li>\n<li>Adopter guide: <a href=\"https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md\">https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"age-view\" data-duration=\"P23D\"><span class=\"screen-reader-span\">Age </span>3 weeks 2 days</span>";
  const svelteSource: string = "// In your Svelte component:\nimport AgeView from \"lily-design-system-svelte-headless/components/AgeView/AgeView.svelte\";\n\n<AgeView>\n  <!-- content -->\n</AgeView>\n";
  const usageCode: string = "<span class=\"age-view\" data-duration=\"P23D\"><span class=\"screen-reader-span\">Age </span>3 weeks 2 days</span>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>AgeView — Lily Design System</title>
  <meta name="description" content="AgeView is a headless read-only display of a person's age, in the consumer's words. It renders as a &lt;span&gt;. The TypeScript libraries export ageParts(), which gives the age in units suited to it (minutes for a newborn, weeks and days for an infant, years and months for a child, years for an adult)…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/age-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: age-view</li>
      <li>PascalCase: AgeView</li>
      <li>Description: a read-only display of a person's age, in the units suited to it</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .age-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (required) — the age as the consumer writes it</li>
      <li><code>duration</code>: string (optional) — the same age as an ISO 8601 duration, rendered as <code>data-duration</code></li>
      <li><code>label</code>: string (optional) — hidden text naming the value</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
