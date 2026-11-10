import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

const name = "wheel-picker";
const options = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April", disabled: true },
];
const base = { label: "Month", options, value: "2" };

describe("wheelPicker", () => {
    it("renders a div with the base class first, then the consumer class", () => {
        const { document } = render(name, { ...base, classes: "mine" });
        expect(document.querySelector("div.wheel-picker").getAttribute("class")).toBe(
            "wheel-picker mine",
        );
    });

    it("renders a vertical, named listbox with one option per entry", () => {
        const { document } = render(name, base);
        const list = document.querySelector(".wheel-picker-list");
        expect(list.getAttribute("role")).toBe("listbox");
        expect(list.getAttribute("aria-orientation")).toBe("vertical");
        expect(list.getAttribute("aria-label")).toBe("Month");
        expect(list.getAttribute("tabindex")).toBe("0");
        expect(document.querySelectorAll("[role=option]")).toHaveLength(4);
    });

    it("marks only the selected option and points aria-activedescendant at it", () => {
        const { document } = render(name, base);
        const selected = document.querySelectorAll('[aria-selected="true"]');
        expect(selected).toHaveLength(1);
        expect(selected[0].textContent).toBe("February");
        expect(
            document.querySelector(".wheel-picker-list").getAttribute("aria-activedescendant"),
        ).toBe(selected[0].id);
    });

    it("selects nothing, and omits aria-activedescendant, for an unknown value", () => {
        const { document } = render(name, { ...base, value: "zzz" });
        expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
        expect(
            document.querySelector(".wheel-picker-list").hasAttribute("aria-activedescendant"),
        ).toBe(false);
    });

    it("marks disabled options with aria-disabled", () => {
        const { document } = render(name, base);
        expect(document.querySelector('[data-value="4"]').getAttribute("aria-disabled")).toBe(
            "true",
        );
        expect(document.querySelector('[data-value="3"]').hasAttribute("aria-disabled")).toBe(
            false,
        );
    });

    it("carries loop and page size as data attributes for the browser script", () => {
        const { document } = render(name, { ...base, loop: true, pageSize: 3 });
        const root = document.querySelector(".wheel-picker");
        expect(root.hasAttribute("data-loop")).toBe(true);
        expect(root.getAttribute("data-page-size")).toBe("3");
        const plain = render(name, base).document.querySelector(".wheel-picker");
        expect(plain.hasAttribute("data-loop")).toBe(false);
    });

    it("when disabled: not focusable and aria-disabled", () => {
        const { document } = render(name, { ...base, disabled: true });
        const list = document.querySelector(".wheel-picker-list");
        expect(list.getAttribute("tabindex")).toBe("-1");
        expect(list.getAttribute("aria-disabled")).toBe("true");
    });

    it("renders a hidden input only when a name is given, carrying the value", () => {
        expect(render(name, base).document.querySelector("input")).toBeNull();
        const input = render(name, { ...base, name: "month" }).document.querySelector(
            "input[type=hidden]",
        );
        expect(input.getAttribute("name")).toBe("month");
        expect(input.getAttribute("value")).toBe("2");
    });

    it("uses id as the root id and the option id prefix", () => {
        const { document } = render(name, { ...base, id: "m" });
        expect(document.querySelector(".wheel-picker").id).toBe("m");
        expect(document.querySelector("[role=option]").id).toBe("m-option-0");
    });

    it("escapes labels", () => {
        const { document } = render(name, {
            ...base,
            options: [{ value: "x", label: "<b>x</b>" }],
        });
        expect(document.querySelector("[role=option]").textContent).toBe("<b>x</b>");
        expect(document.querySelector("[role=option] b")).toBeNull();
    });
});

describe("wheel-picker keys", () => {
    it("selection follows the arrows, and the hidden input with it", () => {
        const { document } = render("wheel-picker", {
            id: "w",
            label: "Fruit",
            name: "fruit",
            value: "a",
            options: [
                { value: "a", label: "Apple" },
                { value: "b", label: "Banana", disabled: true },
                { value: "c", label: "Cherry" },
            ],
        });
        autoInit(document);
        const list = document.querySelector(".wheel-picker-list");
        on(list).press("ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe("w-option-2");
        expect(document.querySelector("input").value).toBe("c");
        on(list).press("Home");
        expect(document.querySelector("input").value).toBe("a");
    });

    it("horizontal: the arrows are ArrowLeft and ArrowRight, swapped right-to-left", () => {
        const { document } = render("wheel-picker", { ...base, orientation: "horizontal" });
        const list = document.querySelector(".wheel-picker-list");
        expect(list.getAttribute("aria-orientation")).toBe("horizontal");
        autoInit(document);
        const selected = () => document.querySelector('[aria-selected="true"]').textContent;
        on(list).press("ArrowRight");
        expect(selected()).toBe("March");
        on(list).press("ArrowDown");
        expect(selected()).toBe("March");
        document.body.setAttribute("dir", "rtl");
        on(list).press("ArrowRight");
        expect(selected()).toBe("February");
    });

    it("a disabled picker's hidden input is disabled, and form reaches it", () => {
        const { document } = render("wheel-picker", {
            ...base,
            name: "month",
            disabled: true,
            form: "elsewhere",
        });
        const input = document.querySelector("input[type=hidden]");
        expect(input.disabled).toBe(true);
        expect(input.getAttribute("form")).toBe("elsewhere");
    });

    it("form reset puts back the first selection and reports it", async () => {
        const { document } = render("wheel-picker", { ...base, name: "month" });
        const form = document.createElement("form");
        form.append(document.querySelector(".wheel-picker"));
        document.body.append(form);
        autoInit(document);
        const list = document.querySelector(".wheel-picker-list");
        const changes = [];
        form.addEventListener("change", (event) => changes.push(event.detail?.value));
        on(list).press("ArrowDown");
        expect(document.querySelector("input").value).toBe("3");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 5));
        expect(document.querySelector('[aria-selected="true"]').textContent).toBe("February");
        expect(document.querySelector("input").value).toBe("2");
        expect(changes.at(-1)).toBe("2");
    });
});
