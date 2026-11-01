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
    template: `<span class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaiwanGuominShenfenzhengTongyiBianhaoView {
    /** Optional accessible label override (aria-label). */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
