import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Sparkline — a small inline chart showing a data trend
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sparkline` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-sparkline",
    standalone: true,
    template: `<span class="sparkline {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sparkline {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
