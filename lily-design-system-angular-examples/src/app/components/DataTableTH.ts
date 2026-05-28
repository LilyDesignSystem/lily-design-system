import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableTH — a data table interactive grid header cell for displaying and sorting tabular data <th>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-th` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-th",
  standalone: true,
  template: `<th class="data-table-th {{ className() }}" [attr.scope]="scope() || null"><ng-content /></th>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
