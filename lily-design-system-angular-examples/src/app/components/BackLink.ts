import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BackLink component
 *
 * A headless navigation link for returning to a previous page or step.
 * Renders as a semantic <a> element with optional aria-label override.
 * Inspired by the GOV.UK back link pattern. Commonly placed at the top of
 * a page to let users return to the previous step in a multi-step flow,
 * or navigate up to a parent page.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   href     — string, required. The URL to navigate back to.
 *   label    — string, optional. Accessible label override via aria-label,
 *              for when visible link text is insufficient for screen readers.
 *   <ng-content /> — projected content, required. The link content (text or mixed content).
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-back-link href="/previous">Back</lily-back-link>
 *
 * Examples:
 *   <!-- Basic back link -->
 *   <lily-back-link href="/previous-page">Back to previous page</lily-back-link>
 *
 *   <!-- With accessible label override -->
 *   <lily-back-link href="/dashboard" label="Return to dashboard">Back</lily-back-link>
 *
 *   <!-- In a multi-step form -->
 *   <lily-back-link href="/step-2" data-step="3">Go back</lily-back-link>
 *
 * Keyboard:
 *   - Tab: Focus the link (native browser behavior)
 *   - Enter: Activate the link (native browser behavior)
 *
 * Accessibility:
 *   - Implicit link role from the <a> element
 *   - aria-label provides screen reader override when visible text is brief
 *   - Place at the top of the page, before the main heading
 *
 * Internationalization:
 *   - Link text comes through children snippet
 *   - Label override comes through label prop
 *   - No hardcoded strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Consumer adds back arrow icon or visual indicator
 *   - Always require href; do not use <a> without href
 *
 * References:
 *   - GOV.UK back link pattern: https://design-system.service.gov.uk/components/back-link/
 */
@Component({
    selector: "lily-back-link",
    standalone: true,
    template: `<a class="back-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLink {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
}
