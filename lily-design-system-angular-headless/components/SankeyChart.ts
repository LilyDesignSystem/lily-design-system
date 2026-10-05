import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SankeyChart — a headless wrapper for a flow chart where link width encodes quantity. <figure role="img">
 *
 * Mirrors BarChart's contract per the Svelte canonical: the consumer supplies
 * the inline <svg> as projected content; nothing is drawn here. Pass
 * `describedBy` (an id) to reference a description or a real data table.
 * Keyboard: none. Deviation from Svelte: no rest-props spread (Angular cannot
 * spread onto an inner element); aria-describedby is the `describedBy` input.
 */
@Component({
  selector: "lily-sankey-chart",
  standalone: true,
  template: `<figure class="sankey-chart {{ className() }}" role="img" [attr.aria-label]="label()" [attr.aria-describedby]="describedBy() || null"><ng-content /></figure>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SankeyChart {
  /** Accessible name for the chart. */
  readonly label = input.required<string>();
  /** Id of a description or data table (aria-describedby). */
  readonly describedBy = input<string>("");
  readonly className = input<string>("");
}
