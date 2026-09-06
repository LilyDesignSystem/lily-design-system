// P8-style gate: theme-select-option is an "upgrade in place" component
// (see its own file for why) — the rendered tree must be a pure
// <select> > <option> structure with no custom-element host between
// them, matching the same shape BreadcrumbListItem's tests assert for
// <ol> > <li>.
//
// Test-construction note, a real finding worth recording: unlike <ol>,
// <select> has its own HTML-parsing "in select" insertion mode that
// DROPS any child start tag other than option/optgroup/hr/script/
// template — including an unrecognized custom-element tag — before it
// is ever inserted into the tree. So `document.body.innerHTML =
// "<select><lily-theme-select-option>…</lily-theme-select-option></select>"`
// (the pattern used everywhere else in this catalog) never even
// constructs the custom element: connectedCallback never fires, and the
// upgrade-in-place code under test never runs. This is exactly why the
// real ThemeSelect component builds its <select> via `createElement` +
// `appendChild` rather than assigning to a literal `<select>…</select>`
// innerHTML string — DOM-API insertion has no such parser-level content
// filtering, only the HTML tokenizer does. These tests therefore build
// the same shape the production code actually produces: createElement
// the <select>, createElement + configure the custom element, and
// appendChild it in — never a literal `<select>` in an innerHTML string.
import { afterEach, describe, expect, test } from "vitest";

import { ThemeSelectOption } from "./theme-select-option.js";

if (!customElements.get("lily-theme-select-option")) {
    customElements.define("lily-theme-select-option", ThemeSelectOption);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function renderOption(attrs: Record<string, string> = {}, text = "Dark"): HTMLSelectElement {
    const select = document.createElement("select");
    const host = document.createElement("lily-theme-select-option");
    for (const [key, value] of Object.entries(attrs)) host.setAttribute(key, value);
    host.textContent = text;
    select.appendChild(host);
    document.body.appendChild(select);
    return select;
}

describe("ThemeSelectOption (upgrade in place)", () => {
    test("replaces its own host: no <lily-theme-select-option> remains in the DOM", () => {
        renderOption({ value: "light" }, "Light");

        expect(document.querySelector("lily-theme-select-option")).toBeNull();
        expect(document.querySelector("option.theme-select-option")).toBeTruthy();
    });

    test("the <select>'s direct children are all <option> — no wrapper host between them", () => {
        const select = document.createElement("select");
        const light = document.createElement("lily-theme-select-option");
        light.setAttribute("value", "light");
        light.textContent = "Light";
        const dark = document.createElement("lily-theme-select-option");
        dark.setAttribute("value", "dark");
        dark.textContent = "Dark";
        select.appendChild(light);
        select.appendChild(dark);
        document.body.appendChild(select);

        const tags = Array.from(select.children).map((el) => el.tagName);
        expect(tags).toEqual(["OPTION", "OPTION"]);
    });

    test("sets the option's value from the value attribute", () => {
        const select = renderOption({ value: "dark" });

        expect((select.querySelector("option") as HTMLOptionElement).value).toBe("dark");
    });

    test("moves the host's children (display text) into the option", () => {
        const select = renderOption({ value: "dark" }, "Dark");

        expect(select.querySelector("option")!.textContent).toBe("Dark");
    });

    test("disabled propagates to the option", () => {
        const select = renderOption({ value: "dark", disabled: "" });

        expect((select.querySelector("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const select = renderOption({ value: "dark", class: "extra" });

        expect(select.querySelector("option")!.className).toBe("theme-select-option extra");
    });

    test("passes through rest attributes to the option", () => {
        const select = renderOption({ value: "dark", "data-testid": "dark-opt" });

        expect(select.querySelector("option")!.getAttribute("data-testid")).toBe("dark-opt");
    });
});
