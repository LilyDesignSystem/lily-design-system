import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RelatedContent component
 *
 * Links and notes related to the main content. Renders an <aside> with the `related-content` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The related links or notes.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-related-content label="…">…</lily-related-content>
 *
 * Examples:
 *   <lily-related-content label="Related content"><ul><li><a href="/more">More</a></li></ul></lily-related-content>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - The native <aside> element supplies the complementary landmark
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <aside>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
 */
@Component({
    selector: "lily-related-content",
    standalone: true,
    template: `<aside class="related-content {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedContent {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
