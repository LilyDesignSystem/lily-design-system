import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AddressographBox component
 *
 * A labelled box holding the identifying details of a patient or record (name, date of birth,
 * identifier, ward or location, salient notations), as on a hospital addressograph label. It supplies
 * the box only; the consumer supplies every field.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The identifying content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-addressograph-box label="…">…</lily-addressograph-box>
 *
 * Examples:
 *   <lily-addressograph-box label="Patient identification"><p>Name</p><p>Date of birth</p></lily-addressograph-box>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given, naming the box for assistive technology
 *   - With a label the root is role="group", because a plain <div> cannot be named
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Show a national identifier with its `-view` component, not as bare text
 *
 * References:
 *   - MDN aria-label: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
 */
@Component({
    selector: "lily-addressograph-box",
    standalone: true,
    template: `<div class="addressograph-box {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressographBox {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
