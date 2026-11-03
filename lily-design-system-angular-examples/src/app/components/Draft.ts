import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Draft component
 *
 * A wrapper that marks content as a draft. Renders a <div> with the `draft` hook; `status` is exposed
 * as data-status for the consumer's CSS (for example to show a watermark).
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   status — string, optional. Rendered as data-status; the vocabulary (for example "draft", "review") is the consumer's.
 *   <ng-content /> — projected content, required. The content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-draft label="…" status="draft">…</lily-draft>
 *
 * Examples:
 *   <lily-draft label="Draft policy" status="draft"><p>Text under review.</p></lily-draft>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <div> has no role; do not rely on the CSS watermark alone to say the content is a draft (WCAG 1.4.1), include visible text
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - `status` is a data attribute for the consumer, not an ARIA state
 *
 * References:
 *   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */
@Component({
    selector: "lily-draft",
    standalone: true,
    template: `<div class="draft {{ className() }}" [attr.aria-label]="label() || null" [attr.data-status]="status() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Draft {
    readonly label = input<string>("");
    readonly status = input<string>("");
    readonly className = input<string>("");
}
