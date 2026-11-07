import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScreenReaderSpan component
 *
 * Text meant for assistive technology. Renders a <span> with the `screen-reader-span` hook; the
 * visually-hidden CSS that makes it screen-reader-only is the consumer's.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The text for screen readers.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-screen-reader-span label="…">…</lily-screen-reader-span>
 *
 * Examples:
 *   <a href="/name">Change<lily-screen-reader-span> name</lily-screen-reader-span></a>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - Hide it visually in CSS with a clip pattern, never `display: none` or `hidden`, which also remove it from the accessibility tree
 *   - aria-label from `label` is also rendered when given; usually the children alone are enough
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
 */
@Component({
    selector: "lily-screen-reader-span",
    standalone: true,
    template: `<span class="screen-reader-span {{ className() }}"><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenReaderSpan {
    readonly className = input<string>("");
}
