import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ErrorMessage — an error message associated with a form field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `error-message` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-error-message",
  standalone: true,
  template: `<div class="error-message {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessage {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
