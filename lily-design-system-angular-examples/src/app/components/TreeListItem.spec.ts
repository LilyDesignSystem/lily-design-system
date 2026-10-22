import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TreeListItem } from "./TreeListItem";

// TreeListItem is an attribute-selector component (`li[lily-tree-list-item]`): its host is the
// native <li> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(TreeListItem)` directly (the
// latter has no <li> to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [TreeListItem],
  template: `<li lily-tree-list-item [className]="className"></li>`,
})
class TestHost {
  className = "";
}

describe("TreeListItem", () => {
  test("the host is the li itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.tagName).toBe("LI");
    expect(el.classList.contains("tree-list-item")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("the host li is role=treeitem and focusable by script (tabindex=-1)", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.getAttribute("role")).toBe("treeitem");
    expect(el.getAttribute("tabindex")).toBe("-1");
  });
});

@Component({
  standalone: true,
  imports: [TreeListItem],
  template: `<ol role="tree">
    <li lily-tree-list-item id="parent" [(expanded)]="parentOpen">
      Parent
      <ol role="group">
        <li lily-tree-list-item id="child">Child</li>
      </ol>
    </li>
    <li lily-tree-list-item id="leaf">Leaf</li>
  </ol>`,
})
class NestedHost {
  parentOpen = signal<boolean | undefined>(false);
}

function key(el: Element, k: string) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  el.dispatchEvent(event);
  return event;
}

describe("TreeListItem — expand, collapse and move between levels", () => {
  function create() {
    const fixture = TestBed.createComponent(NestedHost);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const q = (id: string) => fixture.nativeElement.querySelector("#" + id) as HTMLElement;
    return { fixture, parent: q("parent"), child: q("child"), leaf: q("leaf") };
  }

  test("aria-expanded follows the bound state; a leaf has none", () => {
    const { fixture, parent, leaf } = create();
    expect(parent.getAttribute("aria-expanded")).toBe("false");
    expect(leaf.hasAttribute("aria-expanded")).toBe(false);
    fixture.componentInstance.parentOpen.set(true);
    fixture.detectChanges();
    expect(parent.getAttribute("aria-expanded")).toBe("true");
    fixture.nativeElement.remove();
  });

  test("ArrowRight on a collapsed item expands it (and updates the bound state)", () => {
    const { fixture, parent } = create();
    parent.focus();
    expect(key(parent, "ArrowRight").defaultPrevented).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.parentOpen()).toBe(true);
    expect(parent.getAttribute("aria-expanded")).toBe("true");
    fixture.nativeElement.remove();
  });

  test("ArrowRight on an expanded item moves focus to its first child", () => {
    const { fixture, parent, child } = create();
    fixture.componentInstance.parentOpen.set(true);
    fixture.detectChanges();
    parent.focus();
    key(parent, "ArrowRight");
    expect(document.activeElement).toBe(child);
    fixture.nativeElement.remove();
  });

  test("ArrowLeft on an expanded item collapses it", () => {
    const { fixture, parent } = create();
    fixture.componentInstance.parentOpen.set(true);
    fixture.detectChanges();
    parent.focus();
    expect(key(parent, "ArrowLeft").defaultPrevented).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.parentOpen()).toBe(false);
    fixture.nativeElement.remove();
  });

  test("ArrowLeft on a child (or any non-expanded item) moves focus to its parent item", () => {
    const { fixture, parent, child } = create();
    fixture.componentInstance.parentOpen.set(true);
    fixture.detectChanges();
    child.focus();
    key(child, "ArrowLeft");
    expect(document.activeElement).toBe(parent);
    fixture.nativeElement.remove();
  });

  test("a leaf ignores ArrowRight, and a top-level leaf ignores ArrowLeft", () => {
    const { fixture, leaf } = create();
    leaf.focus();
    expect(key(leaf, "ArrowRight").defaultPrevented).toBe(false);
    expect(key(leaf, "ArrowLeft").defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(leaf);
    fixture.nativeElement.remove();
  });

  test("a key pressed in a nested item does not also act on its ancestor", () => {
    const { fixture, parent, child } = create();
    fixture.componentInstance.parentOpen.set(true);
    fixture.detectChanges();
    child.focus();
    key(child, "ArrowLeft");
    fixture.detectChanges();
    // Focus went to the parent, and the event that bubbled up through the (expanded) parent did
    // not also collapse it.
    expect(document.activeElement).toBe(parent);
    expect(fixture.componentInstance.parentOpen()).toBe(true);
    fixture.nativeElement.remove();
  });

  test("in a right-to-left item the keys swap: ArrowLeft expands, ArrowRight collapses", () => {
    const { fixture, parent } = create();
    parent.style.direction = "rtl";
    parent.focus();
    key(parent, "ArrowRight");
    expect(fixture.componentInstance.parentOpen()).toBe(false);
    key(parent, "ArrowLeft");
    fixture.detectChanges();
    expect(fixture.componentInstance.parentOpen()).toBe(true);
    key(parent, "ArrowRight");
    fixture.detectChanges();
    expect(fixture.componentInstance.parentOpen()).toBe(false);
    fixture.nativeElement.remove();
  });
});
