import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FlexStack — a flex layout container for vertical or horizontal stacking with consistent gap
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `flex-stack` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-flex-stack",
    standalone: true,
    template: `<div class="flex-stack {{ className() }}" [attr.data-direction]="direction()" [style.display]="'flex'" [style.flex-direction]="direction()" [style.gap]="gap()" [style.align-items]="align() ?? null" [style.justify-content]="justify() ?? null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexStack {
    readonly className = input<string>("");
    /** Main axis. */
    readonly direction = input<"row" | "column">("column");
    /** Gap between items, any CSS length. */
    readonly gap = input<string>("1rem");
    /** align-items value. */
    readonly align = input<string | undefined>(undefined);
    /** justify-content value. */
    readonly justify = input<string | undefined>(undefined);
}
