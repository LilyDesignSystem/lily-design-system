import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BelgiqueNumeroDeRegistreNationalView — a read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `belgique-numero-de-registre-national-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-belgique-numero-de-registre-national-view",
  standalone: true,
  template: `<span class="belgique-numero-de-registre-national-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BelgiqueNumeroDeRegistreNationalView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
