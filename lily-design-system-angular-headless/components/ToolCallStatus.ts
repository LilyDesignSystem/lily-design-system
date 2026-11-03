import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallStatus component
 *
 * The status of a tool call as a word (pending, running, done or error), shown in the ToolCall
 * summary. Renders a <span> with the `tool-call-status` hook; `status` is exposed as data-status for
 * the consumer's CSS.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   status — string, optional. Rendered as data-status, for example pending, running, done or error.
 *   <ng-content /> — projected content, optional. The visible status word.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tool-call-status status="running">…</lily-tool-call-status>
 *
 * Examples:
 *   <lily-tool-call-status status="running">Running</lily-tool-call-status>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - The visible word carries the meaning; never show the status by colour alone (WCAG 1.4.1)
 *   - No role or live region of its own
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - A part of ToolCall; carries no strings of its own
 *   - data-status is for the consumer's CSS, not an ARIA state
 *
 * References:
 *   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
 */
@Component({
    selector: "lily-tool-call-status",
    standalone: true,
    template: `<span class="tool-call-status {{ className() }}" [attr.data-status]="status() || null"><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCallStatus {
    /** Status: pending, running, done or error. */
    readonly status = input<string>("");
    readonly className = input<string>("");
}
