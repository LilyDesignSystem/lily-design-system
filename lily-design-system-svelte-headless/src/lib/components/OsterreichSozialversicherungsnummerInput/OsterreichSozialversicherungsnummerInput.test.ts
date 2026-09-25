import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import OsterreichSozialversicherungsnummerInput from "./OsterreichSozialversicherungsnummerInput.svelte";

describe("OsterreichSozialversicherungsnummerInput", () => {
    test("renders with content", () => {
        render(OsterreichSozialversicherungsnummerInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-input");
    });
});
