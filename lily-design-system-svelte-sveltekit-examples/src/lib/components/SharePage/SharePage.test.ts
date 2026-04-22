import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SharePage from "./SharePage.svelte";

describe("SharePage", () => {
    test("renders the component", () => {
        render(SharePage, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
