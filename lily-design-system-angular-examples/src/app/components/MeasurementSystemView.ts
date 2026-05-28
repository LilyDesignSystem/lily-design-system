import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MeasurementSystemView — a read-only display of a measurement system
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `measurement-system-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-measurement-system-view",
  standalone: true,
  template: `<span class="measurement-system-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementSystemView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
