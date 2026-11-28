import { afterEach, describe, expect, test } from "vitest";

import { MultiSelectWithExtras } from "./multi-select-with-extras.js";

if (!customElements.get("lily-multi-select-with-extras")) {
    customElements.define("lily-multi-select-with-extras", MultiSelectWithExtras);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const OPTIONS =
    '<option value="a">A</option><option value="b">B</option><option value="c">C</option>';

describe("MultiSelectWithExtras", () => {
    test("wrapper carries the base class; select is multiple", () => {
        const host = render(
            `<lily-multi-select-with-extras label="Tags">${OPTIONS}</lily-multi-select-with-extras>`,
        );
        expect(host.classList.contains("multi-select-with-extras")).toBe(true);
        expect(host.querySelector("select")!.multiple).toBe(true);
    });

    test("aria-label is on the select, not the wrapper", () => {
        const host = render(
            `<lily-multi-select-with-extras label="Tags">${OPTIONS}</lily-multi-select-with-extras>`,
        );
        expect(host.querySelector("select")!.getAttribute("aria-label")).toBe("Tags");
        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("renders before and after content around the select in order", () => {
        const host = render(
            `<lily-multi-select-with-extras label="Tags"><span slot="after">AFTER</span><span slot="before">BEFORE</span>${OPTIONS}</lily-multi-select-with-extras>`,
        );
        const kids = Array.from(host.children).map((c) => c.tagName);
        expect(kids).toEqual(["SPAN", "SELECT", "SPAN"]);
        expect(host.children[0].textContent).toBe("BEFORE");
        expect(host.children[2].textContent).toBe("AFTER");
    });

    test("initial array value selects options; multiple can be selected", () => {
        const host = render(
            `<lily-multi-select-with-extras label="Tags" value='["a","b"]'>${OPTIONS}</lily-multi-select-with-extras>`,
        ) as unknown as MultiSelectWithExtras;
        expect(host.value).toEqual(["a", "b"]);
        host.value = ["b", "c"];
        expect(host.value).toEqual(["b", "c"]);
    });

    test("size, required and disabled reach the select", () => {
        const select = render(
            `<lily-multi-select-with-extras label="Tags" size="3" required disabled>${OPTIONS}</lily-multi-select-with-extras>`,
        ).querySelector("select")!;
        expect(select.size).toBe(3);
        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
    });

    test("rest attributes stay on the wrapper; consumer class joins it", () => {
        const host = render(
            `<lily-multi-select-with-extras label="Tags" data-testid="x" class="extra">${OPTIONS}</lily-multi-select-with-extras>`,
        );
        expect(host.getAttribute("data-testid")).toBe("x");
        expect(host.className).toBe("multi-select-with-extras extra");
        expect(host.querySelector("select")!.hasAttribute("data-testid")).toBe(false);
    });
});

describe("multi-select-with-extras follows its attributes (P50-T28)", () => {
    test("shows a change to label, size, required, disabled and class", () => {
        const host = render(
            '<lily-multi-select-with-extras label="Old"><option value="a">A</option><option value="b">B</option><option value="c">C</option></lily-multi-select-with-extras>',
        );
        host.setAttribute("label", "New");
        host.setAttribute("size", "3");
        host.setAttribute("required", "");
        host.setAttribute("disabled", "");
        host.setAttribute("class", "wide");
        const select = host.querySelector("select") as HTMLSelectElement;
        expect(select.getAttribute("aria-label")).toBe("New");
        expect(select.getAttribute("size")).toBe("3");
        expect(select.required).toBe(true);
        expect(select.disabled).toBe(true);
        expect(host.className).toBe("multi-select-with-extras wide");
        host.removeAttribute("disabled");
        expect(select.disabled).toBe(false);
    });

    test("a new value is the default choice, as a form reset restores it", () => {
        const form = document.createElement("form");
        document.body.replaceChildren(form);
        form.innerHTML =
            '<lily-multi-select-with-extras value="a"><option value="a">A</option><option value="b">B</option><option value="c">C</option></lily-multi-select-with-extras>';
        const host = form.firstElementChild as HTMLElement;
        const select = host.querySelector("select") as HTMLSelectElement;
        host.setAttribute("value", '["b","c"]');
        expect(
            Array.from(select.options)
                .filter((o) => o.defaultSelected)
                .map((o) => o.value),
        ).toEqual(["b", "c"]);
        form.reset();
        expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual(["b", "c"]);
    });
});
