// MarkdownEditor component
//
// A <textarea> with a toolbar of buttons that write Markdown into it. The
// value is plain text, so it submits with a form, validates, and works
// without JavaScript. Every name is consumer-supplied.

import * as React from "react";
import { applyTool, TOOL_IDS, type ToolId } from "./markdown-format";

export type Labels = Partial<Record<ToolId, string>>;

export type Props = {
    /** The text, as Markdown (controlled). Pair with `onChange`. */
    value?: string;
    /** The initial text when uncontrolled. */
    defaultValue?: string;
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
    readOnly?: boolean;
    required?: boolean;
    /** Called with the new value after every change, typed or from a tool. */
    onChange?: (value: string) => void;
    /** Replaces a tool's icon. */
    icon?: (tool: ToolId) => React.ReactNode;
    className?: string;
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

const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", k: "link" };

/** Set a textarea's value so React's own change tracking sees it. */
function setNativeValue(el: HTMLTextAreaElement, value: string): void {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter ? setter.call(el, value) : (el.value = value);
}

export default function MarkdownEditor({
    value,
    defaultValue = "",
    label,
    toolbarLabel,
    labels,
    tools = [...TOOL_IDS],
    headingLevel = 2,
    name,
    id,
    rows,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    icon,
    className = "",
    ...restProps
}: Props) {
    const generated = React.useRef<string | undefined>(undefined);
    if (!generated.current) generated.current = nextMarkdownEditorId();
    const textareaId = id ?? generated.current;

    const textarea = React.useRef<HTMLTextAreaElement>(null);
    const toolbar = React.useRef<HTMLDivElement>(null);
    const [active, setActive] = React.useState(0);
    const [inner, setInner] = React.useState(defaultValue);
    const text = value ?? inner;

    const shown = tools.filter((t) => labels[t]);
    const locked = disabled || readOnly;

    function commit(next: string): void {
        setInner(next);
        onChange?.(next);
    }

    function run(tool: ToolId): void {
        const el = textarea.current;
        if (!el || locked) return;
        const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, { headingLevel });
        el.focus();
        // Replace the whole text through the editing pipeline where the browser has
        // one, so native undo / redo keeps working; otherwise set it directly.
        el.select();
        const done = typeof document.execCommand === "function" && document.execCommand("insertText", false, edit.text);
        if (!done || el.value !== edit.text) {
            setNativeValue(el, edit.text);
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        el.setSelectionRange(edit.start, edit.end);
        commit(el.value);
    }

    function onTextKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
        const tool = SHORTCUTS[event.key.toLowerCase()];
        if (tool && shown.includes(tool)) {
            event.preventDefault();
            run(tool);
        }
    }

    function onToolbarKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
        const items = Array.from(toolbar.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const at = items.indexOf(event.target as HTMLButtonElement);
        if (at === -1) return;
        let to = at;
        if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
        else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = items.length - 1;
        else return;
        event.preventDefault();
        setActive(to);
        items[to]?.focus();
    }

    return (
        <div className={`markdown-editor ${className}`} {...restProps}>
            <div
                className="markdown-editor-toolbar"
                role="toolbar"
                aria-label={toolbarLabel}
                aria-controls={textareaId}
                aria-orientation="horizontal"
                ref={toolbar}
                onKeyDown={onToolbarKeyDown}
            >
                {shown.map((tool, i) => (
                    <button
                        key={tool}
                        className="markdown-editor-button"
                        type="button"
                        data-tool={tool}
                        aria-label={labels[tool]}
                        tabIndex={i === Math.min(active, shown.length - 1) ? 0 : -1}
                        disabled={disabled}
                        aria-disabled={readOnly ? "true" : undefined}
                        onFocus={() => setActive(i)}
                        onClick={() => run(tool)}
                    >
                        {icon ? (
                            icon(tool)
                        ) : (
                            <svg
                                className="markdown-editor-icon"
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
                                <path d={ICONS[tool]} />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
            <textarea
                className="markdown-editor-textarea"
                id={textareaId}
                name={name}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                aria-label={label}
                value={text}
                onChange={(e) => commit(e.currentTarget.value)}
                onKeyDown={onTextKeyDown}
                ref={textarea}
            />
        </div>
    );
}

export { MarkdownEditor };
