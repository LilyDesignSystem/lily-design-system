import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ThemeProvider — a container that applies CSS custom properties from a theme object to its children
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-provider` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-theme-provider",
  standalone: true,
  template: `<div class="theme-provider {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProvider {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
