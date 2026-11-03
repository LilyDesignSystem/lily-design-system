import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Citation component
 *
 * Marks the title of a cited work or the name of a source. Renders a <cite> with the `citation` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The cited title or source name.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-citation label="…">…</lily-citation>
 *
 * Examples:
 *   <lily-citation>The Design of Everyday Things</lily-citation>
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
 *   - MDN <cite>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite
 */
@Component({
    selector: "lily-citation",
    standalone: true,
    template: `<cite class="citation {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></cite>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Citation {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
