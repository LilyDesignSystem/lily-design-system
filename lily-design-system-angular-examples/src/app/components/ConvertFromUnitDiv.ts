import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertFromUnitDiv — the unit to convert from, such as a select box of currencies or lengths
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-from-unit-div",
  standalone: true,
  template: `<div class="convert-from-unit-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertFromUnitDiv {
  readonly className = input<string>("");
}
