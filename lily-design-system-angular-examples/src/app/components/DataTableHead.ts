import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableHead — a data table interactive grid thead for displaying and sorting tabular data <thead>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table-head` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table-head",
  standalone: true,
  template: `<thead class="data-table-head {{ className() }}"><ng-content /></thead>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableHead {
  readonly className = input<string>("");
}
