// HC-I2 (spec/healthcare-ui/requirements.md): every national identifier view keeps the identifier in text only, never in an
// attribute, where a session-replay tool or an analytics script that records attributes would keep it unmasked.

import { afterEach, describe, expect, test } from "vitest";

const modules = import.meta.glob<Record<string, CustomElementConstructor>>("./*-view.ts", {
    eager: true,
});

const SENTINEL = "SENTINEL-HC-I2-0042";

const views = Object.entries(modules).map(([path, exports]) => {
    const slug = path.slice(2, -3);
    const tag = `lily-${slug}`;
    const element = Object.values(exports).find((value) => typeof value === "function");
    if (!element) throw new Error(`${path} exports no element`);
    if (!customElements.get(tag)) customElements.define(tag, element);
    return { slug, tag };
});

function attributesHold(root: Element, text: string): string[] {
    return [root, ...root.querySelectorAll("*")].flatMap((element) =>
        [...element.attributes]
            .filter((attribute) => attribute.value.includes(text))
            .map((attribute) => `${element.localName}[${attribute.name}]`),
    );
}

afterEach(() => {
    document.body.innerHTML = "";
});

describe("HC-I2: identifier views keep the identifier out of attributes", () => {
    test("there is a view for every identifier type", () => {
        expect(views.length).toBeGreaterThanOrEqual(94);
    });

    test.each(views)("$slug, given as an attribute in markup", ({ tag }) => {
        document.body.innerHTML = `<${tag} value="${SENTINEL}"></${tag}>`;
        expect(document.body.textContent).toContain(SENTINEL);
        expect(attributesHold(document.body, SENTINEL)).toEqual([]);
    });

    test.each(views)("$slug, given as a property before it is connected", ({ tag }) => {
        const host = document.createElement(tag) as HTMLElement & { value: string };
        host.value = SENTINEL;
        expect(host.hasAttribute("value")).toBe(false);
        document.body.append(host);
        expect(host.value).toBe(SENTINEL);
        expect(document.body.textContent).toContain(SENTINEL);
        expect(attributesHold(document.body, SENTINEL)).toEqual([]);
    });

    test.each(views)("$slug, given as an attribute after it is connected", ({ tag }) => {
        document.body.innerHTML = `<${tag} value="first"></${tag}>`;
        const host = document.body.firstElementChild as HTMLElement & { value: string };
        host.setAttribute("value", SENTINEL);
        expect(host.value).toBe(SENTINEL);
        expect(attributesHold(document.body, SENTINEL)).toEqual([]);
    });
});
