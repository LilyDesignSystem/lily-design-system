<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Range Fieldset</h1>\n<p>RangeFieldset is a two-thumb range: a span of values chosen with two sliders on one track, such as a price band, an age range or the hours a clinic is open. It renders a <code>&lt;fieldset&gt;</code> with a visible <code>&lt;legend&gt;</code> and two native <code>&lt;input type=&quot;range&quot;&gt;</code>, one for the minimum and one for the maximum. The thumbs cannot cross, each value is its own form field, and a form reset puts both back.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<p>Price filter:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;RangeFieldset\n  legend=&quot;Price&quot;\n  minimumLabel=&quot;Lowest price&quot;\n  maximumLabel=&quot;Highest price&quot;\n  minimum=&quot;{20}&quot;\n  maximum=&quot;{80}&quot;\n  minimumName=&quot;price-min&quot;\n  maximumName=&quot;price-max&quot;\n/&gt;\n</code></pre>\n<p>Age range in a search form:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;RangeFieldset\n  legend=&quot;Age&quot;\n  minimumLabel=&quot;Youngest age&quot;\n  maximumLabel=&quot;Oldest age&quot;\n  min=&quot;{0}&quot;\n  max=&quot;{120}&quot;\n  minimum=&quot;{18}&quot;\n  maximum=&quot;{65}&quot;\n/&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>legend</code>: string (required) — the visible name of the whole range (&quot;Price&quot;)</li>\n<li><code>minimumLabel</code>: string (required) — the lower thumb&#39;s name (&quot;Lowest price&quot;)</li>\n<li><code>maximumLabel</code>: string (required) — the upper thumb&#39;s name (&quot;Highest price&quot;)</li>\n<li><code>minimum</code>: number (default: <code>min</code>) — the lower value; two-way</li>\n<li><code>maximum</code>: number (default: <code>max</code>) — the upper value; two-way</li>\n<li><code>min</code>: number (default: 0) — the lowest value either thumb can take</li>\n<li><code>max</code>: number (default: 100) — the highest value either thumb can take</li>\n<li><code>step</code>: number (default: 1) — the increment of both thumbs</li>\n<li><code>minimumName</code>: string (optional) — the form field name of the lower value</li>\n<li><code>maximumName</code>: string (optional) — the form field name of the upper value</li>\n<li><code>disabled</code>: boolean (default: false) — disables both thumbs</li>\n<li><code>onchange</code>: (minimum, maximum) =&gt; void (optional) — called when either value changes</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;fieldset&gt;</code></li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves from the lower thumb to the upper thumb</td>\n</tr>\n<tr>\n<td>Left Arrow / Down Arrow</td>\n<td>Decreases the focused thumb by one step</td>\n</tr>\n<tr>\n<td>Right Arrow / Up Arrow</td>\n<td>Increases the focused thumb by one step</td>\n</tr>\n<tr>\n<td>Home</td>\n<td>Moves the focused thumb to its lowest value; the upper stops at the lower one</td>\n</tr>\n<tr>\n<td>End</td>\n<td>Moves the focused thumb to its highest value; the lower stops at the upper one</td>\n</tr>\n<tr>\n<td>Page Up / Page Down</td>\n<td>Moves the focused thumb by a larger step</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li>The <code>&lt;legend&gt;</code> names the group, announced with each thumb</li>\n<li><code>aria-label</code> names each thumb in the consumer&#39;s words</li>\n<li>The native range inputs carry the slider role and announce their values; no ARIA slider is hand-built</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a span of values with a known lowest and highest: a price band, an age range, a dose range, opening hours.</li>\n<li>Use when an approximate span is enough and a person benefits from seeing it on a track.</li>\n<li>Use as a search or filter control that submits both ends.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for one value — use <code>range-input</code> or <code>slider</code>.</li>\n<li>Do not use for exact numbers a person already knows — use two <code>number-input</code> fields in a <code>fieldset</code>, which can be typed.</li>\n<li>Do not use for a span of dates — use <code>date-range</code> or the <code>calendar-range-picker</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.range-fieldset</code> class hook and its parts, and every word. Drawing the two inputs over one track, and the filled span between the thumbs, is the theme&#39;s or the consumer&#39;s CSS.</p>\n<h2>Styles</h2>\n<p><code>.range-fieldset</code>, <code>.range-fieldset-legend</code>, <code>.range-fieldset-minimum</code>, <code>.range-fieldset-maximum</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>The fieldset is named by its legend and holds two range inputs on one scale</li>\n<li>The lower thumb stops at the upper one, and the upper at the lower one</li>\n<li>Both values submit as their own form fields, and a form reset restores both</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Show both values as text beside the track, in the consumer&#39;s number format, so nobody has to read them from the thumbs.</li>\n<li>Name each thumb for what it limits (&quot;Lowest price&quot;), not &quot;Minimum&quot;, so a screen reader announces something useful out of context.</li>\n<li>Keep <code>step</code> coarse enough to reach every value by keyboard in a few presses; use Page Up and Page Down for large ranges.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;fieldset class=&quot;range-fieldset&quot;&gt;</code> with <code>&lt;legend class=&quot;range-fieldset-legend&quot;&gt;</code>, then <code>&lt;input type=&quot;range&quot; class=&quot;range-fieldset-minimum&quot;&gt;</code> and <code>&lt;input type=&quot;range&quot; class=&quot;range-fieldset-maximum&quot;&gt;</code></li>\n<li>Both inputs have the same <code>min</code>, <code>max</code> and <code>step</code>, so a thumb&#39;s position means the same value on either input and the consumer&#39;s CSS can stack them over one track</li>\n<li>A thumb moved past the other stops where the other is: the lower value never exceeds the upper one</li>\n<li>Clamping, rather than changing each input&#39;s <code>min</code> and <code>max</code> as the other moves, keeps the two inputs on one scale; with different limits the same value would sit at different places on the two tracks</li>\n<li>Each input submits its own field (<code>minimumName</code>, <code>maximumName</code>); a form reset returns both to their first values</li>\n<li>HTML and Nunjucks render the markup; the clamp is the consumer&#39;s script, and without script the server takes the lower of the two as the minimum</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>range-input</code> — one value on a track</li>\n<li><code>slider</code> — one value, with a custom track</li>\n<li><code>date-range</code> — a start and an end date</li>\n<li><code>fieldset</code> — a group of related fields with a legend</li>\n</ul>\n<h2>Known limitations</h2>\n<p>None known.</p>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA APG, Multi-Thumb Slider: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/\">https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/</a></li>\n<li>MDN input type=&quot;range&quot;: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range</a></li>\n<li>Spec: spec/lessons/retool/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"range-fieldset\"><legend class=\"range-fieldset-legend\">Price</legend><input class=\"range-fieldset-minimum\" type=\"range\" aria-label=\"Lowest price\" name=\"price-min\" min=\"0\" max=\"100\" step=\"1\" value=\"20\"><input class=\"range-fieldset-maximum\" type=\"range\" aria-label=\"Highest price\" name=\"price-max\" min=\"0\" max=\"100\" step=\"1\" value=\"80\"></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport RangeFieldset from \"lily-design-system-svelte-headless/components/RangeFieldset/RangeFieldset.svelte\";\n\n<RangeFieldset>\n  <!-- content -->\n</RangeFieldset>\n";
  const usageCode: string = "<RangeFieldset\n  legend=\"Price\"\n  minimumLabel=\"Lowest price\"\n  maximumLabel=\"Highest price\"\n  minimum=\"{20}\"\n  maximum=\"{80}\"\n  minimumName=\"price-min\"\n  maximumName=\"price-max\"\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Range Fieldset — Lily Design System</title>
  <meta name="description" content="RangeFieldset is a two-thumb range: a span of values chosen with two sliders on one track, such as a price band, an age range or the hours a clinic is open. It renders a &lt;fieldset&gt; with a visible &lt;legend&gt; and two native &lt;input type=&quot;range&quot;&gt;, one for the minimum and one for the maximum. The thumbs…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/range-fieldset/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: range-fieldset</li>
      <li>PascalCase: RangeFieldset</li>
      <li>Description: a fieldset of two range inputs for a minimum and a maximum that cannot cross</li>
      <li>Purpose: Chooses a span of values with two thumbs on one track.</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .range-fieldset</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>The <code>&lt;legend&gt;</code> names the group</li>
      <li><code>aria-label=&#123;minimumLabel&#125;</code> and <code>aria-label=&#123;maximumLabel&#125;</code> name the thumbs</li>
      <li>The native range inputs carry the slider role and announce their values</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab: Move from the lower thumb to the upper thumb</li>
      <li>Left Arrow / Down Arrow: Decrease the focused thumb by one step</li>
      <li>Right Arrow / Up Arrow: Increase the focused thumb by one step</li>
      <li>Home: Move the focused thumb to its lowest value (the upper thumb stops at the lower one)</li>
      <li>End: Move the focused thumb to its highest value (the lower thumb stops at the upper one)</li>
      <li>Page Up / Page Down: Move the focused thumb by a larger step</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>legend</code>: string (required) -- the visible name of the whole range</li>
      <li><code>minimumLabel</code>: string (required) -- accessible name of the lower thumb</li>
      <li><code>maximumLabel</code>: string (required) -- accessible name of the upper thumb</li>
      <li><code>minimum</code>: number (default: <code>min</code>) -- the lower value; bindable</li>
      <li><code>maximum</code>: number (default: <code>max</code>) -- the upper value; bindable</li>
      <li><code>min</code>: number (default: 0) -- the lowest value either thumb can take</li>
      <li><code>max</code>: number (default: 100) -- the highest value either thumb can take</li>
      <li><code>step</code>: number (default: 1) -- the increment of both thumbs</li>
      <li><code>minimumName</code>: string (optional) -- form field name of the lower value</li>
      <li><code>maximumName</code>: string (optional) -- form field name of the upper value</li>
      <li><code>disabled</code>: boolean (default: false) -- disables both thumbs</li>
      <li><code>onchange</code>: (minimum, maximum) =&gt; void (optional) -- called when either value changes</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;fieldset&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
