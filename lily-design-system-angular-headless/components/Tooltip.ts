import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    OnInit,
    viewChild,
} from "@angular/core";
import { syncPopover } from "./Popover";
import { warnMissingName } from "./dev-warning";

/**
 * Tooltip — a small popup showing descriptive text on hover or focus
 *
 * Headless Angular component: `label` is its text. Always rendered with `popover="manual"` and shown while `visible`. The
 * consumer's trigger sets `visible` on hover and focus, and points `aria-describedby` at `id`. Ships zero CSS.
 */
@Component({
    selector: "lily-tooltip",
    standalone: true,
    template: `<div
        class="tooltip {{ className() }}"
        role="tooltip"
        #panel
        popover="manual"
        [attr.id]="id() || null"
    >{{ label() }}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip implements OnInit {
    private readonly lilyHost = inject(ElementRef);
    private readonly panel = viewChild<ElementRef<HTMLElement>>("panel");

    private readonly syncPanel = afterRenderEffect(() => {
        const el = this.panel()?.nativeElement;
        if (el) syncPopover(el, this.visible());
    });
    readonly label = input<string>("");
    readonly visible = input<boolean>(false);
    readonly id = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Tooltip",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
