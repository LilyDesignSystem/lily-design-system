import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertIntoUnitDiv component
 *
 * The unit to convert into, such as a select box of currencies or lengths. Converts nothing; the
 * consumer does the arithmetic and supplies the controls and any rates.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, optional. The unit control.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-convert-into-unit-div>…</lily-convert-into-unit-div>
 *
 * Examples:
 *   <lily-convert-div label="Convert currency"><lily-convert-from-div>…</lily-convert-from-div><lily-convert-into-div>…</lily-convert-into-div></lily-convert-div>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - No role or ARIA of its own; the labelled group is the ConvertDiv root
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - A part of ConvertDiv; draws nothing and carries no strings of its own
 *
 * References:
 *   - MDN <div>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
 */
@Component({
    selector: "lily-convert-into-unit-div",
    standalone: true,
    template: `<div class="convert-into-unit-div {{ className() }}"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertIntoUnitDiv {
    readonly className = input<string>("");
}
