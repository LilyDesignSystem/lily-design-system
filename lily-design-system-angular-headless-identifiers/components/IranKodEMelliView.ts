import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IranKodEMelliView — a read-only display of Iran's National Code (Kod-e Melli)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `iran-kod-e-melli-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-iran-kod-e-melli-view",
    standalone: true,
    template: `<span class="iran-kod-e-melli-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IranKodEMelliView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
