import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableTD — a table interactive grid data cell <td>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-td` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-td",
  standalone: true,
  template: `<td class="table-td {{ className() }}"><ng-content /></td>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTD {
  readonly className = input<string>("");
}
