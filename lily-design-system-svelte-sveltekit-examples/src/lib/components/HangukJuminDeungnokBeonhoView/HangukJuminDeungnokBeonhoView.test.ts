import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import HangukJuminDeungnokBeonhoView from "./HangukJuminDeungnokBeonhoView.svelte";

describe("HangukJuminDeungnokBeonhoView", () => {
    test("renders with content", () => {
        render(HangukJuminDeungnokBeonhoView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-view");
    });
});
