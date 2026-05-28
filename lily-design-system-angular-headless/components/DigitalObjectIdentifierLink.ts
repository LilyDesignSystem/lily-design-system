import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DigitalObjectIdentifierLink — a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `digital-object-identifier-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-digital-object-identifier-link",
  standalone: true,
  template: `<a class="digital-object-identifier-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalObjectIdentifierLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
