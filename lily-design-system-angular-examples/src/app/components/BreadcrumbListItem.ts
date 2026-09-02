import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbListItem — one breadcrumb list item in the trail
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-breadcrumb-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `breadcrumb-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-breadcrumb-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"breadcrumb-list-item " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbListItem {
  readonly className = input<string>("");
}
