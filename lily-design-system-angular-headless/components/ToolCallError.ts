import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallError — the error shown when a tool call fails
 *
 * A headless inner part of ToolCall. Contract: `role="alert"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`).
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
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
