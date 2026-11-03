import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Table component
 *
 * A headless table that renders a semantic <table> element with an accessible
 * label. Used to display structured data in rows and columns for reports,
 * schedules, product lists, and dashboards. The consumer provides all table
 * content (thead, tbody, tfoot, caption, colgroup, etc.) through the children
 * snippet, maintaining full control over table structure and styling.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible label for the table via aria-label.
 *   <ng-content /> — projected content, required. Table content including thead, tbody, tfoot, etc.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-table label="User accounts">...</lily-table>
 *
 * Examples:
 *   <!-- Data table with column headers -->
 *   <lily-table label="User accounts">
 *     <thead><tr><th scope="col">Name</th><th scope="col">Email</th></tr></thead>
 *     <tbody><tr><td>Alice</td><td>alice@example.com</td></tr></tbody>
 *   </lily-table>
 *
 * Keyboard:
 *   - None directly -- standard table navigation is handled by screen readers
 *
 * Accessibility:
 *   - aria-label provides the accessible name for screen readers
 *   - Semantic <table> element conveys tabular data structure
 *   - Consumers should use <th scope="col"> for column headers
 *   - Consumers should use <th scope="row"> for row headers
 *   - Consumers may add <caption> for a visible table title
 *
 * Internationalization:
 *   - The label prop externalizes user-facing text for translation
 *   - All content is provided through the children snippet
 *   - No hardcoded strings in the component
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - No built-in sorting, filtering, or pagination
 *
 * References:
 *   - WAI-ARIA Table Role: https://www.w3.org/WAI/ARIA/apg/patterns/table/
 *   - HTML Table Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
 */
@Component({
    selector: "lily-table",
    standalone: true,
    template: `<table class="table {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
