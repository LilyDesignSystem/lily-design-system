import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ThemeSelect — a picker for selecting a visual theme
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-select` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-theme-select",
  standalone: true,
  template: `<div class="theme-select {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelect {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
