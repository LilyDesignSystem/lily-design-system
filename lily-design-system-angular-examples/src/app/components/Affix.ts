import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Affix — a wrapper that pins its content to a viewport position while the page scrolls
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `affix` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-affix",
    standalone: true,
    template: `<div class="affix {{ className() }}" [style.position]="'sticky'" [style.top.px]="offsetBottom() === undefined ? (offsetTop() ?? 0) : null" [style.bottom.px]="offsetBottom() ?? null" [attr.data-offset-top]="offsetTop() ?? null" [attr.data-offset-bottom]="offsetBottom() ?? null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Affix {
    readonly className = input<string>("");
    /** Sticks this many pixels from the top; the default when neither offset is set, at 0. */
    readonly offsetTop = input<number | undefined>(undefined);
    /** Sticks this many pixels from the bottom; wins over offsetTop. */
    readonly offsetBottom = input<number | undefined>(undefined);
}
