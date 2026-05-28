import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Character — a single character display element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `character` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-character",
  standalone: true,
  template: `<div class="character {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Character {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
