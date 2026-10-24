<script lang="ts">
    import type { ToolId } from "./org-format";

    export type Labels = Partial<Record<ToolId, string>>;

    export type Props = {
        /** The text, as Org. Use with `v-model`. */
        modelValue?: string;
        /** Accessible name of the textarea. Required: there is no default English. */
        label: string;
        /** Accessible name of the toolbar. Required. */
        toolbarLabel: string;
        /** The accessible name of each tool; a tool with no label is not rendered. */
        labels: Labels;
        /** Which tools to show, in order. Default: all 23. */
        tools?: ToolId[];
        /** Stars the heading tool writes on a plain line (1 to 6). Default 1. */
        headingLevel?: number;
        /** The task keywords the todo tool cycles through. Default `["TODO", "DONE"]`. */
        todoKeywords?: string[];
        /** The priority letters the priority tool cycles through. Default `["A", "B", "C"]`. */
        priorities?: string[];
        /** Today as `YYYY-MM-DD`, for scheduled, deadline and timestamp. Default: the local date when the tool runs. */
        today?: string;
        /** The property the property tool adds. Default `ID`. */
        propertyKey?: string;
        /** The drawer the drawer tool writes. Default `LOGBOOK`. */
        drawerName?: string;
        /** The properties a contact entry gets. Default `["EMAIL", "PHONE", "ADDRESS", "BIRTHDAY"]`. */
        contactProperties?: string[];
        name?: string;
        id?: string;
        rows?: number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
    };

    let counter = 0;
    export function nextOrgEditorId(): string {
        counter += 1;
        return `org-editor-${counter}`;
    }
</script>

<script setup lang="ts">
    // OrgEditor component
    //
    // A <textarea> with a toolbar of buttons that write Emacs Org mode into it: text effects,
    // headings, tasks, priorities, planning, properties, drawers and contacts. The
    // value is plain text, so it submits with a form, validates, and works
    // without JavaScript. Every name is consumer-supplied.
    //
    // Slots: `icon` (scoped: { tool }) replaces a tool's icon.
    // Emits: `update:modelValue` and `change`, both with the new value.
    import { computed, ref, watch } from "vue";
    import { applyTool, TOOL_GROUPS, TOOL_IDS } from "./org-format";

    const ICONS: Record<ToolId, string> = {
        heading: "M3 3v10M13 3v10M3 8h10",
        promote: "M13 8H3M7 4 3 8l4 4",
        demote: "M3 8h10M9 4l4 4-4 4",
        todo: "M3 3h10v10H3zM5.5 8l2 2 3-4",
        priority: "M5.5 3 4.5 13M11.5 3l-1 10M2.5 6h11M2 10h11",
        scheduled: "M2.5 4h11v9.5h-11zM2.5 7h11M5 2.5v3M11 2.5v3",
        deadline: "M4 14V2.5M4 3h8l-1.5 2.5L12 8H4",
        timestamp: "M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5",
        bold: "M4.5 3h4a2.5 2.5 0 0 1 0 5h-4zM4.5 8h5a2.5 2.5 0 0 1 0 5h-5z",
        italic: "M10 3H6.5M9.5 13H6M9 3 7 13",
        underline: "M4.5 3v5a3.5 3.5 0 0 0 7 0V3M3 14h10",
        strikethrough: "M2.5 8h11M10.5 5.2C10 4 9 3.5 8 3.5c-1.5 0-2.5.8-2.5 2 0 1 .6 1.6 2.5 2M6 11c.4.9 1.2 1.5 2.2 1.5 1.5 0 2.5-.8 2.5-2",
        code: "M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5",
        verbatim: "M3 6h10M3 10h10",
        link: "M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.7.7M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.7-.7",
        bulletList: "M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01",
        numberedList: "M7 4h7M7 8h7M7 12h7M2.5 3 3.5 2.5V6M2.5 9.5c.5-1 2-.8 2 .2 0 .8-1.5 1.3-2 2.3h2",
        checkbox: "M2.5 2.5h5v5h-5zM9.5 5h4M2.5 9.5h5v5h-5zM9.5 12h4",
        quote: "M3 4v8M6.5 5h7M6.5 8h7M6.5 11h5",
        sourceBlock: "M2 3h12v10H2zM6 6 4.5 8 6 10M10 6l1.5 2L10 10",
        property: "M2.5 5h4M2.5 8h4M2.5 11h4M8.5 5h5M8.5 8h5M8.5 11h5",
        drawer: "M2.5 3h11v4h-11zM2.5 9h11v4h-11zM6.5 5h3M6.5 11h3",
        contact: "M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 14c.5-3 2.5-4.5 5-4.5s4.5 1.5 5 4.5",
    };

    const props = withDefaults(defineProps<Props>(), {
        modelValue: "",
        tools: () => [...TOOL_IDS],
        headingLevel: 1,
        todoKeywords: undefined,
        priorities: undefined,
        today: undefined,
        propertyKey: undefined,
        drawerName: undefined,
        contactProperties: undefined,
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

    const generated = nextOrgEditorId();
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
        const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, {
            headingLevel: props.headingLevel,
            todoKeywords: props.todoKeywords,
            priorities: props.priorities,
            today: props.today,
            propertyKey: props.propertyKey,
            drawerName: props.drawerName,
            contactProperties: props.contactProperties,
        });
        if (edit.text === el.value && edit.start === el.selectionStart && edit.end === el.selectionEnd) {
            el.focus();
            return;
        }
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

    const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", u: "underline", k: "link" };

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
    <!-- OrgEditor.vue -->
    <div class="org-editor">
        <div
            ref="toolbar"
            class="org-editor-toolbar"
            role="toolbar"
            :aria-label="toolbarLabel"
            :aria-controls="textareaId"
            aria-orientation="horizontal"
            @keydown="onToolbarKeydown"
        >
            <button
                v-for="(tool, i) in shown"
                :key="tool"
                class="org-editor-button"
                type="button"
                :data-tool="tool"
                :data-group="TOOL_GROUPS[tool]"
                :aria-label="labels[tool]"
                :tabindex="i === Math.min(active, shown.length - 1) ? 0 : -1"
                :disabled="disabled"
                :aria-disabled="readonly ? 'true' : undefined"
                @focus="active = i"
                @click="run(tool)"
            >
                <slot name="icon" :tool="tool">
                    <svg
                        class="org-editor-icon"
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
            class="org-editor-textarea"
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
