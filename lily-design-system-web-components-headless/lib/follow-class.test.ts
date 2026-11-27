// Every element with no attribute of its own that follows its class with followClass (tasks.md P50-T28): after it is mounted, a
// new class is shown on the element it built, and its content stays. The list is read from the components.
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
            .match(/followClass\(\s*this,\s*"([^"]+)",\s*"([^"]+)"/);
        return call ? [[call[2], call[1]] as const] : [];
    });

describe("followClass", () => {
    test("is used by the elements with no attribute of their own", () => {
        expect(USERS.length).toBeGreaterThan(5);
    });

    test.each(USERS)("%s shows a change to class", (slug, selector) => {
        document.body.innerHTML = `<lily-${slug}>Content</lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const root = host.querySelector(`:scope > ${selector}`)!;
        expect(root).not.toBeNull();
        const content = root.textContent;
        host.className = "mine";
        expect(host.querySelector(`:scope > ${selector}`)).toBe(root);
        expect(root.className).toBe(`${slug} mine`);
        expect(root.textContent).toBe(content);
        document.body.innerHTML = "";
    });
});
