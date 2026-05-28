import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TelLink — a tel hyperlink for a telephone number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tel-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tel-link",
  standalone: true,
  template: `<a class="tel-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
