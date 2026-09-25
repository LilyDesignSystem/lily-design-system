import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MexicoClaveUnicaDeRegistroDePoblacionView — a read-only display of Mexico's Clave Única de Registro de Población (CURP)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mexico-clave-unica-de-registro-de-poblacion-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mexico-clave-unica-de-registro-de-poblacion-view",
  standalone: true,
  template: `<span class="mexico-clave-unica-de-registro-de-poblacion-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MexicoClaveUnicaDeRegistroDePoblacionView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
