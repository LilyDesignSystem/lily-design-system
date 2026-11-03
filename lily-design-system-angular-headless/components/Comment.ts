import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Comment component
 *
 * One comment in a discussion. Renders a <div> with the `comment` hook around the consumer's author,
 * time and text.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The comment content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-comment label="…">…</lily-comment>
 *
 * Examples:
 *   <lily-comment label="Comment by Sam"><p>Looks good.</p></lily-comment>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */
@Component({
    selector: "lily-comment",
    standalone: true,
    template: `<div class="comment {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comment {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
