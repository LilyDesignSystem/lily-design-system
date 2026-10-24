<!--
  Example 1 — A notes field for Org mode.

  The value is plain Org text, so the field submits with the form and the result can be saved straight to an
  `.org` file. Org's own words (TODO, SCHEDULED:, :PROPERTIES:) are syntax; only the button names are yours.
-->
<script lang="ts">
  import OrgEditor from "../OrgEditor.svelte";

  let notes = $state("* Ship the release\n** Write the changelog");

  const labels = {
    heading: "Heading", promote: "Promote", demote: "Demote",
    todo: "Task", priority: "Priority", scheduled: "Scheduled", deadline: "Deadline", timestamp: "Timestamp",
    bold: "Bold", italic: "Italic", link: "Link",
    bulletList: "Bulleted list", checkbox: "Checkbox",
    property: "Property", drawer: "Drawer", contact: "Contact",
  };
</script>

<form>
  <OrgEditor
    bind:value={notes}
    label="Notes"
    toolbarLabel="Formatting"
    {labels}
    todoKeywords={["TODO", "NEXT", "DONE"]}
    name="notes"
    rows={12}
  />
  <button type="submit">Save</button>
</form>
<pre>{notes}</pre>
