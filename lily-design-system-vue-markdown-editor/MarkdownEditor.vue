<script lang="ts">
    import type { ToolId } from "./markdown-format";

    export type Labels = Partial<Record<ToolId, string>>;

    export type Props = {
        /** The text, as Markdown. Use with `v-model`. */
        modelValue?: string;
        /** Accessible name of the textarea. Required: there is no default English. */
        label: string;
        /** Accessible name of the toolbar. Required. */
        toolbarLabel: string;
        /** The accessible name of each tool; a tool with no label is not rendered. */
        labels: Labels;
        /** Which tools to show, in order. Default: all nine. */
        tools?: ToolId[];
        /** Hash count for the heading tool (1 to 6). Default 2. */
        headingLevel?: number;
        name?: string;
        id?: string;
        rows?: number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
    };

    let counter = 0;
    export function nextMarkdownEditorId(): string {
        counter += 1;
        return `markdown-editor-${counter}`;
    }
</script>

<script setup lang="ts">
    // MarkdownEditor component
    //
    // A <textarea> with a toolbar of buttons that write Markdown into it. The
    // value is plain text, so it submits with a form, validates, and works
    // without JavaScript. Every name is consumer-supplied.
    //
    // Slots: `icon` (scoped: { tool }) replaces a tool's icon.
    // Emits: `update:modelValue` and `change`, both with the new value.
    import { computed, ref, watch } from "vue";
    import { applyTool, TOOL_IDS } from "./markdown-format";

    const ICONS: Record<ToolId, string> = {
        heading: "M3 3v10M13 3v10M3 8h10",
        bold: "M4.5 3h4a2.5 2.5 0 0 1 0 5h-4zM4.5 8h5a2.5 2.5 0 0 1 0 5h-5z",
        italic: "M10 3H6.5M9.5 13H6M9 3 7 13",
        strikethrough: "M2.5 8h11M10.5 5.2C10 4 9 3.5 8 3.5c-1.5 0-2.5.8-2.5 2 0 1 .6 1.6 2.5 2M6 11c.4.9 1.2 1.5 2.2 1.5 1.5 0 2.5-.8 2.5-2",
        code: "M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5",
        link: "M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.7.7M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.7-.7",
        quote: "M3 4v8M6.5 5h7M6.5 8h7M6.5 11h5",
        bulletList: "M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01",
        numberedList: "M7 4h7M7 8h7M7 12h7M2.5 3 3.5 2.5V6M2.5 9.5c.5-1 2-.8 2 .2 0 .8-1.5 1.3-2 2.3h2",
    };

    const props = withDefaults(defineProps<Props>(), {
        modelValue: "",
        tools: () => [...TOOL_IDS],
        headingLevel: 2,
        id: undefined,
        name: undefined,
        rows: undefined,
        placeholder: undefined,
        disabled: false,
        readonly: false,
        required: false,
    });
    const emit = defineEmits<{
        (e: "update:modelValue", value: string): void;
        (e: "change", value: string): void;
    }>();

    const generated = nextMarkdownEditorId();
    const textareaId = computed(() => props.id ?? generated);
    const textarea = ref<HTMLTextAreaElement | null>(null);
    const toolbar = ref<HTMLElement | null>(null);
    const active = ref(0);
    const text = ref(props.modelValue);
    watch(() => props.modelValue, (v) => { text.value = v; });

    const shown = computed(() => props.tools.filter((t) => props.labels[t]));
    const locked = computed(() => props.disabled || props.readonly);

    function commit(next: string): void {
        text.value = next;
        emit("update:modelValue", next);
        emit("change", next);
    }

    function run(tool: ToolId): void {
        const el = textarea.value;
        if (!el || locked.value) return;
        const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, { headingLevel: props.headingLevel });
        el.focus();
        // Replace the whole text through the editing pipeline where the browser has
        // one, so native undo / redo keeps working; otherwise set it directly.
        el.select();
        const done = typeof document.execCommand === "function" && document.execCommand("insertText", false, edit.text);
        if (!done || el.value !== edit.text) {
            el.value = edit.text;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        el.setSelectionRange(edit.start, edit.end);
        commit(el.value);
    }

    const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", k: "link" };

    function onTextKeydown(event: KeyboardEvent): void {
        if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
        const tool = SHORTCUTS[event.key.toLowerCase()];
        if (tool && shown.value.includes(tool)) {
            event.preventDefault();
            run(tool);
        }
    }

    function onToolbarKeydown(event: KeyboardEvent): void {
        const items = Array.from(toolbar.value?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const at = items.indexOf(event.target as HTMLButtonElement);
        if (at === -1) return;
        let to = at;
        if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
        else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = items.length - 1;
        else return;
        event.preventDefault();
        active.value = to;
        items[to]?.focus();
    }
</script>

<template>
    <!-- MarkdownEditor.vue -->
    <div class="markdown-editor">
        <div
            ref="toolbar"
            class="markdown-editor-toolbar"
            role="toolbar"
            :aria-label="toolbarLabel"
            :aria-controls="textareaId"
            aria-orientation="horizontal"
            @keydown="onToolbarKeydown"
        >
            <button
                v-for="(tool, i) in shown"
                :key="tool"
                class="markdown-editor-button"
                type="button"
                :data-tool="tool"
                :aria-label="labels[tool]"
                :tabindex="i === Math.min(active, shown.length - 1) ? 0 : -1"
                :disabled="disabled"
                :aria-disabled="readonly ? 'true' : undefined"
                @focus="active = i"
                @click="run(tool)"
            >
                <slot name="icon" :tool="tool">
                    <svg
                        class="markdown-editor-icon"
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
                        <path :d="ICONS[tool]" />
                    </svg>
                </slot>
            </button>
        </div>
        <textarea
            ref="textarea"
            class="markdown-editor-textarea"
            :id="textareaId"
            :name="name"
            :rows="rows"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :aria-label="label"
            :value="text"
            @input="commit(($event.target as HTMLTextAreaElement).value)"
            @keydown="onTextKeydown"
        ></textarea>
    </div>
</template>
