import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Headline — a page headline with heading, subtitle, and byline area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `headline` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-headline",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<ng-template #body><ng-content /></ng-template>
    <div class="headline {{ className() }}">
        @switch (level()) {@case (1) {<h1 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h1>} @case (2) {<h2 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h2>} @case (3) {<h3 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h3>} @case (4) {<h4 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h4>} @case (5) {<h5 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h5>} @default {<h6 class="headline-heading"><ng-container [ngTemplateOutlet]="body" /></h6>}}
        <div class="headline-subtitle"><ng-content select="[subtitle]" /></div>
        <div class="headline-byline"><ng-content select="[byline]" /></div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Headline {
    readonly className = input<string>("");
    /** Heading level. */
    readonly level = input<1 | 2 | 3 | 4 | 5 | 6>(1);
}
