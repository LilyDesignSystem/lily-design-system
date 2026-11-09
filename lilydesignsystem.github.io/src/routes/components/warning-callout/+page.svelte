<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Warning Callout</h1>\n<p>A warning callout is a component used to draw attention to important alerts or potential issues that require user attention or caution. It highlights warnings, errors, or critical information that could affect the user&#39;s experience or actions, and may include additional text or links to help users understand the issue or take corrective actions.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>This headless component renders an <code>&lt;aside&gt;</code> element with <code>role=&quot;alert&quot;</code>, which causes screen readers to announce the content immediately when it appears. The consumer provides the warning content as children and is responsible for all visual styling.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;WarningCallout heading=&quot;Important&quot;&gt;\n  &lt;p&gt;\n    If you have a peanut allergy, do not take this medicine. Talk to your doctor about alternative\n    treatments.\n  &lt;/p&gt;\n&lt;/WarningCallout&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;WarningCallout heading=&quot;School, nursery or playgroup&quot;&gt;\n  &lt;p&gt;\n    Tell your child&#39;s school or nursery if they have been diagnosed with chickenpox. Stay away from\n    school until all the blisters have crusted over, usually 5 days after the spots first appeared.\n  &lt;/p&gt;\n&lt;/WarningCallout&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (optional) -- accessible name applied via <code>aria-label</code>; useful when multiple alerts exist on the same page</li>\n<li><code>children</code>: slot (required) -- the warning content to display</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None -- this component is a passive container for alert content.</p>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;alert&quot;</code> -- identifies the content as an alert; screen readers announce it immediately when it appears or changes</li>\n<li><code>aria-label={label}</code> -- optional accessible name to distinguish this alert from others on the page</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for information that is time-critical and users must not miss</li>\n<li>Use for content that could significantly impact someone&#39;s health if overlooked</li>\n<li>Use to address common misconceptions or mistakes that could lead to harm</li>\n<li>Use on content pages where the warning stands out from surrounding body text</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use on transactional pages — the pattern is untested in that context</li>\n<li>Do not use when directing users to contact their GP or seek medical help — use CareCard instead</li>\n<li>Do not use for information that is not sufficiently important — use InsetText for general callouts</li>\n<li>Do not use for system-level alerts or error states — use Alert or Banner instead</li>\n<li>Do not use more than two on a page, or let one run past about five lines on a mobile screen: past those limits the warnings stop standing out and none is read</li>\n<li>Do not place one directly against a button or action link — see the spacing rules in Advice</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component provides an <code>&lt;aside&gt;</code> element with <code>role=&quot;alert&quot;</code> (which implicitly sets <code>aria-live=&quot;assertive&quot;</code>) for immediate screen reader announcements. The consumer provides all warning content as children and all visual styling including borders, background colors, and icons.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.warning-callout</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders an <code>&lt;aside&gt;</code> element with class <code>warning-callout</code></li>\n<li>Verify role=&quot;alert&quot;` -- identifies the content as an alert; screen readers announce it immediately when it appears or changes</li>\n<li>Verify aria-label={label}` -- optional accessible name to distinguish this alert from others on the page</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Use a distinct visual treatment (e.g., amber/yellow background, warning icon) to differentiate warnings from errors and informational messages. Ensure sufficient color contrast.</li>\n<li><strong>Developers</strong>: Content within <code>role=&quot;alert&quot;</code> is announced immediately by screen readers when it appears or changes. Avoid dynamically adding and removing WarningCallout rapidly, as each change triggers an announcement.</li>\n<li><strong>Limits</strong>: At most two callouts per page, and at most five lines of text on mobile. Separate a callout from a button or action link below it with a short paragraph, and give any text that follows a callout its own heading so the callout is not read as that section&#39;s opening. Use the default callout for time-critical or health-affecting information and the &quot;important&quot; variant (the consumer&#39;s <code>data-*</code> or class hook) for everything else. Never use it in transactional pages.</li>\n<li><strong>Hidden prefix</strong>: The consumer puts a visually hidden prefix such as &quot;Important&quot; at the start of the content so a screen reader user hears the kind of message before its text. Lily ships no English and no prop for it: supply the string in your own language, inside <code>ScreenReaderSpan</code>. Omit the prefix when the callout&#39;s heading already says so. The optional <code>label</code> prop is separate: it is only the <code>aria-label</code> on the <code>&lt;aside&gt;</code>, useful to tell several callouts apart, and does not replace the hidden prefix.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders an <code>&lt;aside&gt;</code> element with <code>role=&quot;alert&quot;</code> for immediate screen reader announcements</li>\n<li>The <code>role=&quot;alert&quot;</code> implicitly sets <code>aria-live=&quot;assertive&quot;</code>, meaning content is announced immediately</li>\n<li>The <code>label</code> prop is optional since the alert content itself provides the message</li>\n<li>Accepts <code>...restProps</code> for forwarding additional attributes to the aside element</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>alert</code> — a status message for important information or feedback</li>\n<li><code>information-callout</code> — a callout box highlighting informational content</li>\n<li><code>banner</code> — a prominent message bar across the top of a page</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Alert Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/alert/\">https://www.w3.org/WAI/ARIA/apg/patterns/alert/</a></li>\n<li>WAI-ARIA alert role: <a href=\"https://www.w3.org/TR/wai-aria-1.2/#alert\">https://www.w3.org/TR/wai-aria-1.2/#alert</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<aside class=\"warning-callout\" role=\"alert\" aria-label=\"Important\"><h3>Important</h3><p>Call 111 if you cannot return to school.</p></aside>";
  const svelteSource: string = "// In your Svelte component:\nimport WarningCallout from \"lily-design-system-svelte-headless/components/WarningCallout/WarningCallout.svelte\";\n\n<WarningCallout>\n  <!-- content -->\n</WarningCallout>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import WarningCallout from \"./WarningCallout.svelte\";\n<\/script>\n\n<WarningCallout label=\"Session warning\">\n  <p>Your session is about to expire.</p>\n</WarningCallout>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>WarningCallout — Lily Design System</title>
  <meta name="description" content="A warning callout is a component used to draw attention to important alerts or potential issues that require user attention or caution. It highlights warnings, errors, or critical information that could affect the user's experience or actions, and may include additional text or links to help user…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/warning-callout/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: warning-callout</li>
      <li>PascalCase: WarningCallout</li>
      <li>Description: a callout box highlighting a warning message</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;aside&gt;</li>
      <li>CSS class: .warning-callout</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="alert"</code> -- identifies the content as an alert; screen readers announce it immediately when it appears or changes</li>
      <li><code>aria-label=&#123;label&#125;</code> -- optional accessible name to distinguish this alert from others on the page</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions — this is a passive element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (optional) -- accessible name applied via <code>aria-label</code>; useful when multiple alerts exist on the same page</li>
      <li><code>children</code>: slot (required) -- the warning content to display</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
