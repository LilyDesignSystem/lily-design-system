import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Sidebar component
 *
 * A headless complementary region that uses the semantic <aside> element to
 * provide a labeled landmark for content tangentially related to the main
 * content. Commonly used for navigation menus, filters, related links, or
 * supplementary information alongside the primary page content.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible label for the sidebar region via aria-label.
 *   <ng-content /> — projected content, required. Content to render inside the sidebar.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-sidebar label="Navigation">
 *     <nav>...</nav>
 *   </lily-sidebar>
 *
 * Examples:
 *   <!-- Sidebar with filter controls -->
 *   <lily-sidebar label="Filters">
 *     <form>
 *       <select><option>Category</option></select>
 *     </form>
 *   </lily-sidebar>
 *
 *   <!-- Sidebar with related links -->
 *   <lily-sidebar label="Related articles">
 *     <ul><li><a href="/article-1">Article 1</a></li></ul>
 *   </lily-sidebar>
 *
 * Keyboard:
 *   - None — this is a passive container. Keyboard navigation depends on interactive content inside.
 *
 * Accessibility:
 *   - <aside> element has implicit complementary landmark role
 *   - aria-label distinguishes this sidebar from other landmarks on the page
 *   - Screen readers announce it as a complementary landmark
 *
 * Internationalization:
 *   - The label prop externalizes the accessible label string
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - No internal state management — purely structural component
 *   - Layout, width, positioning are entirely the consumer's responsibility
 *
 * References:
 *   - WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
 *   - WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
 *   - HTML <aside> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
 */
@Component({
    selector: "lily-sidebar",
    standalone: true,
    template: `<aside class="sidebar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
