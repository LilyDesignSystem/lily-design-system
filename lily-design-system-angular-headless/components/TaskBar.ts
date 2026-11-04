import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    inject,
    input,
} from "@angular/core";
import { attachToolbar } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

/**
 * TaskBar component
 *
 * A headless task bar container using the ARIA toolbar role. It renders a <div>
 * with role="toolbar" and manages horizontal focus movement between action
 * buttons via ArrowLeft/ArrowRight keys. Commonly used for quick access to
 * frequently performed actions such as "New", "Open", "Save", or task-specific
 * operations.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name for the toolbar via aria-label.
 *   <ng-content /> — projected content, required. TaskBarButton elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-task-bar label="Tasks">
 *     <lily-task-bar-button>New</lily-task-bar-button>
 *   </lily-task-bar>
 *
 * Examples:
 *   <!-- Task bar with action buttons -->
 *   <lily-task-bar label="Tasks">
 *     <lily-task-bar-button>New</lily-task-bar-button>
 *     <lily-task-bar-button>Open</lily-task-bar-button>
 *     <lily-task-bar-button>Save</lily-task-bar-button>
 *   </lily-task-bar>
 *
 * Keyboard:
 *   - ArrowRight: move focus to next item, wrapping from last to first
 *   - ArrowLeft: move focus to previous item, wrapping from first to last
 *   - Home: move focus to the first item
 *   - End: move focus to the last item
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
 *   - Compound component: use with TaskBarButton
 *   - Uses horizontal (ArrowLeft/ArrowRight) navigation
 *   - Arrow keys wrap around at boundaries
 *
 * References:
 *   - WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */
@Component({
    selector: "lily-task-bar",
    standalone: true,
    template: `<div
    class="task-bar {{ className() }}"
    role="toolbar"
    [attr.aria-label]="label() || null"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBar implements OnInit {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".task-bar");
        this.keysDestroy.onDestroy(attachToolbar(root));
    }

    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TaskBar",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
