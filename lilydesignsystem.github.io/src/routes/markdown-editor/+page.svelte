<svelte:head>
  <title>Markdown editor — Lily Design System</title>
  <meta
    name="description"
    content="A textarea with a toolbar of rich-text buttons that write Markdown: headings, bold, italic, link, quote, lists and code. Headless, accessible, and available in nine frameworks."
  />
</svelte:head>

<section class="page-intro">
  <h1>Markdown editor</h1>
  <p class="page-intro-tagline">
    A <code>&lt;textarea&gt;</code> with a top bar of buttons for rich-text effects. The buttons write Markdown into the
    field, so the value is plain text: it submits with a form, validates, and works without JavaScript.
  </p>
</section>

<section class="prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2>What it is, and what it is not</h2>
  <p>
    Nine tools: heading, bold, italic, strikethrough, code, link, quote, bulleted list and numbered list. Press a tool
    over text that already has the formatting and it comes off. The formatted text stays selected, so effects stack, and
    focus returns to the field. <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>B</kbd>, <kbd>I</kbd> and <kbd>K</kbd> apply bold,
    italic and link.
  </p>
  <p>
    It is <strong>not</strong> a WYSIWYG editor: it does not draw bold text in the field, edit a document tree, or
    parse or sanitise Markdown. Render the value with your own Markdown library, and sanitise the HTML you produce.
    It ships no CSS, no Markdown parser and no English: the names of the field, the toolbar and every tool are props,
    and a tool with no name is not shown.
  </p>

  <h2>Quick start (Svelte)</h2>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0"><code>{`<` + `script>
  import MarkdownEditor from "@lilydesignsystem/svelte-markdown-editor";

  let body = $state("");
  const labels = {
    heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
    link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
  };
</` + `script>

<MarkdownEditor
  bind:value={body}
  label="Message"
  toolbarLabel="Formatting"
  {labels}
  name="body"
  rows={8}
/>`}</code></pre>
  <p>
    <code>tools</code> chooses and orders the buttons; <code>headingLevel</code> sets how many <code>#</code> the
    heading tool writes; <code>icon</code> replaces a tool's icon.
  </p>

  <h2>Accessibility</h2>
  <ul>
    <li>A native <code>&lt;textarea&gt;</code> and native <code>&lt;button type="button"&gt;</code>s: form submission, <code>required</code>, spellcheck and IME all come from the platform.</li>
    <li><code>role="toolbar"</code> with a roving tabindex: one tab stop, <kbd>←</kbd> <kbd>→</kbd> move between buttons, <kbd>Home</kbd> and <kbd>End</kbd> jump.</li>
    <li>Icons are decorative; each button's name comes from <code>labels</code>.</li>
    <li>The result is Markdown, so a screen reader hears <code>**bold**</code> as typed. Offer a rendered preview if your readers will not read Markdown.</li>
  </ul>

  <h2>Undo and redo, checked in real browsers</h2>
  <p>
    Edits go through <code>execCommand("insertText")</code>, so native undo and redo keep working. The Svelte package
    runs the same Playwright spec in each engine:
  </p>
  <table>
    <thead><tr><th scope="col">Engine</th><th scope="col">Result</th></tr></thead>
    <tbody>
      <tr><th scope="row">Chromium</th><td>Passes: a tool, native undo and redo; each tool is its own undo step.</td></tr>
      <tr><th scope="row">WebKit</th><td>Passes, with one difference: it merges consecutive edits into one undo step.</td></tr>
      <tr><th scope="row">Firefox</th><td>Not run: Playwright's Firefox 157 does not launch on the maintainer's machine.</td></tr>
    </tbody>
  </table>

  <h2>Every framework</h2>
  <p>
    Svelte is canonical; the other packages follow it, and the formatting logic is one shared module copied into each
    TypeScript or JavaScript package.
  </p>
  <table>
    <thead><tr><th scope="col">Framework</th><th scope="col">Package</th><th scope="col">Use</th></tr></thead>
    <tbody>
      <tr><th scope="row">Svelte</th><td><code>@lilydesignsystem/svelte-markdown-editor</code></td><td><code>&lt;MarkdownEditor bind:value …&gt;</code></td></tr>
      <tr><th scope="row">React</th><td><code>@lilydesignsystem/react-markdown-editor</code></td><td><code>&lt;MarkdownEditor value onChange …&gt;</code></td></tr>
      <tr><th scope="row">Vue</th><td><code>@lilydesignsystem/vue-markdown-editor</code></td><td><code>&lt;MarkdownEditor v-model …&gt;</code></td></tr>
      <tr><th scope="row">Angular</th><td><code>@lilydesignsystem/angular-markdown-editor</code></td><td><code>&lt;lily-markdown-editor [(value)] …&gt;</code></td></tr>
      <tr><th scope="row">HTML</th><td><code>@lilydesignsystem/html-markdown-editor</code></td><td><code>&lt;markdown-editor&gt;</code>, a custom element</td></tr>
      <tr><th scope="row">Web Components</th><td><code>@lilydesignsystem/web-components-markdown-editor</code></td><td><code>&lt;lily-markdown-editor&gt;</code></td></tr>
      <tr><th scope="row">Alpine.js</th><td><code>@lilydesignsystem/alpine-markdown-editor</code></td><td>a snippet and a plugin: <code>x-data="lilyMarkdownEditor(options)"</code></td></tr>
      <tr><th scope="row">Nunjucks</th><td><code>@lilydesignsystem/nunjucks-markdown-editor</code></td><td>a macro, plus <code>autoInit()</code> in the browser</td></tr>
      <tr><th scope="row">Blazor</th><td><code>LilyDesignSystem.Blazor.MarkdownEditor</code> (NuGet)</td><td><code>&lt;MarkdownEditor @bind-Value …&gt;</code></td></tr>
    </tbody>
  </table>
  <p>
    The Blazor port is a C# translation of the formatting logic and cannot decide <code>preventDefault</code> per key, so
    it has no keyboard shortcuts, and <kbd>Home</kbd>/<kbd>End</kbd> on its toolbar also scroll the page.
  </p>
  <p>
    <strong>Not published yet.</strong> The packages are in the monorepo; none is on npm or NuGet yet.
  </p>
</section>
