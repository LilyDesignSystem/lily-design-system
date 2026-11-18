// ColorPicker — a Lily helper (Solid 2.0 port of the Svelte canonical package).
//
// Four areas in one labelled group: the recent colours; a separator; a palette of swatches (8 rows of 10 by
// default) with a Transparent button; a separator; and fields to enter a colour by hex, CSS name, HSL, HSB, RGB
// or CMYK.
//
// It holds a form value: it applies nothing to the document and persists nothing (keep `recent` through
// `onRecentChange`). Every swatch is a native radio, so a screen reader hears "Blue, radio, 3 of 80" and a form
// reset restores the start; ArrowUp and ArrowDown move a whole palette row.
//
// Headless: no CSS. Each swatch carries data-color and the --color-picker-swatch custom property, for the
// consumer's CSS to paint. The one bundled asset is the Transparent button's decorative icon.

import type { JSX } from "@solidjs/web";
import {
    createEffect,
    createSignal,
    createUniqueId,
    For,
    omit,
    onSettled,
    untrack,
} from "solid-js";
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

export type Props = {
    /** Every visible and accessible word. Required: the helper ships no English. */
    labels: Labels;
    /** The chosen colour (controlled): "#rrggbb", "transparent", or "" for none. Pair with `onChange`. */
    value?: string;
    /** The starting colour when uncontrolled. */
    defaultValue?: string;
    /** Recent choices, newest first (controlled). Pair with `onRecentChange` to keep them. */
    recent?: string[];
    /** The starting recent choices when uncontrolled. */
    defaultRecent?: string[];
    /** How many recent colours to keep. Default 10. */
    maxRecent?: number;
    /** The palette's colours, row by row. Default `defaultPalette()`: 8 rows of 10. */
    palette?: string[];
    /** Swatches per palette row. Default 10. */
    columns?: number;
    /** A swatch's accessible name. Default: its CSS colour name when it has one, else its hex value. */
    colorLabel?: (color: string) => string;
    /** Form field name: renders a hidden input carrying the value. */
    name?: string;
    /** Disables every control. */
    disabled?: boolean;
    /** Called once for each new choice. */
    onChange?: (value: string) => void;
    /** Called with the new recent list after each new choice. */
    onRecentChange?: (recent: string[]) => void;
    class?: string;
    [key: string]: unknown;
};

let counter = 0;

/** A unique id prefix for one ColorPicker's radio names, datalist and fields. */
export function nextColorPickerId(): string {
    counter += 1;
    return `color-picker-${counter}`;
}

type ModelId = "hsl" | "hsb" | "rgb" | "cmyk";
type Model = {
    id: ModelId;
    label: string;
    fields: Array<[key: string, label: string, max: number]>;
    values: Record<string, number>;
    toHex: (values: Record<string, number>) => string;
};

function modelsOf(labels: Labels, value: string): Model[] {
    return [
        {
            id: "hsl",
            label: labels.hsl,
            fields: [
                ["h", labels.hue, 360],
                ["s", labels.saturation, 100],
                ["l", labels.lightness, 100],
            ],
            values: { ...(hexToHsl(value) ?? { h: 0, s: 0, l: 0 }) },
            toHex: hslToHex as unknown as (v: Record<string, number>) => string,
        },
        {
            id: "hsb",
            label: labels.hsb,
            fields: [
                ["h", labels.hue, 360],
                ["s", labels.saturation, 100],
                ["b", labels.brightness, 100],
            ],
            values: { ...(hexToHsb(value) ?? { h: 0, s: 0, b: 0 }) },
            toHex: hsbToHex as unknown as (v: Record<string, number>) => string,
        },
        {
            id: "rgb",
            label: labels.rgb,
            fields: [
                ["r", labels.red, 255],
                ["g", labels.green, 255],
                ["b", labels.blue, 255],
            ],
            values: { ...(hexToRgb(value) ?? { r: 0, g: 0, b: 0 }) },
            toHex: rgbToHex as unknown as (v: Record<string, number>) => string,
        },
        {
            id: "cmyk",
            label: labels.cmyk,
            fields: [
                ["c", labels.cyan, 100],
                ["m", labels.magenta, 100],
                ["y", labels.yellow, 100],
                ["k", labels.key, 100],
            ],
            values: { ...(hexToCmyk(value) ?? { c: 0, m: 0, y: 0, k: 100 }) },
            toHex: cmykToHex as unknown as (v: Record<string, number>) => string,
        },
    ];
}

const NAMES = Object.keys(CSS_NAMED_COLORS);

export function ColorPicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "labels",
        "value",
        "defaultValue",
        "recent",
        "defaultRecent",
        "maxRecent",
        "palette",
        "columns",
        "colorLabel",
        "name",
        "disabled",
        "onChange",
        "onRecentChange",
        "class",
    );
    // `createUniqueId` is stable across server and client render, so the radio names and field ids survive hydration.
    const id = `color-picker-${createUniqueId()}`;

    const [innerValue, setInnerValue] = createSignal(untrack(() => props.defaultValue ?? ""));
    const [innerRecent, setInnerRecent] = createSignal<string[]>(
        untrack(() => props.defaultRecent ?? []),
    );
    const current = () => props.value ?? innerValue();
    const recentList = () => props.recent ?? innerRecent();
    const palette = () => props.palette ?? defaultPalette();
    const columns = () => props.columns ?? 10;

    // The entry fields show the current value; a field being typed in keeps its draft until it is committed.
    const draftsOf = (color: string): Record<string, string> => {
        const drafts: Record<string, string> = {
            hex: color === TRANSPARENT ? "" : color,
            name: nameOfColor(color) ?? "",
        };
        for (const m of modelsOf(props.labels, color))
            for (const [key] of m.fields) drafts[`${m.id}-${key}`] = String(m.values[key]);
        return drafts;
    };
    const [drafts, setDrafts] = createSignal<Record<string, string>>(
        untrack(() => draftsOf(current())),
    );
    const [hexInvalid, setHexInvalid] = createSignal(false);
    const [nameInvalid, setNameInvalid] = createSignal(false);
    createEffect(current, (color) => {
        setDrafts(draftsOf(color));
        setHexInvalid(false);
        setNameInvalid(false);
    });
    const draftValue = (key: string) => drafts()[key] ?? "";
    const onDraftInput =
        (key: string) => (event: InputEvent & { currentTarget: HTMLInputElement }) => {
            const text = event.currentTarget.value;
            setDrafts((d) => ({ ...d, [key]: text }));
        };

    let root: HTMLDivElement | undefined;

    // Two choices in one update (a radio's change and a keydown, say) must see each other, before Solid has flushed
    // the first: the last choice is kept here until the next microtask.
    let latest: { value: string; recent: string[] } | null = null;
    function choose(color: string): void {
        const base = latest ?? { value: untrack(current), recent: untrack(recentList) };
        if (props.disabled || color === base.value) return;
        const nextRecent = pushRecent(base.recent, color, props.maxRecent ?? 10);
        latest = { value: color, recent: nextRecent };
        queueMicrotask(() => (latest = null));
        setInnerValue(color);
        setInnerRecent(nextRecent);
        props.onChange?.(color);
        props.onRecentChange?.(nextRecent);
    }

    const labelOf = (color: string): string => {
        if (props.colorLabel) return props.colorLabel(color);
        if (color === TRANSPARENT) return props.labels.transparent;
        return nameOfColor(color) ?? color;
    };

    const rows = () =>
        Array.from({ length: Math.ceil(palette().length / columns()) }, (_, r) =>
            palette().slice(r * columns(), r * columns() + columns()),
        );
    // The fields' shape (ids, labels, ranges) depends only on the labels, so the number inputs are not re-created, and
    // do not lose focus, when the colour changes; their values come from the drafts.
    const models = () => modelsOf(props.labels, TRANSPARENT);

    function commitHex(raw: string): void {
        const hex = normalizeHex(raw);
        setHexInvalid(raw.trim() !== "" && hex === null);
        if (hex) choose(hex);
    }

    function commitName(raw: string): void {
        const text = raw.trim().toLowerCase();
        const hex = CSS_NAMED_COLORS[text] ?? null;
        setNameInvalid(text !== "" && hex === null);
        if (hex) choose(hex);
    }

    // The entry fields apply on the native change event (Enter or leaving the field, or a spinner step), as the
    // Svelte reference does, not on every keystroke, which would choose "1", "12" and "120". change bubbles, so
    // one listener on the group hears every field.
    function onCustomChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const kind = target.dataset.field;
        if (kind === "hex") commitHex(target.value);
        else if (kind === "name") commitName(target.value);
        else if (kind) {
            const model = modelsOf(props.labels, untrack(current)).find((m) => m.id === kind);
            const key = target.dataset.key!;
            const raw = target.valueAsNumber;
            if (model && Number.isFinite(raw)) choose(model.toHex({ ...model.values, [key]: raw }));
        }
    }

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    function onPaletteKeyDown(event: KeyboardEvent & { currentTarget: HTMLFieldSetElement }): void {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        const target = event.target as HTMLInputElement;
        if (target?.type !== "radio") return;
        const radios = Array.from(
            event.currentTarget.querySelectorAll<HTMLInputElement>("input[type=radio]"),
        );
        const index = radios.indexOf(target);
        const next = radios[index + (event.key === "ArrowDown" ? columns() : -columns())];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        choose(next.value);
    }

    // A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
    const initialValue = untrack(current);
    onSettled(() => {
        const form = root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                const before = untrack(current);
                setInnerValue(initialValue);
                if (before !== initialValue) props.onChange?.(initialValue);
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });

    const swatch = (color: string, group: string) => (
        <input
            class="color-picker-swatch"
            type="radio"
            name={`${id}-${group}`}
            value={color}
            checked={color === current()}
            defaultChecked={color === current()}
            aria-label={labelOf(color)}
            data-color={color}
            style={{ "--color-picker-swatch": color }}
            onChange={() => choose(color)}
        />
    );

    return (
        <div
            ref={(el) => (root = el)}
            class={`color-picker ${props.class ?? ""}`}
            role="group"
            aria-label={props.labels.picker}
            data-value={current() || undefined}
            {...rest}
        >
            {props.name ? (
                <input
                    type="hidden"
                    name={props.name}
                    value={current()}
                />
            ) : null}

            <fieldset
                class="color-picker-recent"
                role="radiogroup"
                aria-label={props.labels.recent}
                disabled={props.disabled ?? false}
            >
                <For each={recentList()}>{(color) => swatch(color, "recent")}</For>
            </fieldset>

            <hr class="color-picker-separator" />

            <fieldset
                class="color-picker-palette"
                role="radiogroup"
                aria-label={props.labels.palette}
                disabled={props.disabled ?? false}
                onKeyDown={onPaletteKeyDown}
            >
                <For
                    each={rows()}
                    keyed={false}
                >
                    {(row) => (
                        <div class="color-picker-palette-row">
                            <For
                                each={row()}
                                keyed={false}
                            >
                                {(color) => swatch(color(), "palette")}
                            </For>
                        </div>
                    )}
                </For>
            </fieldset>

            <button
                class="color-picker-transparent"
                type="button"
                aria-pressed={current() === TRANSPARENT ? "true" : "false"}
                disabled={props.disabled ?? false}
                onClick={() => choose(TRANSPARENT)}
            >
                <svg
                    class="color-picker-transparent-icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    // Keeps old Edge and IE from putting the icon in the Tab order; Solid's SVG types omit it.
                    {...({ focusable: "false" } as Record<string, string>)}
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
                {props.labels.transparent}
            </button>

            <hr class="color-picker-separator" />

            <div
                class="color-picker-custom"
                role="group"
                aria-label={props.labels.custom}
                onChange={onCustomChange}
            >
                <div class="color-picker-field color-picker-field-hex">
                    <label for={`${id}-hex`}>{props.labels.hex}</label>
                    <input
                        id={`${id}-hex`}
                        class="color-picker-hex"
                        type="text"
                        inputmode="text"
                        autocomplete="off"
                        spellcheck="false"
                        disabled={props.disabled ?? false}
                        value={draftValue("hex")}
                        defaultValue={draftValue("hex")}
                        onInput={onDraftInput("hex")}
                        data-field="hex"
                        aria-invalid={hexInvalid() ? "true" : undefined}
                        aria-describedby={
                            hexInvalid() && props.labels.invalid ? `${id}-hex-invalid` : undefined
                        }
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            e.preventDefault();
                            commitHex(e.currentTarget.value);
                        }}
                    />
                    {hexInvalid() && props.labels.invalid ? (
                        <span
                            id={`${id}-hex-invalid`}
                            class="color-picker-invalid"
                        >
                            {props.labels.invalid}
                        </span>
                    ) : null}
                </div>

                <div class="color-picker-field color-picker-field-name">
                    <label for={`${id}-name`}>{props.labels.name}</label>
                    <input
                        id={`${id}-name`}
                        class="color-picker-name"
                        type="text"
                        list={`${id}-names`}
                        autocomplete="off"
                        spellcheck="false"
                        disabled={props.disabled ?? false}
                        value={draftValue("name")}
                        defaultValue={draftValue("name")}
                        onInput={onDraftInput("name")}
                        data-field="name"
                        aria-invalid={nameInvalid() ? "true" : undefined}
                        aria-describedby={
                            nameInvalid() && props.labels.invalid ? `${id}-name-invalid` : undefined
                        }
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            e.preventDefault();
                            commitName(e.currentTarget.value);
                        }}
                    />
                    <datalist id={`${id}-names`}>
                        <For each={NAMES}>{(n) => <option value={n} />}</For>
                    </datalist>
                    {nameInvalid() && props.labels.invalid ? (
                        <span
                            id={`${id}-name-invalid`}
                            class="color-picker-invalid"
                        >
                            {props.labels.invalid}
                        </span>
                    ) : null}
                </div>

                <For each={models()}>
                    {(model) => (
                        <fieldset
                            class={`color-picker-field color-picker-field-${model.id}`}
                            disabled={props.disabled ?? false}
                        >
                            <legend>{model.label}</legend>
                            <For each={model.fields}>
                                {([key, text, max]) => (
                                    <>
                                        <label for={`${id}-${model.id}-${key}`}>{text}</label>
                                        <input
                                            id={`${id}-${model.id}-${key}`}
                                            class={`color-picker-${model.id} color-picker-${model.id}-${key}`}
                                            type="number"
                                            min="0"
                                            max={max}
                                            step="1"
                                            disabled={props.disabled ?? false}
                                            value={draftValue(`${model.id}-${key}`)}
                                            defaultValue={draftValue(`${model.id}-${key}`)}
                                            onInput={onDraftInput(`${model.id}-${key}`)}
                                            data-field={model.id}
                                            data-key={key}
                                        />
                                    </>
                                )}
                            </For>
                        </fieldset>
                    )}
                </For>
            </div>
        </div>
    );
}

export default ColorPicker;
