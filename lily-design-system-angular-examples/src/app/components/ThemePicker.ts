import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ThemePicker — a picker for selecting a visual theme
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-theme-picker",
  standalone: true,
  template: `<div class="theme-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
