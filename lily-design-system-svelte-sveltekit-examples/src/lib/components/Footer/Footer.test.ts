import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Footer from "./Footer.svelte";

describe("Footer", () => {
    test("renders the component", () => {
        render(Footer, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
