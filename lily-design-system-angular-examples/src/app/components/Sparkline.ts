import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, computed, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

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
    imports: [NgTemplateOutlet],
    template: `<ng-template #content><ng-content /></ng-template><span
        class="sparkline {{ className() }}"
        [attr.role]="insufficient() ? null : 'img'"
        [attr.aria-label]="insufficient() ? null : label() || null"
        [attr.data-insufficient]="insufficient() ? '' : null"
        >@if (insufficient()) {<span class="sparkline-insufficient">{{ insufficientLabel() }}</span>} @else {<ng-container
                [ngTemplateOutlet]="content"
            />}</span
    >`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sparkline implements OnInit {
    readonly label = input<string>("");
    /** How many readings the consumer's graphic shows. */
    readonly pointCount = input<number | null>(null);
    /** Fewer readings than this are not a trend: only insufficientLabel is shown, as text. Rendered as data-insufficient. */
    readonly minimumPoints = input<number | null>(null);
    /** Why there is no line, in the consumer's words; required with minimumPoints. */
    readonly insufficientLabel = input<string>("");
    protected readonly insufficient = computed(() => {
        const count = this.pointCount();
        const minimum = this.minimumPoints();
        return count !== null && minimum !== null && count < minimum;
    });

    ngOnInit(): void {
        if (this.minimumPoints() !== null)
            warnMissingProp(
                "Sparkline",
                "insufficientLabel",
                this.insufficientLabel(),
                "a sparkline that draws no line must say why in words.",
            );
    }
    readonly className = input<string>("");
}
