import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionListItem — an accordion list item component
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `accordion-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-accordion-list-item",
  standalone: true,
  template: `<li class="accordion-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionListItem {
  readonly className = input<string>("");
}
