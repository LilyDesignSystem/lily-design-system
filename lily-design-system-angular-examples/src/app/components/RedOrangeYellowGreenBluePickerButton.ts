import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RedOrangeYellowGreenBluePickerButton — a picker button for selecting a five-level color status
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-orange-yellow-green-blue-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-red-orange-yellow-green-blue-picker-button",
  standalone: true,
  template: `<button class="red-orange-yellow-green-blue-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedOrangeYellowGreenBluePickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
