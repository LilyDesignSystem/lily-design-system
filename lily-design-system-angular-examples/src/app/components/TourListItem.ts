import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TourListItem — one step in a tour guide list
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-tour-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `tour-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-tour-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"tour-list-item " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourListItem {
  readonly className = input<string>("");
}
