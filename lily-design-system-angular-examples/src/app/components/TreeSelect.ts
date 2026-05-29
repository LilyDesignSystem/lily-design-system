import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * TreeSelect — a select dropdown showing a tree of hierarchical options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-select` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-select",
  standalone: true,
  template: `<select class="tree-select {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" (change)="value.set($any($event.target).value)"><ng-content /></select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelect {
  readonly label = input<string>("");
  readonly className = input<string>("");
  readonly value = model<string>("");
}
