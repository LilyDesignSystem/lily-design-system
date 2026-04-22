import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BackLink from "./BackLink.svelte";

describe("BackLink", () => {
    test("renders the component", () => {
        render(BackLink, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
