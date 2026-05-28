import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableBody — a table interactive grid tbody <tbody>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-body` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-body",
  standalone: true,
  template: `<tbody class="table-body {{ className() }}"><ng-content /></tbody>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBody {
  readonly className = input<string>("");
}
