import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tag — a keyword label for categorizing content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tag` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tag",
  standalone: true,
  template: `<div class="tag {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tag {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
