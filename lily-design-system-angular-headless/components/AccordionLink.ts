import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AccordionLink — an accordion link
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `accordion-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-accordion-link",
  standalone: true,
  template: `<a class="accordion-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
