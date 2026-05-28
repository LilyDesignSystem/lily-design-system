import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KanbanTable — a kanban board table interactive grid for organizing items by status <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kanban-table",
  standalone: true,
  template: `<table class="kanban-table {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTable {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
