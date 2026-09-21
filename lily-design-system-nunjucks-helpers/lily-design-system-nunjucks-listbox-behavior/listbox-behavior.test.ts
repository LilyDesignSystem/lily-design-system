// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createListboxKeyboard } from "./listbox-behavior.client.js";

function renderList(labels: string[]): { list: HTMLUListElement } {
  document.body.innerHTML = "";
  const list = document.createElement("ul");
  list.setAttribute("role", "listbox");
  labels.forEach((label, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.id = `opt-${i}`;
    li.textContent = label;
    list.appendChild(li);
  });
  document.body.appendChild(list);
  return { list };
}

function key(list: HTMLElement, k: string): void {
  list.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
}

beforeEach(() => {
  document.body.innerHTML = "";
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("createListboxKeyboard", () => {
  test("ArrowDown/ArrowUp move the cursor and clamp when clamp is set", () => {
    const { list } = renderList(["Apple", "Banana", "Cherry"]);
    const controller = createListboxKeyboard(list, { clamp: true });
    controller.setActive(2);
    key(list, "ArrowDown");
    expect(controller.getActive()).toBe(2); // clamped at the last option, not wrapped to 0
    expect(list.getAttribute("aria-activedescendant")).toBe("opt-2");
  });

  test("ArrowDown wraps when clamp is not set", () => {
    const { list } = renderList(["Apple", "Banana", "Cherry"]);
    const controller = createListboxKeyboard(list);
    controller.setActive(2);
    key(list, "ArrowDown");
    expect(controller.getActive()).toBe(0);
  });

  test("Home/End jump to the first/last option", () => {
    const { list } = renderList(["Apple", "Banana", "Cherry"]);
    const controller = createListboxKeyboard(list);
    controller.setActive(1);
    key(list, "End");
    expect(controller.getActive()).toBe(2);
    key(list, "Home");
    expect(controller.getActive()).toBe(0);
  });

  test("setActive sets data-active on the active option and clears it on the rest", () => {
    const { list } = renderList(["Apple", "Banana"]);
    const controller = createListboxKeyboard(list);
    controller.setActive(1);
    const options = list.querySelectorAll("[role='option']");
    expect(options[0].hasAttribute("data-active")).toBe(false);
    expect(options[1].getAttribute("data-active")).toBe("");
  });

  test("Enter/Space call onActivate with the active index", () => {
    const { list } = renderList(["Apple", "Banana"]);
    const onActivate = vi.fn();
    const controller = createListboxKeyboard(list, { onActivate });
    controller.setActive(1);
    key(list, "Enter");
    expect(onActivate).toHaveBeenCalledWith(1);
  });

  test("Escape calls onEscape", () => {
    const { list } = renderList(["Apple"]);
    const onEscape = vi.fn();
    createListboxKeyboard(list, { onEscape });
    key(list, "Escape");
    expect(onEscape).toHaveBeenCalled();
  });

  test("Tab calls onTabOut and is not prevented", () => {
    const { list } = renderList(["Apple"]);
    const onTabOut = vi.fn();
    createListboxKeyboard(list, { onTabOut });
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    list.dispatchEvent(event);
    expect(onTabOut).toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  test("typeahead moves to the next option starting with the typed character, only when enabled", () => {
    const { list } = renderList(["Apple", "Banana"]);
    const withTypeahead = createListboxKeyboard(list, { typeahead: true });
    withTypeahead.setActive(0);
    key(list, "b");
    expect(withTypeahead.getActive()).toBe(1);

    document.body.innerHTML = "";
    const { list: list2 } = renderList(["Apple", "Banana"]);
    const withoutTypeahead = createListboxKeyboard(list2);
    withoutTypeahead.setActive(0);
    key(list2, "b");
    expect(withoutTypeahead.getActive()).toBe(0);
  });

  test("PageDown/PageUp move by pageSize, clamped", () => {
    const { list } = renderList(["A", "B", "C"]);
    const controller = createListboxKeyboard(list, { clamp: true, pageSize: 1 });
    controller.setActive(0);
    key(list, "PageDown");
    expect(controller.getActive()).toBe(1);
    key(list, "PageDown");
    key(list, "PageDown");
    expect(controller.getActive()).toBe(2);
  });

  test("destroy removes the keydown listener", () => {
    const { list } = renderList(["Apple", "Banana"]);
    const onActivate = vi.fn();
    const controller = createListboxKeyboard(list, { onActivate });
    controller.setActive(0);
    controller.destroy();
    key(list, "Enter");
    expect(onActivate).not.toHaveBeenCalled();
  });

  test("never sets aria-selected — only data-active and aria-activedescendant", () => {
    const { list } = renderList(["Apple", "Banana"]);
    const controller = createListboxKeyboard(list);
    controller.setActive(1);
    const options = list.querySelectorAll("[role='option']");
    expect(options[1].hasAttribute("aria-selected")).toBe(false);
  });
});
