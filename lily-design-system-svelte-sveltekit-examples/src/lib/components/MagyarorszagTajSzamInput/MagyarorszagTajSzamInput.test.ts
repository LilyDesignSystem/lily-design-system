import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MagyarorszagTajSzamInput from "./MagyarorszagTajSzamInput.svelte";

describe("MagyarorszagTajSzamInput", () => {
    test("renders with content", () => {
        render(MagyarorszagTajSzamInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-input");
    });
});
