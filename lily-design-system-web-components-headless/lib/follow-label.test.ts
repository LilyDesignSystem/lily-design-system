// Every element that follows its label with followLabel (tasks.md P50-T28): after it is mounted, a new label, no label, and a new
// class are shown on the element it renders, the same one it rendered first. The list is read from the components, so a new user
// is covered.
import * as fs from "node:fs";
import * as path from "node:path";

import { describe, expect, test } from "vitest";

import "../index.js";

const dir = path.join(__dirname, "..", "components");
const USERS = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".ts") && !/\.(test|stories)\.ts$/.test(name))
    .flatMap((name) => {
        const call = fs
            .readFileSync(path.join(dir, name), "utf-8")
            .match(/followLabel\(\s*this,\s*"([^"]+)",\s*"[^"]+",?\s*(?:"([^"]+)",?\s*)?\)/);
        return call ? [[name.slice(0, -3), call[1], call[2] ?? null] as const] : [];
    });

describe("followLabel", () => {
    test("is used by the elements that only take a label", () => {
        expect(USERS.length).toBeGreaterThan(50);
    });

    test.each(USERS)("%s shows a change to label and class", async (slug, selector, labelled) => {
        document.body.innerHTML = `<lily-${slug} label="First"><span>Content</span></lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const root = host.querySelector(`:scope > ${selector}`)!;
        expect(root).not.toBeNull();
        const named = () => (labelled ? root.querySelector(`:scope > ${labelled}`)! : root);
        expect(named().getAttribute("aria-label")).toBe("First");
        const content = root.textContent;
        host.setAttribute("label", "Second");
        host.className = "mine";
        expect(host.querySelector(`:scope > ${selector}`)).toBe(root);
        expect(named().getAttribute("aria-label")).toBe("Second");
        expect(root.classList.contains(slug)).toBe(true);
        expect(root.classList.contains("mine")).toBe(true);
        host.removeAttribute("label");
        expect(named().hasAttribute("aria-label")).toBe(false);
        expect(root.textContent).toBe(content);
        document.body.innerHTML = "";
    });
});
