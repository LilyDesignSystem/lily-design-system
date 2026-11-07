import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarGroup component
 *
 * A container that groups several avatars. It renders the `avatar-group` hook around its children in
 * source order; overlap, spacing and truncation are the consumer's CSS.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name for the group, rendered as aria-label.
 *   <ng-content /> — projected content, required. The avatar components.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-avatar-group label="…"><lily-avatar>…</lily-avatar><lily-avatar>…</lily-avatar></lily-avatar-group>
 *
 * Examples:
 *   <lily-avatar-group label="Reviewers"><lily-avatar><lily-avatar-text>AB</lily-avatar-text></lily-avatar><lily-avatar><lily-avatar-text>CD</lily-avatar-text></lily-avatar></lily-avatar-group>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - This component does not render role="group"; pass role="group" on the host element (Angular has no rest props) so the label is announced
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Order is source order; the component does not truncate or count overflow
 *
 * References:
 *   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
 */
@Component({
    selector: "lily-avatar-group",
    standalone: true,
    template: `<div class="avatar-group {{ className() }}" role="group" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroup {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
