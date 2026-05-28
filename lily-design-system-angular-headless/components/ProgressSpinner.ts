import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProgressSpinner — an indeterminate spinning progress indicator
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress-spinner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-progress-spinner",
  standalone: true,
  template: `<div class="progress-spinner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
