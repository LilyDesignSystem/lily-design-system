import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TaskListItem — one task item with a checkbox and label
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `task-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-task-list-item",
  standalone: true,
  template: `<li class="task-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItem {
  readonly className = input<string>("");
}
