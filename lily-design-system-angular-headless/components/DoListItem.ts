import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DoListItem — an encouraged-practice item in a do-list guideline list
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-do-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `do-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-do-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"do-list-item " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoListItem {
  readonly className = input<string>("");
}
