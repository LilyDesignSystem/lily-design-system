import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SwitchButton — a toggle switch for turning a setting on or off
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `switch-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-switch-button",
  standalone: true,
  template: `<button class="switch-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
