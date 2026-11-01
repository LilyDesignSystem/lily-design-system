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
 * SplitButton — a button with a primary action and a dropdown for related actions
 *
 * Headless Angular component: a `<div role="group">` holding the primary button, a menu trigger and the menu
 * (projected content). Ships zero CSS; the consumer styles via the class hooks `split-button`,
 * `split-button-primary`, `split-button-menu-trigger` and `split-button-menu`.
 *
 * The menu is `popover="auto"` (tasks.md P18-T11): the trigger's `command="toggle-popover"` opens and closes it
 * with no script, the browser closes it on Escape and on a click outside, and its `toggle` event writes `menuOpen`
 * back. Where the Popover API is missing the trigger's click toggles `menuOpen` (unless a `menuToggle` listener
 * calls `preventDefault()`) and the menu is shown or hidden with `hidden`. Ported from the Svelte reference on
 * 2026-10-30; it was a bare `<button>` stub before.
 */
@Component({
    selector: "lily-split-button",
    standalone: true,
    template: `<div class="split-button {{ className() }}" role="group" [attr.aria-label]="label() || null">
    <button
      class="split-button-primary"
      type="button"
      [disabled]="disabled()"
      (click)="primaryClick.emit($event)"
    >{{ primaryLabel() }}</button>
    <button
      class="split-button-menu-trigger"
      type="button"
      [disabled]="disabled()"
      aria-haspopup="menu"
      [attr.aria-expanded]="menuOpen() ? 'true' : 'false'"
      [attr.aria-label]="menuLabel() || null"
      [attr.aria-controls]="menuId"
      command="toggle-popover"
      [attr.commandfor]="menuId"
      [attr.popovertarget]="menuId"
      (click)="onMenuToggle($event)"
    ></button>
    <div
      #menu
      class="split-button-menu"
      [id]="menuId"
      popover="auto"
      (toggle)="menuOpen.set(toggled($event))"
    ><ng-content /></div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButton {
    /** Accessible label for the group. */
    readonly label = input<string>("");
    /** Visible text of the primary button. */
    readonly primaryLabel = input<string>("");
    /** Accessible label for the menu trigger. */
    readonly menuLabel = input<string>("");
    /** Whether the menu is open. Two-way bindable; the browser's toggle writes back. */
    readonly menuOpen = model<boolean>(false);
    /** Disables both buttons. */
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    readonly primaryClick = output<MouseEvent>();
    /** The trigger's click; call preventDefault() to keep the menu as it is. */
    readonly menuToggle = output<MouseEvent>();

    protected readonly menuId = `split-button-menu-${++nextId}`;
    protected readonly toggled = toggleOpened;
    private readonly menu = viewChild.required<ElementRef<HTMLElement>>("menu");

    constructor() {
        afterRenderEffect(() => syncPopover(this.menu().nativeElement, this.menuOpen()));
    }

    protected onMenuToggle(event: MouseEvent): void {
        this.menuToggle.emit(event);
        if (event.defaultPrevented) return;
        if (!popoverSupported(this.menu().nativeElement)) this.menuOpen.set(!this.menuOpen());
    }
}
