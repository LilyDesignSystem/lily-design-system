import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IndonesiaNomorIndukKependudukanView — a read-only display of Indonesia's Nomor Induk Kependudukan (NIK)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `indonesia-nomor-induk-kependudukan-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-indonesia-nomor-induk-kependudukan-view",
    standalone: true,
    template: `<span class="indonesia-nomor-induk-kependudukan-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndonesiaNomorIndukKependudukanView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
