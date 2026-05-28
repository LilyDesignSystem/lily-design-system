import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolBar — a horizontal bar of tool actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tool-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tool-bar",
  standalone: true,
  template: `<div class="tool-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
