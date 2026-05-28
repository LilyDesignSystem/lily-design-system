import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TimerButton — a button with a timer that will automatically click after a given amount of time
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timer-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-timer-button",
  standalone: true,
  template: `<button class="timer-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
