import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ActionBar — a contextual action bar that appears when items are selected, showing the selection count and bulk action buttons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `action-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-action-bar",
  standalone: true,
  template: `<div class="action-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
