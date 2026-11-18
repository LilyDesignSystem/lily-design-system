import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LietuvaAsmensKodasView — a read-only display of Lithuania's Asmens kodas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `lietuva-asmens-kodas-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-lietuva-asmens-kodas-view",
    standalone: true,
    template: `<span class="lietuva-asmens-kodas-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LietuvaAsmensKodasView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
