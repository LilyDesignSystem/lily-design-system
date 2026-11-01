import {
    afterNextRender,
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    model,
    viewChild,
} from "@angular/core";

import { popoverSupported, syncPopover, toggleOpened } from "./Popover";

let nextId = 0;

/**
 * DropdownMenu — a menu that opens below a trigger button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dropdown-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-dropdown-menu",
    standalone: true,
    template: `<div class="dropdown-menu {{ className() }}">
    <button
      type="button"
      aria-haspopup="true"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="label() || null"
      [attr.aria-controls]="menuId"
      command="toggle-popover"
      [attr.commandfor]="menuId"
      [attr.popovertarget]="menuId"
      (click)="onTriggerClick()"
    >{{ label() }}</button>
    <div
      #menu
      [id]="menuId"
      role="menu"
      [attr.aria-label]="label() || null"
      popover="auto"
      (toggle)="open.set(toggled($event))"
      (keydown)="onKeydown($event)"
    ><ng-content /></div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu {
    readonly label = input<string>("");
    /** Whether the menu is open. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    readonly className = input<string>("");

    protected readonly menuId = `dropdown-menu-${++nextId}`;
    protected readonly toggled = toggleOpened;
    private readonly menu = viewChild<ElementRef<HTMLElement>>("menu");

    constructor() {
        // popover="auto" (tasks.md P18-T11): the trigger's command="toggle-popover" opens and closes the menu, Escape
        // and light dismiss come from the browser, and the toggle event writes `open` back. Without the API the click
        // toggles `open` and syncPopover sets `hidden`.
        afterRenderEffect(() => {
            const menu = this.menu()?.nativeElement;
            if (menu) syncPopover(menu, this.open());
        });
        const injector = inject(Injector);
        effect(() => {
            if (this.open()) {
                afterNextRender(
                    () =>
                        this.menu()
                            ?.nativeElement.querySelector<HTMLElement>("[role='menuitem']")
                            ?.focus(),
                    { injector },
                );
            }
        });
    }

    protected onTriggerClick(): void {
        const menu = this.menu()?.nativeElement;
        if (menu && !popoverSupported(menu)) this.open.set(!this.open());
    }

    /** Roving focus over the `role="menuitem"` descendants (WAI-ARIA APG menu pattern). */
    protected onKeydown(event: KeyboardEvent): void {
        const root = event.currentTarget as HTMLElement;
        const items = Array.from(root.querySelectorAll<HTMLElement>("[role='menuitem']"));
        const index = items.indexOf(document.activeElement as HTMLElement);
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                items[index < items.length - 1 ? index + 1 : 0]?.focus();
                break;
            case "ArrowUp":
                event.preventDefault();
                items[index > 0 ? index - 1 : items.length - 1]?.focus();
                break;
            case "Home":
                event.preventDefault();
                items[0]?.focus();
                break;
            case "End":
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case "Escape":
                event.preventDefault();
                this.open.set(false);
                break;
        }
    }
}
