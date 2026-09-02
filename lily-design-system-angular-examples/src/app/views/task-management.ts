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

      <lily-task-list label="Today">
        <li lily-task-list-item>Write spec <lily-badge>in progress</lily-badge></li>
        <li lily-task-list-item>Review PR <lily-badge>pending</lily-badge></li>
        <li lily-task-list-item>Deploy <lily-badge>done</lily-badge></li>
      </lily-task-list>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskManagementPage {

}
