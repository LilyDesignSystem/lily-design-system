import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SlovenskoRodneCisloView — a read-only display of Slovakia's Rodné číslo (RČ)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slovensko-rodne-cislo-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-slovensko-rodne-cislo-view",
    standalone: true,
    template: `<span class="slovensko-rodne-cislo-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlovenskoRodneCisloView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
