import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertDiv component
 *
 * The root of a converter that turns a value in one unit into another, such as dollars into euros or
 * miles into kilometres. Renders a <div role="group"> with the `convert-div` hook holding a
 * ConvertFromDiv and a ConvertIntoDiv. It converts nothing; the consumer does the arithmetic and
 * supplies any rates.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name. Rendered as aria-label on the group.
 *   <ng-content /> — projected content, optional. The ConvertFromDiv and ConvertIntoDiv.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-convert-div label="…">…</lily-convert-div>
 *
 * Examples:
 *   <lily-convert-div label="Convert currency"><lily-convert-from-div>…</lily-convert-from-div><lily-convert-into-div>…</lily-convert-into-div></lily-convert-div>
 *
 * Keyboard:
 *   - None of its own; Tab moves between the controls inside
 *
 * Accessibility:
 *   - role="group" with the required aria-label names the converter
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Worldwide: no currency or unit is defaulted; the consumer supplies them
 *   - Carries no strings of its own
 *
 * References:
 *   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
 */
@Component({
    selector: "lily-convert-div",
    standalone: true,
    template: `<div class="convert-div {{ className() }}" role="group" [attr.aria-label]="label()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertDiv {
    readonly className = input<string>("");
    readonly label = input.required<string>();
}
