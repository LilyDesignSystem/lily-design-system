import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DescriptionList — a definition list displaying information in key-value format <dl>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `description-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-description-list",
  standalone: true,
  template: `<ol class="description-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
