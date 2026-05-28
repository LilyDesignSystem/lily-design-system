import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionHeading — a styled heading introducing a major content section, with optional eyebrow and subtitle
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-heading` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-section-heading",
  standalone: true,
  template: `<div class="section-heading {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
