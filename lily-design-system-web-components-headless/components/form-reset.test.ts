// P10-T9: form-reset audit. A form reset restores an input to its *default*
// (the `value` content attribute), not to the property a script set. Every
// element that builds a native text-like control from its `value` attribute
// must set the control's defaultValue, or a reset blanks the initial value.
import { afterEach, describe, expect, test } from "vitest";

const modules = import.meta.glob(["./*.ts", "!./*.test.ts", "!./*.stories.ts"], {
    eager: true,
}) as Record<string, Record<string, unknown>>;

const FIELD =
    "input:not([type=hidden]):not([type=file]):not([type=button]):not([type=submit]):not([type=reset]):not([type=image]):not([type=checkbox]):not([type=radio]), textarea";
const INITIAL: Record<string, string> = {
    number: "5",
    range: "5",
    date: "2020-01-01",
    color: "#123456",
    time: "10:00",
    month: "2020-01",
    week: "2020-W01",
    email: "a@b.co",
    url: "http://a.b",
    "datetime-local": "2020-01-01T10:00",
    tel: "123",
    search: "init",
    password: "init",
    text: "init",
    textarea: "init",
};
const CHANGED: Record<string, string> = {
    number: "7",
    range: "9",
    date: "2021-01-01",
    color: "#654321",
    time: "11:00",
    month: "2021-01",
    week: "2021-W02",
    email: "c@d.co",
    url: "http://c.d",
    "datetime-local": "2021-01-01T10:00",
    tel: "999",
    search: "chg",
    password: "chg",
    text: "chg",
    textarea: "chg",
};
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

afterEach(() => {
    document.body.innerHTML = "";
});

function tagFor(path: string): string | null {
    const slug = path.slice(2, -".ts".length);
    const mod = modules[path];
    const pascal = slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
    const ctor = mod[pascal] as CustomElementConstructor | undefined;
    if (!ctor) return null;
    const tag = `lily-${kebab(pascal)}`;
    if (!customElements.get(tag)) customElements.define(tag, ctor);
    return tag;
}

function mount(tag: string, attributes: string): HTMLFormElement {
    document.body.innerHTML = `<form><${tag} label="x" ${attributes}></${tag}></form>`;
    return document.querySelector("form")!;
}

describe("every element that builds a text-like control from its value attribute", () => {
    for (const path of Object.keys(modules)) {
        const tag = tagFor(path);
        // chat-composer renders its own <form>, so the harness form never reaches its textarea.
        if (!tag || tag === "lily-chat-composer") continue;
        test(`${tag} keeps its initial value through a form reset`, async () => {
            let form: HTMLFormElement;
            try {
                form = mount(tag, "");
            } catch {
                return;
            }
            const probe = form.querySelector<HTMLInputElement>(FIELD);
            const kind = probe?.tagName === "TEXTAREA" ? "textarea" : probe?.type;
            if (!probe || !kind || INITIAL[kind] === undefined) return;

            form = mount(tag, `value="${INITIAL[kind]}"`);
            const field = form.querySelector<HTMLInputElement>(FIELD)!;
            // Only elements that take their initial value from the attribute are in scope.
            if (field.value !== INITIAL[kind]) return;

            field.value = CHANGED[kind];
            const cancel = (event: Event) => event.preventDefault();
            form.addEventListener("reset", cancel);
            form.reset();
            await tick();
            form.removeEventListener("reset", cancel);
            expect(field.value).toBe(CHANGED[kind]);

            form.reset();
            await tick();
            expect(field.value).toBe(INITIAL[kind]);
        });
    }
});

describe("other controls", () => {
    test("checkbox-input restores its initial checked state", async () => {
        await import("./checkbox-input.js").then(({ CheckboxInput }) => {
            if (!customElements.get("lily-checkbox-input"))
                customElements.define("lily-checkbox-input", CheckboxInput);
        });
        const form = mount("lily-checkbox-input", "checked");
        const box = form.querySelector<HTMLInputElement>("input")!;
        expect(box.checked).toBe(true);
        box.checked = false;
        form.reset();
        await tick();
        expect(box.checked).toBe(true);
    });

    test("select restores its initial option", async () => {
        const { Select } = await import("./select.js");
        if (!customElements.get("lily-select")) customElements.define("lily-select", Select);
        document.body.innerHTML =
            '<form><lily-select label="x" value="b"><option value="a">a</option><option value="b">b</option><option value="c">c</option></lily-select></form>';
        const form = document.querySelector("form")!;
        const select = form.querySelector("select")!;
        expect(select.value).toBe("b");
        select.value = "c";
        form.reset();
        await tick();
        expect(select.value).toBe("b");
    });

    test("accordion-checkbox closes its panel again", async () => {
        const { AccordionCheckbox } = await import("./accordion-checkbox.js");
        if (!customElements.get("lily-accordion-checkbox"))
            customElements.define("lily-accordion-checkbox", AccordionCheckbox);
        const form = mount("lily-accordion-checkbox", "");
        const host = form.querySelector("lily-accordion-checkbox")!;
        const input = host.querySelector<HTMLInputElement>("input")!;
        const panel = host.querySelector<HTMLElement>(".accordion-checkbox-panel")!;
        input.click();
        expect([host.hasAttribute("checked"), panel.hidden]).toEqual([true, false]);
        const cancel = (event: Event) => event.preventDefault();
        form.addEventListener("reset", cancel);
        form.reset();
        await tick();
        form.removeEventListener("reset", cancel);
        expect([host.hasAttribute("checked"), panel.hidden]).toEqual([true, false]);
        form.reset();
        await tick();
        expect([
            host.hasAttribute("checked"),
            input.checked,
            input.getAttribute("aria-expanded"),
            panel.hidden,
        ]).toEqual([false, false, "false", true]);
    });
});
