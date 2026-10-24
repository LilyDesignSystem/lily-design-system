<!--
  Example 1 — Basic usage.

  The value is plain Markdown, so the field submits with the form and the
  component needs no server-side counterpart. Render it with your own
  Markdown library, and sanitise the HTML you produce.
-->
<script lang="ts">
  import MarkdownEditor from "../MarkdownEditor.svelte";

  let body = $state("Hello **world**");

  const labels = {
    heading: "Heading",
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    code: "Code",
    link: "Link",
    quote: "Quote",
    bulletList: "Bulleted list",
    numberedList: "Numbered list",
  };
</script>

<form>
  <MarkdownEditor
    bind:value={body}
    label="Message"
    toolbarLabel="Formatting"
    {labels}
    name="body"
    rows={8}
  />
  <button type="submit">Send</button>
</form>
<pre>{body}</pre>
