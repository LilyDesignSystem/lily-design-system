<!--
  VENDORED COPY of lily-design-system-svelte-markdown-editor/MarkdownEditor.svelte (the monorepo package).
  This site builds from its own repository, so it cannot import a sibling package, and
  @lilydesignsystem/svelte-markdown-editor is not on npm yet. When it is published, delete this
  folder's copy, add the dependency, and import it. Edit the monorepo package, never this copy.
-->
<script module lang="ts">
    import type { Snippet } from "svelte";
    import { TOOL_IDS, type ToolId } from "./markdown-format.js";

    export type Labels = Partial<Record<ToolId, string>>;

    export type Props = {
        /** The text, as Markdown. Bindable. */
        value?: string;
        /** Accessible name of the textarea. Required: there is no default English. */
        label: string;
        /** Accessible name of the toolbar. Required. */
        toolbarLabel: string;
        /**
         * The accessible name of each tool button. A tool with no label is not
         * rendered: an unnamed button is worse than no button.
         */
        labels: Labels;
        /** Which tools to show, in order. Default: all nine. */
        tools?: ToolId[];
        /** Hash count for the heading tool (1 to 6). Default 2. */
        headingLevel?: number;
        /** Form field name for the textarea. */
        name?: string;
        id?: string;
        rows?: number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        /** Called with the new value after every change, typed or from a tool. */
        onchange?: (value: string) => void;
        /** Replaces a tool's icon. Receives the tool id. */
        icon?: Snippet<[ToolId]>;
        class?: string;
        [key: string]: unknown;
    };

    let counter = 0;
    export function nextMarkdownEditorId(): string {
        counter += 1;
        return `markdown-editor-${counter}`;
    }

    /** Stroke icons on a shared 16x16 grid, drawn in `currentColor`. */
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
</script>

<script lang="ts">
    // MarkdownEditor component
    //
    // A <textarea> with a toolbar of buttons that write Markdown into it. The
    // value is plain text, so it submits with a form, validates, and works
    // without JavaScript. Every name is consumer-supplied.
    import { applyTool, type ToolId as Tool } from "./markdown-format.js";

    let {
        value = $bindable(""),
        label,
        toolbarLabel,
        labels,
        tools = [...TOOL_IDS],
        headingLevel = 2,
        name,
        id = nextMarkdownEditorId(),
        rows,
        placeholder,
        disabled = false,
        readonly = false,
        required = false,
        onchange,
        icon,
        class: className = "",
        ...restProps
    }: Props = $props();

    let textarea: HTMLTextAreaElement | undefined = $state(undefined);
    let toolbar: HTMLElement | undefined = $state(undefined);
    let active = $state(0);

    const shown = $derived(tools.filter((t) => labels[t]));
    const locked = $derived(disabled || readonly);

    function commit(next: string): void {
        value = next;
        onchange?.(next);
    }

    function run(tool: Tool): void {
        const el = textarea;
        if (!el || locked) return;
        const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, { headingLevel });
        el.focus();
        // Replace the whole text through the editing pipeline where the browser
        // has one, so native undo / redo keeps working; otherwise set it directly.
        el.select();
        const done = typeof document.execCommand === "function" && document.execCommand("insertText", false, edit.text);
        if (!done || el.value !== edit.text) {
            el.value = edit.text;
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        el.setSelectionRange(edit.start, edit.end);
        commit(el.value);
    }

    function oninput(event: Event): void {
        commit((event.currentTarget as HTMLTextAreaElement).value);
    }

    const SHORTCUTS: Record<string, Tool> = { b: "bold", i: "italic", k: "link" };

    function onkeydown(event: KeyboardEvent): void {
        if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
        const tool = SHORTCUTS[event.key.toLowerCase()];
        if (tool && shown.includes(tool)) {
            event.preventDefault();
            run(tool);
        }
    }

    function buttons(): HTMLButtonElement[] {
        return toolbar ? Array.from(toolbar.querySelectorAll<HTMLButtonElement>("button")) : [];
    }

    function ontoolbarkeydown(event: KeyboardEvent): void {
        const items = buttons();
        const at = items.indexOf(event.target as HTMLButtonElement);
        if (at === -1) return;
        let to = at;
        if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
        else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = items.length - 1;
        else return;
        event.preventDefault();
        active = to;
        items[to]?.focus();
    }
</script>

<!-- MarkdownEditor.svelte -->
<div class={`markdown-editor ${className}`} {...restProps}>
    <!-- The toolbar is a composite widget: its buttons hold the tab stop (roving tabindex), the container handles their bubbled arrow keys. -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div
        class="markdown-editor-toolbar"
        role="toolbar"
        aria-label={toolbarLabel}
        aria-controls={id}
        aria-orientation="horizontal"
        bind:this={toolbar}
        onkeydown={ontoolbarkeydown}
    >
        {#each shown as tool, i (tool)}
            <button
                class="markdown-editor-button"
                type="button"
                data-tool={tool}
                aria-label={labels[tool]}
                tabindex={i === Math.min(active, shown.length - 1) ? 0 : -1}
                {disabled}
                aria-disabled={readonly ? "true" : undefined}
                onfocus={() => (active = i)}
                onclick={() => run(tool)}
            >
                {#if icon}
                    {@render icon(tool)}
                {:else}
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
                        <path d={ICONS[tool]} />
                    </svg>
                {/if}
            </button>
        {/each}
    </div>
    <textarea
        class="markdown-editor-textarea"
        {id}
        {name}
        {rows}
        {placeholder}
        {disabled}
        {readonly}
        {required}
        aria-label={label}
        {value}
        {oninput}
        {onkeydown}
        bind:this={textarea}
    ></textarea>
</div>
