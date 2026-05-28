import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RedAmberGreenPickerButton — a picker button for selecting a red/amber/green status
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-amber-green-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-red-amber-green-picker-button",
  standalone: true,
  template: `<button class="red-amber-green-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedAmberGreenPickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
