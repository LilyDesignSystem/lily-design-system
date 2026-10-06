<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>OneTimePasswordInput</h1>\n<p>OneTimePasswordInput is a headless field for entering a one-time passcode (OTP) or verification code. It is ONE real native <code>&lt;input type=&quot;text&quot;&gt;</code> with <code>inputmode=&quot;numeric&quot;</code> and <code>autocomplete=&quot;one-time-code&quot;</code>, so the platform can offer the code from an SMS and paste works. It is deliberately not a row of segmented boxes (see <code>pin-input-div</code> for that pattern).</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a native <code>&lt;input&gt;</code>: <code>type=&quot;text&quot;</code>, <code>inputmode</code> (default <code>numeric</code>), <code>autocomplete=&quot;one-time-code&quot;</code>, <code>maxlength={length}</code>, <code>pattern</code> (default <code>[0-9]*</code>), <code>spellcheck=&quot;false&quot;</code>, <code>autocapitalize=&quot;off&quot;</code></li>\n<li><code>length</code> is required with no default: the consumer decides how long its codes are</li>\n<li>Sets <code>aria-label={label}</code> and <code>data-length={length}</code></li>\n<li>Two-way <code>value</code> binding</li>\n<li>Never validates or submits; the consumer owns verification</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;input&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>\n<li><code>length</code>: number (required) -- number of characters in the code; sets <code>maxlength</code> and <code>data-length</code></li>\n<li><code>value</code>: string (default: <code>&quot;&quot;</code>) -- bindable value</li>\n<li><code>inputMode</code>: string (default: <code>&quot;numeric&quot;</code>) -- virtual keyboard hint; use <code>&quot;text&quot;</code> for alphanumeric codes</li>\n<li><code>pattern</code>: string (default: <code>&quot;[0-9]*&quot;</code>) -- allowed characters</li>\n<li><code>name</code>: string (optional) -- form field name</li>\n<li><code>required</code>: boolean (default: <code>false</code>)</li>\n<li><code>disabled</code>: boolean (default: <code>false</code>)</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;input&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;OneTimePasswordInput label=&quot;Verification code&quot; length={6} bind:value={code} name=&quot;otp&quot; required /&gt;\n</code></pre>\n<p>Alphanumeric code:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;OneTimePasswordInput label=&quot;Backup code&quot; length={8} inputMode=&quot;text&quot; pattern=&quot;[A-Za-z0-9]*&quot; bind:value={backup} /&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None beyond native input behaviour -- standard text editing keys; Tab moves focus in and out</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> -- provides the accessible name when no visible <code>&lt;label&gt;</code> is associated</li>\n<li><code>autocomplete=&quot;one-time-code&quot;</code> -- WCAG 1.3.5 input purpose, lets the platform offer the received code</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for a short numeric or alphanumeric code sent by SMS, email or an authenticator app.</li>\n<li>Use when platform autofill of the code and paste support matter.</li>\n<li>Use in two-factor sign-in, account verification and confirmation flows.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a PIN or password the user memorises -- use <code>pin-input-div</code> or <code>password-input</code>.</li>\n<li>Do not use for free text -- use <code>text-input</code>.</li>\n<li>Do not use for national identifiers -- use the matching <code>*-input</code> identifier component.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders a native <code>&lt;input&gt;</code> and decides no visual treatment. The consumer styles the field, including any monospace or letter-spacing look that makes a code easy to read.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via the <code>.one-time-password-input</code> class. <code>data-length</code> is available for width rules.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the root is a single <code>&lt;input type=&quot;text&quot;&gt;</code> with class <code>one-time-password-input</code></li>\n<li>Verify <code>autocomplete=&quot;one-time-code&quot;</code> and <code>inputmode=&quot;numeric&quot;</code></li>\n<li>Verify <code>maxlength</code> and <code>data-length</code> follow <code>length</code>, and typing stops at <code>length</code></li>\n<li>Verify <code>pattern</code> default and override</li>\n<li>Verify <code>label</code> sets <code>aria-label</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Style one field wide enough for <code>length</code> characters; letter-spacing and a monospace font help legibility. Do not fake segmented boxes with a background image, or autofill and paste break.</li>\n<li><strong>Developers</strong>: Verify the code on the server; <code>pattern</code> is a hint, not validation. Auto-submit when <code>value.length === length</code> only if the user is told.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>pin-input-div</code> — a segmented, one-box-per-character PIN entry</li>\n<li><code>text-input</code> — a general single-line text input</li>\n<li><code>password-input</code> — a masked password field</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>HTML autocomplete one-time-code: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#one-time-code\">https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#one-time-code</a></li>\n<li>WCAG 1.3.5 Identify Input Purpose: <a href=\"https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html\">https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<label class=\"label\" for=\"demo-otp\">Security code</label> <input class=\"one-time-password-input\" id=\"demo-otp\" type=\"text\" inputmode=\"numeric\" autocomplete=\"one-time-code\" maxlength=\"6\" pattern=\"[0-9]*\" spellcheck=\"false\" autocapitalize=\"off\" data-length=\"6\" aria-label=\"Security code\" />";
  const svelteSource: string = "// In your Svelte component:\nimport OneTimePasswordInput from \"lily-design-system-svelte-headless/components/OneTimePasswordInput/OneTimePasswordInput.svelte\";\n\n<OneTimePasswordInput>\n  <!-- content -->\n</OneTimePasswordInput>\n";
  const usageCode: string = "<OneTimePasswordInput label=\"Verification code\" length={6} bind:value={code} name=\"otp\" required />\n";
  const variants: { title: string; html: string }[] = [{"title":"Four digits","html":"<label class=\"label\" for=\"otp-four\">PIN</label> <input class=\"one-time-password-input\" id=\"otp-four\" type=\"text\" inputmode=\"numeric\" autocomplete=\"one-time-code\" maxlength=\"4\" pattern=\"[0-9]*\" spellcheck=\"false\" autocapitalize=\"off\" data-length=\"4\" aria-label=\"PIN\" />"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>OneTimePasswordInput — Lily Design System</title>
  <meta name="description" content="OneTimePasswordInput is a headless field for entering a one-time passcode (OTP) or verification code. It is ONE real native &lt;input type=&quot;text&quot;&gt; with inputmode=&quot;numeric&quot; and autocomplete=&quot;one-time-code&quot;, so the platform can offer the code from an SMS and paste works. It is deliberately not a row o…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/one-time-password-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: one-time-password-input</li>
      <li>PascalCase: OneTimePasswordInput</li>
      <li>Description: a single one-time-password input with a numeric keypad, SMS autofill, and a fixed length</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;input&gt;</li>
      <li>CSS class: .one-time-password-input</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label=&#123;label&#125;</code> -- provides the accessible name when no visible <code>&lt;label&gt;</code> is associated</li>
      <li><code>autocomplete="one-time-code"</code> -- WCAG 1.3.5 input purpose, lets the platform offer the received code</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None beyond native input behaviour -- standard text editing keys; Tab moves focus in and out</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>
      <li><code>length</code>: number (required) -- number of characters in the code; sets <code>maxlength</code> and <code>data-length</code></li>
      <li><code>value</code>: string (default: <code>""</code>) -- bindable value</li>
      <li><code>inputMode</code>: string (default: <code>"numeric"</code>) -- virtual keyboard hint; use <code>"text"</code> for alphanumeric codes</li>
      <li><code>pattern</code>: string (default: <code>"[0-9]*"</code>) -- allowed characters</li>
      <li><code>name</code>: string (optional) -- form field name</li>
      <li><code>required</code>: boolean (default: <code>false</code>)</li>
      <li><code>disabled</code>: boolean (default: <code>false</code>)</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;input&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
