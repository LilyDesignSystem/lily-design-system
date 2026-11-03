import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeLink component
 *
 * A link used for a node of a tree navigation that leads somewhere. Renders an <a> with the `tree-
 * link` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   href — string, required. The URL to navigate to.
 *   label — string, optional. Overrides the accessible name (aria-label).
 *   <ng-content /> — projected content, required. The link content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tree-link href="…">…</lily-tree-link>
 *
 * Examples:
 *   <lily-tree-link href="/page">Page</lily-tree-link>
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
    selector: "lily-tree-link",
    standalone: true,
    template: `<a class="tree-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeLink {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
}
