import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ColorPicker — a two-dimensional board for picking colors by hue and saturation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `color-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-color-picker",
  standalone: true,
  template: `<div class="color-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
