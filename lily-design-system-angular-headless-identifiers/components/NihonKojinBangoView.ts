import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NihonKojinBangoView — a read-only display of Japan's Individual Number / My Number (マイナンバー)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nihon-kojin-bango-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-nihon-kojin-bango-view",
    standalone: true,
    template: `<span class="nihon-kojin-bango-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NihonKojinBangoView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
