import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AlImaratRaqmAlHuwiyahView — a read-only display of the United Arab Emirates' Emirates ID number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `al-imarat-raqm-al-huwiyah-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-al-imarat-raqm-al-huwiyah-view",
    standalone: true,
    template: `<span class="al-imarat-raqm-al-huwiyah-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlImaratRaqmAlHuwiyahView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
