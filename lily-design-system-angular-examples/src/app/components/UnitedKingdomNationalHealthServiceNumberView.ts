import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * UnitedKingdomNationalHealthServiceNumberView — a read-only display of a UK NHS number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `united-kingdom-national-health-service-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-united-kingdom-national-health-service-number-view",
  standalone: true,
  template: `<span class="united-kingdom-national-health-service-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitedKingdomNationalHealthServiceNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
