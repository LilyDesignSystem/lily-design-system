import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableRow — a data table interactive grid row for displaying and sorting tabular data <tr>
 *
 * Headless Angular component. Attribute selector on the native `<tr>` —
 * the consumer writes `<tr lily-data-table-row>`, so the host element IS the
 * `<tr>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `data-table-row` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tr[lily-data-table-row]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"data-table-row " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableRow {
  readonly className = input<string>("");
}
