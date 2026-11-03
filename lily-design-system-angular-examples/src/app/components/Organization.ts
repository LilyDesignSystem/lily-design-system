import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Organization component
 *
 * A schema.org-style organisation (a company, charity or public body). Renders an <article> with the
 * `organization` hook around the consumer's details.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The organisation details.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-organization label="…">…</lily-organization>
 *
 * Examples:
 *   <lily-organization label="Example Organisation"><h3>Example Organisation</h3></lily-organization>
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
 *   - schema.org Organization: https://schema.org/Organization
 */
@Component({
    selector: "lily-organization",
    standalone: true,
    template: `<article class="organization {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Organization {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
