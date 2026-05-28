import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Meter — a gauge displaying a scalar value within a known range
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `meter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-meter",
  standalone: true,
  template: `<meter class="meter {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" [min]="min()" [max]="max()"></meter>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Meter {
  readonly label = input<string>("");
  readonly value = input<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly className = input<string>("");
}
