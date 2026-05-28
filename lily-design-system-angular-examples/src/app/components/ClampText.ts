import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ClampText — a text container that truncates content to a maximum number of lines
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `clamp-text` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-clamp-text",
  standalone: true,
  template: `<div class="clamp-text {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClampText {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
