import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionNav — an accordion navigation area for collapsible accordion information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `accordion-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
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
