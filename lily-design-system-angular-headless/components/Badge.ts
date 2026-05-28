import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Badge — a small label for counts, statuses, or categories
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `badge` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-badge",
  standalone: true,
  template: `<div class="badge {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
