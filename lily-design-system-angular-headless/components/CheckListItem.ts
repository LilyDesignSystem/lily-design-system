import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CheckListItem — one check list item component with a checkbox
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `check-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-check-list-item",
  standalone: true,
  template: `<li class="check-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckListItem {
  readonly className = input<string>("");
}
