import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LiechtensteinPassportNumberView — a read-only display of Liechtenstein's Liechtenstein Passport Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `liechtenstein-passport-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-liechtenstein-passport-number-view",
  standalone: true,
  template: `<span class="liechtenstein-passport-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiechtensteinPassportNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
