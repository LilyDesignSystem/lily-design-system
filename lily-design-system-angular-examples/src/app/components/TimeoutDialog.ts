import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TimeoutDialog — a modal dialog warning users before session timeout
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timeout-dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-timeout-dialog",
  standalone: true,
  template: `<dialog class="timeout-dialog {{ className() }}" [attr.aria-label]="label() || null" [open]="open()"><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeoutDialog {
  readonly label = input<string>("");
  readonly open = input<boolean>(false);
  readonly className = input<string>("");
}
