import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ValidationListItem — one validation rule in a validation list with a status of pending, passed, or failed
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `validation-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-validation-list-item",
  standalone: true,
  template: `<li class="validation-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationListItem {
  readonly className = input<string>("");
}
