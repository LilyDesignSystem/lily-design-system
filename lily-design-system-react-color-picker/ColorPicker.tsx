// ColorPicker — a Lily helper (React port of the Svelte canonical package).
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

import * as React from "react";
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
    className?: string;
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

export default function ColorPicker({
    labels,
    value,
    defaultValue = "",
    recent,
    defaultRecent = [],
    maxRecent = 10,
    palette = defaultPalette(),
    columns = 10,
    colorLabel,
    name,
    disabled = false,
    onChange,
    onRecentChange,
    className = "",
    ...restProps
}: Props) {
    const generated = React.useRef<string | undefined>(undefined);
    if (!generated.current) generated.current = nextColorPickerId();
    const id = generated.current;

    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const [innerRecent, setInnerRecent] = React.useState<string[]>(defaultRecent);
    const current = value ?? innerValue;
    const recentList = recent ?? innerRecent;

    // The entry fields show the current value; a field being typed in keeps its draft until it is committed.
    const draftsOf = (color: string): Record<string, string> => {
        const drafts: Record<string, string> = {
            hex: color === TRANSPARENT ? "" : color,
            name: nameOfColor(color) ?? "",
        };
        for (const m of modelsOf(labels, color))
            for (const [key] of m.fields) drafts[`${m.id}-${key}`] = String(m.values[key]);
        return drafts;
    };
    const [drafts, setDrafts] = React.useState(() => draftsOf(current));
    const [hexInvalid, setHexInvalid] = React.useState(false);
    const [nameInvalid, setNameInvalid] = React.useState(false);
    React.useEffect(() => {
        setDrafts(draftsOf(current));
        setHexInvalid(false);
        setNameInvalid(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);
    const draft = (key: string) => ({
        value: drafts[key] ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const text = e.currentTarget.value;
            setDrafts((d) => ({ ...d, [key]: text }));
        },
    });

    const root = React.useRef<HTMLDivElement>(null);
    const custom = React.useRef<HTMLDivElement>(null);
    const latest = React.useRef({
        current,
        recentList,
        disabled,
        onChange,
        onRecentChange,
        maxRecent,
    });
    latest.current = { current, recentList, disabled, onChange, onRecentChange, maxRecent };

    const choose = React.useCallback((color: string) => {
        const l = latest.current;
        if (l.disabled || color === l.current) return;
        const nextRecent = pushRecent(l.recentList, color, l.maxRecent);
        setInnerValue(color);
        setInnerRecent(nextRecent);
        l.current = color;
        l.recentList = nextRecent;
        l.onChange?.(color);
        l.onRecentChange?.(nextRecent);
    }, []);

    const labelOf = (color: string): string => {
        if (colorLabel) return colorLabel(color);
        if (color === TRANSPARENT) return labels.transparent;
        return nameOfColor(color) ?? color;
    };

    const rows = Array.from({ length: Math.ceil(palette.length / columns) }, (_, r) =>
        palette.slice(r * columns, r * columns + columns),
    );
    const models = modelsOf(labels, current);
    const modelsRef = React.useRef(models);
    modelsRef.current = models;

    function commitHex(raw: string) {
        const hex = normalizeHex(raw);
        setHexInvalid(raw.trim() !== "" && hex === null);
        if (hex) choose(hex);
    }

    function commitName(raw: string) {
        const text = raw.trim().toLowerCase();
        const hex = CSS_NAMED_COLORS[text] ?? null;
        setNameInvalid(text !== "" && hex === null);
        if (hex) choose(hex);
    }

    // The entry fields apply on the native change event (Enter or leaving the field, or a spinner step), as the
    // Svelte reference does; React's onChange fires on every keystroke, which would choose "1", "12" and "120".
    React.useEffect(() => {
        const el = custom.current;
        if (!el) return;
        const onNativeChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const kind = target.dataset.field;
            if (kind === "hex") commitHex(target.value);
            else if (kind === "name") commitName(target.value);
            else if (kind) {
                const model = modelsRef.current.find((m) => m.id === kind);
                const key = target.dataset.key!;
                const raw = target.valueAsNumber;
                if (model && Number.isFinite(raw))
                    choose(model.toHex({ ...model.values, [key]: raw }));
            }
        };
        el.addEventListener("change", onNativeChange);
        return () => el.removeEventListener("change", onNativeChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    function onPaletteKeyDown(event: React.KeyboardEvent<HTMLFieldSetElement>) {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        const target = event.target as HTMLInputElement;
        if (target?.type !== "radio") return;
        const radios = Array.from(
            event.currentTarget.querySelectorAll<HTMLInputElement>("input[type=radio]"),
        );
        const index = radios.indexOf(target);
        const next = radios[index + (event.key === "ArrowDown" ? columns : -columns)];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        choose(next.value);
    }

    // A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
    const initialValue = React.useRef(current);
    React.useEffect(() => {
        const form = root.current?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented) return;
                const start = initialValue.current;
                setInnerValue(start);
                if (latest.current.current !== start) latest.current.onChange?.(start);
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    }, []);

    const swatch = (color: string, group: string, key: React.Key) => (
        <input
            key={key}
            className="color-picker-swatch"
            type="radio"
            name={`${id}-${group}`}
            value={color}
            checked={color === current}
            aria-label={labelOf(color)}
            data-color={color}
            style={{ "--color-picker-swatch": color } as React.CSSProperties}
            onChange={() => choose(color)}
        />
    );

    return (
        <div
            ref={root}
            className={`color-picker ${className}`}
            role="group"
            aria-label={labels.picker}
            data-value={current || undefined}
            {...restProps}
        >
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    value={current}
                />
            ) : null}

            <fieldset
                className="color-picker-recent"
                role="radiogroup"
                aria-label={labels.recent}
                disabled={disabled}
            >
                {recentList.map((color) => swatch(color, "recent", color))}
            </fieldset>

            <hr className="color-picker-separator" />

            <fieldset
                className="color-picker-palette"
                role="radiogroup"
                aria-label={labels.palette}
                disabled={disabled}
                onKeyDown={onPaletteKeyDown}
            >
                {rows.map((row, r) => (
                    <div
                        key={r}
                        className="color-picker-palette-row"
                    >
                        {row.map((color, c) => swatch(color, "palette", c))}
                    </div>
                ))}
            </fieldset>

            <button
                className="color-picker-transparent"
                type="button"
                aria-pressed={current === TRANSPARENT}
                disabled={disabled}
                onClick={() => choose(TRANSPARENT)}
            >
                <svg
                    className="color-picker-transparent-icon"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="1.05rem"
                    height="1.05rem"
                >
                    <path d="M8 2.5 4.5 7.5a4 4 0 1 0 7 0Z" />
                    <path d="M2.5 2.5l11 11" />
                </svg>
                {labels.transparent}
            </button>

            <hr className="color-picker-separator" />

            <div
                ref={custom}
                className="color-picker-custom"
                role="group"
                aria-label={labels.custom}
            >
                <div className="color-picker-field color-picker-field-hex">
                    <label htmlFor={`${id}-hex`}>{labels.hex}</label>
                    <input
                        id={`${id}-hex`}
                        className="color-picker-hex"
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        spellCheck={false}
                        disabled={disabled}
                        {...draft("hex")}
                        data-field="hex"
                        aria-invalid={hexInvalid || undefined}
                        aria-describedby={
                            hexInvalid && labels.invalid ? `${id}-hex-invalid` : undefined
                        }
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            e.preventDefault();
                            commitHex(e.currentTarget.value);
                        }}
                    />
                    {hexInvalid && labels.invalid ? (
                        <span
                            id={`${id}-hex-invalid`}
                            className="color-picker-invalid"
                        >
                            {labels.invalid}
                        </span>
                    ) : null}
                </div>

                <div className="color-picker-field color-picker-field-name">
                    <label htmlFor={`${id}-name`}>{labels.name}</label>
                    <input
                        id={`${id}-name`}
                        className="color-picker-name"
                        type="text"
                        list={`${id}-names`}
                        autoComplete="off"
                        spellCheck={false}
                        disabled={disabled}
                        {...draft("name")}
                        data-field="name"
                        aria-invalid={nameInvalid || undefined}
                        aria-describedby={
                            nameInvalid && labels.invalid ? `${id}-name-invalid` : undefined
                        }
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return;
                            e.preventDefault();
                            commitName(e.currentTarget.value);
                        }}
                    />
                    <datalist id={`${id}-names`}>
                        {NAMES.map((n) => (
                            <option
                                key={n}
                                value={n}
                            />
                        ))}
                    </datalist>
                    {nameInvalid && labels.invalid ? (
                        <span
                            id={`${id}-name-invalid`}
                            className="color-picker-invalid"
                        >
                            {labels.invalid}
                        </span>
                    ) : null}
                </div>

                {models.map((model) => (
                    <fieldset
                        key={model.id}
                        className={`color-picker-field color-picker-field-${model.id}`}
                        disabled={disabled}
                    >
                        <legend>{model.label}</legend>
                        {model.fields.map(([key, text, max]) => (
                            <React.Fragment key={key}>
                                <label htmlFor={`${id}-${model.id}-${key}`}>{text}</label>
                                <input
                                    id={`${id}-${model.id}-${key}`}
                                    className={`color-picker-${model.id} color-picker-${model.id}-${key}`}
                                    type="number"
                                    min="0"
                                    max={max}
                                    step="1"
                                    disabled={disabled}
                                    {...draft(`${model.id}-${key}`)}
                                    data-field={model.id}
                                    data-key={key}
                                />
                            </React.Fragment>
                        ))}
                    </fieldset>
                ))}
            </div>
        </div>
    );
}

export { ColorPicker };
