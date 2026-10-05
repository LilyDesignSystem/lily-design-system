import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileTree } from "./FileTree";

@Component({
  standalone: true,
  imports: [FileTree],
  template: `<lily-file-tree label="Files" className="extra">
    <li role="treeitem" aria-expanded="true" data-id="src">src
      <ul role="group">
        <li role="treeitem" aria-expanded="true" data-id="lib">lib
          <ul role="group"><li role="treeitem" data-id="index">index.ts</li></ul>
        </li>
        <li role="treeitem" data-id="app">app.ts</li>
      </ul>
    </li>
    <li role="treeitem" aria-expanded="false" data-id="docs">docs
      <ul role="group"><li role="treeitem" data-id="guide">guide.md</li></ul>
    </li>
    <li role="treeitem" data-id="readme">readme.md</li>
    <li role="treeitem" aria-expanded="false" data-id="etc">etc
      <ul role="group"><li role="treeitem" data-id="x">x.txt</li></ul>
    </li>
  </lily-file-tree>`,
})
class Host {}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const item = (id: string) => el.querySelector<HTMLElement>(`[data-id="${id}"]`)!;
  const press = (key: string) => {
    const t = (document.activeElement as HTMLElement) ?? document.body;
    t.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  };
  const type = (s: string) => [...s].forEach(press);
  return { fixture, el, item, press, type };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("FileTree", () => {
  test("root is <ul role=tree> with class and aria-label", () => {
    const { el } = setup();
    const root = el.querySelector("ul.file-tree") as HTMLElement;
    expect(root.getAttribute("role")).toBe("tree");
    expect(root.getAttribute("aria-label")).toBe("Files");
    expect(root.classList.contains("extra")).toBe(true);
  });

  test("roving tabindex: exactly one item has tabindex=0, the first", async () => {
    const { el, item } = setup();
    await tick();
    const stops = el.querySelectorAll("[role=treeitem][tabindex='0']");
    expect(stops).toHaveLength(1);
    expect(stops[0]).toBe(item("src"));
    expect(item("lib").getAttribute("tabindex")).toBe("-1");
  });

  test("tab stop follows focus", async () => {
    const { el, item, press } = setup();
    await tick();
    item("src").focus();
    press("ArrowDown");
    expect(item("lib").getAttribute("tabindex")).toBe("0");
    expect(item("src").getAttribute("tabindex")).toBe("-1");
    expect(el.querySelectorAll("[tabindex='0']")).toHaveLength(1);
  });

  test("ArrowDown moves to the next visible item, skipping closed folder contents", () => {
    const { item, press } = setup();
    item("readme").focus();
    press("ArrowUp");
    expect(document.activeElement).toBe(item("docs"));
    press("ArrowDown");
    press("ArrowDown");
    expect(document.activeElement).toBe(item("etc"));
  });

  test("ArrowDown/ArrowUp walk into open folders", () => {
    const { item, press } = setup();
    item("src").focus();
    press("ArrowDown");
    expect(document.activeElement).toBe(item("lib"));
    press("ArrowDown");
    expect(document.activeElement).toBe(item("index"));
    press("ArrowUp");
    expect(document.activeElement).toBe(item("lib"));
  });

  test("ArrowUp at the first item and ArrowDown at the last do not wrap", () => {
    const { item, press } = setup();
    item("src").focus();
    press("ArrowUp");
    expect(document.activeElement).toBe(item("src"));
    item("etc").focus();
    press("ArrowDown");
    expect(document.activeElement).toBe(item("etc"));
  });

  test("Home and End jump to the first and last visible items", () => {
    const { item, press } = setup();
    item("app").focus();
    press("End");
    expect(document.activeElement).toBe(item("etc"));
    press("Home");
    expect(document.activeElement).toBe(item("src"));
  });

  test("ArrowRight on a closed folder opens it", () => {
    const { item, press } = setup();
    item("docs").focus();
    press("ArrowRight");
    expect(item("docs").getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(item("docs"));
  });

  test("ArrowRight on an open folder moves to its first child", () => {
    const { item, press } = setup();
    item("src").focus();
    press("ArrowRight");
    expect(document.activeElement).toBe(item("lib"));
  });

  test("ArrowRight on a file does nothing", () => {
    const { item, press } = setup();
    item("readme").focus();
    press("ArrowRight");
    expect(document.activeElement).toBe(item("readme"));
  });

  test("ArrowLeft on an open folder closes it", () => {
    const { item, press } = setup();
    item("src").focus();
    press("ArrowLeft");
    expect(item("src").getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(item("src"));
  });

  test("ArrowLeft on a child moves focus to its parent folder", () => {
    const { item, press } = setup();
    item("index").focus();
    press("ArrowLeft");
    expect(document.activeElement).toBe(item("lib"));
    press("ArrowLeft");
    expect(item("lib").getAttribute("aria-expanded")).toBe("false");
    press("ArrowLeft");
    expect(document.activeElement).toBe(item("src"));
  });

  test("closing a folder removes its children from keyboard order", () => {
    const { item, press } = setup();
    item("src").focus();
    press("ArrowLeft");
    press("ArrowDown");
    expect(document.activeElement).toBe(item("docs"));
  });

  test("* expands all closed sibling folders at the focused level", () => {
    const { item, press } = setup();
    item("src").focus();
    press("*");
    expect(item("docs").getAttribute("aria-expanded")).toBe("true");
    expect(item("etc").getAttribute("aria-expanded")).toBe("true");
    expect(item("src").getAttribute("aria-expanded")).toBe("true");
  });

  test("* does not expand folders at other levels", () => {
    const { item, press } = setup();
    item("lib").focus();
    item("lib").setAttribute("aria-expanded", "false");
    item("lib").focus();
    press("*");
    expect(item("docs").getAttribute("aria-expanded")).toBe("false");
    expect(item("etc").getAttribute("aria-expanded")).toBe("false");
    expect(item("lib").getAttribute("aria-expanded")).toBe("true");
  });

  test("typeahead moves to the next visible item starting with the typed character", () => {
    const { item, type } = setup();
    item("src").focus();
    type("r");
    expect(document.activeElement).toBe(item("readme"));
  });

  test("typeahead ignores items hidden in closed folders", () => {
    const { item, type } = setup();
    item("src").focus();
    type("g");
    expect(document.activeElement).toBe(item("src"));
  });

  test("typeahead matches a multi-character prefix", () => {
    const { item, type } = setup();
    item("src").focus();
    type("ap");
    expect(document.activeElement).toBe(item("app"));
  });

  test("typeahead matches a folder's own text, not its nested children", () => {
    const { item, type } = setup();
    item("readme").focus();
    type("s");
    expect(document.activeElement).toBe(item("src"));
  });

  test("Enter and Space activate the focused item", () => {
    const { item, press } = setup();
    const clicks: string[] = [];
    item("readme").addEventListener("click", () => clicks.push("readme"));
    item("readme").focus();
    press("Enter");
    press(" ");
    expect(clicks).toEqual(["readme", "readme"]);
  });

  test("if the tab stop gets hidden the tab stop moves to a visible item", async () => {
    const { el, item } = setup();
    await tick();
    item("index").focus();
    item("src").setAttribute("aria-expanded", "false");
    await tick();
    const stops = el.querySelectorAll("[role=treeitem][tabindex='0']");
    expect(stops).toHaveLength(1);
    expect(stops[0]).not.toBe(item("index"));
  });
});
