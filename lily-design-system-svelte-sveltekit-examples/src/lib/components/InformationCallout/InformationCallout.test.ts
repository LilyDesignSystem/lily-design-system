import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import InformationCallout from "./InformationCallout.svelte";

describe("InformationCallout", () => {
    test("renders the component", () => {
        render(InformationCallout, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
