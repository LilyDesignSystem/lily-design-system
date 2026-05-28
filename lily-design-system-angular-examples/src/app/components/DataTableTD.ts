import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableTD — a data table interactive grid data cell for displaying and sorting tabular data <td>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-td` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-td",
  standalone: true,
  template: `<td class="data-table-td {{ className() }}"><ng-content /></td>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableTD {
  readonly className = input<string>("");
}
