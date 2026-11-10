import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("editable", () => {
    it("renders a <div> holding a native button named by the value and the label, and a hidden field", () => {
        const { document } = render("editable", { label: "Name", value: "Ada", classes: "mine" });
        const root = document.querySelector("div.editable");
        expect(root.getAttribute("class")).toBe("editable mine");
        const button = root.querySelector("button.editable-button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-label")).toBe("Ada, Name");
        expect(button.textContent).toBe("Ada");
        expect(button.hasAttribute("role")).toBe(false);
        const input = root.querySelector("input.editable-input");
        expect(input.getAttribute("aria-label")).toBe("Name");
        expect(input.hidden).toBe(true);
    });

    it("an empty value names the button by its label alone; text still works for value", () => {
        expect(
            render("editable", { label: "Name" })
                .document.querySelector("button")
                .getAttribute("aria-label"),
        ).toBe("Name");
        expect(
            render("editable", { label: "Name", text: "Bo" }).document.querySelector("button")
                .textContent,
        ).toBe("Bo");
    });

    it("editing shows the field first; disabled disables the button", () => {
        const editing = render("editable", { label: "Name", value: "x", editing: true }).document;
        expect(editing.querySelector("button").hidden).toBe(true);
        expect(editing.querySelector("input").hidden).toBe(false);
        expect(
            render("editable", { label: "Name", disabled: true }).document.querySelector("button")
                .disabled,
        ).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("editable", { label: "Name", value: "x" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("editable keys", () => {
    it("the button begins, Enter keeps and Escape puts it back, with focus following", () => {
        const { document } = render("editable", { label: "Name", value: "Ada" });
        autoInit(document);
        const root = document.querySelector(".editable");
        const button = root.querySelector("button");
        const input = root.querySelector("input");
        const kept = [];
        root.addEventListener("editable-change", (event) => kept.push(event.detail.value));
        button.click();
        expect(input.hidden).toBe(false);
        expect(document.activeElement).toBe(input);
        input.value = "Grace";
        on(input).press("Enter");
        expect(button.textContent).toBe("Grace");
        expect(button.getAttribute("aria-label")).toBe("Grace, Name");
        expect(document.activeElement).toBe(button);
        expect(kept).toEqual(["Grace"]);
        button.click();
        input.value = "Lost";
        on(input).press("Escape");
        expect(button.textContent).toBe("Grace");
        expect(input.hidden).toBe(true);
        expect(kept).toEqual(["Grace"]);
    });
});
