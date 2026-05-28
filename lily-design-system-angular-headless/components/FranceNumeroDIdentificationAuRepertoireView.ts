import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FranceNumeroDIdentificationAuRepertoireView — a read-only display of a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `france-numero-d-identification-au-repertoire-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-france-numero-d-identification-au-repertoire-view",
  standalone: true,
  template: `<span class="france-numero-d-identification-au-repertoire-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FranceNumeroDIdentificationAuRepertoireView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
