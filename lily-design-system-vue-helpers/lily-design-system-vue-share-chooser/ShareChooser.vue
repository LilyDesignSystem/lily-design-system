<script lang="ts">
/**
 * Default button glyph: U+27A4 BLACK RIGHTWARDS ARROWHEAD.
 *
 * An in-font arrow rather than a pictograph, matching the other helpers'
 * rule: it renders in the page's own font on every platform and stays
 * monochrome alongside theme-chooser's ◑, locale-chooser's 🌐 and
 * text-size-chooser's "A".
 */
export const BLACK_RIGHTWARDS_ARROWHEAD = "➤";

/**
 * One destination in the share list.
 *
 * `href` is a function, not a string, so the consumer owns the whole URL
 * — this package ships no third-party endpoints and takes no view on
 * which networks exist. See `spec/index.md` §3.
 */
export type ShareTarget = {
    /** Stable identifier, passed back with the `share` event. */
    id: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Build the destination URL from the shared page's metadata. */
    href: (url: string, title: string, text: string) => string;
    /** Overrides the default `target="_blank"` for this destination. */
    newTab?: boolean;
};

/** Arguments passed to the default scoped slot (the button glyph). */
export type SlotArgs = {
    /** Is the list open? */
    open: boolean;
    /** The URL that would be shared right now. */
    url: string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** How the button behaves when activated. */
export type ShareStrategy = "auto" | "native" | "list";

/** Public props for ShareChooser. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the list. */
    label: string;
    /** Destinations to offer. Empty is valid if `copyLabel` is set. */
    targets?: ShareTarget[];
    /** URL to share. Defaults to the current page URL, read at share time. */
    url?: string;
    /** Title passed to `href(...)` and to the native share sheet. */
    title?: string;
    /** Longer text passed to `href(...)` and to the native share sheet. */
    text?: string;
    /**
     * Label for the built-in copy-to-clipboard item. The item renders
     * only when this is supplied — there is no default, because a
     * default would be a hardcoded English string.
     */
    copyLabel?: string;
    /** Announced in the status region after a successful copy. */
    copiedLabel?: string;
    /** Announced in the status region when the clipboard write fails. */
    copyFailedLabel?: string;
    /**
     * `"auto"` (default) uses the native share sheet when the browser
     * provides one and falls back to the list; `"native"` always tries
     * the sheet; `"list"` always shows the list.
     */
    strategy?: ShareStrategy;
    /** Extra CSS class on the root element. */
    class?: string;
};

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy(): boolean {
    return (
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.writeText === "function"
    );
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextShareChooserId(): string {
    uid += 1;
    return `share-chooser-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(defineProps<Props>(), {
    targets: () => [],
    url: undefined,
    title: "",
    text: "",
    copyLabel: undefined,
    copiedLabel: undefined,
    copyFailedLabel: undefined,
    strategy: "auto",
    class: "",
});

// The Svelte canonical takes `onShare` / `onCopy` / `onNativeShare`
// callback props; the Vue idiom for the same contract is emitted events.
const emit = defineEmits<{
    (event: "share", targetId: string, url: string): void;
    (event: "copy", url: string): void;
    (event: "nativeShare", url: string): void;
}>();

const baseId = nextShareChooserId();
const listId = `${baseId}-list`;

const open = ref(false);
const status = ref("");
const buttonEl = ref<HTMLButtonElement | null>(null);
const listEl = ref<HTMLUListElement | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

/**
 * The URL to share. Resolved lazily so the default works without the
 * consumer threading `location.href` through, and so SSR never touches
 * `location`.
 */
function currentUrl(): string {
    if (props.url) return props.url;
    return typeof location !== "undefined" ? location.href : "";
}

/** Every focusable item in the list, in DOM order. */
function items(): HTMLElement[] {
    if (!listEl.value) return [];
    return Array.from(
        listEl.value.querySelectorAll<HTMLElement>(
            ".share-chooser-target, .share-chooser-copy",
        ),
    );
}

async function openList(focusLast = false): Promise<void> {
    open.value = true;
    status.value = "";
    // Wait for the DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    const all = items();
    (focusLast ? all[all.length - 1] : all[0])?.focus();
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    if (refocus) {
        await nextTick();
        buttonEl.value?.focus();
    }
}

async function shareNatively(): Promise<boolean> {
    if (!canShareNatively()) return false;
    const shareUrl = currentUrl();
    try {
        await navigator.share({ url: shareUrl, title: props.title, text: props.text });
        emit("nativeShare", shareUrl);
        return true;
    } catch {
        // A rejected promise here is almost always the user dismissing
        // the sheet, which is not an error and must not fall through to
        // the list — that would reopen UI they just dismissed.
        return true;
    }
}

async function onButtonClick(): Promise<void> {
    if (open.value) {
        await closeList();
        return;
    }
    if (
        props.strategy === "native" ||
        (props.strategy === "auto" && canShareNatively())
    ) {
        if (await shareNatively()) return;
    }
    await openList();
}

function onButtonKeydown(event: KeyboardEvent): void {
    // Enter and Space are the button's own activation keys and already
    // produce a click; only the arrows need handling here.
    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open.value) void openList();
        else items()[0]?.focus();
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open.value) void openList(true);
        else {
            const all = items();
            all[all.length - 1]?.focus();
        }
    }
}

function moveFocus(delta: number): void {
    const all = items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement as HTMLElement);
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    all[next]?.focus();
}

function onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            moveFocus(1);
            break;
        case "ArrowUp":
            event.preventDefault();
            moveFocus(-1);
            break;
        case "Home":
            event.preventDefault();
            items()[0]?.focus();
            break;
        case "End": {
            event.preventDefault();
            const all = items();
            all[all.length - 1]?.focus();
            break;
        }
        case "Escape":
            event.preventDefault();
            void closeList();
            break;
        case "Tab":
            // Tab leaves the control: close, but let focus go where the
            // browser was sending it.
            void closeList(false);
            break;
    }
}

function onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && rootEl.value?.contains(next)) return;
    void closeList(false);
}

function chooseTarget(target: ShareTarget): void {
    emit("share", target.id, currentUrl());
    void closeList();
}

async function copyUrl(): Promise<void> {
    const shareUrl = currentUrl();
    try {
        if (!canCopy()) throw new Error("clipboard unavailable");
        await navigator.clipboard.writeText(shareUrl);
        emit("copy", shareUrl);
        if (props.copiedLabel) status.value = props.copiedLabel;
    } catch {
        if (props.copyFailedLabel) status.value = props.copyFailedLabel;
    }
    await closeList();
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const t = event.target as Node | null;
    if (t && rootEl.value && !rootEl.value.contains(t)) void closeList(false);
}

onMounted(() => {
    document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`share-chooser ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <button
            ref="buttonEl"
            type="button"
            class="share-chooser-button"
            :aria-label="label"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ open, url: currentUrl() }">
                <span class="share-chooser-icon" aria-hidden="true">{{
                    BLACK_RIGHTWARDS_ARROWHEAD
                }}</span>
            </slot>
        </button>

        <ul
            ref="listEl"
            class="share-chooser-list"
            :id="listId"
            :hidden="open ? undefined : true"
            @keydown="onListKeydown"
        >
            <li
                v-for="target in targets"
                :key="target.id"
                class="share-chooser-list-item"
            >
                <!-- A real link, not role="menuitem": these ARE navigation,
                     and menuitem would strip middle-click, open-in-new-tab
                     and copy-link-address. -->
                <a
                    class="share-chooser-target"
                    :data-target-id="target.id"
                    :href="target.href(currentUrl(), title, text)"
                    :target="target.newTab === false ? undefined : '_blank'"
                    rel="noopener noreferrer"
                    @click="chooseTarget(target)"
                >{{ target.label }}</a>
            </li>

            <li v-if="copyLabel" class="share-chooser-list-item">
                <button type="button" class="share-chooser-copy" @click="copyUrl">
                    {{ copyLabel }}
                </button>
            </li>
        </ul>

        <!-- Copying gives no visual feedback of its own, so the outcome is
             announced. Empty until something happens, so it stays silent on
             load; aria-live announces mutations only. -->
        <p class="share-chooser-status" aria-live="polite">{{ status }}</p>
    </div>
</template>
