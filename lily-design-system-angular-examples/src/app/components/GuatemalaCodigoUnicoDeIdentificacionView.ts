import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GuatemalaCodigoUnicoDeIdentificacionView — a read-only display of Guatemala's Código Único de Identificación (CUI)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `guatemala-codigo-unico-de-identificacion-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-guatemala-codigo-unico-de-identificacion-view",
    standalone: true,
    template: `<span class="guatemala-codigo-unico-de-identificacion-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuatemalaCodigoUnicoDeIdentificacionView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
