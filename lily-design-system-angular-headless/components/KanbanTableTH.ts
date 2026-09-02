import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTableTH — a kanban board table interactive grid header cell for organizing items by status <th>
 *
 * Headless Angular component. Attribute selector on the native `<th>` —
 * the consumer writes `<th lily-kanban-table-th>`, so the host element IS the
 * `<th>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `kanban-table-th` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "th[lily-kanban-table-th]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"kanban-table-th " + className()',
    "[attr.scope]": "scope() || null",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTableTH {
  readonly scope = input<string>("");
  readonly className = input<string>("");
}
