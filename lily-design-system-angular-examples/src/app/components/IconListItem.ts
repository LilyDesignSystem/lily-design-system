import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IconListItem — one item in an icon list with a leading icon slot
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `icon-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-icon-list-item",
  standalone: true,
  template: `<li class="icon-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconListItem {
  readonly className = input<string>("");
}
