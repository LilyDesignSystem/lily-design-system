import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Question component
 *
 * The question half of a question-and-answer pair; pair it with `answer`. Renders a <div> with the
 * `question` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The question text.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-question label="…">…</lily-question>
 *
 * Examples:
 *   <lily-question>What is a design system?</lily-question>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */
@Component({
    selector: "lily-question",
    standalone: true,
    template: `<div class="question {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Question {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
