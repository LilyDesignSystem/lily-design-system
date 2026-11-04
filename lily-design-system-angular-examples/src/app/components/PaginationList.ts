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
 * PaginationList component
 *
 * A headless ordered list of pagination items, intended to live inside a
 * PaginationNav landmark. Renders an <ol> element. Commonly used in search
 * results, product listings, data tables, and any interface with paginated
 * content.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name for the list via aria-label.
 *                Usually omitted, since PaginationNav already supplies the
 *                navigation landmark label.
 *   <ng-content /> — projected content, required. PaginationListItem elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-pagination-nav label="Pagination">
 *     <lily-pagination-list>
 *       <li[lily-pagination-list-item]>...</li[lily-pagination-list-item]>
 *     </lily-pagination-list>
 *   </lily-pagination-nav>
 *
 * Examples:
 *   <lily-pagination-list>
 *     <li[lily-pagination-list-item]><a href="/page/1">1</a></li[lily-pagination-list-item]>
 *     <li[lily-pagination-list-item]><a href="/page/2" aria-current="page">2</a></li[lily-pagination-list-item]>
 *     <li[lily-pagination-list-item]><a href="/page/3">3</a></li[lily-pagination-list-item]>
 *   </lily-pagination-list>
 *
 * Keyboard:
 *   - Tab: moves focus between pagination links/buttons in the list
 *   - Enter: activates the focused link or button to navigate to that page
 *
 * Accessibility:
 *   - <ol> conveys ordered-list semantics
 *   - Consumer should apply aria-current="page" on the link for the active page
 *   - Compound component; see PaginationNav for the navigation landmark and
 *     PaginationListItem for individual page items
 *
 * Internationalization:
 *   - The optional label prop accepts any translated string
 *   - All page link text comes through children
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - This is a compound component child; use inside PaginationNav with
 *     PaginationListItem children
 *
 * References:
 *   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
 */
@Component({
    selector: "lily-pagination-list",
    standalone: true,
    template: `<ol class="pagination-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationList implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "PaginationList",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
