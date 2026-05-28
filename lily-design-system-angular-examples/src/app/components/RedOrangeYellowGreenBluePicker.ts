import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RedOrangeYellowGreenBluePicker — a picker for selecting a five-level color status
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-orange-yellow-green-blue-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-red-orange-yellow-green-blue-picker",
  standalone: true,
  template: `<div class="red-orange-yellow-green-blue-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedOrangeYellowGreenBluePicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
