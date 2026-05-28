import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FileUpload — a drag-and-drop area for uploading files
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `file-upload` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-file-upload",
  standalone: true,
  template: `<div class="file-upload {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUpload {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
