import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HangukJuminDeungnokBeonhoView — a read-only display of South Korea's Resident Registration Number (주민등록번호)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hanguk-jumin-deungnok-beonho-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-hanguk-jumin-deungnok-beonho-view",
    standalone: true,
    template: `<span class="hanguk-jumin-deungnok-beonho-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HangukJuminDeungnokBeonhoView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
