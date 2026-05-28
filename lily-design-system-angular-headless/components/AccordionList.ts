import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionList — an accordion ordered list of list item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `accordion-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-accordion-list",
  standalone: true,
  template: `<ol class="accordion-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
