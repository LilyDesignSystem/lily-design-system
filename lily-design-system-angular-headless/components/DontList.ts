import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DontList — a guideline list of discouraged dont-list-item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dont-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dont-list",
  standalone: true,
  template: `<ul class="dont-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DontList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
