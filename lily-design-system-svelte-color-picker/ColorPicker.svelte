<script
    module
    lang="ts"
>
    let counter = 0;

    /** A unique id prefix for one ColorPicker's radio names, datalist and fields. */
    export function nextColorPickerId(): string {
        counter += 1;
        return `color-picker-${counter}`;
    }

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

    export interface Props {
        /** Every visible and accessible word. Required: the helper ships no English. */
        labels: Labels;
        /** The chosen colour: "#rrggbb", "transparent", or "" for none. Bindable. */
        value?: string;
        /** Recent choices, newest first, at most `maxRecent`. Bindable, so the app can keep them. */
        recent?: string[];
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
        onchange?: (value: string) => void;
        class?: string;
        [key: string]: unknown;
    }
</script>

<script lang="ts">
    // ColorPicker — a Lily helper (Svelte canonical).
    //
    // Four areas in one labelled group: the recent colours; a separator; a palette of swatches (8 rows of 10 by
    // default) with a Transparent button; a separator; and fields to enter a colour by hex, CSS name, HSL or RGB.
    //
    // It holds a form value, as date-time-picker does: it applies nothing to the document and persists nothing (bind
    // `recent` to keep the recent colours). Every swatch is a native radio, so a screen reader hears "Blue, radio, 3 of
    // 80" and a form reset restores the start; ArrowUp and ArrowDown move a whole palette row.
    //
    // Headless: no CSS. Each swatch carries data-color and the --color-picker-swatch custom property, for the
    // consumer's CSS to paint. The one bundled asset is the Transparent button's decorative icon.
    import { untrack } from "svelte";
    import {
        CSS_NAMED_COLORS,
        TRANSPARENT,
        defaultPalette,
        cmykToHex,
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

    let {
        labels,
        value = $bindable(""),
        recent = $bindable([]),
        maxRecent = 10,
        palette = defaultPalette(),
        columns = 10,
        colorLabel = undefined,
        name = undefined,
        disabled = false,
        onchange = undefined,
        class: className = "",
        ...restProps
    }: Props = $props();

    const id = nextColorPickerId();
    const names = Object.keys(CSS_NAMED_COLORS);

    const labelOf = (color: string): string => {
        if (colorLabel) return colorLabel(color);
        if (color === TRANSPARENT) return labels.transparent;
        return nameOfColor(color) ?? color;
    };

    const rows = $derived(
        Array.from({ length: Math.ceil(palette.length / columns) }, (_, r) =>
            palette.slice(r * columns, r * columns + columns),
        ),
    );

    // The entry fields show the current value; a field being typed in keeps its draft until it is committed.
    let hexDraft = $state(untrack(() => (value === TRANSPARENT ? "" : value)));
    let nameDraft = $state(untrack(() => nameOfColor(value) ?? ""));
    let hexInvalid = $state(false);
    let nameInvalid = $state(false);
    // The four colour models: each a group of number fields that show the current value and change it.
    type Model = {
        id: "hsl" | "hsb" | "rgb" | "cmyk";
        label: string;
        fields: Array<[key: string, label: string, max: number]>;
        values: Record<string, number>;
        toHex: (values: never) => string;
    };
    const models: Model[] = $derived([
        {
            id: "hsl",
            label: labels.hsl,
            fields: [
                ["h", labels.hue, 360],
                ["s", labels.saturation, 100],
                ["l", labels.lightness, 100],
            ],
            values: { ...(hexToHsl(value) ?? { h: 0, s: 0, l: 0 }) },
            toHex: hslToHex,
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
            toHex: hsbToHex,
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
            toHex: rgbToHex,
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
            toHex: cmykToHex,
        },
    ]);

    $effect(() => {
        const v = value;
        untrack(() => {
            hexDraft = v === TRANSPARENT ? "" : v;
            nameDraft = nameOfColor(v) ?? "";
            hexInvalid = false;
            nameInvalid = false;
        });
    });

    function choose(color: string) {
        if (disabled || color === value) return;
        value = color;
        recent = pushRecent(recent, color, maxRecent);
        onchange?.(color);
    }

    function commitHex() {
        const hex = normalizeHex(hexDraft);
        hexInvalid = hexDraft.trim() !== "" && hex === null;
        if (hex) choose(hex);
    }

    function commitName() {
        const text = nameDraft.trim().toLowerCase();
        const hex = CSS_NAMED_COLORS[text] ?? null;
        nameInvalid = text !== "" && hex === null;
        if (hex) choose(hex);
    }

    function commitModel(model: Model, key: string, raw: number) {
        if (!Number.isFinite(raw)) return;
        choose(
            (model.toHex as (v: Record<string, number>) => string)({ ...model.values, [key]: raw }),
        );
    }

    // Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
    function onPaletteKeydown(event: KeyboardEvent) {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        const target = event.target as HTMLInputElement;
        if (target?.type !== "radio") return;
        const radios = [
            ...(event.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>(
                "input[type=radio]",
            ),
        ];
        const index = radios.indexOf(target);
        const next = radios[index + (event.key === "ArrowDown" ? columns : -columns)];
        event.preventDefault();
        if (!next) return;
        next.focus();
        next.checked = true;
        choose(next.value);
    }

    // A form reset puts the starting colour back.
    let root: HTMLDivElement | undefined = $state();
    const initialValue = untrack(() => value);
    $effect(() => {
        const form = root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!event.defaultPrevented) value = initialValue;
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });
</script>

<!-- ColorPicker.svelte -->
<div
    bind:this={root}
    class={`color-picker ${className}`}
    role="group"
    aria-label={labels.picker}
    data-value={value || undefined}
    {...restProps}
>
    {#if name}
        <input
            type="hidden"
            {name}
            {value}
        />
    {/if}

    <fieldset
        class="color-picker-recent"
        role="radiogroup"
        aria-label={labels.recent}
        {disabled}
    >
        {#each recent as color (color)}
            <input
                class="color-picker-swatch"
                type="radio"
                name={`${id}-recent`}
                value={color}
                checked={color === value}
                aria-label={labelOf(color)}
                data-color={color}
                style:--color-picker-swatch={color}
                onchange={() => choose(color)}
            />
        {/each}
    </fieldset>

    <hr class="color-picker-separator" />

    <fieldset
        class="color-picker-palette"
        role="radiogroup"
        aria-label={labels.palette}
        {disabled}
        onkeydown={onPaletteKeydown}
    >
        {#each rows as row, r (r)}
            <div class="color-picker-palette-row">
                {#each row as color, c (c)}
                    <input
                        class="color-picker-swatch"
                        type="radio"
                        name={`${id}-palette`}
                        value={color}
                        checked={color === value}
                        aria-label={labelOf(color)}
                        data-color={color}
                        style:--color-picker-swatch={color}
                        onchange={() => choose(color)}
                    />
                {/each}
            </div>
        {/each}
    </fieldset>

    <button
        class="color-picker-transparent"
        type="button"
        aria-pressed={value === TRANSPARENT}
        {disabled}
        onclick={() => choose(TRANSPARENT)}
    >
        <svg
            class="color-picker-transparent-icon"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="1.05rem"
            height="1.05rem"
            ><path d="M8 2.5 4.5 7.5a4 4 0 1 0 7 0Z" /><path d="M2.5 2.5l11 11" /></svg
        >
        {labels.transparent}
    </button>

    <hr class="color-picker-separator" />

    <div
        class="color-picker-custom"
        role="group"
        aria-label={labels.custom}
    >
        <div class="color-picker-field color-picker-field-hex">
            <label for={`${id}-hex`}>{labels.hex}</label>
            <input
                id={`${id}-hex`}
                class="color-picker-hex"
                type="text"
                inputmode="text"
                autocomplete="off"
                spellcheck="false"
                {disabled}
                bind:value={hexDraft}
                aria-invalid={hexInvalid || undefined}
                aria-describedby={hexInvalid && labels.invalid ? `${id}-hex-invalid` : undefined}
                onchange={commitHex}
                onkeydown={(e) => e.key === "Enter" && (e.preventDefault(), commitHex())}
            />
            {#if hexInvalid && labels.invalid}
                <span
                    id={`${id}-hex-invalid`}
                    class="color-picker-invalid">{labels.invalid}</span
                >
            {/if}
        </div>

        <div class="color-picker-field color-picker-field-name">
            <label for={`${id}-name`}>{labels.name}</label>
            <input
                id={`${id}-name`}
                class="color-picker-name"
                type="text"
                list={`${id}-names`}
                autocomplete="off"
                spellcheck="false"
                {disabled}
                bind:value={nameDraft}
                aria-invalid={nameInvalid || undefined}
                aria-describedby={nameInvalid && labels.invalid ? `${id}-name-invalid` : undefined}
                onchange={commitName}
                onkeydown={(e) => e.key === "Enter" && (e.preventDefault(), commitName())}
            />
            <datalist id={`${id}-names`}>
                {#each names as n (n)}
                    <option value={n}></option>
                {/each}
            </datalist>
            {#if nameInvalid && labels.invalid}
                <span
                    id={`${id}-name-invalid`}
                    class="color-picker-invalid">{labels.invalid}</span
                >
            {/if}
        </div>

        {#each models as model (model.id)}
            <fieldset
                class={`color-picker-field color-picker-field-${model.id}`}
                {disabled}
            >
                <legend>{model.label}</legend>
                {#each model.fields as [key, text, max] (key)}
                    <label for={`${id}-${model.id}-${key}`}>{text}</label>
                    <input
                        id={`${id}-${model.id}-${key}`}
                        class={`color-picker-${model.id} color-picker-${model.id}-${key}`}
                        type="number"
                        min="0"
                        {max}
                        step="1"
                        value={model.values[key]}
                        onchange={(e) => commitModel(model, key, e.currentTarget.valueAsNumber)}
                    />
                {/each}
            </fieldset>
        {/each}
    </div>
</div>
