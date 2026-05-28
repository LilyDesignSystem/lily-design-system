import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EspanaTarjetaSanitariaIndividualView — a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `espana-tarjeta-sanitaria-individual-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-espana-tarjeta-sanitaria-individual-view",
  standalone: true,
  template: `<span class="espana-tarjeta-sanitaria-individual-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspanaTarjetaSanitariaIndividualView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
