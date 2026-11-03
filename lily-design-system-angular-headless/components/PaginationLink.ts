import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaginationLink component
 *
 * A link used for a page of a paginated list. Renders an <a> with the `pagination-link` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   href — string, required. The URL to navigate to.
 *   label — string, optional. Overrides the accessible name (aria-label).
 *   <ng-content /> — projected content, required. The link content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-pagination-link href="…">…</lily-pagination-link>
 *
 * Examples:
 *   <lily-pagination-link href="/page">Page</lily-pagination-link>
 *
 * Keyboard:
 *   - Tab: moves focus onto the link
 *   - Enter: follows the link (native browser behaviour)
 *
 * Accessibility:
 *   - A native <a href>
 *   - `label` becomes aria-label and replaces the visible text as the name; when used it must contain the visible text (WCAG 2.5.3 Label in Name)
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Client-side routing is the consumer's: pass an onclick on the host element (Angular has no rest props)
 *
 * References:
 *   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
 */
@Component({
    selector: "lily-pagination-link",
    standalone: true,
    template: `<a class="pagination-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationLink {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
}
