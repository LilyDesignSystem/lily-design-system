// ColorPicker — a Lily helper (Angular port of the Svelte canonical package).
//
// Four areas in one labelled group: the recent colours; a separator; a palette of swatches (8 rows of 10 by
// default) with a Transparent button; a separator; and fields to enter a colour by hex, CSS name, HSL, HSB, RGB
// or CMYK. It holds a form value: it applies nothing to the document and persists nothing (two-way bind
// `[(recent)]` to keep the recent colours). Every swatch is a native radio; ArrowUp and ArrowDown move a whole
// palette row.
//
// Headless: no CSS. Each swatch carries data-color and the --color-picker-swatch custom property, for the
// consumer's CSS to paint. The one bundled asset is the Transparent button's decorative icon.
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
    output,
    signal,
    untracked,
    viewChild,
} from "@angular/core";
import {
    CSS_NAMED_COLORS,
    TRANSPARENT,
    cmykToHex,
    defaultPalette,
    hexToCmyk,
    hexToHsb,
    hexToHsl,
    hexToRgb,
    hsbToHex,
    hslToHex,
    nameOfColor,
    normalizeHex,
    pushRecent,
    rgbToHex,
} from "./colors";

export interface Labels {
    /** The whole control's accessible name. */
    picker: string;
    /** The recent colours row. */
    recent: string;
    /** The palette of swatches. */
    palette: string;
    /** The Transparent button's visible text. */
    transparent: string;
    /** The group of entry fields. */
    custom: string;
    /** The hex field, for example "Hex". */
    hex: string;
    /** The CSS (X11) colour-name field. */
    name: string;
    /** The four colour models' group names, for example "HSL", "HSB", "RGB" and "CMYK". */
    hsl: string;
    hsb: string;
    rgb: string;
    cmyk: string;
    /** Field names: hue (0 to 360, in HSL and HSB), saturation (both), lightness (HSL), brightness (HSB). */
    hue: string;
    saturation: string;
    lightness: string;
    brightness: string;
    /** RGB fields, 0 to 255. */
    red: string;
    green: string;
    blue: string;
    /** CMYK fields, 0 to 100: cyan, magenta, yellow and key (black). */
    cyan: string;
    magenta: string;
    yellow: string;
    key: string;
    /** Shown beside a hex or name field that holds no colour. Without it the field is only marked aria-invalid. */
    invalid?: string;
}

let counter = 0;

/** A unique id prefix for one ColorPicker's radio names, datalist and fields. */
export function nextColorPickerId(): string {
    counter += 1;
    return `color-picker-${counter}`;
}

type Model = {
    id: "hsl" | "hsb" | "rgb" | "cmyk";
    label: string;
    fields: Array<{ key: string; label: string; max: number }>;
    values: Record<string, number>;
    toHex: (values: Record<string, number>) => string;
};
const asHex = (f: unknown) => f as (values: Record<string, number>) => string;

@Component({
    selector: "lily-color-picker",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div
      #root
      class="color-picker {{ className() }}"
      role="group"
      [attr.aria-label]="labels().picker"
      [attr.data-value]="value() || null"
    >
      @if (name()) {
        <input type="hidden" [attr.name]="name()" [value]="value()" />
      }

      <fieldset
        class="color-picker-recent"
        role="radiogroup"
        [attr.aria-label]="labels().recent"
        [disabled]="disabled()"
      >
        @for (color of recent(); track color) {
          <input
            class="color-picker-swatch"
            type="radio"
            [attr.name]="id + '-recent'"
            [value]="color"
            [checked]="color === value()"
            [attr.aria-label]="labelOf(color)"
            [attr.data-color]="color"
            [style.--color-picker-swatch]="color"
            (change)="choose(color)"
          />
        }
      </fieldset>

      <hr class="color-picker-separator" />

      <fieldset
        class="color-picker-palette"
        role="radiogroup"
        [attr.aria-label]="labels().palette"
        [disabled]="disabled()"
        (keydown)="onPaletteKeydown($event)"
      >
        @for (row of rows(); track $index) {
          <div class="color-picker-palette-row">
            @for (color of row; track $index) {
              <input
                class="color-picker-swatch"
                type="radio"
                [attr.name]="id + '-palette'"
                [value]="color"
                [checked]="color === value()"
                [attr.aria-label]="labelOf(color)"
                [attr.data-color]="color"
                [style.--color-picker-swatch]="color"
                (change)="choose(color)"
              />
            }
          </div>
        }
      </fieldset>

      <button
        class="color-picker-transparent"
        type="button"
        [attr.aria-pressed]="value() === transparent ? 'true' : 'false'"
        [disabled]="disabled()"
        (click)="choose(transparent)"
      >
        <svg
          class="color-picker-transparent-icon"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="1.05rem"
          height="1.05rem"
        >
          <path d="M8 2.5 4.5 7.5a4 4 0 1 0 7 0Z" />
          <path d="M2.5 2.5l11 11" />
        </svg>
        {{ labels().transparent }}
      </button>

      <hr class="color-picker-separator" />

      <div class="color-picker-custom" role="group" [attr.aria-label]="labels().custom">
        <div class="color-picker-field color-picker-field-hex">
          <label [attr.for]="id + '-hex'">{{ labels().hex }}</label>
          <input
            [attr.id]="id + '-hex'"
            class="color-picker-hex"
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            [disabled]="disabled()"
            [value]="hexDraft()"
            [attr.aria-invalid]="hexInvalid() ? 'true' : null"
            [attr.aria-describedby]="hexInvalid() && labels().invalid ? id + '-hex-invalid' : null"
            (input)="hexDraft.set($any($event.target).value)"
            (change)="commitHex()"
            (keydown.enter)="$event.preventDefault(); commitHex()"
          />
          @if (hexInvalid() && labels().invalid) {
            <span [attr.id]="id + '-hex-invalid'" class="color-picker-invalid">{{ labels().invalid }}</span>
          }
        </div>

        <div class="color-picker-field color-picker-field-name">
          <label [attr.for]="id + '-name'">{{ labels().name }}</label>
          <input
            [attr.id]="id + '-name'"
            class="color-picker-name"
            type="text"
            [attr.list]="id + '-names'"
            autocomplete="off"
            spellcheck="false"
            [disabled]="disabled()"
            [value]="nameDraft()"
            [attr.aria-invalid]="nameInvalid() ? 'true' : null"
            [attr.aria-describedby]="nameInvalid() && labels().invalid ? id + '-name-invalid' : null"
            (input)="nameDraft.set($any($event.target).value)"
            (change)="commitName()"
            (keydown.enter)="$event.preventDefault(); commitName()"
          />
          <datalist [attr.id]="id + '-names'">
            @for (n of names; track n) {
              <option [value]="n"></option>
            }
          </datalist>
          @if (nameInvalid() && labels().invalid) {
            <span [attr.id]="id + '-name-invalid'" class="color-picker-invalid">{{ labels().invalid }}</span>
          }
        </div>

        @for (m of models(); track m.id) {
          <fieldset class="color-picker-field color-picker-field-{{ m.id }}" [disabled]="disabled()">
            <legend>{{ m.label }}</legend>
            @for (f of m.fields; track f.key) {
              <label [attr.for]="id + '-' + m.id + '-' + f.key">{{ f.label }}</label>
              <input
                [attr.id]="id + '-' + m.id + '-' + f.key"
                class="color-picker-{{ m.id }} color-picker-{{ m.id }}-{{ f.key }}"
                type="number"
                min="0"
                [attr.max]="f.max"
                step="1"
                [value]="m.values[f.key]"
                (change)="commitModel(m, f.key, $any($event.target).valueAsNumber)"
              />
            }
          </fieldset>
        }
      </div>
    </div>
  `,
})
export class ColorPicker {
    /** Every visible and accessible word. Required: the helper ships no English. */
    readonly labels = input.required<Labels>();
    /** The chosen colour: "#rrggbb", "transparent", or "" for none. Two-way: `[(value)]`. */
    readonly value = model<string>("");
    /** Recent choices, newest first, at most `maxRecent`. Two-way: `[(recent)]`, so the app can keep them. */
    readonly recent = model<string[]>([]);
    /** How many recent colours to keep. Default 10. */
    readonly maxRecent = input<number>(10);
    /** The palette's colours, row by row. Default `defaultPalette()`: 8 rows of 10. */
    readonly palette = input<string[]>(defaultPalette());
    /** Swatches per palette row. Default 10. */
    readonly columns = input<number>(10);
    /** A swatch's accessible name. Default: its CSS colour name when it has one, else its hex value. */
    readonly colorLabel = input<((color: string) => string) | undefined>(undefined);
    /** Form field name: renders a hidden input carrying the value. */
    readonly name = input<string | undefined>(undefined);
    /** Disables every control. */
    readonly disabled = input<boolean>(false);
    /** Consumer class hook, appended to `color-picker`. */
    readonly className = input<string>("");
    /** Fired once for each new choice. */
    readonly changed = output<string>();

    protected readonly id = nextColorPickerId();
    protected readonly transparent = TRANSPARENT;
    protected readonly names = Object.keys(CSS_NAMED_COLORS);

    protected readonly rows = computed(() => {
        const palette = this.palette();
        const columns = this.columns();
        return Array.from({ length: Math.ceil(palette.length / columns) }, (_, r) =>
            palette.slice(r * columns, r * columns + columns),
        );
    });

    protected readonly models = computed<Model[]>(() => {
        const l = this.labels();
        const v = this.value();
        return [
            {
                id: "hsl",
                label: l.hsl,
                fields: [
                    { key: "h", label: l.hue, max: 360 },
                    { key: "s", label: l.saturation, max: 100 },
                    { key: "l", label: l.lightness, max: 100 },
                ],
                values: { ...(hexToHsl(v) ?? { h: 0, s: 0, l: 0 }) },
                toHex: asHex(hslToHex),
            },
            {
                id: "hsb",
                label: l.hsb,
                fields: [
                    { key: "h", label: l.hue, max: 360 },
                    { key: "s", label: l.saturation, max: 100 },
                    { key: "b", label: l.brightness, max: 100 },
                ],
                values: { ...(hexToHsb(v) ?? { h: 0, s: 0, b: 0 }) },
                toHex: asHex(hsbToHex),
            },
            {
                id: "rgb",
                label: l.rgb,
                fields: [
                    { key: "r", label: l.red, max: 255 },
                    { key: "g", label: l.green, max: 255 },
                    { key: "b", label: l.blue, max: 255 },
                ],
                values: { ...(hexToRgb(v) ?? { r: 0, g: 0, b: 0 }) },
                toHex: asHex(rgbToHex),
            },
            {
                id: "cmyk",
                label: l.cmyk,
                fields: [
                    { key: "c", label: l.cyan, max: 100 },
                    { key: "m", label: l.magenta, max: 100 },
                    { key: "y", label: l.yellow, max: 100 },
                    { key: "k", label: l.key, max: 100 },
                ],
                values: { ...(hexToCmyk(v) ?? { c: 0, m: 0, y: 0, k: 100 }) },
                toHex: asHex(cmykToHex),
            },
        ];
    });

    // The entry fields show the current value; a field being typed in keeps its draft until it is committed.
    protected readonly hexDraft = signal("");
    protected readonly nameDraft = signal("");
    protected readonly hexInvalid = signal(false);
    protected readonly nameInvalid = signal(false);

    private readonly root = viewChild.required<ElementRef<HTMLDivElement>>("root");

    constructor() {
        effect(() => {
            const v = this.value();
            untracked(() => {
                this.hexDraft.set(v === TRANSPARENT ? "" : v);
                this.nameDraft.set(nameOfColor(v) ?? "");
                this.hexInvalid.set(false);
                this.nameInvalid.set(false);
            });
        });

        // A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            const form = this.root().nativeElement.closest("form");
            if (!form) return;
            const initial = this.value();
            let timer: ReturnType<typeof setTimeout> | undefined;
            const onReset = (event: Event) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (event.defaultPrevented) return;
                    const changed = this.value() !== initial;
                    this.value.set(initial);
                    if (changed) this.changed.emit(initial);
                }, 0);
            };
            form.addEventListener("reset", onReset);
            destroyRef.onDestroy(() => {
                clearTimeout(timer);
                form.removeEventListener("reset", onReset);
            });
        });
    }

    protected labelOf(color: string): string {
        const custom = this.colorLabel();
        if (custom) return custom(color);
        if (color === TRANSPARENT) return this.labels().transparent;
        return nameOfColor(color) ?? color;
    }

    protected choose(color: string): void {
        if (this.disabled() || color === this.value()) return;
        this.value.set(color);
        this.recent.set(pushRecent(this.recent(), color, this.maxRecent()));
        this.changed.emit(color);
    }

    protected commitHex(): void {
        const draft = this.hexDraft();
        const hex = normalizeHex(draft);
        this.hexInvalid.set(draft.trim() !== "" && hex === null);
        if (hex) this.choose(hex);
    }

    protected commitName(): void {
        const text = this.nameDraft().trim().toLowerCase();
        const hex = CSS_NAMED_COLORS[text] ?? null;
        this.nameInvalid.set(text !== "" && hex === null);
        if (hex) this.choose(hex);
    }

    protected commitModel(m: Model, key: string, raw: number): void {
        if (!Number.isFinite(raw)) return;
        this.choose(m.toHex({ ...m.values, [key]: raw }));
    }

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    protected onPaletteKeydown(event: KeyboardEvent): void {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        const target = event.target as HTMLInputElement;
        if (target?.type !== "radio") return;
        const radios = Array.from(
            (event.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>(
                "input[type=radio]",
            ),
        );
        const index = radios.indexOf(target);
        const columns = this.columns();
        const next = radios[index + (event.key === "ArrowDown" ? columns : -columns)];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        this.choose(next.value);
    }
}
