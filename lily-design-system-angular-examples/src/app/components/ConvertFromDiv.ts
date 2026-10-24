import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertFromDiv — the source side of a conversion, holding the value and unit to convert from
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-from-div",
  standalone: true,
  template: `<div class="convert-from-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertFromDiv {
  readonly className = input<string>("");
}
