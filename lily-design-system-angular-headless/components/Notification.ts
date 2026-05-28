import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Notification — a brief message about an event or update
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `notification` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-notification",
  standalone: true,
  template: `<div class="notification {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notification {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
