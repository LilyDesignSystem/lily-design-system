import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertDiv — a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content; role="group" named by the required `label` input.
 */
@Component({
  selector: "lily-convert-div",
  standalone: true,
  template: `<div class="convert-div {{ className() }}" role="group" [attr.aria-label]="label()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertDiv {
  readonly className = input<string>("");
  readonly label = input.required<string>();
}
