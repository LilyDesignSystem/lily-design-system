import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CyprusNationalPassportNumberView — a read-only display of Cyprus's National Passport Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cyprus-national-passport-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-cyprus-national-passport-number-view",
  standalone: true,
  template: `<span class="cyprus-national-passport-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyprusNationalPassportNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
