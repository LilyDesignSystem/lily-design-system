import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
} from "@angular/core";
import { attachSplitView } from "./widget-keys";

/**
 * SplitView — a two-panel resizable layout container with a draggable divider between them
 *
 * Headless Angular component. A labelled `<div>` holding two `<section>` panels and,
 * between them, a focusable `role="separator"` divider (the WAI-ARIA window splitter)
 * whose `aria-valuenow` is `splitPercent`. Moving the divider (arrow keys, Home / End,
 * dragging) is the consumer's: it updates `splitPercent`. Ships zero CSS; the
 * orientation and percentage are published as `data-*` for the consumer's CSS.
 *
 * Content: `<div primary>` and `<div secondary>` fill the panels; an element marked
 * `divider` replaces the default divider.
 */
@Component({
    selector: "lily-split-view",
    standalone: true,
    template: `<div
        class="split-view {{ className() }}"
        [attr.role]="label() ? 'group' : null" [attr.aria-label]="label()"
        [attr.data-orientation]="orientation()"
        [attr.data-split-percent]="splitPercent()"
    >
        <section class="split-view-primary"><ng-content select="[primary]" /></section>
        <ng-content select="[divider]">
            <div
                class="split-view-divider"
                role="separator"
                tabindex="0"
                [attr.aria-orientation]="orientation()"
                [attr.aria-valuenow]="splitPercent()"
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </ng-content>
        <section class="split-view-secondary"><ng-content select="[secondary]" /></section>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitView {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".split-view");
        this.keysDestroy.onDestroy(
            attachSplitView(root, { onChange: (next) => this.splitPercent.set(next) }),
        );
    }

    /** Accessible name for the container (required; no English from us). */
    readonly label = input.required<string>();
    /** The divider's orientation. */
    readonly orientation = input<"horizontal" | "vertical">("horizontal");
    /** The split position as a percentage (0 to 100). */
    /** Split position (0-100). Two-way bindable. */
    readonly splitPercent = model<number>(50);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
}
