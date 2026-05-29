import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * ThemeSelect — a select dropdown for choosing a theme
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `theme-select` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-theme-select",
  standalone: true,
  template: `<select class="theme-select {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" (change)="value.set($any($event.target).value)"><ng-content /></select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelect {
  readonly label = input<string>("");
  readonly className = input<string>("");
  readonly value = model<string>("");
}
