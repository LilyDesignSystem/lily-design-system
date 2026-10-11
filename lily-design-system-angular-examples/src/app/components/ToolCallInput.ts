import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolCallInput — the input or arguments passed to a tool in a tool call
 *
 * A headless inner part of ToolCall. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-tool-call-input",
  standalone: true,
  template: `<div class="tool-call-input {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCallInput {
  /** Accessible name of the group. */
  readonly label = input<string>("");
  readonly className = input<string>("");
}
