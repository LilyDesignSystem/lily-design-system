import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TimelineList component
 *
 * A headless timeline list that renders a semantic ordered list (<ol>) with
 * an accessible label for displaying events, milestones, or activities in
 * chronological order. Commonly used for project tracking, activity feeds,
 * historical overviews, order history, or user journey visualization. The
 * consumer provides TimelineListItem children through the snippet.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible label for the timeline via aria-label.
 *   <ng-content /> — projected content, required. TimelineListItem elements.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-timeline-list label="Project milestones">...</lily-timeline-list>
 *
 * Examples:
 *   <!-- Timeline with semantic time elements -->
 *   <lily-timeline-list label="Order history">
 *     <li[lily-timeline-list-item] datetime="2024-01-15" heading="January 15, 2024">
 *       Order placed
 *     </li[lily-timeline-list-item]>
 *     <li[lily-timeline-list-item] datetime="2024-01-16" heading="January 16, 2024">
 *       Order shipped
 *     </li[lily-timeline-list-item]>
 *   </lily-timeline-list>
 *
 * Keyboard:
 *   - None directly -- standard list navigation by screen readers
 *   - Tab moves focus between any interactive elements within items
 *
 * Accessibility:
 *   - Semantic <ol> element conveys chronological ordering to screen readers
 *   - aria-label provides the accessible name for the timeline
 *   - Screen readers announce the list with its label and item count
 *   - Consumers should use <time> elements with datetime attributes
 *
 * Internationalization:
 *   - The label prop externalizes user-facing text for translation
 *   - All timeline content is provided through the children snippet
 *   - No hardcoded strings in the component
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Consumers add <time> elements for machine-readable dates
 *
 * References:
 *   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
 *   - WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
 */
@Component({
    selector: "lily-timeline-list",
    standalone: true,
    template: `<ol class="timeline-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineList {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
