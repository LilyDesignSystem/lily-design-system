import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionLink — one section link in the navigation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-section-link",
  standalone: true,
  template: `<a class="section-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
