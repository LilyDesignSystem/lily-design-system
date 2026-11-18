import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PortugalNumeroDeIdentificacaoFiscalView — a read-only display of Portugal's Número de Identificação Fiscal (NIF)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `portugal-numero-de-identificacao-fiscal-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-portugal-numero-de-identificacao-fiscal-view",
    standalone: true,
    template: `<span class="portugal-numero-de-identificacao-fiscal-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortugalNumeroDeIdentificacaoFiscalView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
