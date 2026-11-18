import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CostaRicaCedulaDeIdentidadView — a read-only display of Costa Rica's Cédula de Identidad
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `costa-rica-cedula-de-identidad-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-costa-rica-cedula-de-identidad-view",
    standalone: true,
    template: `<span class="costa-rica-cedula-de-identidad-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostaRicaCedulaDeIdentidadView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
