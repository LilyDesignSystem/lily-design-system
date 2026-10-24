import { applyTool, TOOL_IDS, type ToolId } from "./markdown-format.js";

export type MarkdownEditorLabels = Partial<Record<ToolId, string>>;

export type MarkdownEditorOptions = {
    /** The text, as Markdown. */
    value?: string;
    /** Accessible name of the textarea. Required: there is no default English. */
    label?: string;
    /** Accessible name of the toolbar. Required. */
    toolbarLabel?: string;
    /** The accessible name of each tool; a tool with no label is not rendered. */
    labels?: MarkdownEditorLabels;
    /** Which tools to show, in order. Default: all nine. */
    tools?: ToolId[];
    /** Hash count for the heading tool (1 to 6). Default 2. */
    headingLevel?: number;
    name?: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
};

/** Stroke icons on a shared 16x16 grid, drawn in `currentColor`. */
export const ICONS: Record<ToolId, string> = {
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

const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", k: "link" };

type Ctx = {
    $refs?: Record<string, HTMLElement>;
    $dispatch?: (name: string, detail?: unknown) => void;
};

let counter = 0;

/** The Alpine state for one editor. The snippet binds to it. */
export function createMarkdownEditor(options: MarkdownEditorOptions = {}) {
    counter += 1;
    return {
        id: `markdown-editor-${counter}`,
        value: options.value ?? "",
        label: options.label ?? "",
        toolbarLabel: options.toolbarLabel ?? "",
        labels: (options.labels ?? {}) as MarkdownEditorLabels,
        tools: (options.tools ?? [...TOOL_IDS]) as ToolId[],
        headingLevel: options.headingLevel ?? 2,
        name: options.name ?? "",
        rows: options.rows ?? 0,
        placeholder: options.placeholder ?? "",
        disabled: options.disabled ?? false,
        readonly: options.readonly ?? false,
        required: options.required ?? false,
        /** Index of the toolbar button that holds the tab stop. */
        active: 0,

        /** The tools to render: in `tools`, and with a name. */
        get shown(): ToolId[] {
            return this.tools.filter((t) => this.labels[t]);
        },
        get activeIndex(): number {
            return Math.min(this.active, this.shown.length - 1);
        },
        iconPath(tool: ToolId): string {
            return ICONS[tool];
        },

        /** Apply a tool to the textarea's current selection. */
        run(this: Ctx & { value: string; headingLevel: number; disabled: boolean; readonly: boolean }, tool: ToolId): void {
            const el = this.$refs?.textarea as HTMLTextAreaElement | undefined;
            if (!el || this.disabled || this.readonly) return;
            const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, { headingLevel: this.headingLevel });
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
            this.value = el.value;
            this.$dispatch?.("lily:valuechange", { value: el.value });
        },

        onInput(this: Ctx & { value: string }, event: Event): void {
            this.value = (event.target as HTMLTextAreaElement).value;
            this.$dispatch?.("lily:valuechange", { value: this.value });
        },

        onTextKeydown(this: Ctx & { shown: ToolId[]; run(tool: ToolId): void }, event: KeyboardEvent): void {
            if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
            const tool = SHORTCUTS[event.key.toLowerCase()];
            if (tool && this.shown.includes(tool)) {
                event.preventDefault();
                this.run(tool);
            }
        },

        onToolbarKeydown(this: Ctx & { active: number }, event: KeyboardEvent): void {
            const bar = event.currentTarget as HTMLElement;
            const items = Array.from(bar.querySelectorAll<HTMLButtonElement>("button"));
            const at = items.indexOf(event.target as HTMLButtonElement);
            if (at === -1) return;
            let to = at;
            if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
            else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
            else if (event.key === "Home") to = 0;
            else if (event.key === "End") to = items.length - 1;
            else return;
            event.preventDefault();
            this.active = to;
            items[to]?.focus();
        },
    };
}

/** The Alpine plugin: registers `Alpine.data("lilyMarkdownEditor", options => …)`. */
export default function lilyMarkdownEditor(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyMarkdownEditor", ((options?: MarkdownEditorOptions) => createMarkdownEditor(options)) as (...args: never[]) => object);
}
