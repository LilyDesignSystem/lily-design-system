import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProgressCircle — a circular progress indicator
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress-circle` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-progress-circle",
    standalone: true,
    template: `<div
        class="progress-circle {{ className() }}"
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
export class ProgressCircle {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Current value. Unset is 0, as in Svelte. */
    readonly value = input<number | undefined>(0);
    /** Lowest value. */
    readonly min = input<number>(0);
    /** Highest value. */
    readonly max = input<number>(100);
}
