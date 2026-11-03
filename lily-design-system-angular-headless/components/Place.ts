import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Place component
 *
 * A schema.org-style place. Renders an <article> with the `place` hook around the consumer's name and
 * address.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The place details.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-place label="…">…</lily-place>
 *
 * Examples:
 *   <lily-place label="Town hall"><h3>Town hall</h3></lily-place>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - The native <article> element supplies the article role
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
 *   - schema.org Place: https://schema.org/Place
 */
@Component({
    selector: "lily-place",
    standalone: true,
    template: `<article class="place {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Place {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
