import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tag component
 *
 * A headless tag for displaying labels, categories, keywords, or status
 * indicators. Renders as an inline <span> with role="status" and an accessible
 * label, creating an implicit live region so screen readers announce content
 * changes. Commonly used in content management, product listings, article
 * metadata, and filtering interfaces to visually group or classify content.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible label for screen readers via aria-label.
 *   <ng-content /> — projected content, required. The tag's visible content (text, etc.).
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-tag label="Category">Design</lily-tag>
 *
 * Examples:
 *   <!-- Status tag -->
 *   <lily-tag label="Status">Active</lily-tag>
 *
 *   <!-- Priority tag with expanded context -->
 *   <lily-tag label="Priority: High">High</lily-tag>
 *
 * Keyboard:
 *   - None -- tags are informational, not interactive
 *
 * Accessibility:
 *   - role="status" enables live region announcements for screen readers
 *   - aria-label provides expanded context beyond the visible tag text
 *
 * Internationalization:
 *   - The label prop externalizes user-facing text for translation
 *   - All visible content is provided through the children snippet
 *   - No hardcoded strings in the component
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - role="status" creates an implicit live region
 *
 * References:
 *   - WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
 */
@Component({
    selector: "lily-tag",
    standalone: true,
    // Not a live region: aria-label is not allowed on a plain <span>, so the label is screen-reader text appended after the content (the themes hide .screen-reader-span). The content stays exposed: it may hold a focusable control, such as a remove button.
    template: `@if (live()) {
      <span class="tag {{ className() }}" role="status" [attr.aria-label]="label() || null"><ng-content /></span>
    } @else {
      <span class="tag {{ className() }}"><ng-content />@if (label()) {<span class="screen-reader-span">{{ label() }}</span>}</span>
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tag {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Announce changes: a role="status" live region. Off by default. */
    readonly live = input<boolean>(false);
}
