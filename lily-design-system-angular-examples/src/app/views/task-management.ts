import { Component, ChangeDetectionStrategy } from "@angular/core";
import { TaskList } from "../components/TaskList";
import { TaskListItem } from "../components/TaskListItem";
import { Badge } from "../components/Badge";

@Component({
  selector: "lily-task-management",
  standalone: true,
  imports: [TaskList, TaskListItem, Badge],
  template: `
    <article class="page-wrapper">
      <h1>Task management</h1>

      <!-- Direct class-hook markup: the element-selector wrapper hosts
           break the ol>li structure axe requires; see timeline-and-cards. -->
      <ol class="task-list" aria-label="Today">
        <li class="task-list-item">Write spec <lily-badge>in progress</lily-badge></li>
        <li class="task-list-item">Review PR <lily-badge>pending</lily-badge></li>
        <li class="task-list-item">Deploy <lily-badge>done</lily-badge></li>
      </ol>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskManagementPage {

}
