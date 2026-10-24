// MarkdownEditor component
//
// A <textarea> with a toolbar of buttons that write Markdown into it. The
// value is plain text, so it submits with a form, validates, and works
// without JavaScript. Every name is consumer-supplied.
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { applyTool, TOOL_IDS, type ToolId } from "./markdown-format";

export type Labels = Partial<Record<ToolId, string>>;

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

@Component({
  selector: "lily-markdown-editor",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="markdown-editor {{ className() }}">
      <div
        #toolbar
        class="markdown-editor-toolbar"
        role="toolbar"
        [attr.aria-label]="toolbarLabel()"
        [attr.aria-controls]="textareaId()"
        aria-orientation="horizontal"
        (keydown)="onToolbarKeydown($event)"
      >
        @for (tool of shown(); track tool; let i = $index) {
          <button
            class="markdown-editor-button"
            type="button"
            [attr.data-tool]="tool"
            [attr.aria-label]="labels()[tool]"
            [attr.tabindex]="i === activeIndex() ? 0 : -1"
            [disabled]="disabled()"
            [attr.aria-disabled]="readonly() ? 'true' : null"
            (focus)="active.set(i)"
            (click)="run(tool)"
          >
            @if (icon(); as tpl) {
              <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: tool }" />
            } @else {
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
                <path [attr.d]="iconPath(tool)" />
              </svg>
            }
          </button>
        }
      </div>
      <textarea
        #textarea
        class="markdown-editor-textarea"
        [attr.id]="textareaId()"
        [attr.name]="name()"
        [attr.rows]="rows()"
        [attr.placeholder]="placeholder()"
        [disabled]="disabled()"
        [readOnly]="readonly()"
        [required]="required()"
        [attr.aria-label]="label()"
        [value]="value()"
        (input)="commit($any($event.target).value)"
        (keydown)="onTextKeydown($event)"
      ></textarea>
    </div>
  `,
})
export class MarkdownEditor {
  /** The text, as Markdown. Two-way: `[(value)]`. */
  readonly value = model<string>("");
  /** Accessible name of the textarea. Required: there is no default English. */
  readonly label = input.required<string>();
  /** Accessible name of the toolbar. Required. */
  readonly toolbarLabel = input.required<string>();
  /** The accessible name of each tool; a tool with no label is not rendered. */
  readonly labels = input.required<Labels>();
  /** Which tools to show, in order. Default: all nine. */
  readonly tools = input<ToolId[]>([...TOOL_IDS]);
  /** Hash count for the heading tool (1 to 6). Default 2. */
  readonly headingLevel = input<number>(2);
  readonly name = input<string | undefined>(undefined);
  readonly id = input<string | undefined>(undefined);
  readonly rows = input<number | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  /** Replaces a tool's icon; the context's `$implicit` is the tool id. */
  readonly icon = input<TemplateRef<{ $implicit: ToolId }> | undefined>(undefined);
  /** Consumer class hook, appended to `markdown-editor`. */
  readonly className = input<string>("");
  /** Fired with the new value after every change, typed or from a tool. */
  readonly changed = output<string>();

  protected readonly active = signal(0);
  private readonly generated = nextMarkdownEditorId();
  protected readonly textareaId = computed(() => this.id() ?? this.generated);
  protected readonly shown = computed(() => this.tools().filter((t) => this.labels()[t]));
  protected readonly activeIndex = computed(() => Math.min(this.active(), this.shown().length - 1));
  private readonly locked = computed(() => this.disabled() || this.readonly());

  private readonly textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>("textarea");
  private readonly toolbar = viewChild.required<ElementRef<HTMLElement>>("toolbar");

  protected iconPath(tool: ToolId): string {
    return ICONS[tool];
  }

  protected commit(next: string): void {
    this.value.set(next);
    this.changed.emit(next);
  }

  protected run(tool: ToolId): void {
    const el = this.textarea().nativeElement;
    if (this.locked()) return;
    const edit = applyTool(tool, el.value, el.selectionStart, el.selectionEnd, { headingLevel: this.headingLevel() });
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
    this.commit(el.value);
  }

  protected onTextKeydown(event: KeyboardEvent): void {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
    const tool = SHORTCUTS[event.key.toLowerCase()];
    if (tool && this.shown().includes(tool)) {
      event.preventDefault();
      this.run(tool);
    }
  }

  protected onToolbarKeydown(event: KeyboardEvent): void {
    const items = Array.from(this.toolbar().nativeElement.querySelectorAll<HTMLButtonElement>("button"));
    const at = items.indexOf(event.target as HTMLButtonElement);
    if (at === -1) return;
    let to = at;
    if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
    else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = items.length - 1;
    else return;
    event.preventDefault();
    this.active.set(to);
    items[to]?.focus();
  }
}
