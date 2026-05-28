import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EspanaCodigoDeIdentificacionFiscalView — a read-only display of Spain's Código de Identificación Fiscal (CIF)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `espana-codigo-de-identificacion-fiscal-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-espana-codigo-de-identificacion-fiscal-view",
  standalone: true,
  template: `<span class="espana-codigo-de-identificacion-fiscal-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspanaCodigoDeIdentificacionFiscalView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
