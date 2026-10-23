// wheel-picker.test.js
// WheelPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const OPTIONS = "[{ value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' }, { value: '4', label: 'April', disabled: true }, { value: '5', label: 'May' }]";
const html = (config = "") => `<div class="wheel-picker" x-data="lilyWheelPicker({ value: '2', options: ${OPTIONS}${config} })"><div class="wheel-picker-list" x-ref="list" x-bind="list" aria-label="Month"><template x-for="(option, index) in options" :key="option.value"><div class="wheel-picker-option" role="option" :id="\`\${uid}-option-\${index}\`" :aria-selected="String(index === selectedIndex)" :aria-disabled="option.disabled ? 'true' : null" :data-value="option.value" :data-index="index" x-text="option.label"></div></template></div></div>`;
const list = () => document.querySelector(".wheel-picker-list");
const selected = () => document.querySelector('[role="option"][aria-selected="true"]')?.textContent;
const key = async (k) => {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
  list().dispatchEvent(event);
  await tick();
  return event;
};
const click = async (text) => {
  Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent === text).click();
  await tick();
};

describe("WheelPicker", () => {
  it("renders the element with its base class", async () => {
    await mount("wheel-picker");
    expect(document.querySelector("div.wheel-picker")).not.toBeNull();
    expect(list().getAttribute("role")).toBe("listbox");
    expect(list().getAttribute("aria-orientation")).toBe("vertical");
  });

  it("renders one option per entry and marks only the selected one", async () => {
    await mount("w", html());
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(5);
    expect(selected()).toBe("February");
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(1);
  });

  it("points aria-activedescendant at the selected option and keeps focus on the list", async () => {
    await mount("w", html());
    const id = list().getAttribute("aria-activedescendant");
    expect(document.getElementById(id).textContent).toBe("February");
    expect(list().getAttribute("tabindex")).toBe("0");
  });

  it("ArrowDown selects the next enabled option, skipping a disabled one, and fires change once", async () => {
    await mount("w", html().replace("value: '2'", "value: '3'"));
    const onChange = vi.fn();
    document.querySelector(".wheel-picker").addEventListener("change", onChange);
    await key("ArrowDown");
    expect(selected()).toBe("May");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail.value).toBe("5");
  });

  it("ArrowUp, Home and End move the selection", async () => {
    await mount("w", html());
    await key("ArrowUp");
    expect(selected()).toBe("January");
    await key("End");
    expect(selected()).toBe("May");
    await key("Home");
    expect(selected()).toBe("January");
  });

  it("stops at the ends unless loop is set", async () => {
    await mount("w", html().replace("value: '2'", "value: '1'"));
    await key("ArrowUp");
    expect(selected()).toBe("January");
    await mount("w", html(", loop: true").replace("value: '2'", "value: '1'"));
    await key("ArrowUp");
    expect(selected()).toBe("May");
  });

  it("PageDown moves by pageSize", async () => {
    await mount("w", html(", pageSize: 2").replace("value: '2'", "value: '1'"));
    await key("PageDown");
    expect(selected()).toBe("March");
  });

  it("type-ahead selects the option starting with the typed letter", async () => {
    await mount("w", html().replace("value: '2'", "value: '1'"));
    await key("m");
    expect(selected()).toBe("March");
  });

  it("prevents the page scroll for the keys it handles", async () => {
    await mount("w", html());
    expect((await key("ArrowDown")).defaultPrevented).toBe(true);
  });

  it("clicking an enabled option selects it and a disabled one does nothing", async () => {
    await mount("w", html());
    await click("May");
    expect(selected()).toBe("May");
    await click("April");
    expect(selected()).toBe("May");
  });

  it("selecting the value already held is a no-op (no change event)", async () => {
    await mount("w", html().replace("value: '2'", "value: '5'"));
    const onChange = vi.fn();
    document.querySelector(".wheel-picker").addEventListener("change", onChange);
    await key("End");
    await click("May");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("marks disabled options with aria-disabled", async () => {
    await mount("w", html());
    expect(document.querySelector('[data-value="4"]').getAttribute("aria-disabled")).toBe("true");
    expect(document.querySelector('[data-value="3"]').hasAttribute("aria-disabled")).toBe(false);
  });

  it("when disabled: not focusable, ignores keys and clicks", async () => {
    await mount("w", html(", disabled: true"));
    expect(list().getAttribute("tabindex")).toBe("-1");
    expect(list().getAttribute("aria-disabled")).toBe("true");
    await key("ArrowDown");
    await click("May");
    expect(selected()).toBe("February");
  });
});
