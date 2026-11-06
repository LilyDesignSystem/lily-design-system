import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Framer component
 *
 * A frame around embedded or mocked content. Renders a <div> with the `framer` hook; the frame's look
 * is the consumer's CSS.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The framed content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-framer label="…">…</lily-framer>
 *
 * Examples:
 *   <lily-framer>…</lily-framer>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - With a label the root is role="group", because a plain <div> cannot be named
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
    selector: "lily-framer",
    standalone: true,
    template: `<div class="framer {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Framer {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
