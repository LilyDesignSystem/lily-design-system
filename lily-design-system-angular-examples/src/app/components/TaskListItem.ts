import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TaskListItem — one task item with a checkbox and label
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-task-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `task-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-task-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"task-list-item " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListItem {
  readonly className = input<string>("");
}
