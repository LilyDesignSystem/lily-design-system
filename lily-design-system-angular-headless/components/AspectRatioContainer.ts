import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AspectRatioContainer — a container that maintains a fixed aspect ratio
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `aspect-ratio-container` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-aspect-ratio-container",
    standalone: true,
    template: `<div class="aspect-ratio-container {{ className() }}" [style.aspect-ratio]="ratio()" [attr.data-aspect-ratio-container]="ratio()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectRatioContainer {
    readonly className = input<string>("");
    /** Width divided by height. */
    readonly ratio = input<number>(1);
}
