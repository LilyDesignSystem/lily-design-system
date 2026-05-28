import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MeasurementInstanceView — a read-only display of a measurement value and unit
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `measurement-instance-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-measurement-instance-view",
  standalone: true,
  template: `<span class="measurement-instance-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementInstanceView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
