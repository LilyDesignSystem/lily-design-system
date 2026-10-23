<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>WheelPicker</h1>\n<p>A vertical single-select listbox where the selection follows the cursor, in the manner of a scroll wheel: moving with the arrow keys, typing, or clicking an option chooses it. Use it to pick one of a short list (an hour, a minute, a month, a year) where a long <code>&lt;select&gt;</code> is awkward. It is the natural control for the time part of <code>DateTimePicker</code>.</p>\n<p><strong>Status:</strong> experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23). Blazor, Nunjucks and plain HTML differ; see &quot;Per-library notes&quot;.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;WheelPicker label=&quot;Month&quot; options={months} bind:value={month} /&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-css\">/* consumer CSS: the 57 themes already do this */\n.wheel-picker-list { max-block-size: 10em; overflow-y: auto; scroll-snap-type: y mandatory; }\n.wheel-picker-option { scroll-snap-align: center; }\n.wheel-picker-option[aria-selected=&quot;true&quot;] { font-weight: 600; }\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Accessible name</td>\n</tr>\n<tr>\n<td><code>options</code></td>\n<td><code>{ value, label, disabled? }[]</code> (required)</td>\n<td>—</td>\n<td>The choices</td>\n</tr>\n<tr>\n<td><code>value</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>The chosen option&#39;s value. Bindable; empty or unknown chooses nothing</td>\n</tr>\n<tr>\n<td><code>loop</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>Arrow keys wrap from the last enabled option to the first and back</td>\n</tr>\n<tr>\n<td><code>pageSize</code></td>\n<td>number</td>\n<td><code>5</code></td>\n<td>Enabled options PageUp / PageDown move by</td>\n</tr>\n<tr>\n<td><code>disabled</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>Not focusable; ignores keys and clicks</td>\n</tr>\n<tr>\n<td><code>name</code></td>\n<td>string</td>\n<td>—</td>\n<td>Adds a hidden input carrying the value</td>\n</tr>\n<tr>\n<td><code>onChange</code></td>\n<td><code>(value) =&gt; void</code></td>\n<td>—</td>\n<td>Once per change</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Per-library notes</h2>\n<ul>\n<li><strong>Svelte</strong> <code>bind:value</code>; <strong>React</strong> controlled (<code>value</code> and <code>onChange</code>); <strong>Vue</strong> <code>v-model</code>; <strong>Angular</strong> <code>[(value)]</code>, no rest-props spread; <strong>Web Components</strong> reads child <code>&lt;option&gt;</code> elements (or the <code>options</code> property) and fires <code>change</code>; <strong>Alpine</strong> <code>lilyWheelPicker({ options, value, … })</code> fires <code>change</code> with <code>{ value }</code>.</li>\n<li><strong>HTML</strong>: the options are in the markup; the snippet&#39;s <code>&lt;script&gt;</code> handles the keys, clicks and the hidden input, and fires a bubbling <code>change</code> with <code>detail.value</code>. The key model inside the script is generated from the shared module between its <code>BEGIN</code>/<code>END</code> markers.</li>\n<li><strong>Nunjucks</strong>: a server cannot handle keys, so the macro renders the markup contract only (selected option, <code>aria-activedescendant</code>, <code>data-loop</code>, <code>data-page-size</code>); add the HTML script or use the Web Components element for the behaviour.</li>\n<li><strong>Blazor</strong> (no JS interop): <code>@bind-Value</code>, key model <code>WheelPickerKeys</code>. A handler cannot call <code>preventDefault</code> for only some keys, so the arrow and page keys also scroll the list (give <code>.wheel-picker-list</code> <code>overflow: hidden</code> to stop that), and the chosen option is not re-centred by script.</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>ArrowDown / ArrowUp</td>\n<td>Choose the next / previous enabled option (wrap only with <code>loop</code>)</td>\n</tr>\n<tr>\n<td>Home / End</td>\n<td>Choose the first / last enabled option</td>\n</tr>\n<tr>\n<td>PageDown / PageUp</td>\n<td>Move by <code>pageSize</code> enabled options, clamped</td>\n</tr>\n<tr>\n<td>A printable character</td>\n<td>Type-ahead over the labels</td>\n</tr>\n<tr>\n<td>Tab</td>\n<td>Leave the control</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;listbox&quot;</code>, <code>aria-label</code>, <code>aria-orientation=&quot;vertical&quot;</code>, <code>aria-activedescendant</code> (the chosen option), <code>aria-disabled</code> when disabled</li>\n<li>Options: <code>role=&quot;option&quot;</code>, <code>aria-selected</code>, <code>aria-disabled</code> when disabled</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Choosing one value from a short, ordered list: hours, minutes, months, years, quantities</li>\n<li>Time and date entry where the reader scrolls or types to the value</li>\n<li>When a visible, scannable list is better than opening a dropdown</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Select</code> or <code>Combobox</code> — for a long list, or one the reader should search</li>\n<li>Use <code>RadioGroup</code> — for two to five choices that should all be visible at once</li>\n<li>Use <code>Slider</code> — for a continuous or very wide numeric range</li>\n<li>Use <code>DateTimePicker</code> — for a full date and time, which composes this for its time columns</li>\n<li>Do not use it for several selections: it is single-select</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides the roles, the keys and the chosen value. It decides no height, snapping, fading, colour or motion; the consumer&#39;s CSS supplies the wheel look.</p>\n<h2>Styles</h2>\n<p>Target <code>.wheel-picker</code>, <code>.wheel-picker-list</code> (give it a height and <code>overflow-y: auto</code>, with <code>scroll-snap-type: y mandatory</code>) and <code>.wheel-picker-option</code> (<code>scroll-snap-align: center</code>). Style the chosen option with <code>[aria-selected=&quot;true&quot;]</code> and a disabled one with <code>[aria-disabled=&quot;true&quot;]</code>. Never remove the list&#39;s focus ring. Under <code>prefers-reduced-motion</code>, drop any scroll smoothing, fade or tilt.</p>\n<h2>Testing</h2>\n<ul>\n<li>Base class first, then the consumer class; a vertical, named listbox</li>\n<li>One option per entry, exactly one <code>aria-selected</code>, none for an unknown value; <code>aria-activedescendant</code> names it</li>\n<li>Arrow, Home, End and Page keys move the choice, skip disabled options, clamp or wrap with <code>loop</code></li>\n<li>Type-ahead chooses the matching option</li>\n<li>Handled keys prevent the default action</li>\n<li>Clicking chooses an enabled option; a disabled one does nothing; the held option is a no-op</li>\n<li>Disabled: not focusable, ignores keys and clicks</li>\n<li>Hidden input only with <code>name</code>, carrying the value; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Give the list a fixed height showing three to seven options, so the chosen one has neighbours on both sides. Keep labels short and put the unit in <code>label</code>, not in every option. For a form field, give the picker a visible label and <code>name</code>.</p>\n<p>A wheel is easy to use with a pointer and keyboard but is a poor fit for screen-magnifier users who see one option at a time: for a long list, offer a <code>Select</code> instead.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;div class=&quot;wheel-picker {class}&quot;&gt;</code> holding <code>&lt;div class=&quot;wheel-picker-list&quot; role=&quot;listbox&quot; aria-orientation=&quot;vertical&quot; tabindex=&quot;0&quot;&gt;</code> of <code>&lt;div class=&quot;wheel-picker-option&quot; role=&quot;option&quot; aria-selected&gt;</code> elements</li>\n<li>DOM focus stays on the list; the cursor is <code>aria-activedescendant</code>. Selection follows the cursor, so there is no commit key (APG listbox, &quot;selection follows focus&quot;)</li>\n<li>The keys, the skipping of disabled options, the wrap rule and type-ahead are the pure <code>shared/wheel-picker.ts</code></li>\n<li>Centres the chosen option by setting the list&#39;s <code>scrollTop</code>: only the list scrolls, never the page, and never animated</li>\n<li>The wheel look (scroll snapping, a fading edge, a 3-D tilt, momentum on touch) is the consumer&#39;s CSS. Dragging and touch inertia are plain scrolling of <code>.wheel-picker-list</code></li>\n<li>The 57 reference themes style it as a scroll-snapping list with the chosen option filled and bold</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>listbox</code></li>\n<li><code>select</code></li>\n<li><code>combobox</code></li>\n<li><code>date-time-picker</code></li>\n<li><code>slider</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/listbox/\">WAI-ARIA APG: Listbox</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap\">MDN: CSS scroll snap</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"wheel-picker\"><div class=\"wheel-picker-list\" role=\"listbox\" aria-label=\"Month\" aria-orientation=\"vertical\" aria-activedescendant=\"wheel-demo-option-2\" tabindex=\"0\"><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-0\" aria-selected=\"false\" data-value=\"1\" data-index=\"0\">January</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-1\" aria-selected=\"false\" data-value=\"2\" data-index=\"1\">February</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-2\" aria-selected=\"true\" data-value=\"3\" data-index=\"2\">March</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-3\" aria-selected=\"false\" data-value=\"4\" data-index=\"3\">April</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-4\" aria-selected=\"false\" data-value=\"5\" data-index=\"4\">May</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-5\" aria-selected=\"false\" data-value=\"6\" data-index=\"5\">June</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-6\" aria-selected=\"false\" data-value=\"7\" data-index=\"6\">July</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-7\" aria-selected=\"false\" data-value=\"8\" data-index=\"7\">August</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-8\" aria-selected=\"false\" data-value=\"9\" data-index=\"8\">September</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-9\" aria-selected=\"false\" data-value=\"10\" data-index=\"9\">October</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-10\" aria-selected=\"false\" data-value=\"11\" data-index=\"10\">November</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-11\" aria-selected=\"false\" data-value=\"12\" data-index=\"11\">December</div></div></div>";
  const svelteSource: string = "// In your Svelte component:\nimport WheelPicker from \"lily-design-system-svelte-headless/components/WheelPicker/WheelPicker.svelte\";\n\n<WheelPicker>\n  <!-- content -->\n</WheelPicker>\n";
  const usageCode: string = "<div class=\"wheel-picker\"><div class=\"wheel-picker-list\" role=\"listbox\" aria-label=\"Month\" aria-orientation=\"vertical\" aria-activedescendant=\"wheel-demo-option-2\" tabindex=\"0\"><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-0\" aria-selected=\"false\" data-value=\"1\" data-index=\"0\">January</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-1\" aria-selected=\"false\" data-value=\"2\" data-index=\"1\">February</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-2\" aria-selected=\"true\" data-value=\"3\" data-index=\"2\">March</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-3\" aria-selected=\"false\" data-value=\"4\" data-index=\"3\">April</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-4\" aria-selected=\"false\" data-value=\"5\" data-index=\"4\">May</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-5\" aria-selected=\"false\" data-value=\"6\" data-index=\"5\">June</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-6\" aria-selected=\"false\" data-value=\"7\" data-index=\"6\">July</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-7\" aria-selected=\"false\" data-value=\"8\" data-index=\"7\">August</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-8\" aria-selected=\"false\" data-value=\"9\" data-index=\"8\">September</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-9\" aria-selected=\"false\" data-value=\"10\" data-index=\"9\">October</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-10\" aria-selected=\"false\" data-value=\"11\" data-index=\"10\">November</div><div class=\"wheel-picker-option\" role=\"option\" id=\"wheel-demo-option-11\" aria-selected=\"false\" data-value=\"12\" data-index=\"11\">December</div></div></div>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>WheelPicker — Lily Design System</title>
  <meta name="description" content="A vertical single-select listbox where the selection follows the cursor, in the manner of a scroll wheel: moving with the arrow keys, typing, or clicking an option chooses it. Use it to pick one of a short list (an hour, a minute, a month, a year) where a long &lt;select&gt; is awkward. It is the natur…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/wheel-picker/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: wheel-picker</li>
      <li>PascalCase: WheelPicker</li>
      <li>Description: a vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by scrolling or typing</li>
      <li>Status: experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23); Blazor and plain HTML/Nunjucks differ, see index.md</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .wheel-picker</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="listbox"</code> with <code>aria-label</code>, <code>aria-orientation="vertical"</code> and <code>aria-activedescendant</code> naming the chosen option; <code>aria-disabled="true"</code> when disabled</li>
      <li>Each option: <code>role="option"</code>, <code>aria-selected</code>, <code>aria-disabled="true"</code> when disabled</li>
      <li>DOM focus stays on the listbox; the cursor is <code>aria-activedescendant</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>ArrowDown / ArrowUp: choose the next / previous enabled option (wrap only with <code>loop</code>)</li>
      <li>Home / End: choose the first / last enabled option</li>
      <li>PageDown / PageUp: move by <code>pageSize</code> enabled options, clamped</li>
      <li>Printable character: type-ahead over the labels</li>
      <li>Tab: leaves the control</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name</li>
      <li><code>options</code>: <code>&#123; value: string, label: string, disabled?: boolean &#125;[]</code> (required)</li>
      <li><code>value</code>: string (default: <code>""</code>) -- the chosen option's value; bindable (Svelte <code>bind:value</code>, Vue <code>v-model</code>, Angular <code>[(value)]</code>, Blazor <code>@bind-Value</code>, React controlled with <code>onChange</code>)</li>
      <li><code>loop</code>: boolean (default: false)</li>
      <li><code>pageSize</code>: number (default: 5)</li>
      <li><code>disabled</code>: boolean (default: false) -- not focusable; ignores keys and clicks</li>
      <li><code>name</code>: string -- adds a hidden input</li>
      <li><code>onChange</code>: <code>(value: string) =&gt; void</code> -- once per change (React, Svelte); <code>change</code> event in Web Components, Alpine and HTML</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
