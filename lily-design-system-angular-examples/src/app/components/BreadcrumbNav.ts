import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbNav component
 *
 * A navigation landmark for a breadcrumb trail that shows the user's current
 * location within a site hierarchy. Renders a <nav> element with an accessible
 * label. Contains a BreadcrumbList which holds BreadcrumbListItem children.
 * Used in sites with deep hierarchies such as e-commerce catalogs,
 * documentation, and content management systems.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name for the navigation landmark.
 *   <ng-content /> — projected content, required. BreadcrumbList element.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-breadcrumb-nav label="Breadcrumb">
 *     <lily-breadcrumb-list>...</lily-breadcrumb-list>
 *   </lily-breadcrumb-nav>
 *
 * Examples:
 *   <!-- Full breadcrumb navigation -->
 *   <lily-breadcrumb-nav label="Breadcrumb">
 *     <lily-breadcrumb-list>
 *       <li[lily-breadcrumb-list-item]><a href="/">Home</a></li[lily-breadcrumb-list-item]>
 *       <li[lily-breadcrumb-list-item]><a href="/products">Products</a></li[lily-breadcrumb-list-item]>
 *       <li[lily-breadcrumb-list-item] current>Widget</li[lily-breadcrumb-list-item]>
 *     </lily-breadcrumb-list>
 *   </lily-breadcrumb-nav>
 *
 * Keyboard:
 *   - Tab: Focus moves between links in the breadcrumb trail
 *   - Enter: Activates the focused breadcrumb link
 *
 * Accessibility:
 *   - <nav> with aria-label creates a navigation landmark
 *   - Screen readers announce the landmark name for orientation
 *
 * Internationalization:
 *   - Label text comes through the label prop; no hardcoded strings
 *
 * Claude rules:
 *   - Compound component — use with BreadcrumbList and BreadcrumbListItem
 *   - Headless: no CSS, no styles — consumer provides all styling
 *
 * References:
 *   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-breadcrumb-nav",
    standalone: true,
    template: `<nav class="breadcrumb-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbNav {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
