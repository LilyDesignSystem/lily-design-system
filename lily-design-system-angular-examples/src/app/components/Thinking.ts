import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Thinking — a collapsible block that shows an AI agent's reasoning or thinking, closed by default
 *
 * Headless Angular component. Root native `<details class="thinking">` with
 * `<summary class="thinking-summary">{label}</summary>` and
 * `<div class="thinking-content">`. `open` is a bindable boolean (default
 * false); `streaming` sets `data-streaming` and `aria-busy` on the root.
 * Keyboard: native summary. Ships zero CSS.
 */
@Component({
  selector: "lily-thinking",
  standalone: true,
  template: `<details
    class="thinking {{ className() }}"
    [open]="open()"
    [attr.data-streaming]="streaming() ? 'true' : null"
    [attr.aria-busy]="streaming() ? 'true' : null"
    (toggle)="open.set($any($event.target).open)"
  ><summary class="thinking-summary">{{ label() }}</summary><div class="thinking-content"><ng-content /></div></details>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Thinking {
  /** The summary text. */
  readonly label = input.required<string>();
  readonly className = input<string>("");
  /** Whether the details is open. Bindable. */
  readonly open = model<boolean>(false);
  /** True while content is still arriving. */
  readonly streaming = input<boolean>(false);
}
