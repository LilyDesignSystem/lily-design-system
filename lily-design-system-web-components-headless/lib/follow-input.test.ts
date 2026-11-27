// Every element that follows its input with followInput (tasks.md P50-T28): after it is mounted, a new label, required, disabled,
// class and default value are shown on the same <input>, and a value the person has typed is never overwritten. The list is read
// from the components, so a new user is covered.
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
            .match(/followInput\(\s*this,\s*this\.#input,\s*"([^"]+)"/);
        return call ? [call[1]] : [];
    });

// Three values each input type accepts: a browser clears one it cannot read, such as "1" in a month input.
const VALUES: Record<string, [string, string, string]> = {
    "date-input": ["2026-01-01", "2026-01-02", "2026-01-03"],
    "date-time-local-input": ["2026-01-01T09:00", "2026-01-01T10:00", "2026-01-01T11:00"],
    "month-input": ["2026-01", "2026-02", "2026-03"],
    "week-input": ["2026-W01", "2026-W02", "2026-W03"],
    "time-input": ["09:00", "10:00", "11:00"],
    "time-picker-input": ["09:00", "10:00", "11:00"],
};

describe("followInput", () => {
    test("is used by the native-input elements", () => {
        expect(USERS.length).toBeGreaterThan(10);
    });

    test.each(USERS)("%s shows a change, and keeps what was typed", (slug) => {
        document.body.innerHTML = `<lily-${slug} label="First"></lily-${slug}>`;
        const host = document.querySelector<HTMLElement>(`lily-${slug}`)!;
        const input = host.querySelector<HTMLInputElement>(`:scope > input.${slug}`)!;
        expect(input).not.toBeNull();
        host.setAttribute("label", "Second");
        host.setAttribute("required", "");
        host.setAttribute("disabled", "");
        host.className = "mine";
        expect(host.querySelector(`:scope > input.${slug}`)).toBe(input);
        expect(input.getAttribute("aria-label")).toBe("Second");
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
        expect(input.classList.contains(slug) && input.classList.contains("mine")).toBe(true);
        host.removeAttribute("required");
        host.removeAttribute("disabled");
        host.removeAttribute("label");
        expect(input.required).toBe(false);
        expect(input.disabled).toBe(false);
        expect(input.hasAttribute("aria-label")).toBe(false);
        // A new default shows until the person types; after that, what they typed stays.
        const [first, typed, third] = VALUES[slug] ?? ["1", "2", "3"];
        host.setAttribute("value", first);
        expect(input.value).toBe(first);
        input.value = typed;
        host.setAttribute("value", third);
        expect(input.defaultValue).toBe(third);
        expect(input.value).toBe(typed);
        document.body.innerHTML = "";
    });
});
