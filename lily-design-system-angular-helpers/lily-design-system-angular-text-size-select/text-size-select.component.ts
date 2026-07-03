import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";

/**
 * TextSizeSelect — `data-text-size` text-size select.
 *
 * Renders an accessible native `<select>` of size slugs. On every size
 * change the select writes `data-text-size="{slug}"` to the document
 * root (or a consumer-supplied target), with optional `localStorage`
 * persistence. Ships no CSS; the consumer maps each
 * `[data-text-size="…"]` slug to real typography. See `spec/index.md` for the
 * full contract.
 */
@Component({
  selector: "lily-text-size-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      class="text-size-select {{ className() }}"
      [attr.aria-label]="label() || null"
      [name]="name()"
      (change)="onInputChange($any($event.target).value)"
    >
      @for (size of sizes(); track size) {
        <option
          class="text-size-select-option"
          [value]="size"
          [selected]="value() === size"
        >{{ labelFor(size) }}</option>
      }
    </select>
  `,
})
export class TextSizeSelect {
  readonly label = input.required<string>();
  readonly sizes = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly name = input<string>("text-size");
  readonly target = input<HTMLElement | null>(null);
  readonly sizeLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly sizeChange = output<string>();

  private initialised = false;

  constructor() {
    effect(() => {
      const current = this.value();

      if (!this.initialised) {
        this.initialised = true;
        let initial = current;

        const sk = this.storageKey();
        if (!initial && sk) {
          try {
            initial = (typeof localStorage !== "undefined"
              ? localStorage.getItem(sk)
              : null) ?? "";
          } catch {
            // ignore privacy errors
          }
        }

        if (!initial) {
          const sizes = this.sizes();
          const dv = this.defaultValue();
          initial =
            dv ||
            (sizes.includes("medium") ? "medium" : sizes[0]) ||
            "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applySize(current);
    });
  }

  labelFor(size: string): string {
    const labels = this.sizeLabels();
    if (size in labels) return labels[size];
    // Title-case each hyphen-separated word so a slug like
    // "x-large" renders as "X Large".
    return size
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  onInputChange(next: string): void {
    this.value.set(next);
  }

  private applySize(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    const root = this.target() ?? document.documentElement;
    root.setAttribute("data-text-size", slug);

    const sk = this.storageKey();
    if (sk) {
      try {
        localStorage.setItem(sk, slug);
      } catch {
        // ignore quota / privacy errors
      }
    }
    this.sizeChange.emit(slug);
  }
}
