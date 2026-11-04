import {
    ChangeDetectionStrategy,
    Component,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * ToolBar component
 *
 * A headless toolbar container that provides the ARIA toolbar role and built-in
 * keyboard navigation for action buttons and controls. It implements the roving
 * focus pattern with Left/Right arrow keys to move between items and Home/End
 * keys to jump to first/last items. Focus wraps around from last to first and
 * vice versa.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name for the toolbar via aria-label.
 *   <ng-content /> — projected content, required. ToolBarButton elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tool-bar label="Editor tools">...</lily-tool-bar>
 *
 * Examples:
 *   <!-- Text editor toolbar -->
 *   <lily-tool-bar label="Editor tools">
 *     <lily-tool-bar-button>Bold</lily-tool-bar-button>
 *     <lily-tool-bar-button>Italic</lily-tool-bar-button>
 *     <lily-tool-bar-button>Underline</lily-tool-bar-button>
 *   </lily-tool-bar>
 *
 * Keyboard:
 *   - ArrowRight: move focus to next item (wraps to first)
 *   - ArrowLeft: move focus to previous item (wraps to last)
 *   - Home: move focus to first item
 *   - End: move focus to last item
 *   - Tab: enter/exit the toolbar
 *
 * Accessibility:
 *   - role="toolbar" identifies the container as a toolbar widget
 *   - aria-label provides the accessible name for the toolbar
 *
 * Internationalization:
 *   - The label prop accepts any translated string
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Compound component: use with ToolBarButton
 *   - Uses horizontal (ArrowLeft/ArrowRight) navigation
 *   - Arrow keys wrap around at boundaries
 *
 * References:
 *   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */
@Component({
    selector: "lily-tool-bar",
    standalone: true,
    template: `<div
    class="tool-bar {{ className() }}"
    role="toolbar"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBar implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    /** Roving focus over buttons and tabindex descendants (left/right, wrapping; Home/End). */
    protected onKeydown(event: KeyboardEvent): void {
        const root = event.currentTarget as HTMLElement;
        const items = Array.from(
            root.querySelectorAll<HTMLElement>("button, [role='button'], [tabindex]"),
        );
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

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "ToolBar",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
