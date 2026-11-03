import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallError component
 *
 * The error shown when a tool call fails. Renders a <div role="alert"> with the `tool-call-error`
 * hook, so the error is announced when it appears.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, optional. The error text.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tool-call-error>…</lily-tool-call-error>
 *
 * Examples:
 *   <lily-tool-call status="error" open><lily-tool-call-error>The tool timed out.</lily-tool-call-error></lily-tool-call>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - role="alert" announces the error assertively when it is inserted
 *   - Open the ToolCall on error so the alert is not inside a closed <details>, where it would not be announced
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - A part of ToolCall; carries no strings of its own
 *
 * References:
 *   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
 */
@Component({
    selector: "lily-tool-call-error",
    standalone: true,
    template: `<div class="tool-call-error {{ className() }}" role="alert"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCallError {
    readonly className = input<string>("");
}
