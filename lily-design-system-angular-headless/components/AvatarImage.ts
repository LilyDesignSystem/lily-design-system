import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarImage component
 *
 * The image element within an Avatar. Renders a native <img> element
 * for displaying a user's profile photo. Must be used inside an Avatar
 * container.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   src — string, required. URL of the avatar image.
 *   alt — string, required. Accessible description for the image.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-avatar-image src="/photo.jpg" alt="Jane Doe" />
 *
 * Examples:
 *   <!-- Photo avatar inside Avatar -->
 *   <lily-avatar alt="Jane Doe">
 *     <lily-avatar-image src="/photos/jane.jpg" alt="Jane Doe" />
 *   </lily-avatar>
 *
 * Keyboard: None — display-only element.
 *
 * Accessibility:
 *   - Native <img> with alt text provides image accessibility
 *   - aria-hidden="true" prevents duplicate announcements since the
 *     parent Avatar already has aria-label
 *
 * Internationalization:
 *   - alt text comes through props
 *   - No hardcoded strings
 *
 * Claude rules:
 *   - Compound component — must be used inside an Avatar
 *   - Headless: no CSS, no styles — consumer provides all styling
 *
 * References:
 *   - HTML img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
 */
@Component({
    selector: "lily-avatar-image",
    standalone: true,
    template: `<img class="avatar-image {{ className() }}" [attr.src]="src()" [attr.alt]="alt()" aria-hidden="true" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarImage {
    /** Image URL (required: Angular's URL sanitizer writes an empty src rather than none). */
    readonly src = input<string>("");
    /** Alternative text; empty by default because the avatar's own name labels the person. */
    readonly alt = input<string>("");
    readonly className = input<string>("");
}
