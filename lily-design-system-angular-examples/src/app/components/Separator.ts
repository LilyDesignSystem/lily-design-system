import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Separator component
 *
 * A headless visual and semantic divider that renders an <hr> element with
 * an explicit role="separator". Used between sections of a page, groups of
 * menu items, or distinct areas of a form to organize content into logical
 * groups and improve visual hierarchy.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, default undefined. Optional accessible label describing the separation.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-separator />
 *
 * Examples:
 *   <!-- Labeled separator between sections -->
 *   <lily-separator label="End of introduction" />
 *
 *   <!-- With custom data attribute -->
 *   <lily-separator label="Section break" data-section="divider" />
 *
 * Keyboard:
 *   - None — the <hr> element is not focusable and does not receive keyboard input.
 *
 * Accessibility:
 *   - role="separator" explicitly identifies the element as a section divider
 *   - aria-label provides optional descriptive context for screen readers
 *
 * Internationalization:
 *   - The optional label prop externalizes the separator description for localization
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - The <hr> is a void element — no children or closing tag
 *   - Label is optional; when undefined, aria-label is not rendered
 *
 * References:
 *   - WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
 *   - MDN hr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
 */
@Component({
    selector: "lily-separator",
    standalone: true,
    template: `<hr class="separator {{ className() }}" role="separator" [attr.aria-label]="label() || null" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Separator {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
