import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Form — a form element for collecting and submitting user data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `form` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-form",
  standalone: true,
  template: `<div class="form {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
