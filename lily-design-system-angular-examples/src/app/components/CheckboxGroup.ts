import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CheckboxGroup — a group component that manages a collection of checkboxes with shared state
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `checkbox-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-checkbox-group",
  standalone: true,
  template: `<div class="checkbox-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
