import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Card — a grouped content container with header, body, and footer areas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-card",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<ng-template #title>@if (href()) {<a [attr.href]="href()">{{ heading() }}</a>} @else {{{ heading() }}}</ng-template>
    <div class="card {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null">
        @if (heading()) {
            @switch (headingLevel()) {
                @case (2) {<h2><ng-container [ngTemplateOutlet]="title" /></h2>}
                @case (3) {<h3><ng-container [ngTemplateOutlet]="title" /></h3>}
                @case (4) {<h4><ng-container [ngTemplateOutlet]="title" /></h4>}
                @case (5) {<h5><ng-container [ngTemplateOutlet]="title" /></h5>}
                @case (6) {<h6><ng-container [ngTemplateOutlet]="title" /></h6>}
            }
        }
        <ng-content />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Card title. */
    readonly heading = input<string | undefined>(undefined);
    /** Heading level. */
    readonly headingLevel = input<2 | 3 | 4 | 5 | 6>(3);
    /** Makes the title a link. */
    readonly href = input<string | undefined>(undefined);
}
