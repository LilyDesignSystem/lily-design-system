// procedure-record-list.test.js
// ProcedureRecordList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.procedure-record-list");

describe("ProcedureRecordList", () => {
    it("renders the element with its base class", async () => {
        await mount("procedure-record-list");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("procedure-record-list")).toBe(true);
    });

    it("uses the ul element", async () => {
        await mount("procedure-record-list");
        expect(el().tagName.toLowerCase()).toBe("ul");
    });
});
