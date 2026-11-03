import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Person component
 *
 * A schema.org-style person. Renders an <article> with the `person` hook around the consumer's name,
 * role and contact details.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The person details.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-person label="…">…</lily-person>
 *
 * Examples:
 *   <lily-person label="Sam Lee"><h3>Sam Lee</h3></lily-person>
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
 *   - schema.org Person: https://schema.org/Person
 */
@Component({
    selector: "lily-person",
    standalone: true,
    template: `<article class="person {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Person {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
