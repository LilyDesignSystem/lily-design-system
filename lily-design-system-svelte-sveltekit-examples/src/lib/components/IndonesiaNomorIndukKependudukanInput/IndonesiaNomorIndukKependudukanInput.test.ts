import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IndonesiaNomorIndukKependudukanInput from "./IndonesiaNomorIndukKependudukanInput.svelte";

describe("IndonesiaNomorIndukKependudukanInput", () => {
    test("renders with content", () => {
        render(IndonesiaNomorIndukKependudukanInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-input");
    });
});
