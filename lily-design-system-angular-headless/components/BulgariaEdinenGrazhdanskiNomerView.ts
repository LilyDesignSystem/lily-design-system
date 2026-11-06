import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BulgariaEdinenGrazhdanskiNomerView — a read-only display of Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `bulgaria-edinen-grazhdanski-nomer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-bulgaria-edinen-grazhdanski-nomer-view",
    standalone: true,
    template: `<span class="bulgaria-edinen-grazhdanski-nomer-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulgariaEdinenGrazhdanskiNomerView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
