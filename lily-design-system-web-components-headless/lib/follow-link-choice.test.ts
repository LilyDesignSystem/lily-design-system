// The elements that follow their attributes with followLink, followChoice and followInput's range (tasks.md P50-T28): after they
// are mounted, a change is shown on the same native element, and a box the person ticked is never unticked by it. The lists are
// read from the components, so a new user is covered.
import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import "../index.js";

const dir = path.join(__dirname, "..", "components");
const users = (pattern: RegExp) =>
    fs
        .readdirSync(dir)
        .filter((name) => name.endsWith(".ts") && !/\.(test|stories)\.ts$/.test(name))
        .filter((name) => pattern.test(fs.readFileSync(path.join(dir, name), "utf-8")))
        .map((name) => name.slice(0, -3));

const LINKS = users(/followLink\(/);
const CHOICES = users(/followChoice\(/);
const RANGES = users(/followInput\([^)]*range: true/);

describe("followLink", () => {
    test("is used by the link elements", () => expect(LINKS.length).toBeGreaterThan(4));

    test.each(LINKS)("%s shows a change to href, label and class", (slug) => {
        document.body.innerHTML = `<lily-${slug} href="/a" label="First">Text</lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const a = host.querySelector<HTMLAnchorElement>(`:scope > a.${slug}`)!;
        host.setAttribute("href", "/b");
        host.setAttribute("label", "Second");
        host.className = "mine";
        expect(host.querySelector(`:scope > a.${slug}`)).toBe(a);
        expect(a.getAttribute("href")).toBe("/b");
        expect(a.getAttribute("aria-label")).toBe("Second");
        expect(a.className).toBe(`${slug} mine`);
        host.removeAttribute("label");
        expect(a.hasAttribute("aria-label")).toBe(false);
        expect(a.textContent).toBe("Text");
        document.body.innerHTML = "";
    });
});

describe("followChoice", () => {
    test("is used by the radio elements", () => expect(CHOICES.length).toBeGreaterThan(4));

    test.each(CHOICES)("%s shows a change, and keeps what was ticked", (slug) => {
        document.body.innerHTML = `<lily-${slug} label="First" name="a" value="1" required></lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const input = host.querySelector<HTMLInputElement>(`:scope > input.${slug}`)!;
        host.setAttribute("label", "Second");
        host.setAttribute("name", "b");
        host.setAttribute("value", "2");
        host.setAttribute("disabled", "");
        expect(host.querySelector(`:scope > input.${slug}`)).toBe(input);
        expect(input.getAttribute("aria-label")).toBe("Second");
        expect(input.name).toBe("b");
        expect(input.value).toBe("2");
        expect(input.disabled).toBe(true);
        // An attribute passed through once, such as required here, is left as it was.
        expect(input.required).toBe(true);
        host.removeAttribute("disabled");
        input.checked = true;
        host.setAttribute("checked", "");
        expect(input.defaultChecked).toBe(true);
        host.removeAttribute("checked");
        expect(input.defaultChecked).toBe(false);
        expect(input.checked).toBe(true);
        document.body.innerHTML = "";
    });
});

describe("followInput with a range", () => {
    test("is used by the date elements", () => expect(RANGES.length).toBeGreaterThan(1));

    test.each(RANGES)("%s shows a change to min and max", (slug) => {
        document.body.innerHTML = `<lily-${slug} label="Date" min="2026-01-01"></lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const input = host.querySelector<HTMLInputElement>(`:scope > input.${slug}`)!;
        host.setAttribute("min", "2026-02-01");
        host.setAttribute("max", "2026-12-31");
        expect(input.getAttribute("min")).toBe("2026-02-01");
        expect(input.getAttribute("max")).toBe("2026-12-31");
        host.removeAttribute("min");
        expect(input.hasAttribute("min")).toBe(false);
        document.body.innerHTML = "";
    });
});
