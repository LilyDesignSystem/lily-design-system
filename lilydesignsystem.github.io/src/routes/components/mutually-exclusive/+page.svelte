<script lang="ts">
  const html: string = "<h1>MutuallyExclusive</h1>\n\n<p>A container that enforces a \"zero or one\" selection rule across a group of checkboxes — when the user checks one option, the previously checked option is unchecked, but unlike a radio group the user is also free to uncheck the current selection and leave the group with nothing selected.</p>\n\n<p>This sits in the gap between <code>RadioGroup</code> (always exactly one) and <code>CheckboxGroup</code> (any number, including all). It is the right choice for optional preferences (\"which one of these would you prefer, if any?\") rather than required choices. The component renders <code>role=\"group\"</code> with an accessible label so screen readers announce the constraint, and each child checkbox keeps its own native semantics.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Wraps a group of selectable controls (typically checkboxes) and enforces that only one can be checked at a time</li>\n<li>When the user checks one option, the previously-checked option is unchecked</li>\n<li>Behaves like a radio group but allows the user to <em>uncheck</em> the current selection (to leave the group with no selection)</li>\n<li>Renders <code>role=\"group\"</code> with an <code>aria-label</code> so the constraint is communicated to assistive technology</li>\n<li>Children are passed via the <code>children</code> slot; the consumer composes the individual <code>CheckboxInput</code> controls</li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Accessible label for the group</td></tr>\n<tr><td><code>value</code></td><td>string</td><td>null</td><td>null</td><td>Currently selected option's value, or null when none is selected; bindable</td></tr>\n<tr><td><code>onChange</code></td><td>(value: string</td><td>null) =&gt; void</td><td>—</td><td>Fired when the selected value changes</td></tr>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>The CheckboxInput controls that make up the group</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;div&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;MutuallyExclusive label=\"Preferred contact method\" value={contact} onChange={setContact}&gt;\n  &lt;CheckboxInput value=\"email\" label=\"Email\" /&gt;\n  &lt;CheckboxInput value=\"sms\" label=\"SMS\" /&gt;\n  &lt;CheckboxInput value=\"post\" label=\"Post\" /&gt;\n&lt;/MutuallyExclusive&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Tab moves focus through the child controls</li>\n<li>Space toggles the focused checkbox (native behaviour); the component handler then unchecks any other previously-checked option</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"group\"</code> + <code>aria-label</code> identifies the group</li>\n<li>Each child checkbox retains its own native semantics</li>\n<li>Consumers may also use <code>aria-describedby</code> to reference an explanation of the constraint</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>When a question allows zero or one answer (radio group requires at least one) and you want a familiar checkbox affordance</li>\n<li>Surveys or settings where \"none of these\" is a valid state</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>RadioGroup</code> when at least one option must always be selected</li>\n<li>Use <code>CheckboxGroup</code> when multiple selections are allowed</li>\n<li>Use <code>SegmentGroup</code> for short, side-by-side mutually exclusive options</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.mutually-exclusive</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>radio-group</code> — mandatory mutually exclusive selection</li>\n<li><code>checkbox-group</code> — multiple selections allowed</li>\n<li><code>segment-group</code> — segmented control for short option lists</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#group\">WAI-ARIA group role</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"mutually-exclusive\" aria-label=\"a container ensuring only one option can be selected from a group\">MutuallyExclusive</div>";
  const svelteSource: string = "// In your Svelte component:\nimport MutuallyExclusive from \"lily-design-system-svelte-headless/components/MutuallyExclusive/MutuallyExclusive.svelte\";\n\n<MutuallyExclusive>\n  <!-- content -->\n</MutuallyExclusive>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MutuallyExclusive — Lily Design System</title>
  <meta name="description" content="A container that enforces a &quot;zero or one&quot; selection rule across a group of checkboxes — when the user checks one option, the previously checked option is unchecked, but unlike a radio group the use..." />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <pre style="overflow-x: auto; padding: 1rem; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

