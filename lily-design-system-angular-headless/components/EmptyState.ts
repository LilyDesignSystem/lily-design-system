import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EmptyState component
 *
 * A headless container for the "nothing here yet" state of a list, table,
 * search or inbox. The consumer supplies the heading, explanation and action
 * as children; there is no icon and no default text.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. When given, the root becomes role="group" with this aria-label.
 *   children — content. Heading, text, action.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Keyboard:
 *   - None; any action inside is a native control
 *
 * Accessibility:
 *   - role="group" + aria-label only when label is supplied; otherwise a plain <div>
 *   - Not a live region: use InfoState (role="status") for announced states
 *
 * Claude rules:
 *   - Headless: no CSS, no icon, no hardcoded strings
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
