// @vitest-environment jsdom
// In-place card title editing (the macro's editableTitles, the client's onTitleEdit and the titleedit event).
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import { afterEach, describe, expect, test, vi } from "vitest";

import { initKanbanBoard } from "./kanban-board.client.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure([here, path.join(here, "..")], { autoescape: true, throwOnUndefined: false, trimBlocks: true, lstripBlocks: true });

const COLUMNS = [{ id: "todo", title: "To Do" }, { id: "doing", title: "In Progress" }];
const CARDS = [
  { id: "c1", columnId: "todo", title: "Card One", subtitle: "vip" },
  { id: "c2", columnId: "todo", title: "Linked", href: "/x" },
  { id: "c3", columnId: "doing", title: "Locked", locked: true },
];
const LABELS = { search: "Search", titleEditor: "Title of {title}", titleEditAnnouncement: "{previous} -> {title}" };

function setup(opts: Record<string, unknown> = {}, initOpts: Record<string, unknown> = {}) {
  document.body.innerHTML = env.renderString(`{% from "./kanban-board.njk" import kanbanBoard %}{{ kanbanBoard(opts) }}`, {
    opts: { label: "Board", columns: COLUMNS, cards: CARDS, labels: LABELS, editableTitles: true, ...opts },
  });
  const root = document.body.querySelector<HTMLElement>("[data-lily-kanban-board-root]")!;
  initKanbanBoard(root, initOpts);
  return root;
}
const handle = (root: HTMLElement, id: string) => root.querySelector<HTMLElement>(`[data-lily-kanban-board-card-handle][data-lily-kanban-board-card-id="${id}"]`)!;
const editor = (root: HTMLElement) => root.querySelector<HTMLInputElement>(".kanban-board-title-editor");
const dbl = (el: Element) => el.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
const typeInto = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
};
const status = (root: HTMLElement) => root.querySelector("[data-lily-kanban-board-status]")?.textContent;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("kanban board title editing", () => {
  test("double-click opens an editor with the title; Enter commits, reports, announces and updates the card", () => {
    const onTitleEdit = vi.fn();
    const heard = vi.fn();
    const root = setup({}, { onTitleEdit });
    root.addEventListener("titleedit", (e) => heard((e as CustomEvent).detail));
    dbl(handle(root, "c1"));
    expect(editor(root)!.value).toBe("Card One");
    expect(editor(root)!.getAttribute("aria-label")).toBe("Title of Card One");
    typeInto(editor(root)!, "  Renamed  ");
    key(editor(root)!, "Enter");
    expect(onTitleEdit).toHaveBeenCalledWith({ cardId: "c1", title: "Renamed", previous: "Card One" });
    expect(heard).toHaveBeenCalledWith({ cardId: "c1", title: "Renamed", previous: "Card One" });
    expect(editor(root)).toBeNull();
    expect(handle(root, "c1").textContent).toBe("Renamed");
    expect(status(root)).toBe("Card One -> Renamed");
    // The search now finds it by its new title.
    const search = root.querySelector<HTMLInputElement>("[data-lily-kanban-board-search]")!;
    search.value = "renamed";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(handle(root, "c1").textContent).toBe("Renamed");
    search.value = "one";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(root.querySelector("[data-lily-kanban-board-card-id='c1'].kanban-table-td")!.childNodes.length).toBe(0);
  });

  test("Escape cancels; an empty or unchanged title changes nothing", () => {
    const onTitleEdit = vi.fn();
    const root = setup({}, { onTitleEdit });
    dbl(handle(root, "c1"));
    typeInto(editor(root)!, "Changed");
    key(editor(root)!, "Escape");
    expect(editor(root)).toBeNull();
    expect(handle(root, "c1").textContent).toBe("Card One");
    dbl(handle(root, "c1"));
    typeInto(editor(root)!, "   ");
    key(editor(root)!, "Enter");
    dbl(handle(root, "c1"));
    key(editor(root)!, "Enter");
    expect(onTitleEdit).not.toHaveBeenCalled();
    expect(handle(root, "c1").textContent).toBe("Card One");
  });

  test("leaving the field commits; F2 on a card opens the editor", () => {
    const onTitleEdit = vi.fn();
    const root = setup({}, { onTitleEdit });
    key(root.querySelector<HTMLElement>(".kanban-table-td[data-lily-kanban-board-card-id='c1']")!, "F2");
    expect(editor(root)).not.toBeNull();
    typeInto(editor(root)!, "By blur");
    editor(root)!.dispatchEvent(new FocusEvent("blur"));
    expect(onTitleEdit).toHaveBeenCalledWith({ cardId: "c1", title: "By blur", previous: "Card One" });
  });

  test("off without editableTitles, for a linked or locked card, and when readonly", () => {
    let root = setup({ editableTitles: false });
    dbl(handle(root, "c1"));
    expect(editor(root)).toBeNull();
    root = setup();
    dbl(handle(root, "c2"));
    dbl(handle(root, "c3"));
    expect(editor(root)).toBeNull();
    root = setup({ readonly: true });
    dbl(handle(root, "c1"));
    expect(editor(root)).toBeNull();
  });
});
