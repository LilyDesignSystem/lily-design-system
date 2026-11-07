import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StepList — an ordered list of step items showing progress through a multi-step process
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `step-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-step-list",
    standalone: true,
    template: `<ol class="step-list {{ className() }}" [attr.aria-label]="label() || null" [attr.data-current]="current() ?? null"><ng-content /></ol>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepList {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The current step, for the consumer's CSS. */
    readonly current = input<number | undefined>(undefined);
}
