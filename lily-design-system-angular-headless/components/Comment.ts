import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Comment — a comment displays user discussions and user feedback
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `comment` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-comment",
  standalone: true,
  template: `<div class="comment {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comment {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
