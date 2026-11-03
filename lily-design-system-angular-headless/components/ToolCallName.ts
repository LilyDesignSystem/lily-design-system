import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallName component
 *
 * The name of the tool in a ToolCall, shown in its summary. Renders a <span> with the `tool-call-name`
 * hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, optional. The tool name.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tool-call-name>…</lily-tool-call-name>
 *
 * Examples:
 *   <lily-tool-call status="running"><lily-tool-call-name>search_web</lily-tool-call-name></lily-tool-call>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - No role or ARIA: plain text inside the ToolCall summary
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - A part of ToolCall; draws nothing and carries no strings of its own
 *
 * References:
 *   - MDN <span>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
 */
@Component({
    selector: "lily-tool-call-name",
    standalone: true,
    template: `<span class="tool-call-name {{ className() }}" ><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCallName {
    readonly className = input<string>("");
}
