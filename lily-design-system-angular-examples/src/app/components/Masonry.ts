import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Masonry — a masonry layout container for variable-height items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `masonry` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-masonry",
    standalone: true,
    template: `<div class="masonry {{ className() }}" [attr.data-columns]="columns()" [style.column-count]="columns()" [style.column-gap]="gap()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Masonry {
    readonly className = input<string>("");
    /** Number of columns. */
    readonly columns = input<number>(3);
    /** Gap between columns, any CSS length. */
    readonly gap = input<string>("1rem");
}
