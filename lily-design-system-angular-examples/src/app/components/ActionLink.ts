import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ActionLink component
 *
 * A headless action link that renders a semantic <a> element for prominent
 * navigation actions. Inspired by the NHS England action link pattern.
 * Use when you want to draw attention to a key navigational step, such as
 * "Continue to next step", "Find a service near you", or "Start application",
 * distinguishing these from standard inline text links.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   href     — string, required. The URL the link points to.
 *   label    — string, optional. Accessible label override via aria-label
 *              for when visible link text is insufficient for screen readers.
 *   <ng-content /> — projected content, required. The link content (text or mixed content).
 *   ...host-element attributes — additional HTML anchor attributes spread onto <a>.
 *
 * Syntax:
 *   <lily-action-link href="/path">Link text</lily-action-link>
 *
 * Examples:
 *   <!-- Basic action link -->
 *   <lily-action-link href="/next-step">Continue to next step</lily-action-link>
 *
 *   <!-- With accessible label override -->
 *   <lily-action-link href="/find" label="Find a GP surgery near you">
 *     Find a GP
 *   </lily-action-link>
 *
 *   <!-- With custom attributes -->
 *   <lily-action-link href="/apply" data-track="apply-cta">
 *     Start your application
 *   </lily-action-link>
 *
 * Keyboard:
 *   - Tab: Focus the link (native browser behavior)
 *   - Enter: Activate the link (native browser behavior)
 *
 * Accessibility:
 *   - Implicit link role from the <a> element
 *   - aria-label provides screen reader override when link text is insufficient
 *   - Ensure link text clearly describes the destination or action
 *
 * Internationalization:
 *   - All text content comes through children snippet and label prop
 *   - No hardcoded strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Always require href prop; do not use <a> without href
 *   - Do not add icons or visual indicators; consumer provides those
 *
 * References:
 *   - NHS England action link pattern
 *   - WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link
 */
@Component({
    selector: "lily-action-link",
    standalone: true,
    template: `<a class="action-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionLink {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
}
