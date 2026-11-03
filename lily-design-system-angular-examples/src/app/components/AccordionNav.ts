import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionNav component
 *
 * A headless navigation container for an accordion, rendered as a <nav>
 * element with an accessible label. Serves as the outermost wrapper for
 * collapsible accordion content. Contains an AccordionList which holds
 * AccordionListItem children. Commonly used for FAQs, settings panels,
 * filter groups, and mobile navigation menus.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name via aria-label.
 *   <ng-content /> — projected content, required. AccordionList element.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-accordion-nav label="FAQ">
 *     <lily-accordion-list>...</lily-accordion-list>
 *   </lily-accordion-nav>
 *
 * Examples:
 *   <!-- FAQ accordion -->
 *   <lily-accordion-nav label="Frequently Asked Questions">
 *     <lily-accordion-list>
 *       <li[lily-accordion-list-item]>
 *         <summary>What is this?</summary>
 *         <p>A design system.</p>
 *       </li[lily-accordion-list-item]>
 *     </lily-accordion-list>
 *   </lily-accordion-nav>
 *
 * Keyboard: None — this is a passive container. Keyboard interactions
 * are handled by AccordionListItem children (Enter/Space to toggle).
 *
 * Accessibility:
 *   - <nav> element provides navigation landmark semantics
 *   - aria-label provides the accessible name for screen readers
 *
 * Internationalization:
 *   - The label prop is the only user-facing string
 *   - No hardcoded text; all content comes through props and children
 *
 * Claude rules:
 *   - Compound component — use with AccordionList and AccordionListItem
 *   - Headless: no CSS, no styles — consumer provides all styling
 *
 * References:
 *   - WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-accordion-nav",
    standalone: true,
    template: `<nav class="accordion-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionNav {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
