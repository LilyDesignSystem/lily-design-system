import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MutuallyExclusive — a container ensuring only one option can be selected from a group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mutually-exclusive` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mutually-exclusive",
  standalone: true,
  template: `<div class="mutually-exclusive {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutuallyExclusive {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
