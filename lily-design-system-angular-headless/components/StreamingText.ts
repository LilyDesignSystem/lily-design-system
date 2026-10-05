import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StreamingText — text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete
 *
 * A polite live region for text that grows over time. While `streaming` is true the region is marked busy (`aria-busy="true"`, `data-streaming="true"`) so assistive technology waits instead of announcing every chunk; when it flips to false the finished text is announced once (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`). The component never splits, times, reveals or animates the text: the consumer appends chunks to the children, and owns any caret or reduced-motion CSS.
 * Keyboard: none. Deviation from Svelte: no rest-props spread (Angular cannot
 * spread onto an inner element).
 */
@Component({
  selector: "lily-streaming-text",
  standalone: true,
  template: `<div class="streaming-text {{ className() }}" role="status" aria-live="polite" aria-atomic="true" [attr.aria-label]="label() || null" [attr.aria-busy]="streaming() ? 'true' : null" [attr.data-streaming]="streaming() ? 'true' : null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamingText {
  /** Accessible name of the region. */
  readonly label = input<string>("");
  /** True while chunks are still arriving. */
  readonly streaming = input<boolean>(false);
  readonly className = input<string>("");
}
