import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    model,
    output,
    viewChild,
} from "@angular/core";

import { popoverSupported, syncPopover, toggleOpened } from "./Popover";

let nextId = 0;

/**
 * ActionGroup — a group of action buttons that can collapse to an overflow menu when space is constrained
 *
 * Headless Angular component: a `<div role="group">` holding the projected action buttons and, when
 * `overflowLabel` is set, an overflow trigger and menu. Project the overflow menu's content with the `overflow`
 * attribute (`<div overflow>…</div>`); Angular cannot tell whether plain projected content exists, so the label
 * (the trigger's accessible name, required for it anyway) is what turns the overflow on. Ships zero CSS.
 *
 * The overflow menu is `popover="auto"` (tasks.md P18-T11): the trigger's `command="toggle-popover"` opens and
 * closes it with no script, the browser closes it on Escape and on a click outside, and its `toggle` event writes
 * `overflowOpen` back. Where the Popover API is missing the trigger's click toggles `overflowOpen` (unless an
 * `overflowToggle` listener calls `preventDefault()`) and the menu is shown or hidden with `hidden`. Ported from
 * the Svelte reference on 2026-10-30; it was a bare `<div>` stub before.
 */
@Component({
    selector: "lily-action-group",
    standalone: true,
    template: `<div class="action-group {{ className() }}" role="group" [attr.aria-label]="label() || null">
    <ng-content />
    @if (overflowLabel()) {
      <button
        class="action-group-overflow-trigger"
        type="button"
        aria-haspopup="menu"
        [attr.aria-expanded]="overflowOpen() ? 'true' : 'false'"
        [attr.aria-label]="overflowLabel()"
        [attr.aria-controls]="menuId"
        command="toggle-popover"
        [attr.commandfor]="menuId"
        [attr.popovertarget]="menuId"
        (click)="onOverflowToggle($event)"
      >…</button>
      <div
        #menu
        class="action-group-overflow-menu"
        [id]="menuId"
        popover="auto"
        (toggle)="overflowOpen.set(toggled($event))"
      ><ng-content select="[overflow]" /></div>
    }
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionGroup {
    /** Accessible label for the group. */
    readonly label = input<string>("");
    /** Accessible label for the overflow trigger; set it to show the overflow trigger and menu. */
    readonly overflowLabel = input<string>("");
    /** Whether the overflow menu is open. Two-way bindable; the browser's toggle writes back. */
    readonly overflowOpen = model<boolean>(false);
    readonly className = input<string>("");
    /** The overflow trigger's click; call preventDefault() to keep the menu as it is. */
    readonly overflowToggle = output<MouseEvent>();

    protected readonly menuId = `action-group-overflow-menu-${++nextId}`;
    protected readonly toggled = toggleOpened;
    private readonly menu = viewChild<ElementRef<HTMLElement>>("menu");

    constructor() {
        afterRenderEffect(() => {
            const menu = this.menu()?.nativeElement;
            if (menu) syncPopover(menu, this.overflowOpen());
        });
    }

    protected onOverflowToggle(event: MouseEvent): void {
        this.overflowToggle.emit(event);
        if (event.defaultPrevented) return;
        const menu = this.menu()?.nativeElement;
        if (menu && !popoverSupported(menu)) this.overflowOpen.set(!this.overflowOpen());
    }
}
