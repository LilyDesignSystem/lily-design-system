<script lang="ts">
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
    /** The chosen colour: "#rrggbb", "transparent", or "" for none. Use with `v-model`. */
    modelValue?: string;
    /** Recent choices, newest first, at most `maxRecent`. Use with `v-model:recent` to keep them. */
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
};

let counter = 0;

/** A unique id prefix for one ColorPicker's radio names, datalist and fields. */
export function nextColorPickerId(): string {
    counter += 1;
    return `color-picker-${counter}`;
}
</script>

<script setup lang="ts">
// ColorPicker — a Lily helper (Vue port of the Svelte canonical package).
//
// Four areas in one labelled group: the recent colours; a separator; a palette of swatches (8 rows of 10 by
// default) with a Transparent button; a separator; and fields to enter a colour by hex, CSS name, HSL, HSB, RGB
// or CMYK. It holds a form value: it applies nothing to the document and persists nothing.
//
// Emits: `update:modelValue` and `change` (once per new choice), `update:recent`.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    recent: () => [],
    maxRecent: 10,
    palette: () => defaultPalette(),
    columns: 10,
    colorLabel: undefined,
    name: undefined,
    disabled: false,
});
const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "change", value: string): void;
    (e: "update:recent", recent: string[]): void;
}>();

const id = nextColorPickerId();
const names = Object.keys(CSS_NAMED_COLORS);

const current = ref(props.modelValue);
const recentList = ref<string[]>([...props.recent]);
watch(
    () => props.modelValue,
    (v) => {
        current.value = v;
    },
);
watch(
    () => props.recent,
    (v) => {
        recentList.value = [...v];
    },
);

function labelOf(color: string): string {
    if (props.colorLabel) return props.colorLabel(color);
    if (color === TRANSPARENT) return props.labels.transparent;
    return nameOfColor(color) ?? color;
}

const rows = computed(() =>
    Array.from({ length: Math.ceil(props.palette.length / props.columns) }, (_, r) =>
        props.palette.slice(r * props.columns, r * props.columns + props.columns),
    ),
);

type Model = {
    id: "hsl" | "hsb" | "rgb" | "cmyk";
    label: string;
    fields: Array<[key: string, label: string, max: number]>;
    values: Record<string, number>;
    toHex: (values: Record<string, number>) => string;
};
const asHex = (f: unknown) => f as (values: Record<string, number>) => string;
const models = computed<Model[]>(() => {
    const l = props.labels;
    const v = current.value;
    return [
        {
            id: "hsl",
            label: l.hsl,
            fields: [
                ["h", l.hue, 360],
                ["s", l.saturation, 100],
                ["l", l.lightness, 100],
            ],
            values: { ...(hexToHsl(v) ?? { h: 0, s: 0, l: 0 }) },
            toHex: asHex(hslToHex),
        },
        {
            id: "hsb",
            label: l.hsb,
            fields: [
                ["h", l.hue, 360],
                ["s", l.saturation, 100],
                ["b", l.brightness, 100],
            ],
            values: { ...(hexToHsb(v) ?? { h: 0, s: 0, b: 0 }) },
            toHex: asHex(hsbToHex),
        },
        {
            id: "rgb",
            label: l.rgb,
            fields: [
                ["r", l.red, 255],
                ["g", l.green, 255],
                ["b", l.blue, 255],
            ],
            values: { ...(hexToRgb(v) ?? { r: 0, g: 0, b: 0 }) },
            toHex: asHex(rgbToHex),
        },
        {
            id: "cmyk",
            label: l.cmyk,
            fields: [
                ["c", l.cyan, 100],
                ["m", l.magenta, 100],
                ["y", l.yellow, 100],
                ["k", l.key, 100],
            ],
            values: { ...(hexToCmyk(v) ?? { c: 0, m: 0, y: 0, k: 100 }) },
            toHex: asHex(cmykToHex),
        },
    ];
});

// The entry fields show the current value; a field being typed in keeps its draft until it is committed.
const hexDraft = ref(current.value === TRANSPARENT ? "" : current.value);
const nameDraft = ref(nameOfColor(current.value) ?? "");
const hexInvalid = ref(false);
const nameInvalid = ref(false);
watch(current, (v) => {
    hexDraft.value = v === TRANSPARENT ? "" : v;
    nameDraft.value = nameOfColor(v) ?? "";
    hexInvalid.value = false;
    nameInvalid.value = false;
});

function choose(color: string): void {
    if (props.disabled || color === current.value) return;
    current.value = color;
    recentList.value = pushRecent(recentList.value, color, props.maxRecent);
    emit("update:modelValue", color);
    emit("update:recent", recentList.value);
    emit("change", color);
}

function commitHex(): void {
    const hex = normalizeHex(hexDraft.value);
    hexInvalid.value = hexDraft.value.trim() !== "" && hex === null;
    if (hex) choose(hex);
}

function commitName(): void {
    const text = nameDraft.value.trim().toLowerCase();
    const hex = CSS_NAMED_COLORS[text] ?? null;
    nameInvalid.value = text !== "" && hex === null;
    if (hex) choose(hex);
}

function commitModel(model: Model, key: string, event: Event): void {
    const raw = (event.currentTarget as HTMLInputElement).valueAsNumber;
    if (!Number.isFinite(raw)) return;
    choose(model.toHex({ ...model.values, [key]: raw }));
}

function onEnter(event: KeyboardEvent, commit: () => void): void {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commit();
}

// Native radios move one swatch with Left and Right; Up and Down move a whole row, as the grid looks.
function onPaletteKeydown(event: KeyboardEvent): void {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const target = event.target as HTMLInputElement;
    if (target?.type !== "radio") return;
    const radios = Array.from(
        (event.currentTarget as HTMLElement).querySelectorAll<HTMLInputElement>(
            "input[type=radio]",
        ),
    );
    const index = radios.indexOf(target);
    const next = radios[index + (event.key === "ArrowDown" ? props.columns : -props.columns)];
    event.preventDefault();
    if (!next) return;
    next.focus();
    next.checked = true;
    choose(next.value);
}

// A form reset puts the starting colour back, one tick after the reset (not when a listener cancelled it).
const root = ref<HTMLDivElement | null>(null);
const initialValue = props.modelValue;
let resetForm: HTMLFormElement | null = null;
let resetTimer: ReturnType<typeof setTimeout> | undefined;
function onFormReset(event: Event): void {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        if (event.defaultPrevented) return;
        const changed = current.value !== initialValue;
        current.value = initialValue;
        if (changed) {
            emit("update:modelValue", initialValue);
            emit("change", initialValue);
        }
    }, 0);
}
onMounted(() => {
    resetForm = root.value?.closest("form") ?? null;
    resetForm?.addEventListener("reset", onFormReset);
});
onBeforeUnmount(() => {
    clearTimeout(resetTimer);
    resetForm?.removeEventListener("reset", onFormReset);
});
</script>

<template>
    <div
        ref="root"
        class="color-picker"
        role="group"
        :aria-label="labels.picker"
        :data-value="current || undefined"
    >
        <input
            v-if="name"
            type="hidden"
            :name="name"
            :value="current"
        />

        <fieldset
            class="color-picker-recent"
            role="radiogroup"
            :aria-label="labels.recent"
            :disabled="disabled"
        >
            <input
                v-for="color in recentList"
                :key="color"
                class="color-picker-swatch"
                type="radio"
                :name="`${id}-recent`"
                :value="color"
                :checked="color === current"
                :aria-label="labelOf(color)"
                :data-color="color"
                :style="{ '--color-picker-swatch': color }"
                @change="choose(color)"
            />
        </fieldset>

        <hr class="color-picker-separator" />

        <fieldset
            class="color-picker-palette"
            role="radiogroup"
            :aria-label="labels.palette"
            :disabled="disabled"
            @keydown="onPaletteKeydown"
        >
            <div
                v-for="(row, r) in rows"
                :key="r"
                class="color-picker-palette-row"
            >
                <input
                    v-for="(color, c) in row"
                    :key="c"
                    class="color-picker-swatch"
                    type="radio"
                    :name="`${id}-palette`"
                    :value="color"
                    :checked="color === current"
                    :aria-label="labelOf(color)"
                    :data-color="color"
                    :style="{ '--color-picker-swatch': color }"
                    @change="choose(color)"
                />
            </div>
        </fieldset>

        <button
            class="color-picker-transparent"
            type="button"
            :aria-pressed="current === TRANSPARENT ? 'true' : 'false'"
            :disabled="disabled"
            @click="choose(TRANSPARENT)"
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
            {{ labels.transparent }}
        </button>

        <hr class="color-picker-separator" />

        <div
            class="color-picker-custom"
            role="group"
            :aria-label="labels.custom"
        >
            <div class="color-picker-field color-picker-field-hex">
                <label :for="`${id}-hex`">{{ labels.hex }}</label>
                <input
                    :id="`${id}-hex`"
                    v-model="hexDraft"
                    class="color-picker-hex"
                    type="text"
                    inputmode="text"
                    autocomplete="off"
                    spellcheck="false"
                    :disabled="disabled"
                    :aria-invalid="hexInvalid ? 'true' : undefined"
                    :aria-describedby="
                        hexInvalid && labels.invalid ? `${id}-hex-invalid` : undefined
                    "
                    @change="commitHex"
                    @keydown="onEnter($event, commitHex)"
                />
                <span
                    v-if="hexInvalid && labels.invalid"
                    :id="`${id}-hex-invalid`"
                    class="color-picker-invalid"
                    >{{ labels.invalid }}</span
                >
            </div>

            <div class="color-picker-field color-picker-field-name">
                <label :for="`${id}-name`">{{ labels.name }}</label>
                <input
                    :id="`${id}-name`"
                    v-model="nameDraft"
                    class="color-picker-name"
                    type="text"
                    :list="`${id}-names`"
                    autocomplete="off"
                    spellcheck="false"
                    :disabled="disabled"
                    :aria-invalid="nameInvalid ? 'true' : undefined"
                    :aria-describedby="
                        nameInvalid && labels.invalid ? `${id}-name-invalid` : undefined
                    "
                    @change="commitName"
                    @keydown="onEnter($event, commitName)"
                />
                <datalist :id="`${id}-names`">
                    <option
                        v-for="n in names"
                        :key="n"
                        :value="n"
                    ></option>
                </datalist>
                <span
                    v-if="nameInvalid && labels.invalid"
                    :id="`${id}-name-invalid`"
                    class="color-picker-invalid"
                    >{{ labels.invalid }}</span
                >
            </div>

            <fieldset
                v-for="model in models"
                :key="model.id"
                :class="`color-picker-field color-picker-field-${model.id}`"
                :disabled="disabled"
            >
                <legend>{{ model.label }}</legend>
                <template
                    v-for="[key, text, max] in model.fields"
                    :key="key"
                >
                    <label :for="`${id}-${model.id}-${key}`">{{ text }}</label>
                    <input
                        :id="`${id}-${model.id}-${key}`"
                        :class="`color-picker-${model.id} color-picker-${model.id}-${key}`"
                        type="number"
                        min="0"
                        :max="max"
                        step="1"
                        :value="model.values[key]"
                        @change="commitModel(model, key, $event)"
                    />
                </template>
            </fieldset>
        </div>
    </div>
</template>
