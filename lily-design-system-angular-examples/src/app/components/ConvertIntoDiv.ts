import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertIntoDiv — the target side of a conversion, holding the value and unit to convert into
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-into-div",
  standalone: true,
  template: `<div class="convert-into-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertIntoDiv {
  readonly className = input<string>("");
}
