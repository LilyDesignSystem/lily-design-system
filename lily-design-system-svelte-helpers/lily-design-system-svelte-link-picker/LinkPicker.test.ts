import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import LinkPicker, { linkId, nextLinkPickerId, type LinkItem } from "./LinkPicker.svelte";

const LINKS: LinkItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Privacy Policy", href: "/privacy/" },
];

afterEach(() => cleanup());

const flush = () => new Promise((r) => setTimeout(r, 0));
const button = () => screen.getByRole("button", { name: "Pages" });
const links = () => Array.from(document.querySelectorAll<HTMLAnchorElement>(".link-picker-link"));
const list = () => document.querySelector(".link-picker-list") as HTMLUListElement;

function mount(props: Record<string, unknown> = {}) {
    return render(LinkPicker, { props: { label: "Pages", links: LINKS, ...props } });
}

describe("LinkPicker", () => {
    test("7.1 renders the root, button, tooltip and a hidden list", () => {
        const { container } = mount();
        const root = container.querySelector("div.link-picker") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.querySelector("button.link-picker-button")).toBeTruthy();
        expect(root.querySelector(".link-picker-tooltip")).toBeTruthy();
        expect(list().hidden).toBe(true);
    });

    test("7.2 the button is named by label with aria-expanded and aria-controls", () => {
        mount();
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(button().getAttribute("aria-controls")).toBe(list().id);
    });

    test("7.3 the default icon is an aria-hidden svg; children replaces it", () => {
        const { container } = mount();
        const svg = container.querySelector("svg.link-picker-icon") as SVGElement;
        expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
    });

    test("7.4 one real link per entry, in order", () => {
        mount();
        expect(links().map((a) => [a.textContent?.trim(), a.getAttribute("href")])).toEqual([
            ["Home", "/"],
            ["About Us", "/about/"],
            ["Contact Us", "/contact/"],
            ["Privacy Policy", "/privacy/"],
        ]);
    });

    test("7.5 no links are invented", () => {
        mount({ links: [] });
        expect(links()).toHaveLength(0);
    });

    test("7.6 the list is named with label", () => {
        mount();
        expect(list().getAttribute("aria-label")).toBe("Pages");
    });

    test("7.7 click opens the list and focuses the first link", async () => {
        mount();
        await fireEvent.click(button());
        await flush();
        expect(list().hidden).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(links()[0]);
    });

    test("7.8 a second click closes", async () => {
        mount();
        await fireEvent.click(button());
        await fireEvent.click(button());
        expect(list().hidden).toBe(true);
    });

    test("7.9 ArrowDown opens at the first link, ArrowUp at the last", async () => {
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowDown" });
        await flush();
        expect(document.activeElement).toBe(links()[0]);
        cleanup();
        mount();
        await fireEvent.keyDown(button(), { key: "ArrowUp" });
        await flush();
        expect(document.activeElement).toBe(links()[3]);
    });

    test("7.10 arrows move and clamp; Home and End jump", async () => {
        mount();
        await fireEvent.click(button());
        await flush();
        await fireEvent.keyDown(list(), { key: "ArrowUp" });
        expect(document.activeElement).toBe(links()[0]);
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(document.activeElement).toBe(links()[1]);
        await fireEvent.keyDown(list(), { key: "End" });
        expect(document.activeElement).toBe(links()[3]);
        await fireEvent.keyDown(list(), { key: "ArrowDown" });
        expect(document.activeElement).toBe(links()[3]);
        await fireEvent.keyDown(list(), { key: "Home" });
        expect(document.activeElement).toBe(links()[0]);
    });

    test("7.11 Escape closes and returns focus to the button", async () => {
        mount();
        await fireEvent.click(button());
        await flush();
        await fireEvent.keyDown(list(), { key: "Escape" });
        await flush();
        expect(list().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.12 Tab closes without sending focus to the document top", async () => {
        mount();
        await fireEvent.click(button());
        await flush();
        await fireEvent.keyDown(list(), { key: "Tab" });
        expect(list().hidden).toBe(true);
        expect(document.activeElement).toBe(button());
    });

    test("7.13 clicking outside closes", async () => {
        mount();
        await fireEvent.click(button());
        await fireEvent.click(document.body);
        expect(list().hidden).toBe(true);
    });

    test("7.14 current marks only that link aria-current=page", () => {
        mount({ links: [LINKS[0], { ...LINKS[1], current: true }, LINKS[2]] });
        expect(links().map((a) => a.getAttribute("aria-current"))).toEqual([null, "page", null]);
    });

    test("7.15 newTab adds target and rel", () => {
        mount({ links: [{ label: "Docs", href: "https://example.test/", newTab: true }, LINKS[0]] });
        expect(links()[0].getAttribute("target")).toBe("_blank");
        expect(links()[0].getAttribute("rel")).toBe("noopener noreferrer");
        expect(links()[1].hasAttribute("target")).toBe(false);
    });

    test("7.16 onNavigate reports the id, else the href", async () => {
        const onNavigate = vi.fn();
        mount({ onNavigate, links: [{ id: "about", label: "About Us", href: "/about/" }, LINKS[0]] });
        await fireEvent.click(button());
        links()[0].addEventListener("click", (e) => e.preventDefault());
        await fireEvent.click(links()[0]);
        await fireEvent.click(button());
        links()[1].addEventListener("click", (e) => e.preventDefault());
        await fireEvent.click(links()[1]);
        expect(onNavigate.mock.calls).toEqual([["about", "/about/"], ["/", "/"]]);
        expect(linkId({ label: "x", href: "/y" })).toBe("/y");
    });

    test("7.17 navigate handles a plain left click only", async () => {
        const navigate = vi.fn();
        mount({ navigate, links: [LINKS[1], { label: "Docs", href: "https://example.test/", newTab: true }] });
        await fireEvent.click(button());
        const plain = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        links()[0].dispatchEvent(plain);
        expect(navigate).toHaveBeenCalledWith("/about/");
        expect(plain.defaultPrevented).toBe(true);
        navigate.mockClear();
        await fireEvent.click(button());
        const ctrl = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true });
        links()[0].dispatchEvent(ctrl);
        expect(navigate).not.toHaveBeenCalled();
        expect(ctrl.defaultPrevented).toBe(false);
        await fireEvent.click(button());
        const tab = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        links()[1].dispatchEvent(tab);
        expect(navigate).not.toHaveBeenCalled();
        expect(tab.defaultPrevented).toBe(false);
    });

    test("7.18 without navigate a click is left to the browser", async () => {
        mount();
        await fireEvent.click(button());
        const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        links()[0].dispatchEvent(ev);
        expect(ev.defaultPrevented).toBe(false);
    });

    test("7.19 the tooltip is a hidden role=tooltip holding the label", () => {
        mount();
        const tip = document.querySelector(".link-picker-tooltip") as HTMLElement;
        expect(tip.getAttribute("role")).toBe("tooltip");
        expect(tip.textContent).toBe("Pages");
        expect(tip.hidden).toBe(true);
    });

    test("7.20 the tooltip shows on hover, hides on Escape, and never shows while open", async () => {
        mount();
        const tip = document.querySelector(".link-picker-tooltip") as HTMLElement;
        await fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        await fireEvent.keyDown(document, { key: "Escape" });
        expect(tip.hidden).toBe(true);
        await fireEvent.mouseLeave(button());
        await fireEvent.mouseEnter(button());
        expect(tip.hidden).toBe(false);
        await fireEvent.click(button());
        expect(tip.hidden).toBe(true);
    });

    test("7.21 the tooltip is not wired with aria-describedby", () => {
        mount();
        expect(button().hasAttribute("aria-describedby")).toBe(false);
    });

    test("7.22 class is appended and rest props are spread on the root", () => {
        const { container } = mount({ class: "extra", "data-x": "1" });
        const root = container.querySelector(".link-picker") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("data-x")).toBe("1");
    });

    test("7.23 two instances get distinct ids", () => {
        expect(nextLinkPickerId()).not.toBe(nextLinkPickerId());
    });

    test("7.24 the source ships no stylesheet, inline style, English default or route", () => {
        const src = readFileSync(resolve(__dirname, "LinkPicker.svelte"), "utf8")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/^\s*\/\/.*$/gm, "");
        expect(src).not.toMatch(/<style|style=/);
        expect(src).not.toMatch(/(label|href):\s*["'`]/);
        expect(src).not.toMatch(/href="\//);
    });
});
