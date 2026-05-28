import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AlertDialog — a modal dialog for urgent messages requiring user acknowledgment
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `alert-dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-alert-dialog",
  standalone: true,
  template: `<dialog class="alert-dialog {{ className() }}" [attr.aria-label]="label() || null" [open]="open()"><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
  readonly label = input<string>("");
  readonly open = input<boolean>(false);
  readonly className = input<string>("");
}
