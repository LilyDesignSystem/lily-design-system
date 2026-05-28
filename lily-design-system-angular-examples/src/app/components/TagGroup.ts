import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TagGroup — a group of tag elements
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tag-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tag-group",
  standalone: true,
  template: `<div class="tag-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
