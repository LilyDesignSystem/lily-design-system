import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionNav component
 *
 * Navigation between the sections of a page or document. Renders a <nav> with the `section-nav` hook;
 * the links are SectionList and SectionListItem children.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The section list.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-section-nav label="…">…</lily-section-nav>
 *
 * Examples:
 *   <lily-section-nav label="Sections"><lily-section-list>…</lily-section-list></lily-section-nav>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - The native <nav> element supplies the navigation landmark; give it a `label`
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <nav>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-section-nav",
    standalone: true,
    template: `<nav class="section-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNav {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
