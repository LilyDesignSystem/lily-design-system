import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableBody — a data table interactive grid tbody for displaying and sorting tabular data <tbody>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-body` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-body",
  standalone: true,
  template: `<tbody class="data-table-body {{ className() }}"><ng-content /></tbody>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableBody {
  readonly className = input<string>("");
}
