import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableRow — a data table interactive grid row for displaying and sorting tabular data <tr>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-row` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-row",
  standalone: true,
  template: `<tr class="data-table-row {{ className() }}"><ng-content /></tr>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableRow {
  readonly className = input<string>("");
}
