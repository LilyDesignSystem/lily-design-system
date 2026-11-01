import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ColombiaCedulaDeCiudadaniaView — a read-only display of Colombia's Cedula de Ciudadania Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `colombia-cedula-de-ciudadania-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-colombia-cedula-de-ciudadania-view",
    standalone: true,
    template: `<span class="colombia-cedula-de-ciudadania-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColombiaCedulaDeCiudadaniaView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
