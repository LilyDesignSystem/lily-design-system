<!--
  Example 2 — A subset, in a custom order, with your own icons.

  `tools` chooses and orders; the `icon` snippet receives the tool id.
-->
<script lang="ts">
  import MarkdownEditor from "../MarkdownEditor.svelte";

  let comment = $state("");
  const labels = { bold: "Bold", italic: "Italic", link: "Link" };
</script>

<MarkdownEditor
  bind:value={comment}
  label="Comment"
  toolbarLabel="Formatting"
  {labels}
  tools={["link", "bold", "italic"]}
>
  {#snippet icon(tool)}
    <span aria-hidden="true">{tool === "bold" ? "B" : tool === "italic" ? "I" : "↗"}</span>
  {/snippet}
</MarkdownEditor>
