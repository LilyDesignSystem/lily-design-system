import { Component, signal } from "@angular/core";
import { MarkdownEditor } from "../markdown-editor.component";

@Component({
  standalone: true,
  selector: "example-basic",
  imports: [MarkdownEditor],
  template: `
    <form>
      <lily-markdown-editor [(value)]="body" label="Message" toolbarLabel="Formatting" [labels]="labels" name="body" [rows]="8" />
      <button type="submit">Send</button>
      <pre>{{ body() }}</pre>
    </form>
  `,
})
export class Basic {
  body = signal("Hello **world**");
  labels = {
    heading: "Heading", bold: "Bold", italic: "Italic", strikethrough: "Strikethrough", code: "Code",
    link: "Link", quote: "Quote", bulletList: "Bulleted list", numberedList: "Numbered list",
  };
}
