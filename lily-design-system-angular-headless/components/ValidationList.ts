import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ValidationList — a live-feedback list of input validation rules with pending, passed, and failed states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `validation-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-validation-list",
  standalone: true,
  template: `<ol class="validation-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
