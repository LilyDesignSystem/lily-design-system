import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("pin-input-div", () => {
    it("renders a group of single-digit inputs", () => {
        const { document } = render("pin-input-div", {
            id: "pin",
            label: "Verification code",
            length: 4,
        });
        const wrap = document.querySelector("div.pin-input-div");
        expect(wrap).toBeTruthy();
        expect(wrap.getAttribute("role")).toBe("group");
        expect(wrap.getAttribute("aria-label")).toBe("Verification code");
        expect(wrap.getAttribute("data-pin-length")).toBe("4");
        expect(wrap.querySelectorAll("input").length).toBe(4);
    });

    it("defaults to 6 inputs", () => {
        const { document } = render("pin-input-div", { id: "pin" });
        expect(document.querySelectorAll("input").length).toBe(6);
    });

    it("pre-fills inputs from value", () => {
        const { document } = render("pin-input-div", {
            id: "pin",
            length: 4,
            value: "12",
        });
        const inputs = document.querySelectorAll("input");
        expect(inputs[0].getAttribute("value")).toBe("1");
        expect(inputs[1].getAttribute("value")).toBe("2");
        expect(inputs[2].getAttribute("value")).toBe("");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("pin-input-div", { id: "pin" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("without digitLabel, names each input by the group's label — no English default", () => {
        const { document } = render("pin-input-div", { id: "pin", label: "Código", length: 2 });
        const labels = [...document.querySelectorAll("input")].map((input) =>
            input.getAttribute("aria-label"),
        );
        expect(labels).toEqual(["Código", "Código"]);
    });

    it("digitLabel fills in {position} and {length}", () => {
        const { document } = render("pin-input-div", {
            id: "pin",
            label: "PIN",
            length: 4,
            digitLabel: "Digit {position} of {length}",
        });
        const inputs = document.querySelectorAll("input");
        expect(inputs[0].getAttribute("aria-label")).toBe("Digit 1 of 4");
        expect(inputs[3].getAttribute("aria-label")).toBe("Digit 4 of 4");
    });
});

describe("pin-input-div keys", () => {
    it("moves with the arrows and clears with Backspace", () => {
        const { document } = render("pin-input-div", { label: "Code", length: 3 });
        autoInit(document);
        const [one, two] = document.querySelectorAll("input");
        on(one).press("ArrowRight");
        expect(document.activeElement).toBe(two);
        on(two).press("ArrowLeft");
        expect(document.activeElement).toBe(one);
        one.value = "7";
        on(one).press("Backspace");
        expect(one.value).toBe("");
        on(two).press("Backspace");
        expect(document.activeElement).toBe(one);
    });
});
