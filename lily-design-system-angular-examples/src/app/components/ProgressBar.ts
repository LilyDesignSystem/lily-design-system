import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProgressBar — a horizontal progress indicator
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-progress-bar",
  standalone: true,
  template: `<div class="progress-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
