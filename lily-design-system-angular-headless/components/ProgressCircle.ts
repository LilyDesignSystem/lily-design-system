import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ProgressCircle — a circular progress indicator
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress-circle` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-progress-circle",
  standalone: true,
  template: `<div class="progress-circle {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCircle {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
