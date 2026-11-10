<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Timer</h1>\n<p>A timer is a UI/UX component that displays a countdown or elapsed time value\nin a live-updating format. It renders as a semantic HTML <code>&lt;time&gt;</code> element with\n<code>role=&quot;timer&quot;</code>, which is not a live region: a value that changes every second\nwould flood a screen reader, so the reader hears it when they ask for it. The component is commonly used for\nsession timeouts, countdowns, stopwatches, cooking timers, exam time limits,\nand any scenario where users need to track the passage of time. This headless\ncomponent provides the semantic structure and accessibility features while the\nconsumer manages the actual timer logic and provides formatted display content\nthrough the children slot.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Timer\n  label=&quot;Session timeout&quot;\n  datetime=&quot;PT5M30S&quot;\n  &gt;05:30&lt;/Timer\n&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Timer\n  label=&quot;Exam time remaining&quot;\n  datetime=&quot;PT45M00S&quot;\n  &gt;45:00&lt;/Timer\n&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Timer label=&quot;Elapsed consultation time&quot;&gt;{formatMinutesSeconds(elapsed)}&lt;/Timer&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Timer\n  label=&quot;Cooking timer&quot;\n  datetime=&quot;PT12M15S&quot;\n  &gt;12:15&lt;/Timer\n&gt;\n</code></pre>\n<p>A reader who must hear the time hears a milestone, not every tick: the timer stays quiet, and a separate status region\nannounces the consumer&#39;s own words when a milestone passes.</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Timer\n  label=&quot;Session timeout&quot;\n  datetime=&quot;PT1M00S&quot;\n  &gt;01:00&lt;/Timer\n&gt;\n&lt;p role=&quot;status&quot;&gt;One minute left. Save your work.&lt;/p&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) -- accessible label for screen readers</li>\n<li><code>children</code>: slot (required) -- formatted timer display content</li>\n<li><code>...restProps</code>: Any additional HTML attributes spread onto the <code>&lt;time&gt;</code> element</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None -- this is an informational display, not interactive</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;timer&quot;</code> indicates countdown or elapsed time</li>\n<li><code>aria-label</code> from the label prop provides accessible name</li>\n<li>No <code>aria-live</code>: the timer is read on demand, and milestones go to a separate status region</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for countdown or elapsed time display, such as session timeout, exam timer, or cooking timer.</li>\n<li>Use with a separate <code>role=&quot;status&quot;</code> region when a reader must hear a milestone, such as &quot;one minute left&quot;.</li>\n<li>Use with the <code>datetime</code> attribute for machine-readable ISO 8601 durations.</li>\n<li>Use when the displayed time updates dynamically via consumer-managed intervals.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for static time display -- show the time as plain text or a <code>&lt;time&gt;</code> element.</li>\n<li>Do not use for auto-triggering actions on countdown -- use TimerButton instead.</li>\n<li>Do not use when time remaining is better shown as a proportion -- use Progress or Meter instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component provides a <code>&lt;time&gt;</code> element with <code>role=&quot;timer&quot;</code> and <code>aria-label</code>, not live, for an accessible time display. The consumer manages all timer logic (intervals, countdowns) and provides formatted display content through the children slot, plus all visual styling.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.timer</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;time&gt;</code> element with class <code>timer</code></li>\n<li>Verify role=&quot;timer&quot;` indicates countdown or elapsed time</li>\n<li>Verify aria-label` from the label prop provides accessible name</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Use a clear, monospaced or tabular font for the timer digits to prevent layout shifts as numbers change. Consider color changes as time runs low.</li>\n<li><strong>Accessibility</strong>: Never make the timer itself live. Put milestone announcements (&quot;five minutes left&quot;, &quot;time is up&quot;) in a separate <code>role=&quot;status&quot;</code> region (<code>role=&quot;alert&quot;</code> only for the last one, if it ends the user&#39;s work), updated only when a milestone passes; WCAG 2.2.1 also asks that the user can extend a time limit.</li>\n<li><strong>Developers</strong>: Provide a <code>datetime</code> attribute (e.g., <code>datetime=&quot;PT5M30S&quot;</code>) via restProps for machine-readable duration. Manage cleanup of intervals on component unmount.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;time role=&quot;timer&quot; aria-label={label}&gt;</code></li>\n<li>Children slot provides the formatted timer display text</li>\n<li>Not a live region (<code>role=&quot;timer&quot;</code> is <code>aria-live=&quot;off&quot;</code>): announce milestones (&quot;one minute left&quot;) in a separate <code>role=&quot;status&quot;</code> region, never every tick</li>\n<li>Consumer manages timer logic (intervals, countdowns); this component only provides structure and accessibility</li>\n<li>Optional <code>datetime</code> attribute can be passed via restProps for machine-readable duration (e.g. <code>datetime=&quot;PT5M30S&quot;</code>)</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>timer-button</code> — a button with a timer that will automatically click after a given amount of time</li>\n<li><code>loading</code> — a loading indicator, such as text, or image, or animation</li>\n<li><code>date-time-view</code> — see components.tsv</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA timer role: <a href=\"https://www.w3.org/TR/wai-aria-1.2/#timer\">https://www.w3.org/TR/wai-aria-1.2/#timer</a></li>\n<li>HTML <code>&lt;time&gt;</code> element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time</a></li>\n<li>ISO 8601 Duration format: <a href=\"https://en.wikipedia.org/wiki/ISO_8601#Durations\">https://en.wikipedia.org/wiki/ISO_8601#Durations</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<time class=\"timer\" role=\"timer\" aria-label=\"Time remaining\" datetime=\"PT5M\">05:00</time>";
  const svelteSource: string = "// In your Svelte component:\nimport Timer from \"lily-design-system-svelte-headless/components/Timer/Timer.svelte\";\n\n<Timer>\n  <!-- content -->\n</Timer>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import Timer from \"./Timer.svelte\";\n<\/script>\n\n<Timer label=\"Countdown\">05:30</Timer>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Timer — Lily Design System</title>
  <meta name="description" content="A timer is a UI/UX component that displays a countdown or elapsed time value" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/timer/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: timer</li>
      <li>PascalCase: Timer</li>
      <li>Description: a countdown or elapsed time display</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;time&gt;</li>
      <li>CSS class: .timer</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="timer"</code> indicates countdown or elapsed time</li>
      <li><code>aria-label</code> from the label prop provides accessible name</li>
      <li>No <code>aria-live</code>: the timer is read on demand, and milestones go to a separate status region</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None -- this is an informational display, not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- accessible label for screen readers</li>
      <li><code>children</code>: slot (required) -- formatted timer display content</li>
      <li><code>...restProps</code>: Any additional HTML attributes spread onto the <code>&lt;time&gt;</code> element</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
