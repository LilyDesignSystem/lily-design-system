import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import RelatedContent from "./RelatedContent.svelte";

describe("RelatedContent", () => {
    test("renders the component", () => {
        render(RelatedContent, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
