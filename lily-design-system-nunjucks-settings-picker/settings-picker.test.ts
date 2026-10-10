// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { autoInit, initSettingsPicker, nextSettingsPickerId } from "./settings-picker.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const CONTENT =
  `<a href="/a/">Alpha</a><button type="button" class="b">Beta</button>` +
  `<div data-settings-picker-keep-open><button type="button" class="keep">Keep</button></div>` +
  `<button type="button" class="closer">Closer</button>`;

function renderMacro(opts: Record<string, unknown>, content: string | null = CONTENT): string {
  const body = content === null ? "" : content;
  return env.renderString(
    content === null
      ? `{% from "./settings-picker.njk" import settingsPicker %}{{ settingsPicker(opts) }}`
      : `{% from "./settings-picker.njk" import settingsPicker %}{% call settingsPicker(opts) %}${body}{% endcall %}`,
    { opts },
  );
}

function setup(opts: Record<string, unknown> = {}, init: Record<string, unknown> = {}, content: string | null = CONTENT) {
  document.body.innerHTML = renderMacro({ label: "Settings", ...opts }, content);
  const root = document.body.querySelector("[data-lily-settings-picker-root]") as HTMLElement;
  const api = initSettingsPicker(root, init);
  return {
    root,
    api,
    trigger: root.querySelector(".settings-picker-button") as HTMLButtonElement,
    panel: root.querySelector(".settings-picker-panel") as HTMLElement,
  };
}

const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
const click = (el: Element, init: MouseEventInit = {}) => {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  el.dispatchEvent(ev);
  return ev;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("settings-picker (Nunjucks)", () => {
  test("7.1 renders the root, button, tooltip and a hidden panel", () => {
    const { root, panel } = setup();
    expect(root.matches("div.settings-picker")).toBe(true);
    expect(root.querySelector("button.settings-picker-button")).toBeTruthy();
    expect(root.querySelector(".settings-picker-tooltip")).toBeTruthy();
    expect(panel.hidden).toBe(true);
  });

  test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
    const { trigger, panel } = setup();
    expect(trigger.getAttribute("aria-label")).toBe("Settings");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
  });

  test("7.3 the default icon is an aria-hidden svg; iconHtml replaces it", () => {
    const { root } = setup();
    const svg = root.querySelector("svg.settings-picker-icon")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    document.body.innerHTML = renderMacro({ label: "Settings", iconHtml: `<span class="mine">x</span>` });
    expect(document.querySelector(".mine")).toBeTruthy();
    expect(document.querySelector("svg.settings-picker-icon")).toBeNull();
  });

  test("7.4 the panel is a role=group named with label", () => {
    const { panel } = setup();
    expect(panel.getAttribute("role")).toBe("group");
    expect(panel.getAttribute("aria-label")).toBe("Settings");
  });

  test("7.5 the app's content renders inside, server-side; with none the panel is empty", () => {
    const { panel } = setup();
    expect(panel.querySelector("a")?.textContent).toBe("Alpha");
    expect(setup({}, {}, null).panel.textContent?.trim()).toBe("");
  });

  test("7.6 click opens and leaves focus on the button", () => {
    const { trigger, panel } = setup();
    trigger.focus();
    trigger.click();
    expect(panel.hidden).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(trigger);
  });

  test("7.7 a second click closes", () => {
    const { trigger, panel } = setup();
    trigger.click();
    trigger.click();
    expect(panel.hidden).toBe(true);
  });

  test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", () => {
    const a = setup();
    key(a.trigger, "ArrowDown");
    expect(a.panel.hidden).toBe(false);
    expect(document.activeElement).toBe(a.panel.querySelector("a"));
    const b = setup();
    key(b.trigger, "ArrowUp");
    expect(document.activeElement).toBe(b.panel.querySelector(".closer"));
  });

  test("7.9 Escape closes and returns focus to the button", () => {
    const { trigger, panel } = setup();
    key(trigger, "ArrowDown");
    key(panel, "Escape");
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  test("7.10 Tab closes without sending focus to the document top", () => {
    const { trigger, panel } = setup();
    key(trigger, "ArrowDown");
    key(panel, "Tab");
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  test("7.11 clicking outside closes", () => {
    const { trigger, panel } = setup();
    trigger.click();
    click(document.body);
    expect(panel.hidden).toBe(true);
  });

  test("7.12 focus leaving the picker closes", () => {
    const { trigger, panel } = setup();
    trigger.click();
    trigger.focus();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    expect(panel.hidden).toBe(true);
  });

  test("7.13 activating a link or button closes; keep-open and closeOnSelect=false do not", () => {
    const { trigger, panel } = setup();
    trigger.click();
    panel.querySelector("a")!.addEventListener("click", (e) => e.preventDefault());
    click(panel.querySelector("a")!);
    expect(panel.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    click(panel.querySelector(".b")!);
    expect(panel.hidden).toBe(true);
    trigger.click();
    click(panel.querySelector(".keep")!);
    expect(panel.hidden).toBe(false);
    const off = setup({}, { closeOnSelect: false });
    off.trigger.click();
    click(off.panel.querySelector(".b")!);
    expect(off.panel.hidden).toBe(false);
  });

  test("7.14 the content can close the panel through the returned api", () => {
    const { trigger, panel, api } = setup({}, { closeOnSelect: false });
    trigger.click();
    api.close();
    expect(panel.hidden).toBe(true);
  });

  test("7.15 onOpenChange fires once per actual change; open:true renders open", () => {
    const onOpenChange = vi.fn();
    const { trigger } = setup({}, { onOpenChange });
    trigger.click();
    trigger.click();
    click(document.body);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    const pre = setup({ open: true });
    expect(pre.panel.hidden).toBe(false);
    expect(pre.trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
    const tip = setup().root.querySelector(".settings-picker-tooltip") as HTMLElement;
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toBe("Settings");
    expect(tip.hidden).toBe(true);
  });

  test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
    const { root, trigger } = setup();
    const tip = root.querySelector(".settings-picker-tooltip") as HTMLElement;
    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hidden).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(tip.hidden).toBe(true);
    trigger.dispatchEvent(new MouseEvent("mouseleave"));
    trigger.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tip.hidden).toBe(false);
    trigger.click();
    expect(tip.hidden).toBe(true);
  });

  test("7.18 the tooltip is not wired with aria-describedby", () => {
    expect(setup().trigger.hasAttribute("aria-describedby")).toBe(false);
  });

  test("7.19 classes and attributes are applied to the root", () => {
    const { root } = setup({ classes: "extra", attributes: { "data-x": "1" } });
    expect(root.classList.contains("extra")).toBe(true);
    expect(root.getAttribute("data-x")).toBe("1");
  });

  test("7.20 ids derive from name/id, and the JS minter is distinct", () => {
    expect(setup({ name: "a" }).panel.id).toBe("settings-picker-a-panel");
    expect(setup({ id: "custom" }).panel.id).toBe("custom-panel");
    expect(nextSettingsPickerId()).not.toBe(nextSettingsPickerId());
    document.body.innerHTML = renderMacro({ label: "Settings" }) + renderMacro({ label: "Settings" });
    expect(autoInit()).toHaveLength(2);
  });

  test("7.21 the sources ship no stylesheet, inline style or English default", () => {
    for (const f of ["settings-picker.njk", "settings-picker.client.js"]) {
      const src = readFileSync(path.join(__dirname, f), "utf8")
        .replace(/\{#[\s\S]*?#\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      expect(src).not.toMatch(/<style|style=|\.style\./);
    }
  });
});
