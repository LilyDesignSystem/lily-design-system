import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallOutput component
 *
 * The output or result returned by a tool in a ToolCall. Renders a <div> with the `tool-call-output`
 * hook; with a `label` it becomes a named group, without one it has no role.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name; when given, role="group" and aria-label are rendered, otherwise neither.
 *   <ng-content /> — projected content, optional. The content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tool-call-output label="…">…</lily-tool-call-output>
 *
 * Examples:
 *   <lily-tool-call status="done" open><lily-tool-call-output label="…"><pre>…</pre></lily-tool-call-output></lily-tool-call>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - role="group" and aria-label appear only when `label` is given
 *   - Large output can be scrolled; make a scrollable region keyboard-focusable on the host element (Angular has no rest props)
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - A part of ToolCall; draws nothing and carries no strings of its own
 *
 * References:
 *   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */
@Component({
    selector: "lily-tool-call-output",
    standalone: true,
    template: `<div class="tool-call-output {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCallOutput {
    /** Accessible name of the group. */
    readonly label = input<string>("");
    readonly className = input<string>("");
}
