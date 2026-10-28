import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Picture — a responsive image wrapper that lets the browser choose among several sources, using the native picture element
 *
 * A headless wrapper. Contract: the source and img elements are projected children; the img's alt is the consumer's.
 * Draws nothing and carries no strings of its own. No rest-props spread
 * (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-picture",
  standalone: true,
  template: `<picture class="picture {{ className() }}" ><ng-content /></picture>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Picture {

  readonly className = input<string>("");
}
