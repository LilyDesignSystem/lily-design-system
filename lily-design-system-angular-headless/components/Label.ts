import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Label component
 *
 * A headless <label> element that provides a descriptive name or instruction
 * for an associated form control such as an input field, checkbox, or radio
 * button. When a user clicks the label text, the browser focuses or activates
 * the linked form control. Screen readers announce the label when the
 * associated control receives focus.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   for — string, optional. The id of the associated form control (HTML for attribute).
 *   <ng-content /> — projected content, required. The label text content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-label for="email">Email address</lily-label>
 *
 * Examples:
 *   <!-- Label linked to a form control by ID -->
 *   <lily-label for="email">Email address</lily-label>
 *   <input id="email" type="email" />
 *
 *   <!-- Label wrapping a form control (no for attribute needed) -->
 *   <lily-label>
 *     Email address
 *     <input type="email" />
 *   </lily-label>
 *
 * Keyboard:
 *   - None — clicking the label focuses or activates its associated form
 *     control via native browser behavior.
 *
 * Accessibility:
 *   - Native <label> element with for attribute provides an implicit accessible
 *     name for the linked form control
 *   - No additional ARIA attributes needed; semantic HTML <label> is fully
 *     recognized by assistive technology
 *
 * Internationalization:
 *   - All text content comes through the children snippet
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - The for prop is mapped from the reserved keyword via for: forProp
 *
 * References:
 *   - WAI Forms Tutorial - Labels: https://www.w3.org/WAI/tutorials/forms/labels/
 *   - HTML label element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
 */
@Component({
    selector: "lily-label",
    standalone: true,
    template: `<label class="label {{ className() }}" [attr.for]="for() || null"><ng-content /></label>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Label {
    /** The id of the control this label names. */
    readonly for = input<string>("");
    readonly className = input<string>("");
}
