import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableFoot — a table interactive grid tfoot <tfoot>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table-foot` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table-foot",
  standalone: true,
  template: `<tfoot class="table-foot {{ className() }}"><ng-content /></tfoot>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFoot {
  readonly className = input<string>("");
}
