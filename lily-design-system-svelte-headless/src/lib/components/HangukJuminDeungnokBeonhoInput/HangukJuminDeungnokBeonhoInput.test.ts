import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import HangukJuminDeungnokBeonhoInput from "./HangukJuminDeungnokBeonhoInput.svelte";

describe("HangukJuminDeungnokBeonhoInput", () => {
    test("renders with content", () => {
        render(HangukJuminDeungnokBeonhoInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-input");
    });
});
