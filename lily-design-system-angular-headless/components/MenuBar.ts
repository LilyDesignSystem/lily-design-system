import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuBar component
 *
 * A headless horizontal menu bar using the ARIA menubar role, typically found
 * at the top of an application window. It renders a <div> with role="menubar"
 * and manages horizontal focus movement between top-level menu items via
 * ArrowLeft/ArrowRight keys, mimicking desktop application menu bars (e.g.,
 * File, Edit, View). Each top-level item may open a submenu or trigger an action.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name applied via aria-label.
 *   <ng-content /> — projected content, required. MenuBarButton elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-menu-bar label="Main menu">
 *     <lily-menu-bar-button>File</lily-menu-bar-button>
 *   </lily-menu-bar>
 *
 * Examples:
 *   <!-- Basic application menu bar -->
 *   <lily-menu-bar label="Main menu">
 *     <lily-menu-bar-button>File</lily-menu-bar-button>
 *     <lily-menu-bar-button>Edit</lily-menu-bar-button>
 *     <lily-menu-bar-button>View</lily-menu-bar-button>
 *   </lily-menu-bar>
 *
 * Keyboard:
 *   - ArrowRight: move focus to next menu bar item, wrapping from last to first
 *   - ArrowLeft: move focus to previous menu bar item, wrapping from first to last
 *   - Home: move focus to the first menu bar item
 *   - End: move focus to the last menu bar item
 *
 * Accessibility:
 *   - role="menubar" identifies the container as a horizontal menu bar widget
 *   - aria-label provides an accessible name describing the menu bar purpose
 *   - Child MenuBarButton elements provide role="menuitem" with tabindex="-1"
 *
 * Internationalization:
 *   - The label prop accepts any translated string
 *   - All menu bar item content comes through the children snippet
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Compound component: pair with MenuBarButton for individual entries
 *   - Uses horizontal (ArrowLeft/ArrowRight) navigation, not vertical
 *   - Arrow keys wrap around at boundaries
 *
 * References:
 *   - WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */
@Component({
    selector: "lily-menu-bar",
    standalone: true,
    template: `<div
    class="menu-bar {{ className() }}"
    role="menubar"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBar {
    readonly label = input<string>("");
    readonly className = input<string>("");

    /** Roving focus left/right over the `role="menuitem"` descendants. */
    protected onKeydown(event: KeyboardEvent): void {
        const root = event.currentTarget as HTMLElement;
        const items = Array.from(root.querySelectorAll<HTMLElement>("[role='menuitem']"));
        const index = items.indexOf(document.activeElement as HTMLElement);
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                items[index < items.length - 1 ? index + 1 : 0]?.focus();
                break;
            case "ArrowLeft":
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
        }
    }
}
