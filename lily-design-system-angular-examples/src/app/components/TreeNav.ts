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
 * TreeNav component
 *
 * A headless navigation landmark for hierarchical / tree-style navigation.
 * Renders a <nav> element with an accessible label. Wrap a TreeList inside
 * for the actual ARIA tree role and keyboard navigation.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name for the navigation landmark.
 *   <ng-content /> — projected content, required. Typically a TreeList.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tree-nav label="Site map">
 *     <lily-tree-list label="Pages">
 *       <li[lily-tree-list-item]>...</li[lily-tree-list-item]>
 *     </lily-tree-list>
 *   </lily-tree-nav>
 *
 * Examples:
 *   <lily-tree-nav label="Documentation">
 *     <lily-tree-list label="Topics">
 *       <li role="treeitem" tabindex="0">Getting started</li>
 *       <li role="treeitem" tabindex="-1">Components</li>
 *     </lily-tree-list>
 *   </lily-tree-nav>
 *
 * Keyboard:
 *   - Tab: Focus moves into and out of the navigation
 *   - Tree-item navigation is provided by the inner TreeList
 *
 * Accessibility:
 *   - <nav> with aria-label creates a navigation landmark
 *   - Tree semantics live on the inner TreeList (role="tree" + role="treeitem")
 *
 * Internationalization:
 *   - The label prop accepts any translated string
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - This component provides the landmark only; tree-pattern keyboard
 *     navigation belongs on TreeList
 *
 * References:
 *   - WAI-ARIA Navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
 *   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-tree-nav",
    standalone: true,
    template: `<nav class="tree-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNav implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TreeNav",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
