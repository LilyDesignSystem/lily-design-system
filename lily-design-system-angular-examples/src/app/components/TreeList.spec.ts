import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeList } from "./TreeList";
import { TreeListItem } from "./TreeListItem";

describe("TreeList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(TreeList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tree-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TreeList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.tree-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

const ITEMS = '<li role="treeitem" tabindex="-1">One</li><li role="treeitem" tabindex="-1">Two</li><li role="treeitem" tabindex="-1">Three</li>';

describe("TreeList — role and roving focus", () => {
  function create() {
    const fixture = TestBed.createComponent(TreeList);
    fixture.componentRef.setInput("label", "Label");
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector("[role='tree']") as HTMLElement;
    root.innerHTML = ITEMS;
    return { root, items: Array.from(root.querySelectorAll<HTMLElement>("[role='treeitem']")) };
  }

  test("has role=tree and its label", () => {
    const { root } = create();
    expect(root.getAttribute("aria-label")).toBe("Label");
  });

  test("ArrowDown moves to the next item and wraps from the last to the first", () => {
    const { root, items } = create();
    items[0].focus();
    expect(key(root, "ArrowDown").defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(items[1]);
    items[2].focus();
    key(root, "ArrowDown");
    expect(document.activeElement).toBe(items[0]);
  });

  test("ArrowUp moves to the previous item and wraps from the first to the last", () => {
    const { root, items } = create();
    items[1].focus();
    key(root, "ArrowUp");
    expect(document.activeElement).toBe(items[0]);
    key(root, "ArrowUp");
    expect(document.activeElement).toBe(items[2]);
  });

  test("Home and End jump to the first and last item", () => {
    const { root, items } = create();
    items[1].focus();
    key(root, "End");
    expect(document.activeElement).toBe(items[2]);
    key(root, "Home");
    expect(document.activeElement).toBe(items[0]);
  });

  test("An unrelated key is not intercepted", () => {
    const { root, items } = create();
    items[0].focus();
    expect(key(root, "a").defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(items[0]);
  });
});

@Component({
  standalone: true,
  imports: [TreeList, TreeListItem],
  template: `<lily-tree-list label="Files">
    <li lily-tree-list-item>One</li>
    <li lily-tree-list-item>Two</li>
    <li lily-tree-list-item>Three</li>
  </lily-tree-list>`,
})
class TreeHost {}

describe("TreeList with TreeListItem — arrow keys reach real items", () => {
  test("ArrowDown/ArrowUp/Home/End move focus across the treeitems", () => {
    const fixture = TestBed.createComponent(TreeHost);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const tree = fixture.nativeElement.querySelector("[role='tree']") as HTMLElement;
    const items = Array.from(tree.querySelectorAll<HTMLElement>("li[role='treeitem']"));
    expect(items).toHaveLength(3);
    const press = (k: string) => tree.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
    items[0].focus();
    expect(document.activeElement).toBe(items[0]);
    press("ArrowDown");
    expect(document.activeElement).toBe(items[1]);
    press("End");
    expect(document.activeElement).toBe(items[2]);
    press("ArrowDown");
    expect(document.activeElement).toBe(items[0]);
    press("ArrowUp");
    expect(document.activeElement).toBe(items[2]);
    press("Home");
    expect(document.activeElement).toBe(items[0]);
    fixture.nativeElement.remove();
  });
});
