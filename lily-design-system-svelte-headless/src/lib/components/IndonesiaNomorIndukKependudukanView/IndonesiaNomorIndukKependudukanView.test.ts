import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import IndonesiaNomorIndukKependudukanView from "./IndonesiaNomorIndukKependudukanView.svelte";

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders with content", () => {
        render(IndonesiaNomorIndukKependudukanView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-view");
    });
});
