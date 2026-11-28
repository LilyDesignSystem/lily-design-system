import { afterEach, describe, expect, test } from "vitest";

import { SelectWithExtras } from "./select-with-extras.js";

if (!customElements.get("lily-select-with-extras")) {
    customElements.define("lily-select-with-extras", SelectWithExtras);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const OPTIONS = '<option value="us">USA</option><option value="uk">United Kingdom</option>';

describe("SelectWithExtras", () => {
    test("carries the base class on the wrapper", () => {
        const host = render(
            `<lily-select-with-extras label="Country">${OPTIONS}</lily-select-with-extras>`,
        );

        expect(host.classList.contains("select-with-extras")).toBe(true);
    });

    test("renders a native select with the option children moved in", () => {
        const host = render(
            `<lily-select-with-extras label="Country">${OPTIONS}</lily-select-with-extras>`,
        );

        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select).not.toBeNull();
        expect(select.options.length).toBe(2);
    });

    test("uses label as the accessible name on the select", () => {
        const host = render(
            `<lily-select-with-extras label="Country">${OPTIONS}</lily-select-with-extras>`,
        );

        expect(host.querySelector("select")!.getAttribute("aria-label")).toBe("Country");
    });

    test("supports required and disabled", () => {
        const host = render(
            `<lily-select-with-extras label="Country" required disabled>${OPTIONS}</lily-select-with-extras>`,
        );

        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render(
            `<lily-select-with-extras label="Country" value="uk">${OPTIONS}</lily-select-with-extras>`,
        ) as unknown as SelectWithExtras;

        expect(host.value).toBe("uk");

        host.value = "us";
        expect(host.value).toBe("us");
        expect((host.querySelector("select") as HTMLSelectElement).value).toBe("us");
    });

    test("moves slot=before content before the select", () => {
        const host = render(
            `<lily-select-with-extras label="Country"><span slot="before">Flag:</span>${OPTIONS}</lily-select-with-extras>`,
        );

        const children = Array.from(host.children);
        expect(children[0].tagName).toBe("SPAN");
        expect(children[1].tagName).toBe("SELECT");
    });

    test("moves slot=after content after the select", () => {
        const host = render(
            `<lily-select-with-extras label="Country">${OPTIONS}<span slot="after">selected</span></lily-select-with-extras>`,
        );

        const children = Array.from(host.children);
        expect(children[children.length - 1].tagName).toBe("SPAN");
    });
});

describe("select-with-extras follows its attributes (P50-T28)", () => {
    test("shows a change to label, required, disabled and class", () => {
        const host = render(
            '<lily-select-with-extras label="Old"><option value="a">A</option><option value="b">B</option><option value="c">C</option></lily-select-with-extras>',
        );
        host.setAttribute("label", "New");

        host.setAttribute("required", "");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select.getAttribute("aria-label")).toBe("New");

        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
        expect(host.className).toBe("select-with-extras wide");
        host.removeAttribute("disabled");
        expect(select.disabled).toBe(false);
    });

    test("a new value is the default choice, as a form reset restores it", () => {
        const form = document.createElement("form");
        document.body.replaceChildren(form);
        form.innerHTML =
            '<lily-select-with-extras value="a"><option value="a">A</option><option value="b">B</option><option value="c">C</option></lily-select-with-extras>';
        const host = form.firstElementChild as HTMLElement;
        const select = host.querySelector("select") as HTMLSelectElement;
        host.setAttribute("value", "b");
        expect(
            Array.from(select.options)
                .filter((o) => o.defaultSelected)
                .map((o) => o.value),
        ).toEqual(["b"]);
        form.reset();
        expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["b"]);
    });
});
