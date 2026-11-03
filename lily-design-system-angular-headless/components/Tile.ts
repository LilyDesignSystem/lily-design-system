import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tile component
 *
 * A tile in a grid of tiles. Renders a <div> with the `tile` hook around the consumer's content.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The tile content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tile label="…">…</lily-tile>
 *
 * Examples:
 *   <lily-tile>…</lily-tile>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - A <div> has no role; pass role="group" on the host element (Angular has no rest props) so the label is announced
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
    selector: "lily-tile",
    standalone: true,
    template: `<div class="tile {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
