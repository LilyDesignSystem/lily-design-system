import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Skeleton — a placeholder loading animation for content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `skeleton` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-skeleton",
  standalone: true,
  template: `<div class="skeleton {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
