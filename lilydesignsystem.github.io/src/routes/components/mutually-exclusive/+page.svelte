<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>MutuallyExclusive</h1>\n<p>A container that enforces a &quot;zero or one&quot; selection rule across a group of checkboxes — when the user checks one option, the previously checked option is unchecked, but unlike a radio group the user is also free to uncheck the current selection and leave the group with nothing selected.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.</p>\n<p>This sits in the gap between <code>RadioGroup</code> (always exactly one) and <code>CheckboxGroup</code> (any number, including all). It is the right choice for optional preferences (&quot;which one of these would you prefer, if any?&quot;) rather than required choices. The component renders <code>role=&quot;group&quot;</code> with an accessible label so screen readers announce the constraint, and each child checkbox keeps its own native semantics.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;MutuallyExclusive\n  label=&quot;Preferred contact method&quot;\n  value=&quot;{contact}&quot;\n  onChange=&quot;{setContact}&quot;\n&gt;\n  &lt;CheckboxInput\n    value=&quot;email&quot;\n    label=&quot;Email&quot;\n  /&gt;\n  &lt;CheckboxInput\n    value=&quot;sms&quot;\n    label=&quot;SMS&quot;\n  /&gt;\n  &lt;CheckboxInput\n    value=&quot;post&quot;\n    label=&quot;Post&quot;\n  /&gt;\n&lt;/MutuallyExclusive&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Accessible label for the group</td>\n</tr>\n<tr>\n<td><code>value</code></td>\n<td>string</td>\n<td>null</td>\n<td>null</td>\n</tr>\n<tr>\n<td><code>onChange</code></td>\n<td>(value: string</td>\n<td>null) =&gt; void</td>\n<td>—</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot (required)</td>\n<td>—</td>\n<td>The CheckboxInput controls that make up the group</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;fieldset&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Tab moves focus through the child controls</li>\n<li>Space toggles the focused checkbox (native behaviour); the component handler then unchecks any other previously-checked option</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>The <code>&lt;fieldset&gt;</code> (implicit <code>group</code> role) + <code>aria-label</code> identifies the group</li>\n<li>Each child checkbox retains its own native semantics</li>\n<li>Consumers may also use <code>aria-describedby</code> to reference an explanation of the constraint</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>When a question allows zero or one answer (radio group requires at least one) and you want a familiar checkbox affordance</li>\n<li>Surveys or settings where &quot;none of these&quot; is a valid state</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>RadioGroup</code> when at least one option must always be selected</li>\n<li>Use <code>CheckboxGroup</code> when multiple selections are allowed</li>\n<li>Use <code>SegmentGroup</code> for short, side-by-side mutually exclusive options</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n<h2>Styles</h2>\n<p>The component renders with <code>.mutually-exclusive</code> as the root class. No default styles are included.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>radio-group</code> — mandatory mutually exclusive selection</li>\n<li><code>checkbox-group</code> — multiple selections allowed</li>\n<li><code>segment-group</code> — segmented control for short option lists</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#group\">WAI-ARIA group role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Wraps a group of selectable controls (typically checkboxes) and enforces that only one can be checked at a time</li>\n<li>When the user checks one option, the previously-checked option is unchecked</li>\n<li>Behaves like a radio group but allows the user to <em>uncheck</em> the current selection (to leave the group with no selection)</li>\n<li>Renders a <code>&lt;fieldset&gt;</code> named by <code>aria-label</code> (its native group role), the element HTML gives a set of form controls</li>\n<li>Children are passed via the <code>children</code> slot; the consumer composes the individual <code>CheckboxInput</code> controls</li>\n</ul>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"mutually-exclusive\" aria-label=\"Contact me by\"><label><input type=\"checkbox\" name=\"demo-contact\" value=\"email\" /> Email</label><label><input type=\"checkbox\" name=\"demo-contact\" value=\"phone\" /> Phone</label></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport MutuallyExclusive from \"lily-design-system-svelte-headless/components/MutuallyExclusive/MutuallyExclusive.svelte\";\n\n<MutuallyExclusive>\n  <!-- content -->\n</MutuallyExclusive>\n";
  const usageCode: string = "<MutuallyExclusive\n  label=\"Preferred contact method\"\n  value=\"{contact}\"\n  onChange=\"{setContact}\"\n>\n  <CheckboxInput\n    value=\"email\"\n    label=\"Email\"\n  />\n  <CheckboxInput\n    value=\"sms\"\n    label=\"SMS\"\n  />\n  <CheckboxInput\n    value=\"post\"\n    label=\"Post\"\n  />\n</MutuallyExclusive>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MutuallyExclusive — Lily Design System</title>
  <meta name="description" content="A container that enforces a &quot;zero or one&quot; selection rule across a group of checkboxes — when the user checks one option, the previously checked option is unchecked, but unlike a radio group the user is also free to uncheck the current selection and leave the group with nothing selected." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/mutually-exclusive/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: mutually-exclusive</li>
      <li>PascalCase: MutuallyExclusive</li>
      <li>Description: a container ensuring only one option can be selected from a group</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .mutually-exclusive</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>The <code>&lt;fieldset&gt;</code> (implicit <code>group</code> role) + <code>aria-label</code> identifies the group</li>
      <li>Each child checkbox retains its own native semantics</li>
      <li>Consumers may also use <code>aria-describedby</code> to reference an explanation of the constraint</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves focus through the child controls</li>
      <li>Space toggles the focused checkbox (native behaviour); the component handler then unchecks any other previously-checked option</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) (default: —) — Accessible label for the group</li>
      <li><code>value</code>: string | null (default: null) — Currently selected option's value, or null when none is selected; bindable</li>
      <li><code>onChange</code>: (value: string | null) =&gt; void (default: —) — Fired when the selected value changes</li>
      <li><code>children</code>: slot (required) (default: —) — The CheckboxInput controls that make up the group</li>
      <li><code>...restProps</code>: HTML attributes (default: —) — Spread onto the root <code>&lt;fieldset&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
