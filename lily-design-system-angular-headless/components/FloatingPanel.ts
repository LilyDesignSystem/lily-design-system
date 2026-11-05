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
 * FloatingPanel — a panel that floats above page content
 *
 * Headless Angular component: a labelled region, always rendered with `popover="manual"` and shown from `open`, which the
 * consumer owns. In the top layer, so no z-index or clipping to fight; Escape and light dismiss are the consumer's.
 * Ships zero CSS; the consumer styles via the class hook and names an anchor with `position-anchor`.
 */
@Component({
    selector: "lily-floating-panel",
    standalone: true,
    template: `<div
        #panel
        class="floating-panel {{ className() }}"
        role="region"
        popover="manual"
        [attr.aria-label]="label() || null"
    ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingPanel {
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    readonly label = input.required<string>();
    readonly open = input<boolean>(false);
    readonly className = input<string>("");

    constructor() {
        afterRenderEffect(() => {
            const el = this.panel()?.nativeElement;
            if (el) syncPopover(el, this.open());
        });
    }
}
