import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";

/**
 * HoverCard — a card that appears on hover over a trigger element
 *
 * Headless Angular component, always rendered with `popover="manual"` and shown while `open`. The consumer's trigger sets
 * `open` on hover and focus, and names the anchor with `position-anchor`. Ships zero CSS.
 */
@Component({
    selector: "lily-hover-card",
    standalone: true,
    template: `<div
        class="hover-card {{ className() }}"
        role="tooltip"
        #panel
        popover="manual"
        [attr.aria-label]="label() || null"
    ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverCard {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.open());
    });
    readonly label = input.required<string>();
    readonly open = input<boolean>(false);
    readonly className = input<string>("");
}
