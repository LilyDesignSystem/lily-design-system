import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TurkiyeTcKimlikNumarasiInput from "./TurkiyeTcKimlikNumarasiInput.svelte";

describe("TurkiyeTcKimlikNumarasiInput", () => {
    test("renders with content", () => {
        render(TurkiyeTcKimlikNumarasiInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("turkiye-tc-kimlik-numarasi-input");
    });
});
