import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Event — an event component that contains other event-related information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `event` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-event",
  standalone: true,
  template: `<div class="event {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Event {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
