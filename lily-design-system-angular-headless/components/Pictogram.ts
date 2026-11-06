import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Pictogram — an icon-based component pairing an icon with a title and description in a centered or side layout
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pictogram` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-pictogram",
    standalone: true,
    template: `<figure class="pictogram {{ className() }}" [attr.aria-label]="label() || null" [attr.data-layout]="layout()">
        <div class="pictogram-icon" aria-hidden="true"><ng-content select="[icon]" /></div>
        <figcaption class="pictogram-caption">
            @if (heading()) {<h3 class="pictogram-heading">{{ heading() }}</h3>}
            <ng-content>@if (description()) {<p class="pictogram-description">{{ description() }}</p>}</ng-content>
        </figcaption>
    </figure>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pictogram {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Layout, read by the consumer's CSS. */
    readonly layout = input<"centered" | "side">("centered");
    /** Title. */
    readonly heading = input<string | undefined>(undefined);
    /** Text, when nothing is projected. */
    readonly description = input<string | undefined>(undefined);
}
