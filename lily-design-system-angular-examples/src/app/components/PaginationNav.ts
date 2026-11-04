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
 * PaginationNav component
 *
 * A navigation landmark for pagination controls that allow users to navigate
 * between pages of content. Renders a <nav> element with an accessible label.
 * Contains a PaginationList which holds PaginationListItem children. Commonly
 * used in search results, product listings, data tables, and any interface
 * with paginated content.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name for the navigation landmark.
 *   <ng-content /> — projected content, required. PaginationList element.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-pagination-nav label="Pagination">
 *     <lily-pagination-list>...</lily-pagination-list>
 *   </lily-pagination-nav>
 *
 * Examples:
 *   <!-- Full pagination navigation -->
 *   <lily-pagination-nav label="Pagination">
 *     <lily-pagination-list>
 *       <li[lily-pagination-list-item]><a href="/page/1">Previous</a></li[lily-pagination-list-item]>
 *       <li[lily-pagination-list-item]><a href="/page/1">1</a></li[lily-pagination-list-item]>
 *       <li[lily-pagination-list-item]><a href="/page/2" aria-current="page">2</a></li[lily-pagination-list-item]>
 *       <li[lily-pagination-list-item]><a href="/page/3">3</a></li[lily-pagination-list-item]>
 *       <li[lily-pagination-list-item]><a href="/page/3">Next</a></li[lily-pagination-list-item]>
 *     </lily-pagination-list>
 *   </lily-pagination-nav>
 *
 * Keyboard:
 *   - Tab: Focus moves between pagination links in the list
 *   - Enter: Activates the focused link to navigate to that page
 *
 * Accessibility:
 *   - <nav> with aria-label creates a navigation landmark
 *   - Screen readers announce the landmark name for orientation
 *   - Consumer should apply aria-current="page" on the active page link
 *
 * Internationalization:
 *   - Label text comes through the label prop; no hardcoded strings
 *
 * Claude rules:
 *   - Compound component — use with PaginationList and PaginationListItem
 *   - Headless: no CSS, no styles — consumer provides all styling
 *
 * References:
 *   - WAI-ARIA Navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
 *   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-pagination-nav",
    standalone: true,
    template: `<nav class="pagination-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationNav implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "PaginationNav",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
