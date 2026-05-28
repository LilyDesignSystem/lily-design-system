import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DoList — a guideline list of encouraged do-list-item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `do-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-do-list",
  standalone: true,
  template: `<ul class="do-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
