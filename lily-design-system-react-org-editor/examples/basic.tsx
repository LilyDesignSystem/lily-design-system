import { useState } from "react";
import { OrgEditor } from "../OrgEditor";

const labels = { todo: "Task", priority: "Priority", scheduled: "Scheduled", deadline: "Deadline", property: "Property", drawer: "Drawer", contact: "Contact", bold: "Bold", italic: "Italic", link: "Link" };

export default function Basic() {
  const [notes, setNotes] = useState("* Ship the release");
  return (
    <form>
      <OrgEditor value={notes} onChange={setNotes} label="Notes" toolbarLabel="Formatting" labels={labels} todoKeywords={["TODO", "NEXT", "DONE"]} name="notes" rows={12} />
      <button type="submit">Save</button>
      <pre>{notes}</pre>
    </form>
  );
}
