import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import OsterreichSozialversicherungsnummerView from "./OsterreichSozialversicherungsnummerView.svelte";

describe("OsterreichSozialversicherungsnummerView", () => {
    test("renders with content", () => {
        render(OsterreichSozialversicherungsnummerView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("osterreich-sozialversicherungsnummer-view");
    });
});
