// Every element that is its own root and follows its label with followSelf (tasks.md P50-T28): after it is mounted, a new label,
// no label and a new class are shown on the element itself, a label that comes later brings the role the element takes when
// named, and the content stays. The list is read from the components, so a new user is covered.
import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import "../index.js";

const dir = path.join(__dirname, "..", "components");
const USERS = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".ts") && !/\.(test|stories)\.ts$/.test(name))
    .flatMap((name) => {
        const source = fs.readFileSync(path.join(dir, name), "utf-8");
        const call = source.match(
            /followSelf\(\s*this,\s*"([^"]+)",\s*name,?\s*(?:"([a-z]+)",?\s*)?\)/,
        );
        if (!call) return [];
        const label = /observedAttributes[\s\S]{0,80}"label"/.test(source);
        return [[call[1], label, call[2] ?? null] as const];
    });

describe("followSelf", () => {
    test("is used by the elements that are their own root", () => {
        expect(USERS.length).toBeGreaterThan(40);
    });

    test.each(USERS)("%s shows a change to its label and class", (slug, label, role) => {
        document.body.innerHTML = `<lily-${slug}${label ? ' label="First"' : ""}><span>Content</span></lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const content = host.textContent;
        host.className = "mine";
        expect(host.classList.contains(slug)).toBe(true);
        expect(host.classList.contains("mine")).toBe(true);
        if (label) {
            expect(host.getAttribute("aria-label")).toBe("First");
            host.setAttribute("label", "Second");
            expect(host.getAttribute("aria-label")).toBe("Second");
            host.removeAttribute("label");
            expect(host.hasAttribute("aria-label")).toBe(false);
        }
        expect(host.textContent).toBe(content);
        document.body.innerHTML = "";
        if (!role) return;
        // Named later, it takes the role it takes when named.
        document.body.innerHTML = `<lily-${slug}></lily-${slug}>`;
        const later = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        expect(later.hasAttribute("role")).toBe(false);
        later.setAttribute("label", "Named");
        expect(later.getAttribute("role")).toBe(role);
        expect(later.getAttribute("aria-label")).toBe("Named");
        document.body.innerHTML = "";
    });
});
