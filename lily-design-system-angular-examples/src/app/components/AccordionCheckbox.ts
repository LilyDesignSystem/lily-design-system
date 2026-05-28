import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionCheckbox — a checkbox option that reveals an accordion panel when checked
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `accordion-checkbox` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-accordion-checkbox",
  standalone: true,
  template: `<div class="accordion-checkbox {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionCheckbox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
