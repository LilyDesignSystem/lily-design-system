<script lang="ts">
import { DEFAULT_ZONES, matchZone, orderedZones, systemZone, zoneInfo, type ZoneInfo } from "./zones.js";

export { DEFAULT_ZONES };
export type { ZoneInfo };

/** Arguments passed to the default scoped slot (the button icon). */
export type SlotArgs = {
    /** Currently selected zone, an IANA id. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Offset, name and label of any zone. */
    infoFor: (zone: string) => ZoneInfo | undefined;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for TimeZonePicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** BCP 47 tag the zone names are written in. Required: the picker never picks a language for you. */
    locale: string;
    /** IANA zone ids to offer. Default: DEFAULT_ZONES. Shown ordered by offset, not in this order. */
    zones?: readonly string[];
    /** The moment offsets and names are worked out for. Default: now, read once. */
    date?: Date;
    /** Currently selected zone, an IANA id. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial zone when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-time-zone`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Builds an option's text from its info. Default: `UTC+01:00 – Central European Standard Time`. */
    labelFor?: (zone: ZoneInfo) => string;
    /** Disables the button; an open popup closes. The popup's open state is `v-model:open`. */
    disabled?: boolean;
    /** Extra CSS class on the root element. */
    class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextTimeZonePickerId(): string {
    uid += 1;
    return `time-zone-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IconButton, Listbox } from "@lilydesignsystem/vue-headless";

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    name: "time-zone",
    target: undefined,
    zones: () => DEFAULT_ZONES as string[],
    date: undefined,
    labelFor: undefined,
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

const baseId = nextTimeZonePickerId();
const listId = `${baseId}-list`;
const optionId = (i: number) => `${baseId}-option-${i}`;

/** Is the popup open? Bindable: `v-model:open` (the picker keeps its own state when none is bound). */
const open = defineModel<boolean>("open", { default: false });

// A disabled picker cannot stay open.
watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) open.value = false;
    },
    { immediate: true },
);

const tooltipId = `${baseId}-tooltip`;

// Tooltip: shown while the pointer is over the button or the tooltip
// itself (hoverable, WCAG 1.4.13) or while the button has keyboard focus;
// Escape dismisses it without moving focus; never shown while the popup is
// open, since the popup then explains the control.
const hoverButton = ref(false);
const hoverTooltip = ref(false);
const focusButton = ref(false);
const dismissed = ref(false);
const tooltipVisible = computed(
    () => !open.value && !dismissed.value && (hoverButton.value || hoverTooltip.value || focusButton.value),
);

function onTooltipButtonEnter(): void {
    hoverButton.value = true;
    dismissed.value = false;
}

function onTooltipButtonLeave(): void {
    hoverButton.value = false;
}

function onTooltipButtonFocus(event: FocusEvent): void {
    // Keyboard focus only: a mouse click also focuses the button in
    // Chromium, and the tooltip should not stick after a click.
    try {
        focusButton.value = (event.currentTarget as HTMLElement).matches(":focus-visible");
    } catch {
        focusButton.value = true; // engine without :focus-visible, err towards showing
    }
}

function onTooltipButtonBlur(): void {
    focusButton.value = false;
    dismissed.value = false;
}

function onTooltipKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && tooltipVisible.value) dismissed.value = true;
}

// WCAG 1.4.13: while the tooltip is visible, Escape dismisses it wherever
// focus is (hover alone leaves focus elsewhere). The document listener
// exists only while visible; never preventDefault/stopPropagation, no
// focus move. SSR-safe: watch callbacks run client-side only.
function onTooltipDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") dismissed.value = true;
}
let tooltipDocListening = false;
function setTooltipDocListener(on: boolean): void {
    if (typeof document === "undefined" || on === tooltipDocListening) return;
    tooltipDocListening = on;
    if (on) document.addEventListener("keydown", onTooltipDocumentKeydown);
    else document.removeEventListener("keydown", onTooltipDocumentKeydown);
}
watch(tooltipVisible, (visible) => setTooltipDocListener(visible), { flush: "sync" });
onBeforeUnmount(() => setTooltipDocListener(false));
const activeIndex = ref(-1);
// IconButton/Listbox are compositions: a template ref on them resolves
// to whatever they defineExpose (`{ el }`), not the raw DOM node.
const buttonEl = ref<{ el?: HTMLButtonElement } | null>(null);
const listEl = ref<{ el?: HTMLElement } | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

// The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker that
// re-sorted itself while open would move the option under the pointer.
const whenInitial = new Date();
const when = computed(() => props.date ?? whenInitial);
const infos = computed(() => orderedZones(props.zones, props.locale, when.value, props.labelFor));
const ids = computed(() => infos.value.map((z) => z.id));
const infoFor = (zone: string) => zoneInfo(zone, props.locale, when.value, props.labelFor);

function applyZone(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (props.target ?? document.documentElement).setAttribute("data-time-zone", slug);
    if (props.storageKey) {
        try {
            localStorage.setItem(props.storageKey, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    emit("change", slug);
}

// Internal source of truth so the select works both controlled
// (consumer drives `v-model:value`) and uncontrolled (no binding —
// the select resolves and applies a default itself, per spec §7.6).
const current = ref(props.value ?? "");

function setZone(slug: string): void {
    current.value = slug;
    emit("update:value", slug);
}

// Mirror an externally-controlled `value` into internal state.
watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

// Apply whenever the resolved value changes.
watch(current, (next, prev) => {
    if (next && next !== prev) applyZone(next);
});

// ---------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------

async function openList(startIndex?: number): Promise<void> {
    const selected = ids.value.indexOf(current.value);
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    activeIndex.value =
        ids.value.length === 0
            ? -1
            : (startIndex ?? (selected >= 0 ? selected : 0));
    open.value = true;
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern. Wait for the
    // DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    listEl.value?.el?.focus({ preventScroll: true });
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    activeIndex.value = -1;
    if (refocus) {
        await nextTick();
        buttonEl.value?.el?.focus({ preventScroll: true });
    }
}

function choose(index: number): void {
    const slug = ids.value[index];
    if (slug) setZone(slug);
    void closeList();
}

function scrollActiveIntoView(): void {
    if (activeIndex.value < 0 || !listEl.value?.el) return;
    // Look the option up by id rather than by selector: ids need no CSS
    // escaping this way, and `CSS.escape` is not present in every jsdom.
    const el = document.getElementById(optionId(activeIndex.value));
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
}

// Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard handling
// inside the open list is owned by Listbox's "active-descendant" mode
// (see @lilydesignsystem/vue-headless); this component only decides
// what open/close/choose/scroll mean. Keep the highlighted option in
// view for every reason activeIndex can change.
watch(activeIndex, () => scrollActiveIntoView());

function handleTabOut(): void {
    // Tab moves on — but focus goes to the button FIRST, without
    // cancelling the key (Listbox's tab-out emit never preventDefaults
    // Tab). Hiding the focused list drops focus to <body>, and the
    // browser then computes the default Tab move from the top of the
    // document, so tabbing out of an open picker teleported the user to
    // the page's first tab stop. From the button, the default Tab lands
    // exactly where leaving the picker should.
    buttonEl.value?.el?.focus?.({ preventScroll: true });
    void closeList(false);
}

function onButtonClick(): void {
    hoverButton.value = false;
    void (open.value ? closeList() : openList());
}

function onButtonKeydown(event: KeyboardEvent): void {
    onTooltipKeydown(event);
    switch (event.key) {
        case "ArrowDown":
        case "Enter":
        case " ":
            event.preventDefault();
            void openList();
            break;
        case "ArrowUp":
            event.preventDefault();
            void openList(ids.value.length - 1);
            break;
    }
}

function onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && rootEl.value?.contains(next)) return;
    void closeList(false);
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const t = event.target as Node | null;
    if (t && rootEl.value && !rootEl.value.contains(t)) void closeList(false);
}

// ---------------------------------------------------------------
// Initial value resolution + apply (unchanged from the select era)
// ---------------------------------------------------------------

onMounted(() => {
    document.addEventListener("click", onDocumentClick);

    let initial = current.value;
    // A stored zone that is no longer offered is not restored.
    if (!initial && props.storageKey) {
        try {
            const stored = localStorage.getItem(props.storageKey) ?? "";
            if (ids.value.includes(stored)) initial = stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (!initial) {
        // The reader's own zone when it is listed (or has a listed twin), else UTC, else the first.
        initial =
            props.defaultValue ??
            matchZone(systemZone(), infos.value, props.locale, when.value) ??
            (ids.value.includes("UTC") ? "UTC" : ids.value[0]) ??
            "";
    }
    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyZone(initial);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`time-zone-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <IconButton
            :disabled="disabled"
            ref="buttonEl"
            baseClass="time-zone-picker-button"
            :label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
            @mouseenter="onTooltipButtonEnter"
            @mouseleave="onTooltipButtonLeave"
            @focus="onTooltipButtonFocus"
            @blur="onTooltipButtonBlur"
        >
            <slot v-bind="{ value: current, open, infoFor }">
                <svg
                    class="time-zone-picker-icon"
                    viewBox="0 0 16 16"
                    width="1.05rem"
                    height="1.05rem"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5" />
                </svg>
            </slot>
        </IconButton>

        <!-- Purely visual: the same text is already the button's aria-label,
             so it is not wired with aria-describedby (that would announce
             the name twice). -->
        <div
            class="time-zone-picker-tooltip"
            role="tooltip"
            :id="tooltipId"
            :hidden="tooltipVisible ? undefined : true"
            @mouseenter="hoverTooltip = true"
            @mouseleave="hoverTooltip = false"
        >{{ label }}</div>

        <Listbox
            ref="listEl"
            as="ul"
            baseClass="time-zone-picker-list"
            :id="listId"
            :label="label"
            navigation="active-descendant"
            clamp
            typeahead
            :pageSize="10"
            v-model:activeIndex="activeIndex"
            :hidden="open ? undefined : true"
            @activate="choose"
            @escape="() => closeList()"
            @tab-out="handleTabOut"
        >
            <li
                v-for="(zone, i) in infos"
                :key="zone.id"
                class="time-zone-picker-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="zone.id === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                :data-offset="zone.offset"
                @click="choose(i)"
            >{{ zone.label }}</li>
        </Listbox>
    </div>
</template>
