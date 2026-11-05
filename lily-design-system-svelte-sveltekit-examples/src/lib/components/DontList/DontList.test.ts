import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DontList.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DontList", () => {
    test("renders as a list", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("has no English label of its own", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list").hasAttribute("aria-label")).toBe(false);
    });

    test("accepts custom label", () => {
        render(Subject, { props: { label: "Avoid", children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Avoid");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Skip tests") } });
        expect(screen.getByRole("list").textContent).toContain("Skip tests");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "dnl", children: textSnippet("C") } });
        expect(screen.getByTestId("dnl")).toBeTruthy();
    });
});
