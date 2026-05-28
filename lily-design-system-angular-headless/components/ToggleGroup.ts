import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ToggleGroup — a group of toggle buttons for selecting options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `toggle-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-toggle-group",
  standalone: true,
  template: `<div class="toggle-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
