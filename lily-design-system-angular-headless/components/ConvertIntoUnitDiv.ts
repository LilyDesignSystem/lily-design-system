import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertIntoUnitDiv — the unit to convert into, such as a select box of currencies or lengths
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-into-unit-div",
  standalone: true,
  template: `<div class="convert-into-unit-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertIntoUnitDiv {
  readonly className = input<string>("");
}
