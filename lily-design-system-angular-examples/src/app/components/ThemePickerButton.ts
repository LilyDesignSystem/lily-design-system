import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ThemePickerButton — a picker button for selecting a visual theme
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-theme-picker-button",
  standalone: true,
  template: `<button class="theme-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
