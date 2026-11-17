<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Duration View</h1>\n<p>DurationView is a headless read-only display of a length of time, in the consumer&#39;s words. It renders as a <code>&lt;time&gt;</code> element whose <code>datetime</code> is the ISO 8601 duration, so the length stays machine-readable while the reader sees words in their language. The TypeScript libraries export <code>durationParts()</code>, whose result <code>Intl.DurationFormat</code> turns into words, and <code>htmlDuration()</code>.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;DurationView\n  label=&quot;Length of stay&quot;\n  value=&quot;3 days 4 hours&quot;\n  duration=&quot;P3DT4H&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (required) — the length of time as the consumer writes it</li>\n<li><code>duration</code>: string (required) — the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; rendered as <code>datetime</code></li>\n<li><code>label</code>: string (optional) — hidden text naming the value</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. This is not an interactive component.</p>\n<h2>ARIA</h2>\n<ul>\n<li>No role and no <code>aria-label</code>; <code>label</code> renders as hidden text</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a length of time: a length of stay, a wait, an infusion&#39;s run time, the time since a dose.</li>\n<li>Use where software or a script needs the length as well as the reader: the <code>datetime</code> holds it exactly.</li>\n<li>Use for a negative duration such as &quot;3 days early&quot;, with the direction in the words.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a person&#39;s age — use <code>age-view</code>, whose units suit the age.</li>\n<li>Do not use for a date or a time of day — use <code>date-time-view</code>.</li>\n<li>Do not use for a length in years or months — they have no fixed length and are no <code>datetime</code>; use <code>age-view</code> or plain text.</li>\n<li>Do not use for a countdown that changes every second — use <code>timer</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.duration-view</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.duration-view</code> and <code>[data-negative]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li><code>datetime</code> holds the duration and the words render</li>\n<li>A negative duration has <code>data-negative</code> and its length as <code>datetime</code></li>\n<li>Years, months and weeks render no <code>datetime</code></li>\n<li><code>durationParts()</code> and <code>htmlDuration()</code> are tested in the shared module</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Write the words in the reader&#39;s language: <code>new Intl.DurationFormat(locale, { style: &quot;long&quot; }).format(durationParts(iso))</code>, leaving out <code>negative</code>.</li>\n<li>Keep the units the record has: 90 minutes is not 1.5 hours, and Lily converts nothing.</li>\n<li>Do not round a clinical duration for display without saying so.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;time class=&quot;duration-view&quot; datetime=&quot;P3DT4H&quot;&gt;</code> with the consumer&#39;s words</li>\n<li><code>duration</code> takes days, hours, minutes and seconds (<code>P3DT4H</code>, <code>PT90M</code>): an HTML <code>datetime</code> takes no years, months or weeks, which have no fixed length, and no sign</li>\n<li>A negative duration (<code>-P3D</code>) renders its length as <code>datetime</code> and adds <code>data-negative</code>; say the direction in the words (&quot;3 days early&quot;)</li>\n<li>A <code>duration</code> HTML cannot take renders no <code>datetime</code> and raises a development warning</li>\n<li>Writes no words for units: format <code>durationParts()</code> with <code>Intl.DurationFormat</code>, or pass your own words</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>age-view</code> — a person&#39;s age, in the units suited to it</li>\n<li><code>date-time-view</code> — a read-only display of a date and time</li>\n<li><code>timer</code> — a time that changes as the reader watches</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>HTML valid duration string: <a href=\"https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#durations\">https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#durations</a></li>\n<li>Intl.DurationFormat: <a href=\"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat\">https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat</a></li>\n<li>openEHR DV_DURATION: <a href=\"https://specifications.openehr.org/releases/RM/latest/data_types.html\">https://specifications.openehr.org/releases/RM/latest/data_types.html</a></li>\n<li>Spec: spec/lessons/openehr/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<time class=\"duration-view\" datetime=\"P3DT4H\"><span class=\"screen-reader-span\">Length of stay </span>3 days 4 hours</time>";
  const svelteSource: string = "// In your Svelte component:\nimport DurationView from \"lily-design-system-svelte-headless/components/DurationView/DurationView.svelte\";\n\n<DurationView>\n  <!-- content -->\n</DurationView>\n";
  const usageCode: string = "<DurationView\n  label=\"Length of stay\"\n  value=\"3 days 4 hours\"\n  duration=\"P3DT4H\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Duration View — Lily Design System</title>
  <meta name="description" content="DurationView is a headless read-only display of a length of time, in the consumer's words. It renders as a &lt;time&gt; element whose datetime is the ISO 8601 duration, so the length stays machine-readable while the reader sees words in their language. The TypeScript libraries export durationParts(), w…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/duration-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: duration-view</li>
      <li>PascalCase: DurationView</li>
      <li>Description: a length of time, as an ISO 8601 duration in a <code>&lt;time&gt;</code> element, shown in the consumer's words</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;time&gt;</li>
      <li>CSS class: .duration-view</li>
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
      <li><code>value</code>: string (required) — the length of time as the consumer writes it</li>
      <li><code>duration</code>: string (required) — the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; rendered as <code>datetime</code></li>
      <li><code>label</code>: string (optional) — hidden text naming the value</li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
