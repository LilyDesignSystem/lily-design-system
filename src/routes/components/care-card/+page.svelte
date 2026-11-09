<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Care Card</h1>\n<p>A care card is a healthcare-oriented component for displaying medical guidance with varying levels of urgency. Inspired by the NHS England design system, care cards communicate health advice in three tiers: non-urgent (speak to a GP), urgent (visit A&amp;E or call 111), and immediate (call 999).</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>Each care card has a heading that describes the action and a body containing the relevant advice or conditions. The <code>data-type</code> attribute allows consumers to apply urgency-appropriate styling (e.g., blue for non-urgent, red for immediate). The card is a <code>&lt;div role=&quot;group&quot;&gt;</code> named by its heading, not a landmark, so a page of cards does not flood the landmark list.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;CareCard\n  type=&quot;non-urgent&quot;\n  heading=&quot;See a GP if:&quot;\n&gt;\n  &lt;ul&gt;\n    &lt;li&gt;your symptoms do not improve after 2 weeks&lt;/li&gt;\n    &lt;li&gt;you have a high temperature for more than 3 days&lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/CareCard&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;CareCard\n  type=&quot;urgent&quot;\n  heading=&quot;Ask for an urgent GP appointment or call 111 if:&quot;\n&gt;\n  &lt;ul&gt;\n    &lt;li&gt;you have difficulty breathing&lt;/li&gt;\n    &lt;li&gt;you have chest pain&lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/CareCard&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;CareCard\n  type=&quot;immediate&quot;\n  heading=&quot;Call 999 if:&quot;\n&gt;\n  &lt;ul&gt;\n    &lt;li&gt;someone is unconscious&lt;/li&gt;\n    &lt;li&gt;someone is having a seizure for the first time&lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/CareCard&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>type</code>: &quot;non-urgent&quot; | &quot;urgent&quot; | &quot;immediate&quot; (default: &quot;non-urgent&quot;) -- urgency level</li>\n<li><code>heading</code>: string (required) -- heading text for the care card</li>\n<li><code>label</code>: string (optional) -- <code>aria-label</code> override; defaults to heading text</li>\n<li><code>children</code>: slot (required) -- the care card body content</li>\n<li><code>...restProps</code>: Any additional HTML attributes passed to the <code>&lt;div&gt;</code> element</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None -- this component is a passive content container</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> -- groups the heading and body under one name</li>\n<li><code>aria-label</code> -- set from <code>label</code> prop or <code>heading</code> prop for screen reader identification</li>\n<li><code>data-type</code> -- exposes urgency level for consumer styling hooks</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to provide medical care instructions with urgency levels (non-urgent, urgent, emergency)</li>\n<li>Use when directing users to seek medical help, such as &quot;See a GP&quot; or &quot;Call 999&quot;</li>\n<li>Use to communicate the appropriate level of medical response for symptoms described on the page</li>\n<li>Use when medical guidance needs to be visually distinct from surrounding content with clear urgency indicators</li>\n<li>Use on health information pages where users need actionable next steps based on their symptoms</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for general warnings without medical context -- use WarningCallout instead</li>\n<li>Do not use for informational callouts or supplementary notes -- use InformationCallout or InsetText</li>\n<li>Do not use for system alerts or application-level messages -- use Alert or Banner</li>\n<li>Do not use for patient record banners -- use MedicalBanner with MedicalBannerBoxForDanger</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless CareCard component provides a <code>&lt;div role=&quot;group&quot;&gt;</code>, accessible labeling from the heading, and a <code>data-type</code> attribute exposing the urgency level. The consumer provides all visual styling including urgency-specific colors (e.g., blue for non-urgent, red for immediate), card borders, spacing, and typography.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.care-card</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>care-card</code></li>\n<li>Verify <code>role=&quot;group&quot;</code> groups the heading and body under one name</li>\n<li>Verify aria-label<code>-- set from</code>label<code>prop or</code>heading` prop for screen reader identification</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Use distinct, high-contrast colors for each urgency level so users can quickly identify severity. Follow NHS design patterns for familiarity in healthcare contexts.</li>\n<li><strong>Developers</strong>: Always set the <code>type</code> prop explicitly to match the clinical urgency. Use the <code>data-type</code> attribute in your CSS selectors to apply urgency-specific styling.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>NHS England inspired pattern for healthcare guidance</li>\n<li>Three urgency levels: non-urgent, urgent, immediate</li>\n<li>Renders a <code>&lt;div role=&quot;group&quot;&gt;</code> with its heading, not a landmark, so a page of cards does not flood the landmark list</li>\n<li><code>aria-label</code> defaults to the heading text, overridable via the <code>label</code> prop</li>\n<li>Uses <code>&lt;h2&gt;</code> for the heading element</li>\n<li><code>data-type</code> attribute exposes the urgency level for consumer CSS styling</li>\n<li>Content is provided through child elements</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>card</code> — a grouped content container with header, body, and footer areas</li>\n<li><code>medical-banner</code> — a prominent message bar across the top of a page, with medical information</li>\n<li><code>alert</code> — a status message for important information or feedback</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>NHS England Care Cards: <a href=\"https://service-manual.nhs.uk/design-system/components/care-cards\">https://service-manual.nhs.uk/design-system/components/care-cards</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"care-card\" role=\"group\" aria-label=\"Speak to a GP if:\" data-type=\"non-urgent\"><h2>Speak to a GP if:</h2><p>you have a rash that does not fade when a glass is pressed against it.</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport CareCard from \"lily-design-system-svelte-headless/components/CareCard/CareCard.svelte\";\n\n<CareCard>\n  <!-- content -->\n</CareCard>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import CareCard from \"./CareCard.svelte\";\n<\/script>\n\n<CareCard\n  type=\"non-urgent\"\n  heading=\"Speak to a GP if:\"\n>\n  <ul>\n    <li>symptoms have lasted more than 3 days</li>\n  </ul>\n</CareCard>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>CareCard — Lily Design System</title>
  <meta name="description" content="A care card is a healthcare-oriented component for displaying medical guidance with varying levels of urgency. Inspired by the NHS England design system, care cards communicate health advice in three tiers: non-urgent (speak to a GP), urgent (visit A&amp;E or call 111), and immediate (call 999)." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/care-card/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: care-card</li>
      <li>PascalCase: CareCard</li>
      <li>Description: a medical care instruction card with urgency levels</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .care-card</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> -- groups the heading and body under one name</li>
      <li><code>aria-label</code> -- set from <code>label</code> prop or <code>heading</code> prop for screen reader identification</li>
      <li><code>data-type</code> -- exposes urgency level for consumer styling hooks</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None -- this component is a passive content container</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>type</code>: "non-urgent" | "urgent" | "immediate" (default: "non-urgent") -- urgency level</li>
      <li><code>heading</code>: string (required) -- heading text for the care card</li>
      <li><code>label</code>: string (optional) -- <code>aria-label</code> override; defaults to heading text</li>
      <li><code>children</code>: slot (required) -- the care card body content</li>
      <li><code>...restProps</code>: Any additional HTML attributes passed to the <code>&lt;div&gt;</code> element</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
