import { applyTool, TOOL_GROUPS, TOOL_IDS, type ToolId } from "./org-format.js";

export type OrgEditorLabels = Partial<Record<ToolId, string>>;

export type OrgEditorOptions = {
    /** The text, as Org. */
    value?: string;
    /** Accessible name of the textarea. Required: there is no default English. */
    label?: string;
    /** Accessible name of the toolbar. Required. */
    toolbarLabel?: string;
    /** The accessible name of each tool; a tool with no label is not rendered. */
    labels?: OrgEditorLabels;
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
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
};

/** Stroke icons on a shared 16x16 grid, drawn in `currentColor`. */
export const ICONS: Record<ToolId, string> = {
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

const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", u: "underline", k: "link" };

type Ctx = {
    $refs?: Record<string, HTMLElement>;
    $dispatch?: (name: string, detail?: unknown) => void;
};

let counter = 0;

/** The Alpine state for one editor. The snippet binds to it. */
export function createOrgEditor(options: OrgEditorOptions = {}) {
    counter += 1;
    return {
        id: `org-editor-${counter}`,
        value: options.value ?? "",
        label: options.label ?? "",
        toolbarLabel: options.toolbarLabel ?? "",
        labels: (options.labels ?? {}) as OrgEditorLabels,
        tools: (options.tools ?? [...TOOL_IDS]) as ToolId[],
        headingLevel: options.headingLevel ?? 1,
        todoKeywords: options.todoKeywords,
        priorities: options.priorities,
        today: options.today,
        propertyKey: options.propertyKey,
        drawerName: options.drawerName,
        contactProperties: options.contactProperties,
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
        group(tool: ToolId): string {
            return TOOL_GROUPS[tool];
        },

        /** Apply a tool to the textarea's current selection. */
        run(
            this: Ctx & {
                value: string;
                headingLevel: number;
                todoKeywords?: string[];
                priorities?: string[];
                today?: string;
                propertyKey?: string;
                drawerName?: string;
                contactProperties?: string[];
                disabled: boolean;
                readonly: boolean;
            },
            tool: ToolId,
        ): void {
            const el = this.$refs?.textarea as HTMLTextAreaElement | undefined;
            if (!el || this.disabled || this.readonly) return;
            const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, {
                headingLevel: this.headingLevel,
                todoKeywords: this.todoKeywords,
                priorities: this.priorities,
                today: this.today,
                propertyKey: this.propertyKey,
                drawerName: this.drawerName,
                contactProperties: this.contactProperties,
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

/** The Alpine plugin: registers `Alpine.data("lilyOrgEditor", options => …)`. */
export default function lilyOrgEditor(Alpine: { data: (name: string, factory: (...args: never[]) => object) => void }): void {
    Alpine.data("lilyOrgEditor", ((options?: OrgEditorOptions) => createOrgEditor(options)) as (...args: never[]) => object);
}
