import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Cascader — a multi-level dropdown for selecting a value from a hierarchy
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cascader` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-cascader",
  standalone: true,
  template: `<div class="cascader {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cascader {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
