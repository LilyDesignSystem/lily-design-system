import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToggleButton — a button that toggles between pressed and unpressed states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `toggle-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-toggle-button",
  standalone: true,
  template: `<button class="toggle-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
