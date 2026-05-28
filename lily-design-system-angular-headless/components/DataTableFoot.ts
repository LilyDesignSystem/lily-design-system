import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableFoot — a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-foot` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-foot",
  standalone: true,
  template: `<tfoot class="data-table-foot {{ className() }}"><ng-content /></tfoot>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFoot {
  readonly className = input<string>("");
}
