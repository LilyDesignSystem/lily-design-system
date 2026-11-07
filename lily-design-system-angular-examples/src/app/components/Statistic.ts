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
}
