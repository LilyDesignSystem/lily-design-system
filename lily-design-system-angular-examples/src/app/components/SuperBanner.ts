import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SuperBanner component
 *
 * A banner for the most important site-wide message. Renders a <div> with the `super-banner` hook
 * around the consumer's text.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The banner message.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-super-banner label="…">…</lily-super-banner>
 *
 * Examples:
 *   <lily-super-banner label="Service notice">The service is closed on Monday.</lily-super-banner>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - This component does not render role="alert"; pass role="alert" on the host element (Angular has no rest props) only for an interruption the user must hear, as the accessibility rules reserve live regions for such content
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
 */
@Component({
    selector: "lily-super-banner",
    standalone: true,
    template: `<div class="super-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperBanner {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
