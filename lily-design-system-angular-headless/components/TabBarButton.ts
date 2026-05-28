import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TabBarButton — one tab button in a tab group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tab-bar-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tab-bar-button",
  standalone: true,
  template: `<button class="tab-bar-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
