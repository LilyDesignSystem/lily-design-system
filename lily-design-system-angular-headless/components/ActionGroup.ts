import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ActionGroup — a group of action buttons that can collapse to an overflow menu when space is constrained
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `action-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-action-group",
  standalone: true,
  template: `<div class="action-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
