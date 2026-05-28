import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SuccessPanel — a panel confirming a task has been completed
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `success-panel` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-success-panel",
  standalone: true,
  template: `<div class="success-panel {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPanel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
