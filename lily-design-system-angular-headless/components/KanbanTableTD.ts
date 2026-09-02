import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableTD — kanban board table interactive grid data cell for organizing items by status <td>
 *
 * Headless Angular component. Attribute selector on the native `<td>` —
 * the consumer writes `<td lily-kanban-table-td>`, so the host element IS the
 * `<td>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `kanban-table-td` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "td[lily-kanban-table-td]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"kanban-table-td " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableTD {
  readonly className = input<string>("");
}
