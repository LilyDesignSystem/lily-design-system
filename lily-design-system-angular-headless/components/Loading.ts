import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Loading component
 *
 * An indicator that content is loading. Renders a <div> with the `loading` hook; the spinner or text
 * inside is the consumer's.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The visual indicator or text.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-loading label="…">…</lily-loading>
 *
 * Examples:
 *   <lily-loading label="Loading results"><span class="spinner" /></lily-loading>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - This component does not render role="status" or aria-live; pass role="status" on the host element (Angular has no rest props) so the change is announced politely
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
 */
@Component({
    selector: "lily-loading",
    standalone: true,
    template: `<div class="loading {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loading {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
