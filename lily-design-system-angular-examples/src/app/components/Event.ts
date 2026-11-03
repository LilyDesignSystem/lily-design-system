import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Event component
 *
 * A schema.org-style event (a meeting, appointment or occasion). Renders an <article> with the `event`
 * hook around the consumer's name, date and place.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The event details.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-event label="…">…</lily-event>
 *
 * Examples:
 *   <lily-event label="Annual meeting"><h3>Annual meeting</h3><time datetime="2026-12-01">1 December 2026</time></lily-event>
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
 *   - schema.org Event: https://schema.org/Event
 */
@Component({
    selector: "lily-event",
    standalone: true,
    template: `<article class="event {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Event {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
