import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Card — a grouped content container with header, body, and footer areas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-card",
  standalone: true,
  template: `<div class="card {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
