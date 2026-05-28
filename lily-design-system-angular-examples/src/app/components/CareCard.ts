import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CareCard — a medical care instruction card with urgency levels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `care-card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-care-card",
  standalone: true,
  template: `<div class="care-card {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareCard {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
