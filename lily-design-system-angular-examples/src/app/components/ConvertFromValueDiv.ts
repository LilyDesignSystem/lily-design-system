import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertFromValueDiv — the value to convert from, such as a text input holding the number of dollars
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-from-value-div",
  standalone: true,
  template: `<div class="convert-from-value-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertFromValueDiv {
  readonly className = input<string>("");
}
