import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Popup from "./Popup.svelte";

describe("Popup", () => {
    test("renders the component", () => {
        render(Popup, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
