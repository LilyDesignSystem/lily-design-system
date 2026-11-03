import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Picture component
 *
 * A wrapper around the native <picture> element: the browser chooses among the source children (by
 * media query, image type or resolution) and falls back to the img child. Renders a <picture> with the
 * `picture` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, optional. The <source> elements, then one <img> with its alt, width and height.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-picture><source … /><img … /></lily-picture>
 *
 * Examples:
 *   <lily-picture><source srcset="wide.avif" media="(min-width: 48rem)" type="image/avif" /><img src="narrow.jpg" alt="Description" width="640" height="360" /></lily-picture>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - The text alternative is the child <img>'s alt, which the consumer must supply
 *   - Give the <img> width and height so the layout does not shift
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Draws nothing and carries no strings of its own; ships no images
 *
 * References:
 *   - MDN <picture>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
 */
@Component({
    selector: "lily-picture",
    standalone: true,
    template: `<picture class="picture {{ className() }}" ><ng-content /></picture>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Picture {
    readonly className = input<string>("");
}
