import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DoListItem — an encouraged-practice item in a do-list guideline list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `do-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-do-list-item",
  standalone: true,
  template: `<li class="do-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoListItem {
  readonly className = input<string>("");
}
