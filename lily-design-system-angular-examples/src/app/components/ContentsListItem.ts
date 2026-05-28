import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContentsListItem — one contents list item
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contents-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-contents-list-item",
  standalone: true,
  template: `<li class="contents-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsListItem {
  readonly className = input<string>("");
}
