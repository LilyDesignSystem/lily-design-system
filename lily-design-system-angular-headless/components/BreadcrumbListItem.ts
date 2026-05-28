import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbListItem — one breadcrumb list item in the trail
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `breadcrumb-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-breadcrumb-list-item",
  standalone: true,
  template: `<li class="breadcrumb-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbListItem {
  readonly className = input<string>("");
}
