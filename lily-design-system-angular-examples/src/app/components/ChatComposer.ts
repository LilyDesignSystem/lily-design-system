import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";

/**
 * ChatComposer — a chat input form: a textarea that grows with its content, sends on Enter, and turns its
 * send button into a stop button while a reply is in progress.
 *
 * A headless chat input form: a <textarea> that grows with its content (rows from the number of lines, clamped between minRows and maxRows) and ONE button that is "send" normally and turns into "stop" while `busy`. Enter sends; Shift+Enter inserts a line break; Enter while an IME composition is in progress does nothing. The send button is disabled, never hidden, when the text is empty or the form is disabled. The component never clears the text (the consumer does, in its send handler), never animates, and carries no strings: the textarea name, the send word and the stop word are required props. Models, attachments and menus are consumer composition (put them in the default slot, rendered before the textarea).
 * Angular: `value` is a model(); `send` (the text) and `stop` are outputs. Content projected into
 * the component is rendered before the textarea. No rest-props spread (Angular cannot spread onto
 * an inner element).
 */
@Component({
  selector: "lily-chat-composer",
  standalone: true,
  template: `<form class="chat-composer {{ className() }}" (submit)="onSubmit($event)"><ng-content /><textarea
      class="chat-composer-input"
      [attr.aria-label]="label()"
      [value]="value()"
      [attr.rows]="rows()"
      [attr.placeholder]="placeholder() || null"
      [attr.name]="name() || null"
      [disabled]="disabled()"
      (input)="value.set($any($event.target).value)"
      (keydown)="onKeydown($event)"
    ></textarea><button
      class="chat-composer-button"
      [attr.type]="busy() ? 'button' : 'submit'"
      [attr.data-state]="busy() ? 'stop' : 'send'"
      [disabled]="disabled() || (!busy() && empty())"
      (click)="onButtonClick()"
    ><span class="chat-composer-button-label">{{ busy() ? stopLabel() : sendLabel() }}</span></button></form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComposer {
  /** Accessible name of the textarea. */
  readonly label = input.required<string>();
  /** Word for the send button. */
  readonly sendLabel = input.required<string>();
  /** Word for the stop button. */
  readonly stopLabel = input.required<string>();
  readonly placeholder = input<string>("");
  readonly name = input<string>("");
  readonly minRows = input<number>(1);
  readonly maxRows = input<number>(8);
  /** A reply is in progress. */
  readonly busy = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");
  /** The text. Bindable. */
  readonly value = model<string>("");
  readonly send = output<string>();
  readonly stop = output<void>();

  protected readonly empty = computed(() => this.value().trim() === "");
  protected readonly rows = computed(() =>
    Math.min(this.maxRows(), Math.max(this.minRows(), this.value().split("\n").length)),
  );

  private trySend(): void {
    if (this.disabled() || this.busy() || this.empty()) return;
    this.send.emit(this.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== "Enter") return;
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    // IME: Enter that confirms a composition must not send.
    if (event.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    this.trySend();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.trySend();
  }

  protected onButtonClick(): void {
    if (this.busy()) this.stop.emit();
  }
}
