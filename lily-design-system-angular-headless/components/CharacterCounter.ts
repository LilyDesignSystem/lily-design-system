import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CharacterCounter — a counter showing remaining or used characters in a text field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `character-counter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-character-counter",
  standalone: true,
  template: `<div class="character-counter {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCounter {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
