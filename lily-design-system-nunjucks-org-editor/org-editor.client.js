// OrgEditor client-side runtime.
//
// Pairs with org-editor.njk. The macro renders the whole control —
// toolbar, buttons, textarea — and the text is editable and submittable without
// JavaScript. This module makes the buttons work: it applies a tool to the
// textarea's selection, moves focus through the toolbar with the arrow keys
// (roving tabindex), and handles Ctrl/Cmd + B, I, U, K in the textarea.
//
// Events: a bubbling `input` from the textarea, and `lily:valuechange`
// (`detail: { value }`) on the root after every change.
import { applyTool } from "./org-format.js";

const SHORTCUTS = { b: "bold", i: "italic", u: "underline", k: "link" };

/** Wire one `[data-lily-org-editor]` root. Returns a function that removes the listeners. */
export function initOrgEditor(root) {
  const toolbar = root.querySelector(".org-editor-toolbar");
  const textarea = root.querySelector(".org-editor-textarea");
  if (!toolbar || !textarea) return () => {};
  const level = Number(root.dataset.headingLevel);
  const headingLevel = level >= 1 && level <= 6 ? level : 1;
  const list = (name) => (root.dataset[name] === undefined ? undefined : root.dataset[name].split(/\s+/).filter(Boolean));
  const buttons = () => Array.from(toolbar.querySelectorAll("button"));
  const locked = () => textarea.disabled || textarea.readOnly;
  const shown = () => buttons().map((b) => b.dataset.tool);

  const emit = () =>
    root.dispatchEvent(new CustomEvent("lily:valuechange", { detail: { value: textarea.value }, bubbles: true }));

  function run(tool) {
    if (locked()) return;
    const edit = applyTool(tool, textarea.value, textarea.selectionStart, textarea.selectionEnd, {
      headingLevel,
      todoKeywords: list("todoKeywords"),
      priorities: list("priorities"),
      today: root.dataset.today,
      propertyKey: root.dataset.propertyKey,
      drawerName: root.dataset.drawerName,
      contactProperties: list("contactProperties"),
    });
    if (edit.text === textarea.value && edit.start === textarea.selectionStart && edit.end === textarea.selectionEnd) {
      textarea.focus();
      return;
    }
    textarea.focus();
    // Replace the whole text through the editing pipeline where the browser has
    // one, so native undo / redo keeps working; otherwise set it directly.
    textarea.select();
    const done = typeof document.execCommand === "function" && document.execCommand("insertText", false, edit.text);
    if (!done || textarea.value !== edit.text) {
      textarea.value = edit.text;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    textarea.setSelectionRange(edit.start, edit.end);
  }

  const onClick = (event) => {
    const button = event.target.closest("button[data-tool]");
    if (button && toolbar.contains(button)) run(button.dataset.tool);
  };
  const onToolbarKeydown = (event) => {
    const items = buttons();
    const at = items.indexOf(event.target);
    if (at === -1) return;
    let to = at;
    if (event.key === "ArrowRight") to = Math.min(at + 1, items.length - 1);
    else if (event.key === "ArrowLeft") to = Math.max(at - 1, 0);
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = items.length - 1;
    else return;
    event.preventDefault();
    items.forEach((b, i) => b.setAttribute("tabindex", i === to ? "0" : "-1"));
    items[to].focus();
  };
  const onFocusin = (event) => {
    const items = buttons();
    const at = items.indexOf(event.target);
    if (at !== -1) items.forEach((b, i) => b.setAttribute("tabindex", i === at ? "0" : "-1"));
  };
  const onTextKeydown = (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
    const tool = SHORTCUTS[event.key.toLowerCase()];
    if (tool && shown().includes(tool)) {
      event.preventDefault();
      run(tool);
    }
  };

  toolbar.addEventListener("click", onClick);
  toolbar.addEventListener("keydown", onToolbarKeydown);
  toolbar.addEventListener("focusin", onFocusin);
  textarea.addEventListener("keydown", onTextKeydown);
  textarea.addEventListener("input", emit);
  return () => {
    toolbar.removeEventListener("click", onClick);
    toolbar.removeEventListener("keydown", onToolbarKeydown);
    toolbar.removeEventListener("focusin", onFocusin);
    textarea.removeEventListener("keydown", onTextKeydown);
    textarea.removeEventListener("input", emit);
  };
}

/** Wire every `[data-lily-org-editor]` under `scope` (default: the document). */
export function autoInit(scope = document) {
  return Array.from(scope.querySelectorAll("[data-lily-org-editor]")).map(initOrgEditor);
}

export {
  applyTool,
  toggleWrap,
  toggleHeading,
  shiftHeadings,
  toggleList,
  cycleCheckbox,
  toggleBlock,
  cycleTodo,
  cyclePriority,
  togglePlanning,
  addProperty,
  insertContact,
  insertLink,
  insertTimestamp,
  dayStamp,
  localToday,
  TOOL_IDS,
  TOOL_GROUPS,
  WRAP_MARKERS,
} from "./org-format.js";
