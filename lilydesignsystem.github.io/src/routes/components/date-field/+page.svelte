<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Date Field</h1>\n<p>A date field asks for a date as three parts, day, month and year, in a <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>, with optional helper text and an error message, all linked by generated ids. It suits dates people know by heart, such as a date of birth, where a calendar picker is slower than typing.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.</p>\n<p>The <code>value</code> prop is bindable and is an ISO 8601 date once all three parts are filled. The order of the parts is the consumer&#39;s (<code>order</code>), and so are the part labels: there is no English or regional default. Error messages are announced to screen readers via <code>role=&quot;alert&quot;</code>, and each part carries <code>aria-invalid</code> while an error is shown.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<p>Date of birth, day first:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;DateField\n  label=&quot;Date of birth&quot;\n  dayLabel=&quot;Day&quot;\n  monthLabel=&quot;Month&quot;\n  yearLabel=&quot;Year&quot;\n  order=&quot;dmy&quot;\n  name=&quot;dob&quot;\n  autocomplete=&quot;bday&quot;\n  value=&quot;{dateOfBirth}&quot;\n  description=&quot;For example, 27 3 2007&quot;\n  required\n/&gt;\n</code></pre>\n<p>With a validation error, year first:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;DateField\n  label=&quot;Appointment date&quot;\n  dayLabel=&quot;Day&quot;\n  monthLabel=&quot;Month&quot;\n  yearLabel=&quot;Year&quot;\n  value=&quot;{appointmentDate}&quot;\n  error=&quot;The date must be in the future&quot;\n  required\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) -- the legend, naming the whole date</li>\n<li><code>dayLabel</code>: string (required) -- the day part&#39;s label</li>\n<li><code>monthLabel</code>: string (required) -- the month part&#39;s label</li>\n<li><code>yearLabel</code>: string (required) -- the year part&#39;s label</li>\n<li><code>order</code>: &quot;ymd&quot; | &quot;dmy&quot; | &quot;mdy&quot; (default: &quot;ymd&quot;) -- the order of the parts</li>\n<li><code>value</code>: string (default: &quot;&quot;) -- the date as <code>YYYY-MM-DD</code>, or &quot;&quot; while a part is empty; two-way bindable</li>\n<li><code>name</code>: string (default: undefined) -- base name; the parts are <code>{name}-day</code>, <code>{name}-month</code>, <code>{name}-year</code></li>\n<li><code>autocomplete</code>: &quot;bday&quot; (default: undefined) -- a date of birth: the parts autocomplete as <code>bday-day</code>, <code>bday-month</code>, <code>bday-year</code> (WCAG 1.3.5)</li>\n<li><code>description</code>: string (default: undefined) -- helper text, linked from the fieldset</li>\n<li><code>error</code>: string (default: undefined) -- error message, linked from the fieldset and announced</li>\n<li><code>required</code>: boolean (default: false) -- every part is required</li>\n<li><code>disabled</code>: boolean (default: false) -- the fieldset and its parts are disabled</li>\n<li><code>id</code>: string (default: undefined) -- base id for the parts; auto-generated if omitted</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>Tab moves between the three parts; each is a native text field.</p>\n<h2>ARIA</h2>\n<ul>\n<li><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> -- the group&#39;s name, which a screen reader announces with each part</li>\n<li><code>&lt;label for&gt;</code> -- names each part</li>\n<li><code>aria-describedby</code> -- on the <code>&lt;fieldset&gt;</code>, the description and the error when present</li>\n<li><code>aria-invalid=&quot;true&quot;</code> -- on each part while an <code>error</code> is shown</li>\n<li><code>role=&quot;alert&quot;</code> -- on the error paragraph, announces the error message to screen readers</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for structured date entry with separate fields for day, month, and year.</li>\n<li>Use when more control over individual date parts is needed than a plain DateInput provides.</li>\n<li>Use when you want built-in ARIA linking between the label, input, description, and error message without manual ID management.</li>\n<li>Use for forms that require date input with validation feedback, description text, and error display in a single integrated component.</li>\n<li>Use when accessibility-compliant date entry is essential, such as in healthcare or government forms.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for known exact dates where a simple DateInput is sufficient.</li>\n<li>Do not use for calendar-based date selection -- use CalendarTable or CalendarRangePicker instead.</li>\n<li>Do not use when you need a bare date input with custom label placement; use DateInput instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless DateField component provides a <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>, three labelled part fields, an optional description <code>&lt;p&gt;</code>, and an optional error <code>&lt;p&gt;</code> with <code>role=&quot;alert&quot;</code>, linked from the fieldset by <code>aria-describedby</code>. The consumer provides all visual styling including label typography, input appearance, description and error text colors, and layout.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.date-field</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;fieldset&gt;</code> element with class <code>date-field</code>, a <code>&lt;legend&gt;</code>, and the three parts in <code>order</code></li>\n<li>Verify role=&quot;alert&quot;` -- on the error paragraph, announces the error message to screen readers</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Place the description text below the label and above the input to set expectations before users interact. Display error messages in a contrasting color near the input.</li>\n<li><strong>Developers</strong>: Use the bindable <code>value</code> prop for two-way date state; it stays &quot;&quot; until all three parts are filled, so validate the parts on submit. Pick <code>order</code> for your users&#39; convention (ISO 8601 <code>ymd</code> by default). The auto-generated ids handle the ARIA linking.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;fieldset&gt;</code> named by a <code>&lt;legend&gt;</code> (<code>label</code>), holding three labelled text fields for the day, month and year parts (<code>inputmode=&quot;numeric&quot;</code>), an optional description <code>&lt;p&gt;</code>, and an optional error <code>&lt;p role=&quot;alert&quot;&gt;</code></li>\n<li><code>order</code> sets the order of the parts: <code>&quot;ymd&quot;</code> (ISO 8601, the default), <code>&quot;dmy&quot;</code> or <code>&quot;mdy&quot;</code>; the component picks no regional order of its own</li>\n<li>The three part labels (<code>dayLabel</code>, <code>monthLabel</code>, <code>yearLabel</code>) are required and have no default: the words are the consumer&#39;s, in their language</li>\n<li><code>value</code> is two-way: an ISO 8601 date (<code>YYYY-MM-DD</code>) when all three parts are filled, or <code>&quot;&quot;</code> while any is empty; a new <code>value</code> fills the parts</li>\n<li>Each part is named <code>{name}-day</code>, <code>{name}-month</code> and <code>{name}-year</code>, so a server-rendered form submits without script</li>\n<li>Auto-generates a unique base id when none is given; the parts are <code>{id}-day</code>, <code>{id}-month</code>, <code>{id}-year</code>, and the description and error <code>{id}-desc</code> and <code>{id}-error</code></li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>date-input</code> — an input for entering a date value &lt;input type=\"date\"&gt;</li>\n<li><code>date-range</code> — paired start and end date inputs</li>\n<li><code>calendar-range-picker</code> — a picker for selecting a date range on a calendar</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>ARIA Error Handling: <a href=\"https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21\">https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21</a></li>\n<li>WAI Forms Tutorial: <a href=\"https://www.w3.org/WAI/tutorials/forms/\">https://www.w3.org/WAI/tutorials/forms/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"date-field\" aria-describedby=\"demo-dob-desc\"><legend>Date of birth</legend><label for=\"demo-dob-day\">Day</label><input class=\"date-field-day\" id=\"demo-dob-day\" name=\"dob-day\" type=\"text\" inputmode=\"numeric\" autocomplete=\"bday-day\" maxlength=\"2\" value=\"27\" /><label for=\"demo-dob-month\">Month</label><input class=\"date-field-month\" id=\"demo-dob-month\" name=\"dob-month\" type=\"text\" inputmode=\"numeric\" autocomplete=\"bday-month\" maxlength=\"2\" value=\"03\" /><label for=\"demo-dob-year\">Year</label><input class=\"date-field-year\" id=\"demo-dob-year\" name=\"dob-year\" type=\"text\" inputmode=\"numeric\" autocomplete=\"bday-year\" maxlength=\"4\" value=\"2007\" /><p id=\"demo-dob-desc\">For example, 27 3 2007</p></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport DateField from \"lily-design-system-svelte-headless/components/DateField/DateField.svelte\";\n\n<DateField>\n  <!-- content -->\n</DateField>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import DateField from \"./DateField.svelte\";\n\n  let start = $state(\"\");\n<\/script>\n\n<DateField\n  label=\"Start date\"\n  bind:value={start}\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>DateField — Lily Design System</title>
  <meta name="description" content="A date field asks for a date as three parts, day, month and year, in a &lt;fieldset&gt; named by its &lt;legend&gt;, with optional helper text and an error message, all linked by generated ids. It suits dates people know by heart, such as a date of birth, where a calendar picker is slower than typing." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/date-field/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: date-field</li>
      <li>PascalCase: DateField</li>
      <li>Description: a structured field for entering date components</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .date-field</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> -- the group's name, which a screen reader announces with each part</li>
      <li><code>&lt;label for&gt;</code> -- names each part</li>
      <li><code>aria-describedby</code> -- on the <code>&lt;fieldset&gt;</code>, the description and the error when present</li>
      <li><code>aria-invalid="true"</code> -- on each part while an <code>error</code> is shown</li>
      <li><code>role="alert"</code> -- on the error paragraph, announces the error message to screen readers</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves between the parts; each part is a native text field</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) -- the legend, naming the whole date</li>
      <li><code>dayLabel</code>: string (required) -- the day part's label</li>
      <li><code>monthLabel</code>: string (required) -- the month part's label</li>
      <li><code>yearLabel</code>: string (required) -- the year part's label</li>
      <li><code>order</code>: "ymd" | "dmy" | "mdy" (default: "ymd") -- the order of the parts</li>
      <li><code>value</code>: string (default: "") -- the date as <code>YYYY-MM-DD</code>, or "" while a part is empty; two-way bindable</li>
      <li><code>name</code>: string (default: undefined) -- base name; the parts are <code>&#123;name&#125;-day</code>, <code>&#123;name&#125;-month</code>, <code>&#123;name&#125;-year</code></li>
      <li><code>autocomplete</code>: "bday" (default: undefined) -- a date of birth: the parts autocomplete as <code>bday-day</code>, <code>bday-month</code>, <code>bday-year</code> (WCAG 1.3.5)</li>
      <li><code>description</code>: string (default: undefined) -- helper text, linked from the fieldset</li>
      <li><code>error</code>: string (default: undefined) -- error message, linked from the fieldset and announced</li>
      <li><code>required</code>: boolean (default: false) -- every part is required</li>
      <li><code>disabled</code>: boolean (default: false) -- the fieldset and its parts are disabled</li>
      <li><code>id</code>: string (default: undefined) -- base id for the parts; auto-generated if omitted</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
