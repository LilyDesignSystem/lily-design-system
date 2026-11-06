import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TaiwanGuominShenfenzhengTongyiBianhaoView — a read-only display of Taiwan's National Identification Card Number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `taiwan-guomin-shenfenzheng-tongyi-bianhao-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
    standalone: true,
    template: `<span class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaiwanGuominShenfenzhengTongyiBianhaoView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
