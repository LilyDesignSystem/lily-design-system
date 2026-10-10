import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test, vi } from "vitest";
import { h, nextTick } from "vue";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import LinkPicker, { linkId, nextLinkPickerId, type LinkItem } from "./LinkPicker.vue";

const LINKS: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
];

/** Let Vue's scheduler, the async click handlers, and nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(LinkPicker, {
        props: { label: "Pages", links: LINKS, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

const parts = (w: VueWrapper<any>) => ({
    button: w.find("button.link-picker-button"),
    list: w.find("ul.link-picker-list"),
});
const anchors = (w: VueWrapper<any>) => w.findAll("a.link-picker-link");

afterEach(() => {
    while (wrappers.length) wrappers.pop()?.unmount();
    document.body.innerHTML = "";
});

describe("LinkPicker", () => {
    test("7.1 renders the root, button, tooltip and a hidden list", () => {
        const w = build();
        expect(w.find("div.link-picker").exists()).toBe(true);
        expect(parts(w).button.exists()).toBe(true);
        expect(w.find(".link-picker-tooltip").exists()).toBe(true);
        expect(parts(w).list.attributes("hidden")).toBeDefined();
    });

    test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
        const w = build();
        const { button, list } = parts(w);
        expect(button.attributes("aria-label")).toBe("Pages");
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(button.attributes("aria-controls")).toBe(list.attributes("id"));
    });

    test("7.3 the default icon is an aria-hidden svg; the slot replaces it", () => {
        const w = build();
        const svg = w.find("svg.link-picker-icon");
        expect(svg.attributes("aria-hidden")).toBe("true");
        expect(svg.attributes("viewBox")).toBe("0 0 16 16");
        const w2 = build({}, { slots: { default: () => h("span", { class: "mine" }, "x") } });
        expect(w2.find(".mine").exists()).toBe(true);
        expect(w2.find("svg.link-picker-icon").exists()).toBe(false);
    });

    test("7.4 one real link per entry, in order", () => {
        const w = build();
        expect(anchors(w).map((a) => [a.text(), a.attributes("href")])).toEqual([
            ["Home", "/"],
            ["About Us", "/about/"],
            ["Contact Us", "/contact/"],
            ["Privacy Policy", "/privacy/"],
        ]);
    });

    test("7.5 no links are invented", () => {
        expect(anchors(build({ links: [] }))).toHaveLength(0);
    });

    test("7.6 the list is named with label", () => {
        expect(parts(build()).list.attributes("aria-label")).toBe("Pages");
    });

    test("7.7 click opens the list and focuses the first link", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        expect(parts(w).list.attributes("hidden")).toBeUndefined();
        expect(parts(w).button.attributes("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(anchors(w)[0].element);
    });

    test("7.8 a second click closes", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        await parts(w).button.trigger("click");
        await flush();
        expect(parts(w).list.attributes("hidden")).toBeDefined();
    });

    test("7.9 ArrowDown opens at the first link, ArrowUp at the last", async () => {
        const a = build();
        await parts(a).button.trigger("keydown", { key: "ArrowDown" });
        await flush();
        expect(document.activeElement).toBe(anchors(a)[0].element);
        const b = build();
        await parts(b).button.trigger("keydown", { key: "ArrowUp" });
        await flush();
        expect(document.activeElement).toBe(anchors(b)[3].element);
    });

    test("7.10 arrows move and clamp; Home and End jump", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        const list = parts(w).list;
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(document.activeElement).toBe(anchors(w)[0].element);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(document.activeElement).toBe(anchors(w)[1].element);
        await list.trigger("keydown", { key: "End" });
        expect(document.activeElement).toBe(anchors(w)[3].element);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(document.activeElement).toBe(anchors(w)[3].element);
        await list.trigger("keydown", { key: "Home" });
        expect(document.activeElement).toBe(anchors(w)[0].element);
    });

    test("7.11 Escape closes and returns focus to the button", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        await parts(w).list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(parts(w).list.attributes("hidden")).toBeDefined();
        expect(document.activeElement).toBe(parts(w).button.element);
    });

    test("7.12 Tab closes without sending focus to the document top", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        await parts(w).list.trigger("keydown", { key: "Tab" });
        await flush();
        expect(parts(w).list.attributes("hidden")).toBeDefined();
        expect(document.activeElement).toBe(parts(w).button.element);
    });

    test("7.13 clicking outside closes", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        await flush();
        document.body.click();
        await flush();
        expect(parts(w).list.attributes("hidden")).toBeDefined();
    });

    test("7.14 current marks only that link aria-current=page", () => {
        const w = build({ links: [LINKS[0], { ...LINKS[1], current: true }, LINKS[2]] });
        expect(anchors(w).map((a) => a.attributes("aria-current") ?? null)).toEqual([null, "page", null]);
    });

    test("7.15 newTab adds target and rel", () => {
        const w = build({ links: [{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[0]] });
        expect(anchors(w)[0].attributes("target")).toBe("_blank");
        expect(anchors(w)[0].attributes("rel")).toBe("noopener noreferrer");
        expect(anchors(w)[1].attributes("target")).toBeUndefined();
    });

    test("7.16 the navigate event reports the id, else the href", async () => {
        const w = build({ links: [{ id: "about", label: "About Us", href: "/about/" }, LINKS[0]] });
        for (const a of anchors(w)) a.element.addEventListener("click", (e) => e.preventDefault());
        await parts(w).button.trigger("click");
        await anchors(w)[0].trigger("click");
        await flush();
        await parts(w).button.trigger("click");
        await anchors(w)[1].trigger("click");
        expect(w.emitted("navigate")).toEqual([["about", "/about/"], ["/", "/"]]);
        expect(linkId({ label: "x", href: "/y" })).toBe("/y");
    });

    test("7.17 navigate handles a plain left click only", async () => {
        const navigate = vi.fn();
        const w = build({ navigate, links: [LINKS[1], { label: "Docs", href: "https://example.test/", newTab: true }] });
        await parts(w).button.trigger("click");
        const plain = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        anchors(w)[0].element.dispatchEvent(plain);
        expect(navigate).toHaveBeenCalledWith("/about/");
        expect(plain.defaultPrevented).toBe(true);
        navigate.mockClear();
        await flush();
        await parts(w).button.trigger("click");
        const ctrl = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true });
        anchors(w)[0].element.dispatchEvent(ctrl);
        expect(navigate).not.toHaveBeenCalled();
        expect(ctrl.defaultPrevented).toBe(false);
        await flush();
        await parts(w).button.trigger("click");
        const tab = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        anchors(w)[1].element.dispatchEvent(tab);
        expect(navigate).not.toHaveBeenCalled();
        expect(tab.defaultPrevented).toBe(false);
    });

    test("7.18 without navigate a click is left to the browser", async () => {
        const w = build();
        await parts(w).button.trigger("click");
        const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        anchors(w)[0].element.dispatchEvent(ev);
        expect(ev.defaultPrevented).toBe(false);
    });

    test("7.19 the tooltip is a hidden role=tooltip holding the label", () => {
        const tip = build().find(".link-picker-tooltip");
        expect(tip.attributes("role")).toBe("tooltip");
        expect(tip.text()).toBe("Pages");
        expect(tip.attributes("hidden")).toBeDefined();
    });

    test("7.20 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
        const w = build();
        const tip = w.find(".link-picker-tooltip");
        await parts(w).button.trigger("mouseenter");
        expect(tip.attributes("hidden")).toBeUndefined();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        await nextTick();
        expect(tip.attributes("hidden")).toBeDefined();
        await parts(w).button.trigger("mouseleave");
        await parts(w).button.trigger("mouseenter");
        expect(tip.attributes("hidden")).toBeUndefined();
        await parts(w).button.trigger("click");
        await flush();
        expect(tip.attributes("hidden")).toBeDefined();
    });

    test("7.21 the tooltip is not wired with aria-describedby", () => {
        expect(parts(build()).button.attributes("aria-describedby")).toBeUndefined();
    });

    test("7.22 class is appended to the root", () => {
        const w = build({ class: "extra" });
        expect(w.find(".link-picker").classes()).toContain("extra");
    });

    test("7.23 two instances get distinct ids", () => {
        expect(nextLinkPickerId()).not.toBe(nextLinkPickerId());
        const a = parts(build()).list.attributes("id");
        const b = parts(build()).list.attributes("id");
        expect(a).not.toBe(b);
    });

    test("7.24 the source ships no stylesheet, inline style, English default or route", () => {
        const src = readFileSync(resolve(__dirname, "LinkPicker.vue"), "utf8")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");
        expect(src).not.toMatch(/<style|\sstyle=/);
        expect(src).not.toMatch(/(label|href):\s*["'`]/);
        expect(src).not.toMatch(/href="\//);
    });
});
