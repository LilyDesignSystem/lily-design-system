import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * UnitedKingdomNationalInsuranceNumberView — a read-only display of United Kingdom's National Insurance Number (NINO)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `united-kingdom-national-insurance-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-united-kingdom-national-insurance-number-view",
  standalone: true,
  template: `<span class="united-kingdom-national-insurance-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitedKingdomNationalInsuranceNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
