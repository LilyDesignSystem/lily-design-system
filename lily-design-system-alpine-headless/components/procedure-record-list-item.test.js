// procedure-record-list-item.test.js
// ProcedureRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.procedure-record-list-item");

describe("ProcedureRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("procedure-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("procedure-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("procedure-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
