import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Hero component
 *
 * A prominent introductory banner at the top of a page or section. Renders a <section> with the `hero`
 * hook around the consumer's headline, text and media.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The hero content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-hero label="…">…</lily-hero>
 *
 * Examples:
 *   <lily-hero label="Welcome"><h1>Welcome</h1></lily-hero>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <section> with an accessible name is exposed as a region landmark
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
 */
@Component({
    selector: "lily-hero",
    standalone: true,
    template: `<section class="hero {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></section>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
