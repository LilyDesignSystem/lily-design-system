import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MaltaNationalIdentificationNumberView — a read-only display of Malta's Malta National Identification Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `malta-national-identification-number-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-malta-national-identification-number-view",
  standalone: true,
  template: `<span class="malta-national-identification-number-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaltaNationalIdentificationNumberView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
