import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CanadaSocialInsuranceNumberView — a read-only display of Canada's Social Insurance Number (SIN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `canada-social-insurance-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-canada-social-insurance-number-view",
  standalone: true,
  template: `<span class="canada-social-insurance-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanadaSocialInsuranceNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
