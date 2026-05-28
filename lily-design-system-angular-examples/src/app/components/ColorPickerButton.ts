import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ColorPickerButton — a button showing a color swatch in a color picker
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `color-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-color-picker-button",
  standalone: true,
  template: `<button class="color-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
