import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HrvatskaOsobniIdentifikacijskiBrojView — a read-only display of Croatia's Osobni identifikacijski broj (OIB)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hrvatska-osobni-identifikacijski-broj-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-hrvatska-osobni-identifikacijski-broj-view",
  standalone: true,
  template: `<span class="hrvatska-osobni-identifikacijski-broj-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrvatskaOsobniIdentifikacijskiBrojView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
