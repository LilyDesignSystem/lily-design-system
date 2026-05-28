import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NorthernIrelandHealthAndCareNumberView — a read-only display of Northern Ireland Health and Care (H&C) Number unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `northern-ireland-health-and-care-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-northern-ireland-health-and-care-number-view",
  standalone: true,
  template: `<span class="northern-ireland-health-and-care-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NorthernIrelandHealthAndCareNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
