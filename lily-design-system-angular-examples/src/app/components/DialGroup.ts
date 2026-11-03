import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DialGroup component
 *
 * A container that groups related dials (gauges or knobs). Renders a <div> with the `dial-group` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The dial components.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-dial-group label="…">…</lily-dial-group>
 *
 * Examples:
 *   <lily-dial-group>…</lily-dial-group>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <div> has no role; pass role="group" on the host element (Angular has no rest props) so the label is announced
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
 */
@Component({
    selector: "lily-dial-group",
    standalone: true,
    template: `<div class="dial-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialGroup {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
