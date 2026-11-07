import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupTabletPortrait component
 *
 * A device frame: a box that looks like a tablet in portrait orientation. Renders a <div> with the
 * `mockup-tablet-portrait` hook around the consumer's screenshot or demo; the device drawing is the
 * consumer's CSS.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The framed content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-mockup-tablet-portrait label="…">…</lily-mockup-tablet-portrait>
 *
 * Examples:
 *   <lily-mockup-tablet-portrait label="…"><img src="screen.png" alt="…" /></lily-mockup-tablet-portrait>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <div> has no role; pass role="img" or "group" on the host element (Angular has no rest props), and a text alternative, if the mockup must be announced
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
    selector: "lily-mockup-tablet-portrait",
    standalone: true,
    template: `<div class="mockup-tablet-portrait {{ className() }}" role="img" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupTabletPortrait {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
