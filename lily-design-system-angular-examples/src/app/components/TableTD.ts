import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableTD — a table interactive grid data cell <td>
 *
 * Headless Angular component. Attribute selector on the native `<td>` —
 * the consumer writes `<td lily-table-td>`, so the host element IS the
 * `<td>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `table-td` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "td[lily-table-td]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"table-td " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTD {
  readonly className = input<string>("");
}
