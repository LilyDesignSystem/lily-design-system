import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableRow — a table interactive grid row <tr>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-row` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-row",
  standalone: true,
  template: `<tr class="table-row {{ className() }}"><ng-content /></tr>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRow {
  readonly className = input<string>("");
}
