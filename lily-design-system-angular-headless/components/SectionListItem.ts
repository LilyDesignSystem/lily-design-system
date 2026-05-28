import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionListItem — one section navigation item
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-section-list-item",
  standalone: true,
  template: `<li class="section-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionListItem {
  readonly className = input<string>("");
}
