import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GraphicBlock — a wrapper for charts and graphics with title, description, notes, and ARIA description
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `graphic-block` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-graphic-block",
    standalone: true,
    template: `<figure class="graphic-block {{ className() }}" role="img" [attr.aria-label]="label() || null">
        @if (title() !== undefined || description() !== undefined || notes() !== undefined) {
            <figcaption class="graphic-block-caption">
                @if (title() !== undefined) {<div class="graphic-block-title">{{ title() }}</div>}
                @if (description() !== undefined) {<div class="graphic-block-description">{{ description() }}</div>}
                @if (notes() !== undefined) {<div class="graphic-block-notes">{{ notes() }}</div>}
            </figcaption>
        }
        <div class="graphic-block-content"><ng-content /></div>
    </figure>`,
    // title is an input here: left on the host too it would be a tooltip.
    host: { "[attr.title]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicBlock {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Caption title. */
    readonly title = input<string | undefined>(undefined);
    /** Caption text. */
    readonly description = input<string | undefined>(undefined);
    /** Source or method notes. */
    readonly notes = input<string | undefined>(undefined);
}
