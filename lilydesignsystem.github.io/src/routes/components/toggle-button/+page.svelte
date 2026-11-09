<script lang="ts">
  const intro: string = "<h1>Toggle Button</h1>\n\n<p>A ToggleButton is a UI/UX component that provides a button that stays pressed until pressed again: a native <code>&lt;button&gt;</code> with <code>aria-pressed</code>, the WAI-ARIA toggle button pattern, announced as \"toggle button, pressed\" or \"not pressed\". It supports click and keyboard (Enter and Space) interaction, and the pressed state is bindable for two-way data flow.</p>\n\n<p>Use it for an action that stays on, such as Bold, Italic, Mute or Favourite, often in a toolbar. For a setting that turns on or off, such as dark mode or notifications, use SwitchButton, which has <code>role=\"switch\"</code> and is announced as \"on\" or \"off\".</p>\n\n";
  const usage: string = "<h2>Usage</h2>\n\n<p>Bold formatting toggle in a text editor toolbar:</p>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ToggleButton label=\"Bold\" pressed={isBold} /&gt;</code></pre>\n\n<p>Mute control in a media player:</p>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ToggleButton label=\"Mute audio\" pressed={muted} disabled={locked} /&gt;</code></pre>\n\n<p>Favourite toggle on a content card:</p>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ToggleButton label=\"Favourite\" pressed={isFavourited} /&gt;</code></pre>\n\n";
  const rest: string = "<h2>Help</h2>\n\n<p>Use ToggleButton for a pressed or unpressed action, such as Bold in a text toolbar, Mute in a call, or Favourite on an item. For a setting with immediate effect, such as dark mode, use SwitchButton; for a choice in a form, use a checkbox.</p>\n\n<h2>Syntax</h2>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ToggleButton label=\"...\" pressed={pressed} /&gt;</code></pre>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td><code>string</code></td><td>(required)</td><td>Accessible name applied via <code>aria-label</code></td></tr>\n<tr><td><code>pressed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the toggle is on; bindable with two-way <code>pressed</code> binding</td></tr>\n<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the toggle is disabled</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td></td><td>Additional attributes spread onto the <code>&lt;button&gt;</code> element</td></tr>\n</tbody>\n</table>\n\n<h2>Examples</h2>\n\n<p>Feature flag control:</p>\n\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ToggleButton label=\"Enable beta features\" pressed={betaFeatures} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Space: Toggles between on and off states (custom handler with <code>preventDefault</code>)</li>\n<li>Enter: Activates the button (native button behavior)</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>No <code>role</code>: a native <code>&lt;button&gt;</code> with <code>aria-pressed</code> is announced as a toggle button (the WAI-ARIA toggle button pattern)</li>\n<li><code>aria-pressed={pressed}</code> -- communicates whether the button is pressed (<code>true</code>) or not (<code>false</code>)</li>\n<li><code>aria-label={label}</code> -- provides the accessible name for the toggle control</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use for a button that toggles between pressed and unpressed states, such as bold or italic formatting.</li>\n<li>Use for mute/unmute or play/pause controls in media applications.</li>\n<li>Use when \"pressed/unpressed\" better describes the interaction than \"checked/unchecked\".</li>\n<li>Use inside a ToggleGroup for related multi-toggle options like text alignment or view modes.</li>\n<li>Use for toolbar actions where the button state needs to persist visually.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for on/off settings with immediate effect -- use SwitchButton instead.</li>\n<li>Do not use for navigation actions -- use ActionLink instead.</li>\n<li>Do not use for form fields where a checkbox is more appropriate -- use CheckboxInput instead.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a native <code>&lt;button&gt;</code> with <code>aria-pressed</code> and <code>aria-label</code>, and no <code>role</code>, for accessible toggle button behavior. The consumer provides all visual styling, including pressed and unpressed states and any icons or labels.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.toggle-button</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;button&gt;</code> element with class <code>toggle-button</code></li>\n<li>Verify the <code>&lt;button&gt;</code> has <code>aria-pressed</code> and no <code>role</code></li>\n<li>Verify aria-label={label}` -- provides the accessible name for the toggle control</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Provide distinct visual states for pressed and unpressed (e.g., filled vs. outlined, color change) so the current state is immediately obvious.</li>\n<li><strong>Developers</strong>: Use two-way binding on the <code>pressed</code> prop to keep parent state in sync. ToggleButton can be used standalone or inside a ToggleGroup.</li>\n</ul>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;button&gt;</code> element with class <code>toggle-button</code></li>\n<li>Spreads <code>restProps</code> onto the root element for consumer customization</li>\n</ul>\n\n<h2>Composition</h2>\n\n<p>ToggleButton works as a standalone component or as a child of ToggleGroup. When used inside a ToggleGroup, multiple ToggleButtons are semantically grouped with <code>role=\"group\"</code> for related toggle options (e.g., text formatting: bold, italic, underline).</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>switch-button</code> — a toggle switch for turning a setting on or off</li>\n<li><code>button</code> — a generic clickable button element</li>\n<li><code>checkbox-input</code> — a checkbox input for toggling a boolean value &lt;input type=\"checkbox\"&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/</li>\n<li>aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<button class=\"toggle-button\" aria-pressed=\"false\">Toggle</button>";
  const svelteSource: string = "// In your Svelte component:\nimport ToggleButton from \"lily-design-system-svelte-headless/components/ToggleButton/ToggleButton.svelte\";\n\n<ToggleButton>ToggleButton</ToggleButton>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import ToggleButton from \"./ToggleButton.svelte\";\n\n  let dark = $state(false);\n<\/script>\n\n<ToggleButton\n  label=\"Dark mode\"\n  bind:pressed={dark}\n/>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Toggle Button — Lily Design System</title>
  <meta name="description" content="A ToggleButton is a native button with aria-pressed, the WAI-ARIA toggle button pattern, for an action that stays pressed, such as Bold or Mute." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/toggle-button/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: toggle-button</li>
      <li>PascalCase: ToggleButton</li>
      <li>Description: a button that toggles between pressed and unpressed states</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;button&gt;</li>
      <li>CSS class: .toggle-button</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No <code>role</code>: a native <code>&lt;button&gt;</code> with <code>aria-pressed</code> is announced as a toggle button (the WAI-ARIA toggle button pattern)</li>
      <li><code>aria-pressed=&#123;pressed&#125;</code> -- communicates whether the button is pressed (<code>true</code>) or not (<code>false</code>)</li>
      <li><code>aria-label=&#123;label&#125;</code> -- provides the accessible name for the toggle control</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Space: Toggles between on and off states (custom handler with <code>preventDefault</code>)</li>
      <li>Enter: Activates the button (native button behavior)</li>
    </ul>
    <h3>Props</h3>
    <p>| Prop           | Type            | Default    | Description                                                       |</p>
    <p>| -------------- | --------------- | ---------- | ----------------------------------------------------------------- |</p>
    <p>| <code>label</code>        | <code>string</code>        | (required) | Accessible name applied via <code>aria-label</code>                          |</p>
    <p>| <code>pressed</code>      | <code>boolean</code>       | <code>false</code>    | Whether the toggle is on; bindable with two-way <code>pressed</code> binding |</p>
    <p>| <code>disabled</code>     | <code>boolean</code>       | <code>false</code>    | Whether the toggle is disabled                                    |</p>
    <p>| <code>...restProps</code> | HTML attributes |            | Additional attributes spread onto the <code>&lt;button&gt;</code> element          |</p>
</section>
<!-- END generated: canonical contract -->
