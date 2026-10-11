import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Mark — an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element
 *
 * A headless inline wrapper. Contract: a plain wrapper with the base class and children.
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-mark",
  standalone: true,
  template: `<mark class="mark {{ className() }}" ><ng-content /></mark>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mark {

  readonly className = input<string>("");
}
