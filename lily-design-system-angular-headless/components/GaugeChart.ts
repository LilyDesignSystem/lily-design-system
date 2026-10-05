import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GaugeChart — a headless wrapper for a dial chart showing one value within a range. <figure role="img">
 *
 * Mirrors BarChart's contract per the Svelte canonical: the consumer supplies
 * the inline <svg> as projected content; nothing is drawn here. Pass
 * `describedBy` (an id) to reference a description or a real data table.
 * Keyboard: none. Deviation from Svelte: no rest-props spread (Angular cannot
 * spread onto an inner element); aria-describedby is the `describedBy` input.
 */
@Component({
  selector: "lily-gauge-chart",
  standalone: true,
  template: `<figure class="gauge-chart {{ className() }}" role="img" [attr.aria-label]="label()" [attr.aria-describedby]="describedBy() || null"><ng-content /></figure>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeChart {
  /** Accessible name for the chart. */
  readonly label = input.required<string>();
  /** Id of a description or data table (aria-describedby). */
  readonly describedBy = input<string>("");
  readonly className = input<string>("");
}
