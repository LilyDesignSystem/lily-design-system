import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Answer component
 *
 * The answer half of a question-and-answer pair. A container with an optional accessible name; pair it
 * with the `question` component.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The answer content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-answer label="…">…</lily-answer>
 *
 * Examples:
 *   <lily-question>What is a design system?</lily-question>
 *   <lily-answer><p>A shared set of rules and components.</p></lily-answer>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given; use it when no visible heading names the answer
 *   - A <div> has no role, so add one on the host element (Angular has no rest props) if the label must be announced
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Pairs with Question; the pairing is by position in the page, not by ids
 *
 * References:
 *   - MDN aria-label: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
 */
@Component({
    selector: "lily-answer",
    standalone: true,
    template: `<div class="answer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Answer {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
