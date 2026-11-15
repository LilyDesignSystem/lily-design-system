/**
 * `<lily-color-picker>` — Lily Design System Web Components helper (a port of the Svelte canonical package).
 *
 * Four areas in one labelled group: the recent colours; a separator; a palette of swatches (8 rows of 10 by
 * default) with a Transparent button; a separator; and fields to enter a colour by hex, CSS name, HSL, HSB, RGB
 * or CMYK. It holds a form value: it applies nothing to the document and persists nothing (listen for
 * `recentchange` to keep the recent colours). Every swatch is a native radio in the light DOM; ArrowUp and
 * ArrowDown move a whole palette row. See `./spec/index.md` for the canonical contract. This file implements the
 * class but does NOT register it; `index.ts` does.
 *
 * Attributes: `labels` (JSON; the `labels` property takes the object), `value`, `recent` (space-separated
 * colours), `max-recent`, `palette` (space-separated colours), `columns`, `name`, `disabled`, `class`.
 * Properties: `labels`, `value`, `recent`, `palette`, `colorLabel` (a function naming a swatch).
 * Events: `valuechange` (`detail: { value }`, once for each new choice) and `recentchange` (`detail: { recent }`).
 *
 * Headless: no CSS. Each swatch carries data-color and the --color-picker-swatch custom property, for the
 * consumer's CSS to paint. The one bundled asset is the Transparent button's decorative icon.
 */
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
} from "./colors.js";

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

type ModelId = "hsl" | "hsb" | "rgb" | "cmyk";
type Model = {
    id: ModelId;
    fields: Array<[key: string, label: keyof Labels, max: number]>;
    values: (hex: string) => Record<string, number>;
    toHex: (values: Record<string, number>) => string;
};
const asHex = (f: unknown) => f as (values: Record<string, number>) => string;
const MODELS: Model[] = [
    {
        id: "hsl",
        fields: [
            ["h", "hue", 360],
            ["s", "saturation", 100],
            ["l", "lightness", 100],
        ],
        values: (v) => ({ ...(hexToHsl(v) ?? { h: 0, s: 0, l: 0 }) }),
        toHex: asHex(hslToHex),
    },
    {
        id: "hsb",
        fields: [
            ["h", "hue", 360],
            ["s", "saturation", 100],
            ["b", "brightness", 100],
        ],
        values: (v) => ({ ...(hexToHsb(v) ?? { h: 0, s: 0, b: 0 }) }),
        toHex: asHex(hsbToHex),
    },
    {
        id: "rgb",
        fields: [
            ["r", "red", 255],
            ["g", "green", 255],
            ["b", "blue", 255],
        ],
        values: (v) => ({ ...(hexToRgb(v) ?? { r: 0, g: 0, b: 0 }) }),
        toHex: asHex(rgbToHex),
    },
    {
        id: "cmyk",
        fields: [
            ["c", "cyan", 100],
            ["m", "magenta", 100],
            ["y", "yellow", 100],
            ["k", "key", 100],
        ],
        values: (v) => ({ ...(hexToCmyk(v) ?? { c: 0, m: 0, y: 0, k: 100 }) }),
        toHex: asHex(cmykToHex),
    },
];

const SVG_NS = "http://www.w3.org/2000/svg";

let uid = 0;
/** A unique id prefix for one ColorPicker's radio names, datalist and fields; SSR-safe. */
export function nextColorPickerId(): string {
    uid += 1;
    return `color-picker-${uid}`;
}

function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
    text?: string,
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text !== undefined) node.textContent = text;
    return node;
}

function list(attr: string | null): string[] | null {
    return attr === null ? null : attr.split(/\s+/).filter(Boolean);
}

function parseLabels(json: string | null): Partial<Labels> {
    if (!json) return {};
    try {
        const parsed = JSON.parse(json);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

/** Custom-element class implementing `<lily-color-picker>`. */
export class ColorPicker extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "labels",
            "value",
            "recent",
            "max-recent",
            "palette",
            "columns",
            "name",
            "disabled",
            "class",
        ];
    }

    #labels: Partial<Labels> = {};
    #value = "";
    #recent: string[] = [];
    #palette: string[] | null = null;
    #colorLabel: ((color: string) => string) | undefined;
    #initial = "";
    #id = nextColorPickerId();
    #root: HTMLDivElement | null = null;
    #form: HTMLFormElement | null = null;
    #resetTimer: ReturnType<typeof setTimeout> | undefined;
    #hexInvalid = false;
    #nameInvalid = false;

    connectedCallback(): void {
        if (!this.#root) {
            if (this.hasAttribute("labels"))
                this.#labels = parseLabels(this.getAttribute("labels"));
            this.#value = this.getAttribute("value") ?? this.#value;
            this.#recent = list(this.getAttribute("recent")) ?? this.#recent;
            this.#initial = this.#value;
            this.#render();
        }
        this.#form = this.closest("form");
        this.#form?.addEventListener("reset", this.#onReset);
    }

    disconnectedCallback(): void {
        clearTimeout(this.#resetTimer);
        this.#form?.removeEventListener("reset", this.#onReset);
        this.#form = null;
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        if (name === "labels") this.#labels = parseLabels(value);
        else if (name === "value") this.#value = value ?? "";
        else if (name === "recent") this.#recent = list(value) ?? [];
        if (!this.#root) return;
        if (name === "value" || name === "recent") this.#sync();
        else this.#render();
    }

    /** Every visible and accessible word. Required: the helper ships no English. */
    get labels(): Partial<Labels> {
        return { ...this.#labels };
    }
    set labels(next: Partial<Labels> | undefined) {
        this.#labels = next && typeof next === "object" ? { ...next } : {};
        if (this.#root) this.#render();
    }

    /** The chosen colour: "#rrggbb", "transparent", or "" for none. */
    get value(): string {
        return this.#value;
    }
    set value(next: string) {
        this.#value = next ?? "";
        if (this.#root) this.#sync();
    }

    /** Recent choices, newest first. */
    get recent(): string[] {
        return [...this.#recent];
    }
    set recent(next: string[]) {
        this.#recent = Array.isArray(next) ? [...next] : [];
        if (this.#root) this.#sync();
    }

    /** The palette's colours, row by row. Default `defaultPalette()`: 8 rows of 10. */
    get palette(): string[] {
        return this.#palette ?? list(this.getAttribute("palette")) ?? defaultPalette();
    }
    set palette(next: string[] | null) {
        this.#palette = next ? [...next] : null;
        if (this.#root) this.#render();
    }

    /** A swatch's accessible name. Default: its CSS colour name when it has one, else its hex value. */
    get colorLabel(): ((color: string) => string) | undefined {
        return this.#colorLabel;
    }
    set colorLabel(next: ((color: string) => string) | undefined) {
        this.#colorLabel = typeof next === "function" ? next : undefined;
        if (this.#root) this.#render();
    }

    get columns(): number {
        const n = Number(this.getAttribute("columns"));
        return n >= 1 ? Math.trunc(n) : 10;
    }
    get maxRecent(): number {
        const n = Number(this.getAttribute("max-recent"));
        return n >= 1 ? Math.trunc(n) : 10;
    }
    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    #text(key: keyof Labels): string {
        return this.#labels[key] ?? "";
    }

    #labelOf(color: string): string {
        if (this.#colorLabel) return this.#colorLabel(color);
        if (color === TRANSPARENT) return this.#text("transparent");
        return nameOfColor(color) ?? color;
    }

    #swatch(color: string, group: string): HTMLInputElement {
        const input = el("input", {
            class: "color-picker-swatch",
            type: "radio",
            name: `${this.#id}-${group}`,
            value: color,
            "aria-label": this.#labelOf(color),
            "data-color": color,
        });
        input.style.setProperty("--color-picker-swatch", color);
        input.addEventListener("change", () => this.#choose(color));
        return input;
    }

    #render(): void {
        const id = this.#id;
        const extra = this.getAttribute("class");
        const root = el("div", {
            class: extra ? `color-picker ${extra}` : "color-picker",
            role: "group",
            "aria-label": this.#text("picker"),
        });

        if (this.hasAttribute("name"))
            root.append(el("input", { type: "hidden", name: this.getAttribute("name")! }));

        const recent = el("fieldset", {
            class: "color-picker-recent",
            role: "radiogroup",
            "aria-label": this.#text("recent"),
        });

        const palette = el("fieldset", {
            class: "color-picker-palette",
            role: "radiogroup",
            "aria-label": this.#text("palette"),
        });
        const colors = this.palette;
        const columns = this.columns;
        for (let r = 0; r * columns < colors.length; r++) {
            const row = el("div", { class: "color-picker-palette-row" });
            for (const color of colors.slice(r * columns, r * columns + columns))
                row.append(this.#swatch(color, "palette"));
            palette.append(row);
        }
        palette.addEventListener("keydown", (e) => this.#onPaletteKeydown(e));

        const transparent = el("button", { class: "color-picker-transparent", type: "button" });
        const svg = document.createElementNS(SVG_NS, "svg");
        for (const [k, v] of Object.entries({
            class: "color-picker-transparent-icon",
            viewBox: "0 0 16 16",
            "aria-hidden": "true",
            focusable: "false",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            width: "1.05rem",
            height: "1.05rem",
        }))
            svg.setAttribute(k, v);
        for (const d of ["M8 2.5 4.5 7.5a4 4 0 1 0 7 0Z", "M2.5 2.5l11 11"]) {
            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", d);
            svg.append(path);
        }
        transparent.append(svg, document.createTextNode(this.#text("transparent")));
        transparent.addEventListener("click", () => this.#choose(TRANSPARENT));

        const custom = el("div", {
            class: "color-picker-custom",
            role: "group",
            "aria-label": this.#text("custom"),
        });
        custom.append(this.#textField("hex"), this.#textField("name"));
        for (const model of MODELS) {
            const set = el("fieldset", {
                class: `color-picker-field color-picker-field-${model.id}`,
            });
            set.append(el("legend", {}, this.#text(model.id)));
            for (const [key, label, max] of model.fields) {
                const fieldId = `${id}-${model.id}-${key}`;
                const input = el("input", {
                    id: fieldId,
                    class: `color-picker-${model.id} color-picker-${model.id}-${key}`,
                    type: "number",
                    min: "0",
                    max: String(max),
                    step: "1",
                    "data-model": model.id,
                    "data-key": key,
                });
                input.addEventListener("change", () => {
                    const raw = input.valueAsNumber;
                    if (!Number.isFinite(raw)) return;
                    this.#choose(model.toHex({ ...model.values(this.#value), [key]: raw }));
                });
                set.append(el("label", { for: fieldId }, this.#text(label)), input);
            }
            custom.append(set);
        }

        root.append(
            recent,
            el("hr", { class: "color-picker-separator" }),
            palette,
            transparent,
            el("hr", { class: "color-picker-separator" }),
            custom,
        );
        this.replaceChildren(root);
        this.#root = root;
        this.#sync();
    }

    #textField(kind: "hex" | "name"): HTMLDivElement {
        const id = `${this.#id}-${kind}`;
        const wrap = el("div", { class: `color-picker-field color-picker-field-${kind}` });
        const input = el("input", {
            id,
            class: `color-picker-${kind}`,
            type: "text",
            autocomplete: "off",
            spellcheck: "false",
        });
        if (kind === "hex") input.setAttribute("inputmode", "text");
        wrap.append(el("label", { for: id }, this.#text(kind)), input);
        if (kind === "name") {
            input.setAttribute("list", `${this.#id}-names`);
            const datalist = el("datalist", { id: `${this.#id}-names` });
            for (const n of Object.keys(CSS_NAMED_COLORS))
                datalist.append(el("option", { value: n }));
            wrap.append(datalist);
        }
        const commit = () => (kind === "hex" ? this.#commitHex(input) : this.#commitName(input));
        input.addEventListener("change", commit);
        input.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            commit();
        });
        return wrap;
    }

    #setInvalid(kind: "hex" | "name", invalid: boolean): void {
        const input = this.#root?.querySelector<HTMLInputElement>(`.color-picker-${kind}`);
        if (!input) return;
        const msgId = `${this.#id}-${kind}-invalid`;
        this.#root!.querySelector(`[id="${msgId}"]`)?.remove();
        input.removeAttribute("aria-describedby");
        if (!invalid) {
            input.removeAttribute("aria-invalid");
            return;
        }
        input.setAttribute("aria-invalid", "true");
        const text = this.#labels.invalid;
        if (text) {
            input.setAttribute("aria-describedby", msgId);
            input.parentElement!.append(
                el("span", { id: msgId, class: "color-picker-invalid" }, text),
            );
        }
    }

    #commitHex(input: HTMLInputElement): void {
        const hex = normalizeHex(input.value);
        this.#hexInvalid = input.value.trim() !== "" && hex === null;
        this.#setInvalid("hex", this.#hexInvalid);
        if (hex) this.#choose(hex);
    }

    #commitName(input: HTMLInputElement): void {
        const text = input.value.trim().toLowerCase();
        const hex = CSS_NAMED_COLORS[text] ?? null;
        this.#nameInvalid = text !== "" && hex === null;
        this.#setInvalid("name", this.#nameInvalid);
        if (hex) this.#choose(hex);
    }

    /** Bring every control in step with the value and the recent list. */
    #sync(): void {
        const root = this.#root;
        if (!root) return;
        const value = this.#value;
        const disabled = this.disabled;
        if (value) root.setAttribute("data-value", value);
        else root.removeAttribute("data-value");
        const hidden = root.querySelector<HTMLInputElement>(":scope > input[type=hidden]");
        if (hidden) hidden.value = value;

        const recent = root.querySelector<HTMLFieldSetElement>(".color-picker-recent")!;
        // Choosing a recent swatch moves it to the front; moving a node drops its focus, so put focus back on it.
        const hadFocus = recent.contains(document.activeElement);
        const kept = new Map(
            Array.from(recent.querySelectorAll<HTMLInputElement>("input")).map((r) => [r.value, r]),
        );
        recent.replaceChildren(
            ...this.#recent.map((c) => kept.get(c) ?? this.#swatch(c, "recent")),
        );
        if (hadFocus) kept.get(value)?.focus();
        for (const set of root.querySelectorAll<HTMLFieldSetElement>("fieldset"))
            set.disabled = disabled;
        for (const radio of root.querySelectorAll<HTMLInputElement>("input[type=radio]"))
            radio.checked = radio.value === value;

        const transparent = root.querySelector<HTMLButtonElement>(".color-picker-transparent")!;
        transparent.setAttribute("aria-pressed", String(value === TRANSPARENT));
        transparent.disabled = disabled;

        const hex = root.querySelector<HTMLInputElement>(".color-picker-hex")!;
        const name = root.querySelector<HTMLInputElement>(".color-picker-name")!;
        hex.value = value === TRANSPARENT ? "" : value;
        name.value = nameOfColor(value) ?? "";
        hex.disabled = name.disabled = disabled;
        this.#setInvalid("hex", false);
        this.#setInvalid("name", false);
        for (const model of MODELS) {
            const values = model.values(value);
            for (const [key] of model.fields) {
                const input = root.querySelector<HTMLInputElement>(
                    `.color-picker-${model.id}-${key}`,
                )!;
                input.value = String(values[key]);
            }
        }
    }

    #choose(color: string): void {
        if (this.disabled || color === this.#value) return;
        this.#value = color;
        this.#recent = pushRecent(this.#recent, color, this.maxRecent);
        this.#sync();
        this.dispatchEvent(
            new CustomEvent("valuechange", { bubbles: true, detail: { value: color } }),
        );
        this.dispatchEvent(
            new CustomEvent("recentchange", {
                bubbles: true,
                detail: { recent: [...this.#recent] },
            }),
        );
    }

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    #onPaletteKeydown(event: KeyboardEvent): void {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        const target = event.target as HTMLInputElement;
        if (target?.type !== "radio") return;
        const radios = Array.from(
            (event.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>(
                "input[type=radio]",
            ),
        );
        const index = radios.indexOf(target);
        const columns = this.columns;
        const next = radios[index + (event.key === "ArrowDown" ? columns : -columns)];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        this.#choose(next.value);
    }

    // A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
    #onReset = (event: Event): void => {
        clearTimeout(this.#resetTimer);
        this.#resetTimer = setTimeout(() => {
            if (event.defaultPrevented) return;
            const changed = this.#value !== this.#initial;
            this.#value = this.#initial;
            this.#sync();
            if (changed)
                this.dispatchEvent(
                    new CustomEvent("valuechange", {
                        bubbles: true,
                        detail: { value: this.#initial },
                    }),
                );
        }, 0);
    };
}
