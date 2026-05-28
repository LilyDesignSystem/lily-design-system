import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DontListItem — a discouraged-practice item in a dont-list guideline list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dont-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dont-list-item",
  standalone: true,
  template: `<li class="dont-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DontListItem {
  readonly className = input<string>("");
}
