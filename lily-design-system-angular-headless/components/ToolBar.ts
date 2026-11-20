import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { attachToolbar } from "./widget-keys";

/**
 * ToolBar component
 *
 * A headless toolbar container that provides the ARIA toolbar role and built-in
 * keyboard navigation for action buttons and controls, through the shared
 * attachToolbar (widget-keys): one tab stop that follows focus, arrows that
 * move between enabled controls and wrap, Home and End.
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
 *   - ArrowRight: move focus to next enabled item (wraps to first); ArrowLeft in right-to-left
 *   - ArrowLeft: move focus to previous enabled item (wraps to last); ArrowRight in right-to-left
 *   - ArrowDown / ArrowUp instead, with aria-orientation="vertical"
 *   - A text field, select or textarea in the toolbar keeps its own arrows
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
 *   - Keys come from attachToolbar in widget-keys; the toolbar contract holds every port to it
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
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBar implements OnInit, AfterViewInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    private readonly keysDestroy = inject(DestroyRef);

    /** The shared toolbar keys: one tab stop, arrows that skip a disabled control and swap in right-to-left, Home, End. */
    ngAfterViewInit(): void {
        const root = this.lilyHost.nativeElement.querySelector(".tool-bar");
        this.keysDestroy.onDestroy(attachToolbar(root));
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
