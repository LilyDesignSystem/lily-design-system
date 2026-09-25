import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TurkiyeTcKimlikNumarasiView from "./TurkiyeTcKimlikNumarasiView.svelte";

describe("TurkiyeTcKimlikNumarasiView", () => {
    test("renders with content", () => {
        render(TurkiyeTcKimlikNumarasiView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("turkiye-tc-kimlik-numarasi-view");
    });
});
