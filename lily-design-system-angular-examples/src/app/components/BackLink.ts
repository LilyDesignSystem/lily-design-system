import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BackLink — a navigation link to return to a previous page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `back-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-back-link",
  standalone: true,
  template: `<a class="back-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
