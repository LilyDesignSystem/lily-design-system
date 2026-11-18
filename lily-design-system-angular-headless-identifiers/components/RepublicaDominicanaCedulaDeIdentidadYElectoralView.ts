import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RepublicaDominicanaCedulaDeIdentidadYElectoralView — a read-only display of the Dominican Republic's Cédula de Identidad y Electoral
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `republica-dominicana-cedula-de-identidad-y-electoral-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-republica-dominicana-cedula-de-identidad-y-electoral-view",
    standalone: true,
    template: `<span class="republica-dominicana-cedula-de-identidad-y-electoral-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepublicaDominicanaCedulaDeIdentidadYElectoralView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
