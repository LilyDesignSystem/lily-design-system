import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  signal,
  viewChildren,
} from "@angular/core";

/**
 * PinInputDiv — a series of single-digit inputs for entering a PIN or OTP code
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pin-input-div` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pin-input-div",
  standalone: true,
  template: `<div class="pin-input-div {{ className() }}" role="group" [attr.aria-label]="label() || null">
    @for (i of indexes(); track i) {
      <input
        #digit
        type="text"
        inputmode="numeric"
        maxlength="1"
        [attr.aria-label]="digitName(i)"
        [value]="digits()[i] ?? ''"
        [disabled]="disabled()"
        (input)="onInput(i, $event)"
        (keydown)="onKeydown(i, $event)"
      />
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinInputDiv implements OnInit {
  readonly label = input<string>("");
  readonly length = input<number>(4);
  /** Accessible name of one box, e.g. `(n, total) => ...`. Falls back to `label`. */
  readonly digitLabel = input<((position: number, length: number) => string) | undefined>(undefined);
  /** The digits entered so far, as one string. Two-way bindable. */
  readonly value = model<string>("");
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  protected readonly digits = signal<string[]>([]);
  protected readonly indexes = computed(() => Array.from({ length: this.length() }, (_, i) => i));
  private readonly inputs = viewChildren<ElementRef<HTMLInputElement>>("digit");
  private initialDigits: string[] = [];
  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Keep the bound string in step with the boxes (initial value is read once, in ngOnInit).
    effect(() => this.value.set(this.digits().join("")));
    // A native form reset restores the boxes to their initial digits.
    afterNextRender(() => {
      const form = (this.host.nativeElement as HTMLElement).closest("form");
      if (!form) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onReset = (event: Event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (event.defaultPrevented) return;
          this.digits.set([...this.initialDigits]);
          this.inputs().forEach((ref, i) => (ref.nativeElement.value = this.initialDigits[i] ?? ""));
        }, 0);
      };
      form.addEventListener("reset", onReset);
      destroyRef.onDestroy(() => {
        clearTimeout(timer);
        form.removeEventListener("reset", onReset);
      });
    });
  }

  ngOnInit(): void {
    const v = this.value();
    this.initialDigits = Array.from({ length: this.length() }, (_, i) => (/^[0-9]$/.test(v[i] ?? "") ? v[i] : ""));
    this.digits.set([...this.initialDigits]);
  }

  protected digitName(index: number): string | null {
    const fn = this.digitLabel();
    return (fn ? fn(index + 1, this.length()) : this.label()) || null;
  }

  protected onInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value && !/^[0-9]$/.test(target.value)) {
      target.value = this.digits()[index] ?? "";
      return;
    }
    this.digits.update((d) => d.map((c, i) => (i === index ? target.value : c)));
    if (target.value && index < this.length() - 1) this.inputs()[index + 1]?.nativeElement.focus();
  }

  protected onKeydown(index: number, event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const refs = this.inputs();
    if (event.key === "Backspace") {
      if (!target.value && index > 0) {
        refs[index - 1]?.nativeElement.focus();
        this.digits.update((d) => d.map((c, i) => (i === index - 1 ? "" : c)));
      } else {
        this.digits.update((d) => d.map((c, i) => (i === index ? "" : c)));
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      refs[index - 1]?.nativeElement.focus();
    } else if (event.key === "ArrowRight" && index < this.length() - 1) {
      refs[index + 1]?.nativeElement.focus();
    }
  }
}
