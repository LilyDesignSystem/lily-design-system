import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Flair — a decorative highlight or emphasis element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `flair` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-flair",
  standalone: true,
  template: `<div class="flair {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flair {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
