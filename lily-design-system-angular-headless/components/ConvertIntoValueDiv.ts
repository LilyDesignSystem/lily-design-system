import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ConvertIntoValueDiv — the converted value, such as a text input showing the number of euros
 *
 * A headless part of ConvertDiv: a plain <div> with the base class and projected content.
 */
@Component({
  selector: "lily-convert-into-value-div",
  standalone: true,
  template: `<div class="convert-into-value-div {{ className() }}"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvertIntoValueDiv {
  readonly className = input<string>("");
}
