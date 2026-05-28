import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MeasurementUnitView — a read-only display of a measurement unit
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `measurement-unit-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-measurement-unit-view",
  standalone: true,
  template: `<span class="measurement-unit-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementUnitView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
