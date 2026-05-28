import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StatusTag — a tag showing the current status of a task
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `status-tag` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-status-tag",
  standalone: true,
  template: `<div class="status-tag {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTag {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
