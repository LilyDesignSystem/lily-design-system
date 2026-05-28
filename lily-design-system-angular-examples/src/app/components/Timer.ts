import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Timer — a countdown or elapsed time display
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-timer",
  standalone: true,
  template: `<div class="timer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
