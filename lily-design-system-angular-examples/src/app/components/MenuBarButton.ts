import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuBarButton — one item in a menu bar
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu-bar-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu-bar-button",
  standalone: true,
  template: `<button class="menu-bar-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
