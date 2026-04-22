import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BannerBox from "./BannerBox.svelte";

describe("BannerBox", () => {
    test("renders the component", () => {
        render(BannerBox, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
