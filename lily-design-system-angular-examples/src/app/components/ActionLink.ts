import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ActionLink — a hyperlink styled as an action trigger
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `action-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-action-link",
  standalone: true,
  template: `<a class="action-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
