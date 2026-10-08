import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { h, nextTick } from "vue";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import SettingsPicker, { nextSettingsPickerId } from "./SettingsPicker.vue";

/** Let Vue's scheduler, the async click handlers, and nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

const content = (args: { close: () => void }) => [
    h("a", { href: "/a/" }, "Alpha"),
    h("button", { type: "button", class: "b" }, "Beta"),
    h("div", { "data-settings-picker-keep-open": "" }, [h("button", { type: "button", class: "keep" }, "Keep")]),
    h(
        "button",
        {
            type: "button",
            class: "closer",
            onClick: (e: Event) => {
                e.stopPropagation();
                args.close();
            },
        },
        "Closer",
    ),
];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(SettingsPicker, {
        props: { label: "Settings", ...props },
        slots: { default: content },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

const parts = (w: VueWrapper<any>) => ({
    button: w.find("button.settings-picker-button"),
    panel: w.find("div.settings-picker-panel"),
});
const isHidden = (w: VueWrapper<any>) => parts(w).panel.attributes("hidden") !== undefined;

afterEach(() => {
    while (wrappers.length) wrappers.pop()?.unmount();
    document.body.innerHTML = "";
});

describe("SettingsPicker", () => {
    test("7.1 renders the root, button, tooltip and a hidden panel", () => {
        const w = build();
        expect(w.find("div.settings-picker").exists()).toBe(true);
        expect(parts(w).button.exists()).toBe(true);
        expect(w.find(".settings-picker-tooltip").exists()).toBe(true);
        expect(isHidden(w)).toBe(true);
    });

    test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
        const w = build();
        const { button, panel } = parts(w);
        expect(button.attributes("aria-label")).toBe("Settings");
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(button.attributes("aria-controls")).toBe(panel.attributes("id"));
    });

    test("7.3 the default icon is an aria-hidden svg; the icon slot replaces it", () => {
        const w = build();
        const svg = w.find("svg.settings-picker-icon");
        expect(svg.attributes("aria-hidden")).toBe("true");
        expect(svg.attributes("viewBox")).toBe("0 0 16 16");
        const w2 = build({}, { slots: { icon: () => h("span", { class: "mine" }, "x") } });
        expect(w2.find(".mine").exists()).toBe(true);
        expect(w2.find("svg.settings-picker-icon").exists()).toBe(false);
    });

    test("7.4 the panel is a role=group named with label", () => {
        const w = build();
        expect(parts(w).panel.attributes("role")).toBe("group");
        expect(parts(w).panel.attributes("aria-label")).toBe("Settings");
    });

    test("7.5 the app's content renders inside; with none the panel is empty", () => {
        const w = build();
        expect(parts(w).panel.find("a").text()).toBe("Alpha");
        const w2 = build({}, { slots: {} });
        expect(parts(w2).panel.text()).toBe("");
    });

    test("7.6 click opens and leaves focus on the button", async () => {
        const w = build();
        (parts(w).button.element as HTMLElement).focus();
        await parts(w).button.trigger("click");
        await flush();
        expect(isHidden(w)).toBe(false);
        expect(parts(w).button.attributes("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(parts(w).button.element);
    });

    test("7.7 a second click closes", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await parts(w).button.trigger("click");
        await flush();
        expect(isHidden(w)).toBe(true);
    });

    test("7.8 ArrowDown opens at the first focusable, ArrowUp at the last", async () => {
        const w = build();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        expect(isHidden(w)).toBe(false);
        expect(document.activeElement).toBe(parts(w).panel.find("a").element);
        const w2 = build();
        await parts(w2).button.trigger("keydown", { key: "ArrowUp" });
        await flush();
        expect(document.activeElement).toBe(parts(w2).panel.find(".closer").element);
    });

    test("7.9 Escape closes and returns focus to the button", async () => {
        const w = build();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        await parts(w).panel.trigger("keydown", { key: "Escape" });
        await flush();
        expect(isHidden(w)).toBe(true);
        expect(document.activeElement).toBe(parts(w).button.element);
    });

    test("7.10 Tab closes without sending focus to the document top", async () => {
        const w = build();
        await parts(w).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        await parts(w).panel.trigger("keydown", { key: "Tab" });
        await flush();
        expect(isHidden(w)).toBe(true);
        expect(document.activeElement).toBe(parts(w).button.element);
    });

    test("7.11 clicking outside closes", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        document.body.click();
        await flush();
        expect(isHidden(w)).toBe(true);
    });

    test("7.12 focus leaving the picker closes", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        await w.find("div.settings-picker").trigger("focusout", { relatedTarget: outside });
        await flush();
        expect(isHidden(w)).toBe(true);
    });

    test("7.13 activating a link or button closes; keep-open and closeOnSelect=false do not", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        (parts(w).panel.find("a").element as HTMLElement).addEventListener("click", (e) => e.preventDefault());
        await parts(w).panel.find("a").trigger("click");
        await flush();
        expect(isHidden(w)).toBe(true);
        expect(document.activeElement).toBe(parts(w).button.element);
        await parts(w).button.trigger("click");
        await parts(w).panel.find(".b").trigger("click");
        await flush();
        expect(isHidden(w)).toBe(true);
        await parts(w).button.trigger("click");
        await parts(w).panel.find(".keep").trigger("click");
        await flush();
        expect(isHidden(w)).toBe(false);
        const w2 = build({ closeOnSelect: false });
        await parts(w2).button.trigger("click");
        await parts(w2).panel.find(".b").trigger("click");
        await flush();
        expect(isHidden(w2)).toBe(false);
    });

    test("7.14 the content receives close()", async () => {
        const w = build({ closeOnSelect: false });
        await parts(w).button.trigger("click");
        await parts(w).panel.find(".closer").trigger("click");
        await flush();
        expect(isHidden(w)).toBe(true);
    });

    test("7.15 v-model:open updates once per actual change", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await parts(w).button.trigger("click");
        document.body.click();
        await flush();
        expect(w.emitted("update:open")).toEqual([[true], [false]]);
        const w2 = build({ open: true });
        expect(isHidden(w2)).toBe(false);
    });

    test("7.16 the tooltip is a hidden role=tooltip holding the label", () => {
        const w = build();
        const tip = w.find(".settings-picker-tooltip");
        expect(tip.attributes("role")).toBe("tooltip");
        expect(tip.text()).toBe("Settings");
        expect(tip.attributes("hidden")).toBeDefined();
    });

    test("7.17 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
        const w = build();
        const tip = () => w.find(".settings-picker-tooltip");
        await parts(w).button.trigger("mouseenter");
        expect(tip().attributes("hidden")).toBeUndefined();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await nextTick();
        expect(tip().attributes("hidden")).toBeDefined();
        await parts(w).button.trigger("mouseleave");
        await parts(w).button.trigger("mouseenter");
        expect(tip().attributes("hidden")).toBeUndefined();
        await parts(w).button.trigger("click");
        await flush();
        expect(tip().attributes("hidden")).toBeDefined();
    });

    test("7.18 the tooltip is not wired with aria-describedby", () => {
        const w = build();
        expect(parts(w).button.attributes("aria-describedby")).toBeUndefined();
    });

    test("7.19 class is appended to the root", () => {
        const w = build({ class: "extra" });
        expect(w.find("div.settings-picker").classes()).toContain("extra");
    });

    test("7.20 two instances get distinct ids", () => {
        expect(nextSettingsPickerId()).not.toBe(nextSettingsPickerId());
        const a = build();
        const b = build();
        expect(parts(a).panel.attributes("id")).not.toBe(parts(b).panel.attributes("id"));
    });

    test("7.21 the source ships no stylesheet, inline style or English default", () => {
        const src = readFileSync(resolve(__dirname, "SettingsPicker.vue"), "utf8")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");
        expect(src).not.toMatch(/<style|style=/);
        expect(src).not.toMatch(/(label|href):\s*["'`]/);
    });
});
