import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RingChart — a pie chart with a hollow centre, often used to show progress or a share of a total
 *
 * The consumer supplies the inline <svg> as projected content; nothing is
 * drawn here. The graphic is a role="img" wrapper named by `label`
 * (`describedBy` is its aria-describedby). An element projected with the
 * `dataTable` attribute (`<table dataTable>`) is rendered in
 * `.ring-chart-data-table`, a SIBLING of the image wrapper: role="img" makes
 * descendants presentational, so a table inside it would be invisible to
 * assistive technology.
 * Keyboard: none on the graphic; the table follows native table behaviour.
 * Deviations from Svelte: no rest-props spread (Angular cannot spread onto
 * an inner element); the data-table wrapper is always rendered (Angular
 * cannot detect projected content), empty when nothing is projected.
 */
@Component({
  selector: "lily-ring-chart",
  standalone: true,
  template: `<figure class="ring-chart {{ className() }}"><div class="ring-chart-graphic" role="img" [attr.aria-label]="label() || null" [attr.aria-describedby]="describedBy() || null"><ng-content /></div><div class="ring-chart-data-table"><ng-content select="[dataTable]" /></div></figure>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RingChart {
  /** Accessible name for the chart. */
  readonly label = input<string>("");
  /** Id of a description (aria-describedby on the image wrapper). */
  readonly describedBy = input<string>("");
  readonly className = input<string>("");
}
