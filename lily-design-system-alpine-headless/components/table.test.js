// table.test.js
// Table component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("table.table");

describe("Table", () => {
    it("renders the element with its base class", async () => {
        await mount("table");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("table")).toBe(true);
    });

    it("uses the table element", async () => {
        await mount("table");
        expect(el().tagName.toLowerCase()).toBe("table");
    });
});
