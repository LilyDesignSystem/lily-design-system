// HC-I2 (spec/healthcare-ui/requirements.md): every national identifier view keeps the identifier in text only, never in an
// attribute, where a session-replay tool or an analytics script that records attributes would keep it unmasked.

import { render } from "@testing-library/svelte";
import type { Component } from "svelte";
import { describe, expect, test } from "vitest";

const modules = import.meta.glob<{ default: Component<Record<string, unknown>> }>(
    "./*View/*View.svelte",
    { eager: true },
);

const SENTINEL = "SENTINEL-HC-I2-0042";

const views = Object.entries(modules).map(([path, module]) => ({
    name: path.split("/")[1],
    component: module.default,
}));

describe("HC-I2: identifier views keep the identifier out of attributes", () => {
    test("there is a view for every identifier type", () => {
        expect(views.length).toBeGreaterThanOrEqual(94);
    });

    test.each(views)("$name", ({ component }) => {
        const { container } = render(component, {
            props: { label: "Identifier", value: SENTINEL },
        });
        expect(container.textContent).toContain(SENTINEL);
        const holding = [...container.querySelectorAll("*")].flatMap((element) =>
            [...element.attributes]
                .filter((attribute) => attribute.value.includes(SENTINEL))
                .map((attribute) => `${element.localName}[${attribute.name}]`),
        );
        expect(holding).toEqual([]);
    });
});
