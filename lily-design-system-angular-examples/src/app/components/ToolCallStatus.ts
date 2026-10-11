import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallStatus — the status of a tool call as a word, such as pending, running, done or error
 *
 * A headless inner part of ToolCall. Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone).
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
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
