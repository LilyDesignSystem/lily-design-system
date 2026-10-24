import { Component, signal } from "@angular/core";
import { OrgEditor } from "../org-editor.component";

@Component({
  standalone: true,
  selector: "example-basic",
  imports: [OrgEditor],
  template: `
    <form>
      <lily-org-editor [(value)]="notes" label="Notes" toolbarLabel="Formatting" [labels]="labels" [todoKeywords]="['TODO', 'NEXT', 'DONE']" name="notes" [rows]="12" />
      <button type="submit">Save</button>
      <pre>{{ notes() }}</pre>
    </form>
  `,
})
export class Basic {
  notes = signal("* Ship the release");
  labels = { todo: "Task", priority: "Priority", scheduled: "Scheduled", deadline: "Deadline", property: "Property", drawer: "Drawer", contact: "Contact", bold: "Bold", italic: "Italic", link: "Link" };
}
