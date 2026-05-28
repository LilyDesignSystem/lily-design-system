import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InsetText — indented text to distinguish it from surrounding content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `inset-text` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-inset-text",
  standalone: true,
  template: `<div class="inset-text {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsetText {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
