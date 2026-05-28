import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Alert — a status message for important information or feedback
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `alert` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-alert",
  standalone: true,
  template: `<div class="alert {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
