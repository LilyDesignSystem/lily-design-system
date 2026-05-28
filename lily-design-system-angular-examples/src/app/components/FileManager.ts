import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FileManager — a file browser for navigating and managing files
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `file-manager` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-file-manager",
  standalone: true,
  template: `<div class="file-manager {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManager {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
