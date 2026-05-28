import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TaskList — an ordered list of task list items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `task-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-task-list",
  standalone: true,
  template: `<ol class="task-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
