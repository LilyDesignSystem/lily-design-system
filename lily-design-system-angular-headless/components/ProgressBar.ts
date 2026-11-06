import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProgressBar — a horizontal progress indicator
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-progress-bar",
    standalone: true,
    template: `<div
        class="progress-bar {{ className() }}"
        role="progressbar"
        [attr.aria-label]="label() || null"
        [attr.aria-valuenow]="value() ?? null"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
    >
        <ng-content />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Current value. Leave unset when progress is indeterminate. */
    readonly value = input<number | undefined>(undefined);
    /** Lowest value. */
    readonly min = input<number>(0);
    /** Highest value. */
    readonly max = input<number>(100);
}
