import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Mark component
 *
 * An inline highlight marking text as relevant or referenced, such as a search match. Renders the
 * native <mark> element with the `mark` hook; the highlight colour is the consumer's CSS.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, optional. The marked text.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-mark>…</lily-mark>
 *
 * Examples:
 *   <p>Search results for <lily-mark>design</lily-mark> systems.</p>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - The native <mark> element conveys relevance; screen readers do not announce it consistently, so do not rely on the highlight alone
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Draws nothing and carries no strings of its own
 *
 * References:
 *   - MDN <mark>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark
 */
@Component({
    selector: "lily-mark",
    standalone: true,
    template: `<mark class="mark {{ className() }}" ><ng-content /></mark>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mark {
    readonly className = input<string>("");
}
