import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FileDialog — a dialog for browsing and selecting files
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `file-dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-file-dialog",
  standalone: true,
  template: `<dialog class="file-dialog {{ className() }}" [attr.aria-label]="label() || null" [open]="open()"><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDialog {
  readonly label = input<string>("");
  readonly open = input<boolean>(false);
  readonly className = input<string>("");
}
