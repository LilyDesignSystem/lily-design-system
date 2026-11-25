// HC-I3 (spec/healthcare-ui/requirements.md): every national identifier input keeps what it holds out of every attribute, where
// a session-replay tool or an analytics script that records attributes would keep it unmasked, and a form still submits it and
// resets to its starting value.

import { afterEach, describe, expect, test } from "vitest";

const modules = import.meta.glob<Record<string, CustomElementConstructor>>("./*-input.ts", {
    eager: true,
});

const SENTINEL = "SENTINEL-HC-I3-0042";

const inputs = Object.entries(modules).map(([path, exports]) => {
    const tag = `lily-${path.slice(2, -3)}`;
    const element = Object.values(exports).find((value) => typeof value === "function");
    if (!element) throw new Error(`${path} exports no element`);
    if (!customElements.get(tag)) customElements.define(tag, element);
    return { tag };
});

type Host = HTMLElement & { value: string };

const holding = (): string[] =>
    [...document.querySelectorAll("*")].flatMap((element) =>
        [...element.attributes]
            .filter((attribute) => attribute.value.includes(SENTINEL))
            .map((attribute) => `${element.localName}[${attribute.name}]`),
    );
const control = () => document.querySelector("input") as HTMLInputElement;
const settle = () => new Promise((resolve) => setTimeout(resolve, 5));

afterEach(() => {
    document.body.innerHTML = "";
});

describe("HC-I3: identifier inputs keep the identifier out of attributes", () => {
    test("there is an input for every identifier type", () => {
        expect(inputs.length).toBeGreaterThanOrEqual(94);
    });

    test.each(inputs)(
        "$tag: from markup, a property, an attribute set later, and typing",
        ({ tag }) => {
            document.body.innerHTML = `<${tag} value="${SENTINEL}"></${tag}>`;
            expect(control().value).toBe(SENTINEL);
            expect(holding()).toEqual([]);

            document.body.innerHTML = "";
            const host = document.createElement(tag) as Host;
            host.value = SENTINEL;
            expect(host.value).toBe(SENTINEL);
            document.body.append(host);
            expect(control().value).toBe(SENTINEL);
            expect(holding()).toEqual([]);

            host.value = "";
            host.setAttribute("value", SENTINEL);
            expect(host.value).toBe(SENTINEL);
            expect(holding()).toEqual([]);

            control().value = `${SENTINEL}-typed`;
            expect(host.value).toBe(`${SENTINEL}-typed`);
            expect(holding()).toEqual([]);
        },
    );

    test.each(inputs)(
        "$tag: a form submits it, and a reset restores the starting value",
        async ({ tag }) => {
            document.body.innerHTML = `<form><${tag} name="id" value="${SENTINEL}"></${tag}></form>`;
            const form = document.querySelector("form") as HTMLFormElement;
            expect(new FormData(form).get("id")).toBe(SENTINEL);
            control().value = "changed";
            form.reset();
            await settle();
            expect(control().value).toBe(SENTINEL);
            expect(holding()).toEqual([]);
        },
    );
});

describe("PrivateValue", () => {
    const { tag } = inputs[0];

    test("a cancelled reset changes nothing", async () => {
        document.body.innerHTML = `<form><${tag} value="first"></${tag}></form>`;
        const form = document.querySelector("form") as HTMLFormElement;
        form.addEventListener("reset", (event) => event.preventDefault());
        control().value = "kept";
        form.reset();
        await settle();
        expect(control().value).toBe("kept");
    });

    test("another form's reset changes nothing", async () => {
        document.body.innerHTML = `<form id="a"><${tag} value="first"></${tag}></form><form id="b"></form>`;
        control().value = "kept";
        (document.querySelector("#b") as HTMLFormElement).reset();
        await settle();
        expect(control().value).toBe("kept");
    });

    test("moved to another form, it follows that form's reset, and removed, none", async () => {
        document.body.innerHTML = `<form id="a"><${tag} value="first"></${tag}></form><form id="b"></form>`;
        const host = document.querySelector(tag) as Host;
        const b = document.querySelector("#b") as HTMLFormElement;
        b.append(host);
        host.value = "changed";
        b.reset();
        await settle();
        expect(host.value).toBe("first");
        host.value = "changed";
        host.remove();
        b.reset();
        await settle();
        expect(host.value).toBe("changed");
    });

    test("an attribute set later is the new starting value; removing it changes nothing", async () => {
        document.body.innerHTML = `<form><${tag} value="first"></${tag}></form>`;
        const host = document.querySelector(tag) as Host;
        host.setAttribute("value", "second");
        host.removeAttribute("value");
        expect(host.value).toBe("second");
        host.value = "changed";
        (document.querySelector("form") as HTMLFormElement).reset();
        await settle();
        expect(host.value).toBe("second");
    });

    test("before it is connected, the attribute is its value", () => {
        const host = document.createElement(tag) as Host;
        host.setAttribute("value", "first");
        expect(host.value).toBe("first");
        expect((document.createElement(tag) as Host).value).toBe("");
    });
});
