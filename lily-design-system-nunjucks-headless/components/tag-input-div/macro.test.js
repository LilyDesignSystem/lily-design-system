// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render } from "../../test/render.js";
import { initTagInputDiv } from "./tag-input-div.js";

const params = {
    id: "tags",
    name: "tags",
    tags: ["diabetes", "hypertension"],
    label: "Tags",
    removeLabel: (tag) => `Take off ${tag}`,
};

/** The macro's markup in a live document, wired. */
function wired(extra = {}) {
    const { html } = render("tag-input-div", { ...params, ...extra });
    document.body.innerHTML = html;
    const root = document.querySelector(".tag-input-div");
    initTagInputDiv(root);
    return { root, field: root.querySelector(".tag-input-div-field") };
}

const enter = (field, init = {}) => {
    const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
        ...init,
    });
    field.dispatchEvent(event);
    return event;
};

describe("tag-input-div", () => {
    it("renders a named group with a list of tags and a text input", () => {
        const { document } = render("tag-input-div", params);
        const root = document.querySelector("div.tag-input-div");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Tags");
        const items = document.querySelectorAll("li.tag-input-div-list-item");
        expect(items.length).toBe(2);
        expect(items[0].querySelector(".tag-input-div-list-item-text").textContent.trim()).toBe(
            "diabetes",
        );
        expect(items[0].querySelector("input[type=hidden]").getAttribute("value")).toBe("diabetes");
        expect(document.querySelector("input.tag-input-div-field").getAttribute("aria-label")).toBe(
            "Tags",
        );
    });

    it("names each remove button from removeLabel, and ships no English", () => {
        const { document, html } = render("tag-input-div", params);
        const button = document.querySelector(".tag-input-div-list-item-remove");
        expect(button.getAttribute("aria-label")).toBe("Take off diabetes");
        expect(html).not.toContain("Remove");
    });

    it("has no remove button without removeLabel", () => {
        const { document } = render("tag-input-div", { ...params, removeLabel: undefined });
        expect(document.querySelector(".tag-input-div-list-item-remove")).toBeNull();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("tag-input-div", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("Enter fires tag-input-div-add with the trimmed text and clears the field", () => {
        const { root, field } = wired();
        const added = vi.fn();
        root.addEventListener("tag-input-div-add", (event) => added(event.detail.value));
        field.value = "  asthma  ";
        expect(enter(field).defaultPrevented).toBe(true);
        expect(added).toHaveBeenCalledWith("asthma");
        expect(field.value).toBe("");
    });

    it("Enter on blank text adds nothing and stays a normal Enter", () => {
        const { root, field } = wired();
        const added = vi.fn();
        root.addEventListener("tag-input-div-add", added);
        field.value = "   ";
        expect(enter(field).defaultPrevented).toBe(false);
        expect(added).not.toHaveBeenCalled();
    });

    it("Enter during an IME composition adds nothing", () => {
        const { root, field } = wired();
        const added = vi.fn();
        root.addEventListener("tag-input-div-add", added);
        field.value = "asthma";
        enter(field, { isComposing: true });
        expect(added).not.toHaveBeenCalled();
    });

    it("a remove button takes its tag and hidden input out, and returns focus to the field", () => {
        const { root, field } = wired();
        const removed = vi.fn();
        root.addEventListener("tag-input-div-remove", (event) => removed(event.detail.value));
        root.querySelector(".tag-input-div-list-item-remove").click();
        expect(removed).toHaveBeenCalledWith("diabetes");
        expect(root.querySelectorAll("li").length).toBe(1);
        expect(root.querySelectorAll("input[type=hidden]").length).toBe(1);
        expect(document.activeElement).toBe(field);
    });
});
