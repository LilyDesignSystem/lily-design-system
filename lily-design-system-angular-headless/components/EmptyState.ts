import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EmptyState — a placeholder shown when a list, table, or view has nothing to display yet, with room for guidance and an action
 *
 * Headless Angular component. Root `<div class="empty-state">`; when the
 * optional `label` is given it becomes `role="group"` with that aria-label.
 * Children (heading, text, action) are consumer-supplied. Not a live region.
 * Ships zero CSS.
 */
@Component({
  selector: "lily-empty-state",
  standalone: true,
  template: `<div
    class="empty-state {{ className() }}"
    [attr.role]="label() ? 'group' : null"
    [attr.aria-label]="label() || null"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  /** Optional accessible name; when set the root is a labelled group. */
  readonly label = input<string>("");
  readonly className = input<string>("");
}
