// problem-record-list-item.test.js
// ProblemRecordListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.problem-record-list-item");

describe("ProblemRecordListItem", () => {
    it("renders the element with its base class", async () => {
        await mount("problem-record-list-item");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("problem-record-list-item")).toBe(true);
    });

    it("uses the li element", async () => {
        await mount("problem-record-list-item");
        expect(el().tagName.toLowerCase()).toBe("li");
    });
});
