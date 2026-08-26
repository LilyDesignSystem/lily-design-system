import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Label } from "../components/Label";
import { FileInput } from "../components/FileInput";
import { Button } from "../components/Button";

@Component({
  selector: "lily-file-upload-form",
  standalone: true,
  imports: [Form, Field, Label, FileInput, Button],
  template: `
    <article class="page-wrapper">
      <h1>File upload</h1>
      <form (submit)="submit($event)" novalidate>
        <lily-field>
          <lily-label>Document</lily-label>
          <lily-file-input label="Document" />
        </lily-field>
        <lily-button>Upload</lily-button>
      </form>

      @if (submitted()) {
        <p role="status">Pretend the file was uploaded.</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FileUploadFormPage {
  protected submitted = signal(false);

  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
