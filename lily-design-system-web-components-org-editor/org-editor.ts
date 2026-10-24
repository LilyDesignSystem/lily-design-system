/**
 * `<lily-org-editor>` — Lily Design System Web Components helper.
 *
 * A `<textarea>` with a toolbar of buttons that write Emacs Org mode into it: text effects,
 * headings, tasks, priorities, planning, properties, drawers and contacts. The
 * value is plain text, so it submits with a form (the textarea is in the light
 * DOM, so an enclosing `<form>` collects it under `name`), validates, and works
 * without JavaScript. See `./spec/index.md` for the canonical contract. This
 * file implements the class but does NOT register it; `index.ts` does.
 *
 * Attributes: `label`, `toolbar-label` (both required), `tools` (space-separated
 * tool ids; default all 23), `heading-level`, `todo-keywords`, `priorities`,
 * `contact-properties` (space-separated), `today` (`YYYY-MM-DD`), `property-key`,
 * `drawer-name`, `name`, `rows`, `placeholder`,
 * `value` (the initial text), `disabled`, `readonly`, `required`, and `labels`
 * (the names of the tools as a JSON object; the `labels` property takes the
 * object itself). Every name is consumer-supplied: there is no English here.
 *
 * Events: a bubbling `input` from the textarea, and `valuechange`
 * (`detail: { value }`) after every change, typed or from a tool.
 */
import { applyTool, TOOL_GROUPS, TOOL_IDS, type ToolId } from "./org-format.js";

export type Labels = Partial<Record<ToolId, string>>;

const SVG_NS = "http://www.w3.org/2000/svg";

/** Stroke icons on a shared 16x16 grid, drawn in `currentColor`. */
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

const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", u: "underline", k: "link" };

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextOrgEditorId(): string {
    uid += 1;
    return `org-editor-${uid}`;
}

/** Custom-element class implementing `<lily-org-editor>`. */
export class OrgEditor extends HTMLElement {
    static get observedAttributes(): string[] {
        return [
            "label",
            "toolbar-label",
            "tools",
            "heading-level",
            "todo-keywords",
            "priorities",
            "today",
            "property-key",
            "drawer-name",
            "contact-properties",
            "name",
            "rows",
            "placeholder",
            "value",
            "disabled",
            "readonly",
            "required",
            "labels",
            "class",
        ];
    }

    #labels: Labels = {};
    #root: HTMLElement | null = null;
    #toolbar: HTMLElement | null = null;
    #textarea: HTMLTextAreaElement | null = null;
    #active = 0;
    #id = nextOrgEditorId();

    connectedCallback(): void {
        if (!this.#root) this.#render();
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
        if (!this.#root) return;
        if (name === "labels") {
            this.#labels = parseLabels(value);
            this.#renderToolbar();
        } else if (name === "tools" || name === "toolbar-label") {
            this.#renderToolbar();
        } else if (name === "class") {
            this.#root.className = this.#rootClass();
        } else if (name === "value") {
            if (this.#textarea && this.#textarea.value !== (value ?? "")) this.#textarea.value = value ?? "";
        } else {
            this.#syncTextarea();
            if (name === "disabled" || name === "readonly") this.#renderToolbar();
        }
    }

    /** The text, as Org. */
    get value(): string {
        return this.#textarea?.value ?? this.getAttribute("value") ?? "";
    }
    set value(next: string) {
        if (this.#textarea) this.#textarea.value = next;
        else this.setAttribute("value", next);
    }

    /** The accessible name of each tool; a tool with no label is not rendered. */
    get labels(): Labels {
        return { ...this.#labels };
    }
    set labels(next: Labels | undefined) {
        this.#labels = next && typeof next === "object" ? { ...next } : {};
        if (this.#root) this.#renderToolbar();
    }

    /** The textarea, once connected. */
    get textarea(): HTMLTextAreaElement | null {
        return this.#textarea;
    }

    get tools(): ToolId[] {
        const attr = this.getAttribute("tools");
        const wanted = attr ? attr.split(/\s+/).filter(Boolean) : [...TOOL_IDS];
        return wanted.filter((t): t is ToolId => (TOOL_IDS as readonly string[]).includes(t));
    }
    set tools(next: ToolId[]) {
        this.setAttribute("tools", next.join(" "));
    }

    get headingLevel(): number {
        const n = Number(this.getAttribute("heading-level"));
        return n >= 1 && n <= 6 ? Math.trunc(n) : 1;
    }

    /** A space-separated attribute as a list, or `undefined` when it is absent. */
    #list(name: string): string[] | undefined {
        const v = this.getAttribute(name);
        return v === null ? undefined : v.split(/\s+/).filter(Boolean);
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }
    get readOnly(): boolean {
        return this.hasAttribute("readonly");
    }

    #rootClass(): string {
        const extra = this.getAttribute("class");
        return extra ? `org-editor ${extra}` : "org-editor";
    }

    #shown(): ToolId[] {
        return this.tools.filter((t) => this.#labels[t]);
    }

    #render(): void {
        if (this.hasAttribute("labels")) this.#labels = parseLabels(this.getAttribute("labels"));
        const root = document.createElement("div");
        root.className = this.#rootClass();

        const toolbar = document.createElement("div");
        toolbar.className = "org-editor-toolbar";
        toolbar.setAttribute("role", "toolbar");
        toolbar.setAttribute("aria-orientation", "horizontal");
        toolbar.setAttribute("aria-controls", this.#id);
        toolbar.addEventListener("keydown", (e) => this.#onToolbarKeydown(e));

        const textarea = document.createElement("textarea");
        textarea.className = "org-editor-textarea";
        textarea.id = this.#id;
        textarea.value = this.getAttribute("value") ?? "";
        textarea.addEventListener("input", () => this.#emit());
        textarea.addEventListener("keydown", (e) => this.#onTextKeydown(e));

        root.append(toolbar, textarea);
        this.replaceChildren(root);
        this.#root = root;
        this.#toolbar = toolbar;
        this.#textarea = textarea;
        this.#syncTextarea();
        this.#renderToolbar();
    }

    #syncTextarea(): void {
        const ta = this.#textarea;
        if (!ta) return;
        const set = (name: string, value: string | null) =>
            value === null ? ta.removeAttribute(name) : ta.setAttribute(name, value);
        set("aria-label", this.getAttribute("label"));
        set("name", this.getAttribute("name"));
        set("rows", this.getAttribute("rows"));
        set("placeholder", this.getAttribute("placeholder"));
        ta.disabled = this.disabled;
        ta.readOnly = this.readOnly;
        ta.required = this.hasAttribute("required");
    }

    #renderToolbar(): void {
        const bar = this.#toolbar;
        if (!bar) return;
        const label = this.getAttribute("toolbar-label");
        if (label === null) bar.removeAttribute("aria-label");
        else bar.setAttribute("aria-label", label);
        const shown = this.#shown();
        this.#active = Math.min(this.#active, Math.max(shown.length - 1, 0));
        bar.replaceChildren(
            ...shown.map((tool, i) => {
                const b = document.createElement("button");
                b.className = "org-editor-button";
                b.type = "button";
                b.dataset.tool = tool;
                b.dataset.group = TOOL_GROUPS[tool];
                b.setAttribute("aria-label", this.#labels[tool] ?? "");
                b.tabIndex = i === this.#active ? 0 : -1;
                b.disabled = this.disabled;
                if (this.readOnly) b.setAttribute("aria-disabled", "true");
                b.addEventListener("focus", () => (this.#active = i));
                b.addEventListener("click", () => this.run(tool));
                b.append(this.renderIcon(tool));
                return b;
            }),
        );
    }

    /** Default tool icon: a bundled stroke SVG, `aria-hidden`. Override to replace it. */
    renderIcon(tool: ToolId): Node {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("class", "org-editor-icon");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.6");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("width", "1.05rem");
        svg.setAttribute("height", "1.05rem");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", ICONS[tool]);
        svg.append(path);
        return svg;
    }

    /** Apply a tool to the textarea's current selection. */
    run(tool: ToolId): void {
        const el = this.#textarea;
        if (!el || this.disabled || this.readOnly) return;
        const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, {
            headingLevel: this.headingLevel,
            todoKeywords: this.#list("todo-keywords"),
            priorities: this.#list("priorities"),
            today: this.getAttribute("today") ?? undefined,
            propertyKey: this.getAttribute("property-key") ?? undefined,
            drawerName: this.getAttribute("drawer-name") ?? undefined,
            contactProperties: this.#list("contact-properties"),
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
    }

    #emit(): void {
        this.dispatchEvent(
            new CustomEvent<{ value: string }>("valuechange", {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
            }),
        );
    }

    #onTextKeydown(event: KeyboardEvent): void {
        if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
        const tool = SHORTCUTS[event.key.toLowerCase()];
        if (tool && this.#shown().includes(tool)) {
            event.preventDefault();
            this.run(tool);
        }
    }

    #onToolbarKeydown(event: KeyboardEvent): void {
        const items = Array.from(this.#toolbar?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const at = items.indexOf(event.target as HTMLButtonElement);
        if (at === -1) return;
        let to = at;
        if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
        else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = items.length - 1;
        else return;
        event.preventDefault();
        this.#active = to;
        items.forEach((b, i) => (b.tabIndex = i === to ? 0 : -1));
        items[to]?.focus();
    }
}

function parseLabels(json: string | null): Labels {
    if (!json) return {};
    try {
        const v = JSON.parse(json);
        return v && typeof v === "object" ? (v as Labels) : {};
    } catch {
        return {};
    }
}
