import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * ToolCall — a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error
 *
 * A headless disclosure for one tool invocation, built on the native <details>. Closed by default. The `summary` content (typically ToolCallName and ToolCallStatus) goes inside <summary class="tool-call-summary">; the body (ToolCallInput, ToolCallOutput, ToolCallError) goes inside <div class="tool-call-content">. `status` (pending | running | done | error) sets data-status on the root, and aria-busy="true" only while running. The component never animates, times or opens itself: the consumer owns `open` (open it on error so ToolCallError is not hidden) and any spinner/animation CSS.
 * Angular: put the summary content on elements carrying the `toolCallSummary`
 * attribute (for example `<lily-tool-call-name toolCallSummary>`); everything
 * else is the body. `open` is a model(); `status` an input(). No rest-props
 * spread (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-tool-call",
  standalone: true,
  template: `<details
    class="tool-call {{ className() }}"
    [open]="open()"
    [attr.data-status]="status() || null"
    [attr.aria-busy]="status() === 'running' ? 'true' : null"
    (toggle)="open.set($any($event.target).open)"
  ><summary class="tool-call-summary"><ng-content select="[toolCallSummary]" /></summary><div class="tool-call-content"><ng-content /></div></details>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCall {
  /** pending | running | done | error. */
  readonly status = input<string>("");
  readonly className = input<string>("");
  /** Whether the details is open. Bindable. */
  readonly open = model<boolean>(false);
}
