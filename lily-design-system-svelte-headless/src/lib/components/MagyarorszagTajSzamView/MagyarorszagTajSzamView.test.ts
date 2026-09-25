import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MagyarorszagTajSzamView from "./MagyarorszagTajSzamView.svelte";

describe("MagyarorszagTajSzamView", () => {
    test("renders with content", () => {
        render(MagyarorszagTajSzamView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("magyarorszag-taj-szam-view");
    });
});
