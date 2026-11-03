import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BannerBox component
 *
 * A headless layout component designed to be placed inside a Banner component.
 * Renders a <div> that the consumer styles with flexbox horizontal layout
 * (display: flex; flex-direction: row) to arrange banner content items side by
 * side, such as a message and action buttons.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name via aria-label.
 *   <ng-content /> — projected content, required. The banner box content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-banner-box>content</lily-banner-box>
 *
 * Examples:
 *   <lily-banner>
 *     <lily-banner-box>
 *       <span>Important announcement</span>
 *       <button>Learn more</button>
 *     </lily-banner-box>
 *   </lily-banner>
 *
 * Keyboard:
 *   - None (passive layout element)
 *
 * Accessibility:
 *   - No additional ARIA required; parent Banner provides landmark and aria-live
 *   - Optional aria-label via label prop
 *
 * Internationalization:
 *   - All text comes through children; no hardcoded strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - Consumer applies display: flex; flex-direction: row; to .banner-box
 *
 * References:
 *   - CSS Flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
 */
@Component({
    selector: "lily-banner-box",
    standalone: true,
    template: `<div class="banner-box {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerBox {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
