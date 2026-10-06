<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ChatComposer</h1>\n<p>A headless wrapper for a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>A chat input form kept deliberately narrow: a <code>&lt;textarea&gt;</code> and <strong>one</strong> button. The button is &quot;send&quot; normally and turns into &quot;stop&quot; while a reply is in progress (<code>busy</code>), so it keeps focus across the swap. Enter sends, Shift+Enter inserts a line break, and Enter during an IME composition (for example confirming a Japanese conversion) does nothing. The component never clears the text, never animates and carries no strings. Model pickers, attachment rows and &quot;+&quot; menus are consumer composition, passed in the default slot and rendered before the textarea.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root <code>&lt;form class=&quot;chat-composer {class}&quot;&gt;</code>; the textarea is <code>.chat-composer-input</code>; the button is <code>.chat-composer-button</code> with <code>data-state=&quot;send&quot;</code> or <code>&quot;stop&quot;</code> and a <code>.chat-composer-button-label</code> span holding the word</li>\n<li><code>rows</code> is computed from the number of lines in the value, clamped between <code>minRows</code> (1) and <code>maxRows</code> (8). Soft-wrapped long lines do not add rows; consumer CSS <code>field-sizing: content</code> covers that where supported</li>\n<li>The send button is <strong>disabled, never hidden,</strong> when the text is empty or whitespace, or the form is disabled, so the layout does not shift</li>\n<li>While <code>busy</code> the button is <code>type=&quot;button&quot;</code> and calls the stop handler; Enter does not send</li>\n<li>The component does not clear the text: do it in your send handler</li>\n<li><code>restProps</code> spread onto the <code>&lt;form&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>label</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Accessible name of the textarea</td>\n</tr>\n<tr>\n<td><code>sendLabel</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Word for the send button</td>\n</tr>\n<tr>\n<td><code>stopLabel</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>Word for the stop button</td>\n</tr>\n<tr>\n<td><code>value</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>The text (bindable / <code>v-model</code> / controlled)</td>\n</tr>\n<tr>\n<td><code>placeholder</code>, <code>name</code></td>\n<td>string</td>\n<td>—</td>\n<td>Passed to the textarea</td>\n</tr>\n<tr>\n<td><code>minRows</code>, <code>maxRows</code></td>\n<td>number</td>\n<td><code>1</code>, <code>8</code></td>\n<td>Row limits for the growing textarea</td>\n</tr>\n<tr>\n<td><code>busy</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>A reply is in progress: the button becomes stop</td>\n</tr>\n<tr>\n<td><code>disabled</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>Disables the textarea and the button</td>\n</tr>\n<tr>\n<td><code>onSend(value)</code> / <code>send</code> event</td>\n<td>callback</td>\n<td>—</td>\n<td>Enter or submit, when there is text and not busy/disabled</td>\n</tr>\n<tr>\n<td><code>onStop()</code> / <code>stop</code> event</td>\n<td>callback</td>\n<td>—</td>\n<td>The stop button was pressed</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>Rendered inside the form before the textarea</td>\n</tr>\n<tr>\n<td><code>class</code>, <code>...restProps</code></td>\n<td></td>\n<td></td>\n<td>Appended to the base class / spread onto the <code>&lt;form&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ChatComposer\n  label=&quot;Message&quot;\n  sendLabel=&quot;Send&quot;\n  stopLabel=&quot;Stop&quot;\n  bind:value={draft}\n  busy={replying}\n  onSend={(text) =&gt; { send(text); draft = &quot;&quot;; }}\n  onStop={cancelReply}\n/&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Enter</td>\n<td>Send (when there is text, and not busy or disabled)</td>\n</tr>\n<tr>\n<td>Shift+Enter</td>\n<td>Insert a line break</td>\n</tr>\n<tr>\n<td>Enter during IME composition</td>\n<td>Nothing</td>\n</tr>\n<tr>\n<td>Enter or Space on the button</td>\n<td>Send, or stop while busy</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li>The textarea is named by <code>label</code> (<code>aria-label</code>)</li>\n<li>The button&#39;s accessible name is its visible word (<code>sendLabel</code> or <code>stopLabel</code>), so icon-only styling must hide that text visually, not remove it</li>\n<li><code>data-state</code> is for consumer CSS only; the word carries the meaning</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>A chat or assistant input where Enter sends and Shift+Enter adds a line</li>\n<li>When a reply can be stopped and the send button should become a stop button in the same place</li>\n<li>When the input must work with IME text entry in languages like Japanese, Chinese and Korean</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>TextAreaInput</code> — a plain multi-line field in an ordinary form where Enter should add a line</li>\n<li>Use <code>TextAreaInputWithCharacterCounter</code> — a field with a visible length limit</li>\n<li>Use <code>Form</code> and <code>Field</code> — a multi-field form rather than a one-message input</li>\n<li>Use <code>ChatList</code> and <code>ChatMessage</code> — showing the conversation, not entering it</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides behaviour only: keyboard sending, the IME guard, row growth, and the send/stop swap. It decides no layout, colour, icon, animation or placement of the model picker and attachments.</p>\n<h2>Styles</h2>\n<p>Target <code>.chat-composer</code>, <code>.chat-composer-input</code>, <code>.chat-composer-button</code> (and <code>[data-state=&quot;send&quot;]</code> / <code>[data-state=&quot;stop&quot;]</code>), and <code>.chat-composer-button-label</code>. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Form, named textarea and exactly one button</li>\n<li>Send button states: disabled for empty or whitespace text, enabled otherwise; stop while busy</li>\n<li>Enter sends and prevents the line break; Shift+Enter, IME Enter, empty, disabled and busy do not send</li>\n<li>Submit sends; stop calls the stop handler and never send</li>\n<li>Rows follow lines within <code>minRows</code> and <code>maxRows</code>; disabled, placeholder, name, class and rest props</li>\n</ul>\n<h2>Advice</h2>\n<p>Clear the text in your send handler, and set <code>busy</code> for the whole reply so the stop button is available. Hide the button&#39;s label text visually (not with <code>display: none</code>) if you show an icon. For attachments or a model picker, put your own markup (or other Lily components) in the default slot.</p>\n<p>Library differences, each documented in the library&#39;s own doc: <strong>Blazor</strong> has no JS interop, so plain Enter inserts a line break there and sending is by the button or Ctrl/Cmd+Enter. <strong>Nunjucks and HTML</strong> are markup-only and render the correct initial state; the live Enter, growth and swap behaviour needs a script (the Web Components element has it). <strong>Angular</strong> and <strong>Web Components</strong> use output / <code>lily-send</code> and <code>lily-stop</code> events.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>text-area-input</code></li>\n<li><code>text-area-input-with-character-counter</code></li>\n<li><code>chat-list</code></li>\n<li><code>chat-message</code></li>\n<li><code>form</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea\">MDN textarea element</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing\">MDN KeyboardEvent.isComposing</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<form class=\"chat-composer\"><textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"1\"></textarea><button class=\"chat-composer-button\" type=\"submit\" data-state=\"send\" disabled><span class=\"chat-composer-button-label\">Send</span></button></form>";
  const svelteSource: string = "// In your Svelte component:\nimport ChatComposer from \"lily-design-system-svelte-headless/components/ChatComposer/ChatComposer.svelte\";\n\n<ChatComposer>\n  <!-- content -->\n</ChatComposer>\n";
  const usageCode: string = "<ChatComposer label=\"Message\" sendLabel=\"Send\" stopLabel=\"Stop\" bind:value={draft} busy={replying} onSend={send} onStop={cancel} />\n";
  const variants: { title: string; html: string }[] = [{"title":"With text (send enabled)","html":"<form class=\"chat-composer\"><textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"2\">Explain headless components</textarea><button class=\"chat-composer-button\" type=\"submit\" data-state=\"send\"><span class=\"chat-composer-button-label\">Send</span></button></form>"},{"title":"Reply in progress (send becomes stop)","html":"<form class=\"chat-composer\"><textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"2\">Explain headless components</textarea><button class=\"chat-composer-button\" type=\"button\" data-state=\"stop\"><span class=\"chat-composer-button-label\">Stop</span></button></form>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ChatComposer — Lily Design System</title>
  <meta name="description" content="A headless wrapper for a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress." />
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

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/chat-composer/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: chat-composer</li>
      <li>PascalCase: ChatComposer</li>
      <li>Description: a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;form&gt;</li>
      <li>CSS class: .chat-composer</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>Textarea <code>aria-label</code> from <code>label</code>; the button is named by its visible word</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Enter: send. Shift+Enter: line break. Enter during IME composition: nothing. Enter/Space on the button: send or stop</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>, <code>sendLabel</code>, <code>stopLabel</code>: string (required)</li>
      <li><code>value</code>: string (bindable); <code>placeholder</code>, <code>name</code>: string; <code>minRows</code> (1), <code>maxRows</code> (8): number</li>
      <li><code>busy</code>, <code>disabled</code>: boolean (default <code>false</code>)</li>
      <li><code>onSend(value)</code>, <code>onStop()</code> (or <code>send</code> / <code>stop</code> events)</li>
      <li><code>children</code>: slot before the textarea; <code>class</code>, <code>...restProps</code> on the <code>&lt;form&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
