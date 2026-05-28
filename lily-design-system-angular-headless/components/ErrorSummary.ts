import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ErrorSummary — a summary of all validation errors on a form
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `error-summary` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-error-summary",
  standalone: true,
  template: `<div class="error-summary {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorSummary {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
