import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MagyarorszagTajSzamView — a read-only display of Hungary's Társadalombiztosítási Azonosító Jel (TAJ)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `magyarorszag-taj-szam-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-magyarorszag-taj-szam-view",
  standalone: true,
  template: `<span class="magyarorszag-taj-szam-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagyarorszagTajSzamView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
