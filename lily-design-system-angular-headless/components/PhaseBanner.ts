import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PhaseBanner component
 *
 * A banner that states a service's phase (alpha or beta) and invites feedback. Renders a <div> with
 * the `phase-banner` hook around the consumer's tag and text.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The phase tag and message.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-phase-banner label="…">…</lily-phase-banner>
 *
 * Examples:
 *   <lily-phase-banner label="Service phase"><strong>Beta</strong> This is a new service.</lily-phase-banner>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <div> has no role; pass role="region" or "group" on the host element (Angular has no rest props) so the label is announced
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - NHS UK design system: https://service-manual.nhs.uk/design-system
 */
@Component({
    selector: "lily-phase-banner",
    standalone: true,
    template: `<div class="phase-banner {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBanner {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
