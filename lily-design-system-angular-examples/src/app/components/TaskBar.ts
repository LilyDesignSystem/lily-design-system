import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TaskBar — a horizontal bar of task shortcuts or actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `task-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-task-bar",
  standalone: true,
  template: `<div class="task-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
