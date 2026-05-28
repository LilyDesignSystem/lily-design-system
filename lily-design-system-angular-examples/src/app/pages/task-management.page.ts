import { Component, ChangeDetectionStrategy } from "@angular/core";
import { TaskList, TaskListItem, Badge } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-task-management",
  standalone: true,
  imports: [TaskList, TaskListItem, Badge],
  template: `
    <article class="page-wrapper">
      <h1>Task management</h1>

      <lily-task-list label="Today">
        <lily-task-list-item>Write spec <lily-badge>in progress</lily-badge></lily-task-list-item>
        <lily-task-list-item>Review PR <lily-badge>pending</lily-badge></lily-task-list-item>
        <lily-task-list-item>Deploy <lily-badge>done</lily-badge></lily-task-list-item>
      </lily-task-list>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskManagementPage {

}
