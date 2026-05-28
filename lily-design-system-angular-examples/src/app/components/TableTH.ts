import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableTH — a table interactive grid header cell <th>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-th` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-th",
  standalone: true,
  template: `<th class="table-th {{ className() }}" [attr.scope]="scope() || null"><ng-content /></th>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
