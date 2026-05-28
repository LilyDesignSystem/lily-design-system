import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableHead — a table interactive grid thead <thead>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-head` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-head",
  standalone: true,
  template: `<thead class="table-head {{ className() }}"><ng-content /></thead>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHead {
  readonly className = input<string>("");
}
