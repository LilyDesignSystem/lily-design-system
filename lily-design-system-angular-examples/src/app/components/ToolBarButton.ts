import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToolBarButton — one action button in a tool bar
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tool-bar-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tool-bar-button",
  standalone: true,
  template: `<button class="tool-bar-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBarButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
