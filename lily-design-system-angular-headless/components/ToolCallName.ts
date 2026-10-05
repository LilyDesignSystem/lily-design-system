import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallName — the name of the tool in a tool call, shown in the summary
 *
 * A headless inner part of ToolCall. Contract: a plain wrapper with the base class and children.
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
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
