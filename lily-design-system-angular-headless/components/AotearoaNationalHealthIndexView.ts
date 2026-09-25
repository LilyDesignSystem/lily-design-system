import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AotearoaNationalHealthIndexView — a read-only display of New Zealand's National Health Index (NHI) Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `aotearoa-national-health-index-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-aotearoa-national-health-index-view",
  standalone: true,
  template: `<span class="aotearoa-national-health-index-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AotearoaNationalHealthIndexView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
