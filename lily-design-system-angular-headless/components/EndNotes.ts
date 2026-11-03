import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EndNotes component
 *
 * The notes section at the end of an article. Renders a <section> with the `end-notes` hook, named by
 * `label`.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, default "End notes". Accessible name, rendered as aria-label on the section.
 *   <ng-content /> — projected content, required. The content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-end-notes label="…">…</lily-end-notes>
 *
 * Examples:
 *   <lily-end-notes label="Notes"><ol><li>First note.</li></ol></lily-end-notes>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - A <section> with an accessible name is exposed as a region landmark
 *
 * Internationalization:
 *   - The default label "End notes" is English text inside the component; always pass a translated `label` (tracked as a defect against the no-hardcoded-strings rule)
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Always pass `label`, so the English default is never used
 *
 * References:
 *   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
 */
@Component({
    selector: "lily-end-notes",
    standalone: true,
    template: `<section class="end-notes {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></section>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndNotes {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
