import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Separator from "./Separator.svelte";

describe("Separator", () => {
    test("renders the component", () => {
        render(Separator, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
