import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LiechtensteinNationalIdentityCardNumberView — a read-only display of Liechtenstein's Liechtenstein National Identity Card Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `liechtenstein-national-identity-card-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-liechtenstein-national-identity-card-number-view",
  standalone: true,
  template: `<span class="liechtenstein-national-identity-card-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiechtensteinNationalIdentityCardNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
