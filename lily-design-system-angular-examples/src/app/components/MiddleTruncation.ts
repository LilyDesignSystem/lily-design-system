import { ChangeDetectionStrategy, Component, ElementRef, effect, input, signal, viewChild } from "@angular/core";
import { truncateMiddle, type TruncationStrategy } from "./middle-truncation";

/**
 * MiddleTruncation — a string shortened in the middle to fit its width, keeping the start and the end.
 *
 * Mirrors the Svelte canonical: the width is measured in the browser (canvas text metrics in the element's own font)
 * and re-measured when the container resizes; until then, and on the server, the full text is shown. The shortened string
 * is aria-hidden and the whole text sits in `.middle-truncation-full`, which the consumer visually hides, so assistive
 * technology, find-in-page and copy get the real text.
 *
 * Inputs: `text` (required), `ellipsis` (required, no default), `strategy` ("even" | "fixed-end" | "min-end"), `end`, `className`.
 * Keyboard: none.
 * Deviation from Svelte: no rest-props spread (Angular cannot spread onto an inner element).
 */
@Component({
  selector: "lily-middle-truncation",
  standalone: true,
  template: `<span #root class="middle-truncation {{ className() }}" [attr.data-strategy]="strategy()" [attr.data-truncated]="shown() === null ? null : ''"><span class="middle-truncation-visual" aria-hidden="true">{{ shown() ?? text() }}</span><span class="middle-truncation-full">{{ text() }}</span></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiddleTruncation {
  readonly className = input<string>("");
  /** The full text. */
  readonly text = input.required<string>();
  /** The cut marker; no default. */
  readonly ellipsis = input.required<string>();
  /** How the room is shared between start and end. */
  readonly strategy = input<TruncationStrategy>("even");
  /** Characters kept at the end for "fixed-end" and "min-end". */
  readonly end = input<number | undefined>(undefined);

  private readonly root = viewChild<ElementRef<HTMLSpanElement>>("root");
  protected readonly shown = signal<string | null>(null);
  private context: CanvasRenderingContext2D | null | undefined;

  constructor() {
    effect((onCleanup) => {
      const el = this.root()?.nativeElement;
      const text = this.text();
      const ellipsis = this.ellipsis();
      const strategy = this.strategy();
      const end = this.end();
      if (!el) return;

      const recalculate = (): void => {
        const width = el.clientWidth;
        if (this.context === undefined) this.context = document.createElement("canvas").getContext("2d");
        const ctx = this.context;
        if (!ctx || width <= 0) {
          this.shown.set(null);
          return;
        }
        const style = getComputedStyle(el);
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const result = truncateMiddle(text, { ellipsis, strategy, end, maxWidth: width, measure: (s) => ctx.measureText(s).width });
        this.shown.set(result === text ? null : result);
      };

      recalculate();
      if (typeof ResizeObserver === "undefined") return;
      let frame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(recalculate);
      });
      observer.observe(el);
      onCleanup(() => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      });
    });
  }
}
