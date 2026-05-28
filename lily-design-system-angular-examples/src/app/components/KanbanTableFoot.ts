import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableFoot — a kanban board table interactive grid tfoot for organizing items by status <tfoot>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table-foot` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table-foot",
  standalone: true,
  template: `<tfoot class="kanban-table-foot {{ className() }}"><ng-content /></tfoot>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableFoot {
  readonly className = input<string>("");
}
