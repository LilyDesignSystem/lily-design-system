import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

/**
 * Statistic — a numeric value display with title, prefix, and suffix
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `statistic` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-statistic",
    standalone: true,
    template: `<div class="statistic {{ className() }}" role="group" [attr.aria-label]="ariaLabel()">
        <div class="statistic-title">{{ title() }}</div>
        <div class="statistic-value"><span class="statistic-prefix"><ng-content select="[prefix]" /></span>{{ value() }}<span class="statistic-suffix"><ng-content select="[suffix]" /></span></div>
        @if (change()) {
            <div class="statistic-change" [attr.data-trend]="trend() || null">{{ change() }}</div>
        }
        @if (asOfLabel()) {
            <time class="statistic-as-of" [attr.datetime]="asOf() || null">{{ asOfLabel() }}</time>
        }
    </div>`,
    // title is an input here: left on the host too it would be a tooltip.
    host: { "[attr.title]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistic {
    protected readonly ariaLabel = computed(
        () => this.label() || `${this.title()}: ${this.value()}`,
    );

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** What is measured. */
    readonly title = input<string>("");
    /** The formatted value. */
    readonly value = input<string>("");
    /** The change, in words that name what it is compared with ("0.5 more than October 2024"). */
    readonly change = input<string>("");
    /** The direction of the change, as data-trend for the theme; the words in `change` carry it for everyone. */
    readonly trend = input<"up" | "down" | "flat" | undefined>(undefined);
    /** When the value was measured, as an ISO 8601 date or date-time for the <time> element. */
    readonly asOf = input<string>("");
    /** When the value was measured, in words; the as-of line renders only with it. */
    readonly asOfLabel = input<string>("");
}
